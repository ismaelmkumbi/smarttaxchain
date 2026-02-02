import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  Avatar,
  alpha,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Timeline,
  Warning,
  CheckCircle,
  Cancel,
  LocationOn,
  Computer,
  Security,
} from '@mui/icons-material';
import { Fade } from '@mui/material';
import auditService from 'src/services/auditService';

const UserActivityMonitor = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    if (userId) {
      loadActivity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, filters.fromDate, filters.toDate]);

  const loadActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditService.getUserActivity(userId, filters);
      setActivity(data || {});
    } catch (err) {
      console.error('Error loading user activity:', err);
      setError(err.message || 'Failed to load user activity');
      setActivity(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-TZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const prepareChartData = (data) => {
    if (!data) return [];
    return Object.keys(data).map((key) => ({
      name: key,
      value: data[key],
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Loading user activity...</Typography>
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
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/apps/audit/logs')}
          sx={{ mt: 2 }}
        >
          Back to Audit Logs
        </Button>
      </Box>
    );
  }

  const actionData = prepareChartData(activity?.byAction);
  const entityData = prepareChartData(activity?.byEntityType);
  const statusData = prepareChartData(activity?.byStatus);
  const riskData = prepareChartData(activity?.byRiskLevel);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/apps/audit/logs')}
            sx={{
              mb: 2,
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              fontWeight: 600,
              '&:hover': {
                borderColor: theme.palette.secondary.dark,
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
              },
            }}
          >
            Back to Audit Logs
          </Button>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            User Activity Monitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Activity details for User ID: {userId}
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
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
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
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Actions
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color={theme.palette.secondary.main}>
                    {activity?.totalActions || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                    Successful
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color={theme.palette.success.main}>
                    {activity?.byStatus?.SUCCESS || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                    {(activity?.byRiskLevel?.HIGH || 0) + (activity?.byRiskLevel?.CRITICAL || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: 'white',
              border: `2px solid ${alpha(theme.palette.error.main, 0.3)}`,
              borderTop: `4px solid ${theme.palette.error.main}`,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.error.main,
                    width: 56,
                    height: 56,
                    color: 'white',
                  }}
                >
                  <Cancel />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Failed
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color={theme.palette.error.main}>
                    {activity?.byStatus?.FAILED || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
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
                  Actions Breakdown
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Count
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {actionData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} align="center">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        actionData.map((item) => (
                          <TableRow key={item.name}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={item.value}
                                size="small"
                                sx={{
                                  bgcolor: theme.palette.primary.main,
                                  color: theme.palette.secondary.main,
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
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
                  Entity Types
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Entity Type</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Count
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {entityData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} align="center">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        entityData.map((item) => (
                          <TableRow key={item.name}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={item.value}
                                size="small"
                                sx={{
                                  bgcolor: theme.palette.info.main,
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Activity Timeline */}
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
              Activity Timeline
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Timestamp</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Action</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Entity</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Risk Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activity?.timeline?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Timeline sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No activity found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    activity?.timeline?.slice(0, 50).map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2">{formatDate(item.timestamp)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {item.action}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.entityType}: {item.entityId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.status}
                            size="small"
                            sx={{
                              bgcolor:
                                item.status === 'SUCCESS'
                                  ? alpha(theme.palette.success.main, 0.1)
                                  : alpha(theme.palette.error.main, 0.1),
                              color: item.status === 'SUCCESS' ? theme.palette.success.main : theme.palette.error.main,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.riskLevel}
                            size="small"
                            sx={{
                              bgcolor:
                                item.riskLevel === 'HIGH' || item.riskLevel === 'CRITICAL'
                                  ? alpha(theme.palette.error.main, 0.1)
                                  : alpha(theme.palette.warning.main, 0.1),
                              color:
                                item.riskLevel === 'HIGH' || item.riskLevel === 'CRITICAL'
                                  ? theme.palette.error.main
                                  : theme.palette.warning.main,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default UserActivityMonitor;

