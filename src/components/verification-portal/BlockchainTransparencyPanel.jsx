import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Grid,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import {
  Verified,
  ExpandMore,
  ContentCopy,
  Download,
  Lock,
  Info,
  CheckCircle,
} from '@mui/icons-material';
import { shortenHash, formatDate } from 'src/utils/verification/formatters';

const BlockchainTransparencyPanel = ({ blockchainData = {} }) => {
  const theme = useTheme();
  const [copied, setCopied] = useState({});

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleDownloadCertificate = async () => {
    try {
      // TODO: Generate and download PDF certificate
      console.log('Downloading verification certificate...');
      // For now, create a simple text file
      const content = `Tax Assessment Verification Certificate
      
Assessment ID: ${blockchainData.assessmentId || 'N/A'}
Transaction Hash: ${blockchainData.transactionId || 'N/A'}
Block Number: ${blockchainData.blockNumber || 'N/A'}
Timestamp: ${formatDate(blockchainData.timestamp)}
Channel: ${blockchainData.channelId || 'N/A'}
Chaincode: ${blockchainData.chaincodeName || 'N/A'}

This certificate confirms that the above assessment has been verified
on the blockchain and is immutable.

Verification Date: ${new Date().toISOString()}
`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `verification-certificate-${blockchainData.assessmentId || 'unknown'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  if (!blockchainData || Object.keys(blockchainData).length === 0) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            No blockchain data available. Verify an assessment to view blockchain transparency information.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Blockchain Transparency Panel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Immutable record verification and transparency information
                </Typography>
              </Box>
              <Chip
                label="Immutable Record — Cannot Be Altered"
                color="success"
                icon={<Lock />}
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Box>

          {/* Verification Status */}
          <Box
            sx={{
              p: 3,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              borderRadius: 2,
              border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Verified sx={{ fontSize: 40, color: 'success.main' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Blockchain Verified
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This record has been cryptographically verified and stored on an immutable blockchain ledger.
                </Typography>
              </Box>
              <CheckCircle sx={{ fontSize: 32, color: 'success.main' }} />
            </Stack>
          </Box>

          {/* Blockchain Details */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Transaction Hash
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.grey[500], 0.05),
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      fontSize: '0.75rem',
                    }}
                  >
                    {blockchainData.transactionId || 'N/A'}
                  </Typography>
                  <Tooltip title={copied.txId ? 'Copied!' : 'Copy hash'}>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(blockchainData.transactionId, 'txId')}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Block Number
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {blockchainData.blockNumber || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Timestamp
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatDate(blockchainData.timestamp)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Channel ID
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {blockchainData.channelId || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Chaincode Name
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {blockchainData.chaincodeName || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Contract Name
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {blockchainData.contractName || 'N/A'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Endorsing Organizations */}
          {blockchainData.endorsingOrgs && blockchainData.endorsingOrgs.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Endorsing Organizations
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {blockchainData.endorsingOrgs.map((org, index) => (
                  <Chip
                    key={index}
                    label={org}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Download Certificate */}
          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Proof of Verification Certificate
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Download a PDF certificate proving this assessment's blockchain verification
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownloadCertificate}
                sx={{ fontWeight: 600 }}
              >
                Download Certificate
              </Button>
            </Stack>
          </Box>

          {/* Technical Details */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Info fontSize="small" />
                <Typography variant="subtitle2">View Technical Details</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.grey[500], 0.05),
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  maxHeight: 400,
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(blockchainData, null, 2)}
                </pre>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BlockchainTransparencyPanel;

