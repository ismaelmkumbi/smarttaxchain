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
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Search,
  Verified,
  Warning,
  CheckCircle,
  Cancel,
  Schedule,
  Visibility,
  Assessment,
} from '@mui/icons-material';
import { formatCurrency, formatDate, formatStatus, getStatusColor } from 'src/utils/verification/formatters';
import AssessmentTimeline from './AssessmentTimeline';
import BlockchainTransparencyPanel from './BlockchainTransparencyPanel';
import { mockAssessmentData } from './testData';

const EnhancedAssessmentVerification = ({ onViewAuditTrail, onVerify }) => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('assessmentId'); // assessmentId, tin, controlNumber
  const [verificationResult, setVerificationResult] = useState(null);
  const [auditTrail, setAuditTrail] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setLoading(true);
    try {
      // TODO: Call verification API
      // For now, use mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock result with full data
      const result = {
        valid: true,
        status: 'VALID',
        assessmentId: searchValue,
        amount: 7800000,
        issueDate: '2025-11-19T06:23:08.302Z',
        dueDate: '2025-11-21T00:00:00.000Z',
        assessmentType: 'INDIVIDUAL_INCOME_TAX',
        blockchainVerified: true,
        blockchainTxId: 'dae64a26e56018b4130c9a1ee6eec8a82e78f54ad7023d2d899c8a3920721444',
      };
      
      setVerificationResult(result);
      
      // Load audit trail and blockchain data
      setAuditTrail(mockAssessmentData.auditTrail || []);
      setBlockchainData({
        ...mockAssessmentData.blockchain,
        assessmentId: result.assessmentId,
        transactionId: result.blockchainTxId,
      });
    } catch (error) {
      setVerificationResult({
        valid: false,
        status: 'INVALID',
        error: error.message,
      });
      setAuditTrail(null);
      setBlockchainData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      VALID: <CheckCircle color="success" />,
      INVALID: <Cancel color="error" />,
      TAMPERED: <Warning color="error" />,
      PENDING: <Schedule color="warning" />,
    };
    return iconMap[status] || <Info />;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      VALID: 'success',
      INVALID: 'error',
      TAMPERED: 'error',
      PENDING: 'warning',
    };
    return colorMap[status] || 'default';
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Assessment Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Verify assessment status, blockchain integrity, and view complete audit trail
            </Typography>
          </Box>

          {/* Search Input */}
          <Box>
            <TextField
              fullWidth
              label={`Enter ${searchType === 'assessmentId' ? 'Assessment ID' : searchType === 'tin' ? 'TIN' : 'Control Number'}`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                searchType === 'assessmentId'
                  ? 'ASSESS-2025-...'
                  : searchType === 'tin'
                  ? '123456789'
                  : 'CN-2025-...'
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack direction="row" spacing={0.5}>
                      <Chip
                        label="ID"
                        size="small"
                        onClick={() => setSearchType('assessmentId')}
                        color={searchType === 'assessmentId' ? 'primary' : 'default'}
                        sx={{ cursor: 'pointer' }}
                      />
                      <Chip
                        label="TIN"
                        size="small"
                        onClick={() => setSearchType('tin')}
                        color={searchType === 'tin' ? 'primary' : 'default'}
                        sx={{ cursor: 'pointer' }}
                      />
                      <Chip
                        label="Control"
                        size="small"
                        onClick={() => setSearchType('controlNumber')}
                        color={searchType === 'controlNumber' ? 'primary' : 'default'}
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
              {loading ? 'Verifying...' : 'Verify Assessment'}
            </Button>
          </Box>

          {/* Verification Result */}
          {verificationResult && (
            <Box
              sx={{
                p: 3,
                bgcolor: alpha(
                  theme.palette[getStatusColor(verificationResult.status)]?.main || theme.palette.primary.main,
                  0.1
                ),
                borderRadius: 2,
                border: `2px solid ${alpha(
                  theme.palette[getStatusColor(verificationResult.status)]?.main || theme.palette.primary.main,
                  0.3
                )}`,
              }}
            >
              <Stack spacing={2}>
                {/* Status Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {getStatusIcon(verificationResult.status)}
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Assessment Status: {verificationResult.status}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Assessment ID: {verificationResult.assessmentId}
                      </Typography>
                    </Box>
                  </Stack>
                  {verificationResult.blockchainVerified && (
                    <Chip
                      label="Blockchain Verified"
                      color="success"
                      icon={<Verified />}
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>

                {verificationResult.valid ? (
                  <>
                    {/* Summary Grid */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Amount
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="primary">
                          {formatCurrency(verificationResult.amount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Assessment Type
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {verificationResult.assessmentType}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Issue Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(verificationResult.issueDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Due Date
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {formatDate(verificationResult.dueDate)}
                        </Typography>
                      </Grid>
                    </Grid>

                  </>
                ) : (
                  <Alert severity="error">{verificationResult.error || 'Assessment not found or invalid'}</Alert>
                )}
              </Stack>
            </Box>
          )}

          {/* Integrated Audit Trail Section */}
          {verificationResult?.valid && auditTrail && auditTrail.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Audit Trail
              </Typography>
              <AssessmentTimeline auditTrail={auditTrail} />
            </Box>
          )}

          {/* Integrated Blockchain Proof Section */}
          {verificationResult?.valid && blockchainData && (
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

export default EnhancedAssessmentVerification;

