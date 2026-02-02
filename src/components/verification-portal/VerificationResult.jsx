import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Grid,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download,
  ReportProblem,
  Verified,
  ExpandMore,
  ContentCopy,
  CheckCircle,
  Schedule,
  Warning,
  Info,
} from '@mui/icons-material';
import {
  formatCurrency,
  formatDate,
  formatStatus,
  getStatusColor,
  formatOfficerId,
  shortenHash,
} from 'src/utils/verification/formatters';
import AssessmentTimeline from './AssessmentTimeline';
import PaymentHistory from './PaymentHistory';
import BlockchainProof from './BlockchainProof';

const VerificationResult = ({ assessmentData, onReportIssue }) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    try {
      // TODO: Implement PDF download
      console.log('Downloading PDF...');
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  if (!assessmentData) {
    return (
      <Alert severity="info">
        No assessment data available. Please verify your assessment first.
      </Alert>
    );
  }

  const assessment = assessmentData.assessment || {};
  const statusColor = getStatusColor(assessment.status);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Assessment Verification Result
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete details and audit trail for your assessment
          </Typography>
        </Box>

        {/* Assessment Summary Card */}
        <Card
          sx={{
            boxShadow: 3,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              {/* Status and Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Chip
                    label={formatStatus(assessment.status)}
                    color={statusColor}
                    sx={{ mb: 1, fontWeight: 600 }}
                  />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Assessment ID: {assessment.id || assessment.ID}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {formatDate(assessment.createdAt || assessment.CreatedAt)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={handleDownloadPDF}
                    sx={{ fontWeight: 600 }}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ReportProblem />}
                    onClick={onReportIssue}
                    color="warning"
                  >
                    Report Issue
                  </Button>
                </Stack>
              </Box>

              <Divider />

              {/* Key Information Grid */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Assessed Amount
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="primary">
                      {formatCurrency(assessment.amount || assessment.Amount)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Total Due
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="error">
                      {formatCurrency(assessment.totalDue || assessment.TotalDue)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Interest
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {formatCurrency(assessment.interest || assessment.Interest || 0)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Penalties
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="warning.main">
                      {formatCurrency(assessment.penalties || assessment.Penalties || 0)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Due Date
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatDate(assessment.dueDate || assessment.DueDate)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Tax Period
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {assessment.period || assessment.Period || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Tax Type
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {assessment.taxType || assessment.TaxType || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Created By
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatOfficerId(
                        assessment.createdBy || assessment.CreatedBy,
                        assessment.createdByRole
                      )}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Blockchain Verification Badge */}
              {assessment.blockchainTxId && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Verified color="success" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Blockchain Verified
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        TX: {shortenHash(assessment.blockchainTxId)}
                      </Typography>
                    </Box>
                    <Tooltip title={copied ? 'Copied!' : 'Copy hash'}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(assessment.blockchainTxId)}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={2}>
            {['summary', 'timeline', 'payments', 'blockchain'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? 'contained' : 'text'}
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: activeTab === tab ? 600 : 400,
                }}
              >
                {tab}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Assessment Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {assessment.description || assessment.Description || 'No description available.'}
              </Typography>
              {/* Additional summary details can be added here */}
            </CardContent>
          </Card>
        )}

        {activeTab === 'timeline' && (
          <AssessmentTimeline auditTrail={assessmentData.auditTrail || []} />
        )}

        {activeTab === 'payments' && (
          <PaymentHistory payments={assessmentData.payments || []} />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainProof blockchainData={assessmentData.blockchain || {}} />
        )}
      </Stack>
    </Box>
  );
};

export default VerificationResult;

