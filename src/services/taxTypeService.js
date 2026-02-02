import api from './api';

/**
 * Tax Type Service
 * Handles all API interactions related to tax type management
 */
const taxTypeService = {
  /**
   * Get all tax types
   * @param {Object} filters - Optional filters (active, status)
   * @returns {Promise<Array>} Array of tax types
   */
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.active !== undefined) {
        params.append('active', filters.active);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }

      const queryString = params.toString();
      const url = queryString ? `/api/tax-types?${queryString}` : '/api/tax-types';
      
      const response = await api.get(url);
      return response.taxTypes || response.data?.taxTypes || [];
    } catch (error) {
      console.error('Error fetching tax types:', error);
      throw error;
    }
  },

  /**
   * Get tax type by code
   * @param {string} code - Tax type code
   * @returns {Promise<Object>} Tax type object
   */
  getByCode: async (code) => {
    try {
      if (!code) {
        throw new Error('Tax type code is required');
      }
      const response = await api.get(`/api/tax-types/${encodeURIComponent(code)}`);
      return response.taxType || response.data?.taxType || response;
    } catch (error) {
      console.error('Error fetching tax type:', error);
      throw error;
    }
  },

  /**
   * Create a new tax type
   * @param {Object} taxTypeData - Tax type data
   * @returns {Promise<Object>} Created tax type
   */
  create: async (taxTypeData) => {
    try {
      const response = await api.post('/api/tax-types', taxTypeData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating tax type:', error);
      throw error;
    }
  },

  /**
   * Update an existing tax type
   * @param {string} code - Tax type code
   * @param {Object} updates - Update data
   * @returns {Promise<Object>} Updated tax type
   */
  update: async (code, updates) => {
    try {
      if (!code) {
        throw new Error('Tax type code is required');
      }
      const response = await api.put(`/api/tax-types/${encodeURIComponent(code)}`, updates);
      return response.data || response;
    } catch (error) {
      console.error('Error updating tax type:', error);
      throw error;
    }
  },

  /**
   * Delete (deactivate) a tax type
   * @param {string} code - Tax type code
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (code) => {
    try {
      if (!code) {
        throw new Error('Tax type code is required');
      }
      const response = await api.delete(`/api/tax-types/${encodeURIComponent(code)}`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting tax type:', error);
      throw error;
    }
  },

  /**
   * Get tax types by category
   * @param {string} category - Category (DIRECT or INDIRECT)
   * @returns {Promise<Array>} Array of tax types
   */
  getByCategory: async (category) => {
    try {
      if (!category) {
        throw new Error('Category is required');
      }
      const response = await api.get(`/api/tax-types/category/${encodeURIComponent(category)}`);
      return response.taxTypes || response.data?.taxTypes || [];
    } catch (error) {
      console.error('Error fetching tax types by category:', error);
      throw error;
    }
  },
};

export default taxTypeService;
