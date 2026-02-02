import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';

export const PaymentFormModal = ({ open, onClose, assessment, taxpayer, formatCurrency }) => {
  const [reference, setReference] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = () => {
    setProcessing(true);

    // Simulate API call
    setTimeout(() => {
      alert(
        `Payment for ${assessment.invoiceNo} of ${formatCurrency(assessment.amount)} processed.`,
      );
      setProcessing(false);
      onClose();
    }, 1500);
  };

  if (!assessment) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Pay Tax Invoice #{assessment.invoiceNo}</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          <strong>Taxpayer:</strong> {taxpayer.name}
        </Typography>
        <Typography gutterBottom>
          <strong>Amount Due:</strong> {formatCurrency(assessment.amount)}
        </Typography>
        <Typography gutterBottom>
          <strong>Due Date:</strong> {new Date(assessment.dueDate).toLocaleDateString()}
        </Typography>
        <Box mt={2}>
          <TextField
            fullWidth
            label="Payment Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={processing}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={processing || reference.trim() === ''}
          variant="contained"
        >
          {processing ? 'Processing...' : 'Confirm Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
