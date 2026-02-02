import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import { IconUserPlus, IconFileInvoice, IconClipboardCheck } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';

// Utility to format numbers (e.g., "1.2K", "3.4M")
const formatCount = (value) => {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
};

const WeeklyTaxStats = () => {
  const theme = useTheme();

  // Mocked sparkline data for the week (Mon-Sun)
  const data = useMemo(
    () => ({
      series: [120, 180, 160, 200, 140, 170, 190], // daily new regs
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      stats: [
        {
          title: 'New Registrations',
          subtitle: 'Taxpayer sign-ups',
          count: 1200,
          change: 15,
          icon: IconUserPlus,
          color: theme.palette.primary.main,
          light: theme.palette.primary.light,
        },
        {
          title: 'Invoices Processed',
          subtitle: 'Successful filings',
          count: 3500,
          change: 8,
          icon: IconFileInvoice,
          color: theme.palette.success.main,
          light: theme.palette.success.light,
        },
        {
          title: 'Audits Completed',
          subtitle: 'Compliance checks',
          count: 250,
          change: -5,
          icon: IconClipboardCheck,
          color: theme.palette.error.main,
          light: theme.palette.error.light,
        },
      ],
    }),
    [theme],
  );

  // Sparkline chart options
  const chartOptions = useMemo(
    () => ({
      chart: { type: 'area', sparkline: { enabled: true }, toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 2 },
      fill: { opacity: 0.1 },
      tooltip: { enabled: false },
      xaxis: { categories: data.categories },
    }),
    [data.categories],
  );

  const chartSeries = useMemo(() => [{ data: data.series }], [data.series]);

  return (
    <DashboardCard title="Weekly Tax Stats" subtitle="Overview of key KPIs">
      <Stack spacing={3}>
        <Box>
          <Chart options={chartOptions} series={chartSeries} type="area" height={100} />
        </Box>
        {data.stats.map((stat, idx) => {
          const isPositive = stat.change >= 0;
          const ChangeIcon = isPositive ? IconClipboardCheck : IconClipboardCheck;
          return (
            <Stack
              key={idx}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: stat.light, color: stat.color, width: 40, height: 40 }}>
                  <stat.icon size={18} stroke={1.5} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} color="textPrimary">
                    {stat.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stat.subtitle}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" fontWeight={700} color="textPrimary">
                  {formatCount(stat.count)}
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: isPositive ? theme.palette.success.light : theme.palette.error.light,
                    width: 28,
                    height: 28,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: isPositive ? theme.palette.success.main : theme.palette.error.main,
                      fontWeight: 600,
                    }}
                  >
                    {isPositive ? `+${stat.change}%` : `${stat.change}%`}
                  </Box>
                </Avatar>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </DashboardCard>
  );
};

export default WeeklyTaxStats;
