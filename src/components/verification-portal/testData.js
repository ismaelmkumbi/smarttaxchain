/**
 * Test Data for Taxpayer Verification Portal
 * Use this data for testing the UI without backend integration
 */

export const mockAssessmentData = {
  success: true,
  sessionToken: 'test_session_token_12345',
  assessment: {
    id: 'ASSESS-2025-1763533388302-2027',
    ID: 'ASSESS-2025-1763533388302-2027',
    tin: '566566666',
    TIN: '566566666',
    amount: 7800000,
    Amount: 7800000,
    totalDue: 7800000,
    TotalDue: 7800000,
    interest: 0,
    Interest: 0,
    penalties: 0,
    Penalties: 0,
    status: 'PENDING',
    Status: 'PENDING',
    dueDate: '2025-11-21T00:00:00.000Z',
    DueDate: '2025-11-21T00:00:00.000Z',
    period: '2025-Q2',
    Period: '2025-Q2',
    taxType: 'INDIVIDUAL_INCOME_TAX',
    TaxType: 'INDIVIDUAL_INCOME_TAX',
    createdAt: '2025-11-19T06:23:08.302Z',
    CreatedAt: '2025-11-19T06:23:08.302Z',
    createdBy: 'OFF-12345',
    CreatedBy: 'OFF-12345',
    createdByRole: 'Senior Tax Officer',
    description: 'Individual Income Tax Assessment for Q2 2025',
    Description: 'Individual Income Tax Assessment for Q2 2025',
    blockchainTxId: 'dae64a26e56018b4130c9a1ee6eec8a82e78f54ad7023d2d899c8a3920721444',
    currency: 'TZS',
    Currency: 'TZS',
  },
  auditTrail: [
    {
      id: 'AUDIT-1',
      action: 'CREATE',
      timestamp: '2025-11-19T06:23:08.302Z',
      officerId: 'OFF-12345',
      officerRole: 'Senior Tax Officer',
      description: 'Assessment created',
      changes: [],
      blockchainTxId: 'dae64a26e56018b4130c9a1ee6eec8a82e78f54ad7023d2d899c8a3920721444',
      status: 'SUCCESS',
      riskLevel: 'LOW',
    },
    {
      id: 'AUDIT-2',
      action: 'UPDATE',
      timestamp: '2025-11-19T06:23:37.100Z',
      officerId: 'OFF-67890',
      officerRole: 'Tax Officer',
      description: 'Assessment updated',
      changes: [
        {
          field: 'DueDate',
          oldValue: '2025-11-21T00:00:00.000Z',
          newValue: '2025-11-21',
        },
        {
          field: 'Status',
          oldValue: 'PENDING',
          newValue: 'PENDING',
        },
      ],
      blockchainTxId: 'e4539140a90429c9d4c43f16d1fcfb60c7d164d165c5686576ce09708bd2732a',
      status: 'SUCCESS',
      riskLevel: 'HIGH',
    },
    {
      id: 'AUDIT-3',
      action: 'INTEREST_CALCULATED',
      timestamp: '2025-11-20T10:15:30.000Z',
      officerId: 'SYSTEM',
      officerRole: 'System',
      description: 'Interest calculated automatically',
      changes: [
        {
          field: 'Interest',
          oldValue: 0,
          newValue: 29589.04,
        },
      ],
      blockchainTxId: '3609662113bfd80e8c46f37b50ddbc5696f487bbba2e271e6befb05920b3fdef',
      status: 'SUCCESS',
      riskLevel: 'LOW',
    },
    {
      id: 'AUDIT-4',
      action: 'PENALTY_APPLIED',
      timestamp: '2025-11-20T14:30:45.000Z',
      officerId: 'OFF-11111',
      officerRole: 'Compliance Officer',
      description: 'Late payment penalty applied',
      changes: [
        {
          field: 'Penalties',
          oldValue: 0,
          newValue: 4500000,
        },
      ],
      blockchainTxId: '34b3ce0ff64113da1c7e5a0e688a2c55a12898f252f4c3e7c6b386359c7d09a3',
      status: 'SUCCESS',
      riskLevel: 'MEDIUM',
    },
    {
      id: 'AUDIT-5',
      action: 'APPROVE',
      timestamp: '2025-11-21T09:00:00.000Z',
      officerId: 'OFF-99999',
      officerRole: 'Manager',
      description: 'Assessment approved',
      changes: [
        {
          field: 'Status',
          oldValue: 'PENDING',
          newValue: 'APPROVED',
        },
      ],
      blockchainTxId: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567',
      status: 'SUCCESS',
      riskLevel: 'LOW',
    },
  ],
  payments: [
    {
      id: 'PAY-001',
      amount: 2000000,
      Amount: 2000000,
      paymentDate: '2025-11-22T10:30:00.000Z',
      PaymentDate: '2025-11-22T10:30:00.000Z',
      paymentMethod: 'BANK_TRANSFER',
      PaymentMethod: 'BANK_TRANSFER',
      reference: 'REF-2025-001234',
      Reference: 'REF-2025-001234',
      status: 'CONFIRMED',
      Status: 'CONFIRMED',
      blockchainTxId: 'payment_tx_abc123def456ghi789jkl012mno345pqr678',
      receiptUrl: 'https://example.com/receipts/PAY-001.pdf',
    },
    {
      id: 'PAY-002',
      amount: 3000000,
      Amount: 3000000,
      paymentDate: '2025-11-25T14:45:00.000Z',
      PaymentDate: '2025-11-25T14:45:00.000Z',
      paymentMethod: 'MOBILE_MONEY',
      PaymentMethod: 'MOBILE_MONEY',
      reference: 'REF-2025-005678',
      Reference: 'REF-2025-005678',
      status: 'CONFIRMED',
      Status: 'CONFIRMED',
      blockchainTxId: 'payment_tx_xyz789abc123def456ghi789jkl012mno345',
      receiptUrl: 'https://example.com/receipts/PAY-002.pdf',
    },
  ],
  blockchain: {
    verified: true,
    transactionId: 'dae64a26e56018b4130c9a1ee6eec8a82e78f54ad7023d2d899c8a3920721444',
    channelId: 'mychannel',
    chaincodeName: 'tra-immutable-ledger',
    contractName: 'TaxAssessmentContract',
    timestamp: '2025-11-19T06:23:08.302Z',
    ledgerEvents: [
      {
        eventType: 'ASSESSMENT_CREATED',
        event_type: 'ASSESSMENT_CREATED',
        tx_id: 'dae64a26e56018b4130c9a1ee6eec8a82e78f54ad7023d2d899c8a3920721444',
        timestamp: '2025-11-19T06:23:08.302Z',
        reason: 'Tax assessment created: Individual Income Tax Assessment for Q2 2025',
        amount: 7800000,
        period: '2025-Q2',
        tax_type: 'INDIVIDUAL_INCOME_TAX',
        current_hash: 'b32dc7c38ecc79a5ae802424c017eb75ea5110ad53df669cea51c99e5abb7651',
        previous_hash: 'genesis',
      },
      {
        eventType: 'INTEREST_CALCULATED',
        event_type: 'INTEREST_CALCULATED',
        tx_id: '3609662113bfd80e8c46f37b50ddbc5696f487bbba2e271e6befb05920b3fdef',
        timestamp: '2025-11-20T10:15:30.000Z',
        reason: 'Interest calculated: daily rate 12.00%',
        amount: 29589.04,
        interest_rate: 0.12,
        interest_type: 'daily',
        days_overdue: 1,
        principal_amount: 7800000,
        current_hash: '8034b2736431dbc3c1eb08c4d3fa444ccb3e44e3560abe4ab78040e63784eaf9',
        previous_hash: 'b32dc7c38ecc79a5ae802424c017eb75ea5110ad53df669cea51c99e5abb7651',
      },
      {
        eventType: 'PENALTY_APPLIED',
        event_type: 'PENALTY_APPLIED',
        tx_id: '34b3ce0ff64113da1c7e5a0e688a2c55a12898f252f4c3e7c6b386359c7d09a3',
        timestamp: '2025-11-20T14:30:45.000Z',
        reason: 'Late payment penalty applied',
        amount: 4500000,
        penalty_rate: '5',
        penalty_type: 'LATE_PAYMENT',
        base_amount: 7800000,
        current_hash: '838ee33a4da9d2eb9bcaaa0d7bebfa3fb195e581a413e4bc332fdf08498c7e64',
        previous_hash: '8034b2736431dbc3c1eb08c4d3fa444ccb3e44e3560abe4ab78040e63784eaf9',
      },
    ],
  },
};

// Sample TINs for testing
export const testTINs = [
  '566566666', // Main test TIN
  '123456789',
  '987654321',
  '111222333',
  '444555666',
];

// Sample Assessment IDs for testing
export const testAssessmentIds = [
  'ASSESS-2025-1763533388302-2027', // Main test Assessment ID
  'ASSESS-2025-1763431249969-8045',
  'ASSESS-2025-1763502866584-1926',
  'ASSESS-2024-1700000000000-0001',
  'ASSESS-2025-1700000000000-0002',
];

// Sample OTPs (for testing only - in production, OTPs come from backend)
export const testOTPs = [
  '123456',
  '000000', // For testing invalid OTP
  '999999',
];

// Mock API responses for testing
export const mockAPIResponses = {
  requestOTP: {
    success: true,
    message: 'OTP sent successfully to your registered email/phone',
    otpSent: true,
    expiresIn: 300, // 5 minutes
  },
  
  verifyAssessment: mockAssessmentData,
  
  getAssessmentDetails: {
    success: true,
    assessment: mockAssessmentData.assessment,
  },
  
  getAuditTrail: {
    success: true,
    auditTrail: mockAssessmentData.auditTrail,
  },
  
  getPaymentHistory: {
    success: true,
    payments: mockAssessmentData.payments,
  },
  
  downloadPDF: {
    // This would be a blob in real implementation
    success: true,
    message: 'PDF generated successfully',
  },
  
  verifyBlockchain: {
    success: true,
    verified: true,
    data: mockAssessmentData.blockchain,
  },
  
  reportIssue: {
    success: true,
    ticketId: 'TICKET-2025-001234',
    message: 'Issue reported successfully. Ticket ID: TICKET-2025-001234',
  },
};

// Error responses for testing error handling
export const mockErrorResponses = {
  invalidTIN: {
    success: false,
    message: 'Invalid TIN format. TIN must be 9 digits.',
    error: 'VALIDATION_ERROR',
  },
  
  invalidAssessmentId: {
    success: false,
    message: 'Invalid Assessment ID format.',
    error: 'VALIDATION_ERROR',
  },
  
  invalidOTP: {
    success: false,
    message: 'Invalid or expired OTP. Please request a new one.',
    error: 'INVALID_OTP',
  },
  
  assessmentNotFound: {
    success: false,
    message: 'Assessment not found. Please check your Assessment ID.',
    error: 'NOT_FOUND',
  },
  
  tinMismatch: {
    success: false,
    message: 'TIN does not match the Assessment ID.',
    error: 'TIN_MISMATCH',
  },
  
  rateLimitExceeded: {
    success: false,
    message: 'Rate limit exceeded. Please try again later.',
    error: 'RATE_LIMIT_EXCEEDED',
    retryAfter: 3600, // seconds
  },
  
  networkError: {
    success: false,
    message: 'Network error. Please check your connection and try again.',
    error: 'NETWORK_ERROR',
  },
};

// Test scenarios
export const testScenarios = {
  // Happy path - successful verification
  successfulVerification: {
    tin: '566566666',
    assessmentId: 'ASSESS-2025-1763533388302-2027',
    otp: '123456',
    expectedResult: mockAssessmentData,
  },
  
  // Invalid TIN
  invalidTIN: {
    tin: '12345', // Too short
    assessmentId: 'ASSESS-2025-1763533388302-2027',
    expectedError: mockErrorResponses.invalidTIN,
  },
  
  // Invalid Assessment ID
  invalidAssessmentId: {
    tin: '566566666',
    assessmentId: 'INVALID-ID',
    expectedError: mockErrorResponses.invalidAssessmentId,
  },
  
  // Invalid OTP
  invalidOTP: {
    tin: '566566666',
    assessmentId: 'ASSESS-2025-1763533388302-2027',
    otp: '000000',
    expectedError: mockErrorResponses.invalidOTP,
  },
  
  // Assessment not found
  assessmentNotFound: {
    tin: '566566666',
    assessmentId: 'ASSESS-2025-9999999999-9999',
    otp: '123456',
    expectedError: mockErrorResponses.assessmentNotFound,
  },
  
  // TIN mismatch
  tinMismatch: {
    tin: '123456789', // Different TIN
    assessmentId: 'ASSESS-2025-1763533388302-2027',
    otp: '123456',
    expectedError: mockErrorResponses.tinMismatch,
  },
};

// Helper function to simulate API delay
export const simulateAPIDelay = (ms = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Helper function to get mock response
export const getMockResponse = (endpoint, params = {}) => {
  // Simulate API delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (endpoint) {
        case 'requestOTP':
          resolve(mockAPIResponses.requestOTP);
          break;
        case 'verifyAssessment':
          // Check for test scenarios
          if (params.otp === '000000') {
            reject(mockErrorResponses.invalidOTP);
          } else if (params.assessmentId === 'ASSESS-2025-9999999999-9999') {
            reject(mockErrorResponses.assessmentNotFound);
          } else {
            resolve(mockAPIResponses.verifyAssessment);
          }
          break;
        case 'getAssessmentDetails':
          resolve(mockAPIResponses.getAssessmentDetails);
          break;
        case 'getAuditTrail':
          resolve(mockAPIResponses.getAuditTrail);
          break;
        case 'getPaymentHistory':
          resolve(mockAPIResponses.getPaymentHistory);
          break;
        case 'downloadPDF':
          resolve(mockAPIResponses.downloadPDF);
          break;
        case 'verifyBlockchain':
          resolve(mockAPIResponses.verifyBlockchain);
          break;
        case 'reportIssue':
          resolve(mockAPIResponses.reportIssue);
          break;
        default:
          reject(mockErrorResponses.networkError);
      }
    }, 1000); // 1 second delay
  });
};

export default {
  mockAssessmentData,
  testTINs,
  testAssessmentIds,
  testOTPs,
  mockAPIResponses,
  mockErrorResponses,
  testScenarios,
  simulateAPIDelay,
  getMockResponse,
};

