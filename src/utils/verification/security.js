/**
 * Security utilities for Verification Portal
 */

/**
 * Mask TIN for display (show only last 3 digits)
 */
export const maskTIN = (tin) => {
  if (!tin) return 'N/A';
  const cleaned = tin.replace(/\D/g, '');
  if (cleaned.length <= 3) return '***';
  return `***${cleaned.slice(-3)}`;
};

/**
 * Mask email for display (show first 2 chars and domain)
 */
export const maskEmail = (email) => {
  if (!email) return 'N/A';
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart.slice(0, 2)}***@${domain}`;
};

/**
 * Mask phone number for display
 */
export const maskPhone = (phone) => {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length <= 4) return '***';
  return `***${cleaned.slice(-4)}`;
};

/**
 * Generate session token (client-side, for temporary storage)
 */
export const generateSessionToken = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Store session token in sessionStorage
 */
export const storeSessionToken = (token, assessmentId) => {
  try {
    sessionStorage.setItem('verification_session', JSON.stringify({
      token,
      assessmentId,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Failed to store session token:', error);
  }
};

/**
 * Get session token from sessionStorage
 */
export const getSessionToken = () => {
  try {
    const stored = sessionStorage.getItem('verification_session');
    if (!stored) return null;
    const data = JSON.parse(stored);
    // Check if session is still valid (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - data.timestamp > maxAge) {
      sessionStorage.removeItem('verification_session');
      return null;
    }
    return data.token;
  } catch (error) {
    console.error('Failed to get session token:', error);
    return null;
  }
};

/**
 * Clear session token
 */
export const clearSessionToken = () => {
  try {
    sessionStorage.removeItem('verification_session');
  } catch (error) {
    console.error('Failed to clear session token:', error);
  }
};

/**
 * Check if rate limit is exceeded (client-side check)
 */
export const checkRateLimit = (key, maxAttempts = 10, windowMs = 24 * 60 * 60 * 1000) => {
  try {
    const stored = localStorage.getItem(`rate_limit_${key}`);
    if (!stored) {
      localStorage.setItem(`rate_limit_${key}`, JSON.stringify({
        attempts: 1,
        resetAt: Date.now() + windowMs,
      }));
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    const data = JSON.parse(stored);
    if (Date.now() > data.resetAt) {
      // Reset window
      localStorage.setItem(`rate_limit_${key}`, JSON.stringify({
        attempts: 1,
        resetAt: Date.now() + windowMs,
      }));
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    if (data.attempts >= maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: data.resetAt,
      };
    }

    data.attempts += 1;
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(data));
    return {
      allowed: true,
      remaining: maxAttempts - data.attempts,
    };
  } catch (error) {
    console.error('Failed to check rate limit:', error);
    return { allowed: true, remaining: maxAttempts };
  }
};

/**
 * Reset rate limit for a key
 */
export const resetRateLimit = (key) => {
  try {
    localStorage.removeItem(`rate_limit_${key}`);
  } catch (error) {
    console.error('Failed to reset rate limit:', error);
  }
};

