// TRA Public Audit Portal Official TRA Dashboard - World Class, TRA Brand Colors
// src/views/dashboard/TRADashboard.js
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
import { useTRA } from '../../context/TRAContext';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import BlankCard from '../../components/shared/BlankCard';
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

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'TRA Blockchain Dashboard',
  },
];

// Color scheme for different risk levels
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

// Compliance score color
const getComplianceColor = (score) => {
  if (score >= 80) return '#4caf50';
  if (score >= 60) return '#ff9800';
  return '#f44336';
};

// Pillar component for each of the 7 pillars
const PillarCard = ({ title, icon, value, subtitle, color, trend, onClick, children }) => {
  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 4,
        background: '#fff',
        boxShadow: '0 4px 32px 0 #fff20022',
        transition: 'all 0.3s ease',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 48px 0 #fff20044',
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar sx={{ bgcolor: '#fff200', color: '#111', width: 56, height: 56 }}>{icon}</Avatar>
          {trend && (
            <Chip
              icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
              label={`${Math.abs(trend)}%`}
              color={trend > 0 ? 'success' : 'error'}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          )}
        </Box>
        <Typography variant="h4" component="div" gutterBottom color="#111">
          {value}
        </Typography>
        <Typography variant="h6" color="#444" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="#444">
          {subtitle}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

// Real-time alerts component
const RealTimeAlerts = ({ alerts }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'compliance':
        return <IconShield size={20} />;
      case 'payment':
        return <IconCreditCard size={20} />;
      case 'audit':
        return <IconFileText size={20} />;
      case 'system':
        return <IconSettings size={20} />;
      default:
        return <IconInfoCircle size={20} />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  // Handle case when alerts is undefined or null
  if (!alerts || !Array.isArray(alerts)) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Real-Time Alerts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No alerts available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Real-Time Alerts
        </Typography>
        <List>
          {alerts.slice(0, 5).map((alert, index) => (
            <ListItem key={index} divider>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: getAlertColor(alert.severity) + '.light' }}>
                  {getAlertIcon(alert.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={alert.message}
                secondary={`${alert.timestamp} • ${alert.severity.toUpperCase()}`}
              />
              <Chip label={alert.type} size="small" color={getAlertColor(alert.severity)} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Blockchain stats component
const BlockchainStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Blockchain Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Block Height
            </Typography>
            <Typography variant="h6">{stats.blockHeight?.toLocaleString() || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Transactions Today
            </Typography>
            <Typography variant="h6">
              {stats.transactionsToday?.toLocaleString() || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Active Nodes
            </Typography>
            <Typography variant="h6">{stats.activeNodes || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Network Status
            </Typography>
            <Chip
              label={stats.networkStatus || 'Unknown'}
              color={stats.networkStatus === 'Healthy' ? 'success' : 'warning'}
              size="small"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Compliance monitoring component
const ComplianceMonitoring = ({ complianceData }) => {
  const theme = useTheme();

  const complianceChartData = [
    { name: 'Compliant', value: complianceData?.compliant || 0, color: '#4caf50' },
    { name: 'Warning', value: complianceData?.warning || 0, color: '#ff9800' },
    { name: 'Non-Compliant', value: complianceData?.nonCompliant || 0, color: '#f44336' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Compliance Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={complianceChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {complianceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Compliance Score
              </Typography>
              <Typography
                variant="h4"
                color={getComplianceColor(complianceData?.averageScore || 0)}
              >
                {complianceData?.averageScore || 0}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={complianceData?.averageScore || 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: getComplianceColor(complianceData?.averageScore || 0),
                  },
                }}
              />
            </Box>
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Recent Audits
              </Typography>
              <Typography variant="h6">{complianceData?.recentAudits || 0} this month</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Revenue tracking component
const RevenueTracking = ({ revenueData }) => {
  const chartData = revenueData?.trends || [];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Revenue Tracking
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="h4" color="primary">
              TZS {revenueData?.total?.toLocaleString() || '0'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              VAT Collection
            </Typography>
            <Typography variant="h5" color="success.main">
              TZS {revenueData?.vat?.toLocaleString() || '0'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Growth Rate
            </Typography>
            <Typography
              variant="h5"
              color={revenueData?.growth > 0 ? 'success.main' : 'error.main'}
            >
              {revenueData?.growth || 0}%
            </Typography>
          </Grid>
        </Grid>
        <Box mt={2}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

// System integration status component
const SystemIntegrationStatus = ({ systemStatus }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <IconCheck size={20} />;
      case 'disconnected':
        return <IconX size={20} />;
      case 'pending':
        return <IconClock size={20} />;
      default:
        return <IconHelp size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'disconnected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const systems = [
    { name: 'NIDA', key: 'nida' },
    { name: 'TISS', key: 'tiss' },
    { name: 'BRELA', key: 'brela' },
    { name: 'e-GA', key: 'ega' },
    { name: 'TCRA', key: 'tcra' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Integration Status
        </Typography>
        <Grid container spacing={2}>
          {systems.map((system) => {
            const status = systemStatus[system.key] || 'unknown';
            return (
              <Grid item xs={12} sm={6} md={4} key={system.key}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    sx={{ bgcolor: getStatusColor(status) + '.light', width: 32, height: 32 }}
                  >
                    {getStatusIcon(status)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {system.name}
                    </Typography>
                    <Chip label={status} size="small" color={getStatusColor(status)} />
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Main TRA Dashboard component
const TRADashboard = () => {
  const theme = useTheme();
  const {
    loading,
    error,
    taxpayers,
    complianceDashboard,
    revenueDashboard,
    blockchainStats,
    systemStatus,
    alerts,
    loadComplianceDashboard,
    loadRevenueDashboard,
    loadBlockchainStats,
    loadAlerts,
  } = useTRA();

  const [selectedPillar, setSelectedPillar] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30000);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          loadComplianceDashboard(),
          loadRevenueDashboard(),
          loadBlockchainStats(),
          loadAlerts(),
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      loadBlockchainStats();
      loadAlerts();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const pillars = [
    {
      id: 'transparency',
      title: 'Transparency & Trust',
      subtitle: 'Uwazi na Uaminifu',
      icon: <Visibility />,
      value: `${complianceDashboard?.totalTaxpayers || 0} Taxpayers`,
      color: theme.palette.primary.main,
      trend: 12.5,
      description: 'Blockchain-based audit trail and public transparency',
    },
    {
      id: 'security',
      title: 'Security',
      subtitle: 'Usalama wa Taarifa na Miamala',
      icon: <Security />,
      value: '99.9%',
      color: theme.palette.success.main,
      trend: 0.1,
      description: 'Multi-layered security with blockchain verification',
    },
    {
      id: 'automation',
      title: 'Automation',
      subtitle: 'Ufanisi kwa kutumia Smart Contracts',
      icon: <AutoAwesome />,
      value: '80%',
      color: theme.palette.warning.main,
      trend: 15.2,
      description: 'Smart contract automation and real-time processing',
    },
    {
      id: 'data-integrity',
      title: 'Data Integrity',
      subtitle: 'Uthibitisho wa Taarifa',
      icon: <DataUsage />,
      value: '100%',
      color: theme.palette.info.main,
      trend: 0,
      description: 'Cryptographic data validation and real-time reporting',
    },
    {
      id: 'interoperability',
      title: 'Interoperability',
      subtitle: 'Uhusiano na Mifumo ya Serikali',
      icon: <Public />,
      value: '5 Systems',
      color: theme.palette.secondary.main,
      trend: 20.0,
      description: 'Seamless integration with government systems',
    },
    {
      id: 'citizen-experience',
      title: 'Citizen Experience',
      subtitle: 'Uzoefu wa Raia na Biashara',
      icon: <Smartphone />,
      value: '90%',
      color: theme.palette.error.main,
      trend: 8.5,
      description: 'Mobile-first design and simplified processes',
    },
    {
      id: 'tax-leakage',
      title: 'Tax Leakage Mitigation',
      subtitle: 'Kupunguza Upungufu wa Kodi',
      icon: <Warning />,
      value: '30%',
      color: theme.palette.grey[600],
      trend: -30.0,
      description: 'Real-time fraud detection and compliance monitoring',
    },
  ];

  if (loading) {
    return (
      <PageContainer
        title="TRA Dashboard"
        description="Tanzania Revenue Authority Blockchain Dashboard"
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="TRA Dashboard"
      description="Tanzania Revenue Authority Blockchain Dashboard"
    >
      <Breadcrumb title="TRA Blockchain Dashboard" items={BCrumb} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {/* Header with refresh controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          TRA Blockchain Tax Administration
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<IconRefresh />}
            onClick={() => {
              loadComplianceDashboard();
              loadRevenueDashboard();
              loadBlockchainStats();
              loadAlerts();
            }}
          >
            Refresh
          </Button>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Refresh Rate</InputLabel>
            <Select
              value={refreshInterval / 1000}
              label="Refresh Rate"
              onChange={(e) => setRefreshInterval(e.target.value * 1000)}
            >
              <MenuItem value={10}>10s</MenuItem>
              <MenuItem value={30}>30s</MenuItem>
              <MenuItem value={60}>1m</MenuItem>
              <MenuItem value={300}>5m</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Seven Pillars Grid */}
      <Grid container spacing={3} mb={3}>
        {pillars.map((pillar) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pillar.id}>
            <PillarCard
              title={pillar.title}
              subtitle={pillar.subtitle}
              icon={pillar.icon}
              value={pillar.value}
              color={pillar.color}
              trend={pillar.trend}
              onClick={() => setSelectedPillar(pillar)}
            >
              <Typography variant="caption" color="text.secondary">
                {pillar.description}
              </Typography>
            </PillarCard>
          </Grid>
        ))}
      </Grid>

      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Revenue Tracking */}
            <Grid item xs={12}>
              <RevenueTracking revenueData={revenueDashboard} />
            </Grid>

            {/* Compliance Monitoring */}
            <Grid item xs={12}>
              <ComplianceMonitoring complianceData={complianceDashboard} />
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Real-time Alerts */}
            <Grid item xs={12}>
              <RealTimeAlerts alerts={alerts} />
            </Grid>

            {/* Blockchain Stats */}
            <Grid item xs={12}>
              <BlockchainStats stats={blockchainStats} />
            </Grid>

            {/* System Integration Status */}
            <Grid item xs={12}>
              <SystemIntegrationStatus systemStatus={systemStatus} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Pillar Detail Dialog */}
      <Dialog
        open={!!selectedPillar}
        onClose={() => setSelectedPillar(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPillar && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: selectedPillar.color }}>{selectedPillar.icon}</Avatar>
                <Box>
                  <Typography variant="h6" component="span">{selectedPillar.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPillar.subtitle}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedPillar.description}
              </Typography>
              {/* Add specific pillar content here */}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedPillar(null)}>Close</Button>
              <Button variant="contained">View Details</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </PageContainer>
  );
};

export default TRADashboard;
