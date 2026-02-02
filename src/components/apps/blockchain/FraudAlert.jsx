import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';

const FraudAlert = ({ data, onClose }) => {
  const { t } = useTranslation();
  return (
    <Snackbar
      open={!!data}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {t('simulation.fraudDetected', 'Fraud detected! Underreporting threshold exceeded.')}
      </Alert>
    </Snackbar>
  );
};

export default FraudAlert;
