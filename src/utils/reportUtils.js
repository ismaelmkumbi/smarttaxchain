// src/utils/reportUtils.js

/**
 * Report Utilities
 * Helper functions for working with reports
 */

/**
 * Download a PDF blob as a file
 * @param {Blob} blob - PDF blob
 * @param {string} filename - Filename for the download
 */
export const downloadPDF = (blob, filename = 'report.pdf') => {
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

/**
 * Open a PDF blob in a new window
 * @param {Blob} blob - PDF blob
 */
export const openPDF = (blob) => {
  try {
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Clean up the URL after a delay to allow the browser to load it
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error opening PDF:', error);
    throw error;
  }
};

/**
 * Generate a filename for a report
 * @param {string} reportType - Type of report
 * @param {string} identifier - Identifier (TIN, receiptId, etc.)
 * @param {string} format - File format (pdf, json)
 * @param {Object} options - Additional options
 * @returns {string} Generated filename
 */
export const generateReportFilename = (reportType, identifier, format = 'pdf', options = {}) => {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const reportTypeMap = {
    'payment-receipt': 'PaymentReceipt',
    'tax-assessment-statement': 'TaxAssessmentStatement',
    'tax-clearance-certificate': 'TaxClearanceCertificate',
    'payment-history': 'PaymentHistory',
    'outstanding-tax': 'OutstandingTax',
    'compliance-report': 'ComplianceReport',
    'assessment-ledger': 'AssessmentLedger',
    'revenue-collection': 'RevenueCollection',
    'audit-trail': 'AuditTrail',
    'registration-certificate': 'RegistrationCertificate',
  };

  const typeName = reportTypeMap[reportType] || reportType;
  const extension = format === 'json' ? 'json' : 'pdf';

  if (identifier) {
    return `${typeName}_${identifier}_${timestamp}.${extension}`;
  }

  if (options.fromDate && options.toDate) {
    return `${typeName}_${options.fromDate}_to_${options.toDate}_${timestamp}.${extension}`;
  }

  return `${typeName}_${timestamp}.${extension}`;
};

/**
 * Format date for API requests
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date (YYYY-MM-DD)
 */
export const formatDateForAPI = (date) => {
  if (!date) return null;

  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date');
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Validate date range
 * @param {string} fromDate - Start date
 * @param {string} toDate - End date
 * @returns {boolean} True if valid
 */
export const validateDateRange = (fromDate, toDate) => {
  if (!fromDate || !toDate) {
    return false;
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return false;
  }

  return from <= to;
};

/**
 * Get default date range (last 30 days)
 * @returns {Object} Object with fromDate and toDate
 */
export const getDefaultDateRange = () => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);

  return {
    fromDate: formatDateForAPI(fromDate),
    toDate: formatDateForAPI(toDate),
  };
};

/**
 * Get date range for a period
 * @param {string} period - Period string (e.g., "2025-Q1", "2025-01")
 * @returns {Object} Object with fromDate and toDate
 */
export const getDateRangeForPeriod = (period) => {
  if (!period) return null;

  // Handle quarter format: 2025-Q1
  if (period.includes('-Q')) {
    const [year, quarter] = period.split('-Q');
    const quarterNum = parseInt(quarter, 10);

    if (quarterNum < 1 || quarterNum > 4) {
      throw new Error('Invalid quarter. Must be 1-4');
    }

    const monthStart = (quarterNum - 1) * 3;
    const monthEnd = quarterNum * 3 - 1;

    const fromDate = new Date(parseInt(year, 10), monthStart, 1);
    const toDate = new Date(parseInt(year, 10), monthEnd + 1, 0); // Last day of the month

    return {
      fromDate: formatDateForAPI(fromDate),
      toDate: formatDateForAPI(toDate),
    };
  }

  // Handle month format: 2025-01
  if (period.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = period.split('-');
    const fromDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const toDate = new Date(parseInt(year, 10), parseInt(month, 10), 0); // Last day of the month

    return {
      fromDate: formatDateForAPI(fromDate),
      toDate: formatDateForAPI(toDate),
    };
  }

  // Handle year format: 2025
  if (period.match(/^\d{4}$/)) {
    const year = parseInt(period, 10);
    const fromDate = new Date(year, 0, 1);
    const toDate = new Date(year, 11, 31);

    return {
      fromDate: formatDateForAPI(fromDate),
      toDate: formatDateForAPI(toDate),
    };
  }

  throw new Error('Invalid period format. Use YYYY-QN, YYYY-MM, or YYYY');
};

/**
 * Check if a response contains demo data
 * @param {Object} response - API response
 * @returns {boolean} True if demo data
 */
export const isDemoData = (response) => {
  return response?.isDemo === true || response?.demoNotification !== undefined;
};

/**
 * Get demo notification message
 * @param {Object} response - API response
 * @returns {string|null} Demo notification message or null
 */
export const getDemoNotification = (response) => {
  return response?.demoNotification || null;
};

/**
 * Handle report response (PDF or JSON)
 * @param {Blob|Object} response - API response
 * @param {string} format - Response format ('pdf' or 'json')
 * @param {string} filename - Filename for download
 * @param {Object} options - Options
 * @param {boolean} options.autoDownload - Auto download PDF (default: true)
 * @param {boolean} options.openInNewTab - Open PDF in new tab (default: false)
 * @returns {Promise<void>}
 */
export const handleReportResponse = async (
  response,
  format = 'pdf',
  filename = 'report.pdf',
  options = {}
) => {
  const { autoDownload = true, openInNewTab = false } = options;

  if (format === 'pdf') {
    if (response instanceof Blob) {
      if (openInNewTab) {
        openPDF(response);
      } else if (autoDownload) {
        downloadPDF(response, filename);
      } else {
        openPDF(response);
      }
    } else {
      console.warn('Expected PDF blob but received:', typeof response);
    }
  } else {
    // JSON format
    if (isDemoData(response)) {
      console.warn('Demo data detected:', getDemoNotification(response));
    }
    return response;
  }
};

/**
 * Report type configuration
 */
export const REPORT_TYPES = {
  PAYMENT_RECEIPT: 'payment-receipt',
  TAX_ASSESSMENT_STATEMENT: 'tax-assessment-statement',
  TAX_CLEARANCE_CERTIFICATE: 'tax-clearance-certificate',
  PAYMENT_HISTORY: 'payment-history',
  OUTSTANDING_TAX: 'outstanding-tax',
  COMPLIANCE_REPORT: 'compliance-report',
  ASSESSMENT_LEDGER: 'assessment-ledger',
  REVENUE_COLLECTION: 'revenue-collection',
  AUDIT_TRAIL: 'audit-trail',
  REGISTRATION_CERTIFICATE: 'registration-certificate',
};

/**
 * Get report type display name
 * @param {string} reportType - Report type
 * @returns {string} Display name
 */
export const getReportTypeDisplayName = (reportType) => {
  const displayNames = {
    [REPORT_TYPES.PAYMENT_RECEIPT]: 'Payment Receipt',
    [REPORT_TYPES.TAX_ASSESSMENT_STATEMENT]: 'Tax Assessment Statement',
    [REPORT_TYPES.TAX_CLEARANCE_CERTIFICATE]: 'Tax Clearance Certificate',
    [REPORT_TYPES.PAYMENT_HISTORY]: 'Payment History Report',
    [REPORT_TYPES.OUTSTANDING_TAX]: 'Outstanding Tax Report',
    [REPORT_TYPES.COMPLIANCE_REPORT]: 'Compliance Report',
    [REPORT_TYPES.ASSESSMENT_LEDGER]: 'Assessment Ledger Report',
    [REPORT_TYPES.REVENUE_COLLECTION]: 'Revenue Collection Report',
    [REPORT_TYPES.AUDIT_TRAIL]: 'Audit Trail Report',
    [REPORT_TYPES.REGISTRATION_CERTIFICATE]: 'Registration Certificate',
  };

  return displayNames[reportType] || reportType;
};

/**
 * Check if report requires specific role
 * @param {string} reportType - Report type
 * @returns {Object} Required roles
 */
export const getReportRequiredRoles = (reportType) => {
  const roleRequirements = {
    [REPORT_TYPES.COMPLIANCE_REPORT]: ['admin', 'officer', 'auditor'],
    [REPORT_TYPES.REVENUE_COLLECTION]: ['admin', 'officer'],
    [REPORT_TYPES.AUDIT_TRAIL]: ['admin', 'auditor'],
  };

  return roleRequirements[reportType] || [];
};

/**
 * Validate report parameters
 * @param {string} reportType - Report type
 * @param {Object} params - Parameters
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export const validateReportParams = (reportType, params) => {
  const errors = [];

  // Check required parameters based on report type
  switch (reportType) {
    case REPORT_TYPES.PAYMENT_RECEIPT:
      if (!params.receiptId) {
        errors.push('Receipt ID is required');
      }
      break;

    case REPORT_TYPES.TAX_ASSESSMENT_STATEMENT:
    case REPORT_TYPES.TAX_CLEARANCE_CERTIFICATE:
    case REPORT_TYPES.PAYMENT_HISTORY:
    case REPORT_TYPES.OUTSTANDING_TAX:
    case REPORT_TYPES.COMPLIANCE_REPORT:
    case REPORT_TYPES.REGISTRATION_CERTIFICATE:
      if (!params.tin) {
        errors.push('Taxpayer TIN is required');
      }
      break;

    case REPORT_TYPES.ASSESSMENT_LEDGER:
      if (!params.assessmentId) {
        errors.push('Assessment ID is required');
      }
      break;

    case REPORT_TYPES.REVENUE_COLLECTION:
      if (!params.fromDate || !params.toDate) {
        errors.push('fromDate and toDate are required');
      } else if (!validateDateRange(params.fromDate, params.toDate)) {
        errors.push('Invalid date range. fromDate must be before or equal to toDate');
      }
      break;

    case REPORT_TYPES.AUDIT_TRAIL:
      // No required parameters, but validate date range if provided
      if (params.fromDate && params.toDate && !validateDateRange(params.fromDate, params.toDate)) {
        errors.push('Invalid date range. fromDate must be before or equal to toDate');
      }
      break;

    default:
      errors.push(`Unknown report type: ${reportType}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

