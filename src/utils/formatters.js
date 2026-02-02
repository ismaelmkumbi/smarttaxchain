/**
 * Shared formatters for the entire application
 */

/**
 * Format currency amount with proper thousand separators
 * @param {number|string} amount - The amount to format
 * @param {string} currency - Currency code (default: 'TZS')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'TZS') => {
  if (amount === null || amount === undefined || amount === '') return 'N/A';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'N/A';
  
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format number with thousand separators (no currency symbol)
 * @param {number|string} number - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined || number === '') return 'N/A';
  const num = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(num)) return 'N/A';
  
  return new Intl.NumberFormat('en-TZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Check if a value looks like an amount/currency value
 * @param {string} field - Field name
 * @param {any} value - Field value
 * @returns {boolean} True if value should be formatted as currency
 */
export const isAmountField = (field, value) => {
  const amountFields = [
    'amount', 'Amount',
    'totalDue', 'TotalDue', 'total_due',
    'interest', 'Interest',
    'penalties', 'Penalties',
    'balance', 'Balance',
    'budget', 'Budget',
    'price', 'Price',
    'value', 'Value',
    'cost', 'Cost',
    'fee', 'Fee',
    'payment', 'Payment',
    'principal', 'Principal',
    'baseAmount', 'base_amount', 'BaseAmount',
  ];
  
  const fieldLower = field.toLowerCase();
  const isAmountFieldName = amountFields.some(af => fieldLower.includes(af.toLowerCase()));
  
  if (isAmountFieldName) return true;
  
  // Check if value is a number that could be an amount
  if (typeof value === 'number' && value > 0 && value < 1000000000000) {
    // If field name suggests it's not an amount, return false
    const nonAmountFields = ['id', 'count', 'quantity', 'year', 'month', 'day', 'hour', 'minute'];
    if (nonAmountFields.some(naf => fieldLower.includes(naf))) return false;
    // If it's a reasonable amount range, likely an amount
    return true;
  }
  
  return false;
};

