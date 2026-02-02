import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Autocomplete,
  Card,
  CardContent,
  Stack,
  Divider,
  useTheme,
  alpha,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Assessment,
  Person,
  CalendarToday,
  AccountBalance,
} from '@mui/icons-material';
import taxTypeService from 'src/services/taxTypeService';

const steps = ['Taxpayer Selection', 'Assessment Details', 'Review & Confirm'];

const AssessmentCreationWizard = ({ onComplete, onCancel, taxpayerOptions = [], defaultTaxpayer = null, loading = false }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [taxTypes, setTaxTypes] = useState([]);
  const [taxTypesLoading, setTaxTypesLoading] = useState(true);
  const [formData, setFormData] = useState({
    taxpayer: defaultTaxpayer || null,
    tin: defaultTaxpayer?.tin || defaultTaxpayer?.TIN || '',
    taxType: '',
    year: new Date().getFullYear(),
    quarter: Math.ceil((new Date().getMonth() + 1) / 3),
    amount: '',
    currency: 'TZS',
    description: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  // Load tax types from backend
  useEffect(() => {
    const loadTaxTypes = async () => {
      try {
        setTaxTypesLoading(true);
        const data = await taxTypeService.getAll({ active: true, status: 'ACTIVE' });
        setTaxTypes(Array.isArray(data) ? data : []);
        // Set default tax type if available
        if (data && data.length > 0) {
          const defaultType = data.find((tt) => tt.Code === 'VAT') || data[0];
          setFormData((prev) => ({ ...prev, taxType: defaultType.Code || defaultType.Name || '' }));
        }
      } catch (error) {
        console.error('Error loading tax types:', error);
        // Fallback to empty array
        setTaxTypes([]);
      } finally {
        setTaxTypesLoading(false);
      }
    };
    loadTaxTypes();
  }, []);

  // If defaultTaxpayer is provided, start at step 1 (skip taxpayer selection)
  useEffect(() => {
    if (defaultTaxpayer && activeStep === 0) {
      setActiveStep(1);
    }
  }, [defaultTaxpayer]);

  const handleNext = () => {
    // Validate current step
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => {
      const newStep = prevStep - 1;
      // Don't go back to step 0 if defaultTaxpayer is provided
      if (defaultTaxpayer && newStep < 1) {
        return 1;
      }
      return newStep;
    });
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 0 && !defaultTaxpayer) {
      if (!formData.taxpayer && !formData.tin) {
        newErrors.taxpayer = 'Please select a taxpayer or enter TIN';
      }
    } else if (step === 1 || (step === 0 && defaultTaxpayer)) {
      if (!formData.taxType) newErrors.taxType = 'Tax type is required';
      if (!formData.year) newErrors.year = 'Year is required';
      if (!formData.amount || Number(formData.amount) <= 0) {
        newErrors.amount = 'Valid amount is required';
      }
      if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    }
    return newErrors;
  };

  const handleTaxpayerChange = (event, newValue) => {
    setFormData({
      ...formData,
      taxpayer: newValue,
      tin: newValue?.tin || newValue?.TIN || formData.tin,
    });
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = () => {
    const finalErrors = validateStep(1);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setActiveStep(1);
      return;
    }

    const assessmentData = {
      tin: formData.tin || formData.taxpayer?.tin,
      taxType: formData.taxType,
      year: Number(formData.year),
      quarter: Number(formData.quarter),
      amount: Number(formData.amount),
      currency: formData.currency,
      description: formData.description,
      dueDate: formData.dueDate,
      status: 'PENDING',
      createdBy: 'admin',
      penalties: 0,
      interest: 0,
    };

    onComplete(assessmentData);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            {defaultTaxpayer ? (
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Creating assessment for: <strong>{defaultTaxpayer.name || defaultTaxpayer.Name}</strong> (TIN: {defaultTaxpayer.tin || defaultTaxpayer.TIN})
                </Alert>
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Select an existing taxpayer or enter a TIN to create a new assessment
                  </Alert>
                </Grid>
              </>
            )}
            {!defaultTaxpayer && (
              <>
                <Grid item xs={12}>
                  <Autocomplete
                    options={taxpayerOptions}
                    getOptionLabel={(option) => 
                      option.display || 
                      `${option.name || option.Name || ''} (${option.tin || option.TIN || ''})` ||
                      ''
                    }
                    value={formData.taxpayer}
                    onChange={handleTaxpayerChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Taxpayer"
                        placeholder="Type to search..."
                        error={!!errors.taxpayer}
                        helperText={errors.taxpayer}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Taxpayer Identification Number (TIN)"
                    fullWidth
                    value={formData.tin}
                    onChange={(e) => handleFieldChange('tin', e.target.value)}
                    error={!!errors.tin}
                    helperText={errors.tin || 'Enter TIN if taxpayer is not in the system'}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </>
            )}
            {formData.taxpayer && (
              <Grid item xs={12}>
                <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle color="success" />
                    <Box>
                      <Typography variant="h6">{formData.taxpayer.name || formData.taxpayer.Name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        TIN: {formData.taxpayer.tin || formData.taxpayer.TIN} | Type: {formData.taxpayer.type || formData.taxpayer.Type || 'N/A'}
                      </Typography>
                    </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Tax Type"
                fullWidth
                value={formData.taxType}
                onChange={(e) => handleFieldChange('taxType', e.target.value)}
                error={!!errors.taxType}
                helperText={errors.taxType || (taxTypesLoading ? 'Loading tax types...' : 'Select a tax type')}
                required
                disabled={taxTypesLoading || taxTypes.length === 0}
                SelectProps={{
                  renderValue: (value) => {
                    const selected = taxTypes.find((tt) => (tt.Code || tt.Name) === value);
                    return selected ? selected.Name || selected.Code : value || '';
                  },
                }}
              >
                {taxTypesLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading tax types...
                  </MenuItem>
                ) : taxTypes.length === 0 ? (
                  <MenuItem disabled>No tax types available</MenuItem>
                ) : (
                  taxTypes.map((taxType) => (
                    <MenuItem key={taxType.Code || taxType.Name} value={taxType.Code || taxType.Name}>
                      <Box>
                        <Typography variant="body1">{taxType.Name || taxType.Code}</Typography>
                        {taxType.Rate !== undefined && taxType.Rate !== null && (
                          <Typography variant="caption" color="text.secondary">
                            Rate: {Number(taxType.Rate).toFixed(1)}% | {taxType.Category || 'N/A'}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Year"
                fullWidth
                value={formData.year}
                onChange={(e) => handleFieldChange('year', e.target.value)}
                error={!!errors.year}
                helperText={errors.year}
                required
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Quarter"
                fullWidth
                value={formData.quarter}
                onChange={(e) => handleFieldChange('quarter', Number(e.target.value))}
              >
                <MenuItem value={1}>Q1 (Jan-Mar)</MenuItem>
                <MenuItem value={2}>Q2 (Apr-Jun)</MenuItem>
                <MenuItem value={3}>Q3 (Jul-Sep)</MenuItem>
                <MenuItem value={4}>Q4 (Oct-Dec)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Currency"
                fullWidth
                value={formData.currency}
                onChange={(e) => handleFieldChange('currency', e.target.value)}
                select
              >
                <MenuItem value="TZS">TZS (Tanzanian Shilling)</MenuItem>
                <MenuItem value="USD">USD (US Dollar)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Assessment Amount"
                fullWidth
                value={formData.amount}
                onChange={(e) => handleFieldChange('amount', e.target.value)}
                error={!!errors.amount}
                helperText={errors.amount}
                required
                InputProps={{
                  startAdornment: (
                    <AccountBalance sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Due Date"
                fullWidth
                value={formData.dueDate}
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Enter assessment description..."
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Review the assessment details before submitting
            </Alert>
            <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Taxpayer Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Name:</Typography>
                      <Typography fontWeight={600}>
                        {formData.taxpayer?.name || formData.taxpayer?.Name || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">TIN:</Typography>
                      <Typography fontWeight={600}>
                        {formData.tin || formData.taxpayer?.tin || formData.taxpayer?.TIN || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Assessment Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Tax Type:</Typography>
                      <Typography fontWeight={600}>{formData.taxType}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Period:</Typography>
                      <Typography fontWeight={600}>
                        {formData.year} - Q{formData.quarter}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Amount:</Typography>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        {formatCurrency(formData.amount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Due Date:</Typography>
                      <Typography fontWeight={600}>
                        {formData.dueDate
                          ? new Date(formData.dueDate).toLocaleDateString('en-TZ')
                          : 'N/A'}
                      </Typography>
                    </Box>
                    {formData.description && (
                      <Box sx={{ mt: 2 }}>
                        <Typography color="text.secondary" gutterBottom>
                          Description:
                        </Typography>
                        <Typography>{formData.description}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  // Adjust steps based on whether defaultTaxpayer is provided
  const displaySteps = defaultTaxpayer ? steps.slice(1) : steps;
  const adjustedActiveStep = defaultTaxpayer ? activeStep - 1 : activeStep;

  return (
    <Box>
      <Stepper activeStep={adjustedActiveStep} sx={{ mb: 4 }}>
        {displaySteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 4, mb: 3 }}>{renderStepContent()}</Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === (defaultTaxpayer ? 1 : 0)}
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        {activeStep === (defaultTaxpayer ? steps.length - 1 : steps.length - 1) ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            sx={{
              bgcolor: '#002855',
              color: 'white',
              fontWeight: 600,
              minWidth: 180,
              '&:hover': { 
                bgcolor: '#001B3D',
              },
              '&:disabled': {
                bgcolor: '#002855',
                color: 'white',
                opacity: 0.7,
              },
            }}
          >
            {loading ? 'Creating...' : 'Create Assessment'}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext} endIcon={<ArrowForward />}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AssessmentCreationWizard;

