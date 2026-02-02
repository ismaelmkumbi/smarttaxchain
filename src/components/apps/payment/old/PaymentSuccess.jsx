// PaymentSuccess.jsx
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
const PaymentSuccess = ({ receipt }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
      <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Your payment of {formatCurrency(receipt.amount)} has been processed successfully.
      </Typography>

      <Box sx={{ textAlign: 'left', mb: 3, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="subtitle2">Transaction Details</Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Receipt Number" secondary={receipt.receiptNumber} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Date" secondary={formatDate(receipt.date)} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Payment Method" secondary={receipt.method} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Blockchain Transaction"
              secondary={
                <Link href={`/blockchain/${receipt.blockchainTxId}`} target="_blank">
                  {receipt.blockchainTxId.substring(0, 12)}...
                </Link>
              }
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" onClick={() => window.print()} startIcon={<Print />}>
          Print Receipt
        </Button>
        <Button variant="outlined" onClick={() => navigate('/payments')}>
          Back to Payments
        </Button>
      </Box>
    </Paper>
  );
};
