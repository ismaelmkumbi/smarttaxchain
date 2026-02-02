import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { MenuItem, Stack, Typography, Button, Avatar, Box } from '@mui/material';
import { IconCalendar, IconReportAnalytics } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';

// Utility to format large numbers (e.g., "12.4B")
const formatNumber = (value) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
};

const RevenueUpdates = () => {
  const theme = useTheme();
  const [period, setPeriod] = useState('2025-04'); // Format YYYY-MM

  // Example data; in real app fetch via hook
  const data = useMemo(
    () => ({
      taxes: [1.8e9, 2.1e9, 1.9e9, 2.4e9, 2.0e9, 2.3e9, 2.2e9],
      refunds: [0.2e9, 0.3e9, 0.25e9, 0.15e9, 0.18e9, 0.22e9, 0.2e9],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      summary: {
        totalTaxCollected: 12.4e9,
        totalRefundsIssued: 1.2e9,
      },
    }),
    [],
  );

  // Chart configuration
  const chartOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        stacked: true,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      colors: [theme.palette.primary.main, theme.palette.error.main],
      plotOptions: {
        bar: { borderRadius: 6, columnWidth: '50%' },
      },
      dataLabels: { enabled: false },
      legend: { position: 'top' },
      xaxis: {
        categories: data.labels,
        labels: { style: { colors: theme.palette.text.secondary } },
      },
      yaxis: {
        labels: {
          formatter: (val) => formatNumber(val),
        },
      },
      tooltip: {
        y: { formatter: (val) => `${formatNumber(val)} TZS` },
        theme: theme.palette.mode,
      },
    }),
    [theme, data.labels],
  );

  const series = useMemo(
    () => [
      { name: 'Taxes Collected', data: data.taxes },
      { name: 'Refunds Issued', data: data.refunds },
    ],
    [data],
  );

  const handleChange = (e) => setPeriod(e.target.value);

  return (
    <DashboardCard
      title="Tax Collection Updates"
      subtitle="Revenue vs Refunds"
      action={
        <CustomSelect
          value={period}
          size="small"
          onChange={handleChange}
          startAdornment={<IconCalendar size={16} stroke={1.5} />}
        >
          <MenuItem value="2025-04">April 2025</MenuItem>
          <MenuItem value="2025-03">March 2025</MenuItem>
          <MenuItem value="2025-02">February 2025</MenuItem>
        </CustomSelect>
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box>
            <Chart options={chartOptions} series={series} type="bar" height={320} />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={4} sx={{ mt: { xs: 2, md: 0 } }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                <IconReportAnalytics size={20} stroke={1.5} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Tax Collected
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {formatNumber(data.summary.totalTaxCollected)} TZS
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                <IconReportAnalytics size={20} stroke={1.5} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Refunds Issued
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {formatNumber(data.summary.totalRefundsIssued)} TZS
                </Typography>
              </Box>
            </Stack>

            <Button variant="contained" fullWidth>
              View Full Tax Report
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default RevenueUpdates;
