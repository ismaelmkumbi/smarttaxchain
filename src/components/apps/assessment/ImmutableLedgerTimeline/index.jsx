import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Assessment,
  Payment,
  Warning,
  TrendingUp,
  CheckCircle,
  Block,
  ContentCopy,
} from '@mui/icons-material';

const ImmutableLedgerTimeline = ({ ledgerEntries = [] }) => {
  const theme = useTheme();

  // Default mock entries if none provided
  const defaultEntries = [
    {
      id: 'tx-001',
      type: 'ASSESSMENT_CREATED',
      timestamp: new Date().toISOString(),
      description: 'Tax assessment created',
      amount: 1500000,
      status: 'CONFIRMED',
      blockNumber: 12345,
      txHash: '0x5d90aa1234567890abcdef1234567890bc32',
      changes: null,
    },
    {
      id: 'tx-002',
      type: 'INTEREST_APPLIED',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      description: 'Interest applied for late payment',
      amount: 22500,
      status: 'CONFIRMED',
      blockNumber: 12350,
      txHash: '0x5d90aa9876543210fedcba9876543210bc33',
      changes: { interestRate: '1.5%', daysOverdue: 15 },
    },
    {
      id: 'tx-003',
      type: 'PENALTY_APPLIED',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      description: 'Penalty applied for non-compliance',
      amount: 75000,
      status: 'CONFIRMED',
      blockNumber: 12355,
      txHash: '0x5d90aaabcdef1234567890abcdef1234bc34',
      changes: { penaltyRate: '5%', reason: 'Late Payment' },
    },
  ];

  const entries = ledgerEntries.length > 0 ? ledgerEntries : defaultEntries;

  const getEventIcon = (type) => {
    // Normalize type to uppercase for case-insensitive matching
    const normalizedType = (type || '').toUpperCase();
    
    switch (normalizedType) {
      case 'ASSESSMENT_CREATED':
      case 'ASSESSMENT_CREATE':
        return <Assessment />;
      case 'INTEREST_APPLIED':
      case 'INTEREST_CALCULATED':
        return <TrendingUp />;
      case 'PENALTY_APPLIED':
      case 'PENALTY_APPLY':
        return <Warning />;
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT':
        return <Payment />;
      case 'STATUS_CHANGED':
        return <CheckCircle />;
      default:
        return <Block />;
    }
  };

  const getEventColor = (type) => {
    // Normalize type to uppercase for case-insensitive matching
    const normalizedType = (type || '').toUpperCase();
    
    switch (normalizedType) {
      case 'ASSESSMENT_CREATED':
      case 'ASSESSMENT_CREATE':
        return 'primary';
      case 'INTEREST_APPLIED':
      case 'INTEREST_CALCULATED':
        return 'warning';
      case 'PENALTY_APPLIED':
      case 'PENALTY_APPLY':
        return 'error';
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT':
        return 'success';
      case 'STATUS_CHANGED':
        return 'info';
      default:
        // Return a safe default color that exists in theme.palette
        return 'primary';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Immutable Ledger Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete transaction history recorded on blockchain
          </Typography>
        </Box>
        <Chip
          icon={<Block />}
          label="Blockchain Verified"
          color="success"
          variant="outlined"
        />
      </Stack>

      <Timeline>
        {entries.map((entry, index) => {
          const isLast = index === entries.length - 1;
          const color = getEventColor(entry.type);
          const icon = getEventIcon(entry.type);
          
          // Safely get color from theme palette with fallback
          const getColorValue = (colorName) => {
            try {
              // Ensure color exists in palette
              if (theme.palette[colorName] && theme.palette[colorName].main) {
                return theme.palette[colorName].main;
              }
              // Fallback to primary if color doesn't exist
              return theme.palette.primary.main;
            } catch (error) {
              console.warn(`Color "${colorName}" not found in theme.palette, using primary:`, error);
              return theme.palette.primary.main;
            }
          };
          
          const colorValue = getColorValue(color);

          return (
            <TimelineItem key={entry.id || `entry-${index}`}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0', flex: 0.3 }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                {formatTimestamp(entry.timestamp)}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector
                  sx={{
                    bgcolor: isLast ? 'transparent' : colorValue,
                    opacity: 0.3,
                  }}
                />
                <TimelineDot
                  color={color}
                  sx={{
                    bgcolor: colorValue,
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {icon}
                </TimelineDot>
                {!isLast && (
                  <TimelineConnector
                    sx={{
                      bgcolor: colorValue,
                      opacity: 0.3,
                    }}
                  />
                )}
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette[color].main, 0.05),
                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {entry.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Transaction Type: {entry.type.replace(/_/g, ' ')}
                        </Typography>
                      </Box>
                      <Chip
                        label={entry.status}
                        color={entry.status === 'CONFIRMED' ? 'success' : 'default'}
                        size="small"
                      />
                    </Stack>

                    {entry.amount && (
                      <Box>
                        <Typography variant="h6" fontWeight={700} color={color + '.main'}>
                          {formatCurrency(entry.amount)}
                        </Typography>
                      </Box>
                    )}

                    {entry.changes && (
                      <Box
                        sx={{
                          mt: 1,
                          p: 1.5,
                          bgcolor: alpha(theme.palette[color].main, 0.1),
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" fontWeight={600} gutterBottom>
                          Details:
                        </Typography>
                        {Object.entries(entry.changes).map(([key, value]) => (
                          <Typography key={key} variant="body2">
                            {key}: <strong>{value}</strong>
                          </Typography>
                        ))}
                      </Box>
                    )}

                    <Divider sx={{ my: 1 }} />

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Block #{entry.blockNumber}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'monospace',
                              color: 'text.secondary',
                              wordBreak: 'break-all',
                            }}
                          >
                            {entry.txHash}
                          </Typography>
                          <Tooltip title="Copy Transaction Hash">
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(entry.txHash)}
                              sx={{ p: 0.5 }}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>

      <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> All transactions are permanently recorded on the blockchain
          ledger. This timeline provides an immutable audit trail of all assessment activities.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ImmutableLedgerTimeline;

