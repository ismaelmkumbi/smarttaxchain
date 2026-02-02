import React, { useState } from 'react';
import { Box, Grid, Typography, Dialog } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TaxpayerPanel from '../../components/apps/blockchain/TaxpayerPanel';
import BlockchainAnimation from '../../components/apps/blockchain/BlockchainAnimation';
import TRADashboardPanel from '../../components/apps/blockchain/TRADashboardPanel';
import InvoiceModal from '../../components/apps/blockchain/InvoiceModal';
import FraudAlert from '../../components/apps/blockchain/FraudAlert';

const SmartTaxChainSimulation = () => {
  const { t } = useTranslation();
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [fraudAlert, setFraudAlert] = useState(null);
  const [transactionData, setTransactionData] = useState(null);

  // Handlers for simulation events (to be implemented)
  const handleTransaction = (data) => {
    setTransactionData(data);
    setInvoiceOpen(true);
    if (data.fraud) setFraudAlert(data);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h3" gutterBottom>
        {t('simulation.title', 'Smart Tax Chain Simulation')}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        {t(
          'simulation.subtitle',
          'Simulate blockchain-based tax compliance and fraud detection for TRA.',
        )}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TaxpayerPanel onTransaction={handleTransaction} />
        </Grid>
        <Grid item xs={12} md={4}>
          <BlockchainAnimation transaction={transactionData} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TRADashboardPanel transaction={transactionData} />
        </Grid>
      </Grid>
      <Dialog open={invoiceOpen} onClose={() => setInvoiceOpen(false)} maxWidth="sm" fullWidth>
        <InvoiceModal transaction={transactionData} onClose={() => setInvoiceOpen(false)} />
      </Dialog>
      {fraudAlert && <FraudAlert data={fraudAlert} onClose={() => setFraudAlert(null)} />}
    </Box>
  );
};

export default SmartTaxChainSimulation;
