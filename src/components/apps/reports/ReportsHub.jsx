// src/components/apps/reports/ReportsHub.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Description,
  Download,
  PictureAsPdf,
  Assessment,
  Receipt,
  AccountBalance,
  History,
  Warning,
  VerifiedUser,
  Timeline,
  TrendingUp,
  Security,
  Business,
  DateRange,
} from '@mui/icons-material';
import reportService from 'src/services/reportService';
import {
  downloadPDF,
  openPDF,
  generateReportFilename,
  formatDateForAPI,
  validateDateRange,
  getDefaultDateRange,
  getDateRangeForPeriod,
  handleReportResponse,
  REPORT_TYPES,
  getReportTypeDisplayName,
  validateReportParams,
  isDemoData,
  getDemoNotification,
} from 'src/utils/reportUtils';
import { useAuth } from 'src/context/AuthContext';

const ReportsHub = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [demoWarning, setDemoWarning] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    tin: '',
    receiptId: '',
    assessmentId: '',
    period: '',
    fromDate: '',
    toDate: '',
    taxType: '',
    status: '',
    paymentMethod: '',
    minAmount: '',
    maxAmount: '',
    entityType: '',
    entityId: '',
    userId: '',
    action: '',
    riskLevel: '',
    requiresReview: '',
    region: '',
    groupBy: '',
  });

  const reportTypes = [
    {
      id: REPORT_TYPES.PAYMENT_RECEIPT,
      name: 'Payment Receipt',
      icon: <Receipt />,
      color: 'success',
      description: 'Generate payment receipt PDF',
      requires: ['receiptId'],
    },
    {
      id: REPORT_TYPES.TAX_ASSESSMENT_STATEMENT,
      name: 'Tax Assessment Statement',
      icon: <Assessment />,
      color: 'primary',
      description: 'Generate tax assessment statement for a taxpayer',
      requires: ['tin'],
    },
    {
      id: REPORT_TYPES.TAX_CLEARANCE_CERTIFICATE,
      name: 'Tax Clearance Certificate',
      icon: <VerifiedUser />,
      color: 'success',
      description: 'Generate tax clearance certificate',
      requires: ['tin'],
    },
    {
      id: REPORT_TYPES.PAYMENT_HISTORY,
      name: 'Payment History Report',
      icon: <History />,
      color: 'info',
      description: 'Generate payment history report',
      requires: ['tin'],
    },
    {
      id: REPORT_TYPES.OUTSTANDING_TAX,
      name: 'Outstanding Tax Report',
      icon: <Warning />,
      color: 'warning',
      description: 'Generate outstanding tax report',
      requires: ['tin'],
    },
    {
      id: REPORT_TYPES.COMPLIANCE_REPORT,
      name: 'Compliance Report',
      icon: <Security />,
      color: 'error',
      description: 'Generate compliance report (Admin/Officer/Auditor only)',
      requires: ['tin'],
      roles: ['admin', 'officer', 'auditor'],
    },
    {
      id: REPORT_TYPES.ASSESSMENT_LEDGER,
      name: 'Assessment Ledger Report',
      icon: <Timeline />,
      color: 'primary',
      description: 'Generate assessment ledger report (blockchain)',
      requires: ['assessmentId'],
    },
    {
      id: REPORT_TYPES.REVENUE_COLLECTION,
      name: 'Revenue Collection Report',
      icon: <TrendingUp />,
      color: 'success',
      description: 'Generate revenue collection report (Admin/Officer only)',
      requires: ['fromDate', 'toDate'],
      roles: ['admin', 'officer'],
    },
    {
      id: REPORT_TYPES.AUDIT_TRAIL,
      name: 'Audit Trail Report',
      icon: <Security />,
      color: 'error',
      description: 'Generate audit trail report (Admin/Auditor only)',
      requires: [],
      roles: ['admin', 'auditor'],
    },
    {
      id: REPORT_TYPES.REGISTRATION_CERTIFICATE,
      name: 'Registration Certificate',
      icon: <Business />,
      color: 'info',
      description: 'Generate taxpayer registration certificate',
      requires: ['tin'],
    },
  ];

  const handleReportSelect = (reportType) => {
    setSelectedReport(reportType);
    setError(null);
    setSuccess(null);
    setDemoWarning(null);
    // Set default date range if needed
    if (reportType.id === REPORT_TYPES.REVENUE_COLLECTION) {
      const defaultRange = getDefaultDateRange();
      setFormData((prev) => ({
        ...prev,
        fromDate: defaultRange.fromDate,
        toDate: defaultRange.toDate,
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-populate date range for period
    if (field === 'period' && value) {
      try {
        const dateRange = getDateRangeForPeriod(value);
        setFormData((prev) => ({
          ...prev,
          fromDate: dateRange.fromDate,
          toDate: dateRange.toDate,
        }));
      } catch (err) {
        console.error('Error parsing period:', err);
      }
    }
  };

  const canAccessReport = (report) => {
    if (!report.roles) return true;
    return user?.role && report.roles.includes(user.role);
  };

  const handleGenerateReport = async (format = 'pdf') => {
    if (!selectedReport) {
      setError('Please select a report type');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setDemoWarning(null);

    try {
      // Validate parameters
      const params = {
        ...formData,
        tin: formData.tin || undefined,
        receiptId: formData.receiptId || undefined,
        assessmentId: formData.assessmentId || undefined,
      };

      const validation = validateReportParams(selectedReport.id, params);
      if (!validation.valid) {
        setError(validation.errors.join(', '));
        setLoading(false);
        return;
      }

      // Validate date range if dates are provided
      if (params.fromDate && params.toDate) {
        if (!validateDateRange(params.fromDate, params.toDate)) {
          setError('Invalid date range. Start date must be before or equal to end date');
          setLoading(false);
          return;
        }
      }

      let response;
      const options = {
        format,
        ...Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== '' && v !== undefined)
        ),
      };

      // Call appropriate service method
      switch (selectedReport.id) {
        case REPORT_TYPES.PAYMENT_RECEIPT:
          response = await reportService.getPaymentReceipt(params.receiptId, options);
          break;
        case REPORT_TYPES.TAX_ASSESSMENT_STATEMENT:
          response = await reportService.getTaxAssessmentStatement(params.tin, options);
          break;
        case REPORT_TYPES.TAX_CLEARANCE_CERTIFICATE:
          response = await reportService.getTaxClearanceCertificate(params.tin, options);
          break;
        case REPORT_TYPES.PAYMENT_HISTORY:
          response = await reportService.getPaymentHistoryReport(params.tin, options);
          break;
        case REPORT_TYPES.OUTSTANDING_TAX:
          response = await reportService.getOutstandingTaxReport(params.tin, options);
          break;
        case REPORT_TYPES.COMPLIANCE_REPORT:
          response = await reportService.getComplianceReport(params.tin, options);
          break;
        case REPORT_TYPES.ASSESSMENT_LEDGER:
          response = await reportService.getAssessmentLedgerReport(params.assessmentId, options);
          break;
        case REPORT_TYPES.REVENUE_COLLECTION:
          response = await reportService.getRevenueCollectionReport(options);
          break;
        case REPORT_TYPES.AUDIT_TRAIL:
          response = await reportService.getAuditTrailReport(options);
          break;
        case REPORT_TYPES.REGISTRATION_CERTIFICATE:
          response = await reportService.getRegistrationCertificate(params.tin, options);
          break;
        default:
          throw new Error('Unknown report type');
      }

      if (format === 'pdf') {
        const filename = generateReportFilename(
          selectedReport.id,
          params.tin || params.receiptId || params.assessmentId,
          'pdf',
          params
        );
        await handleReportResponse(response, 'pdf', filename, {
          autoDownload: true,
          openInNewTab: false,
        });
        setSuccess('Report generated and downloaded successfully');
      } else {
        if (isDemoData(response)) {
          setDemoWarning(getDemoNotification(response));
        }
        setSuccess('Report data retrieved successfully');
        console.log('Report data:', response);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate report');
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    if (!selectedReport) return null;

    const fields = [];

    // Required fields based on report type
    if (selectedReport.requires.includes('receiptId')) {
      fields.push(
        <TextField
          key="receiptId"
          fullWidth
          label="Receipt ID"
          value={formData.receiptId}
          onChange={(e) => handleInputChange('receiptId', e.target.value)}
          required
          margin="normal"
        />
      );
    }

    if (selectedReport.requires.includes('tin')) {
      fields.push(
        <TextField
          key="tin"
          fullWidth
          label="Taxpayer TIN"
          value={formData.tin}
          onChange={(e) => handleInputChange('tin', e.target.value)}
          required
          margin="normal"
        />
      );
    }

    if (selectedReport.requires.includes('assessmentId')) {
      fields.push(
        <TextField
          key="assessmentId"
          fullWidth
          label="Assessment ID"
          value={formData.assessmentId}
          onChange={(e) => handleInputChange('assessmentId', e.target.value)}
          required
          margin="normal"
        />
      );
    }

    // Common optional fields
    if (selectedReport.id === REPORT_TYPES.TAX_ASSESSMENT_STATEMENT) {
      fields.push(
        <TextField
          key="period"
          fullWidth
          label="Period (e.g., 2025-Q1, 2025-01, 2025)"
          value={formData.period}
          onChange={(e) => handleInputChange('period', e.target.value)}
          margin="normal"
          helperText="Format: YYYY-QN (quarter), YYYY-MM (month), or YYYY (year)"
        />
      );
    }

    if (
      selectedReport.requires.includes('fromDate') ||
      selectedReport.id === REPORT_TYPES.PAYMENT_HISTORY ||
      selectedReport.id === REPORT_TYPES.COMPLIANCE_REPORT ||
      selectedReport.id === REPORT_TYPES.AUDIT_TRAIL
    ) {
      fields.push(
        <Grid container spacing={2} key="dateRange">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="From Date"
              value={formData.fromDate}
              onChange={(e) => handleInputChange('fromDate', e.target.value)}
              required={selectedReport.requires.includes('fromDate')}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="To Date"
              value={formData.toDate}
              onChange={(e) => handleInputChange('toDate', e.target.value)}
              required={selectedReport.requires.includes('toDate')}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
        </Grid>
      );
    }

    // Additional filters
    if (selectedReport.id === REPORT_TYPES.TAX_ASSESSMENT_STATEMENT) {
      fields.push(
        <FormControl fullWidth key="taxType" margin="normal">
          <InputLabel>Tax Type</InputLabel>
          <Select
            value={formData.taxType}
            onChange={(e) => handleInputChange('taxType', e.target.value)}
            label="Tax Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="INCOME_TAX">Income Tax</MenuItem>
            <MenuItem value="VAT">VAT</MenuItem>
            <MenuItem value="PAYE">PAYE</MenuItem>
            <MenuItem value="WITHHOLDING_TAX">Withholding Tax</MenuItem>
          </Select>
        </FormControl>
      );

      fields.push(
        <FormControl fullWidth key="status" margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="PARTIALLY_PAID">Partially Paid</MenuItem>
            <MenuItem value="OVERDUE">Overdue</MenuItem>
          </Select>
        </FormControl>
      );
    }

    if (selectedReport.id === REPORT_TYPES.REVENUE_COLLECTION) {
      fields.push(
        <FormControl fullWidth key="groupBy" margin="normal">
          <InputLabel>Group By</InputLabel>
          <Select
            value={formData.groupBy}
            onChange={(e) => handleInputChange('groupBy', e.target.value)}
            label="Group By"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="quarter">Quarter</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return fields;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Report Type Selection */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Report Type
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                {reportTypes.map((report) => {
                  const hasAccess = canAccessReport(report);
                  return (
                    <Card
                      key={report.id}
                      sx={{
                        cursor: hasAccess ? 'pointer' : 'not-allowed',
                        opacity: hasAccess ? 1 : 0.6,
                        border: selectedReport?.id === report.id ? 2 : 1,
                        borderColor:
                          selectedReport?.id === report.id
                            ? `${report.color}.main`
                            : 'divider',
                        '&:hover': hasAccess ? { boxShadow: 4 } : {},
                      }}
                      onClick={() => hasAccess && handleReportSelect(report)}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              color: `${report.color}.main`,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {report.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {report.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {report.description}
                            </Typography>
                            {!hasAccess && (
                              <Chip
                                label="Access Restricted"
                                size="small"
                                color="error"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Report Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {selectedReport ? (
                <>
                  <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    <Box sx={{ color: `${selectedReport.color}.main` }}>
                      {selectedReport.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{selectedReport.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedReport.description}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                      {success}
                    </Alert>
                  )}

                  {demoWarning && (
                    <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setDemoWarning(null)}>
                      {demoWarning}
                    </Alert>
                  )}

                  <Box component="form">
                    {renderFormFields()}

                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <PictureAsPdf />}
                        onClick={() => handleGenerateReport('pdf')}
                        disabled={loading}
                        color="primary"
                      >
                        {loading ? 'Generating...' : 'Generate PDF'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={loading ? <CircularProgress size={20} /> : <Description />}
                        onClick={() => handleGenerateReport('json')}
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'View JSON'}
                      </Button>
                    </Stack>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400,
                    textAlign: 'center',
                  }}
                >
                  <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Select a report type to get started
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Choose from the available reports on the left to generate PDF or JSON reports
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsHub;

