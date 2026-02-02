import React, { useState, useEffect } from 'react';
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import QRCode from 'qrcode.react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  Tooltip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Avatar,
  useTheme,
  DialogActions,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  OpenInNew as OpenInNewIcon,
  ArrowRightAlt as ArrowRightIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '2px solid #000',
    paddingBottom: 10,
    marginBottom: 20,
  },
  watermark: {
    position: 'absolute',
    opacity: 0.1,
    fontSize: 60,
    transform: 'rotate(-45deg)',
    top: '40%',
    left: '20%',
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    width: '30%',
  },
  value: {
    width: '65%',
  },
  qrContainer: {
    position: 'absolute',
    right: 30,
    top: 30,
  },
});

// PDF Document Component
const GovernmentDocumentPDF = ({ history, assessmentId, selectedEntry }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.watermark}>
        <Text>OFFICIAL AUDIT TRAIL</Text>
      </View>

      <View style={styles.qrContainer}>
        <Image
          source={`data:image/png;base64,${QRCode.toDataURL(selectedEntry?.TxId || '')}`}
          style={{ width: 80, height: 80 }}
        />
      </View>

      <View style={styles.header}>
        <View>
          <Text>REPUBLIC OF EXAMPLE</Text>
          <Text>MINISTRY OF TAXATION</Text>
          <Text>OFFICIAL AUDIT DOCUMENT</Text>
        </View>
        <View>
          <Text>Document No: {Math.random().toString(36).substring(2, 10).toUpperCase()}</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{ marginBottom: 10 }}>ASSESSMENT DETAILS</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Assessment ID:</Text>
          <Text style={styles.value}>{assessmentId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Taxpayer:</Text>
          <Text style={styles.value}>{selectedEntry?.Data?.TaxpayerName || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tax Type:</Text>
          <Text style={styles.value}>{selectedEntry?.Data?.TaxType || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{ marginBottom: 10 }}>AUDIT DETAILS</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{selectedEntry?.TxId || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Timestamp:</Text>
          <Text style={styles.value}>
            {selectedEntry?.Timestamp ? new Date(selectedEntry.Timestamp).toLocaleString() : 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Modified By:</Text>
          <Text style={styles.value}>
            {selectedEntry?.User?.name || 'System'} (
            {selectedEntry?.User?.title || 'Automated Process'})
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Device:</Text>
          <Text style={styles.value}>
            {selectedEntry?.MachineInfo?.os || 'N/A'} (
            {selectedEntry?.MachineInfo?.browser || 'N/A'})
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>IP Address:</Text>
          <Text style={styles.value}>{selectedEntry?.IPAddress || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{ marginBottom: 10 }}>CHANGE DETAILS</Text>
        {selectedEntry?.Changes?.map((change, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Text>{change.field}:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: 'red' }}>{change.oldValue}</Text>
              <ArrowRightIcon />
              <Text style={{ color: 'green' }}>{change.newValue}</Text>
            </View>
          </View>
        ))}
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 30,
          left: 30,
          right: 30,
          borderTop: '1px solid #000',
          paddingTop: 10,
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 10 }}>
          This document is digitally signed and verifiable through the national blockchain. Any
          alterations to this document invalidate its authenticity.
        </Text>
      </View>
    </Page>
  </Document>
);

// User Avatar Component
const UserAvatar = ({ user }) => {
  const theme = useTheme();

  if (user?.image) {
    return <Avatar src={user.image} alt={`${user.name}'s profile`} />;
  }

  return (
    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
      {user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')}
    </Avatar>
  );
};

// Enhanced History Viewer Component
const TaxAssessmentHistoryViewer = ({ assessmentId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchAssessmentHistory = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData = {
          success: true,
          history: [
            {
              TxId: '0x1234567890abcdef1234567890abcdef12345678',
              Timestamp: new Date().toISOString(),
              User: {
                name: 'John Doe',
                title: 'Tax Officer',
                username: 'johndoe',
                image: null,
              },
              MachineInfo: {
                os: 'Windows 10',
                browser: 'Chrome 98',
                ip: '192.168.1.100',
              },
              IPAddress: '192.168.1.100',
              Location: 'Headquarters, Tax Dept',
              BlockchainProof: {
                txUrl: 'https://blockexplorer.com/tx/0x1234567890abcdef1234567890abcdef12345678',
                blockNumber: 1234567,
              },
              Data: {
                ID: assessmentId,
                TaxType: 'Income Tax',
                Status: 'Approved',
                Amount: 1500,
                Currency: 'USD',
                TaxpayerName: 'ABC Corporation',
                Changes: [
                  { field: 'Status', oldValue: 'Pending', newValue: 'Approved' },
                  { field: 'Amount', oldValue: '1000', newValue: '1500' },
                ],
              },
              IsDeleted: false,
            },
            // Add more mock entries as needed
          ],
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setHistory(mockData.history);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentHistory();
  }, [assessmentId]);

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const shortenHash = (hash) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getActionDetails = (isDeleted, index) => {
    if (isDeleted) return { label: 'Deleted', color: 'error' };
    return index === 0
      ? { label: 'Created', color: 'success' }
      : { label: 'Updated', color: 'primary' };
  };

  const computeChanges = (previous, current) => {
    if (!previous)
      return Object.keys(current).map((key) => ({
        field: key,
        oldValue: 'N/A',
        newValue: current[key],
      }));

    const changes = [];
    for (const key in current) {
      if (JSON.stringify(previous[key]) !== JSON.stringify(current[key])) {
        changes.push({
          field: key,
          oldValue: previous[key] ?? 'N/A',
          newValue: current[key],
        });
      }
    }
    return changes;
  };

  const filteredHistory = history.filter(
    (entry) =>
      entry.Data.ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.Data.TaxType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.Data.Status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.User.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const tableColumns = [
    { id: 'txId', label: 'Transaction ID' },
    { id: 'date', label: 'Date & Time' },
    { id: 'user', label: 'Modified By' },
    { id: 'machine', label: 'Device' },
    { id: 'amount', label: 'Amount' },
    { id: 'status', label: 'Status' },
    { id: 'type', label: 'Type' },
    { id: 'actions', label: 'Actions' },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading assessment history: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Taxpayer Assessment History</Typography>
        <Typography variant="body1" color="text.secondary">
          Audit trail for assessment ID: {assessmentId}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search history..."
            InputProps={{
              startAdornment: <SearchIcon />,
              sx: { width: 400 },
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Chip label={`${history.length} records`} color="primary" variant="outlined" />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableCell key={column.id} sx={{ fontWeight: 'bold' }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.map((entry, index) => {
                const prevEntry = history[index + 1]; // Previous in chronological order
                const changes = computeChanges(prevEntry?.Data, entry.Data);
                const { label, color } = getActionDetails(entry.IsDeleted, index);

                return (
                  <TableRow key={entry.TxId}>
                    <TableCell>
                      <Tooltip title={entry.TxId}>
                        <span>{shortenHash(entry.TxId)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{formatDateTime(entry.Timestamp)}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <UserAvatar user={entry.User} />
                        <Box>
                          <Typography variant="body2">{entry.User?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{entry.User?.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{entry.MachineInfo?.os}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {entry.MachineInfo?.browser}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {entry.Data.Currency} {entry.Data.Amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={entry.Data.Status}
                        color={
                          entry.Data.Status === 'Pending'
                            ? 'warning'
                            : entry.Data.Status === 'Paid'
                            ? 'success'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{entry.Data.TaxType}</TableCell>
                    <TableCell>
                      <Tooltip title="View audit details">
                        <IconButton
                          onClick={() => {
                            setSelectedEntry({ ...entry, Changes: changes });
                            setDialogOpen(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {selectedEntry && (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5">Full Audit Details</Typography>
                <Typography variant="body2" color="textSecondary">
                  Transaction ID: {shortenHash(selectedEntry.TxId)}
                </Typography>
              </Box>
              <PDFDownloadLink
                document={
                  <GovernmentDocumentPDF
                    history={history}
                    assessmentId={assessmentId}
                    selectedEntry={selectedEntry}
                  />
                }
                fileName={`audit-trail-${assessmentId}-${selectedEntry.TxId.slice(0, 8)}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PdfIcon />}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Export PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </Box>
          </DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    User Information
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <UserAvatar user={selectedEntry.User} />
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedEntry.User?.name}
                      </Typography>
                      <Typography variant="body2">{selectedEntry.User?.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{selectedEntry.User?.username}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Device Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>IP Address:</strong> {selectedEntry.IPAddress}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Operating System:</strong> {selectedEntry.MachineInfo?.os}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Browser:</strong> {selectedEntry.MachineInfo?.browser}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {selectedEntry.Location || 'Not specified'}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Blockchain Verification
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Typography variant="body2">
                        <strong>Transaction Hash:</strong> {shortenHash(selectedEntry.TxId)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Block Number:</strong>{' '}
                        {selectedEntry.BlockchainProof?.blockNumber || 'N/A'}
                      </Typography>
                    </Box>
                    <QRCode
                      value={selectedEntry.BlockchainProof?.txUrl || selectedEntry.TxId}
                      size={100}
                      level="H"
                    />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Change Details
                  </Typography>
                  {selectedEntry.Changes?.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Field</TableCell>
                            <TableCell>Previous Value</TableCell>
                            <TableCell></TableCell>
                            <TableCell>New Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedEntry.Changes.map((change, index) => (
                            <TableRow key={index}>
                              <TableCell>{change.field}</TableCell>
                              <TableCell sx={{ color: 'error.main' }}>
                                {String(change.oldValue)}
                              </TableCell>
                              <TableCell>
                                <ArrowRightIcon />
                              </TableCell>
                              <TableCell sx={{ color: 'success.main' }}>
                                {String(change.newValue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2">No changes detected (initial creation)</Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() =>
                window.open(
                  selectedEntry.BlockchainProof?.txUrl ||
                    `https://blockexplorer.com/tx/${selectedEntry.TxId}`,
                )
              }
              startIcon={<OpenInNewIcon />}
            >
              View on Blockchain Explorer
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default TaxAssessmentHistoryViewer;
