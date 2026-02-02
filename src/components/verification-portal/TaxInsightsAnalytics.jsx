import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Payment,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material';
import { formatCurrency } from 'src/utils/verification/formatters';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TaxInsightsAnalytics = ({ analyticsData = {} }) => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - replace with real data from props
  const yearComparison = analyticsData.yearComparison || [
    { year: 2022, amount: 5000000 },
    { year: 2023, amount: 7500000 },
    { year: 2024, amount: 10000000 },
    { year: 2025, amount: 7800000 },
  ];

  const categoryBreakdown = analyticsData.categoryBreakdown || [
    { name: 'PAYE', value: 3000000, color: theme.palette.primary.main },
    { name: 'VAT', value: 2500000, color: theme.palette.success.main },
    { name: 'Income Tax', value: 1500000, color: theme.palette.warning.main },
    { name: 'Other', value: 800000, color: theme.palette.info.main },
  ];

  const paymentTrend = analyticsData.paymentTrend || [
    { month: 'Jan', amount: 2000000 },
    { month: 'Feb', amount: 1500000 },
    { month: 'Mar', amount: 1800000 },
    { month: 'Apr', amount: 2200000 },
    { month: 'May', amount: 1900000 },
    { month: 'Jun', amount: 2100000 },
  ];

  const complianceHistory = analyticsData.complianceHistory || [
    { month: 'Jan', score: 85 },
    { month: 'Feb', score: 88 },
    { month: 'Mar', score: 90 },
    { month: 'Apr', score: 87 },
    { month: 'May', score: 92 },
    { month: 'Jun', score: 95 },
  ];

  const filingBehavior = analyticsData.filingBehavior || {
    onTime: 85,
    late: 10,
    veryLate: 5,
  };

  const currentYearTotal = yearComparison.find((y) => y.year === selectedYear)?.amount || 0;
  const previousYearTotal = yearComparison.find((y) => y.year === selectedYear - 1)?.amount || 0;
  const yearOverYearChange = previousYearTotal
    ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100
    : 0;

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Tax Insights & Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive analysis of your tax history and trends
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {yearComparison.map((y) => (
                  <MenuItem key={y.year} value={y.year}>
                    {y.year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Year-over-Year Comparison */}
          <Box
            sx={{
              p: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {selectedYear} Total
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {formatCurrency(currentYearTotal)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {selectedYear - 1} Total
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {formatCurrency(previousYearTotal)}
                </Typography>
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  {yearOverYearChange >= 0 ? (
                    <TrendingUp color="success" />
                  ) : (
                    <TrendingDown color="error" />
                  )}
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color={yearOverYearChange >= 0 ? 'success.main' : 'error.main'}
                  >
                    {yearOverYearChange >= 0 ? '+' : ''}
                    {yearOverYearChange.toFixed(1)}%
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Year-over-Year Change
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Year Comparison" icon={<BarChartIcon />} iconPosition="start" />
              <Tab label="Category Breakdown" icon={<PieChartIcon />} iconPosition="start" />
              <Tab label="Payment Trends" icon={<TrendingUp />} iconPosition="start" />
              <Tab label="Compliance History" icon={<Assessment />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="amount" fill={theme.palette.primary.main} name="Tax Amount (TZS)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}

          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {categoryBreakdown.map((category, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        bgcolor: alpha(category.color, 0.1),
                        borderRadius: 2,
                        border: `1px solid ${alpha(category.color, 0.3)}`,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {category.name}
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color={category.color}>
                            {formatCurrency(category.value)}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${((category.value / categoryBreakdown.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(1)}%`}
                          color="primary"
                          size="small"
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paymentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke={theme.palette.success.main}
                    strokeWidth={2}
                    name="Payment Amount (TZS)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}

          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        name="Compliance Score (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      On-Time Filing
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="success.main">
                      {filingBehavior.onTime}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Late Filing
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="warning.main">
                      {filingBehavior.late}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Very Late Filing
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="error.main">
                      {filingBehavior.veryLate}%
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          )}

          {/* AI Recommendations */}
          <Box
            sx={{
              p: 3,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              💡 AI-Powered Recommendations
            </Typography>
            <Stack spacing={1}>
              {yearOverYearChange < 0 && (
                <Typography variant="body2">
                  • Your tax payments decreased compared to last year. Consider reviewing your tax planning.
                </Typography>
              )}
              {filingBehavior.late + filingBehavior.veryLate > 15 && (
                <Typography variant="body2">
                  • You have a high rate of late filings. Set reminders to avoid penalties.
                </Typography>
              )}
              <Typography variant="body2">
                • Maintain consistent payment schedules to improve your compliance score.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaxInsightsAnalytics;

