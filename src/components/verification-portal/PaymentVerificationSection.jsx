import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Chip,
  Stack,
  Grid,
  useTheme,
  alpha,
  InputAdornment,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Verified,
  CheckCircle,
  Cancel,
  Schedule,
  Receipt,
  ContentCopy,
  Download,
} from '@mui/icons-material';
import { formatCurrency, formatDate, shortenHash } from 'src/utils/verification/formatters';
import AssessmentTimeline from './AssessmentTimeline';
import BlockchainTransparencyPanel from './BlockchainTransparencyPanel';
import { mockAssessmentData } from './testData';

const PaymentVerificationSection = () => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('controlNumber'); // controlNumber, receiptNumber
  const [verificationResult, setVerificationResult] = useState(null);
  const [auditTrail, setAuditTrail] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setLoading(true);
    try {
      // TODO: Call payment verification API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock result
      const result = {
        controlNumber: searchValue,
        receiptNumber: 'REC-2025-001234',
        status: 'PAID',
        amount: 2000000,
        paymentDate: '2025-11-22T10:30:00.000Z',
        bankAcknowledgment: 'ACK-2025-001234',
        blockchainTxId: 'payment_tx_abc123def456ghi789jkl012mno345pqr678',
        reconciliationStatus: 'CONFIRMED',
        bankName: 'CRDB Bank',
        paymentMethod: 'BANK_TRANSFER',
        assessmentId: 'ASSESS-2025-1763533388302-2027',
      };
      
      setVerificationResult(result);
      
      // Create payment-specific audit trail
      const paymentAuditTrail = [
        {
          id: 'PAY-AUDIT-1',
          action: 'PAYMENT_CREATED',
          timestamp: result.paymentDate,
          officerId: 'OFF-PAY-001',
          officerRole: 'Payment Officer',
          description: `Payment of ${formatCurrency(result.amount)} created`,
          changes: [],
          blockchainTxId: result.blockchainTxId,
        },
        {
          id: 'PAY-AUDIT-2',
          action: 'PAYMENT_CONFIRMED',
          timestamp: new Date(new Date(result.paymentDate).getTime() + 3600000).toISOString(),
          officerId: 'OFF-PAY-002',
          officerRole: 'Bank Reconciliation Officer',
          description: `Payment confirmed and reconciled`,
          changes: [{ field: 'status', oldValue: 'PENDING', newValue: 'CONFIRMED' }],
          blockchainTxId: result.blockchainTxId,
        },
      ];
      
      setAuditTrail(paymentAuditTrail);
      
      // Create payment-specific blockchain data
      setBlockchainData({
        transactionId: result.blockchainTxId,
        blockNumber: '12345',
        timestamp: result.paymentDate,
        channelId: 'mychannel',
        chaincodeName: 'tra-payment-ledger',
        contractName: 'PaymentContract',
        assessmentId: result.assessmentId,
        endorsingOrgs: ['Bank1', 'TRA'],
      });
    } catch (error) {
      setVerificationResult({
        status: 'NOT_FOUND',
        error: error.message,
      });
      setAuditTrail(null);
      setBlockchainData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PAID: { color: 'success', icon: <CheckCircle />, label: 'Paid' },
      UNPAID: { color: 'warning', icon: <Schedule />, label: 'Unpaid' },
      REVERSED: { color: 'error', icon: <Cancel />, label: 'Reversed' },
      EXPIRED: { color: 'error', icon: <Cancel />, label: 'Expired' },
      NOT_FOUND: { color: 'default', icon: <Cancel />, label: 'Not Found' },
    };
    return configs[status] || configs.NOT_FOUND;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Payment Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Verify payment status using control number or receipt number
            </Typography>
          </Box>

          {/* Search Input */}
          <Box>
            <TextField
              fullWidth
              label={`Enter ${searchType === 'controlNumber' ? 'Control Number' : 'Receipt Number'}`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchType === 'controlNumber' ? 'CN-2025-...' : 'REC-2025-...'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Receipt color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack direction="row" spacing={0.5}>
                      <Chip
                        label="Control"
                        size="small"
                        onClick={() => setSearchType('controlNumber')}
                        color={searchType === 'controlNumber' ? 'primary' : 'default'}
                        sx={{ cursor: 'pointer' }}
                      />
                      <Chip
                        label="Receipt"
                        size="small"
                        onClick={() => setSearchType('receiptNumber')}
                        color={searchType === 'receiptNumber' ? 'primary' : 'default'}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Stack>
                  </InputAdornment>
                ),
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleSearch}
              disabled={loading || !searchValue.trim()}
              startIcon={<Search />}
            >
              {loading ? 'Verifying...' : 'Verify Payment'}
            </Button>
          </Box>

          {/* Verification Result */}
          {verificationResult && (
            <Box
              sx={{
                p: 3,
                bgcolor: alpha(
                  theme.palette[getStatusConfig(verificationResult.status).color]?.main || theme.palette.primary.main,
                  0.1
                ),
                borderRadius: 2,
                border: `2px solid ${alpha(
                  theme.palette[getStatusConfig(verificationResult.status).color]?.main || theme.palette.primary.main,
                  0.3
                )}`,
              }}
            >
              {verificationResult.error ? (
                <Alert severity="error">{verificationResult.error}</Alert>
              ) : (
                <Stack spacing={3}>
                  {/* Status Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {getStatusConfig(verificationResult.status).icon}
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Payment Status: {getStatusConfig(verificationResult.status).label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {verificationResult.controlNumber && `Control: ${verificationResult.controlNumber}`}
                          {verificationResult.receiptNumber && ` | Receipt: ${verificationResult.receiptNumber}`}
                        </Typography>
                      </Box>
                    </Stack>
                    {verificationResult.blockchainTxId && (
                      <Chip
                        label="Blockchain Verified"
                        color="success"
                        icon={<Verified />}
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>

                  {/* Payment Details Table */}
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                          <TableCell>
                            <Typography variant="h6" fontWeight={700} color="success.main">
                              {formatCurrency(verificationResult.amount)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Payment Date</TableCell>
                          <TableCell>{formatDate(verificationResult.paymentDate)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                          <TableCell>{verificationResult.paymentMethod || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Bank</TableCell>
                          <TableCell>{verificationResult.bankName || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Bank Acknowledgment</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {verificationResult.bankAcknowledgment || 'N/A'}
                              </Typography>
                              {verificationResult.bankAcknowledgment && (
                                <Tooltip title="Copy">
                                  <IconButton size="small" onClick={() => handleCopy(verificationResult.bankAcknowledgment)}>
                                    <ContentCopy fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Blockchain TX ID</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                {shortenHash(verificationResult.blockchainTxId)}
                              </Typography>
                              <Tooltip title={verificationResult.blockchainTxId}>
                                <IconButton size="small" onClick={() => handleCopy(verificationResult.blockchainTxId)}>
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Reconciliation</TableCell>
                          <TableCell>
                            <Chip
                              label={verificationResult.reconciliationStatus || 'PENDING'}
                              color={verificationResult.reconciliationStatus === 'CONFIRMED' ? 'success' : 'warning'}
                              size="small"
                              icon={verificationResult.reconciliationStatus === 'CONFIRMED' ? <CheckCircle /> : <Schedule />}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                </Stack>
              )}
            </Box>
          )}

          {/* Integrated Audit Trail Section */}
          {verificationResult && !verificationResult.error && auditTrail && auditTrail.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Payment Audit Trail
              </Typography>
              <AssessmentTimeline auditTrail={auditTrail} />
            </Box>
          )}

          {/* Integrated Blockchain Proof Section */}
          {verificationResult && !verificationResult.error && blockchainData && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Blockchain Proof
              </Typography>
              <BlockchainTransparencyPanel blockchainData={blockchainData} />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PaymentVerificationSection;

