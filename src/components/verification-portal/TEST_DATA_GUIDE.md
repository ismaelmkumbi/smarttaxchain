# Test Data Guide for Verification Portal

## 📋 Quick Test Data Reference

### Test Credentials

#### Valid Test Data (Happy Path)
```
TIN: 566566666
Assessment ID: ASSESS-2025-1763533388302-2027
OTP: 123456 (any 6 digits for testing)
```

#### Other Test TINs
- `123456789`
- `987654321`
- `111222333`
- `444555666`

#### Other Test Assessment IDs
- `ASSESS-2025-1763431249969-8045`
- `ASSESS-2025-1763502866584-1926`
- `ASSESS-2024-1700000000000-0001`
- `ASSESS-2025-1700000000000-0002`

## 🧪 Test Scenarios

### 1. Successful Verification
1. Enter TIN: `566566666`
2. Enter Assessment ID: `ASSESS-2025-1763533388302-2027`
3. Click "Request OTP"
4. Enter any 6-digit OTP (e.g., `123456`)
5. Click "Verify Assessment"
6. ✅ Should show assessment details, timeline, payments, and blockchain proof

### 2. Invalid TIN
1. Enter TIN: `12345` (too short)
2. Enter Assessment ID: `ASSESS-2025-1763533388302-2027`
3. ❌ Should show error: "TIN must be 9 digits"

### 3. Invalid Assessment ID
1. Enter TIN: `566566666`
2. Enter Assessment ID: `INVALID-ID`
3. ❌ Should show error: "Invalid Assessment ID format"

### 4. Invalid OTP
1. Enter valid TIN and Assessment ID
2. Request OTP
3. Enter OTP: `000000`
4. ❌ Should show error: "Invalid or expired OTP"

### 5. Assessment Not Found
1. Enter TIN: `566566666`
2. Enter Assessment ID: `ASSESS-2025-9999999999-9999`
3. Request OTP and verify
4. ❌ Should show error: "Assessment not found"

### 6. Rate Limiting
1. Try to verify 11 times in a row
2. ❌ Should show rate limit warning after 10 attempts

## 📊 Expected Data Structure

### Assessment Summary
- **Assessment ID**: ASSESS-2025-1763533388302-2027
- **Status**: PENDING
- **Amount**: TZS 7,800,000
- **Total Due**: TZS 7,800,000
- **Interest**: TZS 0
- **Penalties**: TZS 0
- **Due Date**: November 21, 2025
- **Tax Period**: 2025-Q2
- **Tax Type**: INDIVIDUAL_INCOME_TAX

### Timeline Events (5 events)
1. **CREATE** - Assessment created (Nov 19, 2025)
2. **UPDATE** - Assessment updated (Nov 19, 2025)
3. **INTEREST_CALCULATED** - Interest calculated (Nov 20, 2025)
4. **PENALTY_APPLIED** - Penalty applied (Nov 20, 2025)
5. **APPROVE** - Assessment approved (Nov 21, 2025)

### Payment History (2 payments)
1. **Payment 1**: TZS 2,000,000 (Nov 22, 2025) - BANK_TRANSFER
2. **Payment 2**: TZS 3,000,000 (Nov 25, 2025) - MOBILE_MONEY
3. **Total Paid**: TZS 5,000,000

### Blockchain Verification
- **Status**: ✅ Verified
- **Transaction ID**: `dae64a26e56018b4130c9a1ee6eec8a82e78f54ad7023d2d899c8a3920721444`
- **Channel**: mychannel
- **Chaincode**: tra-immutable-ledger
- **Contract**: TaxAssessmentContract
- **Ledger Events**: 3 events

## 🔧 Using Test Data in Development

### Option 1: Mock Service (Recommended for UI Testing)

Create a mock service that returns test data:

```javascript
// src/services/verificationService.mock.js
import { mockAssessmentData, getMockResponse } from '../components/verification-portal/testData';

export default {
  requestOTP: async (tin, assessmentId) => {
    await simulateAPIDelay(1000);
    return getMockResponse('requestOTP', { tin, assessmentId });
  },
  
  verifyAssessment: async (tin, assessmentId, otp) => {
    await simulateAPIDelay(1500);
    return getMockResponse('verifyAssessment', { tin, assessmentId, otp });
  },
  
  // ... other methods
};
```

### Option 2: Environment Variable

Set `REACT_APP_USE_MOCK_DATA=true` to use mock data:

```javascript
// src/services/verificationService.js
import mockService from './verificationService.mock';
import realService from './verificationService';

const useMock = process.env.REACT_APP_USE_MOCK_DATA === 'true';

export default useMock ? mockService : realService;
```

### Option 3: Direct Import in Component

For quick testing, import test data directly:

```javascript
import { mockAssessmentData } from 'src/components/verification-portal/testData';

// Use in component
const handleTestVerification = () => {
  onVerificationSuccess(mockAssessmentData);
};
```

## 🎯 Testing Checklist

- [ ] **Form Validation**
  - [ ] TIN validation (9 digits)
  - [ ] Assessment ID validation (ASSESS- prefix)
  - [ ] OTP validation (6 digits)
  - [ ] Error messages display correctly

- [ ] **OTP Flow**
  - [ ] Request OTP button works
  - [ ] OTP sent confirmation appears
  - [ ] Countdown timer works
  - [ ] Resend OTP works after countdown

- [ ] **Verification Flow**
  - [ ] Successful verification shows results
  - [ ] Error handling works (invalid OTP, not found, etc.)
  - [ ] Loading states display correctly
  - [ ] Rate limiting works

- [ ] **Result Display**
  - [ ] Assessment summary shows all fields
  - [ ] Timeline displays all events
  - [ ] Payment history shows all payments
  - [ ] Blockchain proof displays correctly
  - [ ] Tabs switch correctly

- [ ] **Interactive Features**
  - [ ] Timeline expand/collapse works
  - [ ] Copy hash functionality works
  - [ ] Download PDF button (mock)
  - [ ] Report Issue button (mock)

- [ ] **Mobile Responsiveness**
  - [ ] Forms work on mobile
  - [ ] Tables scroll on mobile
  - [ ] Timeline displays correctly
  - [ ] Buttons are touch-friendly

- [ ] **Accessibility**
  - [ ] Keyboard navigation works
  - [ ] Screen reader announces correctly
  - [ ] Focus indicators visible
  - [ ] ARIA labels present

## 🐛 Common Test Issues

### Issue: "OTP not sent"
**Solution**: Check that `requestOTP` API endpoint is working or use mock data.

### Issue: "Verification fails"
**Solution**: Ensure TIN and Assessment ID match in test data, or check API response format.

### Issue: "Timeline not showing"
**Solution**: Verify `auditTrail` array is in the response with correct structure.

### Issue: "Payments not displaying"
**Solution**: Check that `payments` array exists in response with required fields.

### Issue: "Blockchain data missing"
**Solution**: Ensure `blockchain` object is included in verification response.

## 📝 Notes

- All test data uses realistic formats matching production
- Dates are in ISO 8601 format
- Amounts are in TZS (Tanzanian Shillings)
- Officer IDs are pseudonymized (OFF-XXXXX format)
- Blockchain hashes are realistic 64-character hex strings
- All test data is safe to use in development

## 🔗 Related Files

- `src/components/verification-portal/testData.js` - Full test data definitions
- `src/services/verificationService.js` - API service (needs backend)
- `src/components/verification-portal/VerificationForm.jsx` - Form component
- `src/components/verification-portal/VerificationResult.jsx` - Results component

