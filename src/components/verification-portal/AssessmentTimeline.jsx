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
  CheckCircle,
  Edit,
  Delete,
  Payment,
  Warning,
  ExpandMore,
  Info,
  Verified,
  Schedule,
} from '@mui/icons-material';
import { formatDate, formatAction, formatOfficerId } from 'src/utils/verification/formatters';

const AssessmentTimeline = ({ auditTrail = [] }) => {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getActionIcon = (action) => {
    const iconMap = {
      CREATE: <CheckCircle />,
      UPDATE: <Edit />,
      DELETE: <Delete />,
      PAYMENT: <Payment />,
      APPROVE: <Verified />,
      REJECT: <Warning />,
      INTEREST_CALCULATED: <Schedule />,
      PENALTY_APPLIED: <Warning />,
    };
    return iconMap[action] || <Info />;
  };

  const getActionColor = (action) => {
    const colorMap = {
      CREATE: 'success',
      UPDATE: 'primary',
      DELETE: 'error',
      PAYMENT: 'success',
      APPROVE: 'success',
      REJECT: 'error',
      INTEREST_CALCULATED: 'info',
      PENALTY_APPLIED: 'warning',
    };
    const color = colorMap[action] || 'primary';
    
    // Validate color exists in theme palette
    if (theme.palette[color] && theme.palette[color].main) {
      return color;
    }
    // Fallback to primary if color doesn't exist
    return 'primary';
  };

  if (!auditTrail || auditTrail.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No audit trail available for this assessment.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        boxShadow: 2,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Assessment Lifecycle Timeline
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Complete history of your assessment from creation to current status
        </Typography>

        <Timeline position="alternate">
          {auditTrail.map((entry, index) => {
            const actionColor = getActionColor(entry.action);
            const isExpanded = expandedItems[index];
            const isLast = index === auditTrail.length - 1;

            return (
              <TimelineItem key={entry.id || index}>
                <TimelineOppositeContent sx={{ flex: 0.3, px: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(entry.timestamp)}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    color={actionColor}
                    sx={{
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: theme.palette[actionColor]?.main || theme.palette.primary.main,
                      color: theme.palette[actionColor]?.contrastText || theme.palette.primary.contrastText,
                    }}
                  >
                    {getActionIcon(entry.action)}
                  </TimelineDot>
                  {!isLast && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ px: 2, pb: 3 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      bgcolor: alpha(theme.palette[actionColor]?.main || theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette[actionColor]?.main || theme.palette.primary.main, 0.2)}`,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 2,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Chip
                              label={formatAction(entry.action)}
                              color={actionColor}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {entry.description || `${formatAction(entry.action)} operation`}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => toggleExpand(index)}
                            sx={{ ml: 1 }}
                          >
                            <ExpandMore
                              sx={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s',
                              }}
                            />
                          </IconButton>
                        </Box>

                        {/* Officer Info */}
                        {entry.officerId && (
                          <Typography variant="caption" color="text.secondary">
                            By: {formatOfficerId(entry.officerId, entry.officerRole)}
                          </Typography>
                        )}

                        {/* Expanded Details */}
                        {isExpanded && (
                          <Accordion expanded={isExpanded} sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
                            <AccordionDetails sx={{ pt: 2 }}>
                              <Stack spacing={2}>
                                {/* Changes */}
                                {entry.changes && entry.changes.length > 0 && (
                                  <Box>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                      Changes Made:
                                    </Typography>
                                    <Stack spacing={0.5}>
                                      {entry.changes.map((change, idx) => (
                                        <Box
                                          key={idx}
                                          sx={{
                                            p: 1,
                                            bgcolor: alpha(theme.palette.info.main, 0.05),
                                            borderRadius: 1,
                                          }}
                                        >
                                          <Typography variant="caption" fontWeight={600}>
                                            {change.field}:
                                          </Typography>
                                          <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                                            {String(change.oldValue || 'N/A')}
                                          </Typography>
                                          <Typography variant="caption" sx={{ mx: 1 }}>
                                            →
                                          </Typography>
                                          <Typography variant="caption" color="success.main" fontWeight={600}>
                                            {String(change.newValue || 'N/A')}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Stack>
                                  </Box>
                                )}

                                {/* Blockchain Info */}
                                {entry.blockchainTxId && (
                                  <Box>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                      Blockchain Verification:
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Chip
                                        label="Verified"
                                        color="success"
                                        size="small"
                                        icon={<Verified />}
                                      />
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontFamily: 'monospace',
                                          color: 'text.secondary',
                                        }}
                                      >
                                        TX: {entry.blockchainTxId.substring(0, 16)}...
                                      </Typography>
                                    </Stack>
                                  </Box>
                                )}

                                {/* Technical Details */}
                                <Accordion sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
                                  <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="caption" color="text.secondary">
                                      View Technical Details
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Box
                                      sx={{
                                        p: 2,
                                        bgcolor: alpha(theme.palette.grey[500], 0.05),
                                        borderRadius: 1,
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem',
                                      }}
                                    >
                                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                        {JSON.stringify(entry, null, 2)}
                                      </pre>
                                    </Box>
                                  </AccordionDetails>
                                </Accordion>
                              </Stack>
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default AssessmentTimeline;

