import React, { createContext, useContext, useState } from 'react';

// const dummyAudits = [
//   {
//     txId: 'tx1',
//     blockNumber: 13542,
//     channelName: 'tax-channel',
//     chaincode: 'taxcc',
//     taxpayerId: 'T001',
//     taxType: 'Income',
//     period: 'Q3-2023',
//     amount: 15000,
//     auditorMSP: 'TaxAuthorityMSP',
//     auditDate: '2023-08-01',
//     status: 'Compliant',
//     validationCode: 'VALID',
//     creator: 'Admin@tax-authority.org',
//     timestamp: '2023-08-01T09:30:00Z',
//     history: [
//       {
//         txId: 'tx1',
//         timestamp: '2023-08-01T09:30:00Z',
//         action: 'INITIAL_AUDIT',
//         participant: 'TaxAuthorityMSP',
//       },
//     ],
//   },
//   // Additional dummy records...
// ];
// export const dummyAudits = [
//   // Taxpayers
//   {
//     auditType: 'taxpayer',
//     taxpayerId: 'TXP001',
//     name: 'John Doe',
//     address: '123 Main St',
//     status: 'Compliant',
//   },
//   {
//     auditType: 'taxpayer',
//     taxpayerId: 'TXP002',
//     name: 'Jane Smith',
//     address: '456 Elm St',
//     status: 'NonCompliant',
//   },
//   {
//     auditType: 'taxpayer',
//     taxpayerId: 'TXP003',
//     name: 'Acme Corp',
//     address: '789 Oak St',
//     status: 'Pending',
//   },
//   {
//     auditType: 'taxpayer',
//     taxpayerId: 'TXP004',
//     name: 'Globex Inc.',
//     address: '321 Pine St',
//     status: 'Compliant',
//   },
//   {
//     auditType: 'taxpayer',
//     taxpayerId: 'TXP005',
//     name: 'Initech LLC',
//     address: '654 Maple St',
//     status: 'NonCompliant',
//   },

//   // Assessments
//   {
//     auditType: 'assessment',
//     assessmentId: 'ASM001',
//     amount: '1000',
//     period: 'Q1 2025',
//     status: 'Compliant',
//   },
//   {
//     auditType: 'assessment',
//     assessmentId: 'ASM002',
//     amount: '2500',
//     period: 'Q2 2025',
//     status: 'NonCompliant',
//   },
//   {
//     auditType: 'assessment',
//     assessmentId: 'ASM003',
//     amount: '500',
//     period: 'Q3 2025',
//     status: 'Pending',
//   },
//   {
//     auditType: 'assessment',
//     assessmentId: 'ASM004',
//     amount: '1500',
//     period: 'Q4 2025',
//     status: 'Compliant',
//   },
//   {
//     auditType: 'assessment',
//     assessmentId: 'ASM005',
//     amount: '3000',
//     period: 'Q1 2026',
//     status: 'NonCompliant',
//   },

//   // Payments
//   {
//     auditType: 'payment',
//     paymentId: 'PAY001',
//     amount: '1000',
//     method: 'Bank Transfer',
//     status: 'Compliant',
//   },
//   {
//     auditType: 'payment',
//     paymentId: 'PAY002',
//     amount: '200',
//     method: 'Mobile Money',
//     status: 'Pending',
//   },
//   {
//     auditType: 'payment',
//     paymentId: 'PAY003',
//     amount: '500',
//     method: 'Credit Card',
//     status: 'NonCompliant',
//   },
//   {
//     auditType: 'payment',
//     paymentId: 'PAY004',
//     amount: '750',
//     method: 'Cash',
//     status: 'Compliant',
//   },
//   {
//     auditType: 'payment',
//     paymentId: 'PAY005',
//     amount: '300',
//     method: 'Bank Transfer',
//     status: 'Pending',
//   },

//   // EFD Transactions
//   {
//     auditType: 'efd',
//     efdId: 'EFD001',
//     amount: '120',
//     device: 'EFD12345',
//     status: 'Compliant',
//   },
//   {
//     auditType: 'efd',
//     efdId: 'EFD002',
//     amount: '500',
//     device: 'EFD67890',
//     status: 'NonCompliant',
//   },
//   {
//     auditType: 'efd',
//     efdId: 'EFD003',
//     amount: '300',
//     device: 'EFD54321',
//     status: 'Pending',
//   },
//   {
//     auditType: 'efd',
//     efdId: 'EFD004',
//     amount: '220',
//     device: 'EFD09876',
//     status: 'Compliant',
//   },
//   {
//     auditType: 'efd',
//     efdId: 'EFD005',
//     amount: '800',
//     device: 'EFD11223',
//     status: 'NonCompliant',
//   },
// ];

// const dummyAudits = [
//   // Taxpayers
//   {
//     auditType: 'taxpayer',
//     taxpayerId: 'TAX-001',
//     name: 'John Doe',
//     address: '123 Main St, Dar es Salaam',
//     status: 'Compliant',
//     history: [
//       { timestamp: '2025-04-01 12:00:00', action: 'Created', user: 'Admin' },
//       {
//         timestamp: '2025-04-05 14:30:00',
//         action: 'Status updated to NonCompliant',
//         user: 'Audit Officer',
//       },
//       { timestamp: '2025-04-10 10:00:00', action: 'Address updated to 456 New St', user: 'Admin' },
//     ],
//   },
//   {
//     auditType: 'taxpayer',
//     taxpayerId: 'TAX-002',
//     name: 'Jane Smith',
//     address: '789 High St, Arusha',
//     status: 'Pending',
//     history: [
//       { timestamp: '2025-04-02 09:00:00', action: 'Created', user: 'Admin' },
//       {
//         timestamp: '2025-04-06 11:30:00',
//         action: 'Status updated to Compliant',
//         user: 'Audit Officer',
//       },
//       {
//         timestamp: '2025-04-08 15:00:00',
//         action: 'Address updated to 101 Uptown Rd',
//         user: 'Admin',
//       },
//     ],
//   },
//   {
//     auditType: 'taxpayer',
//     taxpayerId: 'TAX-003',
//     name: 'Michael Johnson',
//     address: '456 Down St, Mwanza',
//     status: 'NonCompliant',
//     history: [
//       { timestamp: '2025-04-03 13:30:00', action: 'Created', user: 'Admin' },
//       {
//         timestamp: '2025-04-07 16:45:00',
//         action: 'Status updated to Pending',
//         user: 'Audit Officer',
//       },
//       { timestamp: '2025-04-09 12:00:00', action: 'Address updated to 789 Low Rd', user: 'Admin' },
//     ],
//   },

//   // Assessments
//   {
//     auditType: 'assessment',
//     assessmentId: 'ASS-001',
//     amount: 1000,
//     period: '2025-Q1',
//     status: 'Compliant',
//     history: [
//       { timestamp: '2025-04-01 12:00:00', action: 'Created', user: 'Admin' },
//       { timestamp: '2025-04-04 14:00:00', action: 'Amount updated to 1200', user: 'Audit Officer' },
//       { timestamp: '2025-04-10 09:30:00', action: 'Status updated to NonCompliant', user: 'Admin' },
//     ],
//   },
//   {
//     auditType: 'assessment',
//     assessmentId: 'ASS-002',
//     amount: 1500,
//     period: '2025-Q2',
//     status: 'Pending',
//     history: [
//       { timestamp: '2025-04-02 13:00:00', action: 'Created', user: 'Admin' },
//       { timestamp: '2025-04-05 11:00:00', action: 'Amount updated to 1600', user: 'Audit Officer' },
//       { timestamp: '2025-04-09 10:00:00', action: 'Status updated to Compliant', user: 'Admin' },
//     ],
//   },
//   {
//     auditType: 'assessment',
//     assessmentId: 'ASS-003',
//     amount: 500,
//     period: '2025-Q3',
//     status: 'NonCompliant',
//     history: [
//       { timestamp: '2025-04-03 16:30:00', action: 'Created', user: 'Admin' },
//       { timestamp: '2025-04-06 14:00:00', action: 'Amount updated to 550', user: 'Audit Officer' },
//       { timestamp: '2025-04-08 17:30:00', action: 'Status updated to Pending', user: 'Admin' },
//     ],
//   },

//   // Payments
//   {
//     auditType: 'payment',
//     paymentId: 'PAY-001',
//     amount: 5000,
//     method: 'Bank Transfer',
//     status: 'Compliant',
//     history: [
//       { timestamp: '2025-04-01 08:00:00', action: 'Created', user: 'Admin' },
//       { timestamp: '2025-04-05 15:00:00', action: 'Amount updated to 6000', user: 'Audit Officer' },
//       { timestamp: '2025-04-10 11:00:00', action: 'Status updated to NonCompliant', user: 'Admin' },
//     ],
//   },
//   {
//     auditType: 'payment',
//     paymentId: 'PAY-002',
//     amount: 7000,
//     method: 'Cash',
//     status: 'Pending',
//     history: [
//       { timestamp: '2025-04-02 12:30:00', action: 'Created', user: 'Admin' },
//       { timestamp: '2025-04-06 16:00:00', action: 'Amount updated to 7500', user: 'Audit Officer' },
//       { timestamp: '2025-04-08 14:30:00', action: 'Status updated to Compliant', user: 'Admin' },
//     ],
//   },
//   {
//     auditType: 'payment',
//     paymentId: 'PAY-003',
//     amount: 3000,
//     method: 'Mobile Payment',
//     status: 'NonCompliant',
//     history: [
//       { timestamp: '2025-04-03 10:00:00', action: 'Created', user: 'Admin' },
//       { timestamp: '2025-04-07 13:00:00', action: 'Amount updated to 3500', user: 'Audit Officer' },
//       { timestamp: '2025-04-09 16:30:00', action: 'Status updated to Pending', user: 'Admin' },
//     ],
//   },

//   // EFD Transactions
//   {
//     auditType: 'efd',
//     efdId: 'EFD-001',
//     amount: 10000,
//     device: 'POS-001',
//     status: 'Compliant',
//     history: [
//       { timestamp: '2025-04-01 09:00:00', action: 'Created', user: 'Admin' },
//       {
//         timestamp: '2025-04-05 12:30:00',
//         action: 'Amount updated to 12000',
//         user: 'Audit Officer',
//       },
//       { timestamp: '2025-04-09 10:00:00', action: 'Status updated to NonCompliant', user: 'Admin' },
//     ],
//   },
//   {
//     auditType: 'efd',
//     efdId: 'EFD-002',
//     amount: 8000,
//     device: 'POS-002',
//     status: 'Pending',
//     history: [
//       { timestamp: '2025-04-02 10:30:00', action: 'Created', user: 'Admin' },
//       { timestamp: '2025-04-06 13:00:00', action: 'Amount updated to 8500', user: 'Audit Officer' },
//       { timestamp: '2025-04-08 15:30:00', action: 'Status updated to Compliant', user: 'Admin' },
//     ],
//   },
//   {
//     auditType: 'efd',
//     efdId: 'EFD-003',
//     amount: 5000,
//     device: 'POS-003',
//     status: 'NonCompliant',
//     history: [
//       { timestamp: '2025-04-03 14:00:00', action: 'Created', user: 'Admin' },
//       { timestamp: '2025-04-07 16:30:00', action: 'Amount updated to 5500', user: 'Audit Officer' },
//       { timestamp: '2025-04-09 18:00:00', action: 'Status updated to Pending', user: 'Admin' },
//     ],
//   },
// ];
const dummyAudits = [
  {
    auditType: 'taxpayer',
    taxpayerId: 'TAX-001',
    name: 'John Doe',
    address: '123 Main St, Dar es Salaam',
    status: 'Compliant',
    blockchainTx: {
      txHash: '0x4a5b6c8d9e0f1a2b3c4d5e6f7a8b9c0d',
      blockNumber: 12345,
      timestamp: '2025-04-01T12:00:00Z',
    },
    history: [
      {
        timestamp: '2025-04-01T12:00:00Z',
        action: 'CREATE_TAXPAYER',
        affectedFields: {
          taxpayerId: { previous: null, current: 'TAX-001' },
          name: { previous: null, current: 'John Doe' },
          address: { previous: null, current: '123 Main St' },
        },
        performer: {
          mspId: 'TaxAuthorityMSP',
          identity: 'Admin@taxauthority.gov',
        },
        txHash: '0x4a5b6c8d9e0f1a2b3c4d5e6f7a8b9c0d',
      },
      {
        timestamp: '2025-04-05T14:30:00Z',
        action: 'UPDATE_ADDRESS',
        affectedFields: {
          address: { previous: '123 Main St', current: '456 New St' },
        },
        performer: {
          mspId: 'TaxAuthorityMSP',
          identity: 'admin2@taxauthority.gov',
        },
        txHash: '0x7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
      },
    ],
  },
  {
    auditType: 'assessment',
    assessmentId: 'ASS-001',
    amount: 1500,
    period: '2025-Q1',
    status: 'Pending',
    blockchainTx: {
      txHash: '0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
      blockNumber: 12346,
      timestamp: '2025-04-02T09:00:00Z',
    },
    history: [
      {
        timestamp: '2025-04-02T09:00:00Z',
        action: 'CREATE_ASSESSMENT',
        affectedFields: {
          assessmentId: { previous: null, current: 'ASS-001' },
          amount: { previous: null, current: 1000 },
          period: { previous: null, current: '2025-Q1' },
        },
        performer: {
          mspId: 'AuditorMSP',
          identity: 'auditor1@audit.gov',
        },
        txHash: '0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
      },
      {
        timestamp: '2025-04-03T11:30:00Z',
        action: 'UPDATE_AMOUNT',
        affectedFields: {
          amount: { previous: 1000, current: 1500 },
        },
        performer: {
          mspId: 'AuditorMSP',
          identity: 'auditor2@audit.gov',
        },
        txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7',
      },
    ],
  },
  {
    auditType: 'payment',
    paymentId: 'PAY-001',
    amount: 5000,
    method: 'Bank Transfer',
    status: 'Compliant',
    blockchainTx: {
      txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3',
      blockNumber: 12347,
      timestamp: '2025-04-03T14:00:00Z',
    },
    history: [
      {
        timestamp: '2025-04-03T14:00:00Z',
        action: 'CREATE_PAYMENT',
        affectedFields: {
          paymentId: { previous: null, current: 'PAY-001' },
          amount: { previous: null, current: 5000 },
          method: { previous: null, current: 'Bank Transfer' },
        },
        performer: {
          mspId: 'BankMSP',
          identity: 'bankadmin@bank.co.tz',
        },
        txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3',
      },
    ],
  },
  {
    auditType: 'efd',
    efdId: 'EFD-001',
    amount: 10000,
    device: 'POS-001',
    status: 'NonCompliant',
    blockchainTx: {
      txHash: '0x2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      blockNumber: 12348,
      timestamp: '2025-04-04T10:30:00Z',
    },
    history: [
      {
        timestamp: '2025-04-04T10:30:00Z',
        action: 'CREATE_EFD_TRANSACTION',
        affectedFields: {
          efdId: { previous: null, current: 'EFD-001' },
          amount: { previous: null, current: 10000 },
          device: { previous: null, current: 'POS-001' },
        },
        performer: {
          mspId: 'EFDProviderMSP',
          identity: 'posadmin@efdprovider.co.tz',
        },
        txHash: '0x2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      },
      {
        timestamp: '2025-04-05T16:45:00Z',
        action: 'FLAG_TRANSACTION',
        affectedFields: {
          status: { previous: 'Compliant', current: 'NonCompliant' },
        },
        performer: {
          mspId: 'AuditorMSP',
          identity: 'auditor3@audit.gov',
        },
        txHash: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
      },
    ],
  },
];
export const AuditContext = createContext();

export const AuditProvider = ({ children }) => {
  const [audits, setAudits] = useState(dummyAudits);

  const updateAuditStatus = (txHash, newStatus) => {
    setAudits((prev) =>
      prev.map((audit) =>
        audit.blockchainTx.txHash === txHash
          ? {
              ...audit,
              status: newStatus,
              history: [
                ...audit.history,
                {
                  timestamp: new Date().toISOString(),
                  action: `STATUS_UPDATE_${newStatus.toUpperCase()}`,
                  affectedFields: { status: { previous: audit.status, current: newStatus } },
                  performer: { mspId: 'AuditorMSP', identity: 'admin@audit.gov' },
                  txHash: `simulated-tx-${Date.now()}`,
                },
              ],
            }
          : audit,
      ),
    );
  };

  return (
    <AuditContext.Provider value={{ audits, updateAuditStatus }}>{children}</AuditContext.Provider>
  );
};
