import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
  alpha,
  Stack,
  Tooltip,
  Autocomplete,
  InputAdornment,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack,
  Print,
  Edit,
  Delete,
  Download,
  Share,
  History,
  Payment,
  Receipt,
  Business,
  Person,
  AccountBalance,
  CalendarToday,
  MonetizationOn,
  Warning,
  CheckCircle,
  Cancel,
  TrendingUp,
  Close,
} from '@mui/icons-material';
import { Fade, Grow } from '@mui/material';
import api from 'src/services/api';
import taxAssessmentService from 'src/services/taxAssessmentService';
import taxTypeService from 'src/services/taxTypeService';
import TaxLifecycleFlow from '../TaxLifecycleFlow';
import InterestPenaltyDisplay from '../InterestPenaltyDisplay';
import ImmutableLedgerTimeline from '../ImmutableLedgerTimeline';
import InterestCalculator from '../InterestCalculator';
import PenaltyApplicator from '../PenaltyApplicator';
import { PaymentConfirmationModal } from '../../payment/modal/PaymentConfirmationModal';
import paymentService from 'src/services/paymentService';
import { useAuth } from 'src/context/AuthContext';

const AssessmentDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [taxpayer, setTaxpayer] = useState(null);
  const [error, setError] = useState(null);
  const [printing, setPrinting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    tin: '',
    taxType: 'VAT',
    year: new Date().getFullYear(),
    quarter: 1,
    amount: '',
    currency: 'TZS',
    status: 'PENDING',
    createdBy: 'admin',
    description: '',
    dueDate: '',
    penalties: 0,
    interest: 0,
  });
  const [editErrors, setEditErrors] = useState({});
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [interestCalculatorOpen, setInterestCalculatorOpen] = useState(false);
  const [penaltyApplicatorOpen, setPenaltyApplicatorOpen] = useState(false);
  const [taxTypes, setTaxTypes] = useState([]);
  const [taxTypesLoading, setTaxTypesLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false });
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [auditDialog, setAuditDialog] = useState({ open: false, audit: null });
  const [taxpayerOptions, setTaxpayerOptions] = useState([]);
  const [taxpayerLoading, setTaxpayerLoading] = useState(false);
  const [selectedEditTaxpayer, setSelectedEditTaxpayer] = useState(null);

  useEffect(() => {
    loadAssessment();
    loadTaxTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTaxTypes = async () => {
    try {
      setTaxTypesLoading(true);
      const data = await taxTypeService.getAll({ active: true });
      setTaxTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading tax types:', error);
      setTaxTypes([]);
    } finally {
      setTaxTypesLoading(false);
    }
  };

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      let assessmentData;

      // Try to fetch complete assessment with ledger first
      try {
        response = await taxAssessmentService.getCompleteAssessment(id);
        assessmentData = response.assessment || response.taxAssessment || response;
      } catch (completeError) {
        console.warn('Complete assessment endpoint failed, falling back to basic endpoint:', completeError);
        // Fallback: use basic getAssessmentById
        try {
          response = await taxAssessmentService.getAssessmentById(id);
          assessmentData = response.taxAssessment || response.assessment || response;
        } catch (basicError) {
          console.error('Both endpoints failed:', basicError);
          throw basicError;
        }
      }

      setAssessment(assessmentData);

      // Load ledger entries if available
      if (response?.ledger?.events) {
        setLedgerEntries(response.ledger.events);
      } else {
        // Fallback: try to get ledger separately
        try {
          const ledgerResponse = await taxAssessmentService.getAssessmentLedger(id);
          setLedgerEntries(ledgerResponse.events || []);
        } catch (ledgerError) {
          console.warn('Could not load ledger:', ledgerError);
          setLedgerEntries([]);
        }
      }

      // Fetch taxpayer if TIN available
      if (assessmentData.Tin || assessmentData.tin) {
        const tin = assessmentData.Tin || assessmentData.tin;
        try {
        const taxpayerResponse = await api.get('/taxpayers');
        const foundTaxpayer = taxpayerResponse.taxpayers?.find((tp) => tp.TIN === tin);
        if (foundTaxpayer) {
          setTaxpayer(foundTaxpayer);
          }
        } catch (taxpayerError) {
          console.warn('Could not load taxpayer:', taxpayerError);
        }
      }
    } catch (err) {
      console.error('Error loading assessment:', err);
      const errorMessage = err?.response?.data?.error?.message || 
                          err?.response?.data?.message || 
                          err?.message || 
                          'Failed to load assessment';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    setPrinting(true);
    window.print();
    setTimeout(() => setPrinting(false), 1000);
  };

  const handleEdit = () => {
    if (!assessment) return;
    
    // Extract period (e.g., "2025-Q1") to get year and quarter
    const period = assessment.Period || assessment.period || '';
    const periodMatch = period.match(/(\d{4})-Q(\d)/);
    const year = periodMatch ? parseInt(periodMatch[1]) : assessment.Year || assessment.year || new Date().getFullYear();
    const quarter = periodMatch ? parseInt(periodMatch[2]) : 1;
    
    // Format due date for date input
    const dueDate = assessment.DueDate || assessment.dueDate || '';
    let formattedDueDate = '';
    if (dueDate) {
      try {
        const date = new Date(dueDate);
        if (!isNaN(date.getTime())) {
          formattedDueDate = date.toISOString().split('T')[0];
        }
      } catch (e) {
        console.error('Error formatting due date:', e);
      }
    }
    
    const tin = assessment.Tin || assessment.tin || '';
    // Find matching taxpayer
    const matchingTaxpayer = taxpayerOptions.find((tp) => (tp.tin || tp.TIN) === tin);
    
    setEditForm({
      tin,
      taxType: assessment.TaxType || assessment.taxType || '',
      year,
      quarter,
      amount: String(assessment.Amount || assessment.amount || assessment.AssessedAmount || assessment.assessedAmount || 0),
      currency: assessment.Currency || assessment.currency || 'TZS',
      status: assessment.Status || assessment.status || 'PENDING',
      description: assessment.Description || assessment.description || '',
      dueDate: formattedDueDate,
      penalties: assessment.Penalties || assessment.penalties || 0,
      interest: assessment.Interest || assessment.interest || 0,
    });
    
    setSelectedEditTaxpayer(matchingTaxpayer || null);
    setEditErrors({});
    setEditOpen(true);
    
    // Load taxpayers if not already loaded
    if (taxpayerOptions.length === 0) {
      loadTaxpayers();
    }
  };

  const loadTaxpayers = async (searchTerm = '') => {
    try {
      setTaxpayerLoading(true);
      const response = await api.get('/api/taxpayers');
      const taxpayers = response.taxpayers || response.data?.taxpayers || [];
      const options = taxpayers.map((tp) => ({
        ...tp,
        display: `${tp.Name || tp.name || ''} (${tp.TIN || tp.tin || ''})`,
        tin: tp.TIN || tp.tin,
        name: tp.Name || tp.name,
      }));
      setTaxpayerOptions(options);
    } catch (error) {
      console.error('Error loading taxpayers:', error);
      setTaxpayerOptions([]);
    } finally {
      setTaxpayerLoading(false);
    }
  };

  const handleEditTaxpayerChange = (event, newValue) => {
    setSelectedEditTaxpayer(newValue);
    if (newValue) {
      setEditForm((prev) => ({
        ...prev,
        tin: newValue.tin || newValue.TIN || prev.tin,
      }));
    }
  };

  const handleTaxpayerInputChange = (event, value) => {
    if (value && value.length > 2) {
      loadTaxpayers(value);
    }
  };

  const closeEditDialog = () => {
    if (editing) return;
    setEditOpen(false);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateEdit = () => {
    const errs = {};
    if (!editForm.tin) errs.tin = 'TIN is required';
    if (!editForm.taxType) errs.taxType = 'Tax type is required';
    if (!editForm.year) errs.year = 'Year is required';
    if (!editForm.quarter || ![1, 2, 3, 4].includes(Number(editForm.quarter)))
      errs.quarter = 'Quarter must be 1-4';
    if (!editForm.amount || Number(editForm.amount) <= 0) errs.amount = 'Amount must be > 0';
    if (!editForm.status) errs.status = 'Status is required';
    if (!editForm.dueDate) errs.dueDate = 'Due date is required';
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitEdit = async () => {
    if (!validateEdit() || !assessment) return;
    setEditing(true);
    try {
      const assessmentId = assessment.ID || assessment.id || id;

      // Backend requires all required fields, not just changed ones
      // Include all required fields from the form
      const updates = {
        tin: editForm.tin,
        taxpayerId: editForm.tin, // TIN and taxpayerId are the same
        taxType: editForm.taxType,
        year: Number(editForm.year),
        amount: Number(editForm.amount),
        currency: editForm.currency || 'TZS',
        status: editForm.status,
        description: editForm.description,
        dueDate: editForm.dueDate,
        penalties: Number(editForm.penalties) || 0,
        interest: Number(editForm.interest) || 0,
        period: `${editForm.year}-Q${editForm.quarter}`,
        // createdBy should be extracted from token by backend, but include it from original assessment if available
        createdBy: assessment.CreatedBy || assessment.createdBy || 'admin',
      };

      const response = await taxAssessmentService.updateAssessment(assessmentId, updates);

      // Show audit dialog if audit information is available
      if (response.audit) {
        setAuditDialog({ open: true, audit: response.audit });
        // Show success notification
        setSnackbar({ 
          open: true, 
          message: `Assessment ${assessmentId} updated successfully!`, 
          severity: 'success' 
        });
      } else {
      setEditOpen(false);
        setSnackbar({ 
          open: true, 
          message: `Assessment ${assessmentId} updated successfully!`, 
          severity: 'success' 
        });
        await loadAssessment();
      }
    } catch (e) {
      let errorMessage = 'Failed to update assessment';
      
      // Check if assessment doesn't exist
      if (e?.response?.data?.error?.includes('does not exist') || 
          e?.response?.data?.message?.includes('does not exist') ||
          e?.response?.status === 404) {
        errorMessage = `Assessment ${assessmentId} does not exist. It may have been deleted.`;
        // Navigate back to list since assessment doesn't exist
        setTimeout(() => {
          navigate('/apps/assessment/list');
        }, 2000);
      } else {
        errorMessage =
          e?.response?.data?.error?.message ||
          e?.response?.data?.error ||
          e?.response?.data?.message ||
          e?.message ||
          'Failed to update assessment';
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialog({ open: true });
  };

  const handleConfirmDelete = async () => {
    if (!id) {
      setSnackbar({ open: true, message: 'Assessment ID not found', severity: 'error' });
      setDeleteDialog({ open: false });
      return;
    }

    setDeleting(true);
      try {
        await taxAssessmentService.deleteAssessment(id);
      setSnackbar({
        open: true,
        message: `Assessment ${id} deleted successfully!`,
        severity: 'success',
      });
      setDeleteDialog({ open: false });
      // Navigate back to list after a short delay
      setTimeout(() => {
        navigate('/apps/assessment/list');
      }, 1500);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      let errorMessage = 'Failed to delete assessment';
      
      // Check if assessment doesn't exist
      if (error?.response?.data?.error?.includes('does not exist') || 
          error?.response?.data?.message?.includes('does not exist') ||
          error?.response?.status === 404) {
        errorMessage = `Assessment ${id} does not exist. It may have already been deleted.`;
        // Navigate back to list since assessment doesn't exist
        setTimeout(() => {
          navigate('/apps/assessment/list');
        }, 2000);
      } else {
        errorMessage =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          'Failed to delete assessment';
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const handleViewTaxpayer = () => {
    const tin = assessment?.Tin || assessment?.tin;
    if (tin) {
      navigate(`/tax/taxpayer/${tin}/assessments`);
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
      return new Date(dateString).toLocaleDateString('en-TZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      PENDING: { bg: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main },
      OPEN: { bg: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main },
      PAID: { bg: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main },
      DISPUTED: { bg: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main },
      OVERDUE: { bg: alpha(theme.palette.error.dark, 0.1), color: theme.palette.error.dark },
      CANCELLED: { bg: alpha(theme.palette.grey[500], 0.1), color: theme.palette.grey[600] },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !assessment) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error || 'Assessment not found'}
        </Typography>
        <Button 
          variant="outlined"
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/apps/assessment/list')} 
          sx={{ 
            mt: 2,
            borderColor: theme.palette.secondary.main, // TRA Black border
            color: theme.palette.secondary.main, // TRA Black text
            fontWeight: 600,
            '&:hover': {
              borderColor: theme.palette.secondary.dark,
              bgcolor: alpha(theme.palette.secondary.main, 0.05), // Light grey
              color: theme.palette.secondary.main,
            },
          }}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  const status = assessment.Status || assessment.status || 'PENDING';
  const statusColors = getStatusColor(status);
  const amount = assessment.Amount || assessment.amount || 0;
  const penalties = assessment.Penalties || assessment.penalties || 0;
  const interest = assessment.Interest || assessment.interest || 0;
  const totalDue = assessment.TotalDue || assessment.totalDue || amount + penalties + interest;

  return (
    <Box sx={{ p: 3 }} className="assessment-detail-print">
      {/* Header */}
      <Fade in={true} timeout={600}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/apps/assessment/list')}
              sx={{ 
                mb: 2,
                borderColor: theme.palette.secondary.main, // TRA Black border
                color: theme.palette.secondary.main, // TRA Black text
                fontWeight: 600,
                '&:hover': {
                  borderColor: theme.palette.secondary.dark,
                  bgcolor: alpha(theme.palette.secondary.main, 0.05), // Light grey
                  color: theme.palette.secondary.main,
                },
              }}
            >
              Back to List
            </Button>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Assessment Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {assessment.ID || assessment.id}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Tooltip title="View Taxpayer Assessments">
              <Button
                variant="outlined"
                startIcon={<Business />}
                onClick={handleViewTaxpayer}
                disabled={!taxpayer}
                sx={{
                  borderColor: theme.palette.primary.main, // TRA Yellow
                  color: theme.palette.secondary.main, // TRA Black
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    bgcolor: alpha(theme.palette.primary.main, 0.15), // Light yellow
                    color: theme.palette.secondary.main,
                  },
                  '&:disabled': {
                    borderColor: theme.palette.grey[300],
                    color: theme.palette.text.disabled,
                  },
                }}
              >
                View Taxpayer
              </Button>
            </Tooltip>
            <Tooltip title="View account (payments & balance)">
              <Button
                variant="outlined"
                startIcon={<AccountBalance />}
                onClick={() => navigate(`/apps/assessment/${id}/account`)}
                sx={{
                  borderColor: theme.palette.success.main,
                  color: theme.palette.success.dark,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: theme.palette.success.dark,
                    bgcolor: alpha(theme.palette.success.main, 0.15),
                    color: theme.palette.success.dark,
                  },
                }}
              >
                View Account
              </Button>
            </Tooltip>
            <Tooltip title="Print">
              <Button 
                variant="outlined" 
                startIcon={<Print />} 
                onClick={handlePrint} 
                disabled={printing}
                sx={{
                  borderColor: theme.palette.primary.main, // TRA Yellow
                  color: theme.palette.secondary.main, // TRA Black
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    bgcolor: alpha(theme.palette.primary.main, 0.15), // Light yellow
                    color: theme.palette.secondary.main,
                  },
                  '&:disabled': {
                    borderColor: theme.palette.grey[300],
                    color: theme.palette.text.disabled,
                  },
                }}
              >
                {printing ? 'Printing...' : 'Print'}
              </Button>
            </Tooltip>
            <Tooltip title="Edit">
              <Button 
                variant="outlined" 
                startIcon={<Edit />} 
                onClick={handleEdit}
                sx={{
                  borderColor: theme.palette.primary.main, // TRA Yellow
                  color: theme.palette.secondary.main, // TRA Black
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    bgcolor: alpha(theme.palette.primary.main, 0.15), // Light yellow
                    color: theme.palette.secondary.main,
                  },
                }}
              >
                Edit
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDeleteClick}>
                Delete
              </Button>
            </Tooltip>
          </Stack>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Main Assessment Card */}
        <Grid item xs={12} md={8}>
          <Grow in={true} timeout={800}>
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'white', border: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
              <CardContent sx={{ p: 4 }}>
                {/* Status Badge */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={status}
                    sx={{
                      bgcolor: statusColors.bg,
                      color: statusColors.color,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      px: 2,
                      py: 1,
                      border: `1px solid ${alpha(statusColors.color, 0.3)}`,
                    }}
                  />
                  <Typography variant="h5" fontWeight={700} color={theme.palette.secondary.main}>
                    {formatCurrency(totalDue)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Assessment Information */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Assessment ID
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {assessment.ID || assessment.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tax Type
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {assessment.TaxType || assessment.taxType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Period
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {assessment.Period || assessment.period || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Year
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {assessment.Year || assessment.year}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {assessment.Description || assessment.description || 'No description'}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Financial Breakdown */}
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                  Financial Breakdown
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`, borderTop: `3px solid ${theme.palette.primary.main}` }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Assessed Amount
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color={theme.palette.secondary.main}>
                        {formatCurrency(amount)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.08), border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`, borderTop: `3px solid ${theme.palette.warning.main}` }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Penalties
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color={theme.palette.warning.dark}>
                        {formatCurrency(penalties)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.error.main, 0.08), border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`, borderTop: `3px solid ${theme.palette.error.main}` }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Interest
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color={theme.palette.error.dark}>
                        {formatCurrency(interest)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>

          {/* Dates & Timeline */}
          <Grow in={true} timeout={1000}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, bgcolor: 'white', border: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }} color="text.primary">
                  Important Dates
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CalendarToday sx={{ color: theme.palette.primary.main }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          Due Date
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="text.primary">
                          {formatDate(assessment.DueDate || assessment.dueDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CalendarToday sx={{ color: theme.palette.primary.main }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          Created At
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="text.primary">
                          {formatDate(assessment.CreatedAt || assessment.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CalendarToday sx={{ color: theme.palette.primary.main }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          Last Updated
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="text.primary">
                          {formatDate(assessment.UpdatedAt || assessment.updatedAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Person sx={{ color: theme.palette.primary.main }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          Created By
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="text.primary">
                          {assessment.CreatedBy || assessment.createdBy || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Sidebar - Taxpayer Info & Actions */}
        <Grid item xs={12} md={4}>
          <Grow in={true} timeout={1200}>
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'white', border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`, borderTop: `4px solid ${theme.palette.primary.main}` }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">
                  Taxpayer Information
                </Typography>
                {taxpayer ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Name
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        {taxpayer.Name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        TIN
                      </Typography>
                      <Chip 
                        label={taxpayer.TIN} 
                        size="small" 
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.15),
                          color: theme.palette.secondary.main,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Type
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="text.primary">{taxpayer.Type}</Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Business />}
                      onClick={handleViewTaxpayer}
                      sx={{ 
                        mt: 2,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.secondary.main,
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          bgcolor: alpha(theme.palette.primary.main, 0.15),
                          color: theme.palette.secondary.main,
                        },
                      }}
                    >
                      View All Assessments
                    </Button>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Taxpayer information not available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grow>

          {/* Quick Actions */}
          <Grow in={true} timeout={1400}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, bgcolor: 'white', border: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Payment />}
                    color="success"
                    disabled={status === 'PAID'}
                    onClick={() => setPaymentModalOpen(true)}
                  >
                    Process Payment
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<TrendingUp />}
                    onClick={() => setInterestCalculatorOpen(true)}
                    sx={{
                      borderColor: theme.palette.warning.main,
                      color: theme.palette.warning.dark,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: theme.palette.warning.dark,
                        bgcolor: alpha(theme.palette.warning.main, 0.15),
                        color: theme.palette.warning.dark,
                      },
                    }}
                  >
                    Calculate Interest
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<Warning />}
                    onClick={() => setPenaltyApplicatorOpen(true)}
                    sx={{
                      borderColor: theme.palette.error.main,
                      color: theme.palette.error.dark,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: theme.palette.error.dark,
                        bgcolor: alpha(theme.palette.error.main, 0.15),
                        color: theme.palette.error.dark,
                      },
                    }}
                  >
                    Apply Penalty
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<History />}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        color: theme.palette.secondary.main,
                      },
                    }}
                  >
                    View History
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<Download />}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        color: theme.palette.secondary.main,
                      },
                    }}
                  >
                    Download PDF
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<Share />}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        color: theme.palette.secondary.main,
                      },
                    }}
                  >
                    Share
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>

      {/* Tax Lifecycle Flow */}
      <Box sx={{ mt: 4 }}>
        <TaxLifecycleFlow
          assessment={assessment}
          currentStep={(() => {
            const status = (assessment.Status || assessment.status || '').toUpperCase();
            if (status === 'PAID') return 4;
            if (assessment.Penalties > 0) return 3;
            if (assessment.Interest > 0) return 2;
            if (status === 'OPEN' || status === 'PENDING') return 1;
            return 0;
          })()}
        />
      </Box>

      {/* Interest & Penalties Display */}
      <Box sx={{ mt: 4 }}>
        <InterestPenaltyDisplay assessment={assessment} showBreakdown={true} />
      </Box>

      {/* Immutable Ledger Timeline */}
      <Box sx={{ mt: 4 }}>
        <ImmutableLedgerTimeline
          ledgerEntries={ledgerEntries.length > 0
            ? ledgerEntries.map((event, index) => {
                // Normalize event type to ensure it's a valid string
                const eventType = (event.event_type || event.type || 'UNKNOWN').toUpperCase();
                
                return {
                  id: event.tx_id || event.id || `event-${index}`,
                  type: eventType,
                  timestamp: event.timestamp || new Date().toISOString(),
                  description: event.reason || event.description || 'Ledger event',
                  amount: event.amount || 0,
                  status: 'CONFIRMED',
                  blockNumber: event.block_number || Math.floor(Math.random() * 100000) + 10000,
                  txHash: event.current_hash || event.tx_id || `0x${Math.random().toString(16).substr(2, 40)}`,
                  changes: {
                    ...(event.interest_type && { interestType: event.interest_type }),
                    ...(event.days_overdue && { daysOverdue: event.days_overdue }),
                    ...(event.penalty_type && { penaltyType: event.penalty_type }),
                  },
                };
              })
            : []}
        />
      </Box>

      {/* Interest Calculator Dialog */}
      <InterestCalculator
        open={interestCalculatorOpen}
        onClose={() => setInterestCalculatorOpen(false)}
        assessment={assessment}
        onSuccess={(result) => {
          console.log('Interest calculated:', result);
          // Reload assessment to show updated interest
          loadAssessment();
        }}
      />

      {/* Penalty Applicator Dialog */}
      <PenaltyApplicator
        open={penaltyApplicatorOpen}
        onClose={() => setPenaltyApplicatorOpen(false)}
        assessment={assessment}
        onSuccess={(result) => {
          console.log('Penalty applied:', result);
          // Reload assessment to show updated penalties
          loadAssessment();
        }}
      />

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          .assessment-detail-print button,
          .assessment-detail-print .MuiStack-root {
            display: none !important;
          }
          .assessment-detail-print {
            padding: 0 !important;
          }
        }
        `
      }} />

      {/* Edit Assessment Dialog - Simplified */}
      <Dialog open={editOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            bgcolor: '#002855',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'white', fontWeight: 600, fontSize: '1.25rem' }}>Edit Assessment</span>
          <IconButton
            onClick={closeEditDialog}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Taxpayer Selection */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Taxpayer Information
              </Typography>
              <Autocomplete
                loading={taxpayerLoading}
                options={taxpayerOptions}
                getOptionLabel={(option) => option.display || ''}
                value={selectedEditTaxpayer}
                onChange={handleEditTaxpayerChange}
                onInputChange={handleTaxpayerInputChange}
                renderInput={(params) => (
              <TextField
                    {...params}
                    label="Search Taxpayer"
                    placeholder="Type to search..."
                    error={!!editErrors.tin}
                    helperText={editErrors.tin}
                  />
                )}
              />
              {!selectedEditTaxpayer && (
                <TextField
                fullWidth
                  label="TIN"
                value={editForm.tin}
                onChange={(e) => handleEditFormChange('tin', e.target.value)}
                error={!!editErrors.tin}
                  helperText={editErrors.tin || 'Enter TIN if taxpayer is not in the system'}
                  sx={{ mt: 2 }}
              />
              )}
            </Box>

            <Divider />

            {/* Assessment Details */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Assessment Details
              </Typography>
              <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Tax Type"
                fullWidth
                value={editForm.taxType}
                onChange={(e) => handleEditFormChange('taxType', e.target.value)}
                error={!!editErrors.taxType}
                    helperText={editErrors.taxType || (taxTypesLoading ? 'Loading tax types...' : '')}
                    disabled={taxTypesLoading}
                    SelectProps={{
                      renderValue: (value) => {
                        const selected = taxTypes.find((tt) => (tt.Code || tt.Name) === value);
                        return selected ? selected.Name || selected.Code : value || '';
                      },
                    }}
                  >
                    {taxTypesLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading tax types...
                      </MenuItem>
                    ) : taxTypes.length === 0 ? (
                      <MenuItem disabled>No tax types available</MenuItem>
                    ) : (
                      taxTypes.map((taxType) => (
                        <MenuItem key={taxType.Code || taxType.Name} value={taxType.Code || taxType.Name}>
                          <Box>
                            <Typography variant="body1">{taxType.Name || taxType.Code}</Typography>
                            {taxType.Rate !== undefined && taxType.Rate !== null && (
                              <Typography variant="caption" color="text.secondary">
                                Rate: {Number(taxType.Rate).toFixed(1)}%
                              </Typography>
                            )}
                          </Box>
                        </MenuItem>
                      ))
                    )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Year"
                fullWidth
                value={editForm.year}
                onChange={(e) => handleEditFormChange('year', e.target.value)}
                error={!!editErrors.year}
                helperText={editErrors.year}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Quarter"
                fullWidth
                value={editForm.quarter}
                onChange={(e) => handleEditFormChange('quarter', Number(e.target.value))}
                error={!!editErrors.quarter}
                    helperText={editErrors.quarter || `Period: ${editForm.year}-Q${editForm.quarter}`}
              >
                    <MenuItem value={1}>Q1 (Jan-Mar)</MenuItem>
                    <MenuItem value={2}>Q2 (Apr-Jun)</MenuItem>
                    <MenuItem value={3}>Q3 (Jul-Sep)</MenuItem>
                    <MenuItem value={4}>Q4 (Oct-Dec)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Amount"
                fullWidth
                value={editForm.amount}
                onChange={(e) => handleEditFormChange('amount', e.target.value)}
                error={!!editErrors.amount}
                helperText={editErrors.amount}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">TZS</InputAdornment>,
                    }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                    type="date"
                    label="Due Date"
                fullWidth
                    value={editForm.dueDate ? editForm.dueDate.split('T')[0] : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      const timeValue = editForm.dueDate ? editForm.dueDate.split('T')[1] : '00:00';
                      handleEditFormChange('dueDate', dateValue ? `${dateValue}T${timeValue}` : '');
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={!!editErrors.dueDate}
                    helperText={editErrors.dueDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                fullWidth
                value={editForm.status}
                onChange={(e) => handleEditFormChange('status', e.target.value)}
                error={!!editErrors.status}
                helperText={editErrors.status}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="PAID">Paid</MenuItem>
                <MenuItem value="DISPUTED">Disputed</MenuItem>
                <MenuItem value="OVERDUE">Overdue</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                    rows={2}
                value={editForm.description}
                onChange={(e) => handleEditFormChange('description', e.target.value)}
                error={!!editErrors.description}
                helperText={editErrors.description}
              />
            </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Interest & Penalties */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Interest & Penalties
              </Typography>
              <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Interest"
                fullWidth
                value={editForm.interest}
                onChange={(e) => handleEditFormChange('interest', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => handleEditFormChange('interest', 0)}
                            disabled={!editForm.interest || Number(editForm.interest) === 0}
                            title="Clear interest"
                            sx={{ color: 'error.main' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Set to 0 to remove interest"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                    type="number"
                    label="Penalties"
                fullWidth
                    value={editForm.penalties}
                    onChange={(e) => handleEditFormChange('penalties', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => handleEditFormChange('penalties', 0)}
                            disabled={!editForm.penalties || Number(editForm.penalties) === 0}
                            title="Clear penalties"
                            sx={{ color: 'error.main' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Set to 0 to remove penalties"
              />
            </Grid>
          </Grid>
            </Box>

            {/* Blockchain Immutability Notice */}
            <Alert
              severity="info"
              icon={<Warning />}
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.1),
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
              }}
            >
              <Typography variant="body2" fontWeight={600} gutterBottom>
                🔗 Blockchain Immutability
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                All changes are permanently recorded on the blockchain. Even if you remove interest or penalties,
                the complete history remains accessible.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeEditDialog} disabled={editing}>
            Cancel
          </Button>
          <Button
            onClick={submitEdit}
            variant="contained"
            disabled={editing}
            startIcon={editing ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001B3D' } }}
          >
            {editing ? 'Updating...' : 'Update Assessment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: theme.palette.error.main,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'white', fontWeight: 600, fontSize: '1.25rem' }}>Delete Assessment</span>
          <IconButton
            onClick={() => setDeleteDialog({ open: false })}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete assessment <strong>{id}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action cannot be undone. The assessment and all associated data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialog({ open: false })} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <Delete />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Audit Information Dialog */}
      <Dialog
        open={auditDialog.open}
        onClose={() => {
          setAuditDialog({ open: false, audit: null });
          setEditOpen(false);
          loadAssessment();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: '#002855',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'white', fontWeight: 600, fontSize: '1.25rem' }}>Assessment Update Audit Trail</span>
          <IconButton
            onClick={() => {
              setAuditDialog({ open: false, audit: null });
              setEditOpen(false);
              loadAssessment();
            }}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {auditDialog.audit && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Updated By
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {auditDialog.audit.updatedBy || 'System'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Updated At
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {new Date(auditDialog.audit.updatedAt).toLocaleString('en-TZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>

              {auditDialog.audit.blockchainTxId && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Blockchain Transaction ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      bgcolor: alpha('#002855', 0.1),
                      p: 1,
                      borderRadius: 1,
                      wordBreak: 'break-all',
                    }}
                  >
                    {auditDialog.audit.blockchainTxId}
                  </Typography>
                </Box>
              )}

              {auditDialog.audit.changes && auditDialog.audit.changes.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Changes Made
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Previous Value</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>New Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {auditDialog.audit.changes.map((change, index) => (
                          <TableRow key={index}>
                            <TableCell>{change.field}</TableCell>
                            <TableCell>
                              <Typography variant="body2" color="error" sx={{ fontStyle: 'italic' }}>
                                {change.from !== null && change.from !== undefined
                                  ? String(change.from)
                                  : '(empty)'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                                {String(change.to)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setAuditDialog({ open: false, audit: null });
              setEditOpen(false);
              loadAssessment();
            }}
            variant="contained"
            sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001B3D' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Modal */}
      {assessment && (
        <PaymentConfirmationModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          payment={{
            id: assessment.ID || assessment.id,
            assessmentId: assessment.ID || assessment.id,
            taxpayerName: taxpayer?.Name || taxpayer?.name || 'N/A',
            taxpayerTin: assessment.Tin || assessment.tin || taxpayer?.TIN || taxpayer?.tin,
            amount: assessment.TotalDue || assessment.totalDue || assessment.Amount || assessment.amount || 0,
            totalPaid: assessment.TotalPaid || assessment.totalPaid || 0,
            remainingBalance: assessment.RemainingBalance || assessment.remainingBalance || 
              ((assessment.TotalDue || assessment.totalDue || assessment.Amount || assessment.amount || 0) - 
               (assessment.TotalPaid || assessment.totalPaid || 0)),
            dueDate: assessment.DueDate || assessment.dueDate,
          }}
          onConfirm={async (paymentData) => {
            try {
              const result = await paymentService.recordPayment(paymentData.assessmentId, {
                amount: paymentData.amount,
                paymentMethod: paymentData.paymentMethod || 'BANK_TRANSFER',
                paymentDate: paymentData.paymentDate || new Date().toISOString(),
                receivedBy: user?.email || user?.username || 'system',
              });

              // Show success notification
              const receipt = result?.data?.receipt || result?.receipt;
              const receiptId = receipt?.receipt_id || 'N/A';
              setSnackbar({
                open: true,
                message: `Payment recorded successfully! Receipt: ${receiptId}`,
                severity: 'success',
              });

              // Reload assessment to reflect updated status
              await loadAssessment();
              setPaymentModalOpen(false);
            } catch (err) {
              console.error('Error processing payment:', err);
              const errorMessage = 
                err?.response?.data?.error || 
                err?.response?.data?.message || 
                err?.message || 
                'Failed to process payment';
              setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error',
              });
            }
          }}
          balance={0}
        />
      )}

      {/* Success Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssessmentDetail;

