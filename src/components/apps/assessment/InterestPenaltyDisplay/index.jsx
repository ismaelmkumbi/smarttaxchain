import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  useTheme,
  alpha,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  CalendarToday,
  AccountBalance,
} from '@mui/icons-material';

const InterestPenaltyDisplay = ({ assessment, showBreakdown = true }) => {
  const theme = useTheme();

  const amount = assessment?.Amount || assessment?.amount || 0;
  const penalties = assessment?.Penalties || assessment?.penalties || 0;
  const interest = assessment?.Interest || assessment?.interest || 0;
  const dueDate = assessment?.DueDate || assessment?.dueDate;
  const totalDue = amount + penalties + interest;

  // Calculate days overdue
  const getDaysOverdue = () => {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const now = new Date();
    const diff = now - due;
    return diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
  };

  const daysOverdue = getDaysOverdue();
  const hasInterest = interest > 0;
  const hasPenalties = penalties > 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  return (
    <Grid container spacing={2}>
      {/* Interest Card */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            height: '100%',
            border: hasInterest
              ? `2px solid ${theme.palette.warning.main}`
              : `1px solid ${theme.palette.divider}`,
            bgcolor: hasInterest
              ? alpha(theme.palette.warning.main, 0.05)
              : 'background.paper',
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: hasInterest
                    ? alpha(theme.palette.warning.main, 0.2)
                    : alpha(theme.palette.grey[500], 0.1),
                  color: hasInterest
                    ? theme.palette.warning.dark
                    : theme.palette.text.secondary,
                }}
              >
                <TrendingUp />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Interest
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accrued on overdue amount
                </Typography>
              </Box>
            </Stack>

            <Typography variant="h4" fontWeight={700} color="warning.dark" sx={{ mb: 1 }}>
              {formatCurrency(interest)}
            </Typography>

            {hasInterest && showBreakdown && (
              <Box sx={{ mt: 2 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Days Overdue:
                    </Typography>
                    <Chip label={`${daysOverdue} days`} size="small" color="warning" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Interest Rate:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      1.5% per month
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Base Amount:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(amount)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            {!hasInterest && (
              <Chip
                label="No interest accrued"
                color="default"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Penalties Card */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            height: '100%',
            border: hasPenalties
              ? `2px solid ${theme.palette.error.main}`
              : `1px solid ${theme.palette.divider}`,
            bgcolor: hasPenalties
              ? alpha(theme.palette.error.main, 0.05)
              : 'background.paper',
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: hasPenalties
                    ? alpha(theme.palette.error.main, 0.2)
                    : alpha(theme.palette.grey[500], 0.1),
                  color: hasPenalties
                    ? theme.palette.error.dark
                    : theme.palette.text.secondary,
                }}
              >
                <Warning />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Penalties
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Applied for non-compliance
                </Typography>
              </Box>
            </Stack>

            <Typography variant="h4" fontWeight={700} color="error.dark" sx={{ mb: 1 }}>
              {formatCurrency(penalties)}
            </Typography>

            {hasPenalties && showBreakdown && (
              <Box sx={{ mt: 2 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Penalty Type:
                    </Typography>
                    <Chip label="Late Payment" size="small" color="error" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Penalty Rate:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      5% of amount
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Applied On:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {dueDate
                        ? new Date(dueDate).toLocaleDateString('en-TZ')
                        : 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            {!hasPenalties && (
              <Chip
                label="No penalties applied"
                color="default"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Total Due Summary */}
      {showBreakdown && (
        <Grid item xs={12}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Amount Due
                </Typography>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  {formatCurrency(totalDue)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Base: {formatCurrency(amount)}
                  </Typography>
                  {hasInterest && (
                    <Typography variant="body2" color="warning.dark">
                      + Interest: {formatCurrency(interest)}
                    </Typography>
                  )}
                  {hasPenalties && (
                    <Typography variant="body2" color="error.dark">
                      + Penalties: {formatCurrency(penalties)}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default InterestPenaltyDisplay;

