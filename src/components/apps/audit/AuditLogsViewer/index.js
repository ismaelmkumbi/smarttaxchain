import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  IconButton,
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
  Tooltip,
  Avatar,
  alpha,
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh,
  Download,
  Visibility,
  Warning,
  CheckCircle,
  Cancel,
  Person,
  Computer,
  LocationOn,
  AccessTime,
  Security,
  Timeline,
} from '@mui/icons-material';
import { Fade, Grow } from '@mui/material';
import auditService from 'src/services/auditService';

// Risk level color mapping
const getRiskColor = (riskLevel, theme) => {
  const riskMap = {
    LOW: { bg: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main },
    MEDIUM: { bg: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main },
    HIGH: { bg: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main },
    CRITICAL: { bg: alpha(theme.palette.error.dark, 0.2), color: theme.palette.error.dark },
  };
  return riskMap[riskLevel] || riskMap.LOW;
};

// Status color mapping
const getStatusColor = (status, theme) => {
  const statusMap = {
    SUCCESS: { bg: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main },
    FAILED: { bg: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main },
    PENDING: { bg: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main },
  };
  return statusMap[status] || statusMap.SUCCESS;
};

// Action icon mapping
const getActionIcon = (action) => {
  const iconMap = {
    CREATE: <CheckCircle />,
    UPDATE: <Timeline />,
    DELETE: <Cancel />,
    VIEW: <Visibility />,
    EXPORT: <Download />,
    APPROVE: <CheckCircle />,
    REJECT: <Cancel />,
  };
  return iconMap[action] || <Security />;
};

const AuditLogsViewer = () => {
  const theme = useTheme();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    userId: '',
    entityType: '',
    entityId: '',
    riskLevel: '',
    status: '',
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filters.action, filters.userId, filters.entityType, filters.riskLevel, filters.status, filters.fromDate, filters.toDate]);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryFilters = {
        page: page + 1,
        pageSize: rowsPerPage,
      };

      if (filters.action) queryFilters.action = filters.action;
      if (filters.userId) queryFilters.userId = filters.userId;
      if (filters.entityType) queryFilters.entityType = filters.entityType;
      if (filters.entityId) queryFilters.entityId = filters.entityId;
      if (filters.riskLevel) queryFilters.riskLevel = filters.riskLevel;
      if (filters.status) queryFilters.status = filters.status;
      if (filters.fromDate) queryFilters.fromDate = filters.fromDate;
      if (filters.toDate) queryFilters.toDate = filters.toDate;

      const response = await auditService.getAuditLogs(queryFilters);
      console.log('🔍 AuditLogsViewer - Service Response:', response);
      console.log('📊 Logs Count:', response.logs?.length || 0);
      setLogs(response.logs || []);
      setTotalCount(response.pagination?.total || 0);
    } catch (err) {
      console.error('Error loading audit logs:', err);
      setError(err.message || 'Failed to load audit logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!filters.search) {
      loadLogs();
      return;
    }

    setLoading(true);
    try {
      const response = await auditService.searchAuditLogs({
        query: filters.search,
        filters: {
          page: page + 1,
          pageSize: rowsPerPage,
        },
      });
      setLogs(response.logs || []);
      setTotalCount(response.pagination?.total || 0);
    } catch (err) {
      console.error('Error searching audit logs:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await auditService.exportAuditLogs(filters, 'CSV');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting audit logs:', err);
      alert('Failed to export audit logs');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-TZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      action: '',
      userId: '',
      entityType: '',
      entityId: '',
      riskLevel: '',
      status: '',
      fromDate: '',
      toDate: '',
    });
    setPage(0);
  };

  if (loading && logs.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Loading audit logs...</Typography>
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
            Audit Logs Viewer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive audit trail and activity monitoring
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadLogs}
            disabled={loading}
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
            startIcon={<Download />}
            onClick={handleExport}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.secondary.main,
              fontWeight: 600,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Fade in={true} timeout={600}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Action"
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="">All Actions</MenuItem>
                <MenuItem value="CREATE">Create</MenuItem>
                <MenuItem value="UPDATE">Update</MenuItem>
                <MenuItem value="DELETE">Delete</MenuItem>
                <MenuItem value="VIEW">View</MenuItem>
                <MenuItem value="EXPORT">Export</MenuItem>
                <MenuItem value="APPROVE">Approve</MenuItem>
                <MenuItem value="REJECT">Reject</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Entity Type"
                value={filters.entityType}
                onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="TAXPAYER">Taxpayer</MenuItem>
                <MenuItem value="TAX_ASSESSMENT">Tax Assessment</MenuItem>
                <MenuItem value="ASSESSMENT">Assessment (Legacy)</MenuItem>
                <MenuItem value="PAYMENT">Payment</MenuItem>
                <MenuItem value="COMPLIANCE">Compliance</MenuItem>
                <MenuItem value="USER">User</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Risk Level"
                value={filters.riskLevel}
                onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="CRITICAL">Critical</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="SUCCESS">Success</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="From Date"
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="To Date"
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={clearFilters}
                sx={{
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  fontWeight: 600,
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Error State */}
      {error && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.error.main, 0.1) }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* Logs Table */}
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
                  bgcolor: theme.palette.secondary.main,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                }}
              >
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Timestamp</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Action</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Entity</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Risk Level</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Location</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Security sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No audit logs found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Object.values(filters).some((f) => f) ? 'Try adjusting your filters' : 'No logs available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => {
                  const riskColors = getRiskColor(log.riskLevel, theme);
                  const statusColors = getStatusColor(log.status, theme);

                  return (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDate(log.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                            <Person fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {log.user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {log.user.role} • {log.user.msp}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getActionIcon(log.action)}
                          <Typography variant="body2" fontWeight={500}>
                            {log.action}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {log.entityType?.replace(/_/g, ' ') || 'UNKNOWN'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {log.entityId || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          size="small"
                          sx={{
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 600,
                            border: `1px solid ${alpha(statusColors.color, 0.3)}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.riskLevel}
                          size="small"
                          icon={<Warning />}
                          sx={{
                            bgcolor: riskColors.bg,
                            color: riskColors.color,
                            fontWeight: 700,
                            border: `1px solid ${alpha(riskColors.color, 0.3)}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {log.location?.city || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(log)}
                            sx={{
                              color: theme.palette.secondary.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                              },
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
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

      {/* Log Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Security color="primary" />
            <Typography variant="h6">Audit Log Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLog && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  BASIC INFORMATION
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Log ID
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.id}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Timestamp
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatDate(selectedLog.timestamp)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Action
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.action}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Execution Time
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.executionTime}ms
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  USER INFORMATION
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.user.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.user.role}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  MSP
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.user.msp}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  ENTITY INFORMATION
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Entity Type
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.entityType?.replace(/_/g, ' ') || 'UNKNOWN'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Entity ID
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.entityId || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                  SECURITY INFORMATION
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  IP Address
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.ipAddress}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Device
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.deviceInfo?.platform || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">
                  Browser
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.deviceInfo?.browser || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.location?.city}, {selectedLog.location?.region}, {selectedLog.location?.country}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Blockchain TX ID
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                  {selectedLog.blockchainTxId}
                </Typography>
              </Grid>

              {selectedLog.details?.changes && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                      CHANGES
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                      <Typography variant="body2">
                        <strong>Field:</strong> {selectedLog.details.changes.field}
                      </Typography>
                      <Typography variant="body2" color="error">
                        <strong>Old Value:</strong> {selectedLog.details.changes.oldValue}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        <strong>New Value:</strong> {selectedLog.details.changes.newValue}
                      </Typography>
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditLogsViewer;

