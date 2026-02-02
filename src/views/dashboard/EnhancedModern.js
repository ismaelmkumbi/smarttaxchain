// TRA Enhanced Modern Dashboard - World Class UI Design
// Professional design with optimal contrast and readability
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  Alert,
  LinearProgress,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  alpha,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
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
  ArrowForward,
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
import { useNavigate } from 'react-router-dom';
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

// Enhanced Stats Card Component - Professional Design
const EnhancedStatsCard = ({ title, value, subtitle, icon, color, trend, onClick, children }) => {
  const theme = useTheme();
  
  // Map color to theme palette
  const getColorScheme = (color) => {
    if (typeof color === 'string' && color.includes('primary')) {
      return {
        main: theme.palette.primary.main,
        light: theme.palette.primary.light,
        bg: alpha(theme.palette.primary.main, 0.08),
        border: alpha(theme.palette.primary.main, 0.2),
      };
    }
    if (typeof color === 'string' && color.includes('success')) {
      return {
        main: theme.palette.success.main,
        light: theme.palette.success.light,
        bg: alpha(theme.palette.success.main, 0.08),
        border: alpha(theme.palette.success.main, 0.2),
      };
    }
    if (typeof color === 'string' && color.includes('info')) {
      return {
        main: theme.palette.info.main,
        light: theme.palette.info.light,
        bg: alpha(theme.palette.info.main, 0.08),
        border: alpha(theme.palette.info.main, 0.2),
      };
    }
    if (typeof color === 'string' && color.includes('warning')) {
      return {
        main: theme.palette.warning.main,
        light: theme.palette.warning.light,
        bg: alpha(theme.palette.warning.main, 0.08),
        border: alpha(theme.palette.warning.main, 0.2),
      };
    }
    // Default to primary
    return {
      main: theme.palette.primary.main,
      light: theme.palette.primary.light,
      bg: alpha(theme.palette.primary.main, 0.08),
      border: alpha(theme.palette.primary.main, 0.2),
    };
  };

  const colorScheme = getColorScheme(color);

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 3,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${colorScheme.main} 0%, ${colorScheme.light} 100%)`,
        },
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              borderColor: colorScheme.main,
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2.5}>
          <Avatar
            sx={{
              bgcolor: colorScheme.bg,
              color: colorScheme.main,
              width: 56,
              height: 56,
              border: `2px solid ${colorScheme.border}`,
            }}
          >
            {icon}
          </Avatar>
          {trend && (
            <Chip
              icon={trend > 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
              label={`${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`}
              size="small"
              color={trend > 0 ? 'success' : 'error'}
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 0.5,
            fontSize: '1rem',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
          }}
        >
          {subtitle}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

// Quick Actions Component - Redesigned
const QuickActions = ({ onNavigate }) => {
  const theme = useTheme();
  const actions = [
    {
      title: 'Taxpayer Registration',
      subtitle: 'Register new taxpayers',
      icon: <Person />,
      color: 'primary',
      route: '/enhanced-taxpayer-registration',
    },
    {
      title: 'Tax Assessment',
      subtitle: 'Manage tax assessments',
      icon: <Assessment />,
      color: 'info',
      route: '/apps/assessment',
    },
    {
      title: 'VAT Management',
      subtitle: 'VAT transactions & reports',
      icon: <Receipt />,
      color: 'success',
      route: '/apps/invoice/list',
    },
    {
      title: 'Payment Processing',
      subtitle: 'Tax payments & receipts',
      icon: <Payment />,
      color: 'warning',
      route: '/tax/payments/list',
    },
    {
      title: 'Invoice Management',
      subtitle: 'Generate & manage invoices',
      icon: <IconFileText size={24} />,
      color: 'secondary',
      route: '/apps/invoice/list',
    },
    {
      title: 'Audit Management',
      subtitle: 'Compliance & auditing',
      icon: <IconShieldCheck size={24} />,
      color: 'error',
      route: '/tax/auditing/list',
    },
  ];

  return (
    <Grid container spacing={3}>
      {actions.map((action, index) => {
        const colorMap = {
          primary: theme.palette.primary,
          info: theme.palette.info,
          success: theme.palette.success,
          warning: theme.palette.warning,
          secondary: theme.palette.secondary,
          error: theme.palette.error,
        };
        const actionColor = colorMap[action.color] || theme.palette.primary;

        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                borderRadius: 2,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${alpha(actionColor.main, 0.2)}`,
                  borderColor: actionColor.main,
                },
              }}
              onClick={() => onNavigate(action.route)}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(actionColor.main, 0.1),
                      color: actionColor.main,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {action.icon}
                  </Avatar>
                  <Box flex={1}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 0.5,
                      }}
                    >
                      {action.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.8125rem',
                      }}
                    >
                      {action.subtitle}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      color: actionColor.main,
                      '&:hover': {
                        bgcolor: alpha(actionColor.main, 0.1),
                      },
                    }}
                  >
                    <ArrowForward fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

// Blockchain Integration Status - Redesigned
const BlockchainIntegrationStatus = ({ blockchainStats }) => {
  const theme = useTheme();

  const statusItems = [
    {
      label: 'Network Status',
      value: 'Connected',
      icon: <IconCheck size={20} />,
      color: 'success',
      data: blockchainStats?.blockHeight || '0',
    },
    {
      label: 'Block Height',
      value: blockchainStats?.blockHeight?.toLocaleString() || '0',
      icon: <Block />,
      color: 'info',
    },
    {
      label: 'Transactions Today',
      value: blockchainStats?.transactionsToday?.toLocaleString() || '0',
      icon: <IconActivity size={20} />,
      color: 'primary',
    },
    {
      label: 'Security Status',
      value: 'Verified',
      icon: <IconShieldCheck size={20} />,
      color: 'success',
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 3,
          }}
        >
          Blockchain Integration Status
        </Typography>
        <Grid container spacing={3}>
          {statusItems.map((item, index) => {
            const colorMap = {
              success: theme.palette.success,
              info: theme.palette.info,
              primary: theme.palette.primary,
              warning: theme.palette.warning,
              error: theme.palette.error,
            };
            const itemColor = colorMap[item.color] || theme.palette.primary;

            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(itemColor.main, 0.05),
                    border: `1px solid ${alpha(itemColor.main, 0.2)}`,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(itemColor.main, 0.1),
                        color: itemColor.main,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Box flex={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          fontSize: '0.75rem',
                          mb: 0.5,
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Enhanced Modern Dashboard Component
const EnhancedModern = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Use TRA context if available, otherwise use fallback
  let traContext = null;
  try {
    traContext = useTRA();
  } catch (error) {
    console.log('TRA context not available, using fallback');
  }

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
  } = traContext || {
    loading: false,
    error: null,
    taxpayers: [],
    complianceDashboard: { averageScore: 85, recentAudits: 5 },
    revenueDashboard: { total: 45000000 },
    blockchainStats: { blockHeight: 12345, transactionsToday: 125 },
    systemStatus: {},
    alerts: [],
    loadComplianceDashboard: async () => {},
    loadRevenueDashboard: async () => {},
    loadBlockchainStats: async () => {},
    loadAlerts: async () => {},
  };

  const [activeTab, setActiveTab] = useState(0);

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

  const handleNavigate = (route) => {
    navigate(route);
  };

  const stats = [
    {
      title: 'Total Taxpayers',
      value: taxpayers?.length || 0,
      subtitle: 'Registered taxpayers',
      icon: <IconUsers size={24} />,
      color: 'primary',
      trend: 12.5,
    },
    {
      title: 'Total Revenue',
      value: `TZS ${(revenueDashboard?.total || 0).toLocaleString()}`,
      subtitle: 'This month',
      icon: <MonetizationOn />,
      color: 'success',
      trend: 8.2,
    },
    {
      title: 'Compliance Rate',
      value: `${complianceDashboard?.averageScore || 0}%`,
      subtitle: 'Average compliance score',
      icon: <IconShieldCheck size={24} />,
      color: 'info',
      trend: 5.1,
    },
    {
      title: 'Active Audits',
      value: complianceDashboard?.recentAudits || 0,
      subtitle: 'Ongoing audits',
      icon: <IconFileText size={24} />,
      color: 'warning',
      trend: -2.3,
    },
  ];

  const mockChartData = [
    { month: 'Jan', revenue: 45000000, taxpayers: 1200, compliance: 85 },
    { month: 'Feb', revenue: 48000000, taxpayers: 1250, compliance: 87 },
    { month: 'Mar', revenue: 52000000, taxpayers: 1300, compliance: 89 },
    { month: 'Apr', revenue: 55000000, taxpayers: 1350, compliance: 91 },
    { month: 'May', revenue: 58000000, taxpayers: 1400, compliance: 93 },
    { month: 'Jun', revenue: 62000000, taxpayers: 1450, compliance: 95 },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{ bgcolor: theme.palette.background.default }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error.message}
        </Alert>
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            TRA Admin Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            Comprehensive overview of tax administration operations
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<IconRefresh />}
            onClick={() => {
              loadComplianceDashboard();
              loadRevenueDashboard();
              loadBlockchainStats();
              loadAlerts();
            }}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <EnhancedStatsCard
              title={stat.title}
              subtitle={stat.subtitle}
              icon={stat.icon}
              value={stat.value}
              color={stat.color}
              trend={stat.trend}
            />
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Card
        sx={{
          borderRadius: 3,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 64,
                },
              }}
            >
              <Tab label="Quick Actions" />
              <Tab label="Analytics" />
              <Tab label="Blockchain Status" />
              <Tab label="Recent Alerts" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && <QuickActions onNavigate={handleNavigate} />}

            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 3,
                        }}
                      >
                        Revenue Trend
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={mockChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                          <YAxis stroke={theme.palette.text.secondary} />
                          <RechartsTooltip
                            contentStyle={{
                              background: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 8,
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={theme.palette.primary.main}
                            fill={alpha(theme.palette.primary.main, 0.2)}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 3,
                        }}
                      >
                        Compliance Trend
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                          <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                          <YAxis domain={[0, 100]} stroke={theme.palette.text.secondary} />
                          <RechartsTooltip
                            contentStyle={{
                              background: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 8,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="compliance"
                            stroke={theme.palette.success.main}
                            strokeWidth={3}
                            dot={{ fill: theme.palette.success.main, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {activeTab === 2 && <BlockchainIntegrationStatus blockchainStats={blockchainStats} />}

            {activeTab === 3 && (
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 3,
                    }}
                  >
                    Recent Alerts
                  </Typography>
                  <Box>
                    {alerts?.length > 0 ? (
                      alerts.slice(0, 5).map((alert, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          mb={2}
                          p={2}
                          sx={{
                            borderRadius: 2,
                            bgcolor: alpha(
                              alert.severity === 'high'
                                ? theme.palette.error.main
                                : theme.palette.warning.main,
                              0.05
                            ),
                            border: `1px solid ${alpha(
                              alert.severity === 'high'
                                ? theme.palette.error.main
                                : theme.palette.warning.main,
                              0.2
                            )}`,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: alpha(
                                alert.severity === 'high'
                                  ? theme.palette.error.main
                                  : theme.palette.warning.main,
                                0.1
                              ),
                              color:
                                alert.severity === 'high'
                                  ? theme.palette.error.main
                                  : theme.palette.warning.main,
                            }}
                          >
                            <IconAlertTriangle size={20} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                                mb: 0.5,
                              }}
                            >
                              {alert.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.text.secondary,
                              }}
                            >
                              {new Date(alert.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                          <Chip
                            label={alert.type}
                            size="small"
                            color={alert.severity === 'high' ? 'error' : 'warning'}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      ))
                    ) : (
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: 4,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        <Typography variant="body2">No alerts at this time</Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EnhancedModern;
