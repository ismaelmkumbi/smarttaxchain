// src/components/apps/compliance/ComplianceMonitoring.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  LinearProgress,
  CircularProgress,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
  Slider,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Download,
  Upload,
  Calculate,
  Receipt,
  Payment,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  Block,
  VerifiedUser,
  Timeline,
  Assessment,
  Business,
  MonetizationOn,
  Analytics,
  AccountBalance,
  IntegrationInstructions,
  MobileFriendly,
  Notifications,
  Speed,
  Shield,
  AutoAwesome,
  DataUsage,
  Public,
  Smartphone,
  Security,
  Gavel,
  Schedule,
  Flag,
  PriorityHigh,
  LowPriority,
  ExpandMore,
  Star,
  StarBorder,
  StarHalf,
} from '@mui/icons-material';
import {
  IconEye,
  IconShield,
  IconBrain,
  IconDatabase,
  IconWorld,
  IconDeviceMobile,
  IconChartBar,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconClock,
  IconRefresh,
  IconDownload,
  IconUpload,
  IconSearch,
  IconFilter,
  IconSettings,
  IconHelp,
  IconInfoCircle,
  IconTrendingUp,
  IconTrendingDown,
  IconActivity,
  IconUsers,
  IconFileText,
  IconCalculator,
  IconReceipt2,
  IconCreditCard,
  IconWallet,
  IconQrcode,
  IconFingerprint,
  IconLock,
  IconKey,
  IconCertificate,
  IconShieldCheck,
  IconShieldX,
  IconShieldLock,
  IconShieldOff,
} from '@tabler/icons';
import { useTRA } from '../../../context/TRAContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Compliance Score Card Component
const ComplianceScoreCard = ({ taxpayer, onViewDetails }) => {
  const theme = useTheme();

  // Normalize compliance score - handle different field names and ensure it's a valid number
  const complianceScore = Number(
    taxpayer.complianceScore ||
      taxpayer.ComplianceScore ||
      taxpayer.score ||
      taxpayer.Score ||
      0,
  );
  // Ensure score is between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, complianceScore || 0));

  // Normalize other fields
  const name = taxpayer.name || taxpayer.Name || 'N/A';
  const tin = taxpayer.tin || taxpayer.TIN || taxpayer.id || 'N/A';
  const lastAuditDate = taxpayer.lastAuditDate || taxpayer.LastAuditDate || taxpayer.lastAudit || null;

  const getScoreColor = (score) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'LOW', color: 'success' };
    if (score >= 60) return { level: 'MEDIUM', color: 'warning' };
    return { level: 'HIGH', color: 'error' };
  };

  const riskLevel = getRiskLevel(normalizedScore);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar sx={{ bgcolor: getScoreColor(normalizedScore) }}>
            <IconShieldCheck size={24} />
          </Avatar>
          <Chip label={riskLevel.level} color={riskLevel.color} size="small" />
        </Box>

        <Typography variant="h4" color={getScoreColor(normalizedScore)} gutterBottom>
          {normalizedScore}%
        </Typography>

        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          TIN: {tin}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={normalizedScore}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'grey.200',
            mb: 2,
            '& .MuiLinearProgress-bar': {
              bgcolor: getScoreColor(normalizedScore),
            },
          }}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Last Audit:{' '}
            {lastAuditDate
              ? new Date(lastAuditDate).toLocaleDateString()
              : 'N/A'}
          </Typography>
          <Button size="small" variant="outlined" onClick={() => onViewDetails(taxpayer)}>
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Audit Scheduling Form Component
const AuditSchedulingForm = ({ open, onClose, onSubmit, taxpayer = null }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    taxpayerId: '',
    auditType: 'Regular',
    scheduledDate: '',
    auditorId: '',
    reason: '',
    priority: 'medium',
    estimatedDuration: 2,
    blockchainVerification: true,
    automaticScheduling: false,
  });

  useEffect(() => {
    if (taxpayer) {
      setFormData({ ...formData, taxpayerId: taxpayer.id });
    }
  }, [taxpayer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
            <Schedule size={24} />
          </Avatar>
          <Typography variant="h6">Schedule Audit</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Taxpayer ID"
                value={formData.taxpayerId}
                onChange={(e) => setFormData({ ...formData, taxpayerId: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Audit Type</InputLabel>
                <Select
                  value={formData.auditType}
                  label="Audit Type"
                  onChange={(e) => setFormData({ ...formData, auditType: e.target.value })}
                >
                  <MenuItem value="Regular">Regular Audit</MenuItem>
                  <MenuItem value="Compliance">Compliance Audit</MenuItem>
                  <MenuItem value="Risk-Based">Risk-Based Audit</MenuItem>
                  <MenuItem value="Special">Special Investigation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Scheduled Date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Auditor ID"
                value={formData.auditorId}
                onChange={(e) => setFormData({ ...formData, auditorId: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Estimated Duration (days)"
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Audit"
                multiline
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.blockchainVerification}
                    onChange={(e) =>
                      setFormData({ ...formData, blockchainVerification: e.target.checked })
                    }
                  />
                }
                label="Blockchain Verification"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.automaticScheduling}
                    onChange={(e) =>
                      setFormData({ ...formData, automaticScheduling: e.target.checked })
                    }
                  />
                }
                label="Automatic Scheduling"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Schedule Audit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Penalty Management Form Component
const PenaltyManagementForm = ({ open, onClose, onSubmit, taxpayer = null }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    taxpayerId: '',
    penaltyType: 'LateFiling',
    amount: '',
    reason: '',
    dueDate: '',
    gracePeriod: 30,
    automaticCalculation: true,
    blockchainRecord: true,
  });

  useEffect(() => {
    if (taxpayer) {
      setFormData({ ...formData, taxpayerId: taxpayer.id });
    }
  }, [taxpayer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: theme.palette.error.main }}>
            <Gavel size={24} />
          </Avatar>
          <Typography variant="h6">Record Penalty</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Taxpayer ID"
                value={formData.taxpayerId}
                onChange={(e) => setFormData({ ...formData, taxpayerId: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Penalty Type</InputLabel>
                <Select
                  value={formData.penaltyType}
                  label="Penalty Type"
                  onChange={(e) => setFormData({ ...formData, penaltyType: e.target.value })}
                >
                  <MenuItem value="LateFiling">Late Filing</MenuItem>
                  <MenuItem value="LatePayment">Late Payment</MenuItem>
                  <MenuItem value="IncorrectReporting">Incorrect Reporting</MenuItem>
                  <MenuItem value="NonCompliance">Non-Compliance</MenuItem>
                  <MenuItem value="Fraud">Fraud</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Penalty Amount (TZS)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Grace Period (days)"
                type="number"
                value={formData.gracePeriod}
                onChange={(e) => setFormData({ ...formData, gracePeriod: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Penalty"
                multiline
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.automaticCalculation}
                    onChange={(e) =>
                      setFormData({ ...formData, automaticCalculation: e.target.checked })
                    }
                  />
                }
                label="Automatic Calculation"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.blockchainRecord}
                    onChange={(e) =>
                      setFormData({ ...formData, blockchainRecord: e.target.checked })
                    }
                  />
                }
                label="Blockchain Record"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Record Penalty
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Compliance Analytics Component
const ComplianceAnalytics = ({ analyticsData }) => {
  const theme = useTheme();

  const radarData = [
    { factor: 'Timely Filing', score: analyticsData?.timelyFiling || 85 },
    { factor: 'Accurate Reporting', score: analyticsData?.accurateReporting || 78 },
    { factor: 'Payment History', score: analyticsData?.paymentHistory || 92 },
    { factor: 'Documentation', score: analyticsData?.documentation || 88 },
    { factor: 'Cooperation', score: analyticsData?.cooperation || 95 },
  ];

  const complianceTrendData = analyticsData?.trends || [];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Compliance Factors Radar
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="factor" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Compliance Score"
                  dataKey="score"
                  stroke={theme.palette.primary.main}
                  fill={theme.palette.primary.main}
                  fillOpacity={0.3}
                />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Compliance Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Risk Assessment Component
const RiskAssessment = ({ riskData }) => {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return <CheckCircle />;
      case 'medium':
        return <Warning />;
      case 'high':
        return <PriorityHigh />;
      default:
        return <Help />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Risk Assessment
        </Typography>
        <Grid container spacing={2}>
          {riskData?.map((risk, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: getRiskColor(risk.level) + '.light' }}>
                  {getRiskIcon(risk.level)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {risk.factor}
                  </Typography>
                  <Chip label={risk.level} size="small" color={getRiskColor(risk.level)} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Main Compliance Monitoring Component
const ComplianceMonitoring = () => {
  const theme = useTheme();
  const {
    loading,
    error,
    taxpayers,
    complianceDashboard,
    audits,
    penalties,
    loadComplianceDashboard,
    loadComplianceScore,
    scheduleAudit,
    recordPenalty,
    loadComplianceTaxpayers,
    loadRiskAssessment,
    loadAllAudits,
    loadAllPenalties,
    calculateComplianceScore,
    getComplianceReports,
    verifyComplianceRecord,
    loadComplianceAnalytics,
    // Enterprise Audit Module
    loadAuditLogs,
    loadAuditTrail,
    loadHighRiskAudits,
    loadAuditStatistics,
    loadUserAuditActivity,
    searchAuditLogs,
  } = useTRA();

  const [auditFormOpen, setAuditFormOpen] = useState(false);
  const [penaltyFormOpen, setPenaltyFormOpen] = useState(false);
  const [selectedTaxpayer, setSelectedTaxpayer] = useState(null);
  const [filters, setFilters] = useState({
    riskLevel: '',
    complianceScore: '',
    lastAuditDate: '',
  });

  const [complianceTaxpayers, setComplianceTaxpayers] = useState([]);
  const [taxpayersLoading, setTaxpayersLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [auditStats, setAuditStats] = useState(null);
  const [highRiskAudits, setHighRiskAudits] = useState([]);
  const [complianceAuditLogs, setComplianceAuditLogs] = useState([]);

  useEffect(() => {
    loadComplianceDashboardData();
    loadTaxpayersWithCompliance();
    loadAnalytics();
    loadAuditData();
  }, []);

  const loadAuditData = async () => {
    try {
      // Load audit statistics
      const statsResponse = await loadAuditStatistics({
        entityType: 'COMPLIANCE',
        fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
      });
      setAuditStats(statsResponse?.data || statsResponse);

      // Load high-risk compliance operations
      const highRiskResponse = await loadHighRiskAudits({
        entityType: 'COMPLIANCE',
        riskLevel: 'HIGH',
        requiresReview: true,
        pageSize: 10,
      });
      setHighRiskAudits(highRiskResponse?.data?.transactions || highRiskResponse?.transactions || []);

      // Load recent compliance audit logs
      const logsResponse = await loadAuditLogs({
        entityType: 'COMPLIANCE',
        page: 1,
        pageSize: 10,
      });
      setComplianceAuditLogs(logsResponse?.data || logsResponse?.logs || []);
    } catch (error) {
      console.error('Failed to load audit data:', error);
    }
  };

  useEffect(() => {
    // Reload taxpayers when filters change
    loadTaxpayersWithCompliance();
  }, [filters]);

  const loadComplianceDashboardData = async () => {
    try {
      const response = await loadComplianceDashboard();
      // Handle different response structures
      const data = response?.data || response?.dashboard || response;
      setDashboardData(data);
      console.log('Dashboard data loaded:', data);
    } catch (error) {
      console.error('Failed to load compliance dashboard:', error);
      // Set empty dashboard data on error
      setDashboardData(null);
    }
  };

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await loadComplianceAnalytics({});
      // Handle different response structures
      const data = response?.data || response?.analytics || response;
      setAnalyticsData(data);
      console.log('Analytics data loaded:', data);
    } catch (error) {
      console.error('Failed to load compliance analytics:', error);
      setAnalyticsData(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const loadTaxpayersWithCompliance = async () => {
    setTaxpayersLoading(true);
    try {
      const response = await loadComplianceTaxpayers({
        page: 1,
        pageSize: 50,
        ...filters,
      });
      const taxpayersData = response?.data?.taxpayers || response?.taxpayers || [];
      setComplianceTaxpayers(taxpayersData);
    } catch (error) {
      console.error('Failed to load compliance taxpayers:', error);
      setComplianceTaxpayers([]);
    } finally {
      setTaxpayersLoading(false);
    }
  };

  const handleScheduleAudit = async (auditData) => {
    try {
      await scheduleAudit(auditData);
      await Promise.all([
        loadComplianceDashboardData(),
        loadTaxpayersWithCompliance(),
      ]);
    } catch (error) {
      console.error('Failed to schedule audit:', error);
    }
  };

  const handleRecordPenalty = async (penaltyData) => {
    try {
      await recordPenalty(penaltyData);
      await Promise.all([
        loadComplianceDashboardData(),
        loadTaxpayersWithCompliance(),
      ]);
    } catch (error) {
      console.error('Failed to record penalty:', error);
    }
  };

  const handleViewDetails = (taxpayer) => {
    setSelectedTaxpayer(taxpayer);
    // Implement detailed view
    console.log('View taxpayer details:', taxpayer);
  };

  const handleRefresh = async () => {
    await Promise.all([
      loadComplianceDashboardData(),
      loadTaxpayersWithCompliance(),
      loadAnalytics(),
      loadAuditData(),
    ]);
  };

  // Use real analytics data or fallback to mock
  const analyticsDataToUse = analyticsData?.overallMetrics
    ? {
        timelyFiling: analyticsData.overallMetrics.timelyFiling || 85,
        accurateReporting: analyticsData.overallMetrics.accurateReporting || 78,
        paymentHistory: analyticsData.overallMetrics.paymentComplianceRate || 92,
        documentation: analyticsData.overallMetrics.documentationCompleteness || 88,
        cooperation: analyticsData.overallMetrics.cooperationScore || 95,
        trends: analyticsData.trends || [
          { month: 'Jan', score: 75 },
          { month: 'Feb', score: 78 },
          { month: 'Mar', score: 82 },
          { month: 'Apr', score: 85 },
          { month: 'May', score: 88 },
          { month: 'Jun', score: 90 },
        ],
      }
    : {
    timelyFiling: 85,
    accurateReporting: 78,
    paymentHistory: 92,
    documentation: 88,
    cooperation: 95,
    trends: [
      { month: 'Jan', score: 75 },
      { month: 'Feb', score: 78 },
      { month: 'Mar', score: 82 },
      { month: 'Apr', score: 85 },
      { month: 'May', score: 88 },
      { month: 'Jun', score: 90 },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Compliance Monitoring
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<IconRefresh />}
            onClick={handleRefresh}
            disabled={loading || taxpayersLoading || analyticsLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Schedule />}
            onClick={() => setAuditFormOpen(true)}
          >
            Schedule Audit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Gavel />}
            onClick={() => setPenaltyFormOpen(true)}
          >
            Record Penalty
          </Button>
        </Box>
      </Box>

      {/* Dashboard Overview */}
      {(dashboardData || complianceDashboard) && (
        <Box mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Taxpayers
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {(dashboardData || complianceDashboard)?.overview?.totalTaxpayers || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Compliant
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {(dashboardData || complianceDashboard)?.overview?.compliantTaxpayers || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Average Score
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {((dashboardData || complianceDashboard)?.overview?.averageComplianceScore || 0).toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    High Risk
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="error.main">
                    {(dashboardData || complianceDashboard)?.overview?.highRiskCount || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Compliance Analytics */}
      <Box mb={3}>
        {analyticsLoading ? (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            </CardContent>
          </Card>
        ) : (
          <ComplianceAnalytics analyticsData={analyticsDataToUse} />
        )}
      </Box>

      {/* Enterprise Audit Module - Audit Statistics */}
      {auditStats && (
      <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Compliance Operations
                  </Typography>
                  <Typography variant="h5">
                    {auditStats.totalOperations || auditStats.total || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    High Risk Operations
                  </Typography>
                  <Typography variant="h5" color="error.main">
                    {auditStats.highRiskCount || auditStats.highRisk || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Operations Requiring Review
                  </Typography>
                  <Typography variant="h5" color="warning.main">
                    {auditStats.requiresReviewCount || auditStats.requiresReview || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Execution Time
                  </Typography>
                  <Typography variant="h5">
                    {auditStats.avgExecutionTime
                      ? `${(auditStats.avgExecutionTime / 1000).toFixed(2)}s`
                      : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </Box>
      )}

      {/* Enterprise Audit Module - High Risk Operations */}
      {highRiskAudits.length > 0 && (
        <Box mb={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="error">
                  High-Risk Compliance Operations Requiring Review
                </Typography>
                <Chip label={highRiskAudits.length} color="error" size="small" />
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Entity</TableCell>
                      <TableCell>Risk Level</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {highRiskAudits.slice(0, 5).map((audit) => (
                      <TableRow key={audit.id || audit.audit_id}>
                        <TableCell>
                          {new Date(audit.timestamp || audit.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>{audit.user_name || audit.user?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip label={audit.action} size="small" color="primary" />
                        </TableCell>
                        <TableCell>
                          {audit.entity_type} - {audit.entity_id}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={audit.risk_level || 'HIGH'}
                            size="small"
                            color={audit.risk_level === 'HIGH' ? 'error' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={audit.status || 'SUCCESS'}
                            size="small"
                            color={audit.status === 'SUCCESS' ? 'success' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => window.open('/apps/audit/high-risk?entityType=COMPLIANCE', '_blank')}
                >
                  View All High-Risk Operations
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={filters.riskLevel}
                  label="Risk Level"
                  onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="low">Low Risk</MenuItem>
                  <MenuItem value="medium">Medium Risk</MenuItem>
                  <MenuItem value="high">High Risk</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Compliance Score</InputLabel>
                <Select
                  value={filters.complianceScore}
                  label="Compliance Score"
                  onChange={(e) => setFilters({ ...filters, complianceScore: e.target.value })}
                >
                  <MenuItem value="">All Scores</MenuItem>
                  <MenuItem value="high">80%+ (High)</MenuItem>
                  <MenuItem value="medium">60-79% (Medium)</MenuItem>
                  <MenuItem value="low">Below 60% (Low)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Last Audit Date"
                type="date"
                value={filters.lastAuditDate}
                onChange={(e) => setFilters({ ...filters, lastAuditDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Compliance Score Cards */}
      <Grid container spacing={3}>
        {taxpayersLoading ? (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : (complianceTaxpayers.length > 0 || (taxpayers && taxpayers.length > 0)) ? (
          (complianceTaxpayers.length > 0 ? complianceTaxpayers : taxpayers).slice(0, 8).map((taxpayer) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={taxpayer.id || taxpayer.tin || taxpayer.TIN || taxpayer.ID}>
            <ComplianceScoreCard taxpayer={taxpayer} onViewDetails={handleViewDetails} />
          </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">No taxpayers found. Use the filters above to search.</Alert>
          </Grid>
        )}
      </Grid>

      {/* Audit Scheduling Form */}
      <AuditSchedulingForm
        open={auditFormOpen}
        onClose={() => setAuditFormOpen(false)}
        onSubmit={handleScheduleAudit}
        taxpayer={selectedTaxpayer}
      />

      {/* Penalty Management Form */}
      <PenaltyManagementForm
        open={penaltyFormOpen}
        onClose={() => setPenaltyFormOpen(false)}
        onSubmit={handleRecordPenalty}
        taxpayer={selectedTaxpayer}
      />
    </Box>
  );
};

export default ComplianceMonitoring;
