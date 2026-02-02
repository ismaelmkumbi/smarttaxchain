import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const InvoiceModal = ({ transaction, onClose }) => {
  const { t } = useTranslation();
  if (!transaction) return null;
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('simulation.invoice', 'Digital Invoice')}
      </Typography>
      <Typography variant="body1">
        {t('simulation.taxpayerId', 'Taxpayer ID')}: TAXPAYER1234
      </Typography>
      <Typography variant="body1">
        {t('simulation.saleAmount', 'Sale Amount')}: {transaction.reportedAmount} TZS
      </Typography>
      <Typography variant="body1">
        {t('simulation.vat', 'VAT (18%)')}: {Math.round(transaction.reportedAmount * 0.18)} TZS
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        {t('simulation.timestamp', 'Timestamp')}: {new Date().toLocaleString()}
      </Typography>
      <Button onClick={onClose} sx={{ mt: 3 }} variant="contained">
        {t('simulation.close', 'Close')}
      </Button>
    </Box>
  );
};

export default InvoiceModal;
