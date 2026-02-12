// src/services/auditService.js
import api from './api';
import { getToken } from './authService';

/**
 * Enterprise Audit Service
 * Provides comprehensive audit logging, trail tracking, and compliance monitoring
 */
const auditService = {
  /**
   * Archive audit logs
   * @param {Object} options - Archive options
   * @param {string} options.logType - Type of logs to archive: 'high-risk' or 'normal'
   * @param {Object} options.filters - Optional filters (fromDate, toDate, entityType, action, status)
   * @param {boolean} options.dryRun - If true, only returns count without archiving
   * @returns {Promise<Object>} Archive result
   */
  archiveLogs: async (options = {}) => {
    try {
      const { logType, filters = {}, dryRun = false } = options;

      if (!logType) {
        throw new Error('logType is required (high-risk or normal)');
      }

      const response = await api.post('/api/audit/archive', {
        logType,
        filters,
        dryRun,
      });

      return response;
    } catch (error) {
      console.error('Error archiving audit logs:', error);
      throw error;
    }
  },

  /**
   * Delete audit logs permanently
   * @param {Object} options - Delete options
   * @param {string} options.logType - Type of logs to delete: 'high-risk' or 'normal'
   * @param {Object} options.filters - Optional filters (fromDate, toDate, entityType, action, status)
   * @param {boolean} options.confirm - Must be true to proceed with deletion
   * @param {boolean} options.dryRun - If true, only returns count without deleting
   * @returns {Promise<Object>} Delete result
   */
  deleteLogs: async (options = {}) => {
    try {
      const { logType, filters = {}, confirm = false, dryRun = false } = options;

      if (!logType) {
        throw new Error('logType is required (high-risk or normal)');
      }

      if (!confirm && !dryRun) {
        throw new Error('Permanent deletion requires explicit confirmation. Set confirm: true');
      }

      const response = await api.delete('/api/audit/delete', {
        data: {
          logType,
          filters,
          confirm,
          dryRun,
        },
      });

      return response;
    } catch (error) {
      console.error('Error deleting audit logs:', error);
      throw error;
    }
  },

  /**
   * Get archived audit logs
   * @param {Object} filters - Filter options
   * @param {string} filters.logType - Filter by log type (high-risk or normal)
   * @param {string} filters.fromDate - Filter from date
   * @param {string} filters.toDate - Filter to date
   * @param {string} filters.archivedBy - Filter by user who archived
   * @param {number} filters.page - Page number (default: 1)
   * @param {number} filters.pageSize - Items per page (default: 50, max: 1000)
   * @returns {Promise<Object>} Archived logs with pagination
   */
  getArchivedLogs: async (filters = {}) => {
    try {
      if (!getToken()) {
        return { archivedLogs: [], pagination: { total: 0, page: 1, pageSize: 50, totalPages: 0 } };
      }
      const queryParams = new URLSearchParams();

      if (filters.logType) queryParams.append('logType', filters.logType);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      if (filters.archivedBy) queryParams.append('archivedBy', filters.archivedBy);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

      const queryString = queryParams.toString();
      const url = `/api/audit/archived${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching archived logs:', error);
      throw error;
    }
  },

  /**
   * Get audit logs with advanced filtering
   * @param {Object} filters - Filter options
   * @param {string} filters.action - Filter by action (CREATE, UPDATE, DELETE, VIEW, etc.)
   * @param {string} filters.userId - Filter by user ID
   * @param {string} filters.entityType - Filter by entity type (TAXPAYER, ASSESSMENT, etc.)
   * @param {string} filters.entityId - Filter by entity ID
   * @param {string} filters.fromDate - Filter from date (YYYY-MM-DD)
   * @param {string} filters.toDate - Filter to date (YYYY-MM-DD)
   * @param {string} filters.riskLevel - Filter by risk level (LOW, MEDIUM, HIGH, CRITICAL)
   * @param {string} filters.status - Filter by status (SUCCESS, FAILED, PENDING)
   * @param {number} filters.page - Page number (default: 1)
   * @param {number} filters.pageSize - Items per page (default: 50, max: 100)
   * @returns {Promise<Object>} Response with logs array and pagination info
   */
  getAuditLogs: async (filters = {}) => {
    try {
      if (!getToken()) {
        return { logs: [], pagination: { total: 0, page: 1, pageSize: 50, totalPages: 0 } };
      }
      const queryParams = new URLSearchParams();
      
      if (filters.action) queryParams.append('action', filters.action);
      if (filters.userId) queryParams.append('userId', filters.userId);
      if (filters.entityType) {
        // Map frontend entity types to backend format
        const entityTypeMap = {
          'TAXPAYER': 'TAXPAYER',
          'ASSESSMENT': 'TAX_ASSESSMENT',
          'PAYMENT': 'PAYMENT',
          'COMPLIANCE': 'COMPLIANCE',
          'USER': 'USER',
        };
        const backendEntityType = entityTypeMap[filters.entityType] || filters.entityType;
        queryParams.append('entityType', backendEntityType);
      }
      if (filters.entityId) queryParams.append('entityId', filters.entityId);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      if (filters.riskLevel) queryParams.append('riskLevel', filters.riskLevel);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `/api/audit/logs?${queryString}` 
        : '/api/audit/logs';

      const response = await api.get(endpoint);
      
      console.log('🔍 Audit Service - Raw Response:', response);
      
      // API interceptor returns response.data directly, so response is already { success: true, data: [...], pagination: {...} }
      // Transform backend snake_case to frontend camelCase
      const rawLogs = response?.data || response?.logs || [];
      
      console.log('📊 Raw Logs Count:', rawLogs.length);
      
      const transformedLogs = rawLogs.map((log) => {
        // Extract entity ID from various possible locations
        const entityId = log.entity_id || log.entityId || 
          log.details?.body?.tin || 
          log.details?.body?.taxpayerId || 
          log.details?.body?.id ||
          'N/A';
        
        // Extract user information
        const userId = log.user_id || log.userId || log.details?.userId || 'ANONYMOUS';
        const userName = log.user_name || log.userName || log.details?.userName || 
          (userId === 'ANONYMOUS' ? 'System User' : `User ${userId}`);
        
        // Extract device info
        const deviceInfo = log.device_info || log.deviceInfo || log.details?.deviceInfo || {};
        
        // Extract location
        const location = log.location || log.details?.location || {};
        
        return {
          id: log.id || log.audit_id || `AUDIT-${Date.now()}-${Math.random()}`,
          timestamp: log.timestamp,
          user: {
            id: userId,
            name: userName,
            role: log.user_role || log.userRole || log.details?.userRole || 'N/A',
            msp: log.user_msp || log.userMsp || 'N/A',
          },
          action: log.action,
          entityType: log.entity_type || log.entityType || 'UNKNOWN',
          entityId: entityId,
          status: log.status,
          riskLevel: log.risk_level || log.riskLevel || 'LOW',
          ipAddress: log.ip_address || log.ipAddress || log.details?.ipAddress || 'N/A',
          deviceInfo: {
            userAgent: deviceInfo.raw || log.user_agent || log.userAgent || 'N/A',
            platform: deviceInfo.os || deviceInfo.platform || 'Unknown',
            browser: deviceInfo.browser || 'Unknown',
          },
          location: {
            country: location.country || log.country || 'Tanzania',
            region: location.region || log.region || 'N/A',
            city: location.city || log.city || 'N/A',
          },
          executionTime: log.execution_time || log.executionTime || log.details?.response?.executionTime || 0,
          details: {
            description: `${log.action} operation on ${log.entity_type || log.entityType || 'UNKNOWN'}`,
            changes: log.changes || (log.before_state || log.after_state ? {
              field: 'status',
              oldValue: log.before_state?.status || 'N/A',
              newValue: log.after_state?.status || log.details?.body?.status || 'N/A',
            } : null),
          },
          blockchainTxId: log.transaction_id || log.transactionId || log.details?.requestId || 'N/A',
        };
      });
      
      return {
        logs: transformedLogs,
        pagination: response?.pagination || null,
        success: response?.success !== false,
      };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },

  /**
   * Get audit trail for a specific entity
   * @param {string} entityType - Entity type (TAXPAYER, ASSESSMENT, etc.)
   * @param {string} entityId - Entity ID
   * @returns {Promise<Array>} Array of trail entries
   */
  getAuditTrail: async (entityType, entityId) => {
    try {
      if (!entityType || !entityId) {
        throw new Error('Entity type and ID are required');
      }
      if (!getToken()) {
        return [];
      }

      const response = await api.get(`/api/audit/trail/${entityType}/${entityId}`);
      
      // API interceptor returns response.data directly
      // Response structure: { success: true, data: { total, page, pageSize, totalPages, data: [...] } }
      // After interceptor: response = { success: true, data: { total, page, pageSize, totalPages, data: [...] } }
      console.log('🔍 getAuditTrail - Raw API Response:', response);
      
      const responseData = response.data || {};
      const trailArray = responseData.data || responseData.trail || [];
      
      console.log(`📊 Found ${trailArray.length} trail entries`);
      
      // Transform backend data to frontend format
      const transformedTrail = trailArray.map((entry) => {
        // Extract user information
        const userId = entry.user_id || entry.userId || entry.details?.userId || 'ANONYMOUS';
        const userName = entry.user_name || entry.userName || entry.details?.userName || 
          (userId === 'ANONYMOUS' ? 'System User' : `User ${userId}`);
        
        return {
          id: entry.id || entry.audit_id || `AUDIT-${Date.now()}-${Math.random()}`,
          timestamp: entry.timestamp,
          user: {
            id: userId,
            name: userName,
            role: entry.user_role || entry.userRole || entry.details?.userRole || 'N/A',
          },
          action: entry.action,
          entityType: entry.entity_type || entry.entityType || 'UNKNOWN',
          entityId: entry.entity_id || entry.entityId || 'N/A',
          status: entry.status,
          riskLevel: entry.risk_level || entry.riskLevel || 'LOW',
          ipAddress: entry.ip_address || entry.ipAddress || entry.details?.ipAddress || 'N/A',
          // Include full details for comprehensive view
          details: {
            ...(entry.details || {}),
            compliance_flags: entry.compliance_flags || entry.details?.compliance_flags || [],
            risk_level: entry.risk_level || entry.riskLevel || 'LOW',
            requires_review: entry.requires_review !== undefined ? entry.requires_review : false,
            changes: entry.changes || entry.details?.changes || [],
            before_state: entry.before_state || entry.details?.before_state,
            after_state: entry.after_state || entry.details?.after_state,
            blockchain_verified: entry.blockchain_verified !== undefined ? entry.blockchain_verified : false,
            blockchain_data: entry.blockchain_data || entry.details?.blockchain_data,
            device_info: entry.device_info || entry.details?.deviceInfo || entry.details?.device_info,
            location: entry.location || entry.details?.location,
            execution_time: entry.execution_time || entry.details?.response?.executionTime,
            response_size: entry.response_size || entry.details?.response?.responseSize,
            // User information from top-level or details
            user_name: entry.user_name || entry.userName || entry.details?.userName || userName,
            user_role: entry.user_role || entry.userRole || entry.details?.userRole || 'N/A',
            user_id: entry.user_id || entry.userId || entry.details?.userId || userId,
            ipAddress: entry.ip_address || entry.ipAddress || entry.details?.ipAddress || 'N/A',
          },
          blockchainTxId: entry.transaction_id || entry.transactionId || entry.details?.requestId || 'N/A',
        };
      });
      
      console.log('✅ Returning transformed trail:', transformedTrail.length, 'entries');
      return transformedTrail;
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      throw error;
    }
  },

  /**
   * Get high-risk transactions
   * @param {Object} filters - Filter options
   * @param {string} filters.riskLevel - Filter by risk level (HIGH, CRITICAL)
   * @param {string} filters.fromDate - Filter from date
   * @param {string} filters.toDate - Filter to date
   * @param {number} filters.page - Page number
   * @param {number} filters.pageSize - Items per page
   * @returns {Promise<Object>} Response with high-risk transactions
   */
  getHighRiskTransactions: async (filters = {}) => {
    try {
      if (!getToken()) {
        return { transactions: [], pagination: { total: 0, page: 1, pageSize: 25, totalPages: 0 } };
      }
      const queryParams = new URLSearchParams();
      
      if (filters.riskLevel) queryParams.append('riskLevel', filters.riskLevel);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `/api/audit/high-risk?${queryString}` 
        : '/api/audit/high-risk';

      const response = await api.get(endpoint);
      
      // API interceptor returns response.data directly, so response is already unwrapped
      // API structure: { success: true, data: { total, page, pageSize, totalPages, data: [...] } }
      // After interceptor: response = { success: true, data: { total, page, pageSize, totalPages, data: [...] } }
      console.log('🔍 getHighRiskTransactions - Raw API Response:', response);
      
      const responseData = response.data || {};
      console.log('📦 Response Data:', responseData);
      
      const transactionsArray = responseData.data || responseData.transactions || [];
      const total = responseData.total || 0;
      const page = responseData.page || 1;
      const pageSize = responseData.pageSize || 25;
      const totalPages = responseData.totalPages || 1;
      
      console.log(`📊 Found ${transactionsArray.length} transactions, total: ${total}`);

      // Transform backend data to frontend format
      const transformedTransactions = transactionsArray.map((transaction) => {
        // Extract user information
        const userId = transaction.user_id || transaction.userId || transaction.details?.userId || 'ANONYMOUS';
        const userName = transaction.user_name || transaction.userName || transaction.details?.userName || 
          (userId === 'ANONYMOUS' ? 'System User' : `User ${userId}`);
        
      return {
          id: transaction.id || transaction.audit_id || `AUDIT-${Date.now()}-${Math.random()}`,
          timestamp: transaction.timestamp,
          user: {
            id: userId,
            name: userName,
            role: transaction.user_role || transaction.userRole || transaction.details?.userRole || 'N/A',
          },
          action: transaction.action,
          entityType: transaction.entity_type || transaction.entityType || 'UNKNOWN',
          entityId: transaction.entity_id || transaction.entityId || 'N/A',
          status: transaction.status,
          riskLevel: transaction.risk_level || transaction.riskLevel || 'HIGH',
          ipAddress: transaction.ip_address || transaction.ipAddress || transaction.details?.ipAddress || 'N/A',
          // Include full details object for detailed view - preserve all risk-related data
          details: {
            ...(transaction.details || {}),
            compliance_flags: transaction.compliance_flags || transaction.details?.compliance_flags || [],
            risk_level: transaction.risk_level || transaction.riskLevel || 'HIGH',
            requires_review: transaction.requires_review !== undefined ? transaction.requires_review : true,
            changes: transaction.changes || transaction.details?.changes || [],
            before_state: transaction.before_state || transaction.details?.before_state,
            after_state: transaction.after_state || transaction.details?.after_state,
            blockchain_verified: transaction.blockchain_verified !== undefined ? transaction.blockchain_verified : false,
            blockchain_data: transaction.blockchain_data || transaction.details?.blockchain_data,
            device_info: transaction.device_info || transaction.details?.deviceInfo || transaction.details?.device_info,
            location: transaction.location || transaction.details?.location,
            execution_time: transaction.execution_time || transaction.details?.response?.executionTime,
            response_size: transaction.response_size || transaction.details?.response?.responseSize,
          },
        };
      });

      const result = {
        transactions: transformedTransactions,
        pagination: {
          total,
          page,
          pageSize,
          totalPages,
        },
        success: response.success !== false,
      };
      
      console.log('✅ Returning transformed result:', result);
      return result;
    } catch (error) {
      console.error('Error fetching high-risk transactions:', error);
      throw error;
    }
  },

  /**
   * Get audit statistics
   * @param {Object} filters - Filter options
   * @param {string} filters.fromDate - Filter from date
   * @param {string} filters.toDate - Filter to date
   * @returns {Promise<Object>} Statistics object
   */
  getAuditStatistics: async (filters = {}) => {
    try {
      if (!getToken()) {
        return {};
      }
      const queryParams = new URLSearchParams();
      
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `/api/audit/statistics?${queryString}` 
        : '/api/audit/statistics';

      const response = await api.get(endpoint);
      return response.data?.statistics || response.statistics || {};
    } catch (error) {
      console.error('Error fetching audit statistics:', error);
      throw error;
    }
  },

  /**
   * Get user activity
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options
   * @param {string} filters.fromDate - Filter from date
   * @param {string} filters.toDate - Filter to date
   * @returns {Promise<Object>} User activity data
   */
  getUserActivity: async (userId, filters = {}) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      if (!getToken()) {
        return {};
      }

      const queryParams = new URLSearchParams();
      
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `/api/audit/user/${userId}?${queryString}` 
        : `/api/audit/user/${userId}`;

      const response = await api.get(endpoint);
      return response.data?.activity || response.activity || {};
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  },

  /**
   * Search audit logs (advanced search)
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.query - Search query
   * @param {Object} searchParams.filters - Additional filters
   * @returns {Promise<Object>} Search results
   */
  searchAuditLogs: async (searchParams) => {
    try {
      const response = await api.post('/api/audit/search', searchParams);
      return {
        logs: response.data?.logs || response.logs || [],
        pagination: response.data?.pagination || response.pagination || null,
        success: response.success !== false,
      };
    } catch (error) {
      console.error('Error searching audit logs:', error);
      throw error;
    }
  },

  /**
   * Get transaction details by transaction ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction details
   */
  getTransactionDetails: async (transactionId) => {
    try {
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }

      const response = await api.get(`/api/audit/transaction/${transactionId}`);
      return response.data?.transaction || response.transaction || {};
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      throw error;
    }
  },

  /**
   * Export audit logs
   * @param {Object} filters - Filter options (same as getAuditLogs)
   * @param {string} format - Export format (CSV, Excel, PDF)
   * @returns {Promise<Blob>} File blob
   */
  exportAuditLogs: async (filters = {}, format = 'CSV') => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      queryParams.append('format', format);

      const response = await api.get(`/api/audit/export?${queryParams.toString()}`, {
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw error;
    }
  },
};

export default auditService;

