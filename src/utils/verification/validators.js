/**
 * Validators for Verification Portal Forms
 */

/**
 * Validate TIN format
 * TIN should be 9 digits
 */
export const validateTIN = (tin) => {
  if (!tin) {
    return { valid: false, error: 'TIN is required' };
  }
  const cleaned = tin.replace(/\D/g, '');
  if (cleaned.length !== 9) {
    return { valid: false, error: 'TIN must be 9 digits' };
  }
  return { valid: true, error: null };
};

/**
 * Validate Assessment ID format
 * Assessment ID format: ASSESS-YYYY-{timestamp}-{random}
 */
export const validateAssessmentId = (assessmentId) => {
  if (!assessmentId) {
    return { valid: false, error: 'Assessment ID is required' };
  }
  if (!assessmentId.startsWith('ASSESS-')) {
    return { valid: false, error: 'Invalid Assessment ID format' };
  }
  return { valid: true, error: null };
};

/**
 * Validate OTP format
 * OTP should be 6 digits
 */
export const validateOTP = (otp) => {
  if (!otp) {
    return { valid: false, error: 'OTP is required' };
  }
  const cleaned = otp.replace(/\D/g, '');
  if (cleaned.length !== 6) {
    return { valid: false, error: 'OTP must be 6 digits' };
  }
  return { valid: true, error: null };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true, error: null };
};

/**
 * Validate phone number format
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 9 || cleaned.length > 15) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  return { valid: true, error: null };
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

