// src/components/apps/vat/VATManagement.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  LinearProgress,
  CircularProgress,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Download,
  Upload,
  Calculate,
  Receipt,
  Payment,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  Block,
  VerifiedUser,
  Timeline,
  Assessment,
  Business,
  MonetizationOn,
  Analytics,
  AccountBalance,
  IntegrationInstructions,
  MobileFriendly,
  Notifications,
  Speed,
  Shield,
  AutoAwesome,
  DataUsage,
  Public,
  Smartphone,
} from '@mui/icons-material';
import {
  IconEye,
  IconShield,
  IconBrain,
  IconDatabase,
  IconWorld,
  IconDeviceMobile,
  IconChartBar,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconClock,
  IconRefresh,
  IconDownload,
  IconUpload,
  IconSearch,
  IconFilter,
  IconSettings,
  IconHelp,
  IconInfoCircle,
  IconTrendingUp,
  IconTrendingDown,
  IconActivity,
  IconUsers,
  IconFileText,
  IconCalculator,
  IconReceipt2,
  IconCreditCard,
  IconWallet,
  IconQrcode,
  IconFingerprint,
  IconLock,
  IconKey,
  IconCertificate,
  IconShieldCheck,
  IconShieldX,
  IconShieldLock,
  IconShieldOff,
} from '@tabler/icons';
import { useTRA } from '../../../context/TRAContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// VAT Transaction Form Component
const VATTransactionForm = ({ open, onClose, onSubmit, initialData = null }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    taxpayerId: '',
    amount: '',
    vatRate: 18,
    transactionType: 'Sale',
    description: '',
    invoiceNumber: '',
    transactionDate: new Date().toISOString().split('T')[0],
    efdIntegration: true,
    automaticCalculation: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const calculateVAT = () => {
    const amount = parseFloat(formData.amount) || 0;
    const vatRate = parseFloat(formData.vatRate) || 18;
    return (amount * vatRate) / 100;
  };

  const vatAmount = calculateVAT();
  const totalAmount = parseFloat(formData.amount) + vatAmount;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <IconReceipt2 size={24} />
          </Avatar>
          <Typography variant="h6">
            {initialData ? 'Edit VAT Transaction' : 'New VAT Transaction'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Taxpayer ID"
                value={formData.taxpayerId}
                onChange={(e) => setFormData({ ...formData, taxpayerId: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount (TZS)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>VAT Rate (%)</InputLabel>
                <Select
                  value={formData.vatRate}
                  label="VAT Rate (%)"
                  onChange={(e) => setFormData({ ...formData, vatRate: e.target.value })}
                >
                  <MenuItem value={0}>0% (Zero Rated)</MenuItem>
                  <MenuItem value={18}>18% (Standard Rate)</MenuItem>
                  <MenuItem value={10}>10% (Reduced Rate)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={formData.transactionType}
                  label="Transaction Type"
                  onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                >
                  <MenuItem value="Sale">Sale</MenuItem>
                  <MenuItem value="Purchase">Purchase</MenuItem>
                  <MenuItem value="Import">Import</MenuItem>
                  <MenuItem value="Export">Export</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Transaction Date"
                type="date"
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>

            {/* VAT Calculation Preview */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    VAT Calculation Preview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Base Amount
                      </Typography>
                      <Typography variant="h6">
                        TZS {parseFloat(formData.amount || 0).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        VAT Amount ({formData.vatRate}%)
                      </Typography>
                      <Typography variant="h6" color="primary">
                        TZS {vatAmount.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        TZS {totalAmount.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.efdIntegration}
                    onChange={(e) => setFormData({ ...formData, efdIntegration: e.target.checked })}
                  />
                }
                label="EFD Integration"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.automaticCalculation}
                    onChange={(e) =>
                      setFormData({ ...formData, automaticCalculation: e.target.checked })
                    }
                  />
                }
                label="Automatic Calculation"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialData ? 'Update' : 'Create'} Transaction
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// VAT Statistics Component
const VATStatistics = ({ vatData }) => {
  const theme = useTheme();

  const stats = [
    {
      title: 'Total VAT Collected',
      value: `TZS ${vatData?.totalVAT?.toLocaleString() || '0'}`,
      icon: <MonetizationOn />,
      color: theme.palette.success.main,
      trend: '+12.5%',
    },
    {
      title: 'Transactions Today',
      value: vatData?.transactionsToday || 0,
      icon: <Receipt />,
      color: theme.palette.primary.main,
      trend: '+8.2%',
    },
    {
      title: 'Compliance Rate',
      value: `${vatData?.complianceRate || 0}%`,
      icon: <CheckCircle />,
      color: theme.palette.info.main,
      trend: '+2.1%',
    },
    {
      title: 'Pending Returns',
      value: vatData?.pendingReturns || 0,
      icon: <Warning />,
      color: theme.palette.warning.main,
      trend: '-5.3%',
    },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>{stat.icon}</Avatar>
                <Chip
                  label={stat.trend}
                  size="small"
                  color={stat.trend.startsWith('+') ? 'success' : 'error'}
                />
              </Box>
              <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// VAT Transactions Table
const VATTransactionsTable = ({ transactions, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'Sale':
        return 'primary';
      case 'Purchase':
        return 'secondary';
      case 'Import':
        return 'info';
      case 'Export':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Transaction ID</TableCell>
            <TableCell>Taxpayer</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>VAT Amount</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.transactionId}</TableCell>
              <TableCell>{transaction.taxpayerName}</TableCell>
              <TableCell>TZS {transaction.amount?.toLocaleString()}</TableCell>
              <TableCell>TZS {transaction.vatAmount?.toLocaleString()}</TableCell>
              <TableCell>
                <Chip
                  label={transaction.transactionType}
                  size="small"
                  color={getTransactionTypeColor(transaction.transactionType)}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={transaction.status}
                  size="small"
                  color={getStatusColor(transaction.status)}
                />
              </TableCell>
              <TableCell>{new Date(transaction.transactionDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => onView(transaction)}>
                      <IconEye size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(transaction)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => onDelete(transaction.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// VAT Analytics Component
const VATAnalytics = ({ analyticsData }) => {
  const chartData = analyticsData?.monthlyTrends || [];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly VAT Collection Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Area type="monotone" dataKey="vatAmount" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              VAT by Transaction Type
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData?.byType || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData?.byType?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Main VAT Management Component
const VATManagement = () => {
  const theme = useTheme();
  const {
    loading,
    error,
    vatTransactions,
    vatReports,
    loadVATTransactions,
    recordVATTransaction,
    generateVATReport,
  } = useTRA();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    transactionType: '',
    status: '',
  });

  useEffect(() => {
    loadVATTransactions();
  }, []);

  const handleCreateTransaction = async (transactionData) => {
    try {
      await recordVATTransaction(transactionData);
      loadVATTransactions();
    } catch (error) {
      console.error('Failed to create VAT transaction:', error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setFormOpen(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      // Implement delete functionality
      console.log('Delete transaction:', transactionId);
    }
  };

  const handleViewTransaction = (transaction) => {
    // Implement view functionality
    console.log('View transaction:', transaction);
  };

  const mockVATData = {
    totalVAT: 45000000,
    transactionsToday: 125,
    complianceRate: 94.5,
    pendingReturns: 23,
  };

  const mockAnalyticsData = {
    monthlyTrends: [
      { month: 'Jan', vatAmount: 35000000 },
      { month: 'Feb', vatAmount: 38000000 },
      { month: 'Mar', vatAmount: 42000000 },
      { month: 'Apr', vatAmount: 45000000 },
      { month: 'May', vatAmount: 48000000 },
      { month: 'Jun', vatAmount: 52000000 },
    ],
    byType: [
      { name: 'Sales', value: 60, color: '#8884d8' },
      { name: 'Purchases', value: 25, color: '#82ca9d' },
      { name: 'Imports', value: 10, color: '#ffc658' },
      { name: 'Exports', value: 5, color: '#ff7300' },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          VAT Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<IconRefresh />}
            onClick={() => loadVATTransactions()}
          >
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setFormOpen(true)}>
            New VAT Transaction
          </Button>
        </Box>
      </Box>

      {/* VAT Statistics */}
      <Box mb={3}>
        <VATStatistics vatData={mockVATData} />
      </Box>

      {/* VAT Analytics */}
      <Box mb={3}>
        <VATAnalytics analyticsData={mockAnalyticsData} />
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={filters.transactionType}
                  label="Transaction Type"
                  onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="Sale">Sale</MenuItem>
                  <MenuItem value="Purchase">Purchase</MenuItem>
                  <MenuItem value="Import">Import</MenuItem>
                  <MenuItem value="Export">Export</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* VAT Transactions Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            VAT Transactions
          </Typography>
          <VATTransactionsTable
            transactions={vatTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onView={handleViewTransaction}
          />
        </CardContent>
      </Card>

      {/* VAT Transaction Form */}
      <VATTransactionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedTransaction(null);
        }}
        onSubmit={handleCreateTransaction}
        initialData={selectedTransaction}
      />
    </Box>
  );
};

export default VATManagement;
