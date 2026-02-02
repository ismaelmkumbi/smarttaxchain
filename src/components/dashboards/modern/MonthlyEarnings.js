import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight, IconCurrencyDollar } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';

// Utility to format large numbers (e.g., "6.8K", "1.2M")
const formatValue = (value) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
};

const MonthlyEarnings = () => {
  const theme = useTheme();

  // Mocked sparkline and summary data
  const data = useMemo(
    () => ({
      value: 6820, // in million TZS, e.g. 6.82B TZS
      percentChange: 9, // positive = up, negative = down
      series: [25, 66, 20, 40, 12, 58, 20],
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    }),
    [],
  );

  const sparkOptions = useMemo(
    () => ({
      chart: {
        type: 'area',
        sparkline: { enabled: true },
        height: 60,
      },
      stroke: { curve: 'smooth', width: 2 },
      fill: { opacity: 0.1 },
      tooltip: { enabled: false },
    }),
    [],
  );

  const sparkSeries = useMemo(() => [{ data: data.series }], [data.series]);

  const isPositive = data.percentChange >= 0;
  const trendIcon = isPositive ? IconArrowUpRight : IconArrowDownRight;
  const trendColor = isPositive ? theme.palette.success.main : theme.palette.error.main;
  const trendBg = isPositive ? theme.palette.success.light : theme.palette.error.light;

  return (
    <DashboardCard
      title="Monthly Revenue"
      action={
        <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
          <IconCurrencyDollar size={20} stroke={1.5} />
        </Avatar>
      }
      footer={
        <Box sx={{ mt: 1 }}>
          <Chart options={sparkOptions} series={sparkSeries} type="area" height={60} />
        </Box>
      }
    >
      <Stack alignItems="center" spacing={1} sx={{ mt: -1 }}>
        <Typography variant="h3" fontWeight={700} color="textPrimary">
          {formatValue(data.value)} TZS
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ bgcolor: trendBg, width: 28, height: 28 }}>
            {React.createElement(trendIcon, { size: 18, stroke: 1.5, color: trendColor })}
          </Avatar>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: trendColor }}>
            {`${Math.abs(data.percentChange)}%`}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            compared to last month
          </Typography>
        </Stack>
      </Stack>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
