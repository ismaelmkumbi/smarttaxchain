import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Alert,
  Box,
  Stack,
  useTheme,
  alpha,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  Calculate,
  Close,
} from '@mui/icons-material';
import taxAssessmentService from 'src/services/taxAssessmentService';

const InterestCalculator = ({ open, onClose, assessment, onSuccess }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    interestType: 'daily',
    interestRate: 0.12, // 12% annual
    paymentDate: new Date().toISOString().split('T')[0],
  });

  const handleCalculate = async () => {
    if (!assessment) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const interestData = {
        assessmentId: assessment.ID || assessment.id,
        interestType: formData.interestType,
        interestRate: formData.interestRate,
        dueDate: assessment.DueDate || assessment.dueDate,
        paymentDate: formData.paymentDate
          ? new Date(formData.paymentDate).toISOString()
          : new Date().toISOString(),
        principalAmount: assessment.Amount || assessment.amount || 0,
      };

      const response = await taxAssessmentService.calculateInterest(interestData);
      setResult(response);
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to calculate interest');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TrendingUp color="warning" />
          <Typography variant="h6">Calculate Interest</Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {assessment && (
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Assessment:</strong> {assessment.ID || assessment.id}
              </Typography>
              <Typography variant="body2">
                <strong>Base Amount:</strong> {formatCurrency(assessment.Amount || assessment.amount || 0)}
              </Typography>
              <Typography variant="body2">
                <strong>Due Date:</strong>{' '}
                {assessment.DueDate || assessment.dueDate
                  ? new Date(assessment.DueDate || assessment.dueDate).toLocaleDateString('en-TZ')
                  : 'N/A'}
              </Typography>
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Interest Type"
                fullWidth
                value={formData.interestType}
                onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
              >
                <MenuItem value="daily">Daily Interest</MenuItem>
                <MenuItem value="monthly">Monthly Interest</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="number"
                label="Annual Interest Rate (%)"
                fullWidth
                value={formData.interestRate * 100}
                onChange={(e) =>
                  setFormData({ ...formData, interestRate: Number(e.target.value) / 100 })
                }
                helperText="Enter as percentage (e.g., 12 for 12%)"
                inputProps={{ step: 0.01, min: 0, max: 100 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="date"
                label="Payment Date"
                fullWidth
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText="Date when payment is made (defaults to today)"
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {result && (
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                borderRadius: 1,
                border: `1px solid ${theme.palette.warning.main}`,
              }}
            >
              <Typography variant="h6" gutterBottom color="warning.dark">
                Interest Calculation Result
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Days Overdue:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {result.days_overdue || 0} days
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Interest Amount:</Typography>
                  <Typography variant="h6" fontWeight={700} color="warning.dark">
                    {formatCurrency(result.interest_amount || 0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total Due:</Typography>
                  <Typography variant="h6" fontWeight={700} color="error.main">
                    {formatCurrency(result.total_due || 0)}
                  </Typography>
                </Box>
                {result.ledger_event && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="caption" color="text.secondary">
                      Transaction ID: {result.ledger_event.tx_id}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          {result ? 'Close' : 'Cancel'}
        </Button>
        {!result && (
          <Button
            variant="contained"
            onClick={handleCalculate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Calculate />}
            sx={{
              bgcolor: theme.palette.warning.main,
              '&:hover': { bgcolor: theme.palette.warning.dark },
            }}
          >
            {loading ? 'Calculating...' : 'Calculate Interest'}
          </Button>
        )}
        {result && (
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: theme.palette.secondary.main,
              '&:hover': { bgcolor: theme.palette.secondary.dark },
            }}
          >
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InterestCalculator;

