import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  Fade,
  Grow,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as RevenueIcon,
  People as TaxpayersIcon,
  Security as ComplianceIcon,
  Speed as PerformanceIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Public as PublicIcon,
  Psychology as AIIcon,
  Refresh as RefreshIcon,
  Launch as LaunchIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

// Mock data - replace with real API calls
const mockDashboardData = {
  revenue: {
    total: 2847500000000, // 2.8 Trillion TZS
    growth: 12.5,
    target: 3000000000000,
    lastUpdate: new Date().toISOString(),
  },
  taxpayers: {
    registered: 1250000,
    active: 980000,
    compliance: 87.3,
    newRegistrations: 15420,
  },
  transactions: {
    total: 45678900,
    today: 125430,
    fraudDetected: 234,
    processed: 99.8,
  },
  performance: {
    systemUptime: 99.9,
    avgResponseTime: 0.8,
    dataAccuracy: 99.5,
    userSatisfaction: 4.7,
  },
  recentActivities: [
    {
      id: 1,
      type: 'revenue',
      title: 'Monthly Revenue Target Achieved',
      description: 'October 2024 revenue exceeded target by 8.2%',
      timestamp: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'compliance',
      title: 'Compliance Rate Improved',
      description: 'Tax compliance rate increased to 87.3%',
      timestamp: '4 hours ago',
      status: 'success',
    },
    {
      id: 3,
      type: 'fraud',
      title: 'Fraud Detection Alert',
      description: '234 suspicious transactions flagged for review',
      timestamp: '6 hours ago',
      status: 'warning',
    },
    {
      id: 4,
      type: 'system',
      title: 'System Performance Optimal',
      description: 'All systems operating at 99.9% uptime',
      timestamp: '8 hours ago',
      status: 'info',
    },
  ],
};

const StatCard = ({ title, value, subtitle, icon, color, trend, loading = false }) => {
  const theme = useTheme();
  const TRA_YELLOW = '#fff200';
  const TRA_BLACK = '#111';
  return (
    <Grow in timeout={600}>
      <Card
        sx={{
          height: '100%',
          background: '#fff',
          border: `1px solid ${TRA_YELLOW}22`,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 2px 16px 0 #11111108',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 32px 0 ${TRA_YELLOW}33`,
          },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: `${TRA_YELLOW}22`,
                color: TRA_YELLOW,
                border: `2px solid ${TRA_YELLOW}44`,
              }}
            >
              {icon}
            </Avatar>
            {trend && (
              <Chip
                icon={trend > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${trend > 0 ? '+' : ''}${trend}%`}
                size="small"
                sx={{
                  fontWeight: 600,
                  background: '#fff',
                  color: trend > 0 ? 'green' : 'red',
                  border: `1px solid ${TRA_YELLOW}44`,
                  '& .MuiChip-icon': {
                    fontSize: '1rem',
                    color: trend > 0 ? 'green' : 'red',
                  },
                }}
              />
            )}
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: TRA_BLACK,
              mb: 0.5,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            {loading ? (
              <Box sx={{ width: '60%', height: 32, bgcolor: 'grey.200', borderRadius: 1 }} />
            ) : (
              value
            )}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, color: TRA_YELLOW, mb: 1 }}>
            {title}
          </Typography>

          <Typography variant="body2" sx={{ color: '#444' }}>
            {subtitle}
          </Typography>

          {loading && (
            <LinearProgress
              sx={{
                mt: 2,
                borderRadius: 1,
                height: 4,
                '& .MuiLinearProgress-bar': {
                  background: TRA_YELLOW,
                },
              }}
            />
          )}
        </CardContent>

        {/* Decorative Element */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `${TRA_YELLOW}08`,
            zIndex: 0,
          }}
        />
      </Card>
    </Grow>
  );
};

const ActivityItem = ({ activity, index }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  return (
    <Fade in timeout={800 + index * 200}>
      <ListItem
        sx={{
          borderRadius: 2,
          mb: 1,
          border: '1px solid rgba(0, 40, 85, 0.08)',
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfb 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #f8f9fa 0%, #f2f6fa 100%)',
            transform: 'translateX(4px)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>{getStatusIcon(activity.status)}</ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            component: 'div',
            variant: 'subtitle2',
            sx: { fontWeight: 600, mb: 0.5 },
          }}
          primary={activity.title}
          secondary={
            <Box component="div">
              <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {activity.description}
              </Typography>
              <Typography component="span" variant="caption" color="text.secondary">
                {activity.timestamp}
              </Typography>
            </Box>
          }
          secondaryTypographyProps={{ component: 'div' }}
        />
      </ListItem>
    </Fade>
  );
};

const EnhancedDashboardOverview = ({ loading = false }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [data, setData] = useState(mockDashboardData);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setData({ ...mockDashboardData });
      setRefreshing(false);
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-TZ').format(num);
  };

  const stats = [
    {
      title: t('dashboard.totalRevenue', 'Total Revenue'),
      value: formatCurrency(data.revenue.total),
      subtitle: t('dashboard.revenueGrowth', `+${data.revenue.growth}% from last month`),
      icon: <RevenueIcon />,
      color: theme.palette.primary.main,
      trend: data.revenue.growth,
    },
    {
      title: t('dashboard.activeTaxpayers', 'Active Taxpayers'),
      value: formatNumber(data.taxpayers.active),
      subtitle: t(
        'dashboard.totalRegistered',
        `${formatNumber(data.taxpayers.registered)} total registered`,
      ),
      icon: <TaxpayersIcon />,
      color: theme.palette.secondary.main,
      trend: 5.2,
    },
    {
      title: t('dashboard.complianceRate', 'Compliance Rate'),
      value: `${data.taxpayers.compliance}%`,
      subtitle: t('dashboard.complianceImprovement', 'Improved by 2.1% this quarter'),
      icon: <ComplianceIcon />,
      color: theme.palette.success.main,
      trend: 2.1,
    },
    {
      title: t('dashboard.systemPerformance', 'System Performance'),
      value: `${data.performance.systemUptime}%`,
      subtitle: t('dashboard.uptime', 'Uptime this month'),
      icon: <PerformanceIcon />,
      color: theme.palette.info.main,
      trend: 0.2,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#000000', // TRA Black
                mb: 1,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              {t('dashboard.welcome', 'Welcome to Public Audit Portal')}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#f5e800' }}>
              {t(
                'dashboard.subtitle',
                "Real-time insights into Tanzania's tax system transparency",
              )}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={t('dashboard.refresh', 'Refresh Data')}>
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  background: '#f5e800', // TRA Yellow
                  color: '#000000', // TRA Black
                  '&:hover': {
                    background: '#fff700',
                    color: '#000000',
                  },
                }}
              >
                <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<VerifiedIcon />}
            label={t('status.verified', 'Data Verified')}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<PublicIcon />}
            label={t('status.transparent', 'Fully Transparent')}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<AIIcon />}
            label={t('status.aiPowered', 'AI-Powered Analytics')}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatCard {...stat} loading={loading || refreshing} />
          </Grid>
        ))}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(0, 40, 85, 0.08)',
              background: 'linear-gradient(135deg, #ffffff 0%, #fafbfb 100%)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimelineIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('dashboard.recentActivities', 'Recent Activities')}
                  </Typography>
                </Box>
                <Button endIcon={<LaunchIcon />} size="small" sx={{ textTransform: 'none' }}>
                  {t('dashboard.viewAll', 'View All')}
                </Button>
              </Box>

              <List disablePadding>
                {data.recentActivities.map((activity, index) => (
                  <ActivityItem key={activity.id} activity={activity} index={index} />
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(0, 40, 85, 0.08)',
              background: 'linear-gradient(135deg, #ffffff 0%, #fafbfb 100%)',
              height: 'fit-content',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AssessmentIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('dashboard.quickActions', 'Quick Actions')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<TrendingUpIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #002855 0%, #005792 100%)',
                    textTransform: 'none',
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {t('dashboard.viewAnalytics', 'View Tax Analytics')}
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AIIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #FFD100 0%, #E6B800 100%)',
                    color: '#002855',
                    textTransform: 'none',
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {t('dashboard.trySimulation', 'Try Blockchain Simulation')}
                </Button>

                <Divider sx={{ my: 1 }} />

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<InfoIcon />}
                  sx={{ textTransform: 'none', py: 1.5, borderRadius: 2 }}
                >
                  {t('dashboard.learnMore', 'Learn About Tax System')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  trend: PropTypes.number,
  loading: PropTypes.bool,
};

ActivityItem.propTypes = {
  activity: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

EnhancedDashboardOverview.propTypes = {
  loading: PropTypes.bool,
};

export default EnhancedDashboardOverview;
