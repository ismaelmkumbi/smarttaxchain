import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Button,
  Paper,
} from '@mui/material';
import {
  Payment,
  Receipt,
  Download,
  CheckCircle,
  Schedule,
  ArrowForward,
} from '@mui/icons-material';
import { formatCurrency, formatDate } from 'src/utils/verification/formatters';
import { formatCurrency as formatCurrencyUtil } from 'src/utils/formatters';

const MyPayments = ({ tin, sessionToken }) => {
  const theme = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch payments from API
    // For now, use mock data
    setPayments([
      {
        id: 'PAY-001',
        assessmentId: 'ASSESS-2025-1763533388302-2027',
        amount: 2000000,
        paymentDate: '2025-11-22T10:30:00.000Z',
        paymentMethod: 'BANK_TRANSFER',
        status: 'CONFIRMED',
        receiptNumber: 'REC-2025-001234',
        reference: 'REF-2025-001234',
      },
      {
        id: 'PAY-002',
        assessmentId: 'ASSESS-2025-1763505147280-1926',
        amount: 3000000,
        paymentDate: '2025-10-20T14:15:00.000Z',
        paymentMethod: 'MOBILE_MONEY',
        status: 'CONFIRMED',
        receiptNumber: 'REC-2025-000987',
        reference: 'REF-2025-000987',
      },
    ]);
    setLoading(false);
  }, [tin]);

  const getStatusConfig = (status) => {
    const configs = {
      CONFIRMED: { color: 'success', icon: <CheckCircle />, label: 'Confirmed' },
      PENDING: { color: 'warning', icon: <Schedule />, label: 'Pending' },
      FAILED: { color: 'error', icon: <Schedule />, label: 'Failed' },
    };
    return configs[status] || configs.PENDING;
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Payment History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track all your tax payments and receipts
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowForward />}
              onClick={() => {
                // TODO: Navigate to full payments page
                console.log('View all payments');
              }}
            >
              View All
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Loading payments...
              </Typography>
            </Box>
          ) : payments.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Receipt Number</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Assessment ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Payment Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => {
                    const statusConfig = getStatusConfig(payment.status);
                    return (
                      <TableRow key={payment.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {payment.receiptNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {payment.assessmentId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color="success.main">
                            {formatCurrencyUtil(payment.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                            icon={statusConfig.icon}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="View Receipt">
                              <IconButton size="small" color="primary">
                                <Receipt fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Receipt">
                              <IconButton size="small">
                                <Download fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Payment sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No payments found
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MyPayments;

