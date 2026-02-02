import React, { useState, useEffect } from 'react';
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
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  alpha,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Refresh,
  Close,
  CheckCircle,
  Cancel,
  Category,
  Percent,
  CalendarToday,
} from '@mui/icons-material';
import taxTypeService from 'src/services/taxTypeService';

const TaxTypeManagement = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [taxTypes, setTaxTypes] = useState([]);
  const [filteredTaxTypes, setFilteredTaxTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTaxType, setSelectedTaxType] = useState(null);
  const [formData, setFormData] = useState({
    Code: '',
    Name: '',
    Description: '',
    Rate: '',
    Category: 'DIRECT',
    Status: 'ACTIVE',
    EffectiveDate: new Date().toISOString().split('T')[0],
    ExpiryDate: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadTaxTypes();
  }, []);

  useEffect(() => {
    filterTaxTypes();
  }, [taxTypes, searchTerm, statusFilter, categoryFilter]);

  const loadTaxTypes = async () => {
    try {
      setLoading(true);
      const data = await taxTypeService.getAll();
      setTaxTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading tax types:', error);
      showSnackbar('Failed to load tax types', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterTaxTypes = () => {
    let filtered = [...taxTypes];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tt) =>
          (tt.Code || '').toLowerCase().includes(search) ||
          (tt.Name || '').toLowerCase().includes(search) ||
          (tt.Description || '').toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((tt) => (tt.Status || '').toUpperCase() === statusFilter.toUpperCase());
    }

    if (categoryFilter) {
      filtered = filtered.filter((tt) => (tt.Category || '').toUpperCase() === categoryFilter.toUpperCase());
    }

    setFilteredTaxTypes(filtered);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = () => {
    setFormData({
      Name: '',
      Description: '',
      Rate: '',
      Category: 'DIRECT',
      Status: 'ACTIVE',
      EffectiveDate: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setCreateOpen(true);
  };

  const handleEdit = (taxType) => {
    setSelectedTaxType(taxType);
    setFormData({
      Name: taxType.Name || '',
      Description: taxType.Description || '',
      Rate: taxType.Rate || '',
      Category: taxType.Category || 'DIRECT',
      Status: taxType.Status || 'ACTIVE',
      EffectiveDate: taxType.EffectiveDate
        ? new Date(taxType.EffectiveDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setEditOpen(true);
  };

  const handleDelete = (taxType) => {
    setSelectedTaxType(taxType);
    setDeleteOpen(true);
  };

  // Generate code from name (for auto-generation)
  const generateCodeFromName = (name) => {
    if (!name) return '';
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 50);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    } else if (formData.Name.trim().length < 2 || formData.Name.trim().length > 255) {
      newErrors.Name = 'Name must be between 2 and 255 characters';
    }
    if (formData.Description && formData.Description.length > 1000) {
      newErrors.Description = 'Description must be less than 1000 characters';
    }
    if (formData.Rate !== '' && (isNaN(formData.Rate) || formData.Rate < 0 || formData.Rate > 100)) {
      newErrors.Rate = 'Rate must be a number between 0 and 100';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitCreate = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Auto-generate code from name
      const generatedCode = generateCodeFromName(formData.Name.trim());
      
      const payload = {
        Code: generatedCode,
        Name: formData.Name.trim(),
        Description: formData.Description.trim() || undefined,
        Rate: formData.Rate ? Number(formData.Rate) : undefined,
        Category: formData.Category,
        Status: formData.Status,
        EffectiveDate: formData.EffectiveDate || undefined,
      };

      // Remove undefined values
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      await taxTypeService.create(payload);
      showSnackbar(`Tax type ${payload.Code} created successfully!`, 'success');
      setCreateOpen(false);
      loadTaxTypes();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create tax type';
      showSnackbar(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!validateForm() || !selectedTaxType) return;

    setSubmitting(true);
    try {
      const updates = {};
      if (formData.Name !== selectedTaxType.Name) updates.Name = formData.Name.trim();
      if (formData.Description !== (selectedTaxType.Description || '')) {
        updates.Description = formData.Description.trim() || undefined;
      }
      if (formData.Rate !== (selectedTaxType.Rate || '')) {
        updates.Rate = formData.Rate ? Number(formData.Rate) : undefined;
      }
      if (formData.Category !== selectedTaxType.Category) updates.Category = formData.Category;
      if (formData.Status !== selectedTaxType.Status) updates.Status = formData.Status;
      if (formData.EffectiveDate !== (selectedTaxType.EffectiveDate || '')) {
        updates.EffectiveDate = formData.EffectiveDate || undefined;
      }

      // Remove undefined values
      Object.keys(updates).forEach((key) => {
        if (updates[key] === undefined) {
          delete updates[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        showSnackbar('No changes detected', 'info');
        setEditOpen(false);
        return;
      }

      await taxTypeService.update(selectedTaxType.Code, updates);
      showSnackbar(`Tax type ${selectedTaxType.Code} updated successfully!`, 'success');
      setEditOpen(false);
      loadTaxTypes();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update tax type';
      showSnackbar(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTaxType) return;

    setSubmitting(true);
    try {
      await taxTypeService.delete(selectedTaxType.Code);
      showSnackbar(`Tax type ${selectedTaxType.Code} deactivated successfully!`, 'success');
      setDeleteOpen(false);
      loadTaxTypes();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete tax type';
      showSnackbar(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const statusUpper = (status || '').toUpperCase();
    switch (statusUpper) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'default';
      case 'SUSPENDED':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category) => {
    const categoryUpper = (category || '').toUpperCase();
    return categoryUpper === 'DIRECT' ? 'primary' : 'secondary';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Tax Type Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage tax types used in assessments (VAT, Income Tax, etc.)
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadTaxTypes}
            sx={{
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              fontWeight: 600,
              '&:hover': {
                borderColor: theme.palette.secondary.dark,
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
              },
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              bgcolor: '#002855',
              color: 'white',
              fontWeight: 600,
              '&:hover': { bgcolor: '#001B3D' },
            }}
          >
            New Tax Type
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by code, name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="SUSPENDED">Suspended</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="DIRECT">Direct</MenuItem>
              <MenuItem value="INDIRECT">Indirect</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Tax Types Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: theme.palette.secondary.main,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
              }}
            >
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Code</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Rate</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Effective Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTaxTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Category sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No tax types found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm || statusFilter || categoryFilter
                      ? 'Try adjusting your filters'
                      : 'Create a new tax type to get started'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTaxTypes.map((taxType) => (
                <TableRow key={taxType.Code} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {taxType.Code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{taxType.Name}</Typography>
                    {taxType.Description && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {taxType.Description.length > 50
                          ? `${taxType.Description.substring(0, 50)}...`
                          : taxType.Description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={taxType.Category || 'N/A'}
                      size="small"
                      color={getCategoryColor(taxType.Category)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {taxType.Rate !== undefined && taxType.Rate !== null ? (
                      <Typography variant="body2" fontWeight={600}>
                        {Number(taxType.Rate).toFixed(1)}%
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Variable
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={taxType.Status || 'N/A'}
                      size="small"
                      color={getStatusColor(taxType.Status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {taxType.EffectiveDate
                        ? new Date(taxType.EffectiveDate).toLocaleDateString('en-TZ')
                        : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(taxType)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deactivate">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(taxType)}
                          disabled={taxType.Status === 'INACTIVE'}
                          sx={{
                            color: theme.palette.error.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            bgcolor: '#002855',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Create New Tax Type
          </Typography>
          <IconButton
            onClick={() => setCreateOpen(false)}
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name *"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                error={!!errors.Name}
                helperText={errors.Name || 'Tax type name (code will be auto-generated)'}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.Description}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                error={!!errors.Description}
                helperText={errors.Description || 'Optional description of the tax type'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Rate (%)"
                value={formData.Rate}
                onChange={(e) => setFormData({ ...formData, Rate: e.target.value })}
                error={!!errors.Rate}
                helperText={errors.Rate || 'Default tax rate (0-100)'}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={formData.Category}
                onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
              >
                <MenuItem value="DIRECT">Direct</MenuItem>
                <MenuItem value="INDIRECT">Indirect</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Effective Date"
                value={formData.EffectiveDate}
                onChange={(e) => setFormData({ ...formData, EffectiveDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitCreate}
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{
              bgcolor: '#002855',
              '&:hover': { bgcolor: '#001B3D' },
            }}
          >
            {submitting ? 'Creating...' : 'Create Tax Type'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            bgcolor: '#002855',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" component="span" sx={{ color: 'white', fontWeight: 600 }}>
            Edit Tax Type: {selectedTaxType?.Code}
          </Typography>
          <IconButton
            onClick={() => setEditOpen(false)}
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name *"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                error={!!errors.Name}
                helperText={errors.Name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.Description}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                error={!!errors.Description}
                helperText={errors.Description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Rate (%)"
                value={formData.Rate}
                onChange={(e) => setFormData({ ...formData, Rate: e.target.value })}
                error={!!errors.Rate}
                helperText={errors.Rate}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={formData.Category}
                onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
              >
                <MenuItem value="DIRECT">Direct</MenuItem>
                <MenuItem value="INDIRECT">Indirect</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Effective Date"
                value={formData.EffectiveDate}
                onChange={(e) => setFormData({ ...formData, EffectiveDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitEdit}
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{
              bgcolor: '#002855',
              '&:hover': { bgcolor: '#001B3D' },
            }}
          >
            {submitting ? 'Updating...' : 'Update Tax Type'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: theme.palette.error.main, color: 'white' }}>
          <Typography variant="h6" component="span" sx={{ color: 'white', fontWeight: 600 }}>
            Deactivate Tax Type
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to deactivate the tax type <strong>{selectedTaxType?.Code}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will set the status to INACTIVE. The tax type will remain in the system but cannot be
            used for new assessments.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <Delete />}
          >
            {submitting ? 'Deactivating...' : 'Deactivate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
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

export default TaxTypeManagement;

