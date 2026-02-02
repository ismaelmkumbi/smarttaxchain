# Taxpayer Verification Portal

## 📁 Folder Structure

```
verification-portal/
├── components/
│   ├── VerificationForm.jsx          # Step 1: TIN + Assessment ID + OTP
│   ├── VerificationResult.jsx        # Step 2: Assessment Summary
│   ├── AssessmentTimeline.jsx        # Step 3: Lifecycle Timeline
│   ├── PaymentHistory.jsx            # Payment records
│   ├── BlockchainProof.jsx           # Cryptographic verification
│   ├── TechnicalDetails.jsx          # Collapsed advanced view
│   └── HelpTooltip.jsx               # Contextual help
├── services/
│   └── verificationService.js        # API integration
├── hooks/
│   ├── useVerification.js           # React Query hook
│   └── useOTP.js                     # OTP management
├── utils/
│   ├── formatters.js                 # Data formatting
│   ├── validators.js                 # Form validation
│   └── security.js                   # TIN masking, etc.
└── pages/
    ├── VerificationPage.jsx          # Main verification entry
    └── ResultPage.jsx                # Results dashboard
```

## 🎯 Component Architecture

### 1. VerificationForm

- TIN input (with masking)
- Assessment ID input
- OTP field (SMS/Email)
- Validation & error handling
- Loading states
- CAPTCHA (optional)

### 2. VerificationResult

- Assessment summary card
- Status badges
- Amounts display
- Due dates
- Officer info (pseudonymized)
- Action buttons (Download PDF, Report Issue)

### 3. AssessmentTimeline

- Visual timeline component
- Lifecycle events (Created, Updated, Approved, Paid)
- Color-coded icons
- Expandable technical details
- Human-friendly language

### 4. PaymentHistory

- Payment records table
- Receipt links
- Reconciliation view
- Blockchain proof per payment

### 5. BlockchainProof

- Hash display
- Verification badge
- Technical details (collapsed)
- Copy hash functionality

## 🔒 Security Features

- TIN masking: `***123`
- OTP validation
- Rate limiting UI feedback
- No officer names (only IDs/roles)
- HTTPS enforcement
- Session management

## 🧪 Test Data

See `testData.js` and `TEST_DATA_GUIDE.md` for complete test data and scenarios.

**Quick Test Credentials:**

- TIN: `566566666`
- Assessment ID: `ASSESS-2025-1763533388302-2027`
- OTP: `123456` (any 6 digits for testing)

## 📱 Mobile Responsive

- Breakpoints: xs, sm, md, lg, xl
- Touch-friendly buttons
- Responsive tables
- Sticky headers
- Mobile-optimized forms

## ♿ Accessibility

- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
