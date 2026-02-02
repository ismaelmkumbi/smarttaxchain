import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Chip,
  IconButton,
  LinearProgress,
  useTheme,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Warning as WarningIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

export const PendingPaymentsTable = ({
  payments,
  onPay,
  loadingPayments,
  paymentInProgress,
  formatCurrency = (amount) => `$${amount.toFixed(2)}`,
  formatDate = (date) => format(new Date(date), 'dd MMM yyyy'),
}) => {
  const theme = useTheme();

  const getStatusConfig = (status, dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysRemaining = Math.floor((due - today) / (1000 * 60 * 60 * 24));

    if (status === 'paid') return { color: 'success', label: 'Paid' };
    if (due < today) return { color: 'error', label: 'Overdue' };
    if (daysRemaining <= 3) return { color: 'warning', label: 'Due Soon' };
    return { color: 'info', label: 'Pending' };
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        position: 'relative',
        '& .MuiTableCell-root': {
          py: theme.spacing(1.5),
        },
      }}
    >
      {loadingPayments && <LinearProgress />}

      <Table aria-label="Tax payment obligations table">
        <TableHead>
          <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
            <TableCell width="5%">
              <Typography variant="subtitle2">#</Typography>
            </TableCell>
            <TableCell width="20%">
              <Typography variant="subtitle2">Invoice</Typography>
            </TableCell>
            <TableCell width="20%">
              <Box display="flex" alignItems="center">
                <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Due Date</Typography>
              </Box>
            </TableCell>
            <TableCell width="20%">
              <Typography variant="subtitle2">Amount</Typography>
            </TableCell>
            <TableCell width="20%">
              <Typography variant="subtitle2">Status</Typography>
            </TableCell>
            <TableCell width="15%" align="center">
              <Typography variant="subtitle2">Action</Typography>
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
                    No pending payments found
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}

          {payments.map((payment, index) => {
            const statusConfig = getStatusConfig(payment.status, payment.dueDate);
            const isProcessing = paymentInProgress === payment.id;

            return (
              <TableRow
                key={payment.id}
                hover
                sx={{
                  ...(statusConfig.color === 'error' && {
                    bgcolor: theme.palette.error.light + '15',
                    '&:hover': { bgcolor: theme.palette.error.light + '20' },
                  }),
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PaymentIcon fontSize="small" color="action" sx={{ mr: 1.5 }} />
                    <Typography variant="body2" noWrap>
                      {payment.invoiceNo}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    icon={<WarningIcon fontSize="small" />}
                    label={formatDate(payment.dueDate)}
                    sx={{
                      bgcolor:
                        statusConfig.color === 'error'
                          ? theme.palette.error.light + '30'
                          : 'transparent',
                      color: theme.palette[statusConfig.color].dark,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(payment.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={statusConfig.label}
                    color={statusConfig.color}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color={statusConfig.color === 'error' ? 'error' : 'primary'}
                    startIcon={!isProcessing && <PaymentIcon />}
                    onClick={() => onPay(payment)}
                    disabled={isProcessing || payment.status === 'paid'}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    {isProcessing
                      ? 'Processing...'
                      : payment.status === 'paid'
                      ? 'Paid'
                      : 'Pay Now'}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PendingPaymentsTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      invoiceNo: PropTypes.string.isRequired,
      dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      amount: PropTypes.number.isRequired,
      status: PropTypes.oneOf(['paid', 'pending']),
    }),
  ).isRequired,
  onPay: PropTypes.func.isRequired,
  loadingPayments: PropTypes.bool,
  paymentInProgress: PropTypes.string,
  formatCurrency: PropTypes.func,
  formatDate: PropTypes.func,
};
