import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
  IconButton,
  Typography,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Divider,
  Checkbox,
  CircularProgress,
  Fade,
  Collapse,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconTrash, IconFilter, IconEye, IconEdit, IconPlus, IconSearch } from '@tabler/icons';
import { positions, Stack } from '@mui/system';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import taxpayerService from '../../services/taxpayerService';
import EnhancedRegistrationModal from '../../components/taxpayer/EnhancedRegistrationModal';

// Custom Checkbox Component
const CustomCheckbox = ({ indeterminate, checked, onChange, inputProps }) => {
  return (
    <Checkbox
      indeterminate={indeterminate}
      checked={checked}
      onChange={onChange}
      inputProps={inputProps}
      sx={{
        color: '#002855',
        '&.Mui-checked': {
          color: '#002855',
        },
      }}
    />
  );
};

CustomCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  inputProps: PropTypes.object,
};

// Sorting Utilities
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Taxpayer Table Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#FFF5CC' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {this.state.error?.response?.status === 404
              ? 'Taxpayer Data Not Found'
              : 'Taxpayer Data Unavailable'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {(() => {
              const error = this.state.error;
              if (!error) {
                return "We're unable to load taxpayer information. Please try again later.";
              }
              // Extract error message as string
              if (typeof error === 'string') {
                return error;
              }
              if (error?.message) {
                if (typeof error.message === 'string') {
                  return error.message;
                }
                if (typeof error.message === 'object') {
                  return error.message.message || error.message.code || 'An error occurred';
                }
              }
              if (error?.error?.message) {
                return error.error.message;
              }
              if (error?.response?.data?.error?.message) {
                return error.response.data.error.message;
              }
              if (error?.response?.data?.message) {
                return typeof error.response.data.message === 'string'
                  ? error.response.data.message
                  : error.response.data.message?.message || 'An error occurred';
              }
              return "We're unable to load taxpayer information. Please try again later.";
            })()}
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001B3D' } }}
            onClick={() => window.location.reload()}
          >
            Refresh Data
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

// Table Head Cells
const headCells = [
  { id: 'tin', label: 'TIN', sortable: true },
  { id: 'name', label: 'Taxpayer Name', sortable: true },
  { id: 'regDate', label: 'Registration Date', sortable: true },
  { id: 'category', label: 'Tax Category', sortable: true },
  { id: 'status', label: ' Status', sortable: true },
  { id: 'budget', label: 'Balance (TZS)', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false },
];

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort, onSelectAllClick, numSelected, rowCount } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ bgcolor: '#002855' }}>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all taxpayers' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sx={{ color: 'white', fontWeight: 600 }}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                sx={{ color: 'inherit !important' }}
              >
                {headCell.label}
                {orderBy === headCell.id && (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                )}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, onAddNew, onSearch, searchQuery, isDeleting } = props;

  return (
    <Toolbar sx={{ bgcolor: '#E6ECF5', py: 2 }}>
      <Typography variant="h6" sx={{ flex: 1 }}>
        {numSelected > 0
          ? `${numSelected} Taxpayers Selected`
          : 'Tanzania Revenue Authority - Taxpayer Registry'}
      </Typography>

      {numSelected > 0 ? (
        <Button
          variant="contained"
          color="error"
          startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <IconTrash />}
          sx={{
            bgcolor: '#D32F2F',
            '&:hover': { bgcolor: '#B71C1C' },
          }}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Remove Selected'}
        </Button>
      ) : (
        <>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search taxpayers..."
            value={searchQuery}
            onChange={onSearch}
            InputProps={{
              startAdornment: <IconSearch size={20} style={{ marginRight: 8 }} />,
            }}
            sx={{ mr: 2, width: 300 }}
          />
          <Button variant="contained" startIcon={<IconFilter />} sx={{ mr: 2 }}>
            Filter Taxpayers
          </Button>
          <Button
            variant="contained"
            startIcon={<IconPlus />}
            onClick={onAddNew}
            sx={{
              bgcolor: '#002855',
              '&:hover': { bgcolor: '#001B3D' },
              color: 'white',
            }}
          >
            New Taxpayer
          </Button>
        </>
      )}
    </Toolbar>
  );
};

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Taxpayer Management' }];

const initialTaxpayerState = {
  name: '',
  tin: '',
  vrn: '',
  regDate: new Date().toISOString().split('T')[0],
  type: 'Company',
  category: '',
  address: '',
  email: '',
  phone: '',
  signatories: [''],
  status: 'Active',
};

// Normalize status to match select options (Active, Pending, Suspended, Closed)
const normalizeStatus = (status) => {
  if (!status) return 'Active';
  const statusLower = status.toLowerCase();
  const statusMap = {
    active: 'Active',
    pending: 'Pending',
    suspended: 'Suspended',
    closed: 'Closed',
  };
  return statusMap[statusLower] || 'Active';
};

const transformTaxpayerData = (apiData) => {
  if (!apiData) return [];

  const taxpayers = Array.isArray(apiData) ? apiData : [apiData.taxpayer || apiData];

  return taxpayers.map((taxpayer) => ({
    id: taxpayer.id || taxpayer.ID || taxpayer.TaxpayerID,
    name: taxpayer.name || taxpayer.Name || 'N/A',
    tin: taxpayer.tin || taxpayer.TIN || 'N/A',
    vrn: taxpayer.vrn || taxpayer.VRN || 'N/A',
    regDate: taxpayer.regDate || taxpayer.RegisteredDate || new Date().toISOString().split('T')[0],
    type: taxpayer.type || taxpayer.Type || 'Company',
    category: taxpayer.category || taxpayer.BusinessCategory || 'N/A',
    address: taxpayer.address || taxpayer.RegistrationAddress || 'N/A',
    email: taxpayer.email || taxpayer.ContactEmail || 'N/A',
    phone: taxpayer.phone || taxpayer.PhoneNumber || 'N/A',
    signatories: taxpayer.signatories || taxpayer.AuthorizedSignatories || [],
    status: normalizeStatus(taxpayer.status || taxpayer.Status),
    budget: taxpayer.budget || taxpayer.ComplianceScore || 0,
    imgsrc: taxpayer.imgsrc || taxpayer.Avatar || '',
  }));
};

const buildErrorMessage = (error, fallbackMessage) => {
  if (!error) return fallbackMessage;
  const baseMessage = error.message || fallbackMessage;
  return error.details ? `${baseMessage}: ${error.details}` : baseMessage;
};

const TaxpayerForm = ({ open, onClose, taxpayer, onSubmit, loading }) => {
  const [formData, setFormData] = React.useState(taxpayer || initialTaxpayerState);
  const [errors, setErrors] = React.useState({});

  // Helper function to format date for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      // Otherwise, parse and format
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  React.useEffect(() => {
    if (taxpayer) {
      // Normalize status and format date to ensure it matches form requirements
      setFormData({
        ...taxpayer,
        status: normalizeStatus(taxpayer.status),
        regDate: formatDateForInput(taxpayer.regDate),
      });
    } else {
      setFormData(initialTaxpayerState);
    }
  }, [taxpayer]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{9}$/.test(formData.tin)) newErrors.tin = 'Invalid TIN (9 digits required)';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';

    formData.signatories.forEach((signatory, index) => {
      if (!signatory?.trim()) {
        newErrors[`signatory_${index}`] = 'Signatory name is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleSignatoryChange = (index, value) => {
    const newSignatories = [...formData.signatories];
    newSignatories[index] = value;
    setFormData({ ...formData, signatories: newSignatories });
  };

  const addSignatoryField = () => {
    setFormData({ ...formData, signatories: [...formData.signatories, ''] });
  };

  const removeSignatory = (index) => {
    const newSignatories = formData.signatories.filter((_, i) => i !== index);
    setFormData({ ...formData, signatories: newSignatories });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ bgcolor: '#002855', color: 'white' }}>
        {taxpayer ? 'Edit Taxpayer' : 'Register New Taxpayer'}
      </DialogTitle>
      <DialogContent sx={{ mt: 2, overflow: 'visible' }}>
        <Stack spacing={3}>
          <TextField
            label="Taxpayer Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="TIN"
              value={formData.tin}
              onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
              error={!!errors.tin}
              helperText={errors.tin}
              fullWidth
              required
            />
            <TextField
              label="VRN"
              value={formData.vrn}
              onChange={(e) => setFormData({ ...formData, vrn: e.target.value })}
              error={!!errors.vrn}
              helperText={errors.vrn}
              fullWidth
              required
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Taxpayer Type</InputLabel>
              <Select
                value={formData.type}
                label="Taxpayer Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="Company">Company</MenuItem>
                <MenuItem value="Individual">Individual</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Tax Category</InputLabel>
              <Select
                value={formData.category}
                label="Tax Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="Wholesale">Wholesale</MenuItem>
                <MenuItem value="Retail">Retail</MenuItem>
                <MenuItem value="Services">Services</MenuItem>
                <MenuItem value="Manufacturing">Manufacturing</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TextField
            label="Registration Date"
            type="date"
            value={formData.regDate}
            onChange={(e) => setFormData({ ...formData, regDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            multiline
            rows={2}
            fullWidth
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Signatories</Typography>
          {formData.signatories.map((signatory, index) => (
            <Stack key={index} direction="row" spacing={2} alignItems="center">
              <TextField
                label={`Signatory ${index + 1}`}
                value={signatory || ''}
                onChange={(e) => handleSignatoryChange(index, e.target.value)}
                fullWidth
                required
                error={!!errors[`signatory_${index}`]}
                helperText={errors[`signatory_${index}`]}
              />
              {index > 0 && (
                <Button variant="outlined" color="error" onClick={() => removeSignatory(index)}>
                  Remove
                </Button>
              )}
            </Stack>
          ))}
          <Button variant="outlined" onClick={addSignatoryField} sx={{ alignSelf: 'flex-start' }}>
            Add Signatory
          </Button>

          <Divider sx={{ my: 2 }} />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: '#002855' }} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            bgcolor: '#002855',
            '&:hover': { bgcolor: '#001B3D' },
            color: 'white',
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : taxpayer ? (
            'Update Taxpayer'
          ) : (
            'Register Taxpayer'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EnhancedTable = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('tin');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [taxpayers, setTaxpayers] = React.useState([]);
  const [openForm, setOpenForm] = React.useState(false);
  const [openEnhancedModal, setOpenEnhancedModal] = React.useState(false);
  const [currentTaxpayer, setCurrentTaxpayer] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success',
    vertical: 'top',
    horizontal: 'right',
  });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [formLoading, setFormLoading] = React.useState(false);
  const [deletingRows, setDeletingRows] = React.useState([]);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [auditDialog, setAuditDialog] = React.useState({ open: false, audit: null });

  const fetchTaxpayers = async (query = '') => {
    try {
      setLoading(true);
      const response = await taxpayerService.getAll(query);
      const transformedData = transformTaxpayerData(response);
      setTaxpayers(transformedData);
      setError(null);
    } catch (err) {
      const message = buildErrorMessage(err, 'Failed to fetch taxpayers');
      setError(message);
      showSnackbar(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTaxpayers();
  }, []);

  React.useEffect(() => {
    console.log('Taxpayer state updated:', taxpayers);
  }, [taxpayers]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const timer = setTimeout(() => {
      if (query.length > 2 || query.length === 0) {
        fetchTaxpayers(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = taxpayers.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleCreateTaxpayer = async (data) => {
    try {
      setFormLoading(true);

      // Send request to create taxpayer
      const response = await taxpayerService.create(data);

      // If response is successful, update the state and show success message
      const newTaxpayer = transformTaxpayerData(response)[0];
      setTaxpayers((prev) => [...prev, newTaxpayer]);
      showSnackbar('Taxpayer registered successfully!', 'success');

      // Close the modal or perform additional steps
      setOpenForm(false);
    } catch (error) {
      console.error('Error during taxpayer creation:', error);
      const message = buildErrorMessage(error, 'Error creating taxpayer');
      showSnackbar(message, 'error');
    } finally {
      // Ensure form loading state is reset regardless of success or failure
      setFormLoading(false);
    }
  };

  const handleUpdateTaxpayer = async (data) => {
    try {
      setFormLoading(true);

      // Ensure we have a valid ID
      if (!data.id) {
        throw new Error('Taxpayer ID is required for update');
      }

      // Send request to update taxpayer (returns { taxpayer, audit })
      const response = await taxpayerService.update(data.id, data);

      // Extract taxpayer from response
      const updatedTaxpayer = transformTaxpayerData(response.taxpayer || response)[0];
      setTaxpayers((prev) => prev.map((t) => (t.id === data.id ? updatedTaxpayer : t)));

      // Show audit dialog if audit information is available
      if (response.audit) {
        setAuditDialog({ open: true, audit: response.audit });
      } else {
        showSnackbar('Taxpayer updated successfully!', 'success');
      }

      setOpenForm(false);
    } catch (error) {
      console.error('Error during taxpayer update:', error);
      const message = buildErrorMessage(error, 'Error updating taxpayer');
      showSnackbar(message, 'error');
    } finally {
      // Ensure form loading state is reset regardless of success or failure
      setFormLoading(false);
    }
  };

  const handleDeleteTaxpayers = async () => {
    setIsDeleting(true);
    setDeletingRows([...selected]);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Send the delete request
      const response =
        selected.length === 1
          ? await taxpayerService.delete(selected[0])
          : await taxpayerService.deleteMultiple(selected);

      // If successful, update the state and show success message
      setTaxpayers((prev) => prev.filter((t) => !selected.includes(t.id)));
      setSelected([]);
      showSnackbar(response?.message || 'Taxpayer(s) deleted successfully!', 'success');
    } catch (error) {
      console.error('Error during taxpayer deletion:', error);
      const message = buildErrorMessage(error, 'Error deleting taxpayer(s)');
      showSnackbar(message, 'error');
    } finally {
      // Reset states after operation is complete
      setDeletingRows([]);
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
      vertical: 'top',
      horizontal: 'right',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'suspended':
        return 'error';
      case 'closed':
        return 'default';
      default:
        return 'info';
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      maximumFractionDigits: 0,
    }).format(amount * 2300);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const visibleTaxpayers = taxpayers.filter((t) => !deletingRows.includes(t.id));

  return (
    <ErrorBoundary>
      <PageContainer title="TRA Taxpayer Management">
        <Breadcrumb title="Taxpayer Registry" items={BCrumb} />

        <ParentCard title="Taxpayer Directory">
          {loading && taxpayers.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : (
            <Paper elevation={3} sx={{ borderRadius: 2 }}>
              <EnhancedTableToolbar
                numSelected={selected.length}
                onAddNew={() => {
                  setOpenEnhancedModal(true);
                }}
                onSearch={handleSearch}
                searchQuery={searchQuery}
                isDeleting={isDeleting}
              />

              <TableContainer>
                <Table sx={{ minWidth: 1200 }}>
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={visibleTaxpayers.length}
                  />

                  <TableBody>
                    {stableSort(visibleTaxpayers, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((taxpayer) => {
                        const isItemSelected = isSelected(taxpayer.id);
                        const isBeingDeleted = deletingRows.includes(taxpayer.id);

                        return (
                          <Fade in={!isBeingDeleted} timeout={500} key={taxpayer.id}>
                            <TableRow
                              hover
                              selected={isItemSelected}
                              onClick={(event) => handleClick(event, taxpayer.id)}
                            >
                              <TableCell padding="checkbox">
                                <CustomCheckbox
                                  checked={isItemSelected}
                                  inputProps={{
                                    'aria-labelledby': `enhanced-table-checkbox-${taxpayer.id}`,
                                  }}
                                />
                              </TableCell>

                              <TableCell sx={{ fontWeight: 600 }}>
                                {taxpayer.tin ? `TIN-${taxpayer.tin}` : 'N/A'}
                              </TableCell>

                              <TableCell>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar src={taxpayer.imgsrc} sx={{ bgcolor: '#FFD100' }}>
                                    {taxpayer.name?.charAt(0) || 'T'}
                                  </Avatar>
                                  <Stack>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                      {taxpayer.name || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      {taxpayer.email || 'N/A'}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </TableCell>

                              <TableCell>{formatDate(taxpayer.regDate)}</TableCell>

                              <TableCell>
                                <Chip
                                  label={taxpayer.category || 'N/A'}
                                  sx={{
                                    bgcolor: '#E6ECF5',
                                    color: '#002855',
                                    fontWeight: 500,
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <Chip
                                  label={taxpayer.status || 'N/A'}
                                  color={getStatusColor(taxpayer.status)}
                                  variant="filled"
                                  sx={{
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    minWidth: 120,
                                  }}
                                />
                              </TableCell>

                              <TableCell align="right">
                                <Typography
                                  variant="subtitle1"
                                  color={taxpayer.budget > 1000 ? 'error' : 'success'}
                                  fontWeight={600}
                                >
                                  {formatCurrency(taxpayer.budget)}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    variant="outlined"
                                    startIcon={<IconEdit />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCurrentTaxpayer(taxpayer);
                                      setOpenForm(true);
                                    }}
                                    sx={{
                                      color: '#002855',
                                      borderColor: '#002855',
                                      '&:hover': { borderColor: '#001B3D' },
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<IconTrash />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelected([taxpayer.id]);
                                      setOpenDeleteDialog(true);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          </Fade>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={visibleTaxpayers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ borderTop: '1px solid #E0E5EC' }}
              />
            </Paper>
          )}
        </ParentCard>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle sx={{ bgcolor: '#D32F2F', color: 'white' }}>Confirm Deletion</DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography>
              Are you sure you want to delete {selected.length} taxpayer(s)? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteTaxpayers}
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        <TaxpayerForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          taxpayer={currentTaxpayer}
          onSubmit={currentTaxpayer ? handleUpdateTaxpayer : handleCreateTaxpayer}
          loading={formLoading}
        />

        <EnhancedRegistrationModal
          open={openEnhancedModal}
          onClose={() => setOpenEnhancedModal(false)}
          onSuccess={(result) => {
            showSnackbar('Taxpayer registered successfully!', 'success');
            fetchTaxpayers(); // Refresh the list
          }}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: snackbar.vertical, horizontal: snackbar.horizontal }}
          key={snackbar.vertical + snackbar.horizontal}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Audit Information Dialog */}
        <Dialog
          open={auditDialog.open}
          onClose={() => setAuditDialog({ open: false, audit: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#002855', color: 'white' }}>Update Audit Trail</DialogTitle>
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
                                <Typography
                                  variant="body2"
                                  color="error"
                                  sx={{ fontStyle: 'italic' }}
                                >
                                  {change.from || '(empty)'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  color="success.main"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {change.to}
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
                showSnackbar('Taxpayer updated successfully!', 'success');
              }}
              variant="contained"
              sx={{
                bgcolor: '#002855',
                '&:hover': { bgcolor: '#001B3D' },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
    </ErrorBoundary>
  );
};

EnhancedTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      tin: PropTypes.string.isRequired,
      vrn: PropTypes.string.isRequired,
      regDate: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      signatories: PropTypes.arrayOf(PropTypes.string).isRequired,
      status: PropTypes.string.isRequired,
    }),
  ),
};

export default EnhancedTable;
