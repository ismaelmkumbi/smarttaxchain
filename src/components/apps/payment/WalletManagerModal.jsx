import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  Alert,
} from '@mui/material';

const paymentOptions = [
  { label: 'M-Pesa', value: 'mpesa' },
  { label: 'Tigo Pesa', value: 'tigopesa' },
  { label: 'Airtel Money', value: 'airtelmoney' },
  { label: 'Halopesa', value: 'halopesa' },
  { label: 'NMB Bank', value: 'nmb' },
  { label: 'CRDB Bank', value: 'crdb' },
  { label: 'Bank Transfer', value: 'banktransfer' },
];

export const WalletManagerModal = ({ open, onClose }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [feedback, setFeedback] = useState('');

  const handlePushUSSD = () => {
    if (!selectedOption || !phoneNumber) {
      setFeedback('Please select a payment method and enter your phone number.');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setFeedback('Invalid phone number. It should be 10 digits (e.g., 07XXXXXXXX).');
      return;
    }

    // Simulate a push
    setFeedback(`Initiating USSD push via ${selectedOption.toUpperCase()} to ${phoneNumber}...`);

    // You can integrate with a real API here
    setTimeout(() => {
      setFeedback(`Payment request sent successfully to ${phoneNumber} via ${selectedOption}.`);
    }, 2000);
  };

  const handleClose = () => {
    setSelectedOption('');
    setPhoneNumber('');
    setFeedback('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Manage Wallet / Make Payment</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Choose your preferred payment method and enter your phone number to initiate a USSD push.
        </Typography>

        <TextField
          select
          fullWidth
          label="Payment Method"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          sx={{ mb: 2 }}
        >
          {paymentOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Phone Number (e.g. 07XXXXXXXX)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{ mb: 2 }}
        />

        {feedback && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {feedback}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handlePushUSSD}>
          Push USSD
        </Button>
      </DialogActions>
    </Dialog>
  );
};
