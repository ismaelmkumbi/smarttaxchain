// src/context/TRAContext.js
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import traApi from '../services/traApiService';
import { getToken } from '../services/authService';

// Add mock data at the top
const MOCK_TAXPAYERS = [
  { id: 'TP001', name: 'John Doe', tin: '123456789', status: 'Active' },
  { id: 'TP002', name: 'Jane Smith', tin: '987654321', status: 'Inactive' },
];
const MOCK_COMPLIANCE_DASHBOARD = {
  averageScore: 85,
  recentAudits: 5,
  riskLevel: 'Medium',
  lastAudit: '2024-06-01',
};
const MOCK_REVENUE_DASHBOARD = {
  total: 68000000000,
  monthly: [5000000000, 5200000000, 5400000000, 5600000000, 6000000000, 6200000000],
};
const MOCK_BLOCKCHAIN_STATS = {
  blockHeight: 12345,
  transactionsToday: 125,
  lastBlockTime: '2024-06-30T12:00:00Z',
};

// Action types
const TRA_ACTIONS = {
  // Loading states
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',

  // Taxpayer management
  SET_TAXPAYERS: 'SET_TAXPAYERS',
  ADD_TAXPAYER: 'ADD_TAXPAYER',
  UPDATE_TAXPAYER: 'UPDATE_TAXPAYER',
  DELETE_TAXPAYER: 'DELETE_TAXPAYER',

  // VAT management
  SET_VAT_TRANSACTIONS: 'SET_VAT_TRANSACTIONS',
  ADD_VAT_TRANSACTION: 'ADD_VAT_TRANSACTION',
  SET_VAT_REPORTS: 'SET_VAT_REPORTS',

  // Compliance management
  SET_COMPLIANCE_SCORES: 'SET_COMPLIANCE_SCORES',
  SET_AUDITS: 'SET_AUDITS',
  SET_PENALTIES: 'SET_PENALTIES',
  SET_COMPLIANCE_DASHBOARD: 'SET_COMPLIANCE_DASHBOARD',

  // Revenue and analytics
  SET_REVENUE_DASHBOARD: 'SET_REVENUE_DASHBOARD',
  SET_COMPLIANCE_ANALYTICS: 'SET_COMPLIANCE_ANALYTICS',

  // Interoperability
  SET_SYSTEM_STATUS: 'SET_SYSTEM_STATUS',
  SET_NIDA_SYNC: 'SET_NIDA_SYNC',

  // Blockchain
  SET_BLOCKCHAIN_STATS: 'SET_BLOCKCHAIN_STATS',
  SET_TRANSACTION_HISTORY: 'SET_TRANSACTION_HISTORY',

  // Alerts and notifications
  SET_ALERTS: 'SET_ALERTS',
  ADD_ALERT: 'ADD_ALERT',
  CLEAR_ALERT: 'CLEAR_ALERT',

  // AI and insights
  SET_AI_INSIGHTS: 'SET_AI_INSIGHTS',
  SET_PREDICTIONS: 'SET_PREDICTIONS',

  // Mobile and USSD
  SET_MOBILE_DASHBOARD: 'SET_MOBILE_DASHBOARD',
  SET_USSD_STATUS: 'SET_USSD_STATUS',
};

// Initial state
const initialState = {
  // Loading and error states
  loading: false,
  error: null,

  // Taxpayer data
  taxpayers: [],
  selectedTaxpayer: null,

  // VAT data
  vatTransactions: [],
  vatReports: {},

  // Compliance data
  complianceScores: {},
  audits: [],
  penalties: [],
  complianceDashboard: null,

  // Revenue and analytics
  revenueDashboard: null,
  complianceAnalytics: null,

  // Interoperability
  systemStatus: {},
  nidaSyncStatus: {},

  // Blockchain
  blockchainStats: null,
  transactionHistory: [],

  // Alerts and notifications
  alerts: [],
  notifications: [],

  // AI and insights
  aiInsights: {},
  predictions: {},

  // Mobile and USSD
  mobileDashboard: null,
  ussdStatus: {},

  // Real-time data
  realTimeData: {
    lastUpdated: null,
    activeConnections: 0,
    blockchainHeight: 0,
  },
};

// Reducer function
const traReducer = (state, action) => {
  switch (action.type) {
    case TRA_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case TRA_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case TRA_ACTIONS.SET_TAXPAYERS:
      return { ...state, taxpayers: action.payload };

    case TRA_ACTIONS.ADD_TAXPAYER:
      return {
        ...state,
        taxpayers: [...state.taxpayers, action.payload],
        selectedTaxpayer: action.payload,
      };

    case TRA_ACTIONS.UPDATE_TAXPAYER:
      return {
        ...state,
        taxpayers: state.taxpayers.map((tp) => (tp.id === action.payload.id ? action.payload : tp)),
        selectedTaxpayer:
          state.selectedTaxpayer?.id === action.payload.id
            ? action.payload
            : state.selectedTaxpayer,
      };

    case TRA_ACTIONS.DELETE_TAXPAYER:
      return {
        ...state,
        taxpayers: state.taxpayers.filter((tp) => tp.id !== action.payload),
        selectedTaxpayer:
          state.selectedTaxpayer?.id === action.payload ? null : state.selectedTaxpayer,
      };

    case TRA_ACTIONS.SET_VAT_TRANSACTIONS:
      return { ...state, vatTransactions: action.payload };

    case TRA_ACTIONS.ADD_VAT_TRANSACTION:
      return {
        ...state,
        vatTransactions: [action.payload, ...state.vatTransactions],
      };

    case TRA_ACTIONS.SET_VAT_REPORTS:
      return { ...state, vatReports: action.payload };

    case TRA_ACTIONS.SET_COMPLIANCE_SCORES:
      return { ...state, complianceScores: action.payload };

    case TRA_ACTIONS.SET_AUDITS:
      return { ...state, audits: action.payload };

    case TRA_ACTIONS.SET_PENALTIES:
      return { ...state, penalties: action.payload };

    case TRA_ACTIONS.SET_COMPLIANCE_DASHBOARD:
      return { ...state, complianceDashboard: action.payload };

    case TRA_ACTIONS.SET_REVENUE_DASHBOARD:
      return { ...state, revenueDashboard: action.payload };

    case TRA_ACTIONS.SET_COMPLIANCE_ANALYTICS:
      return { ...state, complianceAnalytics: action.payload };

    case TRA_ACTIONS.SET_SYSTEM_STATUS:
      return { ...state, systemStatus: action.payload };

    case TRA_ACTIONS.SET_NIDA_SYNC:
      return { ...state, nidaSyncStatus: action.payload };

    case TRA_ACTIONS.SET_BLOCKCHAIN_STATS:
      return { ...state, blockchainStats: action.payload };

    case TRA_ACTIONS.SET_TRANSACTION_HISTORY:
      return { ...state, transactionHistory: action.payload };

    case TRA_ACTIONS.SET_ALERTS:
      return { ...state, alerts: action.payload };

    case TRA_ACTIONS.ADD_ALERT:
      return {
        ...state,
        alerts: [action.payload, ...state.alerts],
      };

    case TRA_ACTIONS.CLEAR_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      };

    case TRA_ACTIONS.SET_AI_INSIGHTS:
      return { ...state, aiInsights: action.payload };

    case TRA_ACTIONS.SET_PREDICTIONS:
      return { ...state, predictions: action.payload };

    case TRA_ACTIONS.SET_MOBILE_DASHBOARD:
      return { ...state, mobileDashboard: action.payload };

    case TRA_ACTIONS.SET_USSD_STATUS:
      return { ...state, ussdStatus: action.payload };

    default:
      return state;
  }
};

// Create context
const TRAContext = createContext();

// Provider component
export const TRAProvider = ({ children }) => {
  const [state, dispatch] = useReducer(traReducer, initialState);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: TRA_ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: TRA_ACTIONS.SET_ERROR, payload: error }),

    // Taxpayer management
    loadTaxpayers: useCallback(async (filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getAllTaxpayers(filters);
        dispatch({ type: TRA_ACTIONS.SET_TAXPAYERS, payload: response.taxpayers });
        return response;
      } catch (error) {
        // Fallback to mock data
        dispatch({ type: TRA_ACTIONS.SET_TAXPAYERS, payload: MOCK_TAXPAYERS });
        return { taxpayers: MOCK_TAXPAYERS };
      } finally {
        actions.setLoading(false);
      }
    }, []),

    registerTaxpayer: useCallback(async (taxpayerData) => {
      try {
        actions.setLoading(true);
        const response = await traApi.registerTaxpayer(taxpayerData);
        dispatch({ type: TRA_ACTIONS.ADD_TAXPAYER, payload: response.taxpayer });
        return response;
      } catch (error) {
        // Extract error message as string
        const errorMessage = error?.message || 
                           error?.error?.message || 
                           error?.response?.data?.error?.message ||
                           error?.response?.data?.message ||
                           (typeof error === 'string' ? error : 'Registration failed. Please try again.');
        
        // Set error as string message, not object
        actions.setError(errorMessage);
        
        // Create a new error with proper message for throwing
        const formattedError = new Error(errorMessage);
        formattedError.details = error?.details || error?.error?.details || error?.response?.data?.error?.details;
        formattedError.code = error?.code || error?.error?.code || error?.response?.data?.error?.code;
        throw formattedError;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    updateTaxpayer: useCallback(async (id, updates) => {
      try {
        actions.setLoading(true);
        const response = await traApi.updateTaxpayer(id, updates);
        dispatch({ type: TRA_ACTIONS.UPDATE_TAXPAYER, payload: response.taxpayer });
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    deleteTaxpayer: useCallback(async (id) => {
      try {
        actions.setLoading(true);
        await traApi.deleteTaxpayer(id);
        dispatch({ type: TRA_ACTIONS.DELETE_TAXPAYER, payload: id });
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // VAT management
    loadVATTransactions: useCallback(async (filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getVATTransactions(filters);
        dispatch({ type: TRA_ACTIONS.SET_VAT_TRANSACTIONS, payload: response.transactions });
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    recordVATTransaction: useCallback(async (transactionData) => {
      try {
        actions.setLoading(true);
        const response = await traApi.recordVATTransaction(transactionData);
        dispatch({ type: TRA_ACTIONS.ADD_VAT_TRANSACTION, payload: response.transaction });
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    generateVATReport: useCallback(
      async (taxpayerId, period, year) => {
        try {
          actions.setLoading(true);
          const response = await traApi.generateVATReport(taxpayerId, period, year);
          dispatch({
            type: TRA_ACTIONS.SET_VAT_REPORTS,
            payload: { ...state.vatReports, [`${taxpayerId}-${period}-${year}`]: response.report },
          });
          return response;
        } catch (error) {
          actions.setError(error);
          throw error;
        } finally {
          actions.setLoading(false);
        }
      },
      [state.vatReports],
    ),

    // Compliance management
    loadComplianceScore: useCallback(
      async (taxpayerId) => {
        try {
          const response = await traApi.getComplianceScore(taxpayerId);
          dispatch({
            type: TRA_ACTIONS.SET_COMPLIANCE_SCORES,
            payload: { ...state.complianceScores, [taxpayerId]: response },
          });
          return response;
        } catch (error) {
          actions.setError(error);
          throw error;
        }
      },
      [state.complianceScores],
    ),

    scheduleAudit: useCallback(
      async (auditData) => {
        try {
          actions.setLoading(true);
          const response = await traApi.scheduleAudit(auditData);
          dispatch({ type: TRA_ACTIONS.SET_AUDITS, payload: [...state.audits, response.audit] });
          return response;
        } catch (error) {
          actions.setError(error);
          throw error;
        } finally {
          actions.setLoading(false);
        }
      },
      [state.audits],
    ),

    loadComplianceDashboard: useCallback(async () => {
      try {
        actions.setLoading(true);
        const response = await traApi.getComplianceDashboard();
        dispatch({ type: TRA_ACTIONS.SET_COMPLIANCE_DASHBOARD, payload: response });
        return response;
      } catch (error) {
        // Fallback to mock data
        dispatch({
          type: TRA_ACTIONS.SET_COMPLIANCE_DASHBOARD,
          payload: MOCK_COMPLIANCE_DASHBOARD,
        });
        return MOCK_COMPLIANCE_DASHBOARD;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Revenue and analytics
    loadRevenueDashboard: useCallback(async (period = 'monthly') => {
      try {
        actions.setLoading(true);
        const response = await traApi.getRevenueDashboard(period);
        dispatch({ type: TRA_ACTIONS.SET_REVENUE_DASHBOARD, payload: response });
        return response;
      } catch (error) {
        // Fallback to mock data
        dispatch({ type: TRA_ACTIONS.SET_REVENUE_DASHBOARD, payload: MOCK_REVENUE_DASHBOARD });
        return MOCK_REVENUE_DASHBOARD;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    loadComplianceAnalytics: useCallback(async (filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getComplianceAnalytics(filters);
        dispatch({ type: TRA_ACTIONS.SET_COMPLIANCE_ANALYTICS, payload: response });
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Get all taxpayers with compliance data
    loadComplianceTaxpayers: useCallback(async (filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getComplianceTaxpayers(filters);
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Get risk assessment
    loadRiskAssessment: useCallback(async (tin) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getRiskAssessment(tin);
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Get all audits
    loadAllAudits: useCallback(async (filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getAllAudits(filters);
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Get all penalties
    loadAllPenalties: useCallback(async (filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getAllPenalties(filters);
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Calculate compliance score
    calculateComplianceScore: useCallback(async (taxpayerId, forceRecalculation = false) => {
      try {
        actions.setLoading(true);
        const response = await traApi.calculateComplianceScore(taxpayerId, forceRecalculation);
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Get compliance reports
    getComplianceReports: useCallback(async (filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getComplianceReports(filters);
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Verify compliance record
    verifyComplianceRecord: useCallback(async (recordId, recordType) => {
      try {
        actions.setLoading(true);
        const response = await traApi.verifyComplianceRecord(recordId, recordType);
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // ==================== ENTERPRISE AUDIT MODULE ====================

    // Get audit logs with advanced filtering
    loadAuditLogs: useCallback(async (filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getAuditLogs(filters);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Get audit trail for a specific entity
    loadAuditTrail: useCallback(async (entityType, entityId) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getAuditTrail(entityType, entityId);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Get high-risk audit operations
    loadHighRiskAudits: useCallback(async (filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getHighRiskAudits(filters);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Get audit operations by user
    loadUserAuditActivity: useCallback(async (userId, filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getUserAuditActivity(userId, filters);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Search audit logs
    searchAuditLogs: useCallback(async (searchParams) => {
      try {
        actions.setLoading(true);
        const response = await traApi.searchAuditLogs(searchParams);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Get audit statistics
    loadAuditStatistics: useCallback(async (filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getAuditStatistics(filters);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Get transaction details
    loadTransactionDetails: useCallback(async (transactionId) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getTransactionDetails(transactionId);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Verify blockchain transaction
    verifyBlockchainTransaction: useCallback(async (transactionId) => {
      try {
        actions.setLoading(true);
        const response = await traApi.verifyBlockchainTransaction(transactionId);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Export audit logs
    exportAuditLogs: useCallback(async (filters = {}, format = 'CSV') => {
      try {
        actions.setLoading(true);
        const response = await traApi.exportAuditLogs(filters, format);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // Interoperability
    syncWithNIDA: useCallback(
      async (taxpayerId, nidaData) => {
        try {
          actions.setLoading(true);
          const response = await traApi.syncWithNIDA(taxpayerId, nidaData);
          dispatch({
            type: TRA_ACTIONS.SET_NIDA_SYNC,
            payload: { ...state.nidaSyncStatus, [taxpayerId]: response },
          });
          return response;
        } catch (error) {
          actions.setError(error);
          throw error;
        } finally {
          actions.setLoading(false);
        }
      },
      [state.nidaSyncStatus],
    ),

    // Blockchain
    loadBlockchainStats: useCallback(async () => {
      if (!getToken()) {
        dispatch({ type: TRA_ACTIONS.SET_BLOCKCHAIN_STATS, payload: MOCK_BLOCKCHAIN_STATS });
        return MOCK_BLOCKCHAIN_STATS;
      }
      try {
        const response = await traApi.getBlockchainStats();
        dispatch({ type: TRA_ACTIONS.SET_BLOCKCHAIN_STATS, payload: response });
        return response;
      } catch (error) {
        dispatch({ type: TRA_ACTIONS.SET_BLOCKCHAIN_STATS, payload: MOCK_BLOCKCHAIN_STATS });
        return MOCK_BLOCKCHAIN_STATS;
      }
    }, []),

    loadTransactionHistory: useCallback(async (taxpayerId, filters = {}) => {
      try {
        actions.setLoading(true);
        const response = await traApi.getTransactionHistory(taxpayerId, filters);
        dispatch({ type: TRA_ACTIONS.SET_TRANSACTION_HISTORY, payload: response.transactions });
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }, []),

    // AI and insights
    getAIInsights: useCallback(
      async (taxpayerId) => {
        try {
          const response = await traApi.getAIInsights(taxpayerId);
          dispatch({
            type: TRA_ACTIONS.SET_AI_INSIGHTS,
            payload: { ...state.aiInsights, [taxpayerId]: response },
          });
          return response;
        } catch (error) {
          actions.setError(error);
          throw error;
        }
      },
      [state.aiInsights],
    ),

    predictTaxLiability: useCallback(
      async (predictionData) => {
        try {
          actions.setLoading(true);
          const response = await traApi.predictTaxLiability(predictionData);
          dispatch({
            type: TRA_ACTIONS.SET_PREDICTIONS,
            payload: { ...state.predictions, [predictionData.taxpayerId]: response },
          });
          return response;
        } catch (error) {
          actions.setError(error);
          throw error;
        } finally {
          actions.setLoading(false);
        }
      },
      [state.predictions],
    ),

    // Alerts and notifications
    loadAlerts: useCallback(async (filters = {}) => {
      try {
        const response = await traApi.getAlerts(filters);
        dispatch({ type: TRA_ACTIONS.SET_ALERTS, payload: response.alerts });
        return response;
      } catch (error) {
        actions.setError(error);
        throw error;
      }
    }, []),

    addAlert: useCallback((alert) => {
      dispatch({ type: TRA_ACTIONS.ADD_ALERT, payload: alert });
    }, []),

    clearAlert: useCallback((alertId) => {
      dispatch({ type: TRA_ACTIONS.CLEAR_ALERT, payload: alertId });
    }, []),

    // Mobile and USSD
    checkUSSDStatus: useCallback(
      async (phoneNumber, tin) => {
        try {
          const response = await traApi.checkUSSDStatus(phoneNumber, tin);
          dispatch({
            type: TRA_ACTIONS.SET_USSD_STATUS,
            payload: { ...state.ussdStatus, [`${phoneNumber}-${tin}`]: response },
          });
          return response;
        } catch (error) {
          actions.setError(error);
          throw error;
        }
      },
      [state.ussdStatus],
    ),

    // Utility functions
    clearError: useCallback(() => {
      dispatch({ type: TRA_ACTIONS.SET_ERROR, payload: null });
    }, []),

    // Real-time data updates
    updateRealTimeData: useCallback(
      (data) => {
        // This would be called by WebSocket or polling updates
        // For now, we'll just update the lastUpdated timestamp
        dispatch({
          type: 'UPDATE_REAL_TIME_DATA',
          payload: { ...state.realTimeData, lastUpdated: new Date().toISOString() },
        });
      },
      [state.realTimeData],
    ),
  };

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load initial data
        await Promise.all([
          actions.loadTaxpayers(),
          actions.loadComplianceDashboard(),
          actions.loadRevenueDashboard(),
          actions.loadBlockchainStats(),
        ]);
      } catch (error) {
        console.error('Failed to initialize TRA data:', error);
      }
    };

    initializeData();
  }, []);

  // Set up real-time updates (WebSocket or polling)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Update real-time data every 30 seconds
        await actions.loadBlockchainStats();
        actions.updateRealTimeData();
      } catch (error) {
        console.error('Failed to update real-time data:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const contextValue = {
    ...state,
    ...actions,
  };

  return <TRAContext.Provider value={contextValue}>{children}</TRAContext.Provider>;
};

// Custom hook for using TRA context
export const useTRA = () => {
  const context = useContext(TRAContext);
  if (!context) {
    throw new Error('useTRA must be used within a TRAProvider');
  }
  return context;
};

export default TRAContext;
