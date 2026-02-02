# Tax Assessment Service Update

## Summary

Updated the tax assessment service to utilize the enhanced API endpoints with filtering, pagination, and comprehensive features as documented in the Tax Assessment API documentation.

## Changes Made

### 1. Updated `src/services/taxAssessmentService.js`

**Enhanced Methods:**

- ✅ **`getAllAssessments(filters)`** - Now supports advanced filtering:
  - `tin` - Filter by Taxpayer TIN
  - `taxpayerId` - Filter by Taxpayer ID
  - `status` - Filter by status (OPEN, PAID, DISPUTED, PENDING, OVERDUE, CANCELLED)
  - `taxType` - Filter by tax type (VAT, Income Tax, PAYE, CIT, etc.)
  - `from` / `to` - Date range filtering
  - `page` / `pageSize` - Pagination support

- ✅ **`getAllAssessmentsByTin(tin)`** - Uses new endpoint `/api/tax-assessments/tin/:tin`

- ✅ **`getAssessmentById(id)`** - New method to get assessment by ID

- ✅ **`createAssessment(data)`** - Enhanced with proper field mapping (camelCase → backend format)

- ✅ **`updateAssessment(id, updates)`** - Enhanced with proper field mapping

- ✅ **`deleteAssessment(id)`** - New method for deleting assessments

- ✅ **`getAssessmentHistory(id)`** - New method to get transaction history

### 2. Added to `src/services/traApiService.js`

**New Tax Assessment Methods:**

- ✅ `getTaxAssessments(filters)` - Get assessments with filtering and pagination
- ✅ `getTaxAssessmentsByTin(tin)` - Get assessments by TIN
- ✅ `getTaxAssessmentById(id)` - Get assessment by ID
- ✅ `createTaxAssessment(data)` - Create new assessment
- ✅ `updateTaxAssessment(id, updates)` - Update assessment
- ✅ `deleteTaxAssessment(id)` - Delete assessment
- ✅ `getTaxAssessmentHistory(id)` - Get assessment history

## Field Mappings

The service now properly maps between frontend (camelCase) and backend (PascalCase) formats:

| Frontend Field | Backend Field | Notes |
|----------------|---------------|-------|
| `assessmentId` | `id` | Assessment identifier |
| `taxpayerTIN` | `tin` | Taxpayer TIN |
| `taxpayerId` | `taxpayerId` | Taxpayer ID |
| `type` | `taxType` | Tax type |
| `assessedAmount` | `amount` | Base assessed amount |
| `penalties` | `penalties` | Penalty amount |
| `interest` | `interest` | Interest amount |
| `totalDue` | `TotalDue` | Calculated: Amount + Penalties + Interest |
| `status` | `status` | Status (PENDING, OPEN, PAID, etc.) |
| `dueDate` | `dueDate` | Due date (ISO format) |

## API Endpoints Used

All methods now use the new `/api/tax-assessments` endpoints:

- `GET /api/tax-assessments` - Get all with filters
- `GET /api/tax-assessments/tin/:tin` - Get by TIN
- `GET /api/tax-assessments/:id` - Get by ID
- `POST /api/tax-assessments` - Create new
- `PUT /api/tax-assessments/:id` - Update
- `DELETE /api/tax-assessments/:id` - Delete
- `GET /api/tax-assessments/:id/history` - Get history

## Usage Examples

### Get All Assessments with Filters

```javascript
import taxAssessmentService from 'src/services/taxAssessmentService';

// Get open VAT assessments for a TIN
const result = await taxAssessmentService.getAllAssessments({
  tin: '123456789',
  status: 'OPEN',
  taxType: 'VAT',
  page: 1,
  pageSize: 20,
});

console.log(result.assessments);
console.log(result.pagination);
```

### Get Assessments by TIN

```javascript
const assessments = await taxAssessmentService.getAllAssessmentsByTin('123456789');
```

### Create Assessment

```javascript
const newAssessment = await taxAssessmentService.createAssessment({
  id: 'TAXASMT-2025-000123',
  tin: '123456789',
  taxpayerId: 'TP-2025-000123',
  taxType: 'VAT',
  year: 2025,
  amount: 1500000,
  currency: 'TZS',
  status: 'PENDING',
  createdBy: 'admin',
  description: 'Quarterly VAT Assessment',
  dueDate: '2025-05-01T00:00:00Z',
  penalties: 0,
  interest: 0,
  period: '2025-Q1',
});
```

### Update Assessment

```javascript
const updated = await taxAssessmentService.updateAssessment('TAXASMT-2025-000123', {
  status: 'PAID',
  penalties: 50000,
  interest: 25000,
});
```

### Get Assessment History

```javascript
const history = await taxAssessmentService.getAssessmentHistory('TAXASMT-2025-000123');
```

## Backward Compatibility

- ✅ Legacy methods still work (`getAllAssessments`, `getAllAssessmentsByTin`)
- ✅ Fallback data is still used on errors
- ✅ Response structure is normalized to handle different API response formats

## Next Steps

1. Update components using the old assessment service to use new filtering features
2. Add pagination UI components where assessments are displayed
3. Update assessment forms to use the new field mappings
4. Test all CRUD operations with the new endpoints

