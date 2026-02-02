import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import {
  Refresh,
  Security,
  Timeline,
  Warning,
  CheckCircle,
  Cancel,
  Assessment,
  Person,
} from '@mui/icons-material';
import { Fade, Grow } from '@mui/material';
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
import auditService from 'src/services/auditService';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const AuditStatistics = () => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.fromDate, filters.toDate]);

  const loadStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditService.getAuditStatistics(filters);
      setStatistics(data || {});
    } catch (err) {
      console.error('Error loading audit statistics:', err);
      setError(err.message || 'Failed to load audit statistics');
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (data) => {
    if (!data) return [];
    return Object.keys(data).map((key) => ({
      name: key,
      value: data[key],
    }));
  };

  if (loading && !statistics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Loading audit statistics...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="outlined" onClick={loadStatistics} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  const actionData = prepareChartData(statistics?.byAction);
  const statusData = prepareChartData(statistics?.byStatus);
  const riskData = prepareChartData(statistics?.byRiskLevel);
  const entityData = prepareChartData(statistics?.byEntityType);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Audit Statistics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive audit analytics and insights
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            type="date"
            label="From Date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ width: 180 }}
          />
          <TextField
            type="date"
            label="To Date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ width: 180 }}
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadStatistics}
            disabled={loading}
            sx={{
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              fontWeight: 600,
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Grow in={true} timeout={600}>
            <Card
              sx={{
                bgcolor: 'white',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                borderTop: `4px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 56,
                      height: 56,
                      color: theme.palette.secondary.main,
                    }}
                  >
                    <Security />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Total Logs
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color={theme.palette.secondary.main}>
                      {statistics?.totalLogs || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Grow in={true} timeout={800}>
            <Card
              sx={{
                bgcolor: 'white',
                border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
                borderTop: `4px solid ${theme.palette.success.main}`,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.success.main,
                      width: 56,
                      height: 56,
                      color: 'white',
                    }}
                  >
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Success Rate
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color={theme.palette.success.main}>
                      {statistics?.byStatus?.SUCCESS
                        ? Math.round((statistics.byStatus.SUCCESS / statistics.totalLogs) * 100)
                        : 0}
                      %
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Grow in={true} timeout={1000}>
            <Card
              sx={{
                bgcolor: 'white',
                border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                borderTop: `4px solid ${theme.palette.warning.main}`,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.warning.main,
                      width: 56,
                      height: 56,
                      color: 'white',
                    }}
                  >
                    <Warning />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      High Risk
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color={theme.palette.warning.main}>
                      {(statistics?.byRiskLevel?.HIGH || 0) + (statistics?.byRiskLevel?.CRITICAL || 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Grow in={true} timeout={1200}>
            <Card
              sx={{
                bgcolor: 'white',
                border: `2px solid ${alpha(theme.palette.info.main, 0.3)}`,
                borderTop: `4px solid ${theme.palette.info.main}`,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.info.main,
                      width: 56,
                      height: 56,
                      color: 'white',
                    }}
                  >
                    <Timeline />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Avg Time
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color={theme.palette.info.main}>
                      {statistics?.averageExecutionTime
                        ? Math.round(statistics.averageExecutionTime)
                        : 0}
                      ms
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Timeline Chart */}
        <Grid item xs={12}>
          <Fade in={true} timeout={600}>
            <Card
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Activity Timeline
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={statistics?.timeline || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: theme.palette.text.secondary }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-TZ', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis tick={{ fill: theme.palette.text.secondary }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        name="Logs"
                        dot={{ fill: theme.palette.primary.main }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Action Distribution */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={800}>
            <Card
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Actions Distribution
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={actionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                      <XAxis dataKey="name" tick={{ fill: theme.palette.text.secondary }} />
                      <YAxis tick={{ fill: theme.palette.text.secondary }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                        }}
                      />
                      <Bar dataKey="value" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={1000}>
            <Card
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Status Distribution
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Risk Level Distribution */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={1200}>
            <Card
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Risk Level Distribution
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                      <XAxis type="number" tick={{ fill: theme.palette.text.secondary }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: theme.palette.text.secondary }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                        }}
                      />
                      <Bar dataKey="value" fill={theme.palette.error.main} radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Entity Type Distribution */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={1400}>
            <Card
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Entity Type Distribution
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={entityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {entityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuditStatistics;

