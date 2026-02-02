import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  Security,
  Warning,
  CheckCircle,
  Clear,
  Refresh,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useTransactionStore from '../../../store/transactionStore';

const maskTaxpayerId = (id) => (id ? id.replace(/.(?=.{4})/g, '*') : '****');

const TRADashboardPanel = ({ transaction }) => {
  const { t } = useTranslation();
  const {
    transactions,
    fraudAlerts,
    aggregatedStats,
    getRecentTransactions,
    resolveFraudAlert,
    clearTransactions,
  } = useTransactionStore();

  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showFraudAlerts, setShowFraudAlerts] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Update recent transactions when store changes
  useEffect(() => {
    setRecentTransactions(getRecentTransactions(showAllTransactions ? 50 : 10));
  }, [transactions, showAllTransactions, getRecentTransactions]);

  // Auto-refresh every 5 seconds for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentTransactions(getRecentTransactions(showAllTransactions ? 50 : 10));
    }, 5000);
    return () => clearInterval(interval);
  }, [showAllTransactions, getRecentTransactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderRadius: 2,
        borderColor: 'grey.300',
        background: 'white',
        minHeight: 400,
        maxHeight: 800,
        overflow: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {t('simulation.traDashboard', 'TRA Real-time Dashboard')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('simulation.refresh', 'Refresh')}>
            <IconButton size="small" onClick={() => setRecentTransactions(getRecentTransactions(showAllTransactions ? 50 : 10))}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={clearTransactions}
            startIcon={<Clear />}
          >
            {t('simulation.clearAll', 'Clear All')}
          </Button>
        </Box>
      </Box>

      {/* Aggregated Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp fontSize="small" />
                <Typography variant="caption">
                  {t('simulation.totalTransactions', 'Total Transactions')}
                </Typography>
              </Box>
              <Typography variant="h6">{aggregatedStats.totalTransactions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle fontSize="small" />
                <Typography variant="caption">
                  {t('simulation.complianceRate', 'Compliance Rate')}
                </Typography>
              </Box>
              <Typography variant="h6">{aggregatedStats.complianceRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security fontSize="small" />
                <Typography variant="caption">
                  {t('simulation.totalRevenue', 'Total Revenue')}
                </Typography>
              </Box>
              <Typography variant="h6">{formatCurrency(aggregatedStats.totalRevenue)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: aggregatedStats.fraudDetected > 0 ? 'error.light' : 'success.light', color: aggregatedStats.fraudDetected > 0 ? 'error.contrastText' : 'success.contrastText' }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning fontSize="small" />
                <Typography variant="caption">
                  {t('simulation.fraudDetected', 'Fraud Detected')}
                </Typography>
              </Box>
              <Typography variant="h6">{aggregatedStats.fraudDetected}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fraud Alerts */}
      {fraudAlerts.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle2" color="error">
              {t('simulation.fraudAlerts', 'Active Fraud Alerts')} ({fraudAlerts.length})
            </Typography>
            <IconButton size="small" onClick={() => setShowFraudAlerts(!showFraudAlerts)}>
              {showFraudAlerts ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={showFraudAlerts}>
            {fraudAlerts.slice(0, 3).map((alert) => (
              <Alert
                key={alert.id}
                severity="error"
                sx={{ mb: 1 }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => resolveFraudAlert(alert.id)}
                  >
                    {t('simulation.resolve', 'Resolve')}
                  </Button>
                }
              >
                {t('simulation.fraudAlertMessage', 'VAT mismatch detected for transaction {{id}}', { id: alert.id.slice(-8) })}
              </Alert>
            ))}
          </Collapse>
        </Box>
      )}

      {/* Transaction Table */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">
          {t('simulation.recentTransactions', 'Recent Transactions')} ({recentTransactions.length})
        </Typography>
        <Button
          size="small"
          onClick={() => setShowAllTransactions(!showAllTransactions)}
          endIcon={showAllTransactions ? <ExpandLess /> : <ExpandMore />}
        >
          {showAllTransactions 
            ? t('simulation.showRecent', 'Show Recent') 
            : t('simulation.showAll', 'Show All')}
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{t('simulation.timestamp', 'Time')}</TableCell>
              <TableCell>{t('simulation.taxpayerId', 'Taxpayer ID')}</TableCell>
              <TableCell align="right">{t('simulation.saleAmount', 'Sale Amount')}</TableCell>
              <TableCell align="right">{t('simulation.calculatedVat', 'Calculated VAT')}</TableCell>
              <TableCell align="right">{t('simulation.reportedVat', 'Reported VAT')}</TableCell>
              <TableCell align="center">{t('simulation.status', 'Status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  sx={{
                    backgroundColor: tx.fraudDetected ? 'error.light' : 'inherit',
                    '&:hover': {
                      backgroundColor: tx.fraudDetected ? 'error.main' : 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="caption">
                      {formatDateTime(tx.timestamp)}
                    </Typography>
                  </TableCell>
                  <TableCell>{maskTaxpayerId(tx.taxpayerId || 'TAXPAYER1234')}</TableCell>
                  <TableCell align="right">{formatCurrency(tx.originalAmount)}</TableCell>
                  <TableCell align="right">{formatCurrency(tx.calculatedVAT)}</TableCell>
                  <TableCell align="right">{formatCurrency(tx.reportedVAT)}</TableCell>
                  <TableCell align="center">
                    {tx.fraudDetected ? (
                      <Chip
                        label={t('simulation.fraud', 'Fraud')}
                        color="error"
                        size="small"
                        icon={<Warning />}
                      />
                    ) : (
                      <Chip
                        label={t('simulation.verified', 'Verified')}
                        color="success"
                        size="small"
                        icon={<CheckCircle />}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    {t('simulation.noTransactions', 'No transactions yet. Start a simulation to see real-time data.')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {recentTransactions.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {t('simulation.lastUpdated', 'Last updated: {{time}}', { 
            time: new Date().toLocaleTimeString('en-TZ') 
          })}
        </Typography>
      )}
    </Box>
  );
};

TRADashboardPanel.propTypes = {
  transaction: PropTypes.shape({
    originalAmount: PropTypes.number,
    reportedAmount: PropTypes.number,
    fraud: PropTypes.bool,
  }),
};

TRADashboardPanel.defaultProps = {
  transaction: null,
};

export default TRADashboardPanel;
