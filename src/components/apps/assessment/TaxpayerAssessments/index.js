import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
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
  alpha,
  InputAdornment,
  MenuItem,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Search,
  FilterList,
  Print,
  Download,
  Business,
  Person,
  Phone,
  Email,
  LocationOn,
  MonetizationOn,
  Assessment,
  Warning,
  CheckCircle,
  Refresh,
  Close,
} from '@mui/icons-material';
import { Fade, Grow, Dialog, DialogTitle, DialogContent, Snackbar, Alert } from '@mui/material';
import api from 'src/services/api';
import taxAssessmentService from 'src/services/taxAssessmentService';
import AssessmentCreationWizard from '../AssessmentCreationWizard';

const TaxpayerAssessments = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { tin } = useParams();
  const [loading, setLoading] = useState(true);
  const [taxpayer, setTaxpayer] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [taxTypeFilter, setTaxTypeFilter] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tin]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load taxpayer
      const taxpayerResponse = await api.get('/taxpayers');
      const foundTaxpayer = taxpayerResponse.taxpayers?.find((tp) => tp.TIN === tin);
      if (foundTaxpayer) {
        setTaxpayer(foundTaxpayer);
      } else {
        setError('Taxpayer not found');
        return;
      }

      // Load assessments for this TIN
      const assessmentsResponse = await taxAssessmentService.getAllAssessmentsByTin(tin);
      setAssessments(Array.isArray(assessmentsResponse) ? assessmentsResponse : []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      !search ||
      (assessment.ID || '').toLowerCase().includes(search.toLowerCase()) ||
      (assessment.TaxType || '').toLowerCase().includes(search.toLowerCase()) ||
      (assessment.Description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || (assessment.Status || assessment.status) === statusFilter;
    const matchesTaxType = !taxTypeFilter || (assessment.TaxType || assessment.taxType) === taxTypeFilter;
    return matchesSearch && matchesStatus && matchesTaxType;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-TZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status, theme) => {
    const statusMap = {
      PENDING: { bg: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main },
      OPEN: { bg: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main },
      PAID: { bg: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main },
      DISPUTED: { bg: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main },
      OVERDUE: { bg: alpha(theme.palette.error.dark, 0.1), color: theme.palette.error.dark },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  // Calculate metrics
  const metrics = {
    total: filteredAssessments.length,
    totalAmount: filteredAssessments.reduce((sum, a) => sum + (a.Amount || a.amount || 0), 0),
    paid: filteredAssessments.filter((a) => (a.Status || a.status) === 'PAID').length,
    pending: filteredAssessments.filter((a) => (a.Status || a.status) === 'PENDING').length,
    overdue: filteredAssessments.filter((a) => (a.Status || a.status) === 'OVERDUE').length,
    totalDue: filteredAssessments
      .filter((a) => ['PENDING', 'OPEN', 'OVERDUE'].includes(a.Status || a.status))
      .reduce((sum, a) => sum + (a.TotalDue || a.totalDue || a.Amount || a.amount || 0), 0),
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !taxpayer) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error || 'Taxpayer not found'}
        </Typography>
        <Button 
          variant="outlined"
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/apps/assessment/list')} 
          sx={{ 
            mt: 2,
            borderColor: theme.palette.secondary.main,
            color: theme.palette.secondary.main,
            fontWeight: 600,
            '&:hover': {
              borderColor: theme.palette.secondary.dark,
              bgcolor: alpha(theme.palette.secondary.main, 0.05),
              color: theme.palette.secondary.main,
            },
          }}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Fade in={true} timeout={600}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Button 
              variant="outlined"
              startIcon={<ArrowBack />} 
              onClick={() => navigate('/apps/assessment/list')} 
              sx={{ 
                mb: 2,
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
                fontWeight: 600,
                '&:hover': {
                  borderColor: theme.palette.secondary.dark,
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  color: theme.palette.secondary.main,
                },
              }}
            >
              Back to List
            </Button>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Taxpayer Assessments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {taxpayer.Name} ({taxpayer.TIN})
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="outlined" 
              startIcon={<Refresh />} 
              onClick={loadData}
              sx={{
                borderColor: theme.palette.secondary.main, // TRA Black
                color: theme.palette.secondary.main, // TRA Black
                fontWeight: 600,
                '&:hover': {
                  borderColor: theme.palette.secondary.dark,
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  color: theme.palette.secondary.main,
                },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateModalOpen(true)}
              sx={{
                bgcolor: '#002855',
                color: 'white',
                fontWeight: 600,
                '&:hover': { 
                  bgcolor: '#001B3D',
                },
              }}
            >
              New Assessment
            </Button>
          </Stack>
        </Box>
      </Fade>

      {/* Taxpayer Info Card */}
      <Grow in={true} timeout={800}>
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'white', border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`, borderTop: `4px solid ${theme.palette.primary.main}` }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main, color: theme.palette.secondary.main, fontSize: '2rem', fontWeight: 700 }}>
                    {taxpayer.Name?.charAt(0) || 'T'}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {taxpayer.Name}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Chip label={`TIN: ${taxpayer.TIN}`} size="small" />
                      <Chip label={taxpayer.Type} size="small" color="primary" variant="outlined" />
                      <Chip label={taxpayer.BusinessCategory} size="small" />
                    </Stack>
                    <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {taxpayer.PhoneNumber && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2">{taxpayer.PhoneNumber}</Typography>
                        </Box>
                      )}
                      {taxpayer.ContactEmail && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{taxpayer.ContactEmail}</Typography>
                        </Box>
                      )}
                      {taxpayer.RegistrationAddress && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2">{taxpayer.RegistrationAddress}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Compliance Score
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {taxpayer.ComplianceScore || 100}
                  </Typography>
                  <Chip
                    label={taxpayer.RiskLevel || 'LOW'}
                    size="small"
                    color={taxpayer.RiskLevel === 'LOW' ? 'success' : 'warning'}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grow>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { icon: <Assessment />, title: 'Total Assessments', value: metrics.total, color: 'primary' },
          { icon: <MonetizationOn />, title: 'Total Amount', value: formatCurrency(metrics.totalAmount), color: 'info' },
          { icon: <CheckCircle />, title: 'Paid', value: metrics.paid, color: 'success' },
          { icon: <Warning />, title: 'Pending', value: metrics.pending, color: 'warning' },
          { icon: <Warning />, title: 'Overdue', value: metrics.overdue, color: 'error' },
          { icon: <MonetizationOn />, title: 'Total Due', value: formatCurrency(metrics.totalDue), color: 'error' },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Grow in={true} timeout={600 + index * 100}>
              <Card
                sx={{
                  p: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette[stat.color].main, 0.1)} 0%, ${alpha(theme.palette[stat.color].main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette[stat.color].main, 0.2)}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: theme.palette[stat.color].main, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color={theme.palette[stat.color].main}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          bgcolor: 'white',
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search assessments..."
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
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="DISPUTED">Disputed</MenuItem>
              <MenuItem value="OVERDUE">Overdue</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Tax Type"
              value={taxTypeFilter}
              onChange={(e) => setTaxTypeFilter(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="VAT">VAT</MenuItem>
              <MenuItem value="Income Tax">Income Tax</MenuItem>
              <MenuItem value="PAYE">PAYE</MenuItem>
              <MenuItem value="CIT">CIT</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Assessments Table */}
      <Fade in={true} timeout={1000}>
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: theme.palette.secondary.main, // TRA Black
                  borderBottom: `2px solid ${theme.palette.primary.main}`, // TRA Yellow accent
                }}
              >
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>Assessment ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>Tax Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>Period</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>Total Due</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', py: 2 }}>Due Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', py: 2 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Assessment sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No assessments found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create a new assessment for this taxpayer
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssessments.map((assessment, index) => {
                  const status = assessment.Status || assessment.status || 'PENDING';
                  const statusColors = getStatusColor(status, theme);
                  const assessmentId = assessment.ID || assessment.id;
                  const amount = assessment.Amount || assessment.amount || 0;
                  const totalDue = assessment.TotalDue || assessment.totalDue || amount;

                  return (
                    <TableRow
                      key={assessmentId || index}
                      hover
                      sx={{
                        bgcolor: 'white',
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.grey[100], 0.8),
                          transform: 'scale(1.001)',
                        },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => navigate(`/tax/assessment/detail/${assessmentId}`)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {assessmentId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} color="text.primary">
                          {assessment.TaxType || assessment.taxType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {assessment.Period || assessment.period || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {formatCurrency(amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color={theme.palette.secondary.main}>
                          {formatCurrency(totalDue)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          size="small"
                          sx={{
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 700,
                            border: `1px solid ${alpha(statusColors.color, 0.3)}`,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(assessment.DueDate || assessment.dueDate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/tax/assessment/detail/${assessmentId}`)}
                              sx={{
                                color: theme.palette.secondary.main, // TRA Black
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                  color: theme.palette.secondary.dark,
                                },
                              }}
                            >
                              <Assessment fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>

      {/* Create Assessment Modal */}
      <Dialog 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        fullWidth 
        maxWidth="lg"
      >
        <DialogTitle 
          sx={{ 
            bgcolor: '#002855', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Create New Assessment for {taxpayer?.Name}
          </Typography>
          <IconButton
            onClick={() => setCreateModalOpen(false)}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <AssessmentCreationWizard
            taxpayerOptions={taxpayer ? [{
              ...taxpayer,
              display: `${taxpayer.Name} (${taxpayer.TIN})`,
              name: taxpayer.Name,
              tin: taxpayer.TIN,
            }] : []}
            defaultTaxpayer={taxpayer ? {
              ...taxpayer,
              display: `${taxpayer.Name} (${taxpayer.TIN})`,
              name: taxpayer.Name,
              tin: taxpayer.TIN,
            } : null}
            loading={creating}
            onComplete={async (assessmentData) => {
              setCreating(true);
              try {
                // Ensure period is calculated correctly
                const period = assessmentData.period || `${assessmentData.year}-Q${assessmentData.quarter}`;

                // Add default values for fields not in wizard
                const payload = {
                  ...assessmentData,
                  period,
                  status: 'PENDING',
                  penalties: 0,
                  interest: 0,
                  taxpayerId: assessmentData.tin || tin, // Use TIN from URL or form
                  tin: assessmentData.tin || tin, // Ensure TIN is set
                };

                const response = await taxAssessmentService.createAssessment(payload);
                console.log('Assessment created:', response);

                // Extract assessment ID from response (handle different response structures)
                const assessmentId = response?.data?.assessment?.ID || 
                                   response?.assessment?.ID || 
                                   response?.data?.assessment?.id ||
                                   response?.assessment?.id ||
                                   'Assessment';
                
                // Show success notification
                setSnackbar({
                  open: true,
                  message: `Assessment ${assessmentId} created successfully!`,
                  severity: 'success',
                });

                // Show success message with ledger info if available
                if (response.ledgerEvents && response.ledgerEvents.length > 0) {
                  const txId = response.ledgerEvents[0].tx_id || 'N/A';
                  console.log('Ledger entry created:', txId);
                }

                setCreateModalOpen(false);
                await loadData(); // Refresh the assessments list
              } catch (error) {
                console.error('Error creating assessment:', error);
                const errorMessage = error?.response?.data?.error?.message ||
                                   error?.response?.data?.message ||
                                   error?.message ||
                                   'Failed to create assessment';
                setSnackbar({
                  open: true,
                  message: errorMessage,
                  severity: 'error',
                });
              } finally {
                setCreating(false);
              }
            }}
            onCancel={() => setCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaxpayerAssessments;

