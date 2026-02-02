import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Stack,
  useTheme,
  alpha,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  Payment,
  Verified,
  Notifications,
  Timeline,
  Info,
  AccountBalance,
  Receipt,
} from '@mui/icons-material';
import { formatCurrency, formatDate } from 'src/utils/verification/formatters';
import MyAssessments from './MyAssessments';
import MyPayments from './MyPayments';
import QuickActions from './QuickActions';

const DashboardOverview = ({ dashboardData = {}, tin, sessionToken, onActionClick }) => {
  const theme = useTheme();

  const stats = {
    totalTaxesPaid: dashboardData.totalTaxesPaid || 0,
    pendingAssessments: dashboardData.pendingAssessments || 0,
    verifiedPayments: dashboardData.verifiedPayments || 0,
    complianceScore: dashboardData.complianceScore || 0,
    totalAssessments: dashboardData.totalAssessments || 0,
    overdueAssessments: dashboardData.overdueAssessments || 0,
    totalPayments: dashboardData.totalPayments || 0,
    alerts: dashboardData.alerts || [],
    recentActivities: dashboardData.recentActivities || [],
  };

  const StatCard = ({ title, value, subtitle, icon, color, progress }) => (
    <Card
      sx={{
        height: '100%',
        boxShadow: 2,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight={700} color={`${color}.main`}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.1),
                color: `${color}.main`,
              }}
            >
              {icon}
            </Box>
          </Box>
          {progress !== undefined && (
            <Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: `${color}.main`,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {progress}% Complete
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Taxes Paid */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Taxes Paid (YTD)"
            value={formatCurrency(stats.totalTaxesPaid)}
            subtitle="Year to Date"
            icon={<Payment sx={{ fontSize: 32 }} />}
            color="success"
          />
        </Grid>

        {/* Pending Assessments */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Assessments"
            value={stats.pendingAssessments}
            subtitle={`${stats.overdueAssessments || 0} overdue`}
            icon={<Assessment sx={{ fontSize: 32 }} />}
            color="warning"
          />
        </Grid>

        {/* Total Payments */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Payments"
            value={stats.totalPayments}
            subtitle={`${stats.verifiedPayments || 0} verified`}
            icon={<Receipt sx={{ fontSize: 32 }} />}
            color="info"
          />
        </Grid>

        {/* Compliance Score */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Compliance Score"
            value={`${stats.complianceScore}%`}
            subtitle="Overall compliance rating"
            icon={<TrendingUp sx={{ fontSize: 32 }} />}
            color="primary"
            progress={stats.complianceScore}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <QuickActions onActionClick={onActionClick} />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* My Assessments & Payments */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <MyAssessments tin={tin} sessionToken={sessionToken} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <MyPayments tin={tin} sessionToken={sessionToken} />
        </Grid>
      </Grid>

      {/* Alerts & Notifications */}
      {stats.alerts.length > 0 && (
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Notifications color="warning" />
              <Typography variant="h6" fontWeight={600}>
                Alerts & Notifications ({stats.alerts.length})
              </Typography>
            </Stack>
            <Stack spacing={1}>
              {stats.alerts.map((alert, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    bgcolor: alpha(
                      theme.palette[alert.severity]?.main || theme.palette.warning.main,
                      0.1
                    ),
                    borderRadius: 2,
                    border: `1px solid ${alpha(
                      theme.palette[alert.severity]?.main || theme.palette.warning.main,
                      0.2
                    )}`,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Chip
                      label={alert.type}
                      size="small"
                      color={alert.severity || 'warning'}
                      sx={{ minWidth: 100 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {alert.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alert.message}
                      </Typography>
                      {alert.timestamp && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {formatDate(alert.timestamp)}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Recent Activities Timeline */}
      {stats.recentActivities.length > 0 && (
        <Card sx={{ boxShadow: 2, borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Timeline sx={{ fontSize: 24 }} />
              <Typography variant="h6" fontWeight={600}>
                Recent Activities
              </Typography>
            </Stack>
            <Stack spacing={2}>
              {stats.recentActivities.slice(0, 5).map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {activity.icon || <Info />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {activity.action}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.description}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(activity.timestamp)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DashboardOverview;

