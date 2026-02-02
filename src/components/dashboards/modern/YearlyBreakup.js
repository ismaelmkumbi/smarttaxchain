import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import { IconArrowUpRight } from '@tabler/icons';
import DashboardCard from 'src/components/shared/DashboardCard';

// Utility to format numbers (e.g., "120B TZS")
const formatValue = (value) => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
};

const YearlyBreakup = () => {
  const theme = useTheme();

  // Mocked annual data; replace with API data
  const data = useMemo(
    () => ({
      total: 120e9,
      growth: 0.12, // 12%
      categories: [
        { name: 'Income Tax', value: 54e9 },
        { name: 'VAT', value: 36e9 },
        { name: 'Excise', value: 18e9 },
        { name: 'Other', value: 12e9 },
      ],
    }),
    [],
  );

  const series = useMemo(() => data.categories.map((cat) => cat.value), [data]);

  const labels = useMemo(() => data.categories.map((cat) => cat.name), [data]);

  const colors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  const options = useMemo(
    () => ({
      chart: {
        type: 'donut',
        sparkline: { enabled: true },
      },
      labels,
      colors,
      legend: { show: false },
      dataLabels: { enabled: false },
      tooltip: {
        y: { formatter: (val) => `${formatValue(val)} TZS` },
      },
      plotOptions: {
        pie: {
          donut: { size: '70%' },
        },
      },
    }),
    [labels, colors],
  );

  return (
    <DashboardCard title="Annual Revenue Breakdown">
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={7}>
          <Box textAlign="center">
            <Typography variant="h3" fontWeight={700} gutterBottom>
              {formatValue(data.total)} TZS
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <Avatar sx={{ bgcolor: theme.palette.success.light, width: 28, height: 28 }}>
                <IconArrowUpRight size={20} stroke={1.5} color={theme.palette.success.main} />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={600} color="success.main">
                +{(data.growth * 100).toFixed(0)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                since last year
              </Typography>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Chart options={options} series={series} type="donut" height={180} />
          <Stack spacing={1} mt={2}>
            {data.categories.map((cat, idx) => (
              <Stack key={cat.name} direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: colors[idx],
                    borderRadius: 1,
                  }}
                />
                <Typography variant="body2" color="text.primary">
                  {cat.name} — {((cat.value / data.total) * 100).toFixed(1)}%
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
