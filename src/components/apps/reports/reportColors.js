// src/components/apps/reports/reportColors.js
/**
 * Report Color Scheme
 * Consistent color palette for the Reports module based on TRA brand guidelines
 */

export const REPORT_COLORS = {
  // Primary Brand Colors (TRA)
  primary: {
    main: '#002855', // TRA Primary Blue - Professional, authoritative
    light: '#E6ECF5',
    dark: '#001B3D',
    contrastText: '#ffffff',
  },

  secondary: {
    main: '#FFD100', // TRA Signature Yellow - Energy, attention
    light: '#FFF5CC',
    dark: '#E6B800',
    contrastText: '#2A3547',
  },

  // Report Type Specific Colors
  reportTypes: {
    // Payment & Receipt Reports - Green (Success, Money)
    payment: {
      main: '#13DEB9', // TRA Success Green
      light: '#E6FFFA',
      dark: '#02B3A9',
      contrastText: '#ffffff',
      icon: '#13DEB9',
      background: '#E6FFFA',
    },

    // Assessment Reports - Blue (Information, Official)
    assessment: {
      main: '#539BFF', // TRA Info Blue
      light: '#EBF3FE',
      dark: '#1682FB',
      contrastText: '#ffffff',
      icon: '#539BFF',
      background: '#EBF3FE',
    },

    // Compliance & Security Reports - Red/Orange (Warning, Important)
    compliance: {
      main: '#FA896B', // TRA Error/Alert Red
      light: '#FDEDE8',
      dark: '#F3704D',
      contrastText: '#ffffff',
      icon: '#FA896B',
      background: '#FDEDE8',
    },

    // Certificate Reports - Gold (Prestige, Achievement)
    certificate: {
      main: '#D4A419', // TRA Accent Gold
      light: '#F8F2E6',
      dark: '#BA8F16',
      contrastText: '#ffffff',
      icon: '#D4A419',
      background: '#F8F2E6',
    },

    // History & Ledger Reports - Purple/Indigo (Historical, Archive)
    history: {
      main: '#7C3AED', // Professional Purple
      light: '#F3E8FF',
      dark: '#5B21B6',
      contrastText: '#ffffff',
      icon: '#7C3AED',
      background: '#F3E8FF',
    },

    // Revenue & Analytics Reports - Teal (Growth, Analytics)
    revenue: {
      main: '#14B8A6', // Teal
      light: '#E6FFFA',
      dark: '#0D9488',
      contrastText: '#ffffff',
      icon: '#14B8A6',
      background: '#E6FFFA',
    },

    // Audit & Trail Reports - Orange (Warning, Review)
    audit: {
      main: '#FFAE1F', // TRA Warning Orange
      light: '#FEF5E7',
      dark: '#AE8E59',
      contrastText: '#ffffff',
      icon: '#FFAE1F',
      background: '#FEF5E7',
    },

    // Outstanding & Pending Reports - Amber (Attention, Action Required)
    outstanding: {
      main: '#F59E0B', // Amber
      light: '#FFFBEB',
      dark: '#D97706',
      contrastText: '#ffffff',
      icon: '#F59E0B',
      background: '#FFFBEB',
    },
  },

  // Status Colors (for report states)
  status: {
    success: {
      main: '#13DEB9',
      light: '#E6FFFA',
      dark: '#02B3A9',
    },
    error: {
      main: '#FA896B',
      light: '#FDEDE8',
      dark: '#F3704D',
    },
    warning: {
      main: '#FFAE1F',
      light: '#FEF5E7',
      dark: '#AE8E59',
    },
    info: {
      main: '#539BFF',
      light: '#EBF3FE',
      dark: '#1682FB',
    },
    pending: {
      main: '#F59E0B',
      light: '#FFFBEB',
      dark: '#D97706',
    },
  },

  // Neutral Colors (for backgrounds, borders, text)
  neutral: {
    50: '#FAFBFB',
    100: '#F2F6FA',
    200: '#E5EDF5',
    300: '#C8D9E8',
    400: '#9FB4C7',
    500: '#7C8FAC',
    600: '#5A6A85',
    700: '#2A3547',
    800: '#212936',
    900: '#1A202C',
  },

  // Background Colors
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    elevated: '#FAFBFB',
    hover: '#F2F6FA',
    selected: '#E6ECF5',
  },

  // Border Colors
  border: {
    default: '#E5EDF5',
    hover: '#C8D9E8',
    focus: '#002855',
    error: '#FA896B',
  },
};

/**
 * Get color scheme for a specific report type
 * @param {string} reportType - Report type identifier
 * @returns {Object} Color scheme object
 */
export const getReportTypeColors = (reportType) => {
  const typeMap = {
    // Payment related
    'payment-receipt': REPORT_COLORS.reportTypes.payment,
    'payment-history': REPORT_COLORS.reportTypes.payment,

    // Assessment related
    'tax-assessment-statement': REPORT_COLORS.reportTypes.assessment,
    'assessment-ledger': REPORT_COLORS.reportTypes.assessment,

    // Compliance related
    'compliance-report': REPORT_COLORS.reportTypes.compliance,
    'audit-trail': REPORT_COLORS.reportTypes.audit,

    // Certificate related
    'tax-clearance-certificate': REPORT_COLORS.reportTypes.certificate,
    'registration-certificate': REPORT_COLORS.reportTypes.certificate,

    // Outstanding & Revenue
    'outstanding-tax': REPORT_COLORS.reportTypes.outstanding,
    'revenue-collection': REPORT_COLORS.reportTypes.revenue,
  };

  return typeMap[reportType] || REPORT_COLORS.reportTypes.assessment;
};

/**
 * Get MUI color prop value for report type
 * Maps report colors to MUI semantic colors
 * @param {string} reportType - Report type identifier
 * @returns {string} MUI color name ('primary', 'success', 'error', 'warning', 'info')
 */
export const getReportMUIColor = (reportType) => {
  const colorMap = {
    'payment-receipt': 'success',
    'payment-history': 'success',
    'tax-assessment-statement': 'primary',
    'assessment-ledger': 'primary',
    'compliance-report': 'error',
    'audit-trail': 'warning',
    'tax-clearance-certificate': 'warning',
    'registration-certificate': 'warning',
    'outstanding-tax': 'warning',
    'revenue-collection': 'info',
  };

  return colorMap[reportType] || 'primary';
};

export default REPORT_COLORS;

