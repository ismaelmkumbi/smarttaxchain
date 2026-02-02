import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  LinearProgress,
  Fade,
  Divider,
} from '@mui/material';
import {
  Receipt,
  Warning,
  CheckCircle,
  AutoAwesome,
  TrendingUp,
  Security,
  Block,
  Refresh,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Mock data for demonstration
const mockTransactions = [
  {
    id: 'tx_001',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    taxpayerId: 'IND123456',
    originalAmount: 25000,
    calculatedVAT: 4500,
    reportedVAT: 4500,
    fraudDetected: false,
    businessCategory: 'retail',
    blockNumber: 1,
  },
  {
    id: 'tx_002',
    timestamp: new Date(Date.now() - 240000).toISOString(),
    taxpayerId: 'BUS789012',
    originalAmount: 50000,
    calculatedVAT: 9000,
    reportedVAT: 4500,
    fraudDetected: true,
    businessCategory: 'services',
    blockNumber: 2,
  },
  {
    id: 'tx_003',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    taxpayerId: 'COR345678',
    originalAmount: 100000,
    calculatedVAT: 18000,
    reportedVAT: 18000,
    fraudDetected: false,
    businessCategory: 'manufacturing',
    blockNumber: 3,
  },
];

const SmartTaxChainSimulation = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [amount, setAmount] = useState('10000');
  const [taxpayerType, setTaxpayerType] = useState('individual');
  const [businessCategory, setBusinessCategory] = useState('retail');
  const [isProcessing, setIsProcessing] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [lastTransaction, setLastTransaction] = useState(null);

  const businessCategories = {
    retail: { name: t('simulation.retail', 'Retail'), vatRate: 0.18 },
    services: { name: t('simulation.services', 'Services'), vatRate: 0.18 },
    manufacturing: { name: t('simulation.manufacturing', 'Manufacturing'), vatRate: 0.18 },
    hospitality: { name: t('simulation.hospitality', 'Hospitality'), vatRate: 0.18 },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-TZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const generateTransaction = (isCompliant = true) => {
    const originalAmount = Number(amount);
    const category = businessCategories[businessCategory];
    const calculatedVAT = Math.round(originalAmount * category.vatRate);
    const reportedVAT = isCompliant
      ? calculatedVAT
      : Math.round(calculatedVAT * (0.3 + Math.random() * 0.4));

    const newTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      taxpayerId: `${taxpayerType.toUpperCase()}${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`,
      originalAmount,
      calculatedVAT,
      reportedVAT,
      fraudDetected: !isCompliant,
      businessCategory,
      blockNumber: transactions.length + 1,
    };

    return newTransaction;
  };

  const processTransaction = async (transaction) => {
    setIsProcessing(true);
    setLastTransaction(transaction);

    // Simulate blockchain processing stages
    const stages = [1, 2, 3, 4];
    for (let i = 0; i < stages.length; i++) {
      setAnimationStage(stages[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Add transaction to list
    setTransactions((prev) => [...prev, transaction]);

    // Reset animation
    setTimeout(() => {
      setAnimationStage(0);
      setIsProcessing(false);
    }, 1000);
  };

  const handleCompliantSale = () => {
    const transaction = generateTransaction(true);
    processTransaction(transaction);
  };

  const handleFraudulentSale = () => {
    const transaction = generateTransaction(false);
    processTransaction(transaction);
  };

  const handleRandomTransaction = () => {
    const randomAmount = Math.floor(Math.random() * 50000) + 5000;
    setAmount(randomAmount.toString());
    const isCompliant = Math.random() > 0.3; // 70% compliance rate
    const transaction = generateTransaction(isCompliant);
    transaction.originalAmount = randomAmount;
    transaction.calculatedVAT = Math.round(
      randomAmount * businessCategories[businessCategory].vatRate,
    );
    processTransaction(transaction);
  };

  const clearTransactions = () => {
    setTransactions([]);
  };

  // Calculate statistics
  const stats = {
    totalTransactions: transactions.length,
    totalRevenue: transactions.reduce((sum, tx) => sum + tx.originalAmount, 0),
    totalVAT: transactions.reduce((sum, tx) => sum + tx.calculatedVAT, 0),
    fraudDetected: transactions.filter((tx) => tx.fraudDetected).length,
    complianceRate:
      transactions.length > 0
        ? Math.round(
            ((transactions.length - transactions.filter((tx) => tx.fraudDetected).length) /
              transactions.length) *
              100,
          )
        : 100,
  };

  const animationStages = [
    { label: t('simulation.idle', 'Idle'), color: 'default' },
    { label: t('simulation.validating', 'Validating Transaction'), color: 'info' },
    { label: t('simulation.mining', 'Mining Block'), color: 'warning' },
    { label: t('simulation.confirming', 'Confirming Block'), color: 'primary' },
    { label: t('simulation.confirmed', 'Added to Chain'), color: 'success' },
  ];

  const TRA_YELLOW = '#f5e800';
  const TRA_BLACK = '#000000';
  const TRA_WHITE = '#ffffff';

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        {t('simulation.title', 'Smart Tax Chain Simulation')}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary' }}>
        {t(
          'simulation.subtitle',
          'Simulate blockchain-based tax compliance and fraud detection for TRA',
        )}
      </Typography>

      <Grid container spacing={3}>
        {/* Taxpayer Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('simulation.taxpayerPanel', 'Taxpayer Simulation Interface')}
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                {t(
                  'simulation.taxpayerInfo',
                  'Simulate different taxpayer scenarios to test the Smart Tax Chain system.',
                )}
              </Alert>

              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t('simulation.taxpayerType', 'Taxpayer Type')}</InputLabel>
                  <Select
                    value={taxpayerType}
                    label={t('simulation.taxpayerType', 'Taxpayer Type')}
                    onChange={(e) => setTaxpayerType(e.target.value)}
                  >
                    <MenuItem value="individual">
                      {t('simulation.individual', 'Individual')}
                    </MenuItem>
                    <MenuItem value="business">{t('simulation.business', 'Business')}</MenuItem>
                    <MenuItem value="corporation">
                      {t('simulation.corporation', 'Corporation')}
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t('simulation.businessCategory', 'Business Category')}</InputLabel>
                  <Select
                    value={businessCategory}
                    label={t('simulation.businessCategory', 'Business Category')}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                  >
                    {Object.entries(businessCategories).map(([key, category]) => (
                      <MenuItem key={key} value={key}>
                        {category.name} ({(category.vatRate * 100).toFixed(0)}% VAT)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label={t('simulation.saleAmount', 'Sale Amount (TZS)')}
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  helperText={`${t('simulation.calculatedVat', 'Calculated VAT')}: ${formatCurrency(
                    Math.round(Number(amount || 0) * businessCategories[businessCategory].vatRate),
                  )}`}
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCompliantSale}
                  disabled={isProcessing}
                  startIcon={<CheckCircle />}
                  fullWidth
                >
                  {t('simulation.generateCompliantSale', 'Generate Compliant Sale')}
                </Button>

                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleFraudulentSale}
                  disabled={isProcessing}
                  startIcon={<Warning />}
                  fullWidth
                >
                  {t('simulation.simulateUnderreport', 'Simulate VAT Underreporting')}
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleRandomTransaction}
                  disabled={isProcessing}
                  startIcon={<AutoAwesome />}
                  fullWidth
                >
                  {t('simulation.randomTransaction', 'Generate Random Transaction')}
                </Button>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<Receipt />}
                  label={`${taxpayerType} - ${businessCategories[businessCategory].name}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`VAT: ${(businessCategories[businessCategory].vatRate * 100).toFixed(0)}%`}
                  size="small"
                  color="info"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Blockchain Animation */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('simulation.blockchainPanel', 'Smart Tax Chain Blockchain')}
              </Typography>

              {/* Animation Status */}
              {animationStage > 0 && (
                <Fade in={true}>
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Security color="info" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        {animationStages[animationStage].label}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(animationStage / 4) * 100}
                      sx={{ mb: 1 }}
                    />
                    {lastTransaction && (
                      <Typography variant="caption" color="text.secondary">
                        {t(
                          'simulation.processingTransaction',
                          'Processing transaction of {{amount}}',
                          {
                            amount: formatCurrency(lastTransaction.originalAmount),
                          },
                        )}
                      </Typography>
                    )}
                  </Paper>
                </Fade>
              )}

              {/* Latest Block */}
              {lastTransaction && animationStage === 0 && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    border: 2,
                    borderColor: lastTransaction.fraudDetected ? 'error.main' : 'success.main',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Block
                      color={lastTransaction.fraudDetected ? 'error' : 'primary'}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="subtitle2">
                      {t('simulation.latestBlock', 'Latest Block')} #{lastTransaction.blockNumber}
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 1 }}
                  >
                    {formatTime(lastTransaction.timestamp)}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      size="small"
                      label={formatCurrency(lastTransaction.originalAmount)}
                      color="info"
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={`VAT: ${formatCurrency(lastTransaction.calculatedVAT)}`}
                      color={lastTransaction.fraudDetected ? 'error' : 'success'}
                    />
                  </Box>

                  <Chip
                    size="small"
                    icon={lastTransaction.fraudDetected ? <Warning /> : <CheckCircle />}
                    label={
                      lastTransaction.fraudDetected
                        ? t('simulation.fraud', 'Fraud')
                        : t('simulation.verified', 'Verified')
                    }
                    color={lastTransaction.fraudDetected ? 'error' : 'success'}
                  />
                </Paper>
              )}

              {/* Blockchain Stats */}
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography variant="caption">
                    {t('simulation.chainLength', 'Chain Length')}: {transactions.length}
                  </Typography>
                  <Typography variant="caption">
                    {t('simulation.integrity', 'Chain Integrity')}:{' '}
                    {transactions.some((tx) => tx.fraudDetected)
                      ? t('simulation.alertsActive', 'Alerts Active')
                      : t('simulation.secure', 'Secure')}
                  </Typography>
                </Box>
              </Paper>

              {transactions.length === 0 && animationStage === 0 && (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Block sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {t('simulation.emptyBlockchain', 'Blockchain is empty')}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* TRA Dashboard */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  {t('simulation.traDashboard', 'TRA Real-time Dashboard')}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={clearTransactions}
                  startIcon={<Refresh />}
                >
                  {t('simulation.clearAll', 'Clear All')}
                </Button>
              </Box>

              {/* Stats Cards */}
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="caption">
                        {t('simulation.totalTransactions', 'Total Transactions')}
                      </Typography>
                      <Typography variant="h6">{stats.totalTransactions}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="caption">
                        {t('simulation.complianceRate', 'Compliance Rate')}
                      </Typography>
                      <Typography variant="h6">{stats.complianceRate}%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="caption">
                        {t('simulation.totalRevenue', 'Total Revenue')}
                      </Typography>
                      <Typography variant="h6">{formatCurrency(stats.totalRevenue)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      bgcolor: stats.fraudDetected > 0 ? 'error.light' : 'success.light',
                      color:
                        stats.fraudDetected > 0 ? 'error.contrastText' : 'success.contrastText',
                    }}
                  >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="caption">
                        {t('simulation.fraudDetected', 'Fraud Detected')}
                      </Typography>
                      <Typography variant="h6">{stats.fraudDetected}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Transaction Table */}
              <Typography variant="subtitle2" gutterBottom>
                {t('simulation.recentTransactions', 'Recent Transactions')} ({transactions.length})
              </Typography>

              <TableContainer component={Paper} sx={{ maxHeight: 300, backgroundColor: TRA_BLACK }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: TRA_YELLOW }}>
                      <TableCell
                        sx={{ backgroundColor: TRA_YELLOW, color: TRA_BLACK, fontWeight: 700 }}
                      >
                        {t('simulation.timestamp', 'Time')}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ backgroundColor: TRA_YELLOW, color: TRA_BLACK, fontWeight: 700 }}
                      >
                        {t('simulation.saleAmount', 'Amount')}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ backgroundColor: TRA_YELLOW, color: TRA_BLACK, fontWeight: 700 }}
                      >
                        {t('simulation.status', 'Status')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions
                      .slice(-10)
                      .reverse()
                      .map((tx) => (
                        <TableRow
                          key={tx.id}
                          sx={{
                            backgroundColor: tx.fraudDetected ? TRA_YELLOW : TRA_BLACK,
                          }}
                        >
                          <TableCell sx={{ color: tx.fraudDetected ? TRA_BLACK : TRA_WHITE }}>
                            <Typography variant="caption">{formatTime(tx.timestamp)}</Typography>
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ color: tx.fraudDetected ? TRA_BLACK : TRA_WHITE }}
                          >
                            {formatCurrency(tx.originalAmount)}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              icon={
                                tx.fraudDetected ? (
                                  <Warning sx={{ color: TRA_BLACK }} />
                                ) : (
                                  <CheckCircle sx={{ color: TRA_YELLOW }} />
                                )
                              }
                              label={
                                tx.fraudDetected
                                  ? t('simulation.fraud', 'Fraud')
                                  : t('simulation.verified', 'Verified')
                              }
                              sx={{
                                backgroundColor: tx.fraudDetected ? TRA_YELLOW : TRA_BLACK,
                                color: tx.fraudDetected ? TRA_BLACK : TRA_YELLOW,
                                fontWeight: 700,
                                border: `1px solid ${TRA_YELLOW}`,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    {transactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            {t(
                              'simulation.noTransactions',
                              'No transactions yet. Start a simulation to see real-time data.',
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmartTaxChainSimulation;
