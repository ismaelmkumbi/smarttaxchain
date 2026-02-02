# Payload Verification - Frontend to Backend

## Current Payload Structure

### Frontend Sends (handleCompleteRegistration)

```javascript
{
  name: "John Doe",
  nin: "1234567890123456",  // Only if registrationType === 'nin'
  tin: "TIN-123-456-789",
  type: "Individual",
  businessCategory: "Retail",
  registrationAddress: "123 Main Street",
  contactEmail: "john@example.com",
  phoneNumber: "+255712345678",
  authorizedSignatories: [],
  hasNIN: true/false,
  nidaVerification: {
    verified: true,
    data: {
      nidaNumber: "1234567890123456",
      fullName: "Retrieved from NIDA",
      verifiedAt: "2024-01-15T10:30:00Z",
      verificationHash: "NIDA-1234567890123456-1705312200000"
    }
  },  // Only if registrationType === 'nin'
  tinVerification: {
    verified: true,
    data: {
      tin: "TIN-123-456-789",
      verifiedAt: "2024-01-15T10:30:00Z",
      verificationHash: "TIN-123-456-789-1705312200000"
    }
  },  // Only if registrationType === 'non-nin'
  blockchainRegistration: {
    success: true,
    transactionHash: "0xabc123...",
    blockNumber: 12345,
    timestamp: "2024-01-15T10:30:00Z",
    blockchainAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
  },
  complianceScore: 95,
  registrationDate: "2024-01-15T10:30:00Z",
  registrationType: "nin" | "non-nin"
}
```

### Backend Expects (POST /api/taxpayers/register)

```json
{
  "name": "John Doe",
  "nin": "1234567890123456",
  "tin": "TIN-123-456-789",
  "type": "Individual",
  "businessCategory": "Retail",
  "registrationAddress": "123 Main Street, Dar es Salaam",
  "contactEmail": "john@example.com",
  "phoneNumber": "+255712345678",
  "nidaVerification": {
    "verified": true,
    "data": {
      "nidaNumber": "1234567890123456",
      "fullName": "Retrieved from NIDA",
      "verifiedAt": "2024-01-15T10:30:00Z",
      "verificationHash": "NIDA-1234567890123456-1705312200000"
    }
  },
  "tinVerification": null,
  "blockchainRegistration": {
    "success": true,
    "transactionHash": "0xabc123...",
    "blockNumber": 12345,
    "blockchainAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
  },
  "complianceScore": 95,
  "registrationDate": "2024-01-15T10:30:00Z",
  "registrationType": "nin"
}
```

## ✅ Payload Structure Match

The payload structure matches the backend API specification. The frontend is sending:

1. ✅ All required fields
2. ✅ Correct field names (camelCase)
3. ✅ Verification data (NIDA or TIN)
4. ✅ Blockchain registration data
5. ✅ Compliance score
6. ✅ Registration type
7. ✅ No VRN field (removed)

## API Endpoint

**Endpoint:** `POST /api/taxpayers/register`

**Updated in:** `src/services/traApiService.js`

The payload is correctly formatted and includes all necessary data for the backend to complete the registration.

