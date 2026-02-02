import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  LinearProgress,
  Slide,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  IconCurrencyDollar,
  IconDeviceFloppy,
  IconFingerprint,
  IconId,
  IconReceipt,
  IconShieldCheck,
} from '@tabler/icons-react'; // or your icon library

const NewTransactionModal = () => {
  const [newTxOpen, setNewTxOpen] = useState(true); // open modal initially
  const [efdData, setEfdData] = useState({
    tin: '',
    customerTIN: '',
    deviceId: '',
    invoiceNumber: '',
    amount: '',
    vatRate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'tin':
        if (!/^\d{9}$/.test(value)) error = 'Invalid TIN (9 digits required)';
        break;
      case 'customerTIN':
        if (!value) error = 'Customer TIN required';
        break;
      case 'deviceId':
        if (!/^EFD-\d{4}-\d{4}$/.test(value)) error = 'Format: EFD-XXXX-XXXX';
        break;
      case 'amount':
        if (value <= 0) error = 'Amount must be positive';
        break;
      case 'vatRate':
        if (value < 0 || value > 30) error = 'VAT rate 0-30%';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  // Mock function for EFD submission
  const handleEFDSubmit = async () => {
    return new Promise((resolve) => setTimeout(resolve, 1500)); // simulate network delay
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleEFDSubmit();
      setActiveStep(1);
      setTimeout(() => {
        setNewTxOpen(false);
        setActiveStep(0);
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Blockchain submission failed. Please retry.' });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog
      open={newTxOpen}
      onClose={() => !isSubmitting && setNewTxOpen(false)}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Slide}
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: 'background.paper',
          boxShadow: 24,
        },
      }}
    >
      <DialogTitle sx={{ px: 4, pt: 3, pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              '& svg': { transition: 'transform 0.3s' },
              ...(isSubmitting && { bgcolor: 'success.main' }),
            }}
          >
            {activeStep === 0 ? <IconDeviceFloppy size={24} /> : <IconShieldCheck size={24} />}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {activeStep === 0 ? 'New EFD Transaction' : 'Blockchain Confirmation'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activeStep === 0
                ? 'Secure transaction certification'
                : 'Validating with Hyperledger Fabric'}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pt: 3, pb: 0 }}>
        <Collapse in={activeStep === 0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Merchant TIN"
                value={efdData.tin}
                onChange={(e) => {
                  setEfdData({ ...efdData, tin: e.target.value });
                  validateField('tin', e.target.value);
                }}
                error={!!errors.tin}
                helperText={errors.tin}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconId size={20} color={errors.tin ? 'error' : 'inherit'} />
                    </InputAdornment>
                  ),
                  inputProps: { maxLength: 9 },
                }}
                variant="filled"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer TIN"
                value={efdData.customerTIN}
                onChange={(e) => {
                  setEfdData({ ...efdData, customerTIN: e.target.value });
                  validateField('customerTIN', e.target.value);
                }}
                error={!!errors.customerTIN}
                helperText={errors.customerTIN}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconId size={20} color={errors.customerTIN ? 'error' : 'inherit'} />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="EFD Device ID"
                value={efdData.deviceId}
                onChange={(e) => {
                  setEfdData({ ...efdData, deviceId: e.target.value });
                  validateField('deviceId', e.target.value);
                }}
                error={!!errors.deviceId}
                helperText={errors.deviceId || 'Format: EFD-XXXX-XXXX'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconFingerprint size={20} color={errors.deviceId ? 'error' : 'inherit'} />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={efdData.invoiceNumber}
                onChange={(e) => setEfdData({ ...efdData, invoiceNumber: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconReceipt size={20} />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount (TZS)"
                type="number"
                value={efdData.amount}
                onChange={(e) => {
                  setEfdData({ ...efdData, amount: parseFloat(e.target.value) });
                  validateField('amount', parseFloat(e.target.value));
                }}
                error={!!errors.amount}
                helperText={errors.amount}
                InputProps={{
                  startAdornment: <InputAdornment position="start">TZS</InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconCurrencyDollar size={20} />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="VAT Rate"
                type="number"
                value={efdData.vatRate}
                onChange={(e) => {
                  setEfdData({ ...efdData, vatRate: parseFloat(e.target.value) });
                  validateField('vatRate', parseFloat(e.target.value));
                }}
                error={!!errors.vatRate}
                helperText={errors.vatRate}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                variant="filled"
              />
            </Grid>
          </Grid>
        </Collapse>

        <Collapse in={activeStep === 1}>
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress size={60} thickness={4} color="success" />
            <Typography variant="h6" sx={{ mt: 3 }}>
              Securing Transaction...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Validating with 4 blockchain nodes
            </Typography>
          </Box>
        </Collapse>
      </DialogContent>

      <DialogActions
        sx={{
          px: 4,
          pt: 3,
          pb: 4,
          borderTop: activeStep === 0 ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        {activeStep === 0 ? (
          <>
            <Button onClick={() => setNewTxOpen(false)} variant="text" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={Object.keys(errors).some((k) => errors[k]) || isSubmitting}
              startIcon={!isSubmitting && <IconShieldCheck />}
              sx={{ minWidth: 180 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Certify Transaction'
              )}
            </Button>
          </>
        ) : (
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              variant="indeterminate"
              color="success"
              sx={{ height: 4, borderRadius: 2 }}
            />
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewTransactionModal;
