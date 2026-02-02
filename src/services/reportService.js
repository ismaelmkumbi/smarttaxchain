// src/services/reportService.js
import api from './api';

/**
 * Report Service
 * Handles all report-related API operations
 * Supports both PDF and JSON formats
 * 
 * @example
 * // Generate and download a payment receipt PDF
 * import reportService from 'src/services/reportService';
 * import { downloadPDF, generateReportFilename } from 'src/utils/reportUtils';
 * 
 * const receipt = await reportService.getPaymentReceipt('RECEIPT-123');
 * const filename = generateReportFilename('payment-receipt', 'RECEIPT-123', 'pdf');
 * downloadPDF(receipt, filename);
 * 
 * @example
 * // Get tax assessment statement as JSON
 * const statement = await reportService.getTaxAssessmentStatement('677676769', {
 *   format: 'json',
 *   period: '2025-Q1'
 * });
 * console.log(statement);
 * 
 * @example
 * // Generate compliance report with date range
 * import { formatDateForAPI, handleReportResponse } from 'src/utils/reportUtils';
 * 
 * const report = await reportService.getComplianceReport('677676769', {
 *   format: 'pdf',
 *   fromDate: formatDateForAPI(new Date('2025-01-01')),
 *   toDate: formatDateForAPI(new Date('2025-11-22'))
 * });
 * 
 * await handleReportResponse(report, 'pdf', 'compliance-report.pdf', {
 *   autoDownload: true,
 *   openInNewTab: false
 * });
 */
const reportService = {
  /**
   * Generate Payment Receipt
   * @param {string} receiptId - Receipt ID
   * @param {Object} options - Request options
   * @param {string} options.format - Format: 'pdf' (default) or 'json'
   * @returns {Promise<Blob|Object>} PDF blob or JSON object
   */
  getPaymentReceipt: async (receiptId, options = {}) => {
    try {
      if (!receiptId) {
        throw new Error('Receipt ID is required');
      }

      const { format = 'pdf' } = options;
      const response = await api.get(`/api/reports/payment-receipt/${receiptId}`, {
        params: { format },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });

      return response;
    } catch (error) {
      console.error('Error generating payment receipt:', error);
      throw error;
    }
  },

  /**
   * Generate Tax Assessment Statement
   * @param {string} tin - Taxpayer TIN
   * @param {Object} options - Request options
   * @param {string} options.period - Period filter (e.g., "2025-Q1")
   * @param {string} options.fromDate - Start date (YYYY-MM-DD)
   * @param {string} options.toDate - End date (YYYY-MM-DD)
   * @param {string} options.taxType - Tax type filter
   * @param {string} options.status - Status filter
   * @param {string} options.format - Format: 'pdf' (default) or 'json'
   * @returns {Promise<Blob|Object>} PDF blob or JSON object
   */
  getTaxAssessmentStatement: async (tin, options = {}) => {
    try {
      if (!tin) {
        throw new Error('Taxpayer TIN is required');
      }

      const { format = 'pdf', ...params } = options;
      const response = await api.get(`/api/reports/tax-assessment-statement/${tin}`, {
        params: { format, ...params },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });

      return response;
    } catch (error) {
      console.error('Error generating tax assessment statement:', error);
      throw error;
    }
  },

  /**
   * Generate Tax Clearance Certificate
   * @param {string} tin - Taxpayer TIN
   * @param {Object} options - Request options
   * @param {string} options.format - Format: 'pdf' (default) or 'json'
   * @returns {Promise<Blob|Object>} PDF blob or JSON object
   */
  getTaxClearanceCertificate: async (tin, options = {}) => {
    try {
      if (!tin) {
        throw new Error('Taxpayer TIN is required');
      }

      const { format = 'pdf' } = options;
      const response = await api.get(`/api/reports/tax-clearance-certificate/${tin}`, {
        params: { format },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });

      return response;
    } catch (error) {
      console.error('Error generating tax clearance certificate:', error);
      throw error;
    }
  },

  /**
   * Generate Payment History Report
   * @param {string} tin - Taxpayer TIN
   * @param {Object} options - Request options
   * @param {string} options.fromDate - Start date (YYYY-MM-DD)
   * @param {string} options.toDate - End date (YYYY-MM-DD)
   * @param {string} options.paymentMethod - Payment method filter
   * @param {string} options.assessmentId - Assessment ID filter
   * @param {number} options.minAmount - Minimum amount
   * @param {number} options.maxAmount - Maximum amount
   * @param {string} options.format - Format: 'pdf' (default) or 'json'
   * @returns {Promise<Blob|Object>} PDF blob or JSON object
   */
  getPaymentHistoryReport: async (tin, options = {}) => {
    try {
      if (!tin) {
        throw new Error('Taxpayer TIN is required');
      }

      const { format = 'pdf', ...params } = options;
      const response = await api.get(`/api/reports/payment-history/${tin}`, {
        params: { format, ...params },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });

      return response;
    } catch (error) {
      console.error('Error generating payment history report:', error);
      throw error;
    }
  },

  /**
   * Generate Outstanding Tax Report
   * @param {string} tin - Taxpayer TIN
   * @param {Object} options - Request options
   * @param {string} options.status - Status filter
   * @param {number} options.minAmount - Minimum amount
   * @param {number} options.maxAmount - Maximum amount
   * @param {string} options.taxType - Tax type filter
   * @param {string} options.format - Format: 'pdf' (default) or 'json'
   * @returns {Promise<Blob|Object>} PDF blob or JSON object
   */
  getOutstandingTaxReport: async (tin, options = {}) => {
    try {
      if (!tin) {
        throw new Error('Taxpayer TIN is required');
      }

      const { format = 'pdf', ...params } = options;
      const response = await api.get(`/api/reports/outstanding-tax/${tin}`, {
        params: { format, ...params },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });

      return response;
    } catch (error) {
      console.error('Error generating outstanding tax report:', error);
      throw error;
    }
  },

  /**
   * Generate Compliance Report
   * Requires: admin, officer, or auditor role
   * @param {string} tin - Taxpayer TIN
   * @param {Object} options - Request options
   * @param {string} options.fromDate - Start date (YYYY-MM-DD)
   * @param {string} options.toDate - End date (YYYY-MM-DD)
   * @param {string} options.format - Format: 'pdf' (default) or 'json'
   * @returns {Promise<Blob|Object>} PDF blob or JSON object
   */
  getComplianceReport: async (tin, options = {}) => {
    try {
      if (!tin) {
        throw new Error('Taxpayer TIN is required');
      }

      const { format = 'pdf', ...params } = options;
      const response = await api.get(`/api/reports/compliance-report/${tin}`, {
        params: { format, ...params },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });

      return response;
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw error;
    }
  },

  /**
   * Generate Assessment Ledger Report
   * @param {string} assessmentId - Assessment ID
   * @param {Object} options - Request options
   * @param {string} options.format - Format: 'pdf' (default) or 'json'
   * @returns {Promise<Blob|Object>} PDF blob or JSON object
   */
  getAssessmentLedgerReport: async (assessmentId, options = {}) => {
    try {
      if (!assessmentId) {
        throw new Error('Assessment ID is required');
      }

      const { format = 'pdf' } = options;
      const response = await api.get(`/api/reports/assessment-ledger/${assessmentId}`, {
        params: { format },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });

      return response;
    } catch (error) {
      console.error('Error generating assessment ledger report:', error);
      throw error;
    }
  },

  /**
   * Generate Revenue Collection Report
   * Requires: admin or officer role
   * @param {Object} options - Request options
   * @param {string} options.fromDate - Start date (YYYY-MM-DD) - REQUIRED
   * @param {string} options.toDate - End date (YYYY-MM-DD) - REQUIRED
   * @param {string} options.taxType - Tax type filter
   * @param {string} options.region - Region filter
   * @param {string} options.groupBy - Group by: day, week, month, quarter, year
   * @param {string} options.format - Format: 'pdf' (default) or 'json'
   * @returns {Promise<Blob|Object>} PDF blob or JSON object
   */
  getRevenueCollectionReport: async (options = {}) => {
    try {
      const { fromDate, toDate, format = 'pdf', ...params } = options;

      if (!fromDate || !toDate) {
        throw new Error('fromDate and toDate are required');
      }

      const response = await api.get('/api/reports/revenue-collection', {
        params: { fromDate, toDate, format, ...params },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });

      return response;
    } catch (error) {
      console.error('Error generating revenue collection report:', error);
      throw error;
    }
  },

  /**
   * Generate Audit Trail Report
   * Requires: admin or auditor role
   * @param {Object} options - Request options
   * @param {string} options.entityType - Entity type filter
   * @param {string} options.entityId - Entity ID filter
   * @param {string} options.userId - User ID filter
   * @param {string} options.action - Action filter
   * @param {string} options.fromDate - Start date (YYYY-MM-DD)
   * @param {string} options.toDate - End date (YYYY-MM-DD)
   * @param {string} options.riskLevel - Risk level filter
   * @param {boolean} options.requiresReview - Requires review filter
   * @param {string} options.format - Format: 'pdf' (default) or 'json'
   * @returns {Promise<Blob|Object>} PDF blob or JSON object
   */
  getAuditTrailReport: async (options = {}) => {
    try {
      const { format = 'pdf', ...params } = options;
      const response = await api.get('/api/reports/audit-trail', {
        params: { format, ...params },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });

      return response;
    } catch (error) {
      console.error('Error generating audit trail report:', error);
      throw error;
    }
  },

  /**
   * Generate Registration Certificate
   * @param {string} tin - Taxpayer TIN
   * @param {Object} options - Request options
   * @param {string} options.format - Format: 'pdf' (default) or 'json'
   * @returns {Promise<Blob|Object>} PDF blob or JSON object
   */
  getRegistrationCertificate: async (tin, options = {}) => {
    try {
      if (!tin) {
        throw new Error('Taxpayer TIN is required');
      }

      const { format = 'pdf' } = options;
      const response = await api.get(`/api/reports/registration-certificate/${tin}`, {
        params: { format },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });

      return response;
    } catch (error) {
      console.error('Error generating registration certificate:', error);
      throw error;
    }
  },
};

export default reportService;

