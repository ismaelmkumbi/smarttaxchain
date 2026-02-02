import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Alert,
  Grid,
} from '@mui/material';
import {
  Verified,
  ExpandMore,
  ContentCopy,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import { shortenHash, formatDate } from 'src/utils/verification/formatters';

const BlockchainProof = ({ blockchainData = {} }) => {
  const theme = useTheme();
  const [copied, setCopied] = useState({});

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  if (!blockchainData || Object.keys(blockchainData).length === 0) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <Warning sx={{ fontSize: 48, color: 'warning.main' }} />
            <Typography variant="body2" color="text.secondary" align="center">
              No blockchain verification data available for this assessment.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const isVerified = blockchainData.verified !== false;
  const transactions = blockchainData.transactions || [];
  const ledgerEvents = blockchainData.ledgerEvents || [];

  return (
    <Card
      sx={{
        boxShadow: 2,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Verification Status */}
          <Box
            sx={{
              p: 3,
              bgcolor: isVerified
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(theme.palette.warning.main, 0.1),
              borderRadius: 2,
              border: `1px solid ${
                isVerified
                  ? alpha(theme.palette.success.main, 0.2)
                  : alpha(theme.palette.warning.main, 0.2)
              }`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              {isVerified ? (
                <Verified sx={{ fontSize: 40, color: 'success.main' }} />
              ) : (
                <Warning sx={{ fontSize: 40, color: 'warning.main' }} />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {isVerified ? 'Blockchain Verified' : 'Verification Pending'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isVerified
                    ? 'This assessment has been cryptographically verified on the blockchain.'
                    : 'This assessment is pending blockchain verification.'}
                </Typography>
              </Box>
              {isVerified && (
                <Chip
                  label="Verified"
                  color="success"
                  icon={<CheckCircle />}
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Stack>
          </Box>

          {/* Main Transaction Hash */}
          {blockchainData.transactionId && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Main Transaction Hash
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
                  }}
                >
                  {blockchainData.transactionId}
                </Typography>
                <Tooltip title={copied.mainTx ? 'Copied!' : 'Copy hash'}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(blockchainData.transactionId, 'mainTx')}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}

          {/* Blockchain Details Grid */}
          <Grid container spacing={2}>
            {blockchainData.channelId && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Channel ID
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {blockchainData.channelId}
                  </Typography>
                </Box>
              </Grid>
            )}
            {blockchainData.chaincodeName && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Chaincode
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {blockchainData.chaincodeName}
                  </Typography>
                </Box>
              </Grid>
            )}
            {blockchainData.contractName && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Contract
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {blockchainData.contractName}
                  </Typography>
                </Box>
              </Grid>
            )}
            {blockchainData.timestamp && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Verified At
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(blockchainData.timestamp)}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Ledger Events */}
          {ledgerEvents.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Ledger Events ({ledgerEvents.length})
              </Typography>
              <Stack spacing={1}>
                {ledgerEvents.map((event, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Chip
                            label={event.eventType || event.event_type || 'Event'}
                            size="small"
                            color="info"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(event.timestamp)}
                          </Typography>
                        </Stack>
                        {event.tx_id && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                              Transaction ID:
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography
                                variant="caption"
                                sx={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.7rem',
                                }}
                              >
                                {shortenHash(event.tx_id, 6)}
                              </Typography>
                              <Tooltip title={copied[`event-${index}`] ? 'Copied!' : 'Copy'}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleCopy(event.tx_id, `event-${index}`)}
                                >
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                        )}
                        {event.reason && (
                          <Typography variant="body2" color="text.secondary">
                            {event.reason}
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}

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

          {/* Help Alert */}
          <Alert severity="info" icon={<Info />}>
            <Typography variant="caption">
              <strong>What is blockchain verification?</strong> This assessment has been recorded
              on an immutable blockchain ledger. The cryptographic hash ensures that the data
              cannot be altered without detection. This provides proof of authenticity and
              prevents tampering.
            </Typography>
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BlockchainProof;

