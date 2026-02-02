# Blockchain Transaction Payload Guide

## Issue: "failed to endorse transaction"

The error indicates that the blockchain smart contract is rejecting the transaction. This happens when the data format doesn't match what the smart contract expects.

## Smart Contract Requirements

Based on `hyperledgerFabricService.js`, the smart contract `registerTaxpayer` function expects:

### Function Arguments (in order):
1. `tin` - Tax Identification Number (string)
2. `name` - Taxpayer name (string)
3. `type` - Taxpayer type (string)
4. `businessCategory` - Business category (string)
5. `address` - Address as JSON string (string) - **Note: expects `address`, not `registrationAddress`**
6. `contactEmail` - Contact email (string)
7. `phoneNumber` - Phone number (string)
8. `registrationDate` - Registration date ISO string (string)

### Transient Data:
- `nida-verification` - JSON string containing:
  - `nationalId` - **Note: expects `nationalId`, not `nin`**
  - `verificationHash` - Verification hash

## Backend Should Transform Data

The backend (`/api/taxpayers/register`) should:

1. **Transform field names:**
   - `registrationAddress` → `address` (for blockchain)
   - `nin` → `nationalId` (for transient data)

2. **Call blockchain BEFORE storing in database:**
   ```javascript
   // Backend should do:
   const blockchainData = {
     tin: data.tin,
     name: data.name,
     type: data.type,
     businessCategory: data.businessCategory,
     address: data.registrationAddress,  // Transform here
     contactEmail: data.contactEmail,
     phoneNumber: data.phoneNumber,
     registrationDate: data.registrationDate,
   };
   
   const transientData = {
     'nida-verification': data.nidaVerification ? JSON.stringify({
       nationalId: data.nin,  // Transform here
       verificationHash: data.nidaVerification.data.verificationHash,
     }) : null,
   };
   ```

3. **Handle both NIN and non-NIN flows:**
   - If `registrationType === 'nin'`: Include NIDA verification in transient
   - If `registrationType === 'non-nin'`: Include TIN verification or skip transient

## Frontend Payload (Current - Correct)

The frontend is sending:
```javascript
{
  name: "John Doe",
  nin: "1234567890123456",  // Backend should use this as nationalId
  tin: "TIN-123-456-789",
  type: "Individual",
  businessCategory: "Retail",
  registrationAddress: "123 Main Street",  // Backend should use this as address
  contactEmail: "john@example.com",
  phoneNumber: "+255712345678",
  nidaVerification: {...},  // Backend should extract verificationHash from here
  complianceScore: 95,
  registrationType: "nin"
}
```

## Backend Transformation Required

The backend needs to transform the payload before calling the blockchain:

```javascript
// In backend /api/taxpayers/register handler:

// 1. Transform for blockchain
const blockchainPayload = {
  tin: req.body.tin,
  name: req.body.name,
  type: req.body.type,
  businessCategory: req.body.businessCategory,
  address: req.body.registrationAddress,  // Transform registrationAddress → address
  contactEmail: req.body.contactEmail,
  phoneNumber: req.body.phoneNumber,
  registrationDate: req.body.registrationDate,
};

// 2. Build transient data
const transientData = {};
if (req.body.registrationType === 'nin' && req.body.nidaVerification) {
  transientData['nida-verification'] = JSON.stringify({
    nationalId: req.body.nin,  // Transform nin → nationalId
    verificationHash: req.body.nidaVerification.data.verificationHash,
  });
}

// 3. Call blockchain
const blockchainResult = await blockchainService.registerTaxpayer({
  ...blockchainPayload,
  nationalId: req.body.nin,  // For transient data
});
```

## Key Points

1. ✅ Frontend payload is correct
2. ❌ Backend needs to transform `registrationAddress` → `address`
3. ❌ Backend needs to transform `nin` → `nationalId` for transient data
4. ❌ Backend should NOT use `blockchainRegistration` from frontend - it should call blockchain itself
5. ✅ Backend should handle the blockchain transaction internally

## Solution

The backend implementation needs to:
1. Accept the frontend payload as-is
2. Transform field names before calling blockchain
3. Call blockchain service internally (not rely on frontend's mock)
4. Store result in database after successful blockchain registration

