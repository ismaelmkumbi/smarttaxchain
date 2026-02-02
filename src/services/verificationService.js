/**
 * Taxpayer Verification Portal API Service
 * Handles all API calls for the verification portal
 */

import api from './api';
import { mockAPIResponses, simulateAPIDelay } from '../components/verification-portal/testData';

// Check if we should use mock data (when backend is not available)
// In Vite, use import.meta.env instead of process.env
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || 
                      import.meta.env.DEV || 
                      import.meta.env.MODE === 'development';

const verificationService = {
  /**
   * Request OTP for verification
   * @param {string} tin - Taxpayer Identification Number
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<{success: boolean, message: string, otpSent: boolean}>}
   */
  requestOTP: async (tin, assessmentId) => {
    // Use mock data if enabled or if API fails
    if (USE_MOCK_DATA) {
      console.log('📧 [MOCK] Requesting OTP for TIN:', tin, 'Assessment:', assessmentId);
      await simulateAPIDelay(1000);
      return {
        success: true,
        message: 'OTP sent successfully to your registered email/phone',
        otpSent: true,
        expiresIn: 300,
      };
    }

    try {
      const response = await api.post('/api/verification/request-otp', {
        tin,
        assessmentId,
      });
      return response;
    } catch (error) {
      // API interceptor returns error as { status, message, context }
      // If API fails and we're in development, fall back to mock
      if (import.meta.env.DEV || error.status === 0 || error.status === 404) {
        console.warn('⚠️ API call failed, using mock data:', error.message || error);
        await simulateAPIDelay(1000);
        return {
          success: true,
          message: 'OTP sent successfully to your registered email/phone (MOCK)',
          otpSent: true,
          expiresIn: 300,
        };
      }
      
      const errorMessage = error.message || 
                          error.response?.data?.message || 
                          'Failed to send OTP. Please try again.';
      throw new Error(errorMessage);
    }
  },

  /**
   * Verify assessment with OTP
   * @param {string} tin - Taxpayer Identification Number
   * @param {string} assessmentId - Assessment ID
   * @param {string} otp - One-time password
   * @returns {Promise<Object>} Assessment data with audit trail
   */
  verifyAssessment: async (tin, assessmentId, otp) => {
    // Use mock data if enabled or if API fails
    if (USE_MOCK_DATA) {
      console.log('✅ [MOCK] Verifying assessment:', { tin, assessmentId, otp });
      await simulateAPIDelay(1500);
      
      // Import mock data dynamically to avoid circular dependencies
      const { mockAssessmentData } = await import('../components/verification-portal/testData');
      
      // Validate OTP format (any 6 digits for mock)
      if (!otp || otp.length !== 6) {
        throw new Error('Invalid OTP format. OTP must be 6 digits.');
      }
      
      return mockAssessmentData;
    }

    try {
      const response = await api.post('/api/verification/verify', {
        tin,
        assessmentId,
        otp,
      });
      return response;
    } catch (error) {
      // API interceptor returns error as { status, message, context }
      // If API fails and we're in development, fall back to mock
      if (import.meta.env.DEV || error.status === 0 || error.status === 404) {
        console.warn('⚠️ API call failed, using mock data:', error.message || error);
        await simulateAPIDelay(1500);
        
        const { mockAssessmentData } = await import('../components/verification-portal/testData');
        return mockAssessmentData;
      }
      
      const errorMessage = error.message || 
                          error.response?.data?.message || 
                          'Verification failed. Please check your details.';
      throw new Error(errorMessage);
    }
  },

  /**
   * Get assessment verification details (without OTP - for already verified sessions)
   * @param {string} assessmentId - Assessment ID
   * @param {string} sessionToken - Session token from previous verification
   * @returns {Promise<Object>} Assessment data
   */
  getAssessmentDetails: async (assessmentId, sessionToken) => {
    try {
      const response = await api.get(`/api/verification/assessment/${assessmentId}`, {
        headers: {
          'X-Session-Token': sessionToken,
        },
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to load assessment details.'
      );
    }
  },

  /**
   * Get audit trail for assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} sessionToken - Session token
   * @returns {Promise<Array>} Audit trail entries
   */
  getAuditTrail: async (assessmentId, sessionToken) => {
    try {
      const response = await api.get(`/api/verification/audit-trail/${assessmentId}`, {
        headers: {
          'X-Session-Token': sessionToken,
        },
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to load audit trail.'
      );
    }
  },

  /**
   * Get payment history for assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} sessionToken - Session token
   * @returns {Promise<Array>} Payment records
   */
  getPaymentHistory: async (assessmentId, sessionToken) => {
    try {
      const response = await api.get(`/api/verification/payments/${assessmentId}`, {
        headers: {
          'X-Session-Token': sessionToken,
        },
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to load payment history.'
      );
    }
  },

  /**
   * Download PDF report
   * @param {string} assessmentId - Assessment ID
   * @param {string} sessionToken - Session token
   * @returns {Promise<Blob>} PDF file
   */
  downloadPDF: async (assessmentId, sessionToken) => {
    try {
      const response = await api.get(`/api/verification/report/${assessmentId}/pdf`, {
        headers: {
          'X-Session-Token': sessionToken,
        },
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to download PDF report.'
      );
    }
  },

  /**
   * Verify blockchain transaction
   * @param {string} txId - Transaction ID
   * @returns {Promise<Object>} Verification result
   */
  verifyBlockchain: async (txId) => {
    try {
      const response = await api.get(`/api/verification/blockchain/${txId}`);
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to verify blockchain transaction.'
      );
    }
  },

  /**
   * Report an issue
   * @param {string} assessmentId - Assessment ID
   * @param {Object} issueData - Issue details
   * @param {string} sessionToken - Session token
   * @returns {Promise<Object>} Report submission result
   */
  reportIssue: async (assessmentId, issueData, sessionToken) => {
    try {
      const response = await api.post(
        `/api/verification/report-issue/${assessmentId}`,
        issueData,
        {
          headers: {
            'X-Session-Token': sessionToken,
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to submit issue report.'
      );
    }
  },
};

export default verificationService;

