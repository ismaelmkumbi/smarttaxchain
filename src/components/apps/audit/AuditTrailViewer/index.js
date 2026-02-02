import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
  alpha,
  Avatar,
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
  Stack,
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
  ArrowBack,
  Person,
  CheckCircle,
  Cancel,
  Warning,
  Timeline as TimelineIcon,
  ExpandMore,
  Visibility,
  Edit,
  Add,
  Info,
} from '@mui/icons-material';
import { Fade } from '@mui/material';
import auditService from 'src/services/auditService';
import { formatCurrency, isAmountField } from 'src/utils/formatters';

const AuditTrailViewer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { entityType, entityId } = useParams();
  const [trail, setTrail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (entityType && entityId) {
      loadTrail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entityId]);

  const loadTrail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditService.getAuditTrail(entityType, entityId);
      setTrail(data || []);
    } catch (err) {
      console.error('Error loading audit trail:', err);
      setError(err.message || 'Failed to load audit trail');
      setTrail([]);
    } finally {
      setLoading(false);
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
        second: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getActionColor = (action) => {
    const colorMap = {
      CREATE: theme.palette.success.main,
      UPDATE: theme.palette.info.main,
      DELETE: theme.palette.error.main,
      VIEW: theme.palette.grey[600],
      APPROVE: theme.palette.success.main,
      REJECT: theme.palette.error.main,
    };
    return colorMap[action] || theme.palette.primary.main;
  };

  const getActionIcon = (action) => {
    const iconMap = {
      CREATE: <CheckCircle />,
      UPDATE: <TimelineIcon />,
      DELETE: <Cancel />,
      VIEW: <Visibility />,
      APPROVE: <CheckCircle />,
      REJECT: <Cancel />,
    };
    return iconMap[action] || <Warning />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Loading audit trail...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/apps/audit/logs')}
          sx={{ mt: 2 }}
        >
          Back to Audit Logs
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/apps/audit/logs')}
            sx={{
              mb: 2,
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              fontWeight: 600,
              '&:hover': {
                borderColor: theme.palette.secondary.dark,
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
              },
            }}
          >
            Back to Audit Logs
          </Button>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Audit Trail
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete history for {entityType}: {entityId}
          </Typography>
        </Box>
        <Chip
          label={`${trail.length} Events`}
          color="primary"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.secondary.main,
            fontWeight: 700,
          }}
        />
      </Box>

      {/* Trail Timeline */}
      <Fade in={true} timeout={600}>
        <Card
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {trail.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <TimelineIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No audit trail found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No history available for this entity
                </Typography>
              </Box>
            ) : (
              <Timeline position="right">
                {trail.map((entry, index) => {
                  const actionColor = getActionColor(entry.action);
                  const isLast = index === trail.length - 1;

                  return (
                    <TimelineItem key={entry.id}>
                      <TimelineOppositeContent sx={{ flex: 0.3, pr: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(entry.timestamp)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {entry.executionTime}ms
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            bgcolor: actionColor,
                            color: 'white',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {getActionIcon(entry.action)}
                        </TimelineDot>
                        {!isLast && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ pl: 4 }}>
                        <Card
                          sx={{
                            bgcolor: alpha(actionColor, 0.05),
                            border: `1px solid ${alpha(actionColor, 0.2)}`,
                            borderRadius: 2,
                            mb: 2,
                          }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 2,
                              }}
                            >
                              <Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                  {entry.action}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {entry.details?.description || `${entry.action} operation`}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip
                                  label={entry.status}
                                  size="small"
                                  sx={{
                                    bgcolor:
                                      entry.status === 'SUCCESS'
                                        ? theme.palette.success.main
                                        : theme.palette.error.main,
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                                <Chip
                                  label={entry.riskLevel}
                                  size="small"
                                  sx={{
                                    bgcolor:
                                      entry.riskLevel === 'HIGH' || entry.riskLevel === 'CRITICAL'
                                        ? theme.palette.error.main
                                        : entry.riskLevel === 'MEDIUM'
                                        ? theme.palette.warning.main
                                        : theme.palette.success.main,
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                                {entry.details?.compliance_flags &&
                                  entry.details.compliance_flags.length > 0 && (
                                    <Chip
                                      label={`${entry.details.compliance_flags.length} Flag(s)`}
                                      size="small"
                                      color="info"
                                      sx={{ fontWeight: 600 }}
                                    />
                                  )}
                                {entry.details?.requires_review && (
                                  <Chip
                                    label="Review Required"
                                    size="small"
                                    color="warning"
                                    sx={{ fontWeight: 600 }}
                                  />
                                )}
                              </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      bgcolor: theme.palette.primary.main,
                                    }}
                                  >
                                    <Person fontSize="small" />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      User
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                      {entry.user?.name || entry.details?.user_name || 'System'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {entry.user?.role || entry.details?.user_role || 'N/A'} •{' '}
                                      {entry.user?.msp || 'N/A'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">
                                  IP Address
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {entry.ipAddress || entry.details?.ipAddress || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {entry.location?.city || entry.details?.location?.city || ''},{' '}
                                  {entry.location?.region || entry.details?.location?.region || ''}
                                </Typography>
                              </Grid>
                            </Grid>

                            {/* Compliance Flags Section */}
                            {entry.details?.compliance_flags &&
                              entry.details.compliance_flags.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Compliance Flags
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {entry.details.compliance_flags.map((flag, idx) => (
                                      <Chip
                                        key={idx}
                                        label={flag}
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}

                            {/* Changes Section - Only show for UPDATE, CREATE, DELETE actions */}
                            {entry.action !== 'READ' &&
                              entry.details?.changes &&
                              Array.isArray(entry.details.changes) &&
                              entry.details.changes.length > 0 && (
                                <Accordion
                                  sx={{ mt: 2, boxShadow: 'none', bgcolor: 'transparent' }}
                                >
                                  <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                      Changes Made (
                                      {
                                        entry.details.changes.filter(
                                          (c) => c.action === 'MODIFIED' || c.action === 'ADDED',
                                        ).length
                                      }
                                      )
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Stack spacing={2}>
                                      {/* Show MODIFIED and ADDED changes prominently */}
                                      {entry.details.changes.filter(
                                        (c) => c.action === 'MODIFIED' || c.action === 'ADDED',
                                      ).length > 0 && (
                                        <Box
                                          sx={{
                                            border: `1px solid ${alpha(
                                              theme.palette.divider,
                                              0.2,
                                            )}`,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            bgcolor: 'background.paper',
                                          }}
                                        >
                                          {entry.details.changes
                                            .filter(
                                              (c) =>
                                                c.action === 'MODIFIED' || c.action === 'ADDED',
                                            )
                                            .map((change, idx) => {
                                              const formatValue = (value, fieldName) => {
                                                if (value === null || value === undefined) {
                                                  return '(empty)';
                                                }

                                                // Format as currency if it's an amount field
                                                if (isAmountField(fieldName, value)) {
                                                  return formatCurrency(value);
                                                }

                                                if (typeof value === 'object') {
                                                  const str = JSON.stringify(value, null, 2);
                                                  return str.length > 500
                                                    ? str.substring(0, 500) + '...'
                                                    : str;
                                                }
                                                return String(value);
                                              };

                                              const oldValue = formatValue(
                                                change.oldValue,
                                                change.field,
                                              );
                                              const newValue = formatValue(
                                                change.newValue,
                                                change.field,
                                              );
                                              const isModified = change.action === 'MODIFIED';

                                              return (
                                                <Box
                                                  key={idx}
                                                  sx={{
                                                    borderBottom:
                                                      idx <
                                                      entry.details.changes.filter(
                                                        (c) =>
                                                          c.action === 'MODIFIED' ||
                                                          c.action === 'ADDED',
                                                      ).length -
                                                        1
                                                        ? `1px solid ${alpha(
                                                            theme.palette.divider,
                                                            0.1,
                                                          )}`
                                                        : 'none',
                                                    '&:hover': {
                                                      bgcolor: alpha(
                                                        theme.palette.primary.main,
                                                        0.02,
                                                      ),
                                                    },
                                                  }}
                                                >
                                                  <Box sx={{ p: 2.5 }}>
                                                    {/* Field Header */}
                                                    <Box
                                                      sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.5,
                                                        mb: 2,
                                                      }}
                                                    >
                                                      <Box
                                                        sx={{
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                          justifyContent: 'center',
                                                          width: 32,
                                                          height: 32,
                                                          borderRadius: 1,
                                                          bgcolor: isModified
                                                            ? alpha(theme.palette.warning.main, 0.1)
                                                            : alpha(
                                                                theme.palette.success.main,
                                                                0.1,
                                                              ),
                                                          color: isModified
                                                            ? theme.palette.warning.main
                                                            : theme.palette.success.main,
                                                        }}
                                                      >
                                                        {isModified ? (
                                                          <Edit sx={{ fontSize: 18 }} />
                                                        ) : (
                                                          <Add sx={{ fontSize: 18 }} />
                                                        )}
                                                      </Box>
                                                      <Box sx={{ flex: 1 }}>
                                                        <Typography
                                                          variant="subtitle2"
                                                          fontWeight={700}
                                                          sx={{ lineHeight: 1.2 }}
                                                        >
                                                          {change.field}
                                                        </Typography>
                                                        <Typography
                                                          variant="caption"
                                                          color="text.secondary"
                                                          sx={{ mt: 0.25, display: 'block' }}
                                                        >
                                                          {isModified
                                                            ? 'Field value was modified'
                                                            : 'New field was added'}
                                                        </Typography>
                                                      </Box>
                                                      <Chip
                                                        label={change.action}
                                                        size="small"
                                                        sx={{
                                                          bgcolor: isModified
                                                            ? alpha(theme.palette.warning.main, 0.1)
                                                            : alpha(
                                                                theme.palette.success.main,
                                                                0.1,
                                                              ),
                                                          color: isModified
                                                            ? theme.palette.warning.dark
                                                            : theme.palette.success.dark,
                                                          fontWeight: 600,
                                                          border: `1px solid ${
                                                            isModified
                                                              ? alpha(
                                                                  theme.palette.warning.main,
                                                                  0.3,
                                                                )
                                                              : alpha(
                                                                  theme.palette.success.main,
                                                                  0.3,
                                                                )
                                                          }`,
                                                        }}
                                                      />
                                                    </Box>

                                                    {/* Diff View */}
                                                    {isModified ? (
                                                      <Grid container spacing={0}>
                                                        {/* Old Value */}
                                                        <Grid item xs={12} md={5.5}>
                                                          <Box
                                                            sx={{
                                                              position: 'relative',
                                                              p: 2,
                                                              bgcolor: alpha(
                                                                theme.palette.error.main,
                                                                0.03,
                                                              ),
                                                              borderRight: `2px solid ${alpha(
                                                                theme.palette.error.main,
                                                                0.2,
                                                              )}`,
                                                              minHeight: 80,
                                                            }}
                                                          >
                                                            <Box
                                                              sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                height: 3,
                                                                bgcolor: theme.palette.error.main,
                                                              }}
                                                            />
                                                            <Typography
                                                              variant="caption"
                                                              sx={{
                                                                display: 'block',
                                                                mb: 1,
                                                                fontWeight: 600,
                                                                color: 'error.main',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: 0.5,
                                                                fontSize: '0.65rem',
                                                              }}
                                                            >
                                                              Before
                                                            </Typography>
                                                            <Typography
                                                              variant="body2"
                                                              sx={{
                                                                fontFamily:
                                                                  change.oldValue &&
                                                                  typeof change.oldValue ===
                                                                    'object'
                                                                    ? 'monospace'
                                                                    : 'inherit',
                                                                fontSize:
                                                                  change.oldValue &&
                                                                  typeof change.oldValue ===
                                                                    'object'
                                                                    ? '0.75rem'
                                                                    : '0.875rem',
                                                                color: 'text.primary',
                                                                wordBreak: 'break-word',
                                                                whiteSpace: 'pre-wrap',
                                                                lineHeight: 1.6,
                                                              }}
                                                            >
                                                              {oldValue}
                                                            </Typography>
                                                          </Box>
                                                        </Grid>

                                                        {/* Divider */}
                                                        <Grid
                                                          item
                                                          xs={12}
                                                          md={1}
                                                          sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            bgcolor: alpha(
                                                              theme.palette.divider,
                                                              0.05,
                                                            ),
                                                          }}
                                                        >
                                                          <Box
                                                            sx={{
                                                              display: { xs: 'none', md: 'flex' },
                                                              alignItems: 'center',
                                                              justifyContent: 'center',
                                                              width: 32,
                                                              height: 32,
                                                              borderRadius: '50%',
                                                              bgcolor: theme.palette.primary.main,
                                                              color: 'white',
                                                              boxShadow: `0 2px 8px ${alpha(
                                                                theme.palette.primary.main,
                                                                0.3,
                                                              )}`,
                                                            }}
                                                          >
                                                            <Typography
                                                              variant="body1"
                                                              sx={{
                                                                fontWeight: 700,
                                                                fontSize: '1rem',
                                                              }}
                                                            >
                                                              →
                                                            </Typography>
                                                          </Box>
                                                        </Grid>

                                                        {/* New Value */}
                                                        <Grid item xs={12} md={5.5}>
                                                          <Box
                                                            sx={{
                                                              position: 'relative',
                                                              p: 2,
                                                              bgcolor: alpha(
                                                                theme.palette.success.main,
                                                                0.03,
                                                              ),
                                                              borderLeft: `2px solid ${alpha(
                                                                theme.palette.success.main,
                                                                0.2,
                                                              )}`,
                                                              minHeight: 80,
                                                            }}
                                                          >
                                                            <Box
                                                              sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                height: 3,
                                                                bgcolor: theme.palette.success.main,
                                                              }}
                                                            />
                                                            <Typography
                                                              variant="caption"
                                                              sx={{
                                                                display: 'block',
                                                                mb: 1,
                                                                fontWeight: 600,
                                                                color: 'success.main',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: 0.5,
                                                                fontSize: '0.65rem',
                                                              }}
                                                            >
                                                              After
                                                            </Typography>
                                                            <Typography
                                                              variant="body2"
                                                              sx={{
                                                                fontFamily:
                                                                  change.newValue &&
                                                                  typeof change.newValue ===
                                                                    'object'
                                                                    ? 'monospace'
                                                                    : 'inherit',
                                                                fontSize:
                                                                  change.newValue &&
                                                                  typeof change.newValue ===
                                                                    'object'
                                                                    ? '0.75rem'
                                                                    : '0.875rem',
                                                                color: 'text.primary',
                                                                fontWeight: 500,
                                                                wordBreak: 'break-word',
                                                                whiteSpace: 'pre-wrap',
                                                                lineHeight: 1.6,
                                                              }}
                                                            >
                                                              {newValue}
                                                            </Typography>
                                                          </Box>
                                                        </Grid>
                                                      </Grid>
                                                    ) : (
                                                      <Box
                                                        sx={{
                                                          p: 2,
                                                          bgcolor: alpha(
                                                            theme.palette.success.main,
                                                            0.05,
                                                          ),
                                                          borderRadius: 1,
                                                          border: `1px solid ${alpha(
                                                            theme.palette.success.main,
                                                            0.2,
                                                          )}`,
                                                          borderLeft: `4px solid ${theme.palette.success.main}`,
                                                        }}
                                                      >
                                                        <Typography
                                                          variant="caption"
                                                          sx={{
                                                            display: 'block',
                                                            mb: 1,
                                                            fontWeight: 600,
                                                            color: 'success.main',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: 0.5,
                                                            fontSize: '0.65rem',
                                                          }}
                                                        >
                                                          Added Value
                                                        </Typography>
                                                        <Typography
                                                          variant="body2"
                                                          sx={{
                                                            fontFamily:
                                                              change.newValue &&
                                                              typeof change.newValue === 'object'
                                                                ? 'monospace'
                                                                : 'inherit',
                                                            fontSize:
                                                              change.newValue &&
                                                              typeof change.newValue === 'object'
                                                                ? '0.75rem'
                                                                : '0.875rem',
                                                            color: 'text.primary',
                                                            fontWeight: 500,
                                                            wordBreak: 'break-word',
                                                            whiteSpace: 'pre-wrap',
                                                            lineHeight: 1.6,
                                                          }}
                                                        >
                                                          {newValue}
                                                        </Typography>
                                                      </Box>
                                                    )}
                                                  </Box>
                                                </Box>
                                              );
                                            })}
                                        </Box>
                                      )}

                                      {/* Show REMOVED fields in collapsed accordion */}
                                      {entry.details.changes.filter((c) => c.action === 'REMOVED')
                                        .length > 0 && (
                                        <>
                                          <Alert severity="info" icon={<Info />}>
                                            <Typography variant="caption">
                                              {
                                                entry.details.changes.filter(
                                                  (c) => c.action === 'REMOVED',
                                                ).length
                                              }{' '}
                                              field(s) marked as &quot;REMOVED&quot; are not part of
                                              the update payload. These fields were present in the
                                              previous state but not included in the current update.
                                            </Typography>
                                          </Alert>
                                          <Accordion
                                            sx={{ boxShadow: 'none', bgcolor: 'transparent' }}
                                          >
                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                              <Typography variant="caption" color="text.secondary">
                                                View Removed Fields (
                                                {
                                                  entry.details.changes.filter(
                                                    (c) => c.action === 'REMOVED',
                                                  ).length
                                                }
                                                )
                                              </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                              <TableContainer component={Paper} variant="outlined">
                                                <Table size="small">
                                                  <TableHead>
                                                    <TableRow>
                                                      <TableCell sx={{ fontWeight: 600 }}>
                                                        Field
                                                      </TableCell>
                                                      <TableCell sx={{ fontWeight: 600 }}>
                                                        Previous Value
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {entry.details.changes
                                                      .filter((c) => c.action === 'REMOVED')
                                                      .slice(0, 20)
                                                      .map((change, idx) => (
                                                        <TableRow key={idx}>
                                                          <TableCell>
                                                            <Typography
                                                              variant="body2"
                                                              sx={{ fontStyle: 'italic' }}
                                                            >
                                                              {change.field}
                                                            </Typography>
                                                          </TableCell>
                                                          <TableCell>
                                                            <Typography
                                                              variant="body2"
                                                              color="text.secondary"
                                                              sx={{
                                                                fontFamily: 'monospace',
                                                                fontSize: '0.75rem',
                                                                wordBreak: 'break-all',
                                                              }}
                                                            >
                                                              {change.oldValue !== null &&
                                                              change.oldValue !== undefined
                                                                ? typeof change.oldValue ===
                                                                  'object'
                                                                  ? JSON.stringify(
                                                                      change.oldValue,
                                                                    ).substring(0, 150) +
                                                                    (JSON.stringify(change.oldValue)
                                                                      .length > 150
                                                                      ? '...'
                                                                      : '')
                                                                  : String(change.oldValue)
                                                                : 'N/A'}
                                                            </Typography>
                                                          </TableCell>
                                                        </TableRow>
                                                      ))}
                                                  </TableBody>
                                                </Table>
                                              </TableContainer>
                                              {entry.details.changes.filter(
                                                (c) => c.action === 'REMOVED',
                                              ).length > 20 && (
                                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                                  <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                  >
                                                    Showing first 20 of{' '}
                                                    {
                                                      entry.details.changes.filter(
                                                        (c) => c.action === 'REMOVED',
                                                      ).length
                                                    }{' '}
                                                    removed fields
                                                  </Typography>
                                                </Box>
                                              )}
                                            </AccordionDetails>
                                          </Accordion>
                                        </>
                                      )}
                                    </Stack>
                                  </AccordionDetails>
                                </Accordion>
                              )}

                            {/* Before/After State Section */}
                            {(entry.details?.before_state || entry.details?.after_state) && (
                              <Accordion sx={{ mt: 2, boxShadow: 'none', bgcolor: 'transparent' }}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                  <Typography variant="subtitle2" fontWeight={600}>
                                    Before/After State
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Grid container spacing={2}>
                                    {entry.details.before_state && (
                                      <Grid item xs={12} md={6}>
                                        <Paper
                                          sx={{
                                            p: 2,
                                            bgcolor: alpha(theme.palette.error.main, 0.05),
                                            border: `1px solid ${alpha(
                                              theme.palette.error.main,
                                              0.2,
                                            )}`,
                                          }}
                                        >
                                          <Typography
                                            variant="subtitle2"
                                            fontWeight={600}
                                            color="error"
                                            gutterBottom
                                          >
                                            Before Update (Complete Record)
                                          </Typography>
                                          <Box sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}>
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                fontFamily: 'monospace',
                                                fontSize: '0.75rem',
                                                whiteSpace: 'pre-wrap',
                                              }}
                                            >
                                              {JSON.stringify(entry.details.before_state, null, 2)}
                                            </Typography>
                                          </Box>
                                        </Paper>
                                      </Grid>
                                    )}
                                    {entry.details.after_state && (
                                      <Grid item xs={12} md={6}>
                                        <Paper
                                          sx={{
                                            p: 2,
                                            bgcolor: alpha(theme.palette.info.main, 0.05),
                                            border: `1px solid ${alpha(
                                              theme.palette.info.main,
                                              0.2,
                                            )}`,
                                          }}
                                        >
                                          <Typography
                                            variant="subtitle2"
                                            fontWeight={600}
                                            color="info.main"
                                            gutterBottom
                                          >
                                            Update Payload (Partial - Only Changed Fields)
                                          </Typography>
                                          <Box sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}>
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                fontFamily: 'monospace',
                                                fontSize: '0.75rem',
                                                whiteSpace: 'pre-wrap',
                                              }}
                                            >
                                              {JSON.stringify(entry.details.after_state, null, 2)}
                                            </Typography>
                                          </Box>
                                        </Paper>
                                      </Grid>
                                    )}
                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            )}

                            <Box
                              sx={{
                                mt: 2,
                                pt: 2,
                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontFamily: 'monospace' }}
                              >
                                TX: {entry.blockchainTxId}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default AuditTrailViewer;
