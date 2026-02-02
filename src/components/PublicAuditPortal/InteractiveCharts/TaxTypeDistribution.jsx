import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tooltip,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Info as InfoIcon, PieChart as PieChartIcon } from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from 'recharts';
import DataDownloader from '../DataDownloader';

// Mock tax type data (moved outside component to prevent re-creation)
const mockTaxData = [
  {
    type: 'VAT',
    typeSwahili: 'Kodi ya Ongezeko la Thamani',
    amount: 35000000000,
    percentage: 35,
    color: '#1976d2',
  },
  {
    type: 'Income Tax',
    typeSwahili: 'Kodi ya Mapato',
    amount: 28000000000,
    percentage: 28,
    color: '#2e7d32',
  },
  {
    type: 'Corporate Tax',
    typeSwahili: 'Kodi ya Makampuni',
    amount: 18000000000,
    percentage: 18,
    color: '#ed6c02',
  },
  {
    type: 'Excise Duty',
    typeSwahili: 'Ushuru wa Bidhaa Maalum',
    amount: 12000000000,
    percentage: 12,
    color: '#d32f2f',
  },
  {
    type: 'Import Duty',
    typeSwahili: 'Ushuru wa Uagizaji',
    amount: 7000000000,
    percentage: 7,
    color: '#7b1fa2',
  },
];

const TRA_YELLOW = '#f5e800';
const TRA_BLACK = '#000000';
const TRA_WHITE = '#ffffff';

const TaxTypeDistribution = ({ data = [], title, height = 400 }) => {
  const { t } = useTranslation();
  const [showPercentages, setShowPercentages] = useState(true);

  // Use useMemo to prevent infinite re-renders
  const taxData = useMemo(() => {
    return data.length > 0 ? data : mockTaxData;
  }, [data]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: TRA_BLACK,
            p: 2,
            border: 1,
            borderColor: TRA_YELLOW,
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {data.type}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {data.typeSwahili}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Amount: {formatCurrency(data.amount)}
          </Typography>
          <Typography variant="body2">Percentage: {data.percentage}%</Typography>
        </Box>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (!showPercentages) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={TRA_WHITE}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: TRA_BLACK,
          font: { weight: 'bold' },
        },
      },
      tooltip: {
        backgroundColor: TRA_BLACK,
        titleColor: TRA_YELLOW,
        bodyColor: TRA_WHITE,
      },
    },
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PieChartIcon color="primary" />
            <Typography variant="h6" component="h2">
              {title || t('charts.taxTypeDistribution')}
            </Typography>
            <Tooltip title={t('a11y.chartDescription') + ' tax type distribution'}>
              <IconButton size="small" aria-label="Chart information">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showPercentages}
                  onChange={(e) => setShowPercentages(e.target.checked)}
                  size="small"
                />
              }
              label="Show %"
              sx={{ m: 0 }}
            />

            <DataDownloader
              data={taxData}
              filename="tax_type_distribution"
              title="Tax Type Distribution"
            />
          </Box>
        </Box>

        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taxData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={120}
                fill={TRA_YELLOW}
                dataKey="amount"
              >
                {taxData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
                    {value} ({formatCurrency(entry.payload.amount)})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary Statistics */}
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Summary Statistics
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="h6">
                {formatCurrency(taxData.reduce((sum, item) => sum + item.amount, 0))}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Largest Category
              </Typography>
              <Typography variant="h6">{taxData.length > 0 ? taxData[0].type : 'N/A'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Number of Categories
              </Typography>
              <Typography variant="h6">{taxData.length}</Typography>
            </Box>
          </Box>
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
          <caption>Tax Type Distribution Data</caption>
          <thead>
            <tr>
              <th>Tax Type</th>
              <th>Tax Type (Swahili)</th>
              <th>Amount (TZS)</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {taxData.map((item, index) => (
              <tr key={index}>
                <td>{item.type}</td>
                <td>{item.typeSwahili}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaxTypeDistribution;
