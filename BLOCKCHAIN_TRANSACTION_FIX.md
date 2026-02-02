# Blockchain Transaction Endorsement Error - Fix Guide

## Error Message
```
{
  "success": false,
  "error": {
    "code": "REGISTRATION_FAILED",
    "message": "Taxpayer registration failed",
    "details": "10 ABORTED: failed to endorse transaction, see attached details for more info"
  }
}
```

## Root Cause

The blockchain smart contract is rejecting the transaction because the data format doesn't match what the contract expects. The backend needs to **transform field names** before calling the blockchain.

## Smart Contract Requirements

The Hyperledger Fabric smart contract `registerTaxpayer` function expects these arguments (in order):

1. `tin` (string)
2. `name` (string)
3. `type` (string)
4. `businessCategory` (string)
5. `address` (string) - **⚠️ NOT `registrationAddress`**
6. `contactEmail` (string)
7. `phoneNumber` (string)
8. `registrationDate` (string - ISO format)

### Transient Data (for NIN registrations):
- Key: `'nida-verification'`
- Value: JSON string containing:
  - `nationalId` (string) - **⚠️ NOT `nin`**
  - `verificationHash` (string)

## Frontend Payload (Current - Correct ✅)

The frontend is sending:
```json
{
  "name": "John Doe",
  "nin": "1234567890123456",
  "tin": "TIN-123-456-789",
  "type": "Individual",
  "businessCategory": "Retail",
  "registrationAddress": "123 Main Street",  // ⚠️ Backend must transform to "address"
  "contactEmail": "john@example.com",
  "phoneNumber": "+255712345678",
  "nidaVerification": {
    "verified": true,
    "data": {
      "nidaNumber": "1234567890123456",
      "fullName": "John Doe",
      "verifiedAt": "2024-01-15T10:30:00Z",
      "verificationHash": "NIDA-1234567890123456-1705312200000"
    }
  },
  "complianceScore": 95,
  "registrationType": "nin"
}
```

## Backend Transformation Required

The backend `/api/taxpayers/register` endpoint must:

### 1. Transform Field Names for Blockchain

```javascript
// Transform registrationAddress → address
const blockchainPayload = {
  tin: req.body.tin,
  name: req.body.name,
  type: req.body.type,
  businessCategory: req.body.businessCategory,
  address: req.body.registrationAddress,  // ⚠️ Transform here
  contactEmail: req.body.contactEmail,
  phoneNumber: req.body.phoneNumber,
  registrationDate: req.body.registrationDate,
};
```

### 2. Build Transient Data (for NIN registrations)

```javascript
const transientData = {};

if (req.body.registrationType === 'nin' && req.body.nidaVerification) {
  transientData['nida-verification'] = JSON.stringify({
    nationalId: req.body.nin,  // ⚠️ Transform nin → nationalId
    verificationHash: req.body.nidaVerification.data.verificationHash,
  });
}
```

### 3. Call Blockchain Service

```javascript
// Call blockchain with transformed data
const blockchainResult = await blockchainService.registerTaxpayerOnBlockchain({
  ...blockchainPayload,
  nationalId: req.body.nin,  // For transient data
}, transientData);
```

### 4. Complete Backend Handler Example

```javascript
app.post('/api/taxpayers/register', authenticateToken, async (req, res) => {
  try {
    const { 
      name, 
      nin, 
      tin, 
      type, 
      businessCategory, 
      registrationAddress,  // ⚠️ Frontend sends this
      contactEmail, 
      phoneNumber,
      nidaVerification,
      tinVerification,
      complianceScore,
      registrationType 
    } = req.body;

    // 1. Transform for blockchain
    const blockchainData = {
      tin,
      name,
      type,
      businessCategory,
      address: registrationAddress,  // ⚠️ Transform registrationAddress → address
      contactEmail,
      phoneNumber,
      registrationDate: new Date().toISOString(),
    };

    // 2. Build transient data for NIN registrations
    const transientData = {};
    if (registrationType === 'nin' && nidaVerification) {
      transientData['nida-verification'] = JSON.stringify({
        nationalId: nin,  // ⚠️ Transform nin → nationalId
        verificationHash: nidaVerification.data.verificationHash,
      });
    }

    // 3. Call blockchain service
    const blockchainResult = await blockchainService.registerTaxpayerOnBlockchain(
      blockchainData,
      transientData
    );

    if (!blockchainResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BLOCKCHAIN_REGISTRATION_FAILED',
          message: 'Failed to register on blockchain',
          details: blockchainResult.error,
        },
      });
    }

    // 4. Store in database with blockchain result
    const taxpayer = {
      name,
      nin: nin || null,
      tin,
      type,
      businessCategory,
      registrationAddress,
      contactEmail,
      phoneNumber,
      nidaVerification,
      tinVerification,
      blockchainRegistration: {
        success: true,
        transactionId: blockchainResult.transactionId,
        blockNumber: blockchainResult.blockNumber,
        timestamp: blockchainResult.timestamp,
        blockchainAddress: blockchainResult.blockchainAddress,
      },
      complianceScore,
      registrationType,
      registrationDate: new Date().toISOString(),
    };

    // Save to database...
    // const savedTaxpayer = await db.saveTaxpayer(taxpayer);

    res.json({
      success: true,
      data: taxpayer,
      blockchainTxId: blockchainResult.transactionId,
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'Taxpayer registration failed',
        details: error.message,
      },
    });
  }
});
```

## Key Points

1. ✅ **Frontend payload is correct** - no changes needed
2. ❌ **Backend must transform `registrationAddress` → `address`** before calling blockchain
3. ❌ **Backend must transform `nin` → `nationalId`** in transient data
4. ❌ **Backend should NOT use `blockchainRegistration` from frontend** - it should call blockchain itself
5. ✅ **Backend should handle blockchain transaction internally** before storing in database

## Testing

After implementing the fix, test with:

1. **NIN Registration:**
   - Send payload with `registrationType: "nin"` and `nidaVerification`
   - Verify backend transforms `registrationAddress` → `address`
   - Verify backend transforms `nin` → `nationalId` in transient data

2. **Non-NIN Registration:**
   - Send payload with `registrationType: "non-nin"` and `tinVerification`
   - Verify backend transforms `registrationAddress` → `address`
   - Verify transient data is empty or contains TIN verification

## Summary

The frontend is sending the correct payload. The backend needs to:
- Transform `registrationAddress` → `address` for blockchain
- Transform `nin` → `nationalId` for transient data
- Call blockchain service internally (not rely on frontend mock)
- Handle blockchain transaction before storing in database

