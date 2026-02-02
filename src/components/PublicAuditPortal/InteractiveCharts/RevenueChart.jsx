import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import DataDownloader from '../DataDownloader';

// Mock data for demonstration (moved outside component to prevent re-creation)
const mockData = [
  { month: 'Jan 2024', revenue: 45000000000, compliance: 92, businesses: 125000 },
  { month: 'Feb 2024', revenue: 48000000000, compliance: 94, businesses: 127000 },
  { month: 'Mar 2024', revenue: 52000000000, compliance: 91, businesses: 129000 },
  { month: 'Apr 2024', revenue: 49000000000, compliance: 93, businesses: 131000 },
  { month: 'May 2024', revenue: 55000000000, compliance: 95, businesses: 133000 },
  { month: 'Jun 2024', revenue: 58000000000, compliance: 96, businesses: 135000 },
  { month: 'Jul 2024', revenue: 61000000000, compliance: 94, businesses: 137000 },
  { month: 'Aug 2024', revenue: 59000000000, compliance: 93, businesses: 139000 },
  { month: 'Sep 2024', revenue: 63000000000, compliance: 97, businesses: 141000 },
  { month: 'Oct 2024', revenue: 66000000000, compliance: 95, businesses: 143000 },
  { month: 'Nov 2024', revenue: 64000000000, compliance: 96, businesses: 145000 },
  { month: 'Dec 2024', revenue: 68000000000, compliance: 98, businesses: 147000 },
];

// Define TRA brand colors
const TRA_YELLOW = '#f5e800';
const TRA_BLACK = '#000000';
const TRA_WHITE = '#ffffff';

const RevenueChart = ({ data = [], title, height = 400 }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('12months');

  // Use useMemo to prevent infinite re-renders
  const filteredData = useMemo(() => {
    const dataToUse = data.length > 0 ? data : mockData;

    // Filter data based on time range
    let filtered = dataToUse;
    if (timeRange === '6months') {
      filtered = dataToUse.slice(-6);
    } else if (timeRange === '3months') {
      filtered = dataToUse.slice(-3);
    }

    return filtered;
  }, [data, timeRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: TRA_BLACK,
            p: 2,
            border: 1,
            borderColor: TRA_YELLOW + '33',
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, color: TRA_YELLOW }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}:{' '}
              {entry.dataKey === 'revenue'
                ? formatCurrency(entry.value)
                : entry.dataKey === 'compliance'
                ? `${entry.value}%`
                : entry.value.toLocaleString()}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="h2">
              {title || t('charts.monthlyTrends')}
            </Typography>
            <Tooltip
              title={t('a11y.chartDescription') + ' ' + (title || t('charts.monthlyTrends'))}
            >
              <IconButton size="small" aria-label="Chart information">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                aria-label="Time range selection"
              >
                <MenuItem value="3months">3 Months</MenuItem>
                <MenuItem value="6months">6 Months</MenuItem>
                <MenuItem value="12months">12 Months</MenuItem>
              </Select>
            </FormControl>

            <DataDownloader data={filteredData} filename="revenue_trends" title="Revenue Trends" />
          </Box>
        </Box>

        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12, color: TRA_BLACK }} aria-label="Month" />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12, color: TRA_BLACK }}
                aria-label="Revenue in TZS"
              />
              <YAxis
                yAxisId="compliance"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12, color: TRA_BLACK }}
                aria-label="Compliance percentage"
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke={TRA_YELLOW}
                strokeWidth={3}
                name="Revenue (TZS)"
                dot={{ fill: TRA_YELLOW, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="compliance"
                type="monotone"
                dataKey="compliance"
                stroke={TRA_YELLOW}
                strokeWidth={2}
                name="Compliance Rate (%)"
                dot={{ fill: TRA_YELLOW, strokeWidth: 2, r: 3 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Accessibility table for screen readers */}
        <Box
          component="table"
          sx={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
          aria-label={t('a11y.dataTable')}
        >
          <caption>{title || t('charts.monthlyTrends')}</caption>
          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue (TZS)</th>
              <th>Compliance Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.month}</td>
                <td>{formatCurrency(item.revenue)}</td>
                <td>{item.compliance}%</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
