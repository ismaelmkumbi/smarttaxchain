// src/components/apps/payment/PaymentHistoryDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Button,
  useTheme,
} from '@mui/material';
import { Receipt, Close, AccountBalance } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const PaymentHistoryDialog = ({ open, onClose, payments, loading, assessmentId }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Receipt color="primary" />
            <Typography variant="h6" component="span">Payment History & Receipts</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : !payments || payments.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Receipt sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Payment History Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No payment records found for this assessment.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.secondary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Receipt ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }} align="right">Amount</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Payment Method</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Payment Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Reference</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Received By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={payment.receipt_id || payment.receiptId || index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {payment.receipt_id || payment.receiptId || 'N/A'}
                      </Typography>
                      {payment.tx_id && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          TX: {payment.tx_id}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {formatCurrency(payment.amount ?? payment.amount_paid ?? 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={(payment.payment_method ?? payment.paymentMethod) || 'N/A'}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {(payment.timestamp ?? payment.payment_date ?? payment.paymentDate)
                          ? new Date(payment.timestamp ?? payment.payment_date ?? payment.paymentDate).toLocaleString('en-TZ')
                          : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {(payment.payment_reference ?? payment.paymentReference) || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {(payment.received_by ?? payment.receivedBy) || 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Box>
          {assessmentId && (
            <Button
              startIcon={<AccountBalance />}
              onClick={() => {
                onClose();
                navigate(`/apps/assessment/${assessmentId}/account`);
              }}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              View full account
            </Button>
          )}
        </Box>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001B3D' } }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

