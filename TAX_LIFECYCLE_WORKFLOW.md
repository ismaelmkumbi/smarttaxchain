# Tax Assessment Lifecycle Workflow - Frontend Design

## Overview

This document describes the complete user-facing workflow for the tax assessment system, including all UI components, user journeys, and visual representations of the tax lifecycle.

## User Journey Flow

```
Start → Assessment Created → Payment Due → Payment Late → Interest Applied →
Non-compliance → Penalty Applied → Ledger Entry → Blockchain Recorded
```

### Detailed Flow Steps

1. **Assessment Creation**

   - User selects taxpayer or enters TIN
   - User enters assessment details (tax type, amount, due date)
   - System creates assessment with status "PENDING"
   - Assessment recorded on blockchain

2. **Payment Due**

   - Assessment status changes to "OPEN"
   - Taxpayer receives notification
   - Due date displayed prominently
   - Payment options shown

3. **Payment Late**

   - After due date passes, interest begins accruing
   - Interest calculated at 1.5% per month
   - Status may change to "OVERDUE"
   - Visual indicators show interest accumulation

4. **Non-compliance**

   - If payment remains overdue, penalties applied
   - Penalty rate: 5% of assessment amount
   - Status changes to reflect non-compliance
   - Compliance score affected

5. **Ledger Entry**
   - All transactions recorded on immutable blockchain
   - Each event creates a ledger entry
   - Transaction hash generated
   - Block number assigned
   - Complete audit trail maintained

## Component Structure

### 1. AssessmentCreationWizard

**Location:** `src/components/apps/assessment/AssessmentCreationWizard/index.jsx`

**Purpose:** Multi-step wizard for creating tax assessments

**Steps:**

- Step 1: Taxpayer Selection (search or enter TIN)
- Step 2: Assessment Details (tax type, amount, due date, description)
- Step 3: Review & Confirm (summary before submission)

**Features:**

- Form validation at each step
- Autocomplete taxpayer search
- Real-time error feedback
- Summary review before submission

### 2. TaxpayerAccountView

**Location:** `src/components/apps/assessment/TaxpayerAccountView/index.jsx`

**Purpose:** Comprehensive view of taxpayer account with all assessments

**Tabs:**

- **Overview:** Summary statistics, total due, compliance status
- **Lifecycle:** Visual flow of assessment lifecycle
- **Interest & Penalties:** Detailed breakdown of charges
- **Ledger Timeline:** Complete blockchain transaction history

**Features:**

- Tabbed interface for different views
- Real-time calculations
- Visual status indicators
- Integration with all lifecycle components

### 3. TaxLifecycleFlow

**Location:** `src/components/apps/assessment/TaxLifecycleFlow/index.jsx`

**Purpose:** Visual representation of assessment lifecycle stages

**Stages:**

1. Assessment Created (Primary)
2. Payment Due (Info)
3. Payment Late / Interest (Warning)
4. Non-compliance / Penalty (Error)
5. Ledger Entry (Success)

**Features:**

- Vertical stepper component
- Color-coded stages
- Active step highlighting
- Status indicators

### 4. InterestPenaltyDisplay

**Location:** `src/components/apps/assessment/InterestPenaltyDisplay/index.jsx`

**Purpose:** Display interest and penalty calculations with breakdowns

**Components:**

- Interest Card: Shows accrued interest, days overdue, calculation details
- Penalty Card: Shows applied penalties, penalty type, rates
- Total Due Summary: Combined amount with breakdown

**Features:**

- Visual distinction between interest and penalties
- Detailed calculation breakdowns
- Days overdue calculation
- Currency formatting

### 5. ImmutableLedgerTimeline

**Location:** `src/components/apps/assessment/ImmutableLedgerTimeline/index.jsx`

**Purpose:** Display complete blockchain transaction history

**Features:**

- Timeline visualization
- Transaction details (type, amount, timestamp)
- Blockchain metadata (block number, transaction hash)
- Copy-to-clipboard for transaction hashes
- Color-coded event types
- Immutability indicators

## Screen Layouts

### Assessment Creation Screen

```
┌─────────────────────────────────────────────────┐
│  Create Tax Assessment                          │
├─────────────────────────────────────────────────┤
│  [Step 1: Taxpayer] [Step 2: Details] [Step 3: Review] │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Taxpayer Selection Form]                      │
│  - Search dropdown                             │
│  - OR TIN input                                │
│                                                 │
│  [Back]                    [Next]              │
└─────────────────────────────────────────────────┘
```

### Taxpayer Account View

```
┌─────────────────────────────────────────────────┐
│  [Taxpayer Header with Avatar]                  │
│  Name, TIN, Type, Status                       │
├─────────────────────────────────────────────────┤
│  [Overview] [Lifecycle] [Interest] [Ledger]     │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Selected Tab Content]                         │
│  - Overview: Stats cards                        │
│  - Lifecycle: Stepper flow                      │
│  - Interest: Calculation cards                 │
│  - Ledger: Timeline view                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Assessment Detail View

```
┌─────────────────────────────────────────────────┐
│  Assessment Details                             │
├─────────────────────────────────────────────────┤
│  [Status Badge]          [Total Due: Amount]    │
│                                                 │
│  Assessment Information                         │
│  - ID, Tax Type, Period, Description            │
│                                                 │
│  Financial Breakdown                            │
│  [Base Amount] [Penalties] [Interest]           │
│                                                 │
│  [Lifecycle Flow Component]                     │
│                                                 │
│  [Interest & Penalty Display]                   │
│                                                 │
│  [Immutable Ledger Timeline]                   │
└─────────────────────────────────────────────────┘
```

## Component Tree

```
TaxAssessmentSystem
├── AssessmentCreationWizard
│   ├── Stepper (MUI)
│   ├── Step 1: TaxpayerSelection
│   │   ├── Autocomplete
│   │   └── TextField (TIN)
│   ├── Step 2: AssessmentDetails
│   │   ├── TextField (Tax Type)
│   │   ├── TextField (Year, Quarter)
│   │   ├── TextField (Amount)
│   │   └── TextField (Due Date)
│   └── Step 3: Review
│       └── Summary Card
│
├── TaxpayerAccountView
│   ├── TaxpayerHeader
│   ├── Tabs
│   ├── OverviewTab
│   │   └── StatsCards
│   ├── LifecycleTab
│   │   └── TaxLifecycleFlow
│   ├── InterestPenaltyTab
│   │   └── InterestPenaltyDisplay
│   └── LedgerTab
│       └── ImmutableLedgerTimeline
│
├── TaxLifecycleFlow
│   └── Stepper (Vertical)
│       ├── Assessment Created
│       ├── Payment Due
│       ├── Payment Late
│       ├── Non-compliance
│       └── Ledger Entry
│
├── InterestPenaltyDisplay
│   ├── InterestCard
│   ├── PenaltyCard
│   └── TotalDueSummary
│
└── ImmutableLedgerTimeline
    └── Timeline (MUI)
        └── TimelineItem[] (for each transaction)
```

## User Flow Diagrams

### Creating Assessment

```
User Action → Select Taxpayer → Enter Details → Review → Submit
     ↓              ↓                ↓           ↓         ↓
  Wizard      Step 1 Complete   Step 2 Complete  Step 3  API Call
  Opens       Validation        Validation       Review  Success
                                                          ↓
                                                    Assessment Created
                                                    Blockchain Entry
```

### Viewing Lifecycle

```
User Opens Account → Selects Assessment → Views Lifecycle Tab
         ↓                    ↓                    ↓
    Load Data          Current Step          Display Flow
    Assessments        Calculated            Visual Stepper
         ↓                    ↓                    ↓
    Calculate Totals    Show Active Stage    Highlight Current
    Interest/Penalties  Show History         Show Next Steps
```

### Interest & Penalty Calculation

```
Assessment Created → Due Date Passes → Interest Applied
         ↓                  ↓                  ↓
    Base Amount        Days Overdue        Calculate Interest
    Recorded          Calculated          (1.5% per month)
         ↓                  ↓                  ↓
    Status: OPEN      Status: OVERDUE    Display Interest
                                              ↓
                                    If Still Overdue
                                              ↓
                                    Penalty Applied
                                    (5% of amount)
                                              ↓
                                    Display Penalties
                                    Update Total Due
```

## Visual Design Principles

1. **Color Coding:**

   - Primary (Blue): Assessment creation, standard operations
   - Warning (Orange): Interest, overdue items
   - Error (Red): Penalties, non-compliance
   - Success (Green): Completed, paid, confirmed

2. **Status Indicators:**

   - Chips for quick status recognition
   - Icons for visual context
   - Progress indicators for lifecycle stages

3. **Information Hierarchy:**

   - Most important info (amounts, status) at top
   - Details and breakdowns below
   - Historical data in timeline format

4. **Immutability Indicators:**
   - Blockchain iconography
   - Transaction hash display
   - "Verified" badges
   - Lock icons for immutable records

## Integration Points

### With Backend API

- **Assessment Creation:** `POST /api/tax-assessments`
- **Get Assessment:** `GET /api/tax-assessments/:id`
- **Get Taxpayer Assessments:** `GET /api/tax-assessments/tin/:tin`
- **Update Assessment:** `PUT /api/tax-assessments/:id`

### With Blockchain

- All transactions generate blockchain entries
- Transaction hashes stored with assessments
- Block numbers tracked
- Immutability verified

## Future Enhancements

1. **Real-time Updates:** WebSocket integration for live status changes
2. **Payment Integration:** Direct payment processing from UI
3. **Notifications:** Push notifications for due dates and penalties
4. **Export:** PDF generation for assessment documents
5. **Analytics:** Charts and graphs for compliance trends
6. **Mobile Responsive:** Optimized for mobile devices

## Usage Examples

### Creating an Assessment

```jsx
import AssessmentCreationWizard from 'src/components/apps/assessment/AssessmentCreationWizard';

<AssessmentCreationWizard
  taxpayerOptions={taxpayers}
  onComplete={(data) => handleCreateAssessment(data)}
  onCancel={() => handleCancel()}
/>;
```

### Viewing Taxpayer Account

```jsx
import TaxpayerAccountView from 'src/components/apps/assessment/TaxpayerAccountView';

<TaxpayerAccountView taxpayer={taxpayerData} assessments={assessmentList} />;
```

### Displaying Lifecycle

```jsx
import TaxLifecycleFlow from 'src/components/apps/assessment/TaxLifecycleFlow';

<TaxLifecycleFlow assessment={currentAssessment} currentStep={calculateCurrentStep(assessment)} />;
```

## Notes

- All components are display-only (no backend logic)
- Calculations shown are for display purposes
- Actual calculations should come from backend
- Blockchain integration is simulated in mock data
- All currency values formatted for TZS (Tanzanian Shilling)
