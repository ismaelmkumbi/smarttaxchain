import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Button,
  Grid,
  Chip,
  Modal,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Warning,
  Payment as AccountBalance,
  History,
  Receipt,
  PendingActions,
  Download,
  AccountBalanceWallet,
  CheckCircle,
  Schedule,
  MonetizationOn,
  CreditCard,
  Smartphone,
  Close,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export const PaymentConfirmationModal = ({ open, onClose, payment, onConfirm, balance }) => {
  const theme = useTheme();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Get initial payment amount (prefer remaining balance if available)
  const getInitialAmount = () => {
    if (payment?.remainingBalance && payment.remainingBalance > 0) {
      return payment.remainingBalance;
    }
    return payment?.amount || 0;
  };

  const [formData, setFormData] = useState({
    amount: getInitialAmount(),
  });

  // Reset form when payment changes
  useEffect(() => {
    if (payment) {
      const initialAmount = payment?.remainingBalance && payment.remainingBalance > 0
        ? payment.remainingBalance
        : payment?.amount || 0;
      setFormData((prev) => ({
        ...prev,
        amount: initialAmount,
      }));
      setPaymentMethod('');
      setError('');
    }
  }, [payment]);

  // Payment method configurations
  const paymentMethods = [
    {
      value: 'BANK_TRANSFER',
      label: 'Bank Transfer',
      icon: <AccountBalance color="action" />,
    },
    {
      value: 'MOBILE_MONEY',
      label: 'Mobile Money',
      icon: <Smartphone color="action" />,
    },
    {
      value: 'CASH',
      label: 'Cash',
      icon: <MonetizationOn color="action" />,
    },
    {
      value: 'CHEQUE',
      label: 'Cheque',
      icon: <Receipt color="action" />,
    },
    {
      value: 'CREDIT_CARD',
      label: 'Credit/Debit Card',
      icon: <CreditCard color="action" />,
    },
    {
      value: 'OTHER',
      label: 'Other',
      icon: <AccountBalanceWallet color="action" />,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for amount field
    if (name === 'amount') {
      const numValue = Number(value);
      const maxAmount = payment?.remainingBalance || payment?.amount || 0;
      if (numValue > maxAmount) {
        setError(`Amount cannot exceed ${new Intl.NumberFormat('en-TZ', {
          style: 'currency',
          currency: 'TZS',
        }).format(maxAmount)}`);
      } else {
        setError('');
      }
      setFormData((prev) => ({ ...prev, [name]: numValue }));
      return;
    }
  };

  const handleSubmit = async () => {
    try {
      setProcessing(true);
      setError('');

      // Validate payment method
      if (!paymentMethod) {
        setError('Please select a payment method');
        return;
      }

      // Validate payment amount
      const paymentAmount = Number(formData.amount);
      if (!paymentAmount || paymentAmount <= 0) {
        setError('Payment amount must be greater than 0');
        return;
      }

      const maxAmount = payment.remainingBalance || payment.amount || 0;
      if (paymentAmount > maxAmount) {
        setError(`Payment amount cannot exceed ${new Intl.NumberFormat('en-TZ', {
          style: 'currency',
          currency: 'TZS',
        }).format(maxAmount)}`);
        return;
      }

      // Call onConfirm with payment data - send exactly the payment method selected
      if (onConfirm) {
        await onConfirm({
          assessmentId: payment.assessmentId || payment.id,
          amount: paymentAmount,
          paymentMethod: paymentMethod, // Send exactly as selected
          paymentDate: new Date().toISOString(),
        });
      }

      onClose();
    } catch (err) {
      setError(err?.message || 'Payment failed. Please try again or contact support.');
    } finally {
      setProcessing(false);
    }
  };

  if (!payment) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="payment-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: 0,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Tax Payment Confirmation
          </Typography>
          <IconButton onClick={onClose} aria-label="Close">
            <Close />
          </IconButton>
        </Stack>

        <Alert severity="info" sx={{ mb: 3 }}>
          Taxpayer: {payment.taxpayerName || 'N/A'} • TIN: {payment.taxpayerTin || payment.taxId || 'N/A'}
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="text.secondary" textAlign="center" gutterBottom>
            Total Due
          </Typography>
          <Typography variant="h4" color="primary" textAlign="center">
            {new Intl.NumberFormat('en-TZ', {
              style: 'currency',
              currency: 'TZS',
            }).format(payment.amount || 0)}
          </Typography>
          {payment.totalPaid > 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center" display="block" sx={{ mt: 1 }}>
              Already Paid: {new Intl.NumberFormat('en-TZ', {
                style: 'currency',
                currency: 'TZS',
              }).format(payment.totalPaid || 0)}
            </Typography>
          )}
          {payment.remainingBalance !== undefined && payment.remainingBalance > 0 && (
            <Typography variant="body2" color="warning.main" textAlign="center" display="block" sx={{ mt: 1, fontWeight: 600 }}>
              Remaining Balance: {new Intl.NumberFormat('en-TZ', {
                style: 'currency',
                currency: 'TZS',
              }).format(payment.remainingBalance)}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ mt: 1 }}>
            Due Date: {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('en-TZ') : 'N/A'}
          </Typography>
        </Box>

        {/* Payment Amount Input */}
        <TextField
          fullWidth
          label="Payment Amount"
          type="number"
          value={formData.amount}
          onChange={handleInputChange}
          name="amount"
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">TZS</InputAdornment>,
          }}
          helperText={`Maximum: ${new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
          }).format(payment.remainingBalance || payment.amount || 0)}`}
          required
          error={!!error && error.includes('Amount cannot exceed')}
        />

        {/* Payment Method */}
        <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
          <InputLabel>Select Payment Method</InputLabel>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            label="Select Payment Method"
            required
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {paymentMethods.find((m) => m.value === selected)?.icon}
                {paymentMethods.find((m) => m.value === selected)?.label}
              </Box>
            )}
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method.value} value={method.value}>
                <ListItemIcon>{method.icon}</ListItemIcon>
                <ListItemText>{method.label}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!paymentMethod || processing || !formData.amount || formData.amount <= 0}
            startIcon={processing ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {processing ? 'Processing Payment...' : 'Confirm Tax Payment'}
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" display="block" mt={2}>
          Secure payment processing powered by TRA Gateway • All transactions are encrypted
        </Typography>
      </Box>
    </Modal>
  );
};
