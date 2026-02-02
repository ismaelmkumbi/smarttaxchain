// Hyperledger Fabric Tax Operations Dashboard
// Revolutionary demonstration of blockchain-powered tax administration for TRA

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  LinearProgress,
  Alert,
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Security,
  AutoAwesome,
  DataUsage,
  Public,
  Smartphone,
  Warning,
  CheckCircle,
  Error,
  Info,
  Refresh,
  Visibility,
  Block,
  VerifiedUser,
  Timeline,
  Assessment,
  Payment,
  Receipt,
  Business,
  Person,
  Domain,
  MonetizationOn,
  Analytics,
  IntegrationInstructions,
  MobileFriendly,
  Notifications,
  Speed,
  Shield,
  ExpandMore,
  PlayArrow,
  Stop,
  Settings,
  History,
  AccountBalance,
  ReceiptLong,
  Security,
  GpsFixed,
  Speed,
  Memory,
  Storage,
  NetworkCheck,
  CloudSync,
  VpnKey,
  Fingerprint,
  QrCode,
  Biometric,
  SmartToy,
  Psychology,
  Analytics,
  TrendingFlat,
  Timeline,
  AccountTree,
  Schema,
  Hub,
  Router,
  Storage,
  Cloud,
  Api,
  Webhook,
  Code,
  BugReport,
  Build,
  Science,
  Psychology,
  AutoGraph,
  Insights,
  Lightbulb,
  School,
  Work,
  BusinessCenter,
  CorporateFare,
  AccountBalanceWallet,
  CreditCard,
  LocalAtm,
  Payment,
  Receipt,
  Calculate,
  Functions,
  Rule,
  Gavel,
  Balance,
  Scale,
  Verified,
  Warning,
  Error,
  Info,
  CheckCircle,
  Cancel,
  Pending,
  Schedule,
  Event,
  CalendarToday,
  AccessTime,
  Update,
  Sync,
  CloudDownload,
  CloudUpload,
  Download,
  Upload,
  FileDownload,
  FileUpload,
  PictureAsPdf,
  Description,
  Article,
  Assignment,
  Report,
  Assessment,
  Analytics,
  BarChart,
  PieChart,
  LineChart,
  ShowChart,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ScatterPlot,
  BubbleChart,
  DonutLarge,
  DonutSmall,
  PieChartOutline,
  BarChartOutlined,
  ShowChartOutlined,
  TimelineOutlined,
  AnalyticsOutlined,
  AssessmentOutlined,
  ReportOutlined,
  AssignmentOutlined,
  ArticleOutlined,
  DescriptionOutlined,
  PictureAsPdfOutlined,
  FileDownloadOutlined,
  FileUploadOutlined,
  UploadOutlined,
  DownloadOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  SyncOutlined,
  UpdateOutlined,
  AccessTimeOutlined,
  CalendarTodayOutlined,
  EventOutlined,
  ScheduleOutlined,
  PendingOutlined,
  CancelOutlined,
  CheckCircleOutlined,
  InfoOutlined,
  ErrorOutlined,
  WarningOutlined,
  VerifiedOutlined,
  ScaleOutlined,
  BalanceOutlined,
  GavelOutlined,
  RuleOutlined,
  FunctionsOutlined,
  CalculateOutlined,
  ReceiptOutlined,
  PaymentOutlined,
  LocalAtmOutlined,
  CreditCardOutlined,
  AccountBalanceWalletOutlined,
  CorporateFareOutlined,
  BusinessCenterOutlined,
  WorkOutlined,
  SchoolOutlined,
  LightbulbOutlined,
  InsightsOutlined,
  AutoGraphOutlined,
  PsychologyOutlined,
  ScienceOutlined,
  BuildOutlined,
  BugReportOutlined,
  CodeOutlined,
  WebhookOutlined,
  ApiOutlined,
  CloudOutlined,
  StorageOutlined,
  RouterOutlined,
  HubOutlined,
  SchemaOutlined,
  AccountTreeOutlined,
  TimelineOutlined,
  TrendingFlatOutlined,
  AnalyticsOutlined,
  SmartToyOutlined,
  BiometricOutlined,
  QrCodeOutlined,
  FingerprintOutlined,
  VpnKeyOutlined,
  CloudSyncOutlined,
  NetworkCheckOutlined,
  StorageOutlined,
  MemoryOutlined,
  SpeedOutlined,
  GpsFixedOutlined,
  SecurityOutlined,
  ReceiptLongOutlined,
  AccountBalanceOutlined,
  HistoryOutlined,
  SettingsOutlined,
  StopOutlined,
  PlayArrowOutlined,
  ExpandMoreOutlined,
  Switch,
  FormControlLabel,
} from '@mui/icons-material';
import {
  IconDatabase,
  IconShield,
  IconBrain,
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
  IconNetwork,
  IconServer,
  IconCloud,
  IconApi,
  IconCode,
  IconBug,
  IconTools,
  IconFlask,
  IconBrain,
  IconLightbulb,
  IconSchool,
  IconBriefcase,
  IconBuilding,
  IconBuildingBank,
  IconWallet,
  IconCreditCard,
  IconReceipt,
  IconCalculator,
  IconFunction,
  IconGavel,
  IconScale,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconInfo,
  IconClock,
  IconCalendar,
  IconTime,
  IconRefresh,
  IconDownload,
  IconUpload,
  IconFile,
  IconReport,
  IconChart,
  IconTrending,
  IconActivity,
  IconDatabase,
  IconServer,
  IconNetwork,
  IconCloud,
  IconApi,
  IconCode,
  IconBug,
  IconTools,
  IconFlask,
  IconBrain,
  IconLightbulb,
  IconSchool,
  IconBriefcase,
  IconBuilding,
  IconBuildingBank,
  IconWallet,
  IconCreditCard,
  IconReceipt,
  IconCalculator,
  IconFunction,
  IconGavel,
  IconScale,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconInfo,
  IconClock,
  IconCalendar,
  IconTime,
  IconRefresh,
  IconDownload,
  IconUpload,
  IconFile,
  IconReport,
  IconChart,
  IconTrending,
  IconActivity,
} from '@tabler/icons';
import { useTRA } from '../../context/TRAContext';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import BlankCard from '../../components/shared/BlankCard';
import hyperledgerService from '../../services/hyperledgerFabricService';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Hyperledger Fabric Tax Operations',
  },
];

// Color schemes for different components
const getRiskColor = (riskLevel) => {
  switch (riskLevel?.toLowerCase()) {
    case 'low':
      return '#4caf50';
    case 'medium':
      return '#ff9800';
    case 'high':
      return '#f44336';
    default:
      return '#757575';
  }
};

const getComplianceColor = (score) => {
  if (score >= 80) return '#4caf50';
  if (score >= 60) return '#ff9800';
  return '#f44336';
};

// ==================== NETWORK STATUS COMPONENT ====================
const NetworkStatusCard = ({ networkData }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
            <IconDatabase size={32} color="white" />
          </Avatar>
          <Chip
            icon={<IconCheck size={16} />}
            label="ACTIVE"
            color="success"
            sx={{ color: 'white', bgcolor: 'rgba(76, 175, 80, 0.8)' }}
          />
        </Box>
        <Typography variant="h4" component="div" gutterBottom sx={{ color: 'white' }}>
          {networkData.networkName}
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }} gutterBottom>
          Hyperledger Fabric Network
        </Typography>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Block Height
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {networkData.blockHeight.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Active Peers
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {networkData.activePeers}/{networkData.totalPeers}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Pending TX
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {networkData.pendingTransactions}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Block Time
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {networkData.averageBlockTime}s
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// ==================== SMART CONTRACTS DASHBOARD ====================
const SmartContractsDashboard = ({ contracts }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.text.primary, width: 48, height: 48, mr: 2 }}>
            <IconCode size={24} color={theme.palette.text.primary} />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              Smart Contracts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Chaincode Functions
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {Object.entries(contracts).map(([name, contract]) => (
            <Grid item xs={12} sm={6} key={name}>
              <Paper
                sx={{
                  p: 2,
                  border: `2px solid ${
                    contract.status === 'ACTIVE'
                      ? theme.palette.success.main
                      : theme.palette.warning.main
                  }`,
                  borderRadius: 2,
                  background:
                    contract.status === 'ACTIVE'
                      ? 'rgba(76, 175, 80, 0.1)'
                      : 'rgba(255, 152, 0, 0.1)',
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {contract.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contract.functions.length} functions
                    </Typography>
                  </Box>
                  <Chip
                    label={contract.status}
                    color={contract.status === 'ACTIVE' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                <Box mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    Version: {contract.version}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// ==================== REAL-TIME TRANSACTIONS ====================
const RealTimeTransactions = ({ transactions }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: theme.palette.info.main, width: 48, height: 48, mr: 2 }}>
              <IconActivity size={24} />
            </Avatar>
            <Box>
              <Typography variant="h5" component="div">
                Real-Time Transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live blockchain activity
              </Typography>
            </Box>
          </Box>
          <Chip icon={<IconActivity size={16} />} label="LIVE" color="info" variant="outlined" />
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {transactions.map((tx, index) => (
            <Paper
              key={tx.transactionId}
              sx={{
                p: 2,
                mb: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                background: index === 0 ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {tx.contractName}.{tx.function}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                    {tx.transactionId}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <Chip
                      label={tx.status}
                      color={tx.status === 'CONFIRMED' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
              <Box mt={1}>
                <Typography variant="caption" color="text.secondary">
                  Block: {tx.blockNumber} | Processing: {tx.processingTime}ms
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// ==================== COMPLIANCE ANALYTICS ====================
const ComplianceAnalytics = ({ complianceData }) => {
  const theme = useTheme();

  const chartData = complianceData.history.map((item) => ({
    month: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
    score: item.score,
    status: item.status === 'COMPLIANT' ? 1 : 0,
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ bgcolor: theme.palette.success.main, width: 48, height: 48, mr: 2 }}>
            <IconShieldCheck size={24} />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              Compliance Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-powered compliance monitoring
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box textAlign="center">
              <Typography variant="h3" color={getComplianceColor(complianceData.score)}>
                {complianceData.score}%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Compliance Score
              </Typography>
              <Chip
                label={complianceData.riskLevel}
                color={
                  complianceData.riskLevel === 'LOW'
                    ? 'success'
                    : complianceData.riskLevel === 'MEDIUM'
                    ? 'warning'
                    : 'error'
                }
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Fraud Indicators
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {complianceData.fraudIndicators.map((indicator, index) => (
              <Chip
                key={index}
                label={indicator}
                color="error"
                variant="outlined"
                size="small"
                icon={<IconWarning size={16} />}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// ==================== AUDIT TRAIL VISUALIZATION ====================
const AuditTrailVisualization = ({ auditTrail }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 48, height: 48, mr: 2 }}>
            <IconHistory size={24} />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              Audit Trail
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Immutable transaction history
            </Typography>
          </Box>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {auditTrail.map((entry, index) => (
            <Box
              key={entry.transactionId}
              sx={{
                position: 'relative',
                pl: 3,
                pb: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 8,
                  top: 24,
                  bottom: -8,
                  width: 2,
                  bgcolor: theme.palette.divider,
                },
                '&:last-child::before': {
                  display: 'none',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 16,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.main,
                  border: `3px solid ${theme.palette.background.paper}`,
                  zIndex: 1,
                }}
              />
              <Paper sx={{ p: 2, ml: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {entry.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.details}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                      TX: {entry.transactionId}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary">
                      {new Date(entry.timestamp).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Block: {entry.blockNumber}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// ==================== MAIN DASHBOARD COMPONENT ====================
const HyperledgerTaxOperations = () => {
  const theme = useTheme();
  const [networkData, setNetworkData] = useState(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [complianceData, setComplianceData] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true);

  // Smart contracts configuration
  const smartContracts = {
    taxpayerRegistry: {
      name: 'TaxpayerRegistry',
      version: '2.0.0',
      status: 'ACTIVE',
      functions: ['registerTaxpayer', 'updateTaxpayer', 'getTaxpayer', 'deleteTaxpayer'],
    },
    vatManagement: {
      name: 'VATManagement',
      version: '2.0.0',
      status: 'ACTIVE',
      functions: ['recordVATTransaction', 'calculateVAT', 'generateVATReport', 'validateEFD'],
    },
    complianceMonitoring: {
      name: 'ComplianceMonitoring',
      version: '2.0.0',
      status: 'ACTIVE',
      functions: ['calculateComplianceScore', 'detectFraud', 'scheduleAudit', 'applyPenalty'],
    },
    auditTrail: {
      name: 'AuditTrail',
      version: '2.0.0',
      status: 'ACTIVE',
      functions: ['recordAuditEvent', 'getAuditTrail', 'verifyIntegrity', 'exportAuditLog'],
    },
    paymentProcessing: {
      name: 'PaymentProcessing',
      version: '2.0.0',
      status: 'ACTIVE',
      functions: ['processPayment', 'validatePayment', 'generateReceipt', 'reconcilePayment'],
    },
    fraudDetection: {
      name: 'FraudDetection',
      version: '2.0.0',
      status: 'ACTIVE',
      functions: [
        'analyzeFraudPatterns',
        'flagSuspiciousActivity',
        'generateAlerts',
        'riskAssessment',
      ],
    },
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Load network status
        const network = await hyperledgerService.getNetworkStatus();
        setNetworkData(network);

        // Load real-time metrics
        const metrics = await hyperledgerService.getRealTimeMetrics();
        setRealTimeMetrics(metrics);

        // Generate sample transactions
        const sampleTransactions = generateSampleTransactions();
        setTransactions(sampleTransactions);

        // Load compliance data
        const compliance = await hyperledgerService.performComplianceCheck('TAX-001');
        setComplianceData(compliance);

        // Load audit trail
        const audit = await hyperledgerService.getAuditTrail('TAX-001', '2024-01-01', '2024-12-31');
        setAuditTrail(audit);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Set up real-time updates
    const interval = setInterval(() => {
      if (demoMode) {
        updateRealTimeData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [demoMode]);

  const generateSampleTransactions = () => {
    const functions = [
      'registerTaxpayer',
      'recordVATTransaction',
      'calculateComplianceScore',
      'processPayment',
      'detectFraud',
      'scheduleAudit',
    ];

    const contractNames = Object.keys(smartContracts);

    return Array.from({ length: 10 }, (_, i) => ({
      transactionId: `tx-${Math.random().toString(36).substr(2, 16)}`,
      contractName: contractNames[Math.floor(Math.random() * contractNames.length)],
      function: functions[Math.floor(Math.random() * functions.length)],
      timestamp: new Date(Date.now() - Math.random() * 300000).toISOString(),
      status: Math.random() > 0.1 ? 'CONFIRMED' : 'PENDING',
      blockNumber: Math.floor(Math.random() * 10000) + 1000,
      processingTime: Math.floor(Math.random() * 2000) + 500,
    }));
  };

  const updateRealTimeData = () => {
    // Add new transaction
    const newTx = {
      transactionId: `tx-${Math.random().toString(36).substr(2, 16)}`,
      contractName:
        Object.keys(smartContracts)[Math.floor(Math.random() * Object.keys(smartContracts).length)],
      function: 'recordVATTransaction',
      timestamp: new Date().toISOString(),
      status: 'CONFIRMED',
      blockNumber: (networkData?.blockHeight || 15420) + 1,
      processingTime: Math.floor(Math.random() * 2000) + 500,
    };

    setTransactions((prev) => [newTx, ...prev.slice(0, 9)]);

    // Update network data
    setNetworkData((prev) =>
      prev
        ? {
            ...prev,
            blockHeight: prev.blockHeight + 1,
            pendingTransactions: Math.max(0, prev.pendingTransactions - 1),
          }
        : null,
    );
  };

  const handleDemoModeToggle = () => {
    setDemoMode(!demoMode);
  };

  if (loading) {
    return (
      <PageContainer
        title="Hyperledger Fabric Tax Operations"
        description="Revolutionary blockchain-powered tax administration"
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Hyperledger Fabric Tax Operations"
      description="Revolutionary blockchain-powered tax administration"
    >
      <Breadcrumb title="Hyperledger Fabric Tax Operations" items={BCrumb} />

      {/* Demo Mode Toggle */}
      <Box mb={3}>
        <FormControlLabel
          control={<Switch checked={demoMode} onChange={handleDemoModeToggle} color="primary" />}
          label={
            <Box display="flex" alignItems="center">
              <IconPlayArrow size={20} style={{ marginRight: 8 }} />
              Live Demo Mode
            </Box>
          }
        />
      </Box>

      <Grid container spacing={3}>
        {/* Network Status */}
        <Grid item xs={12} md={6} lg={3}>
          <NetworkStatusCard networkData={networkData} />
        </Grid>

        {/* Real-time Metrics */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: theme.palette.info.main, width: 48, height: 48, mr: 2 }}>
                  <IconSpeed size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {realTimeMetrics?.activeTransactions || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Transactions
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={((realTimeMetrics?.activeTransactions || 0) / 200) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Network Throughput */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: theme.palette.success.main, width: 48, height: 48, mr: 2 }}>
                  <IconNetwork size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {realTimeMetrics?.networkThroughput || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    TX/sec
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={((realTimeMetrics?.networkThroughput || 0) / 1500) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Error Rate */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: theme.palette.error.main, width: 48, height: 48, mr: 2 }}>
                  <IconBug size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {(realTimeMetrics?.errorRate || 0) * 100}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Error Rate
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(realTimeMetrics?.errorRate || 0) * 1000}
                sx={{ height: 8, borderRadius: 4 }}
                color="error"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Smart Contracts Dashboard */}
        <Grid item xs={12} lg={6}>
          <SmartContractsDashboard contracts={smartContracts} />
        </Grid>

        {/* Real-time Transactions */}
        <Grid item xs={12} lg={6}>
          <RealTimeTransactions transactions={transactions} />
        </Grid>

        {/* Compliance Analytics */}
        <Grid item xs={12} lg={6}>
          <ComplianceAnalytics complianceData={complianceData} />
        </Grid>

        {/* Audit Trail Visualization */}
        <Grid item xs={12} lg={6}>
          <AuditTrailVisualization auditTrail={auditTrail} />
        </Grid>

        {/* Organization Network Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Network Organizations
              </Typography>
              <Grid container spacing={2}>
                {networkData?.organizations.map((org, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        border: `2px solid ${
                          org.status === 'Active'
                            ? theme.palette.success.main
                            : theme.palette.warning.main
                        }`,
                        borderRadius: 2,
                      }}
                    >
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {org.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {org.peerCount} peers
                          </Typography>
                        </Box>
                        <Chip
                          label={org.status}
                          color={org.status === 'Active' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        MSP: {org.mspId}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default HyperledgerTaxOperations;
