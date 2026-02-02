import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Box, Typography, Avatar, Stack } from '@mui/material';
import { IconMapPin, IconBuildingFactory } from '@tabler/icons';
import DashboardWidgetCard from 'src/components/shared/DashboardWidgetCard';

// Utility to format currency in TZS
const formatTZS = (value) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
};

const EmployeeSalary = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const greyLight = theme.palette.grey[100];

  // Mocked data for months Apr–Sept
  const data = useMemo(
    () => ({
      categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      values: [180000000, 210000000, 195000000, 240000000, 200000000, 230000000],
      highest: { district: 'Dar es Salaam', amount: 240000000 },
      average: { district: 'Arusha', amount: 205000000 },
    }),
    [],
  );

  const series = useMemo(() => [{ name: 'Collections', data: data.values }], [data.values]);

  const options = useMemo(
    () => ({
      chart: { type: 'bar', toolbar: { show: false }, sparkline: { enabled: false } },
      colors: data.values.map((val) => (val === data.highest.amount ? primary : greyLight)),
      plotOptions: { bar: { columnWidth: '45%', distributed: true, borderRadius: 4 } },
      dataLabels: { enabled: false },
      xaxis: { categories: data.categories, axisBorder: { show: false } },
      yaxis: { show: false },
      grid: { show: false },
      tooltip: { y: { formatter: (val) => formatTZS(val) + ' TZS' }, theme: theme.palette.mode },
    }),
    [data, primary, greyLight, theme.palette.mode],
  );

  return (
    <DashboardWidgetCard
      title="District Collections"
      subtitle="Monthly Overview"
      dataLabel1="Top District"
      dataItem1={`${data.highest.district}: ${formatTZS(data.highest.amount)} TZS`}
      dataLabel2="Average"
      dataItem2={`${data.average.district}: ${formatTZS(data.average.amount)} TZS`}
    >
      <Box>
        <Chart options={options} series={series} type="bar" height={260} />
      </Box>
    </DashboardWidgetCard>
  );
};

export default EmployeeSalary;
