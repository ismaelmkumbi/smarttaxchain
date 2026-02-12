import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Snackbar,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Stack,
  Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Search,
  Assessment,
  Add,
  FilterList,
  MonetizationOn,
  ListAlt,
  Paid,
  Warning,
  AddCircleOutline,
  RemoveCircleOutline,
  Edit,
  Delete,
  Visibility,
  Refresh,
  Close,
  AccountBalance,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import taxAssessmentService from 'src/services/taxAssessmentService';
import taxTypeService from 'src/services/taxTypeService';
import { Fade, Grow, Alert } from '@mui/material';
import api from 'src/services/api';
import AssessmentCreationWizard from '../AssessmentCreationWizard';
import ImmutableLedgerTimeline from '../ImmutableLedgerTimeline';

// Status color mapping
const getStatusColor = (status, theme) => {
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

// Stats Card Component
const StatsCard = ({ icon, title, value, color, onClick }) => {
  const theme = useTheme();

  // Use TRA brand colors: primary (yellow) for primary, keep semantic colors for others
  const getCardColor = () => {
    if (color === 'primary') {
      return {
        border: theme.palette.primary.main, // TRA Yellow
        bg: alpha(theme.palette.primary.main, 0.1),
        text: theme.palette.secondary.main, // TRA Black
        avatar: theme.palette.primary.main, // TRA Yellow
        avatarText: theme.palette.secondary.main, // Black text on yellow
      };
    }
    return {
      border: theme.palette[color].main,
      bg: alpha(theme.palette[color].main, 0.1),
      text: theme.palette[color].dark,
      avatar: theme.palette[color].main,
      avatarText: 'white',
    };
  };

  const cardColor = getCardColor();

  return (
    <Grow in={true} timeout={600}>
      <Card
        sx={{
          p: 3,
          bgcolor: 'white',
          border: `2px solid ${alpha(cardColor.border, 0.3)}`,
          borderTop: `4px solid ${cardColor.border}`,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick
            ? {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 24px ${alpha(cardColor.border, 0.3)}`,
                borderColor: cardColor.border,
              }
            : {},
        }}
        onClick={onClick}
      >
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Avatar
            sx={{
              bgcolor: cardColor.avatar,
              width: 56,
              height: 56,
              color: cardColor.avatarText,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {icon}
          </Avatar>
          <Box flex={1} sx={{ minWidth: 0, overflow: 'hidden' }}>
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              gutterBottom 
              fontWeight={500}
              sx={{ 
                fontSize: '0.875rem',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              fontWeight={800} 
              color={cardColor.text}
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                lineHeight: 1.2,
                wordBreak: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Grow>
  );
};

StatsCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

// Assessment List Component
const AssessmentList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    tin: '',
    taxType: 'VAT',
    year: new Date().getFullYear(),
    quarter: Math.ceil((new Date().getMonth() + 1) / 3),
    amount: '',
    currency: 'TZS',
    status: 'PENDING',
    createdBy: 'admin',
    description: '',
    dueDate: '',
    penalties: 0,
    interest: 0,
  });
  const [createErrors, setCreateErrors] = useState({});
  const [taxpayerOptions, setTaxpayerOptions] = useState([]);
  const [taxpayerLoading, setTaxpayerLoading] = useState(false);
  // const [taxpayerSearch, setTaxpayerSearch] = useState('');
  const [selectedTaxpayer, setSelectedTaxpayer] = useState(null);
  const [liabilities, setLiabilities] = useState([{ id: 1, description: '', amount: '' }]);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [editForm, setEditForm] = useState({
    tin: '',
    taxType: 'VAT',
    year: new Date().getFullYear(),
    quarter: 1,
    amount: '',
    currency: 'TZS',
    status: 'PENDING',
    description: '',
    dueDate: '',
    penalties: 0,
    interest: 0,
  });
  const [editErrors, setEditErrors] = useState({});
  const [editLiabilities, setEditLiabilities] = useState([{ id: 1, description: '', amount: '' }]);
  const [selectedEditTaxpayer, setSelectedEditTaxpayer] = useState(null);
  const [auditDialog, setAuditDialog] = useState({ open: false, audit: null });
  const [ledgerDialog, setLedgerDialog] = useState({ open: false, assessmentId: null, entries: [] });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [taxTypes, setTaxTypes] = useState([]);
  const [taxTypesLoading, setTaxTypesLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, assessment: null });
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    taxType: '',
    tin: '',
  });

  // Load assessments
  const loadAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryFilters = {
        page: page + 1,
        pageSize: rowsPerPage,
      };

      if (filters.status) queryFilters.status = filters.status;
      if (filters.taxType) queryFilters.taxType = filters.taxType;
      if (filters.tin) queryFilters.tin = filters.tin;

      const response = await taxAssessmentService.getAllAssessments(queryFilters);

      const assessmentsData = response.assessments || [];
      setAssessments(assessmentsData);
      setTotalCount(response.pagination?.total || assessmentsData.length);
    } catch (err) {
      console.error('Error loading assessments:', err);
      setError(err.message || 'Failed to load assessments');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
    loadTaxTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filters.status, filters.taxType, filters.tin]);

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

  // Filter assessments by search term
  const filteredAssessments = assessments.filter((assessment) => {
    if (!filters.search) return true;
    const searchTerm = filters.search.toLowerCase();
    return (
      (assessment.ID || assessment.id || '').toLowerCase().includes(searchTerm) ||
      (assessment.Tin || assessment.tin || '').toLowerCase().includes(searchTerm) ||
      (assessment.TaxType || assessment.taxType || '').toLowerCase().includes(searchTerm) ||
      (assessment.Description || assessment.description || '').toLowerCase().includes(searchTerm)
    );
  });

  // Calculate metrics
  const metrics = {
    total: assessments.length,
    totalAmount: assessments.reduce((sum, a) => {
      // Calculate total due (amount + penalties + interest) for each assessment
      const amount = a.Amount || a.amount || 0;
      const penalties = a.Penalties || a.penalties || 0;
      const interest = a.Interest || a.interest || 0;
      const totalDue = a.TotalDue || a.totalDue || (amount + penalties + interest);
      return sum + totalDue;
    }, 0),
    paid: assessments.filter((a) => (a.Status || a.status) === 'PAID').length,
    pending: assessments.filter((a) => (a.Status || a.status) === 'PENDING').length,
    overdue: assessments.filter((a) => (a.Status || a.status) === 'OVERDUE').length,
    open: assessments.filter((a) => (a.Status || a.status) === 'OPEN').length,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openCreateDialog = () => {
    setCreateErrors({});
    // preload taxpayers once
    if (!taxpayerOptions.length) {
      void loadTaxpayers('');
    }
    setCreateOpen(true);
  };

  const closeCreateDialog = () => {
    if (creating) return;
    setCreateOpen(false);
  };

  const handleFormChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const loadTaxpayers = async (searchTerm) => {
    try {
      setTaxpayerLoading(true);
      // Use the correct endpoint: /taxpayers (response: { success, taxpayers: [...], count, timestamp })
      const response = await api.get('/taxpayers');
      const taxpayers = response.taxpayers || [];
      const normalized = taxpayers.map((tp) => ({
        id: tp.ID,
        name: tp.Name,
        tin: tp.TIN,
        type: tp.Type,
        display: `${tp.Name} (${tp.TIN})`,
      }));
      const filtered = searchTerm
        ? normalized.filter(
            (t) =>
              t.display.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (t.tin || '').toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : normalized;
      setTaxpayerOptions(filtered);
    } catch (e) {
      console.error('Error loading taxpayers:', e);
      setTaxpayerOptions([]);
    } finally {
      setTaxpayerLoading(false);
    }
  };

  const handleTaxpayerInputChange = async (event, value) => {
    await loadTaxpayers(value);
  };

  const handleTaxpayerChange = (event, value) => {
    setSelectedTaxpayer(value);
    const newTin = value?.tin || '';
    setCreateForm((prev) => ({ ...prev, tin: newTin }));
  };

  const computeTotalLiabilities = (items) => {
    return items.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  };

  const addLiabilityRow = () => {
    setLiabilities((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, description: '', amount: '' },
    ]);
  };

  const removeLiabilityRow = (rowId) => {
    setLiabilities((prev) => {
      const next = prev.filter((l) => l.id !== rowId);
      const total = computeTotalLiabilities(next);
      setCreateForm((f) => ({ ...f, amount: total ? String(total) : '' }));
      return next.length ? next : [{ id: 1, description: '', amount: '' }];
    });
  };

  const updateLiability = (rowId, field, value) => {
    setLiabilities((prev) => {
      const next = prev.map((l) => (l.id === rowId ? { ...l, [field]: value } : l));
      const total = computeTotalLiabilities(next);
      setCreateForm((f) => ({ ...f, amount: total ? String(total) : '' }));
      return next;
    });
  };

  const validateCreate = () => {
    const errs = {};
    if (!createForm.tin) errs.tin = 'TIN is required';
    if (!createForm.taxType) errs.taxType = 'Tax type is required';
    if (!createForm.year) errs.year = 'Year is required';
    if (!createForm.quarter || ![1, 2, 3, 4].includes(Number(createForm.quarter)))
      errs.quarter = 'Quarter must be 1-4';
    if (!createForm.amount || Number(createForm.amount) <= 0) errs.amount = 'Amount must be > 0';
    if (!liabilities.length || computeTotalLiabilities(liabilities) <= 0)
      errs.liabilities = 'Add at least one liability with amount > 0';
    if (!createForm.currency) errs.currency = 'Currency is required';
    if (!createForm.status) errs.status = 'Status is required';
    if (!createForm.description) errs.description = 'Description is required';
    if (!createForm.dueDate) errs.dueDate = 'Due date is required';
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitCreate = async () => {
    if (!validateCreate()) return;
    setCreating(true);
    try {
      const payload = {
        // id omitted: generated by backend automatically
        tin: createForm.tin,
        taxpayerId: createForm.tin, // TIN and taxpayerId are the same
        taxType: createForm.taxType,
        year: Number(createForm.year),
        amount: Number(createForm.amount),
        currency: createForm.currency,
        status: createForm.status,
        createdBy: createForm.createdBy,
        description: createForm.description,
        dueDate: createForm.dueDate,
        penalties: Number(createForm.penalties) || 0,
        interest: Number(createForm.interest) || 0,
        // Compose period from year and quarter (Q1..Q4)
        period: `${createForm.year}-Q${createForm.quarter}`,
        // Optional: include liability lines as metadata for backend (ignored if not supported)
        lines: liabilities
          .filter((l) => Number(l.amount) > 0)
          .map((l) => ({ description: l.description, amount: Number(l.amount) })),
      };

      await taxAssessmentService.createAssessment(payload);
      setCreateOpen(false);
      // Reset form minimal
      setCreateForm((prev) => ({ ...prev, amount: '', description: '', dueDate: '' }));
      // Reload list
      await loadAssessments();
    } catch (e) {
      setError(e.message || 'Failed to create assessment');
    } finally {
      setCreating(false);
    }
  };

  const formatCurrency = (amount) => {
    const num = amount || 0;
    // For very large numbers, use abbreviated format
    if (num >= 1000000000) {
      return `TZS ${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `TZS ${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `TZS ${(num / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-TZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Edit functions
  const handleDeleteClick = (assessment, e) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, assessment });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.assessment) return;

    const assessmentId = deleteDialog.assessment.ID || deleteDialog.assessment.id;
    if (!assessmentId) {
      setSnackbar({ open: true, message: 'Assessment ID not found', severity: 'error' });
      setDeleteDialog({ open: false, assessment: null });
      return;
    }

    setDeleting(true);
    try {
      await taxAssessmentService.deleteAssessment(assessmentId);
      setSnackbar({
        open: true,
        message: `Assessment ${assessmentId} deleted successfully!`,
        severity: 'success',
      });
      setDeleteDialog({ open: false, assessment: null });
      loadAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      let errorMessage = 'Failed to delete assessment';
      
      // Check if assessment doesn't exist
      if (error?.response?.data?.error?.includes('does not exist') || 
          error?.response?.data?.message?.includes('does not exist') ||
          error?.response?.status === 404) {
        errorMessage = `Assessment ${assessmentId} does not exist. It may have already been deleted.`;
        // Reload list to refresh data
        loadAssessments();
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

  const openEditDialog = async (assessment) => {
    setEditingAssessment(assessment);
    setEditErrors({});

    // Ensure tax types are loaded before opening dialog
    if (taxTypes.length === 0 && !taxTypesLoading) {
      await loadTaxTypes();
    }

    // Extract period (e.g., "2025-Q1") to get year and quarter
    const period = assessment.Period || assessment.period || '';
    const periodMatch = period.match(/(\d{4})-Q(\d)/);
    const year = periodMatch
      ? parseInt(periodMatch[1])
      : assessment.Year || assessment.year || new Date().getFullYear();
    const quarter = periodMatch ? parseInt(periodMatch[2]) : 1;

    // Format due date for datetime-local input
    const dueDate = assessment.DueDate || assessment.dueDate || '';
    const formattedDueDate = dueDate ? new Date(dueDate).toISOString().slice(0, 16) : '';

    // Map tax type from assessment to tax type code
    // Assessment might have name (VAT) or code (7899E), need to find matching tax type
    const assessmentTaxType = assessment.TaxType || assessment.taxType || '';
    let mappedTaxType = '';
    
    if (assessmentTaxType && taxTypes.length > 0) {
      // Try to find by code first (exact match)
      let found = taxTypes.find((tt) => (tt.Code || '') === assessmentTaxType);
      // If not found, try by name (exact match)
      if (!found) {
        found = taxTypes.find((tt) => (tt.Name || '') === assessmentTaxType);
      }
      // If still not found, try case-insensitive code match
      if (!found) {
        found = taxTypes.find((tt) => (tt.Code || '').toLowerCase() === assessmentTaxType.toLowerCase());
      }
      // If still not found, try case-insensitive name match
      if (!found) {
        found = taxTypes.find((tt) => (tt.Name || '').toLowerCase() === assessmentTaxType.toLowerCase());
      }
      mappedTaxType = found ? (found.Code || found.Name || '') : '';
    }
    
    // If no match found and we have tax types, use first one as fallback
    if (!mappedTaxType && taxTypes.length > 0) {
      mappedTaxType = taxTypes[0].Code || taxTypes[0].Name || '';
    }

    setEditForm({
      tin: assessment.Tin || assessment.tin || '',
      taxType: mappedTaxType,
      year: year,
      quarter: quarter,
      amount: String(
        assessment.Amount ||
          assessment.amount ||
          assessment.AssessedAmount ||
          assessment.assessedAmount ||
          0,
      ),
      currency: assessment.Currency || assessment.currency || 'TZS',
      status: assessment.Status || assessment.status || 'PENDING',
      description: assessment.Description || assessment.description || '',
      dueDate: formattedDueDate,
      penalties: assessment.Penalties || assessment.penalties || 0,
      interest: assessment.Interest || assessment.interest || 0,
    });

    // Liabilities removed - using simple amount field instead

    // Find and set selected taxpayer
    const tin = assessment.Tin || assessment.tin;
    if (tin && taxpayerOptions.length === 0) {
      await loadTaxpayers('');
    }
    const foundTaxpayer = taxpayerOptions.find((tp) => tp.tin === tin);
    setSelectedEditTaxpayer(foundTaxpayer || null);

    setEditOpen(true);
  };

  const closeEditDialog = () => {
    if (editing) return;
    setEditOpen(false);
    setEditingAssessment(null);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateEditLiability = (rowId, field, value) => {
    setEditLiabilities((prev) => {
      const next = prev.map((l) => (l.id === rowId ? { ...l, [field]: value } : l));
      const total = computeTotalLiabilities(next);
      setEditForm((f) => ({ ...f, amount: total ? String(total) : '' }));
      return next;
    });
  };

  const addEditLiabilityRow = () => {
    setEditLiabilities((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, description: '', amount: '' },
    ]);
  };

  const removeEditLiabilityRow = (rowId) => {
    setEditLiabilities((prev) => {
      const next = prev.filter((l) => l.id !== rowId);
      const total = computeTotalLiabilities(next);
      setEditForm((f) => ({ ...f, amount: total ? String(total) : '' }));
      return next.length ? next : [{ id: 1, description: '', amount: '' }];
    });
  };

  const handleEditTaxpayerChange = (event, value) => {
    setSelectedEditTaxpayer(value);
    const newTin = value?.tin || '';
    setEditForm((prev) => ({ ...prev, tin: newTin }));
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
    if (!editForm.description) errs.description = 'Description is required';
    if (!editForm.dueDate) errs.dueDate = 'Due date is required';
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitEdit = async () => {
    if (!validateEdit() || !editingAssessment) return;
    setEditing(true);
    try {
      const assessmentId = editingAssessment.ID || editingAssessment.id;
      
      // Track changes - only include fields that have changed
      const original = editingAssessment;
      const updates = {};
      
      // Compare and only include changed fields
      if (editForm.tin && editForm.tin !== (original.Tin || original.tin)) {
        updates.tin = editForm.tin;
      }
      if (editForm.taxType && editForm.taxType !== (original.TaxType || original.taxType)) {
        updates.taxType = editForm.taxType;
      }
      if (editForm.year && Number(editForm.year) !== (original.Year || original.year)) {
        updates.year = Number(editForm.year);
      }
      const newAmount = Number(editForm.amount);
      const oldAmount = original.Amount || original.amount || 0;
      if (newAmount !== oldAmount) {
        updates.amount = newAmount;
      }
      if (editForm.currency && editForm.currency !== (original.Currency || original.currency)) {
        updates.currency = editForm.currency;
      }
      if (editForm.status && editForm.status !== (original.Status || original.status)) {
        updates.status = editForm.status;
      }
      if (editForm.description && editForm.description !== (original.Description || original.description)) {
        updates.description = editForm.description;
      }
      const newDueDate = editForm.dueDate;
      const oldDueDate = original.DueDate || original.dueDate;
      if (newDueDate && newDueDate !== oldDueDate) {
        updates.dueDate = newDueDate;
      }
      const newPenalties = Number(editForm.penalties) || 0;
      const oldPenalties = original.Penalties || original.penalties || 0;
      if (newPenalties !== oldPenalties) {
        updates.penalties = newPenalties;
      }
      const newInterest = Number(editForm.interest) || 0;
      const oldInterest = original.Interest || original.interest || 0;
      if (newInterest !== oldInterest) {
        updates.interest = newInterest;
      }
      const newPeriod = `${editForm.year}-Q${editForm.quarter}`;
      const oldPeriod = original.Period || original.period;
      if (newPeriod !== oldPeriod) {
        updates.period = newPeriod;
      }

      // If no changes, show message and return
      if (Object.keys(updates).length === 0) {
        setError('No changes detected');
        setEditing(false);
        return;
      }

      const response = await taxAssessmentService.updateAssessment(assessmentId, updates);
      
      // Show audit dialog if audit information is available
      if (response.audit) {
        setAuditDialog({ open: true, audit: response.audit });
        // Show success notification
        setSnackbar({
          open: true,
          message: `Assessment ${assessmentId} updated successfully!`,
          severity: 'success',
        });
      } else {
      setEditOpen(false);
      await loadAssessments();
        // Show success notification
        setSnackbar({
          open: true,
          message: `Assessment ${assessmentId} updated successfully!`,
          severity: 'success',
        });
      }
    } catch (e) {
      const errorMessage = e?.response?.data?.error?.message || 
                          e?.response?.data?.message || 
                          e?.message || 
                          'Failed to update assessment';
      setError(errorMessage);
      // Show error notification
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setEditing(false);
    }
  };

  if (loading && assessments.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Loading assessments...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Tax Assessment Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage tax assessments and liabilities
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadAssessments}
            disabled={loading}
            sx={{
              borderColor: theme.palette.secondary.main, // TRA Black
              color: theme.palette.secondary.main, // TRA Black
              fontWeight: 600,
              '&:hover': {
                borderColor: theme.palette.secondary.dark,
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                color: theme.palette.secondary.main,
              },
              '&:disabled': {
                borderColor: theme.palette.action.disabled,
                color: theme.palette.action.disabled,
              },
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateDialog}
            sx={{
              bgcolor: theme.palette.primary.main, // TRA Yellow
              color: theme.palette.secondary.main, // TRA Black text
              fontWeight: 700,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                color: theme.palette.secondary.main,
              },
            }}
          >
            New Assessment
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            icon={<ListAlt />}
            title="Total Assessments"
            value={metrics.total}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard
            icon={<MonetizationOn />}
            title="Total Due"
            value={formatCurrency(metrics.totalAmount)}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard icon={<Paid />} title="Paid" value={metrics.paid} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard icon={<Warning />} title="Pending" value={metrics.pending} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard icon={<Warning />} title="Overdue" value={metrics.overdue} color="error" />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          bgcolor: 'white',
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by ID, TIN, Tax Type, or Description..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2.5}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              variant="outlined"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="DISPUTED">Disputed</MenuItem>
              <MenuItem value="OVERDUE">Overdue</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2.5}>
            <TextField
              select
              fullWidth
              label="Tax Type"
              value={filters.taxType}
              onChange={(e) => setFilters({ ...filters, taxType: e.target.value })}
              variant="outlined"
                disabled={taxTypesLoading}
            >
              <MenuItem value="">All Types</MenuItem>
                {taxTypesLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading...
                  </MenuItem>
                ) : (
                  taxTypes.map((taxType) => (
                    <MenuItem key={taxType.Code || taxType.Name} value={taxType.Code || taxType.Name}>
                      {taxType.Name || taxType.Code}
                    </MenuItem>
                  ))
                )}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2.5}>
            <TextField
              fullWidth
              variant="outlined"
              label="TIN"
              placeholder="Filter by TIN"
              value={filters.tin}
              onChange={(e) => setFilters({ ...filters, tin: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={0.5}>
            <Tooltip title="Clear Filters">
              <IconButton
                onClick={() => setFilters({ search: '', status: '', taxType: '', tin: '' })}
                color="primary"
              >
                <FilterList />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Error State */}
      {error && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.error.main, 0.1) }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* Assessments Table */}
      <Fade in={true} timeout={600}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: theme.palette.secondary.main, // TRA Black
                  borderBottom: `2px solid ${theme.palette.primary.main}`, // TRA Yellow accent
                }}
              >
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 2,
                  }}
                >
                  Assessment ID
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 2,
                  }}
                >
                  TIN
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 2,
                  }}
                >
                  Tax Type
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 2,
                  }}
                >
                  Period
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 2,
                  }}
                >
                  Amount
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 2,
                  }}
                >
                  Total Due
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 2,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 2,
                  }}
                >
                  Due Date
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 2,
                  }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Assessment sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No assessments found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {filters.search || filters.status || filters.taxType || filters.tin
                        ? 'Try adjusting your filters'
                        : 'Create a new assessment to get started'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssessments.map((assessment, index) => {
                  const status = assessment.Status || assessment.status || 'PENDING';
                  const statusColors = getStatusColor(status, theme);
                  const assessmentId = assessment.ID || assessment.id;
                  const tin = assessment.Tin || assessment.tin;
                  const taxType = assessment.TaxType || assessment.taxType;
                  const amount = assessment.Amount || assessment.amount || 0;
                  const totalDue =
                    assessment.TotalDue ||
                    assessment.totalDue ||
                    amount + (assessment.Penalties || 0) + (assessment.Interest || 0);

                  return (
                    <TableRow
                      key={assessmentId || index}
                      hover
                      sx={{
                        bgcolor: 'white',
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.grey[100], 0.8),
                          transform: 'scale(1.001)',
                        },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => navigate(`/tax/assessment/detail/${assessmentId}`)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {assessmentId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tin}
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tax/taxpayer/${tin}/assessments`);
                          }}
                          sx={{
                            cursor: 'pointer',
                            borderColor: theme.palette.primary.main, // TRA Yellow
                            color: theme.palette.secondary.main, // TRA Black
                            fontWeight: 600,
                            bgcolor: alpha(theme.palette.primary.main, 0.1), // Light yellow
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                              borderColor: theme.palette.primary.dark,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} color="text.primary">
                          {taxType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {assessment.Period || assessment.period || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {formatCurrency(amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color={theme.palette.secondary.main} // TRA Black
                        >
                          {formatCurrency(totalDue)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          size="small"
                          sx={{
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 700,
                            border: `1px solid ${alpha(statusColors.color, 0.3)}`,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(assessment.DueDate || assessment.dueDate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View account (payments & balance)">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/apps/assessment/${assessmentId}/account`)}
                              sx={{
                                color: theme.palette.success.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  color: theme.palette.success.dark,
                                },
                              }}
                            >
                              <AccountBalance fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/tax/assessment/detail/${assessmentId}`)}
                              sx={{
                                color: theme.palette.secondary.main, // TRA Black
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                  color: theme.palette.secondary.dark,
                                },
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(assessment)}
                              sx={{
                                color: theme.palette.info.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  color: theme.palette.info.dark,
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => handleDeleteClick(assessment, e)}
                              sx={{
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </TableContainer>
      </Fade>

      {/* Create Assessment Wizard */}
      <Dialog open={createOpen} onClose={closeCreateDialog} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>Create New Tax Assessment</span>
          <IconButton
            onClick={closeCreateDialog}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <AssessmentCreationWizard
            taxpayerOptions={taxpayerOptions}
            loading={creating}
            onComplete={async (assessmentData) => {
              setCreating(true);
              try {
                // Ensure period is calculated correctly
                const period = assessmentData.period || `${assessmentData.year}-Q${assessmentData.quarter}`;
                
                // Add default values for fields not in wizard
                const payload = {
                  ...assessmentData,
                  period,
                  status: 'PENDING',
                  createdBy: createForm.createdBy || 'admin',
                  penalties: 0,
                  interest: 0,
                  taxpayerId: assessmentData.tin, // TIN and taxpayerId are the same
                };
                
                const response = await taxAssessmentService.createAssessment(payload);
                console.log('Assessment created:', response);
                
                // Extract assessment ID from response (handle different response structures)
                const assessmentId = response?.data?.assessment?.ID || 
                                   response?.assessment?.ID || 
                                   response?.data?.assessment?.id ||
                                   response?.assessment?.id ||
                                   'Assessment';
                
                // Show success notification
                setSnackbar({
                  open: true,
                  message: `Assessment ${assessmentId} created successfully!`,
                  severity: 'success',
                });
                
                // Show success message with ledger info if available
                if (response.ledgerEvents && response.ledgerEvents.length > 0) {
                  const txId = response.ledgerEvents[0].tx_id || 'N/A';
                  console.log('Ledger entry created:', txId);
                }
                
                setCreateOpen(false);
                loadAssessments();
                // Reset form
                setCreateForm({
                  tin: '',
                  taxType: 'VAT',
                  year: new Date().getFullYear(),
                  quarter: Math.ceil((new Date().getMonth() + 1) / 3),
                  amount: '',
                  currency: 'TZS',
                  status: 'PENDING',
                  description: '',
                  dueDate: '',
                  penalties: 0,
                  interest: 0,
                });
                setSelectedTaxpayer(null);
                setLiabilities([{ id: 1, description: '', amount: '' }]);
              } catch (error) {
                console.error('Error creating assessment:', error);
                const errorMessage = error?.response?.data?.error?.message ||
                                   error?.response?.data?.message ||
                                   error?.message ||
                                   'Failed to create assessment';
                setSnackbar({
                  open: true,
                  message: errorMessage,
                  severity: 'error',
                });
              } finally {
                setCreating(false);
              }
            }}
            onCancel={closeCreateDialog}
          />
        </DialogContent>
      </Dialog>

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
          <span style={{ color: 'white', fontWeight: 600 }}>
            Edit Assessment
          </span>
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
                value={editForm.taxType || ''}
                onChange={(e) => handleEditFormChange('taxType', e.target.value)}
                error={!!editErrors.taxType}
                helperText={editErrors.taxType || (taxTypesLoading ? 'Loading tax types...' : '')}
                disabled={taxTypesLoading}
                SelectProps={{
                  renderValue: (value) => {
                    if (!value) return '';
                    const selected = taxTypes.find((tt) => (tt.Code || tt.Name) === value);
                    return selected ? (selected.Name || selected.Code) : value;
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
                  taxTypes.map((taxType) => {
                    // Use Code as primary value, fallback to Name if Code doesn't exist
                    const taxTypeValue = taxType.Code || taxType.Name || '';
                    const taxTypeName = taxType.Name || taxType.Code || '';
                    return (
                      <MenuItem key={taxTypeValue} value={taxTypeValue}>
                        <Box>
                          <Typography variant="body1">{taxTypeName}</Typography>
                          {taxType.Rate !== undefined && taxType.Rate !== null && (
                            <Typography variant="caption" color="text.secondary">
                              Rate: {Number(taxType.Rate).toFixed(1)}%
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    );
                  })
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
              <Button
                size="small"
                variant="outlined"
                onClick={async () => {
                  const assessmentId = editingAssessment?.ID || editingAssessment?.id;
                  if (assessmentId) {
                    try {
                      const ledgerResponse = await taxAssessmentService.getAssessmentLedger(assessmentId);
                      setLedgerDialog({
                        open: true,
                        assessmentId,
                        entries: ledgerResponse.events || [],
                      });
                    } catch (error) {
                      console.error('Error loading ledger:', error);
                      setError('Failed to load ledger history');
                    }
                  }
                }}
              >
                View Full Ledger History
              </Button>
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

      {/* Audit Information Dialog */}
      <Dialog
        open={auditDialog.open}
        onClose={() => {
          setAuditDialog({ open: false, audit: null });
          setEditOpen(false);
          loadAssessments();
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
          <span style={{ color: 'white', fontWeight: 600 }}>
            Assessment Update Audit Trail
          </span>
          <IconButton
            onClick={() => {
              setAuditDialog({ open: false, audit: null });
              setEditOpen(false);
              loadAssessments();
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
              loadAssessments();
            }}
            variant="contained"
            sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001B3D' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ledger History Dialog */}
      <Dialog
        open={ledgerDialog.open}
        onClose={() => setLedgerDialog({ open: false, assessmentId: null, entries: [] })}
        maxWidth="lg"
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
          <span style={{ color: 'white', fontWeight: 600 }}>
            Immutable Ledger History
          </span>
          <IconButton
            onClick={() => setLedgerDialog({ open: false, assessmentId: null, entries: [] })}
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
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              This is the complete, immutable history of all transactions for this assessment. 
              Even if interest or penalties are removed, their original entries remain permanently 
              recorded on the blockchain and can be retrieved at any time.
            </Typography>
          </Alert>
          <ImmutableLedgerTimeline
            ledgerEntries={ledgerDialog.entries.map((event, index) => ({
              id: event.tx_id || event.id || `event-${index}`,
              type: (event.event_type || event.type || 'UNKNOWN').toUpperCase(),
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
            }))}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setLedgerDialog({ open: false, assessmentId: null, entries: [] })}
            variant="contained"
            sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001B3D' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, assessment: null })}
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
          <span style={{ color: 'white', fontWeight: 600 }}>
            Delete Assessment
          </span>
          <IconButton
            onClick={() => setDeleteDialog({ open: false, assessment: null })}
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
            Are you sure you want to delete assessment{' '}
            <strong>{deleteDialog.assessment?.ID || deleteDialog.assessment?.id}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action cannot be undone. The assessment and all associated data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialog({ open: false, assessment: null })} disabled={deleting}>
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

export default AssessmentList;
