// src/components/verification-portal/CertificateVerification.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Grid,
  Chip,
  Divider,
  useTheme,
  alpha,
  InputAdornment,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Verified,
  Search,
  Description,
  CheckCircle,
  Cancel,
  Warning,
  Download,
  ContentCopy,
  QrCode,
  CalendarToday,
  Person,
  Business,
  Assessment,
  Lock,
} from '@mui/icons-material';
import { formatDate, formatCurrency } from 'src/utils/verification/formatters';

const CertificateVerification = () => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('certificateNumber'); // certificateNumber, tin, controlNumber
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('Please enter a certificate number, TIN, or control number');
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      // Simulate API call - replace with actual API integration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock data - replace with actual API response
      const mockResult = {
        certificateNumber: searchValue,
        certificateType: 'Tax Clearance Certificate',
        status: 'VALID',
        issueDate: new Date('2025-01-15').toISOString(),
        expiryDate: new Date('2025-12-31').toISOString(),
        taxpayer: {
          tin: '787996878',
          name: 'Shakila Ismael',
          type: 'Company',
          registrationDate: new Date('2024-06-01').toISOString(),
        },
        compliance: {
          score: 92,
          riskLevel: 'LOW',
          outstandingAmount: 0,
          lastPaymentDate: new Date('2025-01-10').toISOString(),
        },
        blockchain: {
          verified: true,
          txHash: '0x1234567890abcdef1234567890abcdef12345678',
          blockNumber: 1234567,
          timestamp: new Date('2025-01-15T10:30:00Z').toISOString(),
        },
        issuedBy: {
          officer: 'Officer ID: OFF-2025-001',
          department: 'Tax Clearance Department',
          location: 'Dar es Salaam',
        },
        qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNSVDwvdGV4dD48L3N2Zz4=',
      };

      setVerificationResult(mockResult);
    } catch (err) {
      setError(err.message || 'Failed to verify certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VALID':
        return 'success';
      case 'EXPIRED':
        return 'warning';
      case 'REVOKED':
        return 'error';
      case 'PENDING':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VALID':
        return <CheckCircle />;
      case 'EXPIRED':
        return <Warning />;
      case 'REVOKED':
        return <Cancel />;
      default:
        return <Description />;
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Certificate Verification Portal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verify the authenticity of tax clearance certificates, registration certificates, and other official documents
              </Typography>
            </Box>

            <Divider />

            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Search Type"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="certificateNumber">Certificate Number</option>
                  <option value="tin">Taxpayer TIN</option>
                  <option value="controlNumber">Control Number</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    searchType === 'certificateNumber'
                      ? 'Certificate Number'
                      : searchType === 'tin'
                      ? 'Taxpayer TIN'
                      : 'Control Number'
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder="Enter certificate number, TIN, or control number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading || !searchValue.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                  sx={{
                    bgcolor: '#002855',
                    '&:hover': { bgcolor: '#001B3D' },
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      {verificationResult && (
        <Grid container spacing={3}>
          {/* Certificate Status Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(
                          theme.palette[getStatusColor(verificationResult.status)].main,
                          0.1
                        ),
                        color: theme.palette[getStatusColor(verificationResult.status)].main,
                      }}
                    >
                      {React.cloneElement(getStatusIcon(verificationResult.status), {
                        sx: { fontSize: 32 },
                      })}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {verificationResult.certificateType}
                      </Typography>
                      <Chip
                        label={verificationResult.status}
                        color={getStatusColor(verificationResult.status)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Certificate Number
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography variant="body1" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                        {verificationResult.certificateNumber}
                      </Typography>
                      <Tooltip title="Copy certificate number">
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(verificationResult.certificateNumber)}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {verificationResult.qrCode && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                        QR Code
                      </Typography>
                      <Box
                        component="img"
                        src={verificationResult.qrCode}
                        alt="Certificate QR Code"
                        sx={{
                          width: 120,
                          height: 120,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  )}

                  {verificationResult.blockchain?.verified && (
                    <Alert
                      severity="success"
                      icon={<Lock />}
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Blockchain Verified
                      </Typography>
                      <Typography variant="caption">
                        This certificate is cryptographically verified and cannot be tampered with
                      </Typography>
                    </Alert>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Certificate Details */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Certificate Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* Issue & Expiry Dates */}
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Issue Date
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(verificationResult.issueDate)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Expiry Date
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(verificationResult.expiryDate)}
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* Taxpayer Information */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Taxpayer Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Business fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Taxpayer Name
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        {verificationResult.taxpayer.name}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          TIN
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                        {verificationResult.taxpayer.tin}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="caption" color="text.secondary">
                        Type
                      </Typography>
                      <Chip label={verificationResult.taxpayer.type} size="small" />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="caption" color="text.secondary">
                        Registration Date
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(verificationResult.taxpayer.registrationDate)}
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* Compliance Status */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Compliance Status
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                      }}
                    >
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {verificationResult.compliance.score}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Compliance Score
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                      }}
                    >
                      <Chip
                        label={verificationResult.compliance.riskLevel}
                        color="info"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary" display="block">
                        Risk Level
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                      }}
                    >
                      <Typography variant="h6" fontWeight={600} color="success.main">
                        {formatCurrency(verificationResult.compliance.outstandingAmount)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Outstanding Amount
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Issued By */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Issued By
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Officer
                              </Typography>
                            </TableCell>
                            <TableCell>{verificationResult.issuedBy.officer}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Department
                              </Typography>
                            </TableCell>
                            <TableCell>{verificationResult.issuedBy.department}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Location
                              </Typography>
                            </TableCell>
                            <TableCell>{verificationResult.issuedBy.location}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  {/* Blockchain Verification */}
                  {verificationResult.blockchain && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Blockchain Verification
                      </Typography>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  Transaction Hash
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                  >
                                    {verificationResult.blockchain.txHash.substring(0, 20)}...
                                  </Typography>
                                  <Tooltip title="Copy transaction hash">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleCopy(verificationResult.blockchain.txHash)}
                                    >
                                      <ContentCopy fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  Block Number
                                </Typography>
                              </TableCell>
                              <TableCell>{verificationResult.blockchain.blockNumber.toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  Timestamp
                                </Typography>
                              </TableCell>
                              <TableCell>{formatDate(verificationResult.blockchain.timestamp)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  )}

                  {/* Actions */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        startIcon={<Download />}
                        sx={{
                          bgcolor: '#002855',
                          '&:hover': { bgcolor: '#001B3D' },
                        }}
                      >
                        Download Certificate PDF
                      </Button>
                      <Button variant="outlined" startIcon={<QrCode />}>
                        View QR Code
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CertificateVerification;

