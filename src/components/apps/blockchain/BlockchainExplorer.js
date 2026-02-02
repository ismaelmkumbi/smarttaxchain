// src/components/apps/blockchain/BlockchainExplorer.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Avatar,
  IconButton,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
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
  IntegrationInstructions,
  MobileFriendly,
  Notifications,
  Speed,
  Shield,
  AutoAwesome,
  DataUsage,
  Public,
  Smartphone,
  Security,
  Gavel,
  Schedule,
  Flag,
  PriorityHigh,
  LowPriority,
  ExpandMore,
  Star,
  StarBorder,
  StarHalf,
  ContentCopy,
  OpenInNew,
  History,
  Lock,
  LockOpen,
  Key,
  Fingerprint,
  QrCode,
  Link,
  LinkOff,
  NetworkCheck,
  Storage,
  Memory,
  Speed as SpeedIcon,
  Timer,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
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
  ScatterChart,
  Scatter,
  ComposedChart,
} from 'recharts';

// Blockchain Network Stats Component
const BlockchainNetworkStats = ({ stats }) => {
  const theme = useTheme();

  const networkStats = [
    {
      title: 'Block Height',
      value: stats?.blockHeight?.toLocaleString() || '0',
      icon: <Block />,
      color: theme.palette.primary.main,
      trend: '+12 blocks',
    },
    {
      title: 'Active Nodes',
      value: stats?.activeNodes || 0,
      icon: <NetworkCheck />,
      color: theme.palette.success.main,
      trend: '+2 nodes',
    },
    {
      title: 'Transactions Today',
      value: stats?.transactionsToday?.toLocaleString() || '0',
      icon: <Receipt />,
      color: theme.palette.info.main,
      trend: '+15.2%',
    },
    {
      title: 'Network Status',
      value: stats?.networkStatus || 'Unknown',
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      trend: 'Healthy',
    },
  ];

  return (
    <Grid container spacing={3}>
      {networkStats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>{stat.icon}</Avatar>
                <Chip
                  label={stat.trend}
                  size="small"
                  color={stat.trend.includes('+') ? 'success' : 'default'}
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

// Transaction Details Component
const TransactionDetails = ({ transaction, open, onClose }) => {
  const theme = useTheme();

  if (!transaction) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <IconReceipt2 size={24} />
          </Avatar>
          <Typography variant="h6">Transaction Details</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Transaction Hash
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" fontFamily="monospace" sx={{ flex: 1 }}>
                {transaction.hash}
              </Typography>
              <IconButton size="small" onClick={() => copyToClipboard(transaction.hash)}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Block Number
            </Typography>
            <Typography variant="body1">{transaction.blockNumber}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Timestamp
            </Typography>
            <Typography variant="body1">
              {new Date(transaction.timestamp).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              From Address
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" fontFamily="monospace" sx={{ flex: 1 }}>
                {transaction.from}
              </Typography>
              <IconButton size="small" onClick={() => copyToClipboard(transaction.from)}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              To Address
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" fontFamily="monospace" sx={{ flex: 1 }}>
                {transaction.to}
              </Typography>
              <IconButton size="small" onClick={() => copyToClipboard(transaction.to)}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Transaction Data
            </Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Raw Transaction Data</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {JSON.stringify(transaction.data, null, 2)}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Verification Status
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                icon={<IconShieldCheck size={16} />}
                label="Cryptographically Verified"
                color="success"
              />
              <Chip icon={<IconCheck size={16} />} label="Block Confirmed" color="success" />
              <Chip icon={<IconLock size={16} />} label="Immutable Record" color="info" />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<OpenInNew />}
          onClick={() => window.open(`/blockchain/transaction/${transaction.hash}`, '_blank')}
        >
          View on Explorer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Recent Transactions Table
const RecentTransactionsTable = ({ transactions, onViewTransaction }) => {
  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'VAT':
        return <Receipt />;
      case 'PAYMENT':
        return <Payment />;
      case 'ASSESSMENT':
        return <Assessment />;
      case 'COMPLIANCE':
        return <Shield />;
      default:
        return <IconFileText size={20} />;
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'VAT':
        return 'primary';
      case 'PAYMENT':
        return 'success';
      case 'ASSESSMENT':
        return 'warning';
      case 'COMPLIANCE':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Transaction Hash</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Block</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.hash}>
              <TableCell>
                <Typography variant="body2" fontFamily="monospace" sx={{ maxWidth: 120 }}>
                  {tx.hash.substring(0, 16)}...
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  icon={getTransactionTypeIcon(tx.type)}
                  label={tx.type}
                  size="small"
                  color={getTransactionTypeColor(tx.type)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontFamily="monospace" sx={{ maxWidth: 100 }}>
                  {tx.from.substring(0, 12)}...
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontFamily="monospace" sx={{ maxWidth: 100 }}>
                  {tx.to.substring(0, 12)}...
                </Typography>
              </TableCell>
              <TableCell>{tx.amount ? `TZS ${tx.amount.toLocaleString()}` : 'N/A'}</TableCell>
              <TableCell>{tx.blockNumber}</TableCell>
              <TableCell>
                <Chip
                  icon={<IconCheck size={16} />}
                  label="Confirmed"
                  size="small"
                  color="success"
                />
              </TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => onViewTransaction(tx)}>
                  <IconEye size={16} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Blockchain Analytics Component
const BlockchainAnalytics = ({ analyticsData }) => {
  const theme = useTheme();

  const transactionTrendData = analyticsData?.transactionTrends || [];
  const blockTimeData = analyticsData?.blockTimeTrends || [];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transaction Volume Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={transactionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Area type="monotone" dataKey="transactions" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Block Time Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={blockTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="block" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="time" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Main Blockchain Explorer Component
const BlockchainExplorer = () => {
  const theme = useTheme();
  const {
    loading,
    error,
    blockchainStats,
    transactionHistory,
    loadBlockchainStats,
    loadTransactionHistory,
  } = useTRA();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadBlockchainStats();
    loadTransactionHistory();
  }, []);

  const handleSearch = () => {
    // Implement blockchain search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDialogOpen(true);
  };

  const mockAnalyticsData = {
    transactionTrends: [
      { date: '2024-01-01', transactions: 1250 },
      { date: '2024-01-02', transactions: 1380 },
      { date: '2024-01-03', transactions: 1420 },
      { date: '2024-01-04', transactions: 1560 },
      { date: '2024-01-05', transactions: 1680 },
      { date: '2024-01-06', transactions: 1750 },
    ],
    blockTimeTrends: [
      { block: 1000, time: 2.1 },
      { block: 1001, time: 2.3 },
      { block: 1002, time: 1.9 },
      { block: 1003, time: 2.0 },
      { block: 1004, time: 2.2 },
      { block: 1005, time: 1.8 },
    ],
  };

  const mockTransactions = [
    {
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      type: 'VAT',
      from: '0xabcdef1234567890abcdef1234567890abcdef12',
      to: '0x9876543210fedcba9876543210fedcba98765432',
      amount: 180000,
      blockNumber: 12345,
      timestamp: new Date().toISOString(),
      data: { taxpayerId: 'TP001', vatAmount: 180000 },
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef12',
      type: 'PAYMENT',
      from: '0x9876543210fedcba9876543210fedcba98765432',
      to: '0x1234567890abcdef1234567890abcdef12345678',
      amount: 500000,
      blockNumber: 12344,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      data: { taxpayerId: 'TP002', paymentAmount: 500000 },
    },
  ];

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
          Blockchain Explorer
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<IconRefresh />}
            onClick={() => {
              loadBlockchainStats();
              loadTransactionHistory();
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<IconDownload />}
            onClick={() => window.open('/api/blockchain/export', '_blank')}
          >
            Export Data
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              placeholder="Search by transaction hash, block number, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <IconSearch size={20} />,
              }}
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Network Stats */}
      <Box mb={3}>
        <BlockchainNetworkStats stats={blockchainStats} />
      </Box>

      {/* Analytics */}
      <Box mb={3}>
        <BlockchainAnalytics analyticsData={mockAnalyticsData} />
      </Box>

      {/* Tabs for different views */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Recent Transactions" />
            <Tab label="Network Health" />
            <Tab label="Smart Contracts" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && (
              <RecentTransactionsTable
                transactions={mockTransactions}
                onViewTransaction={handleViewTransaction}
              />
            )}

            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Network Health Metrics
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.light' }}>
                              <NetworkCheck />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Network Status"
                            secondary="Healthy - All nodes operational"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'info.light' }}>
                              <SpeedIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Average Block Time" secondary="2.1 seconds" />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'warning.light' }}>
                              <Storage />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Storage Usage" secondary="45% of total capacity" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Security Status
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.light' }}>
                              <IconShieldCheck size={20} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Cryptographic Verification"
                            secondary="All transactions verified"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.light' }}>
                              <IconLock size={20} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Immutable Records"
                            secondary="No tampering detected"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.light' }}>
                              <IconKey size={20} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Key Management"
                            secondary="Secure key distribution"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Deployed Smart Contracts
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Contract Name</TableCell>
                          <TableCell>Address</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>TaxpayerIdentityContract</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              0x1234...5678
                            </Typography>
                          </TableCell>
                          <TableCell>Identity Management</TableCell>
                          <TableCell>
                            <Chip label="Active" color="success" size="small" />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <IconEye size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>VATSmartContract</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              0xabcd...efgh
                            </Typography>
                          </TableCell>
                          <TableCell>VAT Management</TableCell>
                          <TableCell>
                            <Chip label="Active" color="success" size="small" />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <IconEye size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <TransactionDetails
        transaction={selectedTransaction}
        open={transactionDialogOpen}
        onClose={() => {
          setTransactionDialogOpen(false);
          setSelectedTransaction(null);
        }}
      />
    </Box>
  );
};

export default BlockchainExplorer;
