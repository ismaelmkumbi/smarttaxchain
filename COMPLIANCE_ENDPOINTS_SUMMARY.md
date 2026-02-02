# Compliance Dashboard - Endpoints Summary

## Quick Reference for Backend Implementation

### ✅ Already Implemented in Frontend Service
The following methods exist in `src/services/traApiService.js`:

1. ✅ `getComplianceDashboard()` → `GET /api/compliance/dashboard`
2. ✅ `getComplianceScore(taxpayerId)` → `GET /api/compliance/score/{taxpayerId}`
3. ✅ `scheduleAudit(data)` → `POST /api/compliance/audit`
4. ✅ `recordPenalty(data)` → `POST /api/compliance/penalties`
5. ✅ `getAuditHistory(taxpayerId)` → `GET /api/compliance/audits/{taxpayerId}`
6. ✅ `getComplianceAnalytics(filters)` → `GET /api/reports/compliance/analytics`

### ❌ Missing Endpoints (Need Backend Implementation)

Based on the `ComplianceMonitoring` component requirements, the following endpoints need to be implemented:

#### 1. Get All Taxpayers with Compliance Data
**Frontend Need:** Display list of taxpayers with compliance scores in cards
- **Endpoint:** `GET /api/compliance/taxpayers`
- **Used by:** `ComplianceMonitoring` component (line 829: `taxpayers.slice(0, 8).map(...)`)
- **Priority:** HIGH

#### 2. Get Risk Assessment
**Frontend Need:** Display risk factors for taxpayers
- **Endpoint:** `GET /api/compliance/risk-assessment/{tin}`
- **Used by:** `RiskAssessment` component (line 586-639)
- **Priority:** MEDIUM

#### 3. Get Penalty History
**Frontend Need:** Display penalty history with filters
- **Endpoint:** `GET /api/compliance/penalties` (with query params)
- **Used by:** Penalty management features
- **Priority:** MEDIUM

#### 4. Get All Audits (with filters)
**Frontend Need:** Display audit history with filters
- **Endpoint:** `GET /api/compliance/audits` (with query params)
- **Note:** Currently only `getAuditHistory(taxpayerId)` exists for single taxpayer
- **Priority:** MEDIUM

---

## Critical Endpoints for MVP

For the compliance dashboard to work at `http://localhost:5173/apps/compliance`, implement these **3 endpoints first**:

### 1. GET /api/compliance/dashboard
**Status:** ✅ Frontend service exists, needs backend implementation

**Response Structure:**
```json
{
  "overview": {
    "totalTaxpayers": 1250,
    "compliantTaxpayers": 980,
    "nonCompliantTaxpayers": 270,
    "averageComplianceScore": 82.5,
    "highRiskCount": 45,
    "mediumRiskCount": 180,
    "lowRiskCount": 1025
  },
  "recentActivities": {
    "auditsScheduled": 12,
    "penaltiesIssued": 8,
    "complianceImprovements": 25,
    "lastUpdated": "2025-01-18T10:30:00Z"
  },
  "metrics": {
    "timelyFilingRate": 85.2,
    "accurateReportingRate": 78.5,
    "paymentComplianceRate": 92.1,
    "documentationCompleteness": 88.3,
    "cooperationScore": 95.0
  },
  "trends": [
    { "month": "2024-07", "score": 75 },
    { "month": "2024-08", "score": 78 },
    { "month": "2024-09", "score": 82 },
    { "month": "2024-10", "score": 85 },
    { "month": "2024-11", "score": 88 },
    { "month": "2024-12", "score": 90 }
  ]
}
```

### 2. GET /api/compliance/taxpayers
**Status:** ❌ Missing - needs implementation

**Query Parameters:**
- `riskLevel` (optional): LOW, MEDIUM, HIGH
- `minScore` (optional): 0-100
- `maxScore` (optional): 0-100
- `region` (optional)
- `lastAuditFrom` (optional): YYYY-MM-DD
- `page` (optional): default 1
- `pageSize` (optional): default 50, max 100

**Response Structure:**
```json
{
  "taxpayers": [
    {
      "id": "TP001",
      "tin": "123456789",
      "name": "ABC Company Ltd",
      "region": "Dar es Salaam",
      "complianceScore": 85.5,
      "riskLevel": "LOW",
      "lastAuditDate": "2024-12-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 1250,
    "totalPages": 25
  }
}
```

### 3. POST /api/compliance/audits/schedule
**Status:** ✅ Frontend service exists (`scheduleAudit`), but endpoint path may differ

**Request Body:**
```json
{
  "taxpayerId": "123456789",
  "auditType": "REGULAR",
  "scheduledDate": "2025-02-15T09:00:00Z",
  "auditorId": "AUD-001",
  "reason": "Annual compliance review",
  "priority": "MEDIUM",
  "estimatedDuration": 5,
  "blockchainVerification": true
}
```

**Response:**
```json
{
  "audit": {
    "auditId": "AUDIT-2025-001234",
    "taxpayerId": "123456789",
    "auditType": "REGULAR",
    "scheduledDate": "2025-02-15T09:00:00Z",
    "status": "SCHEDULED",
    "blockchainTxId": "tx_audit_20250118_001234"
  }
}
```

### 4. POST /api/compliance/penalties
**Status:** ✅ Frontend service exists (`recordPenalty`)

**Request Body:**
```json
{
  "taxpayerId": "123456789",
  "penaltyType": "LATE_FILING",
  "amount": 500000,
  "reason": "Late filing of VAT return",
  "dueDate": "2025-02-15T00:00:00Z",
  "gracePeriod": 30,
  "blockchainRecord": true
}
```

---

## Hyperledger Blockchain Integration

### Smart Contract Functions Required:

1. **Record Compliance Score**
   ```javascript
   async RecordComplianceScore(taxpayerId, score, breakdown, timestamp)
   // Returns: { txId, blockHeight, verified }
   ```

2. **Schedule Audit**
   ```javascript
   async ScheduleAudit(auditId, taxpayerId, auditData, timestamp)
   // Returns: { txId, blockHeight, verified }
   ```

3. **Record Penalty**
   ```javascript
   async RecordPenalty(penaltyId, taxpayerId, penaltyData, timestamp)
   // Returns: { txId, blockHeight, verified }
   ```

4. **Verify Compliance Record**
   ```javascript
   async VerifyComplianceRecord(recordId, recordType)
   // Returns: { verified, blockchainHash, databaseHash, matches }
   ```

### Blockchain Data Structure:

```javascript
{
  "recordType": "COMPLIANCE_SCORE" | "AUDIT" | "PENALTY",
  "taxpayerId": "123456789",
  "data": {
    // Record-specific data
  },
  "timestamp": "2025-01-18T10:30:00Z",
  "createdBy": "officer.jane@tra.go.tz",
  "blockHeight": 123457,
  "txId": "tx_compliance_123456789_20250118"
}
```

---

## Implementation Checklist

### Phase 1: Core Functionality (MVP)
- [ ] `GET /api/compliance/dashboard` - Dashboard overview
- [ ] `GET /api/compliance/taxpayers` - Taxpayer list with compliance scores
- [ ] `GET /api/compliance/score/{tin}` - Individual compliance score
- [ ] `POST /api/compliance/audits/schedule` - Schedule audit
- [ ] `POST /api/compliance/penalties` - Record penalty

### Phase 2: Enhanced Features
- [ ] `GET /api/compliance/analytics` - Analytics and trends
- [ ] `GET /api/compliance/risk-assessment/{tin}` - Risk assessment
- [ ] `GET /api/compliance/audits` - Audit history with filters
- [ ] `GET /api/compliance/penalties` - Penalty history with filters

### Phase 3: Advanced Features
- [ ] `POST /api/compliance/calculate-score` - Recalculate score
- [ ] `GET /api/compliance/reports` - Generate reports
- [ ] `GET /api/compliance/verify/{recordId}` - Blockchain verification

---

## Frontend Service Updates Needed

Update `src/services/traApiService.js` to add:

```javascript
// Get all taxpayers with compliance data
async getComplianceTaxpayers(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  return this.request(`/compliance/taxpayers?${queryParams}`);
}

// Get risk assessment
async getRiskAssessment(tin) {
  return this.request(`/compliance/risk-assessment/${tin}`);
}

// Get all audits with filters
async getAllAudits(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  return this.request(`/compliance/audits?${queryParams}`);
}

// Get all penalties with filters
async getAllPenalties(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  return this.request(`/compliance/penalties?${queryParams}`);
}
```

---

## Testing Endpoints

Use these curl commands to test:

```bash
# Get compliance dashboard
curl -X GET "http://localhost:3000/api/compliance/dashboard" \
  -H "Authorization: Bearer <jwt>"

# Get taxpayers with compliance
curl -X GET "http://localhost:3000/api/compliance/taxpayers?riskLevel=LOW&page=1&pageSize=50" \
  -H "Authorization: Bearer <jwt>"

# Schedule audit
curl -X POST "http://localhost:3000/api/compliance/audits/schedule" \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "taxpayerId": "123456789",
    "auditType": "REGULAR",
    "scheduledDate": "2025-02-15T09:00:00Z",
    "auditorId": "AUD-001",
    "reason": "Annual review",
    "priority": "MEDIUM"
  }'

# Record penalty
curl -X POST "http://localhost:3000/api/compliance/penalties" \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "taxpayerId": "123456789",
    "penaltyType": "LATE_FILING",
    "amount": 500000,
    "reason": "Late filing",
    "dueDate": "2025-02-15T00:00:00Z"
  }'
```

---

## Notes

1. **Blockchain Integration:** All compliance records (scores, audits, penalties) should be recorded on Hyperledger Fabric for immutability and verification.

2. **Compliance Score Calculation:** The score should be calculated based on:
   - Timely filing (25%)
   - Accurate reporting (30%)
   - Payment history (25%)
   - Documentation (10%)
   - Cooperation (10%)

3. **Risk Levels:**
   - LOW: Score ≥ 80
   - MEDIUM: Score 60-79
   - HIGH: Score < 60

4. **Authentication:** All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

5. **Error Handling:** Return consistent error format:
   ```json
   {
     "success": false,
     "error": "Error message",
     "code": "ERROR_CODE"
   }
   ```

