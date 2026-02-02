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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
} from '@mui/material';
import {
  Warning,
  Calculate,
  Close,
} from '@mui/icons-material';
import taxAssessmentService from 'src/services/taxAssessmentService';

const PenaltyApplicator = ({ open, onClose, assessment, onSuccess }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    penaltyType: 'LATE_PAYMENT',
    calculationMethod: 'rate', // 'rate' or 'amount'
    penaltyRate: 5, // 5%
    penaltyAmount: '',
    reason: '',
  });

  const handleApply = async () => {
    if (!assessment) return;

    // Validation
    if (!formData.reason.trim()) {
      setError('Reason is required');
      return;
    }

    if (formData.calculationMethod === 'rate' && !formData.penaltyRate) {
      setError('Penalty rate is required');
      return;
    }

    if (formData.calculationMethod === 'amount' && !formData.penaltyAmount) {
      setError('Penalty amount is required');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const penaltyData = {
        assessmentId: assessment.ID || assessment.id,
        penaltyType: formData.penaltyType,
        reason: formData.reason,
      };

      if (formData.calculationMethod === 'rate') {
        penaltyData.penaltyRate = formData.penaltyRate;
      } else {
        penaltyData.penaltyAmount = Number(formData.penaltyAmount);
      }

      const response = await taxAssessmentService.applyPenalty(penaltyData);
      setResult(response);
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to apply penalty');
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

  const calculateEstimatedPenalty = () => {
    if (!assessment) return 0;
    const baseAmount = assessment.Amount || assessment.amount || 0;
    if (formData.calculationMethod === 'rate') {
      return (baseAmount * formData.penaltyRate) / 100;
    }
    return Number(formData.penaltyAmount) || 0;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Warning color="error" />
          <Typography variant="h6">Apply Penalty</Typography>
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
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Penalty Type"
                fullWidth
                value={formData.penaltyType}
                onChange={(e) => setFormData({ ...formData, penaltyType: e.target.value })}
                required
              >
                <MenuItem value="LATE_PAYMENT">Late Payment</MenuItem>
                <MenuItem value="UNDER_DECLARATION">Under Declaration</MenuItem>
                <MenuItem value="NON_FILING">Non-Filing</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Calculation Method</FormLabel>
                <RadioGroup
                  row
                  value={formData.calculationMethod}
                  onChange={(e) => setFormData({ ...formData, calculationMethod: e.target.value })}
                >
                  <FormControlLabel value="rate" control={<Radio />} label="Percentage Rate" />
                  <FormControlLabel value="amount" control={<Radio />} label="Fixed Amount" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {formData.calculationMethod === 'rate' ? (
              <Grid item xs={12}>
                <TextField
                  type="number"
                  label="Penalty Rate (%)"
                  fullWidth
                  value={formData.penaltyRate}
                  onChange={(e) => setFormData({ ...formData, penaltyRate: Number(e.target.value) })}
                  helperText={`Estimated penalty: ${formatCurrency(calculateEstimatedPenalty())}`}
                  inputProps={{ step: 0.1, min: 0, max: 100 }}
                  required
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <TextField
                  type="number"
                  label="Penalty Amount"
                  fullWidth
                  value={formData.penaltyAmount}
                  onChange={(e) => setFormData({ ...formData, penaltyAmount: e.target.value })}
                  helperText="Enter fixed penalty amount"
                  inputProps={{ step: 1000, min: 0 }}
                  required
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Reason"
                fullWidth
                multiline
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Enter reason for penalty application..."
                required
                error={!!error && !formData.reason.trim()}
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
                bgcolor: alpha(theme.palette.error.main, 0.1),
                borderRadius: 1,
                border: `1px solid ${theme.palette.error.main}`,
              }}
            >
              <Typography variant="h6" gutterBottom color="error.dark">
                Penalty Applied Successfully
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Penalty Type:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {result.penalty_type || formData.penaltyType}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Penalty Amount:</Typography>
                  <Typography variant="h6" fontWeight={700} color="error.dark">
                    {formatCurrency(result.penalty_amount || 0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total Penalties:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(result.total_penalties || 0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">New Total Due:</Typography>
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
            color="error"
            onClick={handleApply}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Calculate />}
          >
            {loading ? 'Applying...' : 'Apply Penalty'}
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

export default PenaltyApplicator;

