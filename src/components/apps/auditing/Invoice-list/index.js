import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  Tooltip,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Collapse,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  CircularProgress,
  Alert,
  DialogActions,
  Tab,
  Container,
  TextField,
  useTheme,
  alpha,
  MenuItem,
  Select,
  Autocomplete,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  OpenInNew as OpenInNewIcon,
  ArrowRightAlt as ArrowRightIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MonetizationOn as AmountIcon,
  Description as DescriptionIcon,
  CalendarToday as DateIcon,
  Person as PersonIcon,
  Category as TypeIcon,
  Money as CurrencyIcon,
  People as TaxpayerIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  Description,
  Download,
  Security,
  TrendingUp,
  Refresh,
  Business,
} from '@mui/icons-material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import traApi from 'src/services/traApiService';
import api from 'src/services/api';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { formatCurrency, isAmountField } from 'src/utils/formatters';

const TaxHistoryViewer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [submittedId, setSubmittedId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [complianceReportLoading, setComplianceReportLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [taxpayerOptions, setTaxpayerOptions] = useState([]);
  const [taxpayerLoading, setTaxpayerLoading] = useState(false);
  const [selectedTaxpayer, setSelectedTaxpayer] = useState(null);

  const entityTypes = [
    { label: 'Taxpayer', icon: <TaxpayerIcon />, endpoint: 'taxpayers', idLabel: 'TIN' },
    { label: 'Payment', icon: <PaymentIcon />, endpoint: 'tax-payments', idLabel: 'Payment ID' },
    {
      label: 'Assessment',
      icon: <AssessmentIcon />,
      endpoint: 'tax-assessments',
      idLabel: 'Assessment ID',
    },
  ];

  // Load taxpayers on mount
  useEffect(() => {
    const loadTaxpayers = async () => {
      try {
        setTaxpayerLoading(true);
        const response = await api.get('/taxpayers');
        const taxpayers = response.taxpayers || [];
        const normalized = taxpayers.map((tp) => ({
          id: tp.ID,
          name: tp.Name || tp.name,
          tin: tp.TIN || tp.tin,
          type: tp.Type || tp.type,
          email: tp.Email || tp.email,
          phone: tp.Phone || tp.phone,
          display: `${tp.Name || tp.name} (${tp.TIN || tp.tin})`,
        }));
        setTaxpayerOptions(normalized);
      } catch (e) {
        console.error('Error loading taxpayers:', e);
        setSnackbar({
          open: true,
          message: 'Failed to load taxpayers. Please try again.',
          severity: 'error',
        });
        setTaxpayerOptions([]);
      } finally {
        setTaxpayerLoading(false);
      }
    };
    loadTaxpayers();
  }, []);

  const showSnackbarMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTaxpayerChange = (event, newValue) => {
    setSelectedTaxpayer(newValue);
    if (newValue) {
      setSearchId(newValue.tin);
    } else {
      setSearchId('');
    }
  };

  const fetchHistory = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = entityTypes[activeTab].endpoint;

      // Use single axios client (api) - token attached via interceptor
      const data =
        activeTab === 0
          ? await api.get(`/api/taxpayers/${id}/history`)
          : await api.get(`/api/${endpoint}/${id}/history`);

      if (data.success) {
        const rawHistory = data.history || data.trail || [];
        const sortedHistory = [...rawHistory].sort(
          (a, b) => new Date(a.timestamp || a.Timestamp) - new Date(b.timestamp || b.Timestamp),
        );
        setHistory(sortedHistory);
        setSubmittedId(id);
        setSelectedEntry(sortedHistory[0] || null);

        const initialExpanded = {};
        sortedHistory.forEach((_, index) => {
          initialExpanded[index] = false;
        });
        setExpandedItems(initialExpanded);
      } else {
        throw new Error(data.message || 'Failed to fetch history data');
      }
    } catch (err) {
      setError(err.message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchHistory(searchId.trim());
    }
  };

  const handleGenerateComplianceReport = async () => {
    if (activeTab !== 0 || !submittedId) {
      showSnackbarMessage('Compliance reports are only available for taxpayers', 'warning');
      return;
    }

    setComplianceReportLoading(true);
    try {
      // Navigate to compliance report page with TIN pre-filled
      navigate(`/apps/compliance/taxpayer-report?tin=${submittedId}`);
    } catch (err) {
      showSnackbarMessage('Failed to open compliance report', 'error');
    } finally {
      setComplianceReportLoading(false);
    }
  };

  const handleDownloadCompliancePDF = async () => {
    if (activeTab !== 0 || !submittedId) {
      showSnackbarMessage('Compliance reports are only available for taxpayers', 'warning');
      return;
    }

    setComplianceReportLoading(true);
    try {
      const filters = { format: 'pdf' };
      if (dateFilter.from) filters.from = dateFilter.from;
      if (dateFilter.to) filters.to = dateFilter.to;

      const blob = await traApi.getTaxpayerComplianceReport(submittedId, filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Compliance-Report-${submittedId}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSnackbarMessage('PDF report downloaded successfully', 'success');
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to download PDF report';
      showSnackbarMessage(errorMessage, 'error');
    } finally {
      setComplianceReportLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const shortenHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getEntryDisplay = (entry) => ({
    timestamp: entry.timestamp || entry.Timestamp,
    txId: entry.txId || entry.TxId,
    data: entry.details || entry.Data,
    performedBy: entry.creator || entry.user?.name || entry.performedBy || entry.Data?.CreatedBy || 'System',
    performedByRole: entry.user?.role || entry.performedByRole || 'N/A',
    performedByUserId: entry.user?.id || entry.performedByUserId || 'N/A',
  });

  const getActionDetails = (entry, index) => {
    if (entry.IsDeleted) return { label: 'Deleted', color: 'error', icon: <CloseIcon /> };

    // Use action field from entry if available, otherwise infer from index
    const action = entry.action || (index === 0 ? 'CREATE' : 'UPDATE');

    const actionMap = {
      CREATE: { label: 'Created', color: 'success', icon: <CheckIcon /> },
      UPDATE: { label: 'Updated', color: 'primary', icon: <ScheduleIcon /> },
      DELETE: { label: 'Deleted', color: 'error', icon: <CloseIcon /> },
    };

    return (
      actionMap[action.toUpperCase()] || {
        label: 'Modified',
        color: 'primary',
        icon: <ScheduleIcon />,
      }
    );
  };

  const computeChanges = (previous, current) => {
    const changes = {};
    for (const key in current) {
      if (JSON.stringify(previous?.[key]) !== JSON.stringify(current[key])) {
        changes[key] = {
          previous: previous?.[key] ?? 'N/A',
          current: current[key],
          icon: getFieldIcon(key),
        };
      }
    }
    return changes;
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case 'Amount':
        return <AmountIcon />;
      case 'Description':
        return <DescriptionIcon />;
      case 'DueDate':
        return <DateIcon />;
      case 'CreatedBy':
        return <PersonIcon />;
      case 'TaxType':
        return <TypeIcon />;
      case 'Currency':
        return <CurrencyIcon />;
      default:
        return <ReceiptIcon />;
    }
  };

  const getFieldLabel = (field) => {
    return field.replace(/([A-Z])/g, ' $1').trim();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchId('');
    setSelectedTaxpayer(null);
    setSubmittedId('');
    setHistory([]);
    setDateFilter({ from: '', to: '' });
  };

  const HistoryDetailsDialog = () => {
    if (!selectedEntry) return null;

    return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h5" component="span">
                {entityTypes[activeTab].label} History Details
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Transaction ID: {shortenHash(selectedEntry.txId || selectedEntry.TxId)}
              </Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            {history
              .sort((a, b) => new Date(a.timestamp || a.Timestamp) - new Date(b.timestamp || b.Timestamp))
              .map((entry, index) => {
                const prevEntry = history[index - 1];
                const d = getEntryDisplay(entry);
                const prevD = prevEntry ? getEntryDisplay(prevEntry) : null;
                const changes = computeChanges(prevD?.data, d.data);
                const { label, color } = getActionDetails(entry, index);

                return (
                  <Box key={entry.txId || entry.TxId || entry.timestamp || `entry-${index}`}>
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Chip
                        label={label}
                        color={color}
                        icon={
                          label === 'Deleted' ? (
                            <CloseIcon />
                          ) : label === 'Created' ? (
                            <CheckIcon />
                          ) : (
                            <ScheduleIcon />
                          )
                        }
                      />
                      <Typography variant="subtitle2">{formatDateTime(d.timestamp)}</Typography>
                      <Chip
                        label={`By: ${d.performedBy}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      {d.performedByRole !== 'N/A' && (
                        <Chip
                          label={d.performedByRole}
                          size="small"
                          variant="outlined"
                          color="info"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                      {d.performedByUserId !== 'N/A' && d.performedByUserId && (
                        <Chip
                          label={`ID: ${d.performedByUserId}`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                      <Tooltip title="View details">
                        <IconButton
                          size="small"
                          onClick={() => window.open(d.txId ? `https://blockexplorer.com/tx/${d.txId}` : '#')}
                        >
                          <OpenInNewIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {label === 'Deleted' ? (
                      <Typography variant="body2" color="error.main">
                        Record was permanently deleted from the system
                      </Typography>
                    ) : (
                      <List dense>
                        {(label === 'Created' || entry.action === 'READ') && d.data ? (
                          // Show complete initial data for creation or audit-log details
                          Object.entries(d.data)
                            .filter(
                              ([key]) =>
                                ![
                                  'LedgerEvents',
                                  'docType',
                                  '__hash__',
                                  '__version__',
                                  'TxId',
                                ].includes(key),
                            )
                            .map(([key, value]) => (
                              <ListItem key={key}>
                                <ListItemAvatar>
                                  <Avatar
                                    sx={{
                                      bgcolor: alpha(theme.palette.success.main, 0.1),
                                      color: theme.palette.success.main,
                                    }}
                                  >
                                    {getFieldIcon(key)}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={getFieldLabel(key)}
                                  secondary={
                                    <Typography
                                      variant="body2"
                                      color="text.primary"
                                      component="span"
                                    >
                                      {value !== null && value !== undefined
                                        ? typeof value === 'object'
                                          ? JSON.stringify(value).substring(0, 100) + '...'
                                          : String(value)
                                        : 'N/A'}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))
                        ) : Object.keys(changes).length > 0 ? (
                          // Show changes for update entries
                          Object.entries(changes).map(([key, value]) => (
                            <ListItem key={key}>
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                  }}
                                >
                                  {value.icon}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={getFieldLabel(key)}
                                secondary={
                                  <Box
                                    component="span"
                                    sx={{
                                      display: 'inline-flex',
                                      flexDirection: 'row',
                                      gap: 1,
                                      alignItems: 'center',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    <Chip
                                      label={
                                        value.previous !== null && value.previous !== undefined
                                          ? typeof value.previous === 'object'
                                            ? JSON.stringify(value.previous).substring(0, 20) +
                                              '...'
                                            : isAmountField(key, value.previous)
                                            ? formatCurrency(value.previous)
                                            : String(value.previous).substring(0, 30)
                                          : 'N/A'
                                      }
                                      color="error"
                                      size="small"
                                      variant="outlined"
                                    />
                                    <ArrowRightIcon fontSize="small" color="action" />
                                    <Chip
                                      label={
                                        value.current !== null && value.current !== undefined
                                          ? typeof value.current === 'object'
                                            ? JSON.stringify(value.current).substring(0, 20) + '...'
                                            : isAmountField(key, value.current)
                                            ? formatCurrency(value.current)
                                            : String(value.current).substring(0, 30)
                                          : 'N/A'
                                      }
                                      color="success"
                                      size="small"
                                    />
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText primary="No changes detected" />
                          </ListItem>
                        )}
                      </List>
                    )}
                  </Box>
                );
              })}
          </Stack>
        </DialogContent>
        <DialogActions>
          {(selectedEntry?.txId || selectedEntry?.TxId) && (
            <Button
              onClick={() => window.open(`https://blockexplorer.com/tx/${selectedEntry.txId || selectedEntry.TxId}`)}
              startIcon={<OpenInNewIcon />}
            >
              View on Explorer
            </Button>
          )}
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Card
        sx={{
          mb: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Legal Auditing & Compliance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track complete audit history and generate compliance reports
              </Typography>
            </Box>
            <Security sx={{ fontSize: 48, color: theme.palette.primary.main, opacity: 0.7 }} />
          </Box>

          {/* Search Section */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 3,
                '& .MuiTab-root': {
                  minHeight: 64,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                },
              }}
            >
              {entityTypes.map((type, index) => (
                <Tab
                  key={index}
                  label={type.label}
                  icon={type.icon}
                  iconPosition="start"
                  sx={{ minHeight: 64 }}
                />
              ))}
            </Tabs>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} md={6}>
                  {activeTab === 0 ? (
                    // Taxpayer tab - use Autocomplete
                    <Autocomplete
                      options={taxpayerOptions}
                      getOptionLabel={(option) => option.display || ''}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id || option.tin === value?.tin
                      }
                      loading={taxpayerLoading}
                      value={selectedTaxpayer}
                      onChange={handleTaxpayerChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Taxpayer by Name or TIN"
                          placeholder="Type to search..."
                          required
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                {params.InputProps.startAdornment}
                              </>
                            ),
                            endAdornment: (
                              <>
                                {taxpayerLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => {
                        const { key, ...otherProps } = props;
                        return (
                          <Box
                            component="li"
                            key={key}
                            {...otherProps}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              py: 1.5,
                              px: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: theme.palette.primary.main,
                                width: 40,
                                height: 40,
                                color: theme.palette.text.primary,
                              }}
                            >
                              {option.type === 'Company' || option.type === 'Partnership' ? (
                                <Business />
                              ) : (
                                <PersonIcon />
                              )}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" fontWeight={600}>
                                {option.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                TIN: {option.tin} • {option.type}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      }}
                      fullWidth
                    />
                  ) : (
                    // Payment and Assessment tabs - use simple input
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="search-id">
                        {`Enter ${entityTypes[activeTab].idLabel}`}
                      </InputLabel>
                      <OutlinedInput
                        id="search-id"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            {entityTypes[activeTab].icon}
                          </InputAdornment>
                        }
                        label={`Enter ${entityTypes[activeTab].idLabel}`}
                        placeholder={`e.g. ${entityTypes[activeTab].label.toUpperCase()}-12345`}
                        required
                        fullWidth
                      />
                    </FormControl>
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!searchId.trim() || loading}
                    startIcon={loading ? <CircularProgress size={24} /> : <SearchIcon />}
                    fullWidth
                    sx={{ height: 56 }}
                  >
                    {loading ? 'Fetching...' : 'Search History'}
                  </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Refresh />}
                    onClick={() => {
                      setSearchId('');
                      setSelectedTaxpayer(null);
                      setSubmittedId('');
                      setHistory([]);
                      setError(null);
                    }}
                    fullWidth
                    sx={{ height: 56 }}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </CardContent>
      </Card>

      {/* Compliance Report Section - Only for Taxpayers */}
      {activeTab === 0 && submittedId && (
        <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Security color="success" />
              <Typography variant="h6" fontWeight={700}>
                Compliance Report
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Generate comprehensive compliance reports for taxpayer TIN:{' '}
              <strong>{submittedId}</strong>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="From Date"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="To Date"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={
                      complianceReportLoading ? <CircularProgress size={20} /> : <Description />
                    }
                    onClick={handleGenerateComplianceReport}
                    disabled={complianceReportLoading}
                    fullWidth
                  >
                    View Full Report
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={
                      complianceReportLoading ? <CircularProgress size={20} /> : <Download />
                    }
                    onClick={handleDownloadCompliancePDF}
                    disabled={complianceReportLoading}
                  >
                    PDF
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          Error: {error}
        </Alert>
      )}

      {/* History Display */}
      {submittedId && (
        <>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}
          >
            <Typography variant="h5" fontWeight={700}>
              {entityTypes[activeTab].label} History: {submittedId}
            </Typography>
            <Chip
              label={`${history.length} ${history.length === 1 ? 'Record' : 'Records'}`}
              color="primary"
              icon={<Timeline />}
            />
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : history.length > 0 ? (
            <>
              <Paper
                elevation={3}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  p: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <Timeline position="alternate">
                  {history.map((entry, index) => {
                    const prevEntry = history[index - 1];
                    const d = getEntryDisplay(entry);
                    const prevD = prevEntry ? getEntryDisplay(prevEntry) : null;
                    const isFirstEntry = index === 0;
                    const changes = isFirstEntry ? {} : computeChanges(prevD?.data, d.data);
                    const { label, color: actionColor, icon } = getActionDetails(entry, index);
                    const color =
                      actionColor && theme.palette[actionColor]?.main ? actionColor : 'primary';
                    const isExpanded = expandedItems[index];

                    return (
                      <TimelineItem
                        key={entry.txId || entry.TxId || entry.timestamp || `entry-${index}`}
                      >
                        <TimelineSeparator>
                          <TimelineDot
                            color={color}
                            sx={{
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: theme.palette[color]?.main || theme.palette.primary.main,
                              color:
                                theme.palette[color]?.contrastText ||
                                theme.palette.primary.contrastText,
                            }}
                          >
                            {icon}
                          </TimelineDot>
                          {index < history.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Card
                            variant="outlined"
                            sx={{
                              borderLeft: `4px solid`,
                              borderColor: `${color}.main`,
                              mb: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: 4,
                                transform: 'translateY(-2px)',
                              },
                            }}
                          >
                            <CardHeader
                              title={
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  <Chip label={label} color={color} size="small" />
                                  <Typography variant="body2" color="text.secondary">
                                    {formatDateTime(d.timestamp)}
                                  </Typography>
                                </Box>
                              }
                              subheader={
                                <Box>
                                  <Typography
                                    variant="caption"
                                    sx={{ fontFamily: 'monospace', display: 'block', mb: 0.5 }}
                                  >
                                    TX: {shortenHash(d.txId)}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      gap: 1,
                                      flexWrap: 'wrap',
                                      alignItems: 'center',
                                      mt: 0.5,
                                    }}
                                  >
                                    <Chip
                                      label={`By: ${d.performedBy}`}
                                      size="small"
                                      variant="outlined"
                                      color="default"
                                      sx={{ fontSize: '0.7rem', height: 20 }}
                                    />
                                    {d.performedByRole !== 'N/A' && (
                                      <Chip
                                        label={d.performedByRole}
                                        size="small"
                                        variant="outlined"
                                        color="info"
                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                      />
                                    )}
                                    {d.performedByUserId !== 'N/A' && d.performedByUserId && (
                                      <Chip
                                        label={`ID: ${d.performedByUserId}`}
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                      />
                                    )}
                                  </Box>
                                </Box>
                              }
                              action={
                                <Stack direction="row" spacing={1}>
                                  <Tooltip title="View Full History">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedEntry(entry);
                                        setDialogOpen(true);
                                      }}
                                    >
                                      <VisibilityIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
                                    <IconButton size="small" onClick={() => toggleExpand(index)}>
                                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              }
                            />
                            <Collapse in={isExpanded}>
                              <CardContent>
                                {entry.IsDeleted ? (
                                  <Alert severity="error">
                                    This record was permanently deleted from the system
                                  </Alert>
                                ) : (
                                  <List dense>
                                    {(isFirstEntry || entry.action === 'READ') && d.data ? (
                                      // Show complete initial data for first entry or audit-log details
                                      Object.entries(d.data)
                                        .map(([key, value]) => {
                                          // Skip internal/metadata fields
                                          if (
                                            [
                                              'LedgerEvents',
                                              'docType',
                                              '__hash__',
                                              '__version__',
                                              'response',
                                              'headers',
                                            ].includes(key)
                                          ) {
                                            return null;
                                          }
                                          return (
                                            <ListItem key={key}>
                                              <ListItemAvatar>
                                                <Avatar
                                                  sx={{
                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                    color: theme.palette.success.main,
                                                  }}
                                                >
                                                  {getFieldIcon(key)}
                                                </Avatar>
                                              </ListItemAvatar>
                                              <ListItemText
                                                primary={getFieldLabel(key)}
                                                secondary={
                                                  <Typography
                                                    variant="body2"
                                                    color="text.primary"
                                                    component="span"
                                                  >
                                                    {value !== null && value !== undefined
                                                      ? typeof value === 'object'
                                                        ? JSON.stringify(value).substring(0, 100) +
                                                          '...'
                                                        : isAmountField(key, value)
                                                        ? formatCurrency(value)
                                                        : String(value)
                                                      : 'N/A'}
                                                  </Typography>
                                                }
                                              />
                                            </ListItem>
                                          );
                                        })
                                        .filter(Boolean)
                                    ) : Object.keys(changes).length > 0 ? (
                                      // Show changes for update entries
                                      Object.entries(changes).map(([key, value]) => (
                                        <ListItem key={key}>
                                          <ListItemAvatar>
                                            <Avatar
                                              sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                              }}
                                            >
                                              {value.icon}
                                            </Avatar>
                                          </ListItemAvatar>
                                          <ListItemText
                                            primary={getFieldLabel(key)}
                                            secondary={
                                              <Box
                                                component="span"
                                                sx={{
                                                  display: 'inline-flex',
                                                  flexDirection: 'row',
                                                  gap: 1,
                                                  alignItems: 'center',
                                                  flexWrap: 'wrap',
                                                }}
                                              >
                                                <Chip
                                                  label={
                                                    typeof value.previous === 'object'
                                                      ? JSON.stringify(value.previous).substring(
                                                          0,
                                                          20,
                                                        ) + '...'
                                                      : isAmountField(key, value.previous)
                                                      ? formatCurrency(value.previous)
                                                      : String(value.previous).substring(0, 30)
                                                  }
                                                  color="error"
                                                  size="small"
                                                  variant="outlined"
                                                />
                                                <ArrowRightIcon fontSize="small" />
                                                <Chip
                                                  label={
                                                    typeof value.current === 'object'
                                                      ? JSON.stringify(value.current).substring(
                                                          0,
                                                          20,
                                                        ) + '...'
                                                      : isAmountField(key, value.current)
                                                      ? formatCurrency(value.current)
                                                      : isAmountField(key, value.current)
                                                      ? formatCurrency(value.current)
                                                      : String(value.current).substring(0, 30)
                                                  }
                                                  color="success"
                                                  size="small"
                                                />
                                              </Box>
                                            }
                                          />
                                        </ListItem>
                                      ))
                                    ) : (
                                      <ListItem>
                                        <ListItemText
                                          primary="No changes detected"
                                          secondary="This entry shows the same data as the previous entry"
                                        />
                                      </ListItem>
                                    )}
                                  </List>
                                )}
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                  <Button
                                    size="small"
                                    startIcon={<OpenInNewIcon />}
                                    onClick={() =>
                                      d.txId && window.open(`https://blockexplorer.com/tx/${d.txId}`)
                                    }
                                  >
                                    View Transaction
                                  </Button>
                                </Box>
                              </CardContent>
                            </Collapse>
                          </Card>
                        </TimelineContent>
                      </TimelineItem>
                    );
                  })}
                </Timeline>
              </Paper>
            </>
          ) : (
            <Alert severity="info">
              No history records found for this {entityTypes[activeTab].label.toLowerCase()} ID
            </Alert>
          )}
        </>
      )}

      <HistoryDetailsDialog />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default TaxHistoryViewer;
