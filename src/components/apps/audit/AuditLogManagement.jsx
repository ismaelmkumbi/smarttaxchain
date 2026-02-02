// src/components/apps/audit/AuditLogManagement.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Archive,
  Delete,
  Warning,
  CheckCircle,
  History,
  Refresh,
  Search,
  CalendarToday,
  FilterList,
} from '@mui/icons-material';
import auditService from 'src/services/auditService';
import { formatDateForAPI } from 'src/utils/reportUtils';

const AuditLogManagement = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, data: null });
  const [dryRunResult, setDryRunResult] = useState(null);

  // Archive state
  const [archiveFilters, setArchiveFilters] = useState({
    logType: 'normal',
    fromDate: '',
    toDate: '',
    entityType: '',
    action: '',
    status: '',
    dryRun: false,
  });

  // Delete state
  const [deleteFilters, setDeleteFilters] = useState({
    logType: 'normal',
    fromDate: '',
    toDate: '',
    entityType: '',
    action: '',
    status: '',
    confirm: false,
    dryRun: false,
  });

  // Archived logs view
  const [archivedLogs, setArchivedLogs] = useState([]);
  const [archivedPage, setArchivedPage] = useState(0);
  const [archivedRowsPerPage, setArchivedRowsPerPage] = useState(25);
  const [archivedTotal, setArchivedTotal] = useState(0);
  const [archivedFilters, setArchivedFilters] = useState({
    logType: '',
    fromDate: '',
    toDate: '',
    archivedBy: '',
  });

  const handleArchiveDryRun = async () => {
    setLoading(true);
    setError(null);
    setDryRunResult(null);

    try {
      const filters = {
        ...(archiveFilters.fromDate && { fromDate: formatDateForAPI(new Date(archiveFilters.fromDate)) }),
        ...(archiveFilters.toDate && { toDate: formatDateForAPI(new Date(archiveFilters.toDate)) }),
        ...(archiveFilters.entityType && { entityType: archiveFilters.entityType }),
        ...(archiveFilters.action && { action: archiveFilters.action }),
        ...(archiveFilters.status && { status: archiveFilters.status }),
      };

      const result = await auditService.archiveLogs({
        logType: archiveFilters.logType,
        filters,
        dryRun: true,
      });

      setDryRunResult(result);
      setSuccess(`Dry run completed: ${result.wouldArchive || 0} logs would be archived`);
    } catch (err) {
      setError(err.message || 'Failed to perform dry run');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const filters = {
        ...(archiveFilters.fromDate && { fromDate: formatDateForAPI(new Date(archiveFilters.fromDate)) }),
        ...(archiveFilters.toDate && { toDate: formatDateForAPI(new Date(archiveFilters.toDate)) }),
        ...(archiveFilters.entityType && { entityType: archiveFilters.entityType }),
        ...(archiveFilters.action && { action: archiveFilters.action }),
        ...(archiveFilters.status && { status: archiveFilters.status }),
      };

      const result = await auditService.archiveLogs({
        logType: archiveFilters.logType,
        filters,
        dryRun: false,
      });

      setSuccess(result.message || `Successfully archived ${result.archived || 0} logs`);
      setConfirmDialog({ open: false, action: null, data: null });
      setDryRunResult(null);
    } catch (err) {
      setError(err.message || 'Failed to archive logs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDryRun = async () => {
    setLoading(true);
    setError(null);
    setDryRunResult(null);

    try {
      const filters = {
        ...(deleteFilters.fromDate && { fromDate: formatDateForAPI(new Date(deleteFilters.fromDate)) }),
        ...(deleteFilters.toDate && { toDate: formatDateForAPI(new Date(deleteFilters.toDate)) }),
        ...(deleteFilters.entityType && { entityType: deleteFilters.entityType }),
        ...(deleteFilters.action && { action: deleteFilters.action }),
        ...(deleteFilters.status && { status: deleteFilters.status }),
      };

      const result = await auditService.deleteLogs({
        logType: deleteFilters.logType,
        filters,
        confirm: false,
        dryRun: true,
      });

      setDryRunResult(result);
      setSuccess(`Dry run completed: ${result.wouldDelete || 0} logs would be deleted`);
    } catch (err) {
      setError(err.message || 'Failed to perform dry run');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const filters = {
        ...(deleteFilters.fromDate && { fromDate: formatDateForAPI(new Date(deleteFilters.fromDate)) }),
        ...(deleteFilters.toDate && { toDate: formatDateForAPI(new Date(deleteFilters.toDate)) }),
        ...(deleteFilters.entityType && { entityType: deleteFilters.entityType }),
        ...(deleteFilters.action && { action: deleteFilters.action }),
        ...(deleteFilters.status && { status: deleteFilters.status }),
      };

      const result = await auditService.deleteLogs({
        logType: deleteFilters.logType,
        filters,
        confirm: true,
        dryRun: false,
      });

      setSuccess(result.message || `Successfully deleted ${result.deleted || 0} logs`);
      setConfirmDialog({ open: false, action: null, data: null });
      setDryRunResult(null);
    } catch (err) {
      setError(err.message || 'Failed to delete logs');
    } finally {
      setLoading(false);
    }
  };

  const loadArchivedLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        page: archivedPage + 1,
        pageSize: archivedRowsPerPage,
        ...(archivedFilters.logType && { logType: archivedFilters.logType }),
        ...(archivedFilters.fromDate && { fromDate: formatDateForAPI(new Date(archivedFilters.fromDate)) }),
        ...(archivedFilters.toDate && { toDate: formatDateForAPI(new Date(archivedFilters.toDate)) }),
        ...(archivedFilters.archivedBy && { archivedBy: archivedFilters.archivedBy }),
      };

      const result = await auditService.getArchivedLogs(filters);
      setArchivedLogs(result.data || []);
      setArchivedTotal(result.pagination?.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load archived logs');
      setArchivedLogs([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadArchivedLogs();
  }, [archivedPage, archivedRowsPerPage, archivedFilters.logType, archivedFilters.fromDate, archivedFilters.toDate, archivedFilters.archivedBy]);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {dryRunResult && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={() => setDryRunResult(null)}>
          <Typography variant="subtitle2" gutterBottom>
            Dry Run Result
          </Typography>
          <Typography variant="body2">
            {dryRunResult.wouldArchive !== undefined
              ? `${dryRunResult.wouldArchive} logs would be archived`
              : `${dryRunResult.wouldDelete} logs would be deleted`}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Archive Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Archive color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Archive Logs
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" paragraph>
                Archive logs to a separate table for long-term storage. Archived logs can be recovered.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Log Type</InputLabel>
                  <Select
                    value={archiveFilters.logType}
                    onChange={(e) => setArchiveFilters({ ...archiveFilters, logType: e.target.value })}
                    label="Log Type"
                  >
                    <MenuItem value="normal">Normal Logs</MenuItem>
                    <MenuItem value="high-risk">High-Risk Logs</MenuItem>
                  </Select>
                </FormControl>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="From Date"
                      value={archiveFilters.fromDate}
                      onChange={(e) => setArchiveFilters({ ...archiveFilters, fromDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="To Date"
                      value={archiveFilters.toDate}
                      onChange={(e) => setArchiveFilters({ ...archiveFilters, toDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <FormControl fullWidth>
                  <InputLabel>Entity Type</InputLabel>
                  <Select
                    value={archiveFilters.entityType}
                    onChange={(e) => setArchiveFilters({ ...archiveFilters, entityType: e.target.value })}
                    label="Entity Type"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="TAXPAYER">Taxpayer</MenuItem>
                    <MenuItem value="TAX_ASSESSMENT">Tax Assessment</MenuItem>
                    <MenuItem value="PAYMENT">Payment</MenuItem>
                    <MenuItem value="COMPLIANCE">Compliance</MenuItem>
                    <MenuItem value="USER">User</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={archiveFilters.action}
                    onChange={(e) => setArchiveFilters({ ...archiveFilters, action: e.target.value })}
                    label="Action"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="CREATE">Create</MenuItem>
                    <MenuItem value="UPDATE">Update</MenuItem>
                    <MenuItem value="DELETE">Delete</MenuItem>
                    <MenuItem value="READ">Read</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={archiveFilters.status}
                    onChange={(e) => setArchiveFilters({ ...archiveFilters, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="SUCCESS">Success</MenuItem>
                    <MenuItem value="FAILED">Failed</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                    onClick={handleArchiveDryRun}
                    disabled={loading}
                    fullWidth
                  >
                    Dry Run
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Archive />}
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        action: 'archive',
                        data: archiveFilters,
                      })
                    }
                    disabled={loading}
                    fullWidth
                    sx={{
                      bgcolor: '#002855',
                      '&:hover': { bgcolor: '#001B3D' },
                    }}
                  >
                    Archive
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Delete Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Delete color="error" />
                <Typography variant="h6" fontWeight={600}>
                  Delete Logs
                </Typography>
              </Stack>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight={600}>
                  ⚠️ Permanent Deletion
                </Typography>
                <Typography variant="caption">
                  This action cannot be undone! Consider archiving instead of deleting.
                </Typography>
              </Alert>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Log Type</InputLabel>
                  <Select
                    value={deleteFilters.logType}
                    onChange={(e) => setDeleteFilters({ ...deleteFilters, logType: e.target.value })}
                    label="Log Type"
                  >
                    <MenuItem value="normal">Normal Logs</MenuItem>
                    <MenuItem value="high-risk">High-Risk Logs</MenuItem>
                  </Select>
                </FormControl>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="From Date"
                      value={deleteFilters.fromDate}
                      onChange={(e) => setDeleteFilters({ ...deleteFilters, fromDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="To Date"
                      value={deleteFilters.toDate}
                      onChange={(e) => setDeleteFilters({ ...deleteFilters, toDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <FormControl fullWidth>
                  <InputLabel>Entity Type</InputLabel>
                  <Select
                    value={deleteFilters.entityType}
                    onChange={(e) => setDeleteFilters({ ...deleteFilters, entityType: e.target.value })}
                    label="Entity Type"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="TAXPAYER">Taxpayer</MenuItem>
                    <MenuItem value="TAX_ASSESSMENT">Tax Assessment</MenuItem>
                    <MenuItem value="PAYMENT">Payment</MenuItem>
                    <MenuItem value="COMPLIANCE">Compliance</MenuItem>
                    <MenuItem value="USER">User</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={deleteFilters.action}
                    onChange={(e) => setDeleteFilters({ ...deleteFilters, action: e.target.value })}
                    label="Action"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="CREATE">Create</MenuItem>
                    <MenuItem value="UPDATE">Update</MenuItem>
                    <MenuItem value="DELETE">Delete</MenuItem>
                    <MenuItem value="READ">Read</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={deleteFilters.status}
                    onChange={(e) => setDeleteFilters({ ...deleteFilters, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="SUCCESS">Success</MenuItem>
                    <MenuItem value="FAILED">Failed</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={deleteFilters.confirm}
                      onChange={(e) => setDeleteFilters({ ...deleteFilters, confirm: e.target.checked })}
                      color="error"
                    />
                  }
                  label="I understand this action cannot be undone"
                />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                    onClick={handleDeleteDryRun}
                    disabled={loading}
                    fullWidth
                  >
                    Dry Run
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        action: 'delete',
                        data: deleteFilters,
                      })
                    }
                    disabled={loading || !deleteFilters.confirm}
                    fullWidth
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Archived Logs View */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" mb={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <History color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Archived Logs
                  </Typography>
                </Stack>
                <IconButton onClick={loadArchivedLogs} size="small">
                  <Refresh />
                </IconButton>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Log Type</InputLabel>
                    <Select
                      value={archivedFilters.logType}
                      onChange={(e) => setArchivedFilters({ ...archivedFilters, logType: e.target.value })}
                      label="Log Type"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="high-risk">High-Risk</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="From Date"
                    value={archivedFilters.fromDate}
                    onChange={(e) => setArchivedFilters({ ...archivedFilters, fromDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="To Date"
                    value={archivedFilters.toDate}
                    onChange={(e) => setArchivedFilters({ ...archivedFilters, toDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Archived By"
                    value={archivedFilters.archivedBy}
                    onChange={(e) => setArchivedFilters({ ...archivedFilters, archivedBy: e.target.value })}
                    placeholder="Username"
                  />
                </Grid>
              </Grid>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : archivedLogs.length === 0 ? (
                <Alert severity="info">No archived logs found</Alert>
              ) : (
                <>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                          <TableCell>Audit ID</TableCell>
                          <TableCell>Action</TableCell>
                          <TableCell>Entity Type</TableCell>
                          <TableCell>Entity ID</TableCell>
                          <TableCell>Risk Level</TableCell>
                          <TableCell>Archived At</TableCell>
                          <TableCell>Archived By</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {archivedLogs.map((log) => (
                          <TableRow key={log.id || log.original_id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                {log.audit_id || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={log.action || 'N/A'} size="small" />
                            </TableCell>
                            <TableCell>{log.entity_type || 'N/A'}</TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {log.entity_id || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={log.risk_level || 'N/A'}
                                size="small"
                                color={
                                  log.risk_level === 'HIGH' || log.risk_level === 'CRITICAL'
                                    ? 'error'
                                    : log.risk_level === 'MEDIUM'
                                    ? 'warning'
                                    : 'success'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {log.archived_at
                                ? new Date(log.archived_at).toLocaleString()
                                : 'N/A'}
                            </TableCell>
                            <TableCell>{log.archived_by || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={archivedTotal}
                    page={archivedPage}
                    onPageChange={(e, newPage) => setArchivedPage(newPage)}
                    rowsPerPage={archivedRowsPerPage}
                    onRowsPerPageChange={(e) => {
                      setArchivedRowsPerPage(parseInt(e.target.value, 10));
                      setArchivedPage(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null, data: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            {confirmDialog.action === 'delete' ? (
              <Delete color="error" />
            ) : (
              <Archive color="primary" />
            )}
            <Typography variant="h6" component="span">
              {confirmDialog.action === 'delete' ? 'Confirm Permanent Deletion' : 'Confirm Archive'}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {confirmDialog.action === 'delete' ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                ⚠️ This action cannot be undone!
              </Typography>
              <Typography variant="caption">
                You are about to permanently delete logs. This action is irreversible. Consider archiving instead.
              </Typography>
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Logs will be moved to the archive table. They can be recovered later if needed.
              </Typography>
            </Alert>
          )}
          <Typography variant="body2" paragraph>
            <strong>Log Type:</strong> {confirmDialog.data?.logType || 'N/A'}
          </Typography>
          {confirmDialog.data?.fromDate && (
            <Typography variant="body2" paragraph>
              <strong>From Date:</strong> {confirmDialog.data.fromDate}
            </Typography>
          )}
          {confirmDialog.data?.toDate && (
            <Typography variant="body2" paragraph>
              <strong>To Date:</strong> {confirmDialog.data.toDate}
            </Typography>
          )}
          {confirmDialog.data?.entityType && (
            <Typography variant="body2" paragraph>
              <strong>Entity Type:</strong> {confirmDialog.data.entityType}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: null, data: null })}>
            Cancel
          </Button>
          <Button
            onClick={confirmDialog.action === 'delete' ? handleDelete : handleArchive}
            variant="contained"
            color={confirmDialog.action === 'delete' ? 'error' : 'primary'}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={
              confirmDialog.action === 'delete'
                ? {}
                : {
                    bgcolor: '#002855',
                    '&:hover': { bgcolor: '#001B3D' },
                  }
            }
          >
            {loading
              ? 'Processing...'
              : confirmDialog.action === 'delete'
              ? 'Delete Permanently'
              : 'Archive'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditLogManagement;

