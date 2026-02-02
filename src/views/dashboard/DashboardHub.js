// TRA Public Audit Portal Dashboard Hub - World Class, TRA Brand Colors
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  useTheme,
  LinearProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Paper,
  Stack,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  People,
  Assessment,
  Payment,
  Receipt,
  Security,
  Assignment,
  Calculate,
  Storage,
  NetworkCheck,
  TrendingUp,
  Analytics,
  Settings,
  Email,
  Chat,
  Support,
  Notifications,
  CheckCircle,
  Warning,
  Error,
  Info,
  ArrowForward,
  Refresh,
  Visibility,
  Block,
  VerifiedUser,
  Timeline,
  Business,
  Person,
  Domain,
  MonetizationOn,
  IntegrationInstructions,
  MobileFriendly,
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
import { useNavigate } from 'react-router-dom';
import { useTRA } from '../../context/TRAContext';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import BlankCard from '../../components/shared/BlankCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Dashboard Hub',
  },
];

// Quick Access Module Card
const QuickAccessCard = ({ title, subtitle, icon, color, href, stats, status, onClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        borderRadius: 4,
        background: '#fff',
        boxShadow: '0 4px 32px 0 #fff20022',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 48px 0 #fff20044',
        },
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar sx={{ bgcolor: '#fff200', color: '#111', width: 56, height: 56 }}>{icon}</Avatar>
          {status && (
            <Chip
              label={status}
              size="small"
              color={status === 'Active' ? 'success' : status === 'Warning' ? 'warning' : 'error'}
              sx={{ fontWeight: 700 }}
            />
          )}
        </Box>
        <Typography variant="h5" component="div" gutterBottom color="#111">
          {title}
        </Typography>
        <Typography variant="body2" color="#444" gutterBottom>
          {subtitle}
        </Typography>
        {stats && (
          <Box mt={2}>
            <Typography variant="h6" color="#fff200">
              {stats}
            </Typography>
          </Box>
        )}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <IconButton size="small" sx={{ color: '#fff200' }}>
            <ArrowForward />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

// System Status Component
const SystemStatus = ({ statusData }) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      default:
        return <Info />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Status
        </Typography>
        <List>
          {statusData?.map((service, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette[getStatusColor(service.status)].main,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {getStatusIcon(service.status)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary={service.name} secondary={service.description} />
                <Chip label={service.status} size="small" color={getStatusColor(service.status)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'payment':
        return <Payment />;
      case 'assessment':
        return <Assessment />;
      case 'registration':
        return <Person />;
      case 'audit':
        return <Assignment />;
      default:
        return <Info />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'payment':
        return 'success';
      case 'assessment':
        return 'primary';
      case 'registration':
        return 'info';
      case 'audit':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List>
          {activities?.map((activity, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Avatar
                    sx={{
                      bgcolor: (theme) => theme.palette[getActivityColor(activity.type)].main,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={activity.title}
                  secondary={`${activity.description} • ${activity.time}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Quick Stats Component
const QuickStats = ({ stats }) => {
  return (
    <Grid container spacing={3}>
      {stats?.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>{stat.icon}</Avatar>
                <Chip
                  label={stat.trend}
                  size="small"
                  color={stat.trend.includes('+') ? 'success' : 'error'}
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

const DashboardHub = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { complianceDashboard, loading } = useTRA();
  const [systemStatus, setSystemStatus] = useState([
    {
      name: 'TRA Blockchain Network',
      description: 'Main blockchain network',
      status: 'operational',
    },
    {
      name: 'Payment Gateway',
      description: 'Payment processing system',
      status: 'operational',
    },
    {
      name: 'Compliance Engine',
      description: 'Compliance monitoring system',
      status: 'warning',
    },
    {
      name: 'Data Sync Service',
      description: 'Data synchronization service',
      status: 'operational',
    },
  ]);

  const [recentActivities] = useState([
    {
      type: 'payment',
      title: 'Payment Processed',
      description: 'TZS 2,500,000 payment received',
      time: '2 minutes ago',
    },
    {
      type: 'assessment',
      title: 'Assessment Created',
      description: 'New tax assessment for ABC Corp',
      time: '15 minutes ago',
    },
    {
      type: 'registration',
      title: 'Taxpayer Registered',
      description: 'New taxpayer registration completed',
      time: '1 hour ago',
    },
    {
      type: 'audit',
      title: 'Audit Initiated',
      description: 'Compliance audit started',
      time: '2 hours ago',
    },
  ]);

  const quickStats = [
    {
      title: 'Total Taxpayers',
      value: complianceDashboard?.totalTaxpayers?.toLocaleString() || '0',
      icon: <People />,
      color: theme.palette.primary.main,
      trend: '+12.5%',
    },
    {
      title: 'Revenue Collected',
      value: `TZS ${(complianceDashboard?.totalRevenue || 0).toLocaleString()}`,
      icon: <MonetizationOn />,
      color: theme.palette.success.main,
      trend: '+8.2%',
    },
    {
      title: 'Active Assessments',
      value: complianceDashboard?.activeAssessments || '0',
      icon: <Assessment />,
      color: theme.palette.info.main,
      trend: '+5.1%',
    },
    {
      title: 'Compliance Rate',
      value: `${complianceDashboard?.complianceRate || 0}%`,
      icon: <Security />,
      color: theme.palette.warning.main,
      trend: '+2.3%',
    },
  ];

  const modules = [
    {
      title: 'TRA Blockchain Dashboard',
      subtitle: 'Main blockchain dashboard with real-time data',
      icon: <IconDatabase size={32} />,
      color: theme.palette.primary.main,
      href: '/dashboards/tra',
      stats: 'Live Data',
      status: 'Active',
    },
    {
      title: 'Taxpayer Management',
      subtitle: 'Register and manage taxpayer identities',
      icon: <IconUsers size={32} />,
      color: theme.palette.success.main,
      href: '/enhanced-taxpayer-registration',
      stats: `${complianceDashboard?.totalTaxpayers || 0} Taxpayers`,
      status: 'Active',
    },
    {
      title: 'Tax Assessment',
      subtitle: 'Create and manage tax assessments',
      icon: <IconFileText size={32} />,
      color: theme.palette.info.main,
      href: '/apps/assessment/list',
      stats: `${complianceDashboard?.activeAssessments || 0} Active`,
      status: 'Active',
    },
    {
      title: 'Payment Processing',
      subtitle: 'Process tax payments and transactions',
      icon: <IconCreditCard size={32} />,
      color: theme.palette.warning.main,
      href: '/tax/payments/list',
      stats: `TZS ${(complianceDashboard?.totalRevenue || 0).toLocaleString()}`,
      status: 'Active',
    },
    {
      title: 'Compliance Monitoring',
      subtitle: 'Monitor compliance and risk assessment',
      icon: <IconShieldCheck size={32} />,
      color: theme.palette.error.main,
      href: '/apps/compliance',
      stats: `${complianceDashboard?.complianceRate || 0}% Rate`,
      status: 'Active',
    },
    {
      title: 'Blockchain Explorer',
      subtitle: 'Explore blockchain transactions and data',
      icon: <IconDatabase size={32} />,
      color: theme.palette.secondary.main,
      href: '/apps/blockchain',
      stats: 'Live Explorer',
      status: 'Active',
    },
    {
      title: 'Auditing System',
      subtitle: 'Audit trails and compliance reports',
      icon: <IconFileText size={32} />,
      color: theme.palette.grey[600],
      href: '/tax/auditing/list',
      stats: 'Audit Ready',
      status: 'Active',
    },
    {
      title: 'VAT Management',
      subtitle: 'VAT calculations and management',
      icon: <IconCalculator size={32} />,
      color: theme.palette.purple[500],
      href: '/apps/vat',
      stats: 'VAT Ready',
      status: 'Active',
    },
  ];

  if (loading) {
    return (
      <PageContainer title="Dashboard Hub" description="Centralized dashboard hub">
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard Hub" description="Centralized dashboard hub">
      <Breadcrumb title="Dashboard Hub" items={BCrumb} />

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12}>
          <QuickStats stats={quickStats} />
        </Grid>

        {/* Main Modules Grid */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 2 }}>
            🚀 Quick Access Modules
          </Typography>
          <Grid container spacing={3}>
            {modules.map((module, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <QuickAccessCard {...module} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* System Status and Recent Activity */}
        <Grid item xs={12} md={6}>
          <SystemStatus statusData={systemStatus} />
        </Grid>

        <Grid item xs={12} md={6}>
          <RecentActivity activities={recentActivities} />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⚡ Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<IconUsers />}
                    onClick={() => navigate('/enhanced-taxpayer-registration')}
                  >
                    Register Taxpayer
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<IconFileText />}
                    onClick={() => navigate('/apps/assessment/list')}
                  >
                    Create Assessment
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<IconCreditCard />}
                    onClick={() => navigate('/tax/payments/list')}
                  >
                    Process Payment
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<IconShieldCheck />}
                    onClick={() => navigate('/apps/compliance')}
                  >
                    Check Compliance
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default DashboardHub;
