// PaymentForm.jsx
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Payment,
  History,
  Receipt,
  PendingActions,
  AttachMoney,
  CalendarMonth,
  Warning,
} from '@mui/icons-material';
const PaymentForm = ({ amount, paymentMethod, onMethodChange, onSubmit, processing }) => {
  const [bankRef, setBankRef] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileNetwork, setMobileNetwork] = useState('vodacom');
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Select Payment Method
      </Typography>

      <RadioGroup value={paymentMethod} onChange={(e) => onMethodChange(e.target.value)}>
        <FormControlLabel value="bank" control={<Radio />} label="Bank Transfer" />
        <FormControlLabel value="mobile" control={<Radio />} label="Mobile Money" />
        <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
      </RadioGroup>

      <Divider sx={{ my: 3 }} />

      {/* Dynamic fields based on selection */}
      {paymentMethod === 'bank' && (
        <TextField
          fullWidth
          label="Bank Reference Number"
          value={bankRef}
          onChange={(e) => setBankRef(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      {paymentMethod === 'mobile' && (
        <>
          <Select
            fullWidth
            value={mobileNetwork}
            onChange={(e) => setMobileNetwork(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="vodacom">M-Pesa (Vodacom)</MenuItem>
            <MenuItem value="tigo">Tigo Pesa</MenuItem>
            <MenuItem value="airtel">Airtel Money</MenuItem>
          </Select>
          <TextField
            fullWidth
            label="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </>
      )}

      {paymentMethod === 'card' && (
        <Box sx={{ mb: 2 }}>
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
        <Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
        <Typography variant="body2">
          I authorize TRA to collect {formatCurrency(amount)} from my account
        </Typography>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          onClick={onSubmit}
          disabled={!paymentMethod || !agreeTerms || processing}
          startIcon={processing ? <CircularProgress size={20} /> : null}
        >
          {processing ? 'Processing...' : 'Confirm Payment'}
        </Button>
      </Box>
    </>
  );
};
