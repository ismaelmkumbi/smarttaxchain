import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Search,
  Warning,
  Business,
  Person,
  Assessment,
  Add,
  FilterList,
  Domain,
  MonetizationOn,
  ListAlt,
  Paid,
} from '@mui/icons-material';

const mockTaxpayers = [
  {
    id: '1',
    name: 'John Smith',
    tin: '145288-TZ',
    type: 'Individual',
    sector: 'Agriculture',
    region: 'Arusha',
    lastAssessment: '2024-03-15',
    assessments: 3,
    unpaid: true,
    totalTaxDue: 1250000,
    assessmentStatus: 'Pending',
  },
  {
    id: '2',
    name: 'Jane Co. Ltd',
    tin: '738820-TZ',
    type: 'Business',
    sector: 'Retail',
    region: 'Dar es Salaam',
    lastAssessment: '2024-02-28',
    assessments: 5,
    unpaid: false,
    totalTaxDue: 0,
    assessmentStatus: 'Completed',
  },
  {
    id: '3',
    name: 'Green Energy NGO',
    tin: '992165-TZ',
    type: 'NGO',
    sector: 'Energy',
    region: 'Mwanza',
    lastAssessment: '2024-04-01',
    assessments: 2,
    unpaid: true,
    totalTaxDue: 750000,
    assessmentStatus: 'In Progress',
  },
  {
    id: '4',
    name: 'City Water Authority',
    tin: '441203-TZ',
    type: 'Gov Agency',
    sector: 'Utilities',
    region: 'Dodoma',
    lastAssessment: '2024-01-10',
    assessments: 7,
    unpaid: false,
    totalTaxDue: 0,
    assessmentStatus: 'Completed',
  },
  {
    id: '5',
    name: 'Sara Johnson',
    tin: '667234-TZ',
    type: 'Individual',
    sector: 'Professional Services',
    region: 'Arusha',
    lastAssessment: '2024-03-28',
    assessments: 4,
    unpaid: true,
    totalTaxDue: 890000,
    assessmentStatus: 'Pending',
  },
];

const StatsCard = ({ icon, title, value, color }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 2,
        bgcolor: theme.palette[color].light,
        color: theme.palette[color].dark,
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: theme.palette[color].main }}>{icon}</Avatar>
        <Box>
          <Typography variant="subtitle2" color="inherit">
            {title}
          </Typography>
          <Typography variant="h6" color="inherit">
            {value}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

const getStatusColor = (status, theme) => {
  switch (status) {
    case 'Completed':
      return theme.palette.success.main;
    case 'In Progress':
      return theme.palette.warning.main;
    case 'Pending':
      return theme.palette.error.main;
    default:
      return theme.palette.text.secondary;
  }
};

const getAvatarProps = (type, theme) => {
  switch (type) {
    case 'Business':
      return { icon: <Business />, color: theme.palette.info.main };
    case 'NGO':
      return { icon: <Domain />, color: theme.palette.warning.main };
    case 'Gov Agency':
      return { icon: <Domain />, color: theme.palette.success.main };
    default:
      return { icon: <Person />, color: theme.palette.primary.main };
  }
};

const TaxpayerCard = ({ taxpayer }) => {
  const theme = useTheme();
  const { icon, color } = getAvatarProps(taxpayer.type, theme);

  return (
    <Card
      elevation={3}
      sx={{
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: color }}>{icon}</Avatar>}
        title={
          <Typography variant="h6" component="div">
            {taxpayer.name}
            {taxpayer.unpaid && <Warning color="error" sx={{ ml: 1, fontSize: '1.2rem' }} />}
          </Typography>
        }
        subheader={
          <Box sx={{ mt: 0.5 }}>
            <Chip label={taxpayer.tin} size="small" variant="outlined" sx={{ mr: 1 }} />
            <Chip label={taxpayer.region} size="small" color="secondary" />
          </Box>
        }
      />
      <Divider variant="middle" />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Tax Type:
            </Typography>
            <Typography variant="body1">{taxpayer.type}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Sector:
            </Typography>
            <Typography variant="body1">{taxpayer.sector}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Last Assessment:
            </Typography>
            <Typography variant="body1">
              {new Date(taxpayer.lastAssessment).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Assessments:
            </Typography>
            <Typography variant="body1">{taxpayer.assessments}</Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            startIcon={<Assessment />}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            View Details
          </Button>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Chip
              label={taxpayer.assessmentStatus}
              size="small"
              sx={{
                bgcolor: getStatusColor(taxpayer.assessmentStatus, theme) + '20',
                color: getStatusColor(taxpayer.assessmentStatus, theme),
                mb: 0.5,
              }}
            />
            {taxpayer.unpaid && (
              <Typography variant="body2" color="error">
                Due: TZS {taxpayer.totalTaxDue.toLocaleString()}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const EmptyState = () => (
  <Paper
    sx={{
      p: 4,
      textAlign: 'center',
      backgroundColor: 'background.default',
    }}
  >
    <Search sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
    <Typography variant="h6" gutterBottom>
      No matching taxpayers found
    </Typography>
    <Typography color="text.secondary">
      Try adjusting your search filters or register a new taxpayer
    </Typography>
  </Paper>
);

export default function SelectTaxpayerPage() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    sector: '',
    region: '',
  });

  const filteredTaxpayers = mockTaxpayers.filter((taxpayer) => {
    const matchesSearch =
      taxpayer.name.toLowerCase().includes(search.toLowerCase()) || taxpayer.tin.includes(search);
    const matchesFilters = Object.entries(filters).every(
      ([key, value]) => !value || taxpayer[key] === value,
    );
    return matchesSearch && matchesFilters;
  });

  // Calculate metrics
  const totalTaxpayers = filteredTaxpayers.length;
  const totalAssessments = filteredTaxpayers.reduce((sum, t) => sum + t.assessments, 0);
  const totalUnpaid = filteredTaxpayers
    .filter((t) => t.unpaid)
    .reduce((sum, t) => sum + t.totalTaxDue, 0);
  const averageUnpaid = totalUnpaid / (filteredTaxpayers.filter((t) => t.unpaid).length || 1);

  const statusDistribution = filteredTaxpayers.reduce((acc, t) => {
    acc[t.assessmentStatus] = (acc[t.assessmentStatus] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box sx={{ p: 4, maxWidth: 1600, margin: '0 auto' }}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Tax Assessment Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search and manage taxpayer assessment records
          </Typography>
        </Box>
        <Chip
          label="Auditor | TRA Arusha Office"
          color="primary"
          variant="outlined"
          sx={{ px: 2, py: 1 }}
        />
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<Person />}
            title="Total Taxpayers"
            value={totalTaxpayers}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<ListAlt />}
            title="Total Assessments"
            value={totalAssessments}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<MonetizationOn />}
            title="Unpaid Balance"
            value={`TZS ${totalUnpaid.toLocaleString()}`}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<Paid />}
            title="Avg. Unpaid"
            value={`TZS ${Math.round(averageUnpaid).toLocaleString()}`}
            color="warning"
          />
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search taxpayers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {['type', 'sector', 'region'].map((filter) => (
            <Grid item xs={12} md={2.5} key={filter}>
              <TextField
                select
                fullWidth
                label={`${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                value={filters[filter]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [filter]: e.target.value,
                  }))
                }
                variant="outlined"
              >
                <MenuItem value="">All</MenuItem>
                {[...new Set(mockTaxpayers.map((t) => t[filter]))].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {filteredTaxpayers.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="subtitle1" gutterBottom>
              Assessment Status Distribution:
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <Chip
                  key={status}
                  label={`${status}: ${count}`}
                  variant="outlined"
                  sx={{
                    borderColor: getStatusColor(status, theme),
                    color: getStatusColor(status, theme),
                  }}
                />
              ))}
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {filteredTaxpayers.map((taxpayer) => (
              <Grid item xs={12} sm={6} lg={4} key={taxpayer.id}>
                <TaxpayerCard taxpayer={taxpayer} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          display: 'flex',
          gap: 2,
        }}
      >
        <Button variant="contained" color="primary" startIcon={<Add />} sx={{ borderRadius: 50 }}>
          New Taxpayer
        </Button>
        <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: 50 }}>
          Save Filters
        </Button>
      </Box>
    </Box>
  );
}
