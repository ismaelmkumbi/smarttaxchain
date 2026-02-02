const PaymentConfirmationModal = ({ open, onClose, payment, onConfirm }) => {
  const theme = useTheme();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    onConfirm(payment.id);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Confirm Payment</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>

        <Typography variant="body1" gutterBottom>
          You are about to pay{' '}
          {new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
          }).format(payment.amount)}{' '}
          to {payment.taxpayerName}
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            fullWidth
          >
            <MenuItem value="wallet">Wallet Balance</MenuItem>
            <MenuItem value="card">Credit/Debit Card</MenuItem>
            <MenuItem value="mpesa">MPesa</MenuItem>
          </TextField>
          <FormHelperText>Select your preferred payment method</FormHelperText>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!paymentMethod || processing}
            endIcon={processing ? <PendingActions sx={{ color: 'white' }} /> : null}
          >
            {processing ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
