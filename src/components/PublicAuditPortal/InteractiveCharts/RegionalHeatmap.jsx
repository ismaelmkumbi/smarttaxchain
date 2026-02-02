import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { Info as InfoIcon, Map as MapIcon } from '@mui/icons-material';
import DataDownloader from '../DataDownloader';

// Mock regional data for Tanzania (moved outside component)
const mockRegionalData = [
  {
    region: 'Dar es Salaam',
    revenue: 28500000000,
    compliance: 96,
    businesses: 45000,
    population: 4364541,
    coordinates: [-6.7924, 39.2083],
  },
  {
    region: 'Mwanza',
    revenue: 8200000000,
    compliance: 89,
    businesses: 12500,
    population: 2772509,
    coordinates: [-2.5164, 32.9175],
  },
  {
    region: 'Arusha',
    revenue: 6800000000,
    compliance: 92,
    businesses: 9800,
    population: 1694310,
    coordinates: [-3.3869, 36.683],
  },
  {
    region: 'Mbeya',
    revenue: 4500000000,
    compliance: 85,
    businesses: 7200,
    population: 2707410,
    coordinates: [-8.9094, 33.4607],
  },
  {
    region: 'Morogoro',
    revenue: 3200000000,
    compliance: 88,
    businesses: 5600,
    population: 2218492,
    coordinates: [-6.8235, 37.6536],
  },
  {
    region: 'Tanga',
    revenue: 2800000000,
    compliance: 90,
    businesses: 4800,
    population: 2045205,
    coordinates: [-5.0678, 39.1019],
  },
  {
    region: 'Dodoma',
    revenue: 2100000000,
    compliance: 87,
    businesses: 3900,
    population: 2083588,
    coordinates: [-6.163, 35.7516],
  },
  {
    region: 'Tabora',
    revenue: 1800000000,
    compliance: 83,
    businesses: 3200,
    population: 2291623,
    coordinates: [-5.0167, 32.8],
  },
];

const TRA_YELLOW = '#f5e800';
const TRA_BLACK = '#000000';
const TRA_WHITE = '#ffffff';

const RegionalHeatmap = ({ data = [], title, height = 500 }) => {
  const { t } = useTranslation();
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Use useMemo to prevent infinite re-renders
  const regionalData = useMemo(() => {
    return data.length > 0 ? data : mockRegionalData;
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

  const getIntensityColor = (value, metric) => {
    let intensity;

    if (metric === 'revenue') {
      const maxRevenue = Math.max(...regionalData.map((r) => r.revenue));
      intensity = value / maxRevenue;
    } else if (metric === 'compliance') {
      intensity = value / 100;
    } else if (metric === 'businesses') {
      const maxBusinesses = Math.max(...regionalData.map((r) => r.businesses));
      intensity = value / maxBusinesses;
    }

    // Generate color based on intensity (0-1)
    const hue = metric === 'compliance' ? 120 : metric === 'revenue' ? 240 : 200; // Green for compliance, blue for revenue, cyan for businesses
    const saturation = 70;
    const lightness = 90 - intensity * 40; // Darker for higher values

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getMetricValue = (region, metric) => {
    switch (metric) {
      case 'revenue':
        return formatCurrency(region.revenue);
      case 'compliance':
        return `${region.compliance}%`;
      case 'businesses':
        return region.businesses.toLocaleString();
      default:
        return region.revenue;
    }
  };

  const getMetricLabel = (metric) => {
    switch (metric) {
      case 'revenue':
        return t('dashboard.totalRevenue');
      case 'compliance':
        return t('dashboard.taxCompliance');
      case 'businesses':
        return t('dashboard.activeBusinesses');
      default:
        return 'Revenue';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapIcon color="primary" />
            <Typography variant="h6" component="h2">
              {title || t('charts.revenueByRegion')}
            </Typography>
            <Tooltip title={t('a11y.chartDescription') + ' regional heatmap'}>
              <IconButton size="small" aria-label="Heatmap information">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Metric</InputLabel>
              <Select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                label="Metric"
                aria-label="Select metric to display"
              >
                <MenuItem value="revenue">Revenue</MenuItem>
                <MenuItem value="compliance">Compliance</MenuItem>
                <MenuItem value="businesses">Businesses</MenuItem>
              </Select>
            </FormControl>

            <DataDownloader data={regionalData} filename="regional_data" title="Regional Data" />
          </Box>
        </Box>

        {/* Heatmap Grid */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            {regionalData
              .sort((a, b) => b[selectedMetric] - a[selectedMetric])
              .map((region, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={region.region}>
                  <Tooltip
                    title={
                      <Box>
                        <Typography variant="subtitle2">{region.region}</Typography>
                        <Typography variant="body2">
                          Revenue: {formatCurrency(region.revenue)}
                        </Typography>
                        <Typography variant="body2">Compliance: {region.compliance}%</Typography>
                        <Typography variant="body2">
                          Businesses: {region.businesses.toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          Population: {region.population.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  >
                    <Card
                      sx={{
                        backgroundColor: getIntensityColor(region[selectedMetric], selectedMetric),
                        border: 2,
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="h6" component="h3" sx={{ mb: 1, fontSize: '1rem' }}>
                          {region.region}
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                          {getMetricValue(region, selectedMetric)}
                        </Typography>
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </CardContent>
                    </Card>
                  </Tooltip>
                </Grid>
              ))}
          </Grid>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {getMetricLabel(selectedMetric)} Intensity:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: getIntensityColor(0.2, selectedMetric),
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Low</Typography>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: getIntensityColor(0.6, selectedMetric),
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Medium</Typography>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: getIntensityColor(1.0, selectedMetric),
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">High</Typography>
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
          <caption>Regional {getMetricLabel(selectedMetric)} Data</caption>
          <thead>
            <tr>
              <th>Region</th>
              <th>Revenue (TZS)</th>
              <th>Compliance Rate (%)</th>
              <th>Active Businesses</th>
              <th>Population</th>
            </tr>
          </thead>
          <tbody>
            {regionalData.map((region, index) => (
              <tr key={index}>
                <td>{region.region}</td>
                <td>{formatCurrency(region.revenue)}</td>
                <td>{region.compliance}%</td>
                <td>{region.businesses.toLocaleString()}</td>
                <td>{region.population.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegionalHeatmap;
