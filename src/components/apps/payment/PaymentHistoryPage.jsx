import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  IconButton,
  LinearProgress,
  CircularProgress,
  useTheme,
  Typography,
  Box,
  Button,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  PhoneIphone as MobileIcon,
  Info as InfoIcon, // ✅ you forgot this one (used when no payments found)
  Download as DownloadIcon, // ✅ you forgot this one (used on download receipt button)
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

export const PaymentHistoryPage = ({
  payments,
  formatCurrency = (amount) => `$${amount.toFixed(2)}`,
  formatDate = (date) => format(new Date(date), 'dd MMM yyyy'),
  onDownloadReceipt,
  loadingPayments,
}) => {
  const theme = useTheme();

  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
        return { color: 'success', icon: <SuccessIcon />, label: 'Paid' };
      case 'pending':
        return { color: 'warning', icon: <WarningIcon />, label: 'Processing' };
      case 'failed':
        return { color: 'error', icon: <WarningIcon />, label: 'Failed' };
      default:
        return { color: 'info', icon: <SuccessIcon />, label: 'Paid' };
    }
  };

  const getMethodIcon = (method) => {
    if (!method) {
      return <CreditCardIcon fontSize="small" />; // fallback default icon
    }

    switch (method.toLowerCase()) {
      case 'credit card':
        return <CreditCardIcon fontSize="small" />;
      case 'bank transfer':
        return <BankIcon fontSize="small" />;
      case 'mobile money':
        return <MobileIcon fontSize="small" />;
      default:
        return <CreditCardIcon fontSize="small" />;
    }
  };

  return (
    <TableContainer component={Paper}>
      {loadingPayments && <LinearProgress />}

      <Table aria-label="Payment history table">
        <TableHead>
          <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
            <TableCell width="5%">
              <Typography variant="subtitle2">#</Typography>
            </TableCell>
            <TableCell width="25%">
              <Typography variant="subtitle2">Invoice</Typography>
            </TableCell>
            <TableCell width="20%">
              <Typography variant="subtitle2">Date</Typography>
            </TableCell>
            <TableCell width="20%">
              <Typography variant="subtitle2">Amount</Typography>
            </TableCell>
            <TableCell width="20%">
              <Typography variant="subtitle2">Status</Typography>
            </TableCell>
            <TableCell width="10%" align="center">
              <Typography variant="subtitle2">Receipt</Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {payments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Box sx={{ color: 'text.secondary' }}>
                  <InfoIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  <Typography variant="body2" display="inline">
                    No payment history found
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}

          {payments.map((payment, index) => {
            const statusConfig = getStatusConfig(payment.status);

            return (
              <TableRow key={payment.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {getMethodIcon(payment.method)}
                    <Typography variant="body2" sx={{ ml: 1.5 }}>
                      {payment.invoiceNo}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{formatDate(payment.paymentDate)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(payment.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    icon={statusConfig.icon}
                    label={statusConfig.label}
                    color={statusConfig.color}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => onDownloadReceipt(payment)}
                    color="primary"
                    size="small"
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PaymentHistoryPage.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      invoiceNo: PropTypes.string.isRequired,
      paymentDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      amount: PropTypes.number.isRequired,
      status: PropTypes.oneOf(['success', 'pending', 'failed']).isRequired,
      method: PropTypes.string.isRequired,
    }),
  ).isRequired,
  formatCurrency: PropTypes.func,
  formatDate: PropTypes.func,
  onDownloadReceipt: PropTypes.func.isRequired,
  loadingPayments: PropTypes.bool,
};
