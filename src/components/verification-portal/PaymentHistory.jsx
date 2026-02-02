import React from 'react';
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
} from '@mui/material';
import {
  Payment,
  Verified,
  Receipt,
  ContentCopy,
  CheckCircle,
} from '@mui/icons-material';
import { formatCurrency, formatDate, shortenHash } from 'src/utils/verification/formatters';

const PaymentHistory = ({ payments = [] }) => {
  const theme = useTheme();

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <Payment sx={{ fontSize: 48, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" align="center">
              No payment records found for this assessment.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card
      sx={{
        boxShadow: 2,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Payment color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Payment History
          </Typography>
          <Chip label={`${payments.length} Payment(s)`} size="small" color="primary" />
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Blockchain</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Receipt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={payment.id || index} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(payment.paymentDate || payment.PaymentDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {formatCurrency(payment.amount || payment.Amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.paymentMethod || payment.PaymentMethod || 'N/A'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                        }}
                      >
                        {payment.reference || payment.Reference || 'N/A'}
                      </Typography>
                      {payment.reference && (
                        <Tooltip title="Copy reference">
                          <IconButton
                            size="small"
                            onClick={() => handleCopy(payment.reference || payment.Reference)}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status || payment.Status || 'N/A'}
                      color={payment.status === 'CONFIRMED' || payment.status === 'PAID' ? 'success' : 'default'}
                      size="small"
                      icon={payment.status === 'CONFIRMED' || payment.status === 'PAID' ? <CheckCircle /> : null}
                    />
                  </TableCell>
                  <TableCell>
                    {payment.blockchainTxId ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Verified color="success" fontSize="small" />
                        <Tooltip title={payment.blockchainTxId}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'monospace',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleCopy(payment.blockchainTxId)}
                          >
                            {shortenHash(payment.blockchainTxId)}
                          </Typography>
                        </Tooltip>
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Not verified
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.receiptUrl ? (
                      <IconButton
                        size="small"
                        href={payment.receiptUrl}
                        target="_blank"
                        color="primary"
                      >
                        <Receipt />
                      </IconButton>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" fontWeight={600}>
              Total Paid:
            </Typography>
            <Typography variant="h6" fontWeight={700} color="success.main">
              {formatCurrency(
                payments.reduce(
                  (sum, p) => sum + (p.amount || p.Amount || 0),
                  0
                )
              )}
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;

