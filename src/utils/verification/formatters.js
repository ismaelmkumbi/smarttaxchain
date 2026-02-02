/**
 * Formatters for Verification Portal
 * Converts technical data to human-friendly format
 */

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'TZS') => {
  if (!amount && amount !== 0) return 'N/A';
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to human-readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

/**
 * Format date to short format
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Format relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  } catch {
    return dateString;
  }
};

/**
 * Mask TIN (show only last 3 digits)
 */
export const maskTIN = (tin) => {
  if (!tin) return 'N/A';
  if (tin.length <= 3) return '***';
  return `***${tin.slice(-3)}`;
};

/**
 * Shorten hash for display
 */
export const shortenHash = (hash, length = 8) => {
  if (!hash) return 'N/A';
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};

/**
 * Format action to human-friendly text
 */
export const formatAction = (action) => {
  const actionMap = {
    CREATE: 'Created',
    UPDATE: 'Updated',
    DELETE: 'Deleted',
    APPROVE: 'Approved',
    REJECT: 'Rejected',
    PAYMENT: 'Payment Recorded',
    INTEREST_CALCULATED: 'Interest Calculated',
    PENALTY_APPLIED: 'Penalty Applied',
  };
  return actionMap[action] || action;
};

/**
 * Format status to human-friendly text
 */
export const formatStatus = (status) => {
  const statusMap = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    PAID: 'Paid',
    OVERDUE: 'Overdue',
    PARTIAL: 'Partially Paid',
    COMPLETED: 'Completed',
  };
  return statusMap[status] || status;
};

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  const colorMap = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'error',
    PAID: 'success',
    OVERDUE: 'error',
    PARTIAL: 'info',
    COMPLETED: 'success',
  };
  return colorMap[status] || 'default';
};

/**
 * Format officer ID (pseudonymized)
 */
export const formatOfficerId = (officerId, role) => {
  if (!officerId) return 'System';
  if (role) {
    return `${role} (ID: ${officerId})`;
  }
  return `Officer ${officerId}`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(2)}%`;
};

