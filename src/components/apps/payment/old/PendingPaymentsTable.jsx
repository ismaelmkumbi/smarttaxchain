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
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount);
};
export const PendingPaymentsTable = ({ payments, onPayNow }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Assessment</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell>Due Date</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{payment.name}</TableCell>
            <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
            <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Chip label={payment.status} color="warning" size="small" />
            </TableCell>
            <TableCell>
              <Button variant="contained" size="small" onClick={() => onPayNow(payment.id)}>
                Pay Now
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export const PaymentHistoryTable = ({ payments }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Assessment</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell>Paid Date</TableCell>
          <TableCell>Receipt</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{payment.name}</TableCell>
            <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
            <TableCell>{new Date(payment.paidDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button variant="outlined" size="small" startIcon={<Receipt />}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
