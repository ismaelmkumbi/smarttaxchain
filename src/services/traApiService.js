// src/services/traApiService.js
import api from './api';

// Base configuration
const API_CONFIG = {
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://api.tra.gov.tz/api'
      : 'http://localhost:3000/api',
  timeout: 30000,
  retryAttempts: 3,
};

// Error formatter with blockchain context
const formatError = (error) => ({
  message: error.message || 'Unknown error',
  context: error.context || 'Unknown context',
  success: false,
  blockchainTxId: error.blockchainTxId || null,
  timestamp: new Date().toISOString(),
});

// Retry mechanism for blockchain operations
const retryOperation = async (operation, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// TRA API Service Class
class TRA_API {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  // Generic request method with blockchain integration
  async request(endpoint, options = {}) {
    // Build endpoint - baseURL in API_CONFIG already includes /api
    // api.js has baseURL: 'http://localhost:3000/', so we need full path
    const fullEndpoint = endpoint.startsWith('http')
      ? endpoint
      : endpoint.startsWith('/api/')
      ? endpoint
      : `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    const config = {
      method: options.method || 'GET',
      url: fullEndpoint,
      headers: {
        'Content-Type': 'application/json',
        'X-TRA-Version': '2.0.0',
        'X-Blockchain-Enabled': 'true',
        ...options.headers,
      },
      timeout: this.timeout,
      responseType: options.responseType || 'json',
      // Axios uses 'data' for request body
      data:
        options.data ||
        (options.body
          ? typeof options.body === 'string'
            ? JSON.parse(options.body)
            : options.body
          : undefined),
    };

    // For blob responses, don't set Content-Type
    if (options.responseType === 'blob') {
      delete config.headers['Content-Type'];
    }

    // Debug: Log request config
    if (config.method === 'POST' || config.method === 'PUT') {
      console.log('API Request Config:', {
        method: config.method,
        url: config.url,
        hasData: !!config.data,
        dataSize: config.data ? JSON.stringify(config.data).length : 0,
        dataPreview: config.data ? JSON.stringify(config.data).substring(0, 200) : 'No data',
      });
    }

    try {
      const response = await retryOperation(() => api.request(config));
      // api.js response interceptor already returns response.data
      return {
        ...response,
        blockchainTxId: response?.blockchainTxId || null,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Extract error message properly
      let errorMessage = 'Unknown error';
      let errorDetails = null;

      if (error.response?.data) {
        const errorData = error.response.data;
        // Handle nested error structure
        if (errorData.error) {
          errorMessage = errorData.error.message || errorData.error.code || 'Request failed';
          errorDetails = errorData.error.details;
        } else if (errorData.message) {
          // If message is an object, extract from it
          if (typeof errorData.message === 'object') {
            errorMessage = errorData.message.message || errorData.message.code || 'Request failed';
            errorDetails = errorData.message.details;
          } else {
            errorMessage = errorData.message;
          }
        } else if (errorData.code) {
          errorMessage = errorData.code;
          errorDetails = errorData.details;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Create a proper Error object with a string message
      const errorObj = new Error(errorMessage);
      errorObj.context = endpoint;
      errorObj.details = errorDetails;
      errorObj.code = error.response?.data?.error?.code || error.response?.data?.code;
      errorObj.response = error.response;

      console.error(`TRA API Error (${endpoint}):`, {
        message: errorMessage,
        details: errorDetails,
        code: errorObj.code,
        context: endpoint,
      });

      throw errorObj;
    }
  }

  // ==================== TAXPAYER MANAGEMENT ====================

  // Register new taxpayer with blockchain verification
  async registerTaxpayer(data) {
    // Validate TIN format before sending (must be exactly 9 digits)
    if (data.tin) {
      const tinDigitsOnly = data.tin.replace(/\D/g, '');
      if (!/^\d{9}$/.test(tinDigitsOnly)) {
        const error = new Error('TIN must be exactly 9 digits');
        error.code = 'INVALID_TIN_FORMAT';
        error.details = `Provided TIN "${data.tin}" does not match required format (9 digits)`;
        throw error;
      }
      // Ensure TIN is clean (digits only)
      data.tin = tinDigitsOnly;
    }

    // Build payload matching backend API specification
    // Note: Backend will handle blockchain registration internally
    const payload = {
      name: data.name,
      nin: data.nin || null,
      tin: data.tin, // Already validated and cleaned above
      type: data.type,
      businessCategory: data.businessCategory,
      registrationAddress: data.registrationAddress,
      contactEmail: data.contactEmail,
      phoneNumber: data.phoneNumber,
      authorizedSignatories: data.authorizedSignatories || [],
      nidaVerification: data.nidaVerification || null,
      tinVerification: data.tinVerification || null,
      // Note: blockchainRegistration is NOT sent - backend handles it
      complianceScore: data.complianceScore || 100,
      registrationDate: data.registrationDate || new Date().toISOString(),
      registrationType: data.registrationType || 'nin',
    };

    // Remove null values for cleaner payload
    Object.keys(payload).forEach((key) => {
      if (payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });

    // Debug: Log payload being sent
    console.log('Registering taxpayer with payload:', JSON.stringify(payload, null, 2));
    console.log('TIN validation:', {
      original: data.tin,
      formatted: payload.tin,
      isValid: /^\d{9}$/.test(payload.tin),
    });

    return this.request('/taxpayers/register', {
      method: 'POST',
      data: payload,
    });
  }

  // Get all taxpayers with compliance scoring
  async getAllTaxpayers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    // Only add query string if there are actual parameters
    const endpoint = queryParams ? `/taxpayers?${queryParams}` : '/taxpayers';
    const response = await this.request(endpoint);
    // Server returns { success: true, data: { taxpayers: [...] } }
    // Transform to match expected format
    return {
      ...response,
      taxpayers: response.data?.taxpayers || response.taxpayers || [],
    };
  }

  // Get taxpayer by ID with full details
  async getTaxpayerById(id) {
    return this.request(`/taxpayers/${id}`);
  }

  // Update taxpayer with audit trail
  async updateTaxpayer(id, updates) {
    return this.request(`/taxpayers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ updates, auditTrail: true }),
    });
  }

  // Delete taxpayer with blockchain record
  async deleteTaxpayer(id) {
    return this.request(`/taxpayers/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== VAT MANAGEMENT ====================

  // Record VAT transaction with automatic calculation
  async recordVATTransaction(data) {
    const payload = {
      taxpayerId: data.taxpayerId,
      transactionId: data.transactionId || `VAT-${Date.now()}`,
      amount: data.amount,
      vatRate: data.vatRate || 18,
      transactionType: data.transactionType,
      description: data.description,
      invoiceNumber: data.invoiceNumber,
      transactionDate: data.transactionDate || new Date().toISOString(),
      efdIntegration: true,
      automaticCalculation: true,
    };

    return this.request('/vat/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Get VAT transactions with filtering
  async getVATTransactions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/vat/transactions?${queryParams}`);
  }

  // Generate comprehensive VAT report
  async generateVATReport(taxpayerId, period = 'monthly', year = new Date().getFullYear()) {
    return this.request(`/vat/reports/${taxpayerId}?period=${period}&year=${year}`);
  }

  // Calculate VAT with smart rules
  async calculateVAT(data) {
    return this.request('/vat/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== COMPLIANCE MANAGEMENT ====================

  // Get compliance dashboard with real-time data
  async getComplianceDashboard(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);
    if (filters.region) queryParams.append('region', filters.region);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/compliance/dashboard?${queryString}` : '/compliance/dashboard';
    return this.request(endpoint);
  }

  // Get compliance score with detailed analysis (by TIN)
  async getComplianceScore(taxpayerId) {
    // Try both endpoints for backward compatibility
    try {
      return this.request(`/compliance/taxpayer/${taxpayerId}/score`);
    } catch (error) {
      // Fallback to alternative endpoint
      return this.request(`/compliance/score/${taxpayerId}`);
    }
  }

  // Get compliance score by TIN (explicit)
  async getComplianceScoreByTin(tin) {
    return this.request(`/compliance/taxpayer/${tin}/score`);
  }

  // Get all taxpayers with compliance data
  async getComplianceTaxpayers(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.riskLevel) queryParams.append('riskLevel', filters.riskLevel);
    if (filters.minScore) queryParams.append('minScore', filters.minScore.toString());
    if (filters.maxScore) queryParams.append('maxScore', filters.maxScore.toString());
    if (filters.region) queryParams.append('region', filters.region);
    if (filters.lastAuditFrom) queryParams.append('lastAuditFrom', filters.lastAuditFrom);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/compliance/taxpayers?${queryString}` : '/compliance/taxpayers';
    return this.request(endpoint);
  }

  // Schedule audit with blockchain verification
  async scheduleAudit(data) {
    const payload = {
      taxpayerId: data.taxpayerId,
      auditType: data.auditType,
      scheduledDate: data.scheduledDate,
      auditorId: data.auditorId,
      reason: data.reason,
      priority: data.priority || 'MEDIUM',
      estimatedDuration: data.estimatedDuration || 2,
      blockchainVerification: data.blockchainVerification !== false, // Default true
      automaticScheduling: data.automaticScheduling || false,
    };

    return this.request('/compliance/audits/schedule', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Get audit history with blockchain trail (for specific taxpayer)
  async getAuditHistory(taxpayerId) {
    return this.request(`/compliance/audits/${taxpayerId}`);
  }

  // Get all audits with filtering
  async getAllAudits(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.taxpayerId) queryParams.append('taxpayerId', filters.taxpayerId);
    if (filters.auditType) queryParams.append('auditType', filters.auditType);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/compliance/audits?${queryString}` : '/compliance/audits';
    return this.request(endpoint);
  }

  // Get compliance analytics
  async getComplianceAnalytics(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);
    if (filters.region) queryParams.append('region', filters.region);
    if (filters.sector) queryParams.append('sector', filters.sector);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/compliance/analytics?${queryString}` : '/compliance/analytics';
    return this.request(endpoint);
  }

  // Get Taxpayer Compliance Report (JSON or PDF)
  async getTaxpayerComplianceReport(tin, filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);
    if (filters.format) queryParams.append('format', filters.format);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/compliance/taxpayer/${tin}/report?${queryString}`
      : `/compliance/taxpayer/${tin}/report`;

    // For PDF, use direct axios call to get blob (bypass interceptor)
    if (filters.format === 'pdf') {
      const fullEndpoint = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
      const token = getToken();
      const response = await axios.get(`http://localhost:3000${fullEndpoint}`, {
        responseType: 'blob',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data; // Return blob data directly
    }

    return this.request(endpoint);
  }

  // Download PDF Report (Direct)
  async downloadTaxpayerComplianceReportPDF(tin, filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/compliance/taxpayer/${tin}/report/download?${queryString}`
      : `/compliance/taxpayer/${tin}/report/download`;

    // Use direct axios call for blob
    const fullEndpoint = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
    // Use axios directly, bypassing the interceptor for blob responses
    const token = getToken();
    const response = await axios.get(`http://localhost:3000${fullEndpoint}`, {
      responseType: 'blob',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data; // Return blob data directly
  }

  // Get risk assessment for taxpayer
  async getRiskAssessment(tin) {
    return this.request(`/compliance/risk-assessment/${tin}`);
  }

  // Get all penalties with filtering
  async getAllPenalties(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.taxpayerId) queryParams.append('taxpayerId', filters.taxpayerId);
    if (filters.penaltyType) queryParams.append('penaltyType', filters.penaltyType);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/compliance/penalties?${queryString}` : '/compliance/penalties';
    return this.request(endpoint);
  }

  // Calculate compliance score
  async calculateComplianceScore(taxpayerId, forceRecalculation = false) {
    return this.request('/compliance/calculate-score', {
      method: 'POST',
      body: JSON.stringify({
        taxpayerId,
        forceRecalculation,
      }),
    });
  }

  // Get compliance reports
  async getComplianceReports(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.reportType) queryParams.append('reportType', filters.reportType);
    if (filters.format) queryParams.append('format', filters.format);
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);
    if (filters.region) queryParams.append('region', filters.region);
    if (filters.riskLevel) queryParams.append('riskLevel', filters.riskLevel);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/compliance/reports?${queryString}` : '/compliance/reports';
    return this.request(endpoint);
  }

  // Verify compliance record on blockchain
  async verifyComplianceRecord(recordId, recordType) {
    const queryParams = new URLSearchParams();
    queryParams.append('recordType', recordType);

    return this.request(`/compliance/verify/${recordId}?${queryParams.toString()}`);
  }

  // ==================== TAX ASSESSMENT MANAGEMENT ====================

  // Get tax assessments with advanced filtering and pagination
  async getTaxAssessments(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.tin) queryParams.append('tin', filters.tin);
    if (filters.taxpayerId) queryParams.append('taxpayerId', filters.taxpayerId);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.taxType) queryParams.append('taxType', filters.taxType);
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tax-assessments?${queryString}` : '/tax-assessments';

    const response = await this.request(endpoint);
    return {
      ...response,
      assessments: response.data || response.assessments || [],
      pagination: response.pagination || null,
    };
  }

  // Get tax assessments by TIN
  async getTaxAssessmentsByTin(tin) {
    return this.request(`/tax-assessments/tin/${tin}`);
  }

  // Get tax assessment by ID
  async getTaxAssessmentById(id) {
    const response = await this.request(`/tax-assessments/${id}`);
    return {
      ...response,
      assessment: response.taxAssessment || response.data || response,
    };
  }

  // Create new tax assessment
  async createTaxAssessment(data) {
    // Transform frontend camelCase to backend format
    const payload = {
      id: data.id || data.assessmentId,
      tin: data.tin || data.taxpayerTIN,
      taxpayerId: data.taxpayerId,
      taxType: data.taxType || data.type,
      year: data.year,
      amount: data.amount || data.assessedAmount,
      currency: data.currency || 'TZS',
      status: data.status || 'PENDING',
      createdBy: data.createdBy || 'admin',
      description: data.description,
      dueDate: data.dueDate,
      penalties: data.penalties || 0,
      interest: data.interest || 0,
      period: data.period,
    };

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    return this.request('/tax-assessments', {
      method: 'POST',
      data: payload,
    });
  }

  // Update tax assessment
  async updateTaxAssessment(id, updates) {
    // Transform frontend camelCase to backend format
    const payload = {
      tin: updates.tin || updates.taxpayerTIN,
      taxpayerId: updates.taxpayerId,
      taxType: updates.taxType || updates.type,
      year: updates.year,
      amount: updates.amount || updates.assessedAmount,
      currency: updates.currency,
      status: updates.status,
      createdBy: updates.createdBy,
      description: updates.description,
      dueDate: updates.dueDate,
      penalties: updates.penalties,
      interest: updates.interest,
      period: updates.period,
    };

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    return this.request(`/tax-assessments/${id}`, {
      method: 'PUT',
      data: payload,
    });
  }

  // Delete tax assessment
  async deleteTaxAssessment(id) {
    return this.request(`/tax-assessments/${id}`, {
      method: 'DELETE',
    });
  }

  // Get assessment history
  async getTaxAssessmentHistory(id) {
    const response = await this.request(`/tax-assessments/${id}/history`);
    return {
      ...response,
      history: response.history || response.data || [],
    };
  }

  // Record penalty with automatic calculation
  async recordPenalty(data) {
    const payload = {
      taxpayerId: data.taxpayerId,
      penaltyType: data.penaltyType,
      amount: data.amount,
      reason: data.reason,
      dueDate: data.dueDate,
      gracePeriod: data.gracePeriod || 30,
      automaticCalculation: data.automaticCalculation !== false, // Default true
      blockchainRecord: data.blockchainRecord !== false, // Default true
    };

    return this.request('/compliance/penalties', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ==================== INTEROPERABILITY ====================

  // Sync with NIDA (National ID Authority)
  async syncWithNIDA(taxpayerId, nidaData) {
    const payload = {
      taxpayerId,
      nidaNumber: nidaData.nidaNumber,
      fullName: nidaData.fullName,
      dateOfBirth: nidaData.dateOfBirth,
      residentialAddress: nidaData.residentialAddress,
      verificationRequired: true,
    };

    return this.request('/interoperability/nida/sync', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Verify TISS payment
  async verifyTISSPayment(paymentData) {
    return this.request('/interoperability/tiss/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Get BRELA company data
  async getBRELAData(registrationNumber) {
    return this.request(`/interoperability/brela/company/${registrationNumber}`);
  }

  // Sync external system data
  async syncExternalData(system, taxpayerId, data) {
    const payload = {
      system,
      taxpayerId,
      data,
      timestamp: new Date().toISOString(),
      verification: true,
    };

    return this.request('/interoperability/sync', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ==================== REPORTING & ANALYTICS ====================

  // Get revenue dashboard with real-time data
  async getRevenueDashboard(period = 'monthly') {
    return this.request(`/reports/revenue/dashboard?period=${period}`);
  }

  // Note: getComplianceAnalytics is defined in COMPLIANCE MANAGEMENT section above

  // Generate executive report
  async generateExecutiveReport(timeframe = 'monthly') {
    return this.request(`/reports/executive?timeframe=${timeframe}`);
  }

  // Export data with blockchain verification
  async exportData(type, format = 'csv', filters = {}) {
    const queryParams = new URLSearchParams({ ...filters, format }).toString();
    return this.request(`/reports/export?type=${type}&${queryParams}`);
  }

  // ==================== MOBILE & USSD ====================

  // USSD tax status check
  async checkUSSDStatus(phoneNumber, tin) {
    return this.request(`/mobile/ussd/status?phone=${phoneNumber}&tin=${tin}`);
  }

  // Mobile app authentication
  async mobileLogin(phoneNumber, pin) {
    return this.request('/mobile/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, pin }),
    });
  }

  // Get mobile dashboard
  async getMobileDashboard(taxpayerId) {
    return this.request(`/mobile/dashboard/${taxpayerId}`);
  }

  // Submit mobile payment
  async submitMobilePayment(paymentData) {
    return this.request('/mobile/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // ==================== AI AGENT ====================

  // Natural language query
  async naturalLanguageQuery(query, language = 'en') {
    return this.request('/ai/query', {
      method: 'POST',
      body: JSON.stringify({ query, language }),
    });
  }

  // Get AI insights
  async getAIInsights(taxpayerId) {
    return this.request(`/ai/insights/${taxpayerId}`);
  }

  // Predict tax liability
  async predictTaxLiability(data) {
    return this.request('/ai/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== ENTERPRISE AUDIT MODULE ====================

  // Get audit logs with advanced filtering
  async getAuditLogs(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.action) queryParams.append('action', filters.action);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.entityType) queryParams.append('entityType', filters.entityType);
    if (filters.entityId) queryParams.append('entityId', filters.entityId);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    if (filters.riskLevel) queryParams.append('riskLevel', filters.riskLevel);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.requiresReview !== undefined)
      queryParams.append('requiresReview', filters.requiresReview.toString());
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/audit/logs?${queryString}` : '/audit/logs';
    return this.request(endpoint);
  }

  // Get audit trail for a specific entity
  async getAuditTrail(entityType, entityId) {
    if (!entityType || !entityId) {
      throw new Error('Entity type and ID are required');
    }
    return this.request(`/audit/trail/${entityType}/${entityId}`);
  }

  // Get high-risk audit operations
  async getHighRiskAudits(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.entityType) queryParams.append('entityType', filters.entityType);
    if (filters.riskLevel) queryParams.append('riskLevel', filters.riskLevel);
    if (filters.requiresReview !== undefined)
      queryParams.append('requiresReview', filters.requiresReview.toString());
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/audit/high-risk?${queryString}` : '/audit/high-risk';
    return this.request(endpoint);
  }

  // Get audit operations by user
  async getUserAuditActivity(userId, filters = {}) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const queryParams = new URLSearchParams();
    if (filters.entityType) queryParams.append('entityType', filters.entityType);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/audit/user/${userId}?${queryString}` : `/audit/user/${userId}`;
    return this.request(endpoint);
  }

  // Search audit logs with full-text search
  async searchAuditLogs(searchParams) {
    const payload = {
      query: searchParams.query || '',
      filters: searchParams.filters || {},
      page: searchParams.page || 1,
      pageSize: searchParams.pageSize || 50,
    };
    return this.request('/audit/search', {
      method: 'POST',
      data: payload,
    });
  }

  // Get audit statistics
  async getAuditStatistics(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    if (filters.entityType) queryParams.append('entityType', filters.entityType);
    if (filters.groupBy) queryParams.append('groupBy', filters.groupBy); // user, entityType, action, riskLevel

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/audit/statistics?${queryString}` : '/audit/statistics';
    return this.request(endpoint);
  }

  // Get transaction details by transaction ID
  async getTransactionDetails(transactionId) {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }
    return this.request(`/audit/transaction/${transactionId}`);
  }

  // Verify blockchain transaction
  async verifyBlockchainTransaction(transactionId) {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }
    return this.request(`/audit/verify/${transactionId}`);
  }

  // Export audit logs
  async exportAuditLogs(filters = {}, format = 'CSV') {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key].toString());
      }
    });
    queryParams.append('format', format);

    return this.request(`/audit/export?${queryParams.toString()}`, {
      responseType: 'blob',
    });
  }

  // Get transaction history with blockchain verification (backward compatibility)
  async getTransactionHistory(taxpayerId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/audit/transactions/${taxpayerId}?${queryParams}`);
  }

  // Search transactions with advanced criteria (backward compatibility)
  async searchTransactions(criteria) {
    return this.request('/audit/search', {
      method: 'POST',
      data: { query: '', filters: criteria },
    });
  }

  // ==================== ALERTS & NOTIFICATIONS ====================

  // Get alerts
  async getAlerts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/alerts?${queryParams}`);
  }

  // Subscribe to notifications
  async subscribeToNotifications(subscriptionData) {
    return this.request('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  }

  // Get notification history
  async getNotificationHistory(taxpayerId) {
    return this.request(`/notifications/history/${taxpayerId}`);
  }

  // ==================== SYSTEM MANAGEMENT ====================

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // System status
  async getSystemStatus() {
    return this.request('/status');
  }

  // Get API documentation
  async getAPIDocumentation() {
    return this.request('/docs');
  }

  // Get system metrics
  async getSystemMetrics() {
    return this.request('/metrics');
  }

  // ==================== BLOCKCHAIN SPECIFIC ====================

  // Get blockchain transaction details
  async getBlockchainTransaction(txId) {
    return this.request(`/blockchain/transaction/${txId}`);
  }

  // Verify blockchain integrity
  async verifyBlockchainIntegrity() {
    return this.request('/blockchain/verify');
  }

  // Get blockchain statistics
  async getBlockchainStats() {
    return this.request('/blockchain/stats');
  }

  // ==================== COMPLIANCE SCORING ====================

  // Update compliance score
  async updateComplianceScore(taxpayerId, scoreData) {
    return this.request(`/compliance/update-score/${taxpayerId}`, {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  }

  // Get compliance statistics
  async getComplianceStatistics() {
    return this.request('/compliance/statistics');
  }

  // Apply compliance penalty
  async applyCompliancePenalty(penaltyData) {
    return this.request('/compliance/apply-penalty', {
      method: 'POST',
      body: JSON.stringify(penaltyData),
    });
  }

  // ==================== VAT SMART CONTRACT ====================

  // Process VAT payment
  async processVATPayment(paymentData) {
    return this.request('/vat/process-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Get VAT summary
  async getVATSummary(taxpayerId, period) {
    return this.request(`/vat/summary/${taxpayerId}/${period}`);
  }

  // ==================== INTEROPERABILITY STATUS ====================

  // Get system integration status
  async getSystemIntegrationStatus(system) {
    return this.request(`/interoperability/status/${system}`);
  }
}

// Create singleton instance
const traApi = new TRA_API();

export default traApi;
