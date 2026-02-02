import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  Stack,
  useTheme,
  alpha,
  Chip,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Gavel,
  Upload,
  Close,
  Add,
  Visibility,
  CheckCircle,
  Schedule,
  Cancel,
} from '@mui/icons-material';
import { formatDate } from 'src/utils/verification/formatters';

const DisputeAppealModule = () => {
  const theme = useTheme();
  const [disputes, setDisputes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    assessmentId: '',
    reason: '',
    description: '',
    documents: [],
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setUploading(true);
    
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newDocuments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }));
    
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments],
    }));
    setUploading(false);
  };

  const handleSubmitDispute = async () => {
    if (!formData.assessmentId || !formData.reason || !formData.description) {
      return;
    }

    const newDispute = {
      id: `DISPUTE-${Date.now()}`,
      assessmentId: formData.assessmentId,
      reason: formData.reason,
      description: formData.description,
      documents: formData.documents,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      blockchainTxId: `tx_${Date.now()}`,
    };

    setDisputes([newDispute, ...disputes]);
    setOpenDialog(false);
    setFormData({
      assessmentId: '',
      reason: '',
      description: '',
      documents: [],
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: { color: 'warning', icon: <Schedule />, label: 'Pending Review' },
      UNDER_REVIEW: { color: 'info', icon: <Schedule />, label: 'Under Review' },
      RESOLVED: { color: 'success', icon: <CheckCircle />, label: 'Resolved' },
      REJECTED: { color: 'error', icon: <Cancel />, label: 'Rejected' },
    };
    return configs[status] || configs.PENDING;
  };

  return (
    <>
      <Card sx={{ boxShadow: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Dispute & Appeal Module
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Raise disputes, track status, and view blockchain audit trail
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
                sx={{ fontWeight: 600 }}
              >
                Raise Dispute
              </Button>
            </Box>

            {/* Disputes Table */}
            {disputes.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Dispute ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Assessment ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Blockchain</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {disputes.map((dispute) => {
                      const statusConfig = getStatusConfig(dispute.status);
                      return (
                        <TableRow key={dispute.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {dispute.id}
                            </Typography>
                          </TableCell>
                          <TableCell>{dispute.assessmentId}</TableCell>
                          <TableCell>{dispute.reason}</TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig.label}
                              color={statusConfig.color}
                              size="small"
                              icon={statusConfig.icon}
                            />
                          </TableCell>
                          <TableCell>{formatDate(dispute.submittedAt)}</TableCell>
                          <TableCell>
                            <Chip
                              label="Verified"
                              color="success"
                              size="small"
                              icon={<CheckCircle />}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => {
                                // TODO: View dispute details
                                console.log('View dispute:', dispute);
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No disputes found. Click "Raise Dispute" to submit a new dispute.
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Raise Dispute Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Gavel color="primary" />
              <Typography variant="h6" component="span" fontWeight={700}>
                Raise a Dispute
              </Typography>
            </Stack>
            <IconButton onClick={() => setOpenDialog(false)} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Assessment ID"
              value={formData.assessmentId}
              onChange={(e) => setFormData((prev) => ({ ...prev, assessmentId: e.target.value }))}
              placeholder="ASSESS-2025-..."
              fullWidth
              required
            />
            <TextField
              label="Reason for Dispute"
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g., Incorrect amount, Wrong tax type, etc."
              fullWidth
              required
            />
            <TextField
              label="Detailed Description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed information about your dispute..."
              multiline
              rows={4}
              fullWidth
              required
            />
            
            {/* Document Upload */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Supporting Documents
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
                disabled={uploading}
                sx={{ mb: 2 }}
              >
                {uploading ? 'Uploading...' : 'Upload Documents'}
                <input
                  type="file"
                  hidden
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
              </Button>
              {uploading && <LinearProgress sx={{ mb: 2 }} />}
              
              {formData.documents.length > 0 && (
                <Stack spacing={1}>
                  {formData.documents.map((doc) => (
                    <Box
                      key={doc.id}
                      sx={{
                        p: 1.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2">{doc.name}</Typography>
                      <Chip label={`${(doc.size / 1024).toFixed(1)} KB`} size="small" />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            <Alert severity="info">
              All disputes are logged on the blockchain for transparency and audit purposes.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitDispute}
            disabled={!formData.assessmentId || !formData.reason || !formData.description}
            startIcon={<Gavel />}
          >
            Submit Dispute
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DisputeAppealModule;

