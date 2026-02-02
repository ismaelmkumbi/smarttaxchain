import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from '@mui/material';
import {
  Download,
  Refresh,
  Assessment,
  Payment,
  Person,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  Timeline,
  Business,
  AccountBalance,
  Receipt,
  Edit,
  Delete,
  VerifiedUser,
  Block,
  CalendarToday,
  AttachMoney,
  Security,
  History,
  Description,
  Search,
} from '@mui/icons-material';
import traApi from 'src/services/traApiService';
import api from 'src/services/api';
import { format } from 'date-fns';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const TaxpayerComplianceReport = () => {
  const theme = useTheme();
  const [tin, setTin] = useState('');
  const [selectedTaxpayer, setSelectedTaxpayer] = useState(null);
  const [taxpayerOptions, setTaxpayerOptions] = useState([]);
  const [taxpayerLoading, setTaxpayerLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load taxpayers on mount
  useEffect(() => {
    const loadTaxpayers = async () => {
      try {
        setTaxpayerLoading(true);
        const response = await api.get('/taxpayers');
        const taxpayers = response.taxpayers || [];
        const normalized = taxpayers.map((tp) => ({
          id: tp.ID,
          name: tp.Name || tp.name,
          tin: tp.TIN || tp.tin,
          type: tp.Type || tp.type,
          email: tp.Email || tp.email,
          phone: tp.Phone || tp.phone,
          display: `${tp.Name || tp.name} (${tp.TIN || tp.tin})`,
        }));
        setTaxpayerOptions(normalized);
      } catch (e) {
        console.error('Error loading taxpayers:', e);
        setSnackbar({
          open: true,
          message: 'Failed to load taxpayers. Please try again.',
          severity: 'error',
        });
        setTaxpayerOptions([]);
      } finally {
        setTaxpayerLoading(false);
      }
    };
    loadTaxpayers();
  }, []);

  // Check for TIN in URL params
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tinParam = params.get('tin');
    if (tinParam) {
      setTin(tinParam);
      // Try to find and select the taxpayer if in the list
      const foundTaxpayer = taxpayerOptions.find((tp) => tp.tin === tinParam);
      if (foundTaxpayer) {
        setSelectedTaxpayer(foundTaxpayer);
      }
      // Optionally auto-generate report
      // handleGenerateReport();
    }
  }, [taxpayerOptions]);

  const handleTaxpayerChange = (event, newValue) => {
    setSelectedTaxpayer(newValue);
    if (newValue) {
      setTin(newValue.tin);
    } else {
      setTin('');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPpp');
    } catch {
      return dateString;
    }
  };

  const getRiskColor = (riskLevel) => {
    const riskMap = {
      LOW: 'success',
      MEDIUM: 'warning',
      HIGH: 'error',
    };
    return riskMap[riskLevel?.toUpperCase()] || 'default';
  };

  const showSnackbarMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleGenerateReport = async () => {
    if (!tin || tin.trim().length < 8) {
      showSnackbarMessage('Please enter a valid TIN (8-9 digits)', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const filters = {};
      if (fromDate) filters.from = fromDate;
      if (toDate) filters.to = toDate;

      const response = await traApi.getTaxpayerComplianceReport(tin.trim(), filters);
      setReport(response.data || response);
      showSnackbarMessage('Compliance report generated successfully', 'success');
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to generate compliance report';
      setError(errorMessage);
      showSnackbarMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!tin || tin.trim().length < 8) {
      showSnackbarMessage('Please enter a valid TIN (8-9 digits)', 'error');
      return;
    }

    setPdfLoading(true);
    try {
      const filters = { format: 'pdf' };
      if (fromDate) filters.from = fromDate;
      if (toDate) filters.to = toDate;

      const blob = await traApi.getTaxpayerComplianceReport(tin.trim(), filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Compliance-Report-${tin}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSnackbarMessage('PDF report downloaded successfully', 'success');
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to download PDF report';
      showSnackbarMessage(errorMessage, 'error');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <CardContent>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Taxpayer Compliance Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate comprehensive compliance reports with detailed audit trails
              </Typography>
            </Box>
            <Security sx={{ fontSize: 48, color: theme.palette.primary.main, opacity: 0.7 }} />
          </Box>

          {/* Search Form */}
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={3}>
              <Autocomplete
                options={taxpayerOptions}
                getOptionLabel={(option) => option.display || ''}
                loading={taxpayerLoading}
                value={selectedTaxpayer}
                onChange={handleTaxpayerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Taxpayer by Name or TIN"
                    placeholder="Type to search..."
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Search sx={{ mr: 1, color: 'text.secondary' }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      endAdornment: (
                        <>
                          {taxpayerLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 40,
                        height: 40,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {option.type === 'Company' || option.type === 'Partnership' ? (
                        <Business />
                      ) : (
                        <Person />
                      )}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        TIN: {option.tin} • {option.type}
                      </Typography>
                    </Box>
                  </Box>
                )}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="date"
                label="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="date"
                label="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateReport}
                  disabled={loading || !tin}
                  startIcon={loading ? <CircularProgress size={20} /> : <Description />}
                  fullWidth
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading || !tin || !report}
                  startIcon={pdfLoading ? <CircularProgress size={20} /> : <Download />}
                >
                  PDF
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Report Display */}
      {report && (
        <Box>
          {/* Summary Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                Report Summary
              </Typography>
              <Grid container spacing={3}>
                {/* Taxpayer Info */}
                <Grid item xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <Business />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={700}>
                            {report.summary?.taxpayer?.name || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            TIN: {report.summary?.taxpayer?.tin || tin}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Status
                          </Typography>
                          <Chip
                            label={report.summary?.taxpayer?.status || 'N/A'}
                            color={
                              report.summary?.taxpayer?.status === 'ACTIVE' ? 'success' : 'default'
                            }
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Compliance Score
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" fontWeight={700}>
                                {report.summary?.taxpayer?.complianceScore?.toFixed(1) || '0.0'}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={report.summary?.taxpayer?.complianceScore || 0}
                                sx={{ flex: 1, height: 8, borderRadius: 1 }}
                                color={
                                  (report.summary?.taxpayer?.complianceScore || 0) >= 80
                                    ? 'success'
                                    : (report.summary?.taxpayer?.complianceScore || 0) >= 60
                                    ? 'warning'
                                    : 'error'
                                }
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Risk Level
                          </Typography>
                          <Chip
                            label={report.summary?.taxpayer?.riskLevel || 'N/A'}
                            color={getRiskColor(report.summary?.taxpayer?.riskLevel)}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Report ID
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                            {report.reportId || 'N/A'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Assessment Stats */}
                <Grid item xs={12} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Assessment color="primary" />
                        <Typography variant="subtitle1" fontWeight={700}>
                          Assessments
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        {report.summary?.assessments?.total || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Paid: {report.summary?.assessments?.paid || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending: {report.summary?.assessments?.pending || 0}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="caption" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatCurrency(report.summary?.assessments?.totalAmount || 0)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Activity Stats */}
                <Grid item xs={12} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Timeline color="primary" />
                        <Typography variant="subtitle1" fontWeight={700}>
                          Activity
                        </Typography>
                      </Box>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        {report.summary?.activity?.totalOperations || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        High-Risk: {report.summary?.activity?.highRiskOperations || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Modifications: {report.summary?.activity?.totalModifications || 0}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="caption" color="text.secondary">
                        Last Activity
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatDate(report.summary?.activity?.lastActivity)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Profile Changes */}
          {report.taxpayer?.profileChanges && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Person color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Profile Changes
                  </Typography>
                </Box>
                {report.taxpayer.profileChanges.hasModifications ? (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Total Changes: {report.taxpayer.profileChanges.totalChanges || 0}
                    </Alert>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Field</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Old Value</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>New Value</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Changed By</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Risk</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {report.taxpayer.profileChanges.changes
                            ?.slice(0, 10)
                            .map((change, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{change.field}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={change.action}
                                    size="small"
                                    color={change.action === 'MODIFIED' ? 'warning' : 'success'}
                                  />
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                  {String(change.oldValue || 'N/A').substring(0, 50)}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                  {String(change.newValue || 'N/A').substring(0, 50)}
                                </TableCell>
                                <TableCell>{change.changedBy || 'N/A'}</TableCell>
                                <TableCell>{formatDate(change.changedAt)}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={change.riskLevel || 'N/A'}
                                    size="small"
                                    color={getRiskColor(change.riskLevel)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ) : (
                  <Alert severity="success">
                    {report.taxpayer.profileChanges.message ||
                      'No modification of profile data available'}
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Assessment Modifications */}
          {report.assessments?.modifications &&
            report.assessments.modifications.hasModifications && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Edit color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                      Assessment Modifications
                    </Typography>
                  </Box>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Total Changes: {report.assessments.modifications.totalChanges || 0} | Total
                    Deletions: {report.assessments.modifications.totalDeletions || 0}
                  </Alert>

                  {/* Changes */}
                  {report.assessments.modifications.changes?.length > 0 && (
                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Field Changes ({report.assessments.modifications.changes.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Assessment ID</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Field</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Old Value</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>New Value</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Changed By</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {report.assessments.modifications.changes
                                .slice(0, 10)
                                .map((change, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{change.assessmentId}</TableCell>
                                    <TableCell>{change.field}</TableCell>
                                    <TableCell
                                      sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                    >
                                      {String(change.oldValue || 'N/A').substring(0, 50)}
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                    >
                                      {String(change.newValue || 'N/A').substring(0, 50)}
                                    </TableCell>
                                    <TableCell>{change.changedBy}</TableCell>
                                    <TableCell>{formatDate(change.changedAt)}</TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* Deleted Assessments */}
                  {report.assessments.modifications.deletedAssessments?.length > 0 && (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle1" fontWeight={600} color="error">
                          Deleted Assessments (
                          {report.assessments.modifications.deletedAssessments.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Assessment ID</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Tax Type</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Deleted By</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Risk</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {report.assessments.modifications.deletedAssessments
                                .slice(0, 10)
                                .map((deleted, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{deleted.assessmentId}</TableCell>
                                    <TableCell>
                                      {formatCurrency(deleted.beforeState?.Amount || 0)}
                                    </TableCell>
                                    <TableCell>{deleted.beforeState?.TaxType || 'N/A'}</TableCell>
                                    <TableCell>{deleted.deletedBy}</TableCell>
                                    <TableCell>{formatDate(deleted.deletedAt)}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={deleted.riskLevel || 'N/A'}
                                        size="small"
                                        color={getRiskColor(deleted.riskLevel)}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            )}

          {/* Payment History */}
          {report.payments?.hasPayments && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Payment color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Payment History
                  </Typography>
                </Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Total Payments: {report.payments.totalPayments || 0} | Total Amount:{' '}
                  {formatCurrency(report.payments.totalAmount || 0)}
                </Alert>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Assessment ID</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Payment Method</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Recorded By</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Risk</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {report.payments.payments?.slice(0, 15).map((payment, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{payment.assessmentId}</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <Chip label={payment.paymentMethod} size="small" />
                          </TableCell>
                          <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                          <TableCell>{payment.recordedBy}</TableCell>
                          <TableCell>
                            <Chip
                              label={payment.riskLevel || 'N/A'}
                              size="small"
                              color={getRiskColor(payment.riskLevel)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Compliance History */}
          {report.compliance?.history?.hasHistory && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Compliance Score History
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Current Score
                        </Typography>
                        <Typography variant="h4" fontWeight={700} color="primary">
                          {report.compliance.current?.score?.toFixed(1) || '0.0'}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Current Risk Level
                        </Typography>
                        <Chip
                          label={report.compliance.current?.riskLevel || 'N/A'}
                          color={getRiskColor(report.compliance.current?.riskLevel)}
                          size="large"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <List>
                  {report.compliance.history.changes?.slice(0, 10).map((change, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        {change.newScore > change.oldScore ? (
                          <TrendingUp color="success" />
                        ) : (
                          <TrendingDown color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${change.oldScore?.toFixed(1)}% → ${change.newScore?.toFixed(
                          1,
                        )}%`}
                        secondary={
                          <>
                            {change.reason} | {formatDate(change.changedAt)} | By:{' '}
                            {change.changedBy}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          {report.timeline?.events && report.timeline.events.length > 0 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <History color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Activity Timeline ({report.timeline.totalEvents || 0} events)
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Entity</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Performed By</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Risk</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {report.timeline.events.slice(0, 20).map((event, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{formatDate(event.timestamp)}</TableCell>
                          <TableCell>
                            <Chip label={event.action} size="small" />
                          </TableCell>
                          <TableCell>
                            {event.entityType} ({event.entityId?.substring(0, 20)}...)
                          </TableCell>
                          <TableCell>{event.description}</TableCell>
                          <TableCell>{event.performedBy}</TableCell>
                          <TableCell>
                            <Chip
                              label={event.riskLevel || 'N/A'}
                              size="small"
                              color={getRiskColor(event.riskLevel)}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={event.status}
                              size="small"
                              color={event.status === 'SUCCESS' ? 'success' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default TaxpayerComplianceReport;
