# Compliance Dashboard API Endpoints

## Overview

This document outlines the API endpoints required for the Compliance Monitoring Dashboard (`/apps/compliance`). All endpoints integrate with:

1. **Hyperledger Fabric Blockchain** - For immutable compliance records
2. **Enterprise Audit Module** - For comprehensive audit trails and accountability
3. **PostgreSQL Database** - For fast querying and analytics

### 🔗 Enterprise Audit Module Integration

All compliance operations are **automatically logged** by the Enterprise Audit Module with comprehensive metadata:

- **Entity Types**: `COMPLIANCE` (scores, risk assessments), `AUDIT` (scheduled audits), `PENALTY` (penalty records)
- **Automatic Logging**: All POST/PUT/DELETE operations automatically captured
- **Blockchain Transaction IDs**: Automatically extracted from API responses
- **Risk Level Calculation**:
  - DELETE/UPDATE operations → **HIGH** risk
  - CREATE operations → **MEDIUM** risk
  - READ operations → **LOW** risk
- **Compliance Flags**: Automatically tagged with:
  - `COMPLIANCE_RELATED` - All compliance operations
  - `BLOCKCHAIN_OPERATION` - Operations recorded on blockchain
  - `FINANCIAL_TRANSACTION` - Penalty operations (amounts > 0)
  - `DATA_CREATION` - Creating compliance records
  - `DATA_MODIFICATION` - Updating compliance records
- **Before/After State Tracking**: Complete state changes captured for all modifications
- **Change Detection**: Field-level changes automatically detected (ADDED, MODIFIED, REMOVED)
- **User Tracking**: User identity extracted from JWT token (email, name, role, MSP)
- **Device & Location**: IP address, user agent, device fingerprint, location data
- **Performance Metrics**: Execution time, response size

### 📊 Query Compliance Audit Logs

Use the Enterprise Audit Module endpoints to query compliance-related audit logs:

```http
# Get all compliance-related audit logs
GET /api/audit/logs?entityType=COMPLIANCE&page=1&pageSize=50

# Get audit trail for a specific compliance record
GET /api/audit/trail/COMPLIANCE/COMPLIANCE-2025-001234

# Get all scheduled audit operations
GET /api/audit/logs?entityType=AUDIT&action=CREATE&page=1&pageSize=50

# Get all penalty operations
GET /api/audit/logs?entityType=PENALTY&page=1&pageSize=50

# Get high-risk compliance operations
GET /api/audit/high-risk?entityType=COMPLIANCE&riskLevel=HIGH

# Get compliance operations by user
GET /api/audit/user/officer.jane@tra.go.tz?entityType=COMPLIANCE

# Search compliance audit logs
POST /api/audit/search
{
  "query": "compliance score calculation",
  "filters": {
    "entityType": "COMPLIANCE",
    "action": "CREATE"
  }
}

# Get compliance audit statistics
GET /api/audit/statistics?fromDate=2025-01-01&toDate=2025-12-31
```

For complete Enterprise Audit Module documentation, see: [Enterprise-Grade Audit Module Documentation](#enterprise-audit-module)

---

## 1. Get Compliance Dashboard

**Endpoint:** `GET /api/compliance/dashboard`

**Description:** Retrieves comprehensive compliance dashboard data including overall metrics, recent activities, and summary statistics.

**Authorization:** `Bearer <jwt>`

**Query Parameters:**

- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)
- `region` (optional): Filter by region

**Response:**

```json
{
  "success": true,
  "data": {
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
    ],
    "blockchainStats": {
      "totalComplianceRecords": 15234,
      "lastBlockHeight": 123456,
      "lastBlockTime": "2025-01-18T10:25:00Z",
      "verificationStatus": "verified"
    },
    "auditStats": {
      "totalComplianceAudits": 1250,
      "highRiskOperations": 45,
      "requiresReview": 120,
      "lastAuditLog": "2025-01-18T10:25:00Z"
    }
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 2. Get Compliance Score for Taxpayer

**Endpoint:** `GET /api/compliance/taxpayer/{tin}/score`

**Description:** Retrieves detailed compliance score and risk assessment for a specific taxpayer.

**Authorization:** `Bearer <jwt>`

**Response:**

```json
{
  "success": true,
  "data": {
    "taxpayer": {
      "tin": "123456789",
      "name": "ABC Company Ltd",
      "region": "Dar es Salaam"
    },
    "complianceScore": 85.5,
    "riskLevel": "LOW",
    "riskFactors": [
      {
        "factor": "Payment History",
        "level": "LOW",
        "weight": 0.25,
        "score": 95
      },
      {
        "factor": "Filing Compliance",
        "level": "MEDIUM",
        "weight": 0.3,
        "score": 70
      },
      {
        "factor": "Documentation",
        "level": "LOW",
        "weight": 0.2,
        "score": 90
      },
      {
        "factor": "Business Volume",
        "level": "HIGH",
        "weight": 0.15,
        "score": 60
      },
      {
        "factor": "Sector Risk",
        "level": "MEDIUM",
        "weight": 0.1,
        "score": 75
      }
    ],
    "breakdown": {
      "timelyFiling": 85,
      "accurateReporting": 78,
      "paymentHistory": 92,
      "documentation": 88,
      "cooperation": 95
    },
    "lastAuditDate": "2024-12-15T00:00:00Z",
    "nextAuditDue": "2025-06-15T00:00:00Z",
    "penaltiesCount": 0,
    "blockchainTxId": "tx_compliance_123456789_20250118",
    "verified": true
  },
  "audit": {
    "auditId": "AUDIT-1763463133205-COMPLIANCE-SCORE",
    "transactionId": "tx_compliance_123456789_20250118",
    "riskLevel": "LOW",
    "complianceFlags": ["COMPLIANCE_RELATED", "BLOCKCHAIN_OPERATION"],
    "requiresReview": false,
    "entityType": "COMPLIANCE",
    "entityId": "COMPLIANCE-123456789-20250118"
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 3. Get All Taxpayers with Compliance Data

**Endpoint:** `GET /api/compliance/taxpayers`

**Description:** Retrieves list of taxpayers with their compliance scores, risk levels, and key metrics.

**Authorization:** `Bearer <jwt>`

**Query Parameters:**

- `riskLevel` (optional): Filter by risk level (LOW, MEDIUM, HIGH)
- `minScore` (optional): Minimum compliance score (0-100)
- `maxScore` (optional): Maximum compliance score (0-100)
- `region` (optional): Filter by region
- `lastAuditFrom` (optional): Filter by last audit date (YYYY-MM-DD)
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 50, max: 100)

**Response:**

```json
{
  "success": true,
  "data": {
    "taxpayers": [
      {
        "tin": "123456789",
        "name": "ABC Company Ltd",
        "region": "Dar es Salaam",
        "complianceScore": 85.5,
        "riskLevel": "LOW",
        "lastAuditDate": "2024-12-15T00:00:00Z",
        "penaltiesCount": 0,
        "auditsCount": 3,
        "status": "COMPLIANT"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "total": 1250,
      "totalPages": 25
    }
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 4. Schedule Audit

**Endpoint:** `POST /api/compliance/audits/schedule`

**Description:** Schedules a new audit for a taxpayer. Creates an immutable record on blockchain.

**Authorization:** `Bearer <jwt>`

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
  "blockchainVerification": true,
  "automaticScheduling": false
}
```

**Request Fields:**

- `taxpayerId` (required): Taxpayer TIN
- `auditType` (required): Type of audit - `REGULAR`, `COMPLIANCE`, `RISK_BASED`, `SPECIAL`
- `scheduledDate` (required): ISO 8601 date/time
- `auditorId` (required): ID of assigned auditor
- `reason` (required): Reason for audit
- `priority` (optional): `LOW`, `MEDIUM`, `HIGH`, `URGENT` (default: `MEDIUM`)
- `estimatedDuration` (optional): Estimated duration in days (default: 2)
- `blockchainVerification` (optional): Whether to record on blockchain (default: true)
- `automaticScheduling` (optional): Whether automatically scheduled (default: false)

**Response:**

```json
{
  "success": true,
  "message": "Audit scheduled successfully",
  "data": {
    "audit": {
      "auditId": "AUDIT-2025-001234",
      "taxpayerId": "123456789",
      "auditType": "REGULAR",
      "scheduledDate": "2025-02-15T09:00:00Z",
      "auditorId": "AUD-001",
      "status": "SCHEDULED",
      "priority": "MEDIUM",
      "estimatedDuration": 5,
      "reason": "Annual compliance review",
      "createdAt": "2025-01-18T10:30:00Z",
      "createdBy": "officer.jane@tra.go.tz"
    },
    "blockchain": {
      "txId": "tx_audit_20250118_001234",
      "blockHeight": 123457,
      "timestamp": "2025-01-18T10:30:00Z",
      "verified": true
    },
    "audit": {
      "auditId": "AUDIT-1763463133205-AUDIT-SCHEDULE",
      "transactionId": "tx_audit_20250118_001234",
      "riskLevel": "MEDIUM",
      "complianceFlags": ["COMPLIANCE_RELATED", "BLOCKCHAIN_OPERATION", "DATA_CREATION"],
      "requiresReview": false,
      "entityType": "AUDIT",
      "entityId": "AUDIT-2025-001234",
      "user_id": "officer.jane@tra.go.tz",
      "user_name": "Jane Officer",
      "user_role": "officer"
    }
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 5. Record Penalty

**Endpoint:** `POST /api/compliance/penalties`

**Description:** Records a compliance penalty for a taxpayer. Creates an immutable record on blockchain.

**Authorization:** `Bearer <jwt>`

**Request Body:**

```json
{
  "taxpayerId": "123456789",
  "penaltyType": "LATE_FILING",
  "amount": 500000,
  "reason": "Late filing of VAT return for Q4 2024",
  "dueDate": "2025-02-15T00:00:00Z",
  "gracePeriod": 30,
  "automaticCalculation": true,
  "blockchainRecord": true
}
```

**Request Fields:**

- `taxpayerId` (required): Taxpayer TIN
- `penaltyType` (required): Type of penalty - `LATE_FILING`, `LATE_PAYMENT`, `INCORRECT_REPORTING`, `NON_COMPLIANCE`, `FRAUD`
- `amount` (required): Penalty amount in TZS
- `reason` (required): Reason for penalty
- `dueDate` (required): Due date for penalty payment (ISO 8601)
- `gracePeriod` (optional): Grace period in days (default: 30)
- `automaticCalculation` (optional): Whether amount was auto-calculated (default: true)
- `blockchainRecord` (optional): Whether to record on blockchain (default: true)

**Response:**

```json
{
  "success": true,
  "message": "Penalty recorded successfully",
  "data": {
    "penalty": {
      "penaltyId": "PENALTY-2025-001234",
      "taxpayerId": "123456789",
      "penaltyType": "LATE_FILING",
      "amount": 500000,
      "currency": "TZS",
      "reason": "Late filing of VAT return for Q4 2024",
      "dueDate": "2025-02-15T00:00:00Z",
      "gracePeriod": 30,
      "status": "PENDING",
      "createdAt": "2025-01-18T10:30:00Z",
      "createdBy": "officer.jane@tra.go.tz"
    },
    "blockchain": {
      "txId": "tx_penalty_20250118_001234",
      "blockHeight": 123458,
      "timestamp": "2025-01-18T10:30:00Z",
      "verified": true
    },
    "complianceImpact": {
      "previousScore": 85.5,
      "newScore": 82.3,
      "riskLevelChange": "LOW -> LOW"
    },
    "audit": {
      "auditId": "AUDIT-1763463133205-PENALTY-RECORD",
      "transactionId": "tx_penalty_20250118_001234",
      "riskLevel": "HIGH",
      "complianceFlags": [
        "COMPLIANCE_RELATED",
        "BLOCKCHAIN_OPERATION",
        "FINANCIAL_TRANSACTION",
        "DATA_CREATION"
      ],
      "requiresReview": true,
      "entityType": "PENALTY",
      "entityId": "PENALTY-2025-001234",
      "user_id": "officer.jane@tra.go.tz",
      "user_name": "Jane Officer",
      "user_role": "officer",
      "changes": [
        {
          "field": "complianceScore",
          "action": "MODIFIED",
          "oldValue": 85.5,
          "newValue": 82.3
        }
      ],
      "before_state": {
        "complianceScore": 85.5,
        "penaltiesCount": 0
      },
      "after_state": {
        "complianceScore": 82.3,
        "penaltiesCount": 1
      }
    }
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 6. Get Compliance Analytics

**Endpoint:** `GET /api/compliance/analytics`

**Description:** Retrieves compliance analytics including trends, factors breakdown, and comparative data.

**Authorization:** `Bearer <jwt>`

**Query Parameters:**

- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)
- `region` (optional): Filter by region
- `sector` (optional): Filter by business sector

**Response:**

```json
{
  "success": true,
  "data": {
    "overallMetrics": {
      "timelyFiling": 85.2,
      "accurateReporting": 78.5,
      "paymentHistory": 92.1,
      "documentation": 88.3,
      "cooperation": 95.0
    },
    "trends": [
      {
        "month": "2024-07",
        "score": 75,
        "timelyFiling": 70,
        "accurateReporting": 72,
        "paymentHistory": 88,
        "documentation": 82,
        "cooperation": 90
      },
      {
        "month": "2024-08",
        "score": 78,
        "timelyFiling": 73,
        "accurateReporting": 75,
        "paymentHistory": 89,
        "documentation": 84,
        "cooperation": 91
      }
    ],
    "riskDistribution": {
      "low": 1025,
      "medium": 180,
      "high": 45
    },
    "sectorComparison": [
      {
        "sector": "Manufacturing",
        "averageScore": 88.5,
        "taxpayerCount": 320
      },
      {
        "sector": "Retail",
        "averageScore": 75.2,
        "taxpayerCount": 450
      }
    ],
    "regionalComparison": [
      {
        "region": "Dar es Salaam",
        "averageScore": 85.3,
        "taxpayerCount": 650
      },
      {
        "region": "Arusha",
        "averageScore": 82.1,
        "taxpayerCount": 280
      }
    ]
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 7. Get Risk Assessment

**Endpoint:** `GET /api/compliance/risk-assessment/{tin}`

**Description:** Retrieves detailed risk assessment for a specific taxpayer.

**Authorization:** `Bearer <jwt>`

**Response:**

```json
{
  "success": true,
  "data": {
    "taxpayer": {
      "tin": "123456789",
      "name": "ABC Company Ltd"
    },
    "overallRiskLevel": "LOW",
    "riskFactors": [
      {
        "factor": "Payment History",
        "level": "LOW",
        "score": 95,
        "weight": 0.25,
        "details": "Consistent on-time payments for past 12 months"
      },
      {
        "factor": "Filing Compliance",
        "level": "MEDIUM",
        "score": 70,
        "weight": 0.3,
        "details": "2 late filings in past 6 months"
      },
      {
        "factor": "Documentation",
        "level": "LOW",
        "score": 90,
        "weight": 0.2,
        "details": "Complete documentation maintained"
      },
      {
        "factor": "Business Volume",
        "level": "HIGH",
        "score": 60,
        "weight": 0.15,
        "details": "High transaction volume increases risk"
      },
      {
        "factor": "Sector Risk",
        "level": "MEDIUM",
        "score": 75,
        "weight": 0.1,
        "details": "Manufacturing sector - medium risk profile"
      }
    ],
    "recommendations": [
      "Schedule regular audit within 6 months",
      "Monitor filing deadlines closely",
      "Consider enhanced documentation review"
    ],
    "lastAssessmentDate": "2025-01-15T00:00:00Z",
    "nextAssessmentDue": "2025-04-15T00:00:00Z",
    "blockchainTxId": "tx_risk_123456789_20250115",
    "verified": true
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 8. Get Audit History

**Endpoint:** `GET /api/compliance/audits`

**Description:** Retrieves audit history with filtering options.

**Authorization:** `Bearer <jwt>`

**Query Parameters:**

- `taxpayerId` (optional): Filter by taxpayer TIN
- `auditType` (optional): Filter by audit type
- `status` (optional): Filter by status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 50)

**Response:**

```json
{
  "success": true,
  "data": {
    "audits": [
      {
        "auditId": "AUDIT-2025-001234",
        "taxpayerId": "123456789",
        "taxpayerName": "ABC Company Ltd",
        "auditType": "REGULAR",
        "scheduledDate": "2025-02-15T09:00:00Z",
        "completedDate": null,
        "auditorId": "AUD-001",
        "auditorName": "John Auditor",
        "status": "SCHEDULED",
        "priority": "MEDIUM",
        "reason": "Annual compliance review",
        "findings": null,
        "blockchainTxId": "tx_audit_20250118_001234",
        "createdAt": "2025-01-18T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "total": 125,
      "totalPages": 3
    }
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 9. Get Penalty History

**Endpoint:** `GET /api/compliance/penalties`

**Description:** Retrieves penalty history with filtering options.

**Authorization:** `Bearer <jwt>`

**Query Parameters:**

- `taxpayerId` (optional): Filter by taxpayer TIN
- `penaltyType` (optional): Filter by penalty type
- `status` (optional): Filter by status (PENDING, PAID, WAIVED, CANCELLED)
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 50)

**Response:**

```json
{
  "success": true,
  "data": {
    "penalties": [
      {
        "penaltyId": "PENALTY-2025-001234",
        "taxpayerId": "123456789",
        "taxpayerName": "ABC Company Ltd",
        "penaltyType": "LATE_FILING",
        "amount": 500000,
        "currency": "TZS",
        "reason": "Late filing of VAT return for Q4 2024",
        "dueDate": "2025-02-15T00:00:00Z",
        "paidDate": null,
        "status": "PENDING",
        "blockchainTxId": "tx_penalty_20250118_001234",
        "createdAt": "2025-01-18T10:30:00Z",
        "createdBy": "officer.jane@tra.go.tz"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "total": 89,
      "totalPages": 2
    },
    "summary": {
      "totalAmount": 45000000,
      "pendingAmount": 12000000,
      "paidAmount": 33000000
    }
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 10. Calculate Compliance Score

**Endpoint:** `POST /api/compliance/calculate-score`

**Description:** Calculates or recalculates compliance score for a taxpayer based on current data.

**Authorization:** `Bearer <jwt>`

**Request Body:**

```json
{
  "taxpayerId": "123456789",
  "forceRecalculation": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "Compliance score calculated successfully",
  "data": {
    "taxpayerId": "123456789",
    "complianceScore": 85.5,
    "riskLevel": "LOW",
    "breakdown": {
      "timelyFiling": 85,
      "accurateReporting": 78,
      "paymentHistory": 92,
      "documentation": 88,
      "cooperation": 95
    },
    "calculationDate": "2025-01-18T10:30:00Z",
    "blockchainTxId": "tx_score_123456789_20250118",
    "verified": true
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 11. Get Compliance Reports

**Endpoint:** `GET /api/compliance/reports`

**Description:** Generates compliance reports (PDF/Excel) with various filters.

**Authorization:** `Bearer <jwt>`

**Query Parameters:**

- `reportType` (required): Type of report - `DASHBOARD`, `TAXPAYER_LIST`, `AUDIT_HISTORY`, `PENALTY_HISTORY`, `RISK_ASSESSMENT`, `ANALYTICS`
- `format` (optional): `PDF` or `EXCEL` (default: `PDF`)
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)
- `region` (optional): Filter by region
- `riskLevel` (optional): Filter by risk level

**Response:**

```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "reportId": "REPORT-2025-001234",
    "reportType": "DASHBOARD",
    "format": "PDF",
    "downloadUrl": "/api/compliance/reports/REPORT-2025-001234/download",
    "expiresAt": "2025-01-19T10:30:00Z",
    "fileSize": 2456789,
    "generatedAt": "2025-01-18T10:30:00Z"
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## 12. Verify Compliance Record on Blockchain

**Endpoint:** `GET /api/compliance/verify/{recordId}`

**Description:** Verifies a compliance record (audit, penalty, score) against blockchain.

**Authorization:** `Bearer <jwt>`

**Query Parameters:**

- `recordType` (required): Type of record - `AUDIT`, `PENALTY`, `SCORE`

**Response:**

```json
{
  "success": true,
  "data": {
    "recordId": "AUDIT-2025-001234",
    "recordType": "AUDIT",
    "verified": true,
    "blockchain": {
      "txId": "tx_audit_20250118_001234",
      "blockHeight": 123457,
      "timestamp": "2025-01-18T10:30:00Z",
      "hash": "0xabc123...",
      "previousHash": "0xdef456..."
    },
    "database": {
      "auditId": "AUDIT-2025-001234",
      "taxpayerId": "123456789",
      "scheduledDate": "2025-02-15T09:00:00Z",
      "status": "SCHEDULED"
    },
    "discrepancies": [],
    "verificationDate": "2025-01-18T10:30:00Z"
  },
  "timestamp": "2025-01-18T10:30:00Z"
}
```

---

## Blockchain Integration Notes

### Smart Contract Functions Required:

1. **Compliance Score Recording:**

   - `RecordComplianceScore(taxpayerId, score, breakdown, timestamp)`
   - Returns: `txId`, `blockHeight`
   - **Auto-Audited**: Entity type `COMPLIANCE`, Risk level `LOW` (READ) or `MEDIUM` (CREATE/UPDATE)
   - **Compliance Flags**: `COMPLIANCE_RELATED`, `BLOCKCHAIN_OPERATION`

2. **Audit Scheduling:**

   - `ScheduleAudit(auditId, taxpayerId, auditData, timestamp)`
   - Returns: `txId`, `blockHeight`
   - **Auto-Audited**: Entity type `AUDIT`, Risk level `MEDIUM` (CREATE)
   - **Compliance Flags**: `COMPLIANCE_RELATED`, `BLOCKCHAIN_OPERATION`, `DATA_CREATION`

3. **Penalty Recording:**

   - `RecordPenalty(penaltyId, taxpayerId, penaltyData, timestamp)`
   - Returns: `txId`, `blockHeight`
   - **Auto-Audited**: Entity type `PENALTY`, Risk level `HIGH` (CREATE with financial transaction)
   - **Compliance Flags**: `COMPLIANCE_RELATED`, `BLOCKCHAIN_OPERATION`, `FINANCIAL_TRANSACTION`, `DATA_CREATION`
   - **Requires Review**: `true` (high-risk financial operation)

4. **Compliance Verification:**

   - `VerifyComplianceRecord(recordId, recordType)`
   - Returns: Verification result with blockchain hash
   - **Auto-Audited**: Entity type `COMPLIANCE`, Risk level `LOW` (READ)
   - **Compliance Flags**: `COMPLIANCE_RELATED`, `BLOCKCHAIN_OPERATION`

### Data Structure on Blockchain:

```javascript
{
  "recordType": "COMPLIANCE_SCORE" | "AUDIT" | "PENALTY",
  "taxpayerId": "123456789",
  "data": { /* record-specific data */ },
  "timestamp": "2025-01-18T10:30:00Z",
  "createdBy": "officer.jane@tra.go.tz",
  "previousHash": "0x...",
  "currentHash": "0x...",
  "blockHeight": 123457
}
```

### Enterprise Audit Module Integration:

All compliance operations are **automatically logged** by the Enterprise Audit Module with comprehensive metadata. The audit middleware intercepts all HTTP requests and captures:

**Automatic Audit Logging:**

- ✅ **All POST/PUT/DELETE operations** automatically captured
- ✅ **Entity types**: `COMPLIANCE` (scores, risk assessments), `AUDIT` (scheduled audits), `PENALTY` (penalty records)
- ✅ **Blockchain transaction IDs** extracted from API responses
- ✅ **Before/after state tracking** for all modifications (complete entity state)
- ✅ **Field-level change detection** (ADDED, MODIFIED, REMOVED) with old/new values
- ✅ **Risk level calculation** (LOW, MEDIUM, HIGH) based on action type, errors, financial transactions
- ✅ **Compliance flags** automatically assigned (COMPLIANCE_RELATED, BLOCKCHAIN_OPERATION, FINANCIAL_TRANSACTION, etc.)
- ✅ **User information** extracted from JWT token (email, name, role, MSP)
- ✅ **Device and location information** captured (IP address, user agent, device fingerprint, timezone, geographic data)
- ✅ **Performance metrics** (execution time in ms, response size in bytes)
- ✅ **Request/response details** (method, path, query, headers, body up to 50KB)
- ✅ **Error information** (error messages, status codes, stack traces)

**Query Compliance Audit Logs:**

Use the Enterprise Audit Module endpoints to query compliance-related operations:

```http
# Get all compliance-related audit logs
GET /api/audit/logs?entityType=COMPLIANCE&page=1&pageSize=50
Authorization: Bearer <jwt>

# Get audit trail for a specific compliance record
GET /api/audit/trail/COMPLIANCE/COMPLIANCE-2025-001234
Authorization: Bearer <jwt>

# Get all scheduled audit operations
GET /api/audit/logs?entityType=AUDIT&action=CREATE&page=1&pageSize=50
Authorization: Bearer <jwt>

# Get all penalty operations
GET /api/audit/logs?entityType=PENALTY&page=1&pageSize=50
Authorization: Bearer <jwt>

# Get high-risk compliance operations requiring review
GET /api/audit/high-risk?entityType=COMPLIANCE&riskLevel=HIGH&requiresReview=true
Authorization: Bearer <jwt>

# Get compliance operations by specific user
GET /api/audit/user/officer.jane@tra.go.tz?entityType=COMPLIANCE&page=1&pageSize=100
Authorization: Bearer <jwt>

# Search compliance audit logs with full-text search
POST /api/audit/search
Content-Type: application/json
Authorization: Bearer <jwt>
{
  "query": "compliance score calculation",
  "filters": {
    "entityType": "COMPLIANCE",
    "action": "CREATE",
    "riskLevel": "MEDIUM"
  },
  "page": 1,
  "pageSize": 50
}

# Get compliance audit statistics
GET /api/audit/statistics?fromDate=2025-01-01&toDate=2025-12-31
Authorization: Bearer <jwt>
```

**Audit Log Response Example:**

When querying compliance audit logs, you'll receive comprehensive audit data:

```json
{
  "success": true,
  "data": [
    {
      "id": 3671,
      "audit_id": "AUDIT-1763463133205-COMPLIANCE",
      "transaction_id": "tx_compliance_123456789_20250118",
      "action": "CREATE",
      "entity_type": "COMPLIANCE",
      "entity_id": "COMPLIANCE-123456789-20250118",
      "user_id": "officer.jane@tra.go.tz",
      "user_name": "Jane Officer",
      "user_role": "officer",
      "before_state": null,
      "after_state": {
        "complianceScore": 85.5,
        "riskLevel": "LOW",
        "taxpayerId": "123456789"
      },
      "changes": [
        {
          "field": "complianceScore",
          "action": "ADDED",
          "oldValue": null,
          "newValue": 85.5
        }
      ],
      "risk_level": "MEDIUM",
      "compliance_flags": ["COMPLIANCE_RELATED", "BLOCKCHAIN_OPERATION", "DATA_CREATION"],
      "requires_review": false,
      "blockchain_verified": true,
      "blockchain_data": {
        "transaction_id": "tx_compliance_123456789_20250118",
        "channel_id": "mychannel",
        "chaincode_name": "tra-immutable-ledger",
        "contract_name": "ComplianceContract"
      },
      "timestamp": "2025-01-18T10:30:00Z",
      "execution_time": 2140,
      "ip_address": "196.44.25.18",
      "device_info": {
        "os": "macOS",
        "browser": "Chrome",
        "device": "Desktop"
      }
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "pageSize": 50,
    "totalPages": 25
  }
}
```

**For complete Enterprise Audit Module documentation**, see the main API documentation section on Enterprise Audit & Transparency Endpoints.

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-18T10:30:00Z"
}
```

**Common Error Codes:**

- `COMPLIANCE_NOT_FOUND`: Compliance record not found
- `INVALID_TAXPAYER`: Invalid taxpayer ID
- `BLOCKCHAIN_ERROR`: Blockchain operation failed
- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Authentication required
- `AUDIT_LOG_ERROR`: Audit logging failed (non-blocking, operation may still succeed)

**Note:** All compliance operations are automatically audited by the Enterprise Audit Module. Even if audit logging fails (non-blocking), the operation will still proceed. Audit errors are logged but do not affect the main operation.

---

## Implementation Priority

**High Priority (Core Functionality):**

1. Get Compliance Dashboard
2. Get Compliance Score for Taxpayer
3. Get All Taxpayers with Compliance Data
4. Schedule Audit
5. Record Penalty

**Medium Priority (Enhanced Features):** 6. Get Compliance Analytics 7. Get Risk Assessment 8. Get Audit History 9. Get Penalty History

**Low Priority (Advanced Features):**

10. Calculate Compliance Score
11. Get Compliance Reports
12. Verify Compliance Record on Blockchain

---

## Enterprise Audit Module Reference

For comprehensive audit capabilities, all compliance operations are automatically logged by the Enterprise Audit Module. Key features:

### Automatic Audit Logging

- **Zero Configuration**: All compliance endpoints automatically generate audit logs
- **Complete Metadata**: User identity, device info, location, performance metrics
- **Blockchain Integration**: Transaction IDs automatically extracted and linked
- **State Tracking**: Before/after states and field-level changes captured
- **Risk Assessment**: Automatic risk level calculation based on operation type
- **Compliance Flags**: Automatic flagging for compliance-related operations

### Query Compliance Audit Logs

Use these Enterprise Audit Module endpoints to track compliance operations:

```http
# Get all compliance operations
GET /api/audit/logs?entityType=COMPLIANCE

# Get all scheduled audits
GET /api/audit/logs?entityType=AUDIT

# Get all penalty operations
GET /api/audit/logs?entityType=PENALTY

# Get high-risk compliance operations
GET /api/audit/high-risk?entityType=COMPLIANCE

# Get compliance audit trail for entity
GET /api/audit/trail/COMPLIANCE/{entityId}

# Get compliance operations by user
GET /api/audit/user/{userId}?entityType=COMPLIANCE

# Search compliance audit logs
POST /api/audit/search
{
  "query": "compliance",
  "filters": { "entityType": "COMPLIANCE" }
}

# Get compliance audit statistics
GET /api/audit/statistics?fromDate=2025-01-01&toDate=2025-12-31
```

### Audit Data Structure

Each compliance operation generates an audit log with:

- **Core Fields**: audit_id, transaction_id, action, entity_type, entity_id
- **User Information**: user_id, user_name, user_role, user_msp
- **Blockchain Data**: transaction_id, channel_id, chaincode_name, contract_name
- **State Tracking**: before_state, after_state, changes (field-level)
- **Request/Response**: method, path, query, headers, body, status code
- **Device & Location**: IP address, user agent, device info, location, fingerprint
- **Risk & Compliance**: risk_level, compliance_flags, requires_review
- **Performance**: execution_time, response_size

For complete Enterprise Audit Module documentation, see the main API documentation.
