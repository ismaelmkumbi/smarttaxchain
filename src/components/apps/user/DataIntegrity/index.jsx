// src/components/apps/user/DataIntegrity/index.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  Stack,
  LinearProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  VerifiedUser,
  Warning,
  Error as ErrorIcon,
  Refresh,
  Search,
  CheckCircle,
  Cancel,
  History,
  Security,
  Close,
} from '@mui/icons-material';
import userManagementService from 'src/services/userManagementService';
import { Fade, Grow } from '@mui/material';

const DataIntegrity = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [integrityReport, setIntegrityReport] = useState(null);
  const [verificationResults, setVerificationResults] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [staffVerification, setStaffVerification] = useState(null);
  const [verifyingStaff, setVerifyingStaff] = useState(false);
  const [historyDialog, setHistoryDialog] = useState({ open: false, staffId: null, history: [] });
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadIntegrityReport();
  }, []);

  const loadIntegrityReport = async () => {
    setLoading(true);
    try {
      const report = await userManagementService.getIntegrityReport();
      setIntegrityReport(report);
    } catch (error) {
      console.error('Error loading integrity report:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyAllStaff = async () => {
    setVerifying(true);
    try {
      const results = await userManagementService.verifyAll({ limit: 1000 });
      setVerificationResults(results);
    } catch (error) {
      console.error('Error verifying all staff:', error);
    } finally {
      setVerifying(false);
    }
  };

  const verifyStaff = async () => {
    if (!selectedStaffId.trim()) return;
    setVerifyingStaff(true);
    try {
      const result = await userManagementService.verifyStaff(selectedStaffId.trim());
      setStaffVerification(result);
    } catch (error) {
      console.error('Error verifying staff:', error);
      setStaffVerification({
        verified: false,
        error: error?.response?.data?.message || error?.message || 'Verification failed',
      });
    } finally {
      setVerifyingStaff(false);
    }
  };

  const loadStaffHistory = async (staffId) => {
    setLoadingHistory(true);
    try {
      const history = await userManagementService.getStaffHistory(staffId);
      setHistoryDialog({ open: true, staffId, history });
    } catch (error) {
      console.error('Error loading staff history:', error);
      setHistoryDialog({ open: true, staffId, history: [] });
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-TZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Data Integrity Verification
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verify database records against immutable blockchain ledger
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={loadIntegrityReport}
          disabled={loading}
          sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001B3D' } }}
        >
          Refresh Report
        </Button>
      </Box>

      {/* Integrity Report */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : integrityReport ? (
        <Grow in={true} timeout={600}>
          <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                Integrity Report
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Users
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color={theme.palette.info.main}>
                      {integrityReport?.database?.totalUsers || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Users with Staff ID
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color={theme.palette.success.main}>
                      {integrityReport?.database?.usersWithStaffId || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Active Users
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color={theme.palette.warning.main}>
                      {integrityReport?.database?.activeUsers || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Blockchain Records
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color={theme.palette.primary.main}>
                      {integrityReport?.blockchain?.totalStaff || 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              {integrityReport?.recommendation && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  {integrityReport.recommendation}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grow>
      ) : null}

      {/* Verify All Staff */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Verify All Staff Records
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compare all database records against blockchain ledger
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={verifying ? <CircularProgress size={20} /> : <Security />}
              onClick={verifyAllStaff}
              disabled={verifying}
              sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001B3D' } }}
            >
              {verifying ? 'Verifying...' : 'Verify All'}
            </Button>
          </Box>

          {verificationResults && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color={theme.palette.info.main}>
                      {verificationResults?.summary?.total || verificationResults?.total || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Verified
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color={theme.palette.success.main}>
                      {verificationResults?.summary?.verified || verificationResults?.verified || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.error.main, 0.1), textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Failed
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color={theme.palette.error.main}>
                      {verificationResults?.summary?.failed || verificationResults?.failed || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Discrepancies
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color={theme.palette.warning.main}>
                      {verificationResults?.summary?.discrepancies || verificationResults?.discrepancies || 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {verificationResults?.summary?.integrity && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Data Integrity
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="primary">
                      {verificationResults.summary.integrity}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(verificationResults.summary.integrity) || 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}

              {verificationResults?.details && verificationResults.details.length > 0 && (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Staff ID</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Discrepancies</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {verificationResults.details.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell>{detail.staffId || 'N/A'}</TableCell>
                          <TableCell>
                            {detail.verified ? (
                              <Chip
                                icon={<CheckCircle />}
                                label="Verified"
                                color="success"
                                size="small"
                              />
                            ) : (
                              <Chip
                                icon={<Cancel />}
                                label="Failed"
                                color="error"
                                size="small"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {detail.discrepancies && detail.discrepancies.length > 0 ? (
                              <Box>
                                {detail.discrepancies.map((disc, i) => (
                                  <Typography key={i} variant="caption" display="block">
                                    {disc.field}: {disc.database} → {disc.blockchain}
                                  </Typography>
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                None
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {detail.staffId && (
                              <Tooltip title="View History">
                                <IconButton
                                  size="small"
                                  onClick={() => loadStaffHistory(detail.staffId)}
                                >
                                  <History fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Verify Specific Staff */}
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Verify Specific Staff Record
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Staff ID"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              placeholder="Enter Staff ID"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  verifyStaff();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={verifyStaff}
              disabled={verifyingStaff || !selectedStaffId.trim()}
              sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001B3D' } }}
            >
              {verifyingStaff ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </Stack>

          {staffVerification && (
            <Box>
              {staffVerification.error ? (
                <Alert severity="error">{staffVerification.error}</Alert>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    {staffVerification.verified ? (
                      <Alert severity="success" icon={<VerifiedUser />}>
                        Staff record verified successfully. Database and blockchain records match.
                      </Alert>
                    ) : (
                      <Alert severity="warning" icon={<Warning />}>
                        Data discrepancies detected. Database and blockchain records do not match.
                      </Alert>
                    )}
                  </Box>

                  {staffVerification.discrepancies && staffVerification.discrepancies.length > 0 && (
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Database Value</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Blockchain Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {staffVerification.discrepancies.map((disc, index) => (
                            <TableRow key={index}>
                              <TableCell>{disc.field}</TableCell>
                              <TableCell>
                                <Typography variant="body2" color="error">
                                  {disc.database}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="success.main" fontWeight={600}>
                                  {disc.blockchain}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Database Record
                        </Typography>
                        <Typography variant="body2">
                          <strong>Email:</strong> {staffVerification.database?.email || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Role:</strong> {staffVerification.database?.role || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Department:</strong> {staffVerification.database?.department || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Active:</strong> {staffVerification.database?.is_active ? 'Yes' : 'No'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Blockchain Record (Source of Truth)
                        </Typography>
                        <Typography variant="body2">
                          <strong>Email:</strong> {staffVerification.blockchain?.email || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Role:</strong> {staffVerification.blockchain?.role || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Department:</strong> {staffVerification.blockchain?.department || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Created:</strong> {formatDate(staffVerification.blockchain?.createdAt)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {staffVerification.staffId && (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="outlined"
                        startIcon={<History />}
                        onClick={() => loadStaffHistory(staffVerification.staffId)}
                      >
                        View Transaction History
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Transaction History Dialog */}
      <Dialog
        open={historyDialog.open}
        onClose={() => setHistoryDialog({ open: false, staffId: null, history: [] })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: '#002855',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Transaction History - {historyDialog.staffId}
          </Typography>
          <IconButton
            onClick={() => setHistoryDialog({ open: false, staffId: null, history: [] })}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {loadingHistory ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : historyDialog.history.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyDialog.history.map((tx, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {tx.txId || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>{tx.action || 'N/A'}</TableCell>
                      <TableCell>{formatDate(tx.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No transaction history found for this staff member.</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setHistoryDialog({ open: false, staffId: null, history: [] })}
            variant="contained"
            sx={{ bgcolor: '#002855', '&:hover': { bgcolor: '#001B3D' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataIntegrity;

