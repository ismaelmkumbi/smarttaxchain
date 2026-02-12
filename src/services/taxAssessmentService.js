// src/services/taxAssessmentService.js
import api from './api';

const formatError = (error) => ({
  message: error.message || 'Unknown error',
  context: error.context || 'Unknown context',
  success: false,
});

// Fallback data
const FALLBACK_TAXPAYERS = [
  {
    ID: '1',
    Name: 'John Smith',
    TIN: '145288-TZ',
    Type: 'Individual',
    BusinessCategory: 'Agriculture',
    RegistrationAddress: 'Arusha',
    LastAuditDate: '2024-03-15',
    Assessments: 3,
    Status: 'Pending',
    Amount: 1250000,
  },
];

const FALLBACK_ASSESSMENTS = [
  {
    Amount: 1250000,
    Status: 'Pending',
    DueDate: '2024-06-30',
    TaxType: 'Income Tax',
    Tin: '145288-TZ',
  },
];

/**
 * Enhanced Tax Assessment Service
 * Uses the new /api/tax-assessments endpoints with filtering, pagination, and advanced features
 */
const taxAssessmentService = {
  /**
   * Get all taxpayers (legacy method - kept for backward compatibility)
   */
  getAllTaxpayers: async () => {
    try {
      // Endpoint is /taxpayers (not /api/taxpayers)
      // Response structure: { success: true, taxpayers: [...], count: number, timestamp: string }
      const response = await api.get('/taxpayers');
      console.log(response, 'testing data from taxpayer');
      return response.taxpayers || [];
    } catch (error) {
      console.error('Error fetching taxpayers:', error);
      console.error('Using fallback taxpayer data');
      return FALLBACK_TAXPAYERS;
    }
  },

  /**
   * Get all tax assessments with advanced filtering and pagination
   * @param {Object} filters - Filter options
   * @param {string} filters.tin - Filter by Taxpayer TIN
   * @param {string} filters.taxpayerId - Filter by Taxpayer ID
   * @param {string} filters.status - Filter by status (OPEN, PAID, DISPUTED, PENDING, OVERDUE, CANCELLED)
   * @param {string} filters.taxType - Filter by tax type (VAT, Income Tax, PAYE, CIT, etc.)
   * @param {string} filters.from - Filter from date (YYYY-MM-DD)
   * @param {string} filters.to - Filter to date (YYYY-MM-DD)
   * @param {number} filters.page - Page number (default: 1)
   * @param {number} filters.pageSize - Items per page (default: 50, max: 100)
   * @returns {Promise<Object>} Response with data array and pagination info
   */
  getAllAssessments: async (filters = {}) => {
    try {
      // Build query parameters
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
      const endpoint = queryString 
        ? `/api/tax-assessments?${queryString}` 
        : '/api/tax-assessments';

      const response = await api.get(endpoint);
      
      console.log('DEBUG: Response from API', response);

      // Handle different response structures
      const assessments = response.data || response.assessments || [];
      const pagination = response.pagination || null;

      return {
        assessments: assessments.filter((a) => a.TaxType || a.taxType),
        pagination,
        success: response.success !== false,
      };
    } catch (error) {
      console.error('Error fetching assessments:', error);
      console.error('Using fallback assessment data');
      return {
        assessments: FALLBACK_ASSESSMENTS,
        pagination: null,
        success: false,
      };
    }
  },

  /**
   * Get all tax assessments by TIN (simpler endpoint)
   * @param {string} tin - Taxpayer TIN
   * @returns {Promise<Array>} Array of assessments
   */
  getAllAssessmentsByTin: async (tin) => {
    try {
      if (!tin) {
        console.warn('TIN is required for getAllAssessmentsByTin');
        return FALLBACK_ASSESSMENTS;
      }

      const response = await api.get(`/api/tax-assessments/tin/${tin}`);
      console.log('DEBUG: Response from API for TIN', tin, response);

      // Handle different response structures
      const assessments = response.assessments || response.data || [];
      return assessments;
    } catch (error) {
      console.error('Error fetching assessments by TIN:', error);
      console.error('Using fallback assessment data');
      return FALLBACK_ASSESSMENTS;
    }
  },

  /**
   * Get tax assessment by ID
   * @param {string} id - Assessment ID (e.g., TAXASMT-2025-000123)
   * @returns {Promise<Object>} Assessment object
   */
  getAssessmentById: async (id) => {
    try {
      if (!id) {
        throw new Error('Assessment ID is required');
      }

      const response = await api.get(`/api/tax-assessments/${id}`);
      console.log('DEBUG: Assessment by ID', id, response);

      // Handle different response structures
      return response.taxAssessment || response.data || response;
    } catch (error) {
      console.error('Error fetching assessment by ID:', error);
      throw error;
    }
  },

  /**
   * Create a new tax assessment with immutable ledger entry
   * @param {Object} assessmentData - Assessment data (camelCase)
   * @returns {Promise<Object>} Created assessment with ledger events
   */
  createAssessment: async (assessmentData) => {
    try {
      // Transform frontend camelCase to backend format
      const payload = {
        id: assessmentData.id || assessmentData.assessmentId,
        tin: assessmentData.tin || assessmentData.taxpayerTIN,
        taxpayerId: assessmentData.taxpayerId || assessmentData.tin,
        taxType: assessmentData.taxType || assessmentData.type,
        year: assessmentData.year,
        amount: assessmentData.amount || assessmentData.assessedAmount,
        currency: assessmentData.currency || 'TZS',
        status: assessmentData.status || 'PENDING',
        createdBy: assessmentData.createdBy || 'admin',
        description: assessmentData.description,
        dueDate: assessmentData.dueDate,
        period: assessmentData.period,
      };

      // Remove undefined values
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      // Use new endpoint with immutable ledger
      const response = await api.post('/api/tax-assessments/createAssessment', payload);
      console.log('DEBUG: Created assessment with ledger', response);

      // Return assessment and ledger events
      return {
        assessment: response.data?.assessment || response.assessment || response,
        ledgerEvents: response.data?.ledger_events || response.ledger_events || [],
        ...response,
      };
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  },

  /**
   * Update an existing tax assessment (audited edits with immutable ledger)
   * @param {string} id - Assessment ID
   * @param {Object} updates - Update data (camelCase)
   * @returns {Promise<Object>} Updated assessment with audit trail
   */
  updateAssessment: async (id, updates) => {
    try {
      if (!id) {
        throw new Error('Assessment ID is required');
      }

      // Validate ID format
      const assessmentId = String(id).trim();
      if (!assessmentId) {
        throw new Error('Invalid assessment ID format');
      }

      // Transform frontend camelCase to backend format (PascalCase for updates object)
      const backendUpdates = {};
      
      if (updates.tin !== undefined) backendUpdates.Tin = updates.tin;
      if (updates.taxpayerId !== undefined) backendUpdates.TaxpayerId = updates.taxpayerId;
      if (updates.taxType !== undefined) backendUpdates.TaxType = updates.taxType || updates.type;
      if (updates.year !== undefined) backendUpdates.Year = updates.year;
      if (updates.amount !== undefined) backendUpdates.Amount = updates.amount || updates.assessedAmount;
      if (updates.currency !== undefined) backendUpdates.Currency = updates.currency;
      if (updates.status !== undefined) backendUpdates.Status = updates.status;
      if (updates.description !== undefined) backendUpdates.Description = updates.description;
      if (updates.dueDate !== undefined) backendUpdates.DueDate = updates.dueDate;
      if (updates.penalties !== undefined) backendUpdates.Penalties = updates.penalties;
      if (updates.interest !== undefined) backendUpdates.Interest = updates.interest;
      if (updates.period !== undefined) backendUpdates.Period = updates.period;

      // Remove undefined values
      Object.keys(backendUpdates).forEach((key) => {
        if (backendUpdates[key] === undefined) {
          delete backendUpdates[key];
        }
      });

      // Use new API design with "updates" wrapper
      const payload = {
        updates: backendUpdates,
      };

      const response = await api.put(`/api/tax-assessments/${encodeURIComponent(assessmentId)}`, payload);
      console.log('DEBUG: Updated assessment with audit', response);

      // Return assessment and audit information
      return {
        assessment: response.data?.assessment || response.assessment || response,
        audit: response.data?.audit || response.audit || null,
        ...response,
      };
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  },

  /**
   * Delete a tax assessment
   * @param {string} id - Assessment ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteAssessment: async (id) => {
    try {
      if (!id) {
        throw new Error('Assessment ID is required');
      }

      const response = await api.delete(`/api/tax-assessments/${id}`);
      console.log('DEBUG: Deleted assessment', response);

      return response;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  },

  /**
   * Get assessment history (transaction history)
   * @param {string} id - Assessment ID
   * @returns {Promise<Array>} Array of history entries
   */
  getAssessmentHistory: async (id) => {
    try {
      if (!id) {
        throw new Error('Assessment ID is required');
      }

      const response = await api.get(`/api/tax-assessments/${id}/history`);
      console.log('DEBUG: Assessment history', response);

      return response.history || response.data || [];
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      throw error;
    }
  },

  /**
   * Calculate interest for an assessment
   * @param {Object} interestData - Interest calculation parameters
   * @param {string} interestData.assessmentId - Assessment ID
   * @param {string} interestData.interestType - "daily" or "monthly"
   * @param {number} interestData.interestRate - Annual interest rate as decimal (e.g., 0.12 for 12%)
   * @param {string} interestData.dueDate - ISO date string
   * @param {string} interestData.paymentDate - ISO date string (optional)
   * @param {number} interestData.principalAmount - Base amount (optional)
   * @returns {Promise<Object>} Interest calculation result with ledger event
   */
  calculateInterest: async (interestData) => {
    try {
      const response = await api.post('/api/tax-assessments/calculateInterest', interestData);
      console.log('DEBUG: Interest calculated', response);

      return response.data || response;
    } catch (error) {
      console.error('Error calculating interest:', error);
      throw error;
    }
  },

  /**
   * Apply penalty to an assessment
   * @param {Object} penaltyData - Penalty data
   * @param {string} penaltyData.assessmentId - Assessment ID
   * @param {string} penaltyData.penaltyType - "LATE_PAYMENT", "UNDER_DECLARATION", or "NON_FILING"
   * @param {number} penaltyData.penaltyRate - Percentage rate (optional, e.g., 5 for 5%)
   * @param {number} penaltyData.penaltyAmount - Fixed penalty amount (optional)
   * @param {string} penaltyData.reason - Description of penalty
   * @returns {Promise<Object>} Penalty application result with ledger event
   */
  applyPenalty: async (penaltyData) => {
    try {
      const response = await api.post('/api/tax-assessments/applyPenalty', penaltyData);
      console.log('DEBUG: Penalty applied', response);

      return response.data || response;
    } catch (error) {
      console.error('Error applying penalty:', error);
      throw error;
    }
  },

  /**
   * Get assessment ledger (immutable ledger entries)
   * @param {string} id - Assessment ID
   * @returns {Promise<Object>} Ledger with all events and hash chain
   */
  getAssessmentLedger: async (id) => {
    try {
      if (!id) {
        throw new Error('Assessment ID is required');
      }

      const response = await api.get(`/api/tax-assessments/${id}/ledger`);
      console.log('DEBUG: Assessment ledger', response);

      return response.data || response;
    } catch (error) {
      console.error('Error fetching assessment ledger:', error);
      throw error;
    }
  },

  /**
   * Get assessment account (full view: assessment + account_summary + payment_entries)
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<Object>} { assessment, account_summary, payment_entries, status }
   */
  getAssessmentAccount: async (assessmentId) => {
    try {
      if (!assessmentId) {
        throw new Error('Assessment ID is required');
      }
      const response = await api.get(`/api/tax-assessments/${assessmentId}/account`);
      return response?.data ?? response;
    } catch (error) {
      console.error('Error fetching assessment account:', error);
      throw error;
    }
  },

  /**
   * Get complete assessment with ledger and summary
   * @param {string} id - Assessment ID
   * @returns {Promise<Object>} Complete assessment with ledger and summary
   */
  getCompleteAssessment: async (id) => {
    try {
      if (!id) {
        throw new Error('Assessment ID is required');
      }

      const response = await api.get(`/api/tax-assessments/${id}/complete`);
      console.log('DEBUG: Complete assessment', response);

      return response.data || response;
    } catch (error) {
      console.error('Error fetching complete assessment:', error);
      throw error;
    }
  },

  /**
   * Legacy method - kept for backward compatibility
   * @deprecated Use getAllAssessmentsByTin instead
   */
  getTaxpayerDetailById: async (id) => {
    console.warn('getTaxpayerDetailById is deprecated. Use getAssessmentById instead.');
    return this.getAssessmentById(id);
  },
};

export default taxAssessmentService;
