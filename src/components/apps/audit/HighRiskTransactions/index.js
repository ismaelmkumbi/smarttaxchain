import { useState, useEffect } from 'react';
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
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Refresh,
  Warning,
  CheckCircle,
  Cancel,
  Visibility,
  Person,
  Security,
  Gavel,
  Close,
  Info,
  Block,
  VerifiedUser,
  LocationOn,
  Computer,
  Flag,
  Timeline as TimelineIcon,
  ExpandMore,
} from '@mui/icons-material';
import { Fade } from '@mui/material';
import auditService from 'src/services/auditService';
import { useNavigate } from 'react-router-dom';

const HighRiskTransactions = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDetailsTransaction, setSelectedDetailsTransaction] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    riskLevel: 'HIGH',
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filters.riskLevel, filters.fromDate, filters.toDate]);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryFilters = {
        page: page + 1,
        pageSize: rowsPerPage,
        riskLevel: filters.riskLevel,
      };

      if (filters.fromDate) queryFilters.fromDate = filters.fromDate;
      if (filters.toDate) queryFilters.toDate = filters.toDate;

      const response = await auditService.getHighRiskTransactions(queryFilters);
      console.log('🔍 HighRiskTransactions - Service Response:', response);
      console.log('📊 Transactions:', response.transactions);
      console.log('📄 Pagination:', response.pagination);
      
      const transactions = response.transactions || [];
      const total = response.pagination?.total || 0;
      
      console.log(`✅ Setting ${transactions.length} transactions, total: ${total}`);
      
      setTransactions(transactions);
      setTotalCount(total);
    } catch (err) {
      console.error('Error loading high-risk transactions:', err);
      setError(err.message || 'Failed to load high-risk transactions');
      setTransactions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (transaction, action) => {
    setSelectedTransaction(transaction);
    setReviewAction(action);
    setReviewOpen(true);
  };

  const handleViewDetails = (transaction) => {
    setSelectedDetailsTransaction(transaction);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedDetailsTransaction(null);
  };

  const handleReviewSubmit = async () => {
    // In a real implementation, this would call an API to update the transaction status
    console.log(`Review action: ${reviewAction} for transaction: ${selectedTransaction.id}`);
    setReviewOpen(false);
    setSelectedTransaction(null);
    setReviewAction('');
    // Reload transactions
    loadTransactions();
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

  const getRiskColor = (riskLevel) => {
    if (riskLevel === 'CRITICAL') {
      return { bg: alpha(theme.palette.error.dark, 0.2), color: theme.palette.error.dark };
    }
    return { bg: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main };
  };

  if (loading && transactions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Loading high-risk transactions...</Typography>
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
            High-Risk Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and review transactions requiring attention
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadTransactions}
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
      </Box>

      {/* Alert */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600}>
          {totalCount} high-risk transaction{totalCount !== 1 ? 's' : ''} require{totalCount === 1 ? 's' : ''} review
        </Typography>
      </Alert>

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
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Risk Level"
                value={filters.riskLevel}
                onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="CRITICAL">Critical</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
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
          </Grid>
        </Paper>
      </Fade>

      {/* Error State */}
      {error && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: alpha(theme.palette.error.main, 0.1) }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* Transactions Table */}
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
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Risk Level</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Security sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No high-risk transactions found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      All transactions are within acceptable risk levels
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => {
                  const riskColors = getRiskColor(transaction.riskLevel);

                  return (
                    <TableRow key={transaction.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDate(transaction.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                            <Person fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {transaction.user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.user.role}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {transaction.action}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {transaction.entityType}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {transaction.entityId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.riskLevel}
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
                        <Chip
                          label={transaction.status}
                          size="small"
                          sx={{
                            bgcolor: transaction.status === 'SUCCESS' 
                              ? alpha(theme.palette.success.main, 0.1) 
                              : alpha(theme.palette.error.main, 0.1),
                            color: transaction.status === 'SUCCESS' 
                              ? theme.palette.success.main 
                              : theme.palette.error.main,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Risk Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(transaction)}
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
                          <Tooltip title="View Full Audit Trail">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/apps/audit/trail/${transaction.entityType}/${transaction.entityId}`)}
                              sx={{
                                color: theme.palette.info.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                },
                              }}
                            >
                              <TimelineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              onClick={() => handleReview(transaction, 'APPROVE')}
                              sx={{
                                color: theme.palette.success.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                },
                              }}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              size="small"
                              onClick={() => handleReview(transaction, 'REJECT')}
                              sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                },
                              }}
                            >
                              <Cancel fontSize="small" />
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

      {/* Risk Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: theme.palette.error.main,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Warning sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" component="span" fontWeight={700}>
                High-Risk Transaction Details
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Risk Analysis & Compliance Review
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCloseDetails}
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
        <DialogContent dividers sx={{ p: 3, maxHeight: 'calc(90vh - 140px)', overflow: 'auto' }}>
          {selectedDetailsTransaction && (
            <Box>
              {/* Risk Summary */}
              <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.error.main, 0.05), border: `1px solid ${alpha(theme.palette.error.main, 0.2)}` }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Flag color="error" />
                        <Typography variant="h6" fontWeight={700}>
                          Risk Level
                        </Typography>
                      </Box>
                      <Chip
                        label={selectedDetailsTransaction.riskLevel || 'HIGH'}
                        color="error"
                        size="large"
                        icon={<Warning />}
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          py: 2.5,
                          px: 1,
                        }}
                      />
                      {selectedDetailsTransaction.details?.compliance_flags && selectedDetailsTransaction.details.compliance_flags.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Compliance Flags:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {[...new Set(selectedDetailsTransaction.details.compliance_flags)].map((flag, idx) => (
                              <Chip
                                key={idx}
                                label={flag}
                                size="small"
                                color="warning"
                                sx={{ fontWeight: 600 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Info color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                          Transaction Info
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Action</Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {selectedDetailsTransaction.action}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Status</Typography>
                          <Chip
                            label={selectedDetailsTransaction.status}
                            size="small"
                            color={selectedDetailsTransaction.status === 'SUCCESS' ? 'success' : 'error'}
                            sx={{ mt: 0.5 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Entity Type</Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {selectedDetailsTransaction.entityType}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Entity ID</Typography>
                          <Typography variant="body1" fontWeight={600} sx={{ wordBreak: 'break-all' }}>
                            {selectedDetailsTransaction.entityId}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Timestamp</Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {formatDate(selectedDetailsTransaction.timestamp)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Changes Made */}
              {selectedDetailsTransaction.details?.changes && selectedDetailsTransaction.details.changes.length > 0 && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Block color="primary" />
                      <Typography variant="h6" fontWeight={700}>
                        Changes Made
                      </Typography>
                      <Chip 
                        label={`${selectedDetailsTransaction.details.changes.filter(c => c.action === 'MODIFIED' || c.action === 'ADDED').length} Actual Changes`}
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Note:</strong> Fields marked as "REMOVED" are not included in the update payload but remain in the database. 
                        Only fields with "MODIFIED" or "ADDED" actions represent actual changes.
                      </Typography>
                    </Alert>
                    
                    {/* Show Actual Changes First */}
                    {selectedDetailsTransaction.details.changes.filter(c => c.action === 'MODIFIED' || c.action === 'ADDED').length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: theme.palette.primary.main }}>
                          Actual Changes:
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Field</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Old Value</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>New Value</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedDetailsTransaction.details.changes
                                .filter(c => c.action === 'MODIFIED' || c.action === 'ADDED')
                                .map((change, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                      {change.field}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={change.action}
                                      size="small"
                                      color={change.action === 'MODIFIED' ? 'warning' : 'success'}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ 
                                      color: 'text.secondary',
                                      fontFamily: 'monospace',
                                      fontSize: '0.75rem',
                                      wordBreak: 'break-all',
                                    }}>
                                      {change.oldValue !== null && change.oldValue !== undefined 
                                        ? (typeof change.oldValue === 'object' ? JSON.stringify(change.oldValue).substring(0, 100) + '...' : String(change.oldValue))
                                        : 'N/A'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ 
                                      color: 'text.primary',
                                      fontFamily: 'monospace',
                                      fontSize: '0.75rem',
                                      wordBreak: 'break-all',
                                      fontWeight: 600,
                                    }}>
                                      {change.newValue !== null && change.newValue !== undefined 
                                        ? (typeof change.newValue === 'object' ? JSON.stringify(change.newValue).substring(0, 100) + '...' : String(change.newValue))
                                        : 'N/A'}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}

                    {/* Show Removed Fields (Collapsed by default) */}
                    {selectedDetailsTransaction.details.changes.filter(c => c.action === 'REMOVED').length > 0 && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Fields Not Included in Update ({selectedDetailsTransaction.details.changes.filter(c => c.action === 'REMOVED').length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                            These fields were not included in the update payload but remain unchanged in the database.
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 700 }}>Field</TableCell>
                                  <TableCell sx={{ fontWeight: 700 }}>Previous Value</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedDetailsTransaction.details.changes
                                  .filter(c => c.action === 'REMOVED')
                                  .slice(0, 20)
                                  .map((change, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      <Typography variant="body2" fontWeight={600}>
                                        {change.field}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2" sx={{ 
                                        color: 'text.secondary',
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem',
                                        wordBreak: 'break-all',
                                      }}>
                                        {change.oldValue !== null && change.oldValue !== undefined 
                                          ? (typeof change.oldValue === 'object' 
                                              ? JSON.stringify(change.oldValue).substring(0, 150) + (JSON.stringify(change.oldValue).length > 150 ? '...' : '')
                                              : String(change.oldValue))
                                          : 'N/A'}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {selectedDetailsTransaction.details.changes.filter(c => c.action === 'REMOVED').length > 20 && (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                Showing first 20 of {selectedDetailsTransaction.details.changes.filter(c => c.action === 'REMOVED').length} fields
                              </Typography>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Before/After State */}
              {(selectedDetailsTransaction.details?.before_state || selectedDetailsTransaction.details?.after_state) && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      State Comparison
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Note:</strong> "Update Payload" shows only the fields included in the update request. 
                        The complete updated record in the database includes all fields from "Before Update" plus the updated values.
                      </Typography>
                    </Alert>
                    <Grid container spacing={2}>
                      {selectedDetailsTransaction.details.before_state && (
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: theme.palette.info.main }}>
                                Before Update (Complete Record)
                              </Typography>
                              <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), maxHeight: 300, overflow: 'auto' }}>
                                <pre style={{ 
                                  margin: 0, 
                                  fontSize: '0.75rem',
                                  fontFamily: 'monospace',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                }}>
                                  {JSON.stringify(selectedDetailsTransaction.details.before_state, null, 2)}
                                </pre>
                              </Paper>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                      {selectedDetailsTransaction.details.after_state && (
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: theme.palette.warning.main }}>
                                Update Payload (Partial - Only Changed Fields)
                              </Typography>
                              <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), maxHeight: 300, overflow: 'auto' }}>
                                <pre style={{ 
                                  margin: 0, 
                                  fontSize: '0.75rem',
                                  fontFamily: 'monospace',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                }}>
                                  {JSON.stringify(selectedDetailsTransaction.details.after_state, null, 2)}
                                </pre>
                              </Paper>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                    </Grid>
                    
                    {/* Show Computed After State */}
                    {selectedDetailsTransaction.details.before_state && selectedDetailsTransaction.details.after_state && (
                      <Box sx={{ mt: 2 }}>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Computed Complete State (After Update)
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                              This shows what the complete record looks like after applying the update (Before State + Update Payload).
                            </Typography>
                            <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), maxHeight: 300, overflow: 'auto' }}>
                              <pre style={{ 
                                margin: 0, 
                                fontSize: '0.75rem',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                              }}>
                                {JSON.stringify({
                                  ...selectedDetailsTransaction.details.before_state,
                                  ...selectedDetailsTransaction.details.after_state,
                                  UpdatedAt: new Date().toISOString(),
                                }, null, 2)}
                              </pre>
                            </Paper>
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Blockchain & Device Info */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <VerifiedUser color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                          Blockchain Verification
                        </Typography>
                      </Box>
                      {selectedDetailsTransaction.details?.blockchain_verified !== undefined && (
                        <Box sx={{ mb: 2 }}>
                          <Chip
                            label={selectedDetailsTransaction.details.blockchain_verified ? 'Verified' : 'Not Verified'}
                            color={selectedDetailsTransaction.details.blockchain_verified ? 'success' : 'warning'}
                            icon={selectedDetailsTransaction.details.blockchain_verified ? <CheckCircle /> : <Warning />}
                            sx={{ mb: 1 }}
                          />
                        </Box>
                      )}
                      {selectedDetailsTransaction.details?.blockchain_data && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Channel:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedDetailsTransaction.details.blockchain_data.channel_id || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Chaincode:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedDetailsTransaction.details.blockchain_data.chaincode_name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Transaction ID:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {selectedDetailsTransaction.details.blockchain_data.transaction_id || 'N/A'}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Computer color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                          Device & Location
                        </Typography>
                      </Box>
                      {selectedDetailsTransaction.details?.device_info && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">Device:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedDetailsTransaction.details.device_info.device || 'N/A'} ({selectedDetailsTransaction.details.device_info.os || 'Unknown OS'})
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Browser:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedDetailsTransaction.details.device_info.browser || 'Unknown'} {selectedDetailsTransaction.details.device_info.browserVersion || ''}
                          </Typography>
                        </Box>
                      )}
                      {selectedDetailsTransaction.details?.location && (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOn fontSize="small" />
                            <Typography variant="subtitle2" fontWeight={600}>
                              Location
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {selectedDetailsTransaction.details.location.country || 'N/A'}
                            {selectedDetailsTransaction.details.location.region && `, ${selectedDetailsTransaction.details.location.region}`}
                            {selectedDetailsTransaction.details.location.city && `, ${selectedDetailsTransaction.details.location.city}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            IP Address: {selectedDetailsTransaction.ipAddress || 'N/A'}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* User Information */}
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                      User Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">User ID</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedDetailsTransaction.user?.id || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">Name</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedDetailsTransaction.user?.name || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary">Role</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedDetailsTransaction.user?.role || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
          <Button onClick={handleCloseDetails} variant="outlined">
            Close
          </Button>
          <Button
            onClick={() => {
              handleCloseDetails();
              if (selectedDetailsTransaction) {
                navigate(`/apps/audit/trail/${selectedDetailsTransaction.entityType}/${selectedDetailsTransaction.entityId}`);
              }
            }}
            variant="contained"
            startIcon={<TimelineIcon />}
          >
            View Full Audit Trail
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Gavel color="primary" />
            <Typography variant="h6" component="span">
              {reviewAction === 'APPROVE' ? 'Approve' : 'Reject'} Transaction
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedTransaction && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Are you sure you want to {reviewAction.toLowerCase()} this transaction?
              </Typography>
              <Paper sx={{ p: 2, mt: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                <Typography variant="caption" color="text.secondary">
                  Transaction ID
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedTransaction.id}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Action: {selectedTransaction.action} • Entity: {selectedTransaction.entityType}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            color={reviewAction === 'APPROVE' ? 'success' : 'error'}
          >
            {reviewAction === 'APPROVE' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HighRiskTransactions;

