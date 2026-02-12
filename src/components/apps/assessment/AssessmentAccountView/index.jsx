import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Payment,
  Receipt,
  AccountBalance,
  CalendarToday,
} from '@mui/icons-material';
import taxAssessmentService from 'src/services/taxAssessmentService';
import paymentService from 'src/services/paymentService';
import { useAuth } from 'src/context/AuthContext';
import { PaymentConfirmationModal } from 'src/components/apps/payment/modal/PaymentConfirmationModal';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-TZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusColor = (status) => {
  const s = (status || '').toUpperCase();
  if (s === 'PAID') return 'success';
  if (s === 'PARTIALLY_PAID') return 'warning';
  return 'default';
};

const AssessmentAccountView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadAccount = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await taxAssessmentService.getAssessmentAccount(id);
      setAccount(data);
    } catch (err) {
      setError(err?.message || 'Failed to load account');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  const remaining = account?.account_summary?.remaining_balance ?? 0;

  const paymentForModal = account
    ? {
        id: id,
        assessmentId: id,
        taxpayerName: account.taxpayerName || 'N/A',
        taxpayerTin: account.assessment?.Tin ?? account.assessment?.tin ?? 'N/A',
        amount: account.account_summary?.total_due ?? 0,
        totalPaid: account.account_summary?.total_paid ?? 0,
        remainingBalance: remaining,
        dueDate: account.assessment?.DueDate ?? account.assessment?.dueDate,
      }
    : null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go back
        </Button>
      </Box>
    );
  }

  const a = account?.assessment || {};
  const summary = account?.account_summary || {};
  const entries = account?.payment_entries || [];

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h4" fontWeight={700}>
          Assessment Account
        </Typography>
      </Stack>

      {/* Assessment header */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={700}>
                {a.ID || id}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip size="small" label={`TIN: ${a.Tin || a.tin || 'N/A'}`} variant="outlined" />
                <Chip size="small" label={`${a.TaxType || a.taxType || 'N/A'}`} variant="outlined" />
                <Chip size="small" label={`Period: ${a.Period || a.period || 'N/A'}`} variant="outlined" />
                <Chip size="small" label={`Due: ${formatDate(a.DueDate || a.dueDate)}`} icon={<CalendarToday />} />
                <Chip
                  label={account?.status || a.Status || a.status || 'PENDING'}
                  color={getStatusColor(account?.status || a.Status)}
                  size="small"
                />
              </Stack>
            </Stack>
            <Button
              variant="contained"
              startIcon={<Payment />}
              onClick={() => setPaymentModalOpen(true)}
              disabled={remaining <= 0}
            >
              Record payment
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Account summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total due', value: summary.total_due, icon: <AccountBalance /> },
          { label: 'Total paid', value: summary.total_paid, icon: <Receipt /> },
          { label: 'Remaining balance', value: summary.remaining_balance, icon: <Payment /> },
          { label: 'Payment count', value: summary.payment_count, icon: null, format: (v) => String(v ?? 0) },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Card sx={{ bgcolor: alpha('#fff200', 0.08) }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {item.format ? item.format(item.value) : formatCurrency(item.value)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payment entries table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700}>
            Payment entries
          </Typography>
          <Typography variant="body2" color="text.secondary">
            What was paid, when, and balance after each payment
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount paid</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Received by</TableCell>
                <TableCell align="right">Balance after</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No payments recorded yet</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((e) => (
                  <TableRow key={e.entry_number || e.receipt_id}>
                    <TableCell>{e.entry_number}</TableCell>
                    <TableCell>{formatDate(e.payment_date)}</TableCell>
                    <TableCell align="right">{formatCurrency(e.amount_paid)}</TableCell>
                    <TableCell>{e.payment_method || '—'}</TableCell>
                    <TableCell>{e.payment_reference || '—'}</TableCell>
                    <TableCell>{e.received_by || '—'}</TableCell>
                    <TableCell align="right">
                      {e.balance_after != null ? formatCurrency(e.balance_after) : '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Record payment modal - same as tax payments list */}
      {paymentForModal && (
        <PaymentConfirmationModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          payment={paymentForModal}
          onConfirm={async (paymentData) => {
            try {
              await paymentService.recordPayment(paymentData.assessmentId, {
                amount: paymentData.amount,
                paymentMethod: paymentData.paymentMethod || 'BANK_TRANSFER',
                paymentDate: paymentData.paymentDate || new Date().toISOString(),
                receivedBy: user?.email || user?.username || 'system',
              });
              setSnackbar({ open: true, message: 'Payment recorded successfully', severity: 'success' });
              await loadAccount();
              setPaymentModalOpen(false);
            } catch (err) {
              setSnackbar({ open: true, message: err?.message || 'Failed to record payment', severity: 'error' });
              throw err;
            }
          }}
          balance={0}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AssessmentAccountView;
