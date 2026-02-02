// src/services/paymentService.js
import api from './api';

/**
 * Payment Service
 * Handles all payment-related API operations
 */
const paymentService = {
  /**
   * Record a tax payment
   * @param {string} assessmentId - Assessment ID
   * @param {Object} paymentData - Payment data
   * @param {number} paymentData.amount - Payment amount (required)
   * @param {string} paymentData.paymentMethod - Payment method (optional: BANK_TRANSFER, CASH, MOBILE_MONEY, CHEQUE, CREDIT_CARD, OTHER)
   * @param {string} paymentData.paymentReference - Payment reference number (optional)
   * @param {string} paymentData.paymentDate - Payment date ISO format (optional)
   * @param {string} paymentData.receivedBy - Username of officer (optional)
   * @param {string} paymentData.notes - Additional notes (optional)
   * @returns {Promise<Object>} Payment receipt and updated assessment
   */
  recordPayment: async (assessmentId, paymentData) => {
    try {
      if (!assessmentId) {
        throw new Error('Assessment ID is required');
      }
      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error('Payment amount must be positive');
      }

      const response = await api.post(`/api/tax-assessments/${assessmentId}/payment`, paymentData);
      return response?.data || response;
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  },

  /**
   * Get payment history for an assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<Object>} Payment history
   */
  getPaymentHistory: async (assessmentId) => {
    try {
      if (!assessmentId) {
        throw new Error('Assessment ID is required');
      }

      const response = await api.get(`/api/tax-assessments/${assessmentId}/payments`);
      return response?.data || response;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  /**
   * Get payment receipt by receipt ID
   * @param {string} receiptId - Receipt ID
   * @returns {Promise<Object>} Payment receipt details
   */
  getPaymentReceipt: async (receiptId) => {
    try {
      if (!receiptId) {
        throw new Error('Receipt ID is required');
      }

      const response = await api.get(`/api/tax-assessments/receipts/${receiptId}`);
      return response?.data || response;
    } catch (error) {
      console.error('Error fetching payment receipt:', error);
      throw error;
    }
  },
};

export default paymentService;

