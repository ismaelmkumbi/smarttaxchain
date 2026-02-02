// src/services/userManagementService.js
import api from './api';

/**
 * User Management Service
 * Provides comprehensive user/staff management and data integrity verification
 */
const userManagementService = {
  /**
   * Create a new user (register)
   * @param {Object} userData - User data
   * @param {string} userData.name - Full name (required)
   * @param {string} userData.password - Password (required, min 8 chars)
   * @param {string} userData.email - Email (required, automatically used as username)
   * @param {string} userData.role - Role (optional: admin, officer, auditor, user)
   * @param {string} userData.department - Department (required)
   * @param {string} userData.staffId - Staff ID (optional, auto-generated if not provided)
   * @returns {Promise<Object>} Created user with staff record
   */
  createUser: async (userData) => {
    try {
      // Backend removed username field - email is automatically used as username
      // Use the register endpoint which creates both user and staff records on blockchain
      const response = await api.post('/api/auth/register', userData);
      return response?.data || response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Get all users with filtering and pagination
   * @param {Object} filters - Filter options
   * @param {string} filters.role - Filter by role
   * @param {string} filters.department - Filter by department
   * @param {boolean} filters.isActive - Filter by active status
   * @param {number} filters.limit - Number of results (default: 50)
   * @param {number} filters.offset - Pagination offset
   * @returns {Promise<Object>} Response with users array and pagination info
   */
  getAllUsers: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.offset) queryParams.append('offset', filters.offset.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `/api/auth/users?${queryString}` 
        : '/api/auth/users';

      console.log('Fetching users from:', endpoint);
      const token = localStorage.getItem('authToken');
      console.log('Token available:', !!token);
      
      const response = await api.get(endpoint);
      
      return {
        users: response?.data || [],
        pagination: response?.pagination || null,
        success: response?.success !== false,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Get user by email (username parameter now accepts email)
   * @param {string} email - Email address (used as username internally)
   * @returns {Promise<Object>} User object
   */
  getUserByUsername: async (email) => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      // Backend accepts email in :username parameter
      const response = await api.get(`/api/auth/users/${email}`);
      return response?.data || response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Update user
   * @param {string} email - Email address (used as username internally)
   * @param {Object} updates - Update data (name, email, role, department, is_active)
   * @returns {Promise<Object>} Updated user
   */
  updateUser: async (email, updates) => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      // Backend accepts email in :username parameter
      // When email is updated, username is automatically updated to match
      const response = await api.put(`/api/auth/users/${email}`, updates);
      return response?.data || response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Activate user
   * @param {string} email - Email address (used as username internally)
   * @returns {Promise<Object>} Response
   */
  activateUser: async (email) => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      // Backend accepts email in :username parameter
      const response = await api.put(`/api/auth/users/${email}/activate`);
      return response?.data || response;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  },

  /**
   * Deactivate user
   * @param {string} email - Email address (used as username internally)
   * @returns {Promise<Object>} Response
   */
  deactivateUser: async (email) => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      // Backend accepts email in :username parameter
      const response = await api.put(`/api/auth/users/${email}/deactivate`);
      return response?.data || response;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  },

  /**
   * Delete user
   * @param {string} email - Email address (used as username internally)
   * @returns {Promise<Object>} Response
   */
  deleteUser: async (email) => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      // Backend accepts email in :username parameter
      const response = await api.delete(`/api/auth/users/${email}`);
      return response?.data || response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Verify staff record by staffId
   * @param {string} staffId - Staff ID
   * @returns {Promise<Object>} Verification result
   */
  verifyStaff: async (staffId) => {
    try {
      if (!staffId) {
        throw new Error('Staff ID is required');
      }

      const response = await api.get(`/api/verify/staff/${staffId}`);
      return response?.data || response;
    } catch (error) {
      console.error('Error verifying staff:', error);
      throw error;
    }
  },

  /**
   * Verify user by email (username parameter now accepts email)
   * @param {string} email - Email address (used as username internally)
   * @returns {Promise<Object>} Verification result
   */
  verifyUser: async (email) => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      // Backend accepts email in :username parameter
      const response = await api.get(`/api/verify/user/${email}`);
      return response?.data || response;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  },

  /**
   * Verify all staff records
   * @param {Object} filters - Filter options
   * @param {number} filters.limit - Number of results
   * @param {number} filters.offset - Pagination offset
   * @returns {Promise<Object>} Verification results
   */
  verifyAll: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.offset) queryParams.append('offset', filters.offset.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `/api/verify/all?${queryString}` 
        : '/api/verify/all';

      const response = await api.get(endpoint);
      return response?.data || response;
    } catch (error) {
      console.error('Error verifying all staff:', error);
      throw error;
    }
  },

  /**
   * Get staff transaction history
   * @param {string} staffId - Staff ID
   * @returns {Promise<Array>} Transaction history
   */
  getStaffHistory: async (staffId) => {
    try {
      if (!staffId) {
        throw new Error('Staff ID is required');
      }

      const response = await api.get(`/api/verify/staff/${staffId}/history`);
      return response?.data?.history || response?.history || [];
    } catch (error) {
      console.error('Error fetching staff history:', error);
      throw error;
    }
  },

  /**
   * Get data integrity report
   * @returns {Promise<Object>} Integrity report
   */
  getIntegrityReport: async () => {
    try {
      const response = await api.get('/api/verify/integrity');
      return response?.data || response;
    } catch (error) {
      console.error('Error fetching integrity report:', error);
      throw error;
    }
  },
};

export default userManagementService;

