import { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Button,
  Grid,
  Chip,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  InputAdornment,
  MenuItem,
  Select,
  Modal,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  Pagination,
  FormControlLabel,
  Switch,
  Alert,
  Tooltip,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Warning,
  Payment,
  Receipt,
  PendingActions,
  Download,
  AccountBalanceWallet,
  AccountBalance,
  CheckCircle,
  Schedule,
  MonetizationOn,
  Close,
  Refresh,
  FilterAlt,
  Edit,
  Save,
  Clear,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { PaymentConfirmationModal } from './modal/PaymentConfirmationModal';
import { PaymentHistoryDialog } from './PaymentHistoryDialog';
import { EmptyState } from './sub/EmptyState';
import { StatsCard } from './sub/StatsCard';
import { PaymentRow } from './sub/PaymentRow';
import { mockAssessments, mockTaxpayer } from './data/paymentData';
import paymentService from 'src/services/paymentService';

// Helper function to get status colors

const PaymentDashboard = ({ assessments, taxpayer, onPaymentConfirm, onRefresh }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tinFilter, setTinFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editPayment, setEditPayment] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editLoading, setEditLoading] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [paymentHistoryDialog, setPaymentHistoryDialog] = useState({ open: false, assessmentId: null, payments: [], loading: false });

  // Memoized derived data
  const { regions, tins, filteredPayments, paginatedPayments, totalPages, paymentMetrics } =
    useMemo(() => {
      const uniqueRegions = [...new Set(assessments.map((a) => a.region))].sort();
      const uniqueTins = [...new Set(assessments.map((a) => a.taxpayerTin))].sort();

      const query = searchQuery.toLowerCase();
      const filtered = assessments.filter((payment) => {
        const matchesSearch =
          payment.taxpayerTin?.toLowerCase().includes(query) ||
          payment.taxpayerName?.toLowerCase().includes(query) ||
          payment.referenceNumber?.toLowerCase().includes(query);
        const matchesRegion = regionFilter ? payment.region === regionFilter : true;
        const matchesStatus = statusFilter ? payment.status === statusFilter : true;
        const matchesTin = tinFilter ? payment.taxpayerTin === tinFilter : true;

        return matchesSearch && matchesRegion && matchesStatus && matchesTin;
      });

      const start = (currentPage - 1) * pageSize;
      const paginated = filtered.slice(start, start + pageSize);

      const metrics = {
        totalPending: filtered.filter(
          (p) => p.status === 'Pending' || p.status === 'Partially paid' || p.status === 'Overdue',
        ).length,
        totalOverdue: filtered.filter((p) => p.status === 'Overdue').length,
        totalAmountPending: filtered
          .filter((p) => p.status !== 'Paid')
          .reduce((sum, p) => sum + (p.remainingBalance ?? p.amount ?? 0), 0),
        totalAmountCompleted: filtered.reduce(
          (sum, p) => sum + (Number(p.totalPaid) || 0),
          0,
        ),
      };

      return {
        regions: uniqueRegions,
        tins: uniqueTins,
        filteredPayments: filtered,
        paginatedPayments: paginated,
        totalPages: Math.ceil(filtered.length / pageSize),
        paymentMetrics: metrics,
      };
    }, [assessments, searchQuery, regionFilter, statusFilter, tinFilter, currentPage, pageSize]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setRegionFilter('');
    setStatusFilter('');
    setTinFilter('');
    setCurrentPage(1);
  };

  const handlePay = (payment) => {
    if (!payment) return;
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const handleViewPaymentDetails = async (payment) => {
    if (!payment || !payment.assessmentId) return;

    setPaymentHistoryDialog({ open: true, assessmentId: payment.assessmentId, payments: [], loading: true });

    try {
      const result = await paymentService.getPaymentHistory(payment.assessmentId);
      const payments =
        result?.payments ||
        result?.payment_history ||
        result?.data?.payments ||
        result?.data?.payment_history ||
        result?.payment_entries ||
        [];
      setPaymentHistoryDialog({ open: true, assessmentId: payment.assessmentId, payments, loading: false });
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setPaymentHistoryDialog({ open: true, assessmentId: payment.assessmentId, payments: [], loading: false });
    }
  };

  const handleEditPayment = (payment) => {
    setEditPayment({ ...payment });
  };

  const handleCancelEdit = () => {
    setEditPayment(null);
  };

  const handleSaveEdit = async () => {
    setEditLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      // In a real app, you would call an API here
      // await updatePayment(editPayment);
      setEditPayment(null);
    } catch (error) {
      console.error('Error saving payment:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Partially paid':
        return 'info';
      case 'Overdue':
        return 'error';
      case 'Paid':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1800,
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Tax Payment Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track tax payments with blockchain verification
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={onRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Chip
            label={`Wallet Balance: ${formatCurrency(taxpayer.balance)}`}
            color="primary"
            variant="outlined"
            sx={{
              px: 2,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          />
        </Box>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          {
            icon: <Schedule fontSize="large" />,
            title: 'Pending Payments',
            value: paymentMetrics.totalPending,
            color: 'warning.main',
            trend: null,
          },
          {
            icon: <Warning fontSize="large" />,
            title: 'Overdue Payments',
            value: paymentMetrics.totalOverdue,
            color: 'error.main',
            trend: null,
          },
          {
            icon: <MonetizationOn fontSize="large" />,
            title: 'Pending Amount',
            value: formatCurrency(paymentMetrics.totalAmountPending),
            color: 'warning.main',
            trend: null,
          },
          {
            icon: <CheckCircle fontSize="large" />,
            title: 'Paid This Year',
            value: formatCurrency(paymentMetrics.totalAmountCompleted),
            color: 'success.main',
            trend: null,
          },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    backgroundColor:
                      theme.palette.mode === 'light' ? `${metric.color}20` : `${metric.color}10`,
                    p: 1,
                    borderRadius: '50%',
                    mr: 2,
                    display: 'flex',
                    color: metric.color,
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {metric.title}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mt: 1,
                  color: metric.color,
                }}
              >
                {metric.value}
              </Typography>
              {metric.trend && (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: 'flex',
                    alignItems: 'center',
                    color: metric.trend > 0 ? 'success.main' : 'error.main',
                  }}
                >
                  {metric.trend > 0 ? '↑' : '↓'} {Math.abs(metric.trend)}% from last month
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filters Section */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          boxShadow: theme.shadows[1],
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: filtersExpanded ? 2 : 0,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Payment Records
          </Typography>
          <Box>
            <Tooltip title={filtersExpanded ? 'Hide filters' : 'Show filters'}>
              <IconButton
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                color={filtersExpanded ? 'primary' : 'default'}
                size="small"
              >
                <FilterAlt />
              </IconButton>
            </Tooltip>
            {(searchQuery || regionFilter || statusFilter || tinFilter) && (
              <Tooltip title="Clear all filters">
                <IconButton onClick={handleClearFilters} color="error" size="small" sx={{ ml: 1 }}>
                  <Clear />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {filtersExpanded && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search by TIN, name or reference..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Select
                  fullWidth
                  value={tinFilter}
                  onChange={(e) => {
                    setTinFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  displayEmpty
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">All TINs</MenuItem>
                  {tins.map((tin) => (
                    <MenuItem key={tin} value={tin}>
                      {tin}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Select
                  fullWidth
                  value={regionFilter}
                  onChange={(e) => {
                    setRegionFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  displayEmpty
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">All Regions</MenuItem>
                  {regions.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Select
                  fullWidth
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  displayEmpty
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {['Pending', 'Partially paid', 'Paid', 'Overdue'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Select
                  fullWidth
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value={5}>5 per page</MenuItem>
                  <MenuItem value={10}>10 per page</MenuItem>
                  <MenuItem value={25}>25 per page</MenuItem>
                  <MenuItem value={50}>50 per page</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>

      {/* Main Content */}
      {filteredPayments.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: 300,
          }}
        >
          <Box sx={{ fontSize: 72, color: 'text.disabled', mb: 2 }}>
            <Search fontSize="inherit" />
          </Box>
          <Typography variant="h6" gutterBottom>
            No payments found
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 500, mb: 3 }}>
            {searchQuery || regionFilter || statusFilter || tinFilter
              ? 'Try adjusting your search or filter criteria'
              : 'There are currently no payment records available'}
          </Typography>
          {(searchQuery || regionFilter || statusFilter || tinFilter) && (
            <Button variant="outlined" onClick={handleClearFilters} startIcon={<Clear />}>
              Clear all filters
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              overflow: 'hidden',
              mb: 2,
            }}
          >
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 1100 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? theme.palette.grey[50]
                          : theme.palette.grey[900],
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>Taxpayer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Amount Due
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Total Paid
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Remaining
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tax Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPayments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      hover
                      sx={{
                        '&:last-child td': { borderBottom: 0 },
                        '&.Mui-selected': { backgroundColor: theme.palette.action.selected },
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography fontWeight={500}>{payment.taxpayerName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            TIN: {payment.taxpayerTin}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={500}>{formatCurrency(payment.amount)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={500} color="success.main">
                          {formatCurrency(payment.totalPaid ?? 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={500} color={payment.remainingBalance > 0 ? 'warning.main' : 'success.main'}>
                          {formatCurrency(payment.remainingBalance ?? payment.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.dueDate).toLocaleDateString()}
                        {payment.status === 'Pending' && new Date(payment.dueDate) < new Date() && (
                          <Typography variant="caption" color="error.main" display="block">
                            Overdue
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{payment.taxType}</TableCell>
                      <TableCell>{payment.period}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          size="small"
                          color={getStatusColor(payment.status)}
                          variant="outlined"
                          sx={{
                            fontWeight: 500,
                            minWidth: 90,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Tooltip title="View account (payments & balance)">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/apps/assessment/${payment.assessmentId}/account`)}
                              sx={{ color: 'success.main' }}
                            >
                              <AccountBalance fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {(payment.status === 'Paid' || payment.status === 'Partially paid') ? (
                            <Tooltip title="View payment history">
                              <IconButton
                                size="small"
                                onClick={() => handleViewPaymentDetails(payment)}
                                color="primary"
                              >
                                <Receipt fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                          {payment.status !== 'Paid' && (
                            <Tooltip title="Make payment">
                              <IconButton
                                size="small"
                                onClick={() => handlePay(payment)}
                                color="success"
                              >
                                <Payment fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit payment">
                            <IconButton
                              size="small"
                              onClick={() => handleEditPayment(payment)}
                              color="primary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>

          {/* Pagination */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              mt: 2,
              p: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {paginatedPayments.length} of {filteredPayments.length} records
            </Typography>

            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
              size="medium"
            />
          </Box>
        </>
      )}

      {/* Edit Payment Modal */}
      {editPayment && (
        <Dialog
          open
          fullWidth
          maxWidth="sm"
          onClose={handleCancelEdit}
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `1px solid ${theme.palette.divider}`,
              py: 2,
            }}
          >
            <Typography variant="h6" component="span" fontWeight={600}>
              Edit Payment Details
            </Typography>
            <IconButton onClick={handleCancelEdit}>
              <Clear />
            </IconButton>
          </DialogTitle>

          {editLoading && <LinearProgress />}

          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Taxpayer Name"
                  value={editPayment.taxpayerName}
                  onChange={(e) =>
                    setEditPayment((prev) => ({
                      ...prev,
                      taxpayerName: e.target.value,
                    }))
                  }
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Taxpayer TIN"
                  value={editPayment.taxpayerTin}
                  onChange={(e) =>
                    setEditPayment((prev) => ({
                      ...prev,
                      taxpayerTin: e.target.value,
                    }))
                  }
                  margin="normal"
                  size="small"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tax Type"
                  value={editPayment.taxType}
                  onChange={(e) =>
                    setEditPayment((prev) => ({
                      ...prev,
                      taxType: e.target.value,
                    }))
                  }
                  margin="normal"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={editPayment.amount}
                  onChange={(e) =>
                    setEditPayment((prev) => ({
                      ...prev,
                      amount: Number(e.target.value),
                    }))
                  }
                  margin="normal"
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">TZS</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={editPayment.dueDate}
                  onChange={(e) =>
                    setEditPayment((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  margin="normal"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Period"
                  value={editPayment.period}
                  onChange={(e) =>
                    setEditPayment((prev) => ({
                      ...prev,
                      period: e.target.value,
                    }))
                  }
                  margin="normal"
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button onClick={handleCancelEdit} variant="outlined" sx={{ minWidth: 100 }}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              startIcon={<Save />}
              sx={{ minWidth: 140 }}
              disabled={editLoading}
            >
              {editLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Payment Confirmation Modal */}
      {selectedPayment && (
        <PaymentConfirmationModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onConfirm={async (paymentData) => {
            if (onPaymentConfirm) {
              await onPaymentConfirm(paymentData);
            }
            setModalOpen(false);
            setSelectedPayment(null);
            if (onRefresh) {
              onRefresh();
            }
          }}
          balance={taxpayer?.balance || 0}
        />
      )}

      {/* Payment History Dialog */}
      <PaymentHistoryDialog
        open={paymentHistoryDialog.open}
        onClose={() => setPaymentHistoryDialog({ open: false, assessmentId: null, payments: [], loading: false })}
        payments={paymentHistoryDialog.payments}
        loading={paymentHistoryDialog.loading}
        assessmentId={paymentHistoryDialog.assessmentId}
      />
    </Box>
  );
};

export default PaymentDashboard;

// Demo Component with State Management
const DemoPaymentDashboard = () => {
  const [assessments, setAssessments] = useState(mockAssessments);

  const handlePaymentConfirmation = (paymentId) => {
    const payment = assessments.find((p) => p.id === paymentId);
    if (payment) {
      setAssessments(
        assessments.map((assessment) =>
          assessment.id === paymentId ? { ...assessment, status: 'Completed' } : assessment,
        ),
      );
    }
  };

  return (
    <PaymentDashboard
      taxpayer={mockTaxpayer}
      assessments={assessments}
      onPaymentConfirm={handlePaymentConfirmation}
    />
  );
};

export { PaymentDashboard, DemoPaymentDashboard };
