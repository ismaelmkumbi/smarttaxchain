// Enhanced Registration Modal Component
// Modal version of Enhanced User Registration for use in taxpayer list page
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  Person,
  Business,
  Assessment,
  CheckCircle,
  Close,
} from '@mui/icons-material';
import {
  IconShieldCheck,
  IconCertificate,
} from '@tabler/icons';
import { useTRA } from '../../../context/TRAContext';

// Import the step components from EnhancedUserRegistration
// We'll need to extract these or create simplified versions
const EnhancedRegistrationModal = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  
  // Use TRA context if available
  let traContext = null;
  try {
    traContext = useTRA();
  } catch (error) {
    console.log('TRA context not available');
  }

  const { registerTaxpayer, loading, error } = traContext || {
    registerTaxpayer: async (data) => {
      console.log('Registering taxpayer:', data);
      return { success: true };
    },
    loading: false,
    error: null,
  };

  const [activeStep, setActiveStep] = useState(0);
  const [registrationType, setRegistrationType] = useState('');
  const [taxpayerData, setTaxpayerData] = useState({
    name: '',
    nin: '',
    tin: '',
    type: 'Individual',
    businessCategory: 'Retail',
    registrationAddress: '',
    contactEmail: '',
    phoneNumber: '',
    authorizedSignatories: [],
    hasNIN: false,
  });
  const [nidaVerification, setNidaVerification] = useState(null);
  const [tinVerification, setTinVerification] = useState(null);
  const [complianceScore, setComplianceScore] = useState(null);
  const [blockchainRegistration, setBlockchainRegistration] = useState(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      // Reset all state when modal closes
      setActiveStep(0);
      setRegistrationType('');
      setTaxpayerData({
        name: '',
        nin: '',
        tin: '',
        type: 'Individual',
        businessCategory: 'Retail',
        registrationAddress: '',
        contactEmail: '',
        phoneNumber: '',
        authorizedSignatories: [],
        hasNIN: false,
      });
      setNidaVerification(null);
      setTinVerification(null);
      setComplianceScore(null);
      setBlockchainRegistration(null);
    }
  }, [open]);

  // Dynamic steps based on registration type
  const getSteps = () => {
    const baseSteps = [
      {
        label: 'Basic Information',
        description: 'Enter taxpayer basic information',
        icon: <Person />,
      },
    ];

    if (registrationType === 'nin') {
      baseSteps.push({
        label: 'NIDA Verification',
        description: 'Verify identity with National ID Authority',
        icon: <IconShieldCheck size={20} />,
      });
    } else if (registrationType === 'non-nin') {
      baseSteps.push({
        label: 'TIN Verification',
        description: 'Verify Tax Identification Number',
        icon: <IconCertificate size={20} />,
      });
    }

    baseSteps.push(
      {
        label: 'Compliance Assessment',
        description: 'Calculate initial compliance score',
        icon: <Assessment />,
      },
      {
        label: 'Blockchain Registration',
        description: 'Register on blockchain for transparency',
        icon: <Business />,
      },
      {
        label: 'Complete Registration',
        description: 'Finalize taxpayer registration',
        icon: <CheckCircle />,
      }
    );

    return baseSteps;
  };

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Helper function to format TIN (remove dashes, spaces, and ensure 9 digits)
  const formatTIN = (tin) => {
    if (!tin) return '';
    // Remove all non-digit characters
    const digitsOnly = tin.replace(/\D/g, '');
    return digitsOnly;
  };

  // Validate TIN format (must be exactly 9 digits)
  const validateTIN = (tin) => {
    if (!tin) return false;
    const digitsOnly = formatTIN(tin);
    return /^\d{9}$/.test(digitsOnly);
  };

  const handleCompleteRegistration = async () => {
    try {
      // Validate TIN before submission
      if (registrationType === 'non-nin' && !validateTIN(taxpayerData.tin)) {
        const errorMsg = `TIN must be exactly 9 digits. Provided: "${taxpayerData.tin}" (${formatTIN(taxpayerData.tin).length} digits). Please enter a valid 9-digit TIN.`;
        console.error('TIN validation failed:', {
          provided: taxpayerData.tin,
          formatted: formatTIN(taxpayerData.tin),
          length: formatTIN(taxpayerData.tin).length,
        });
        // Create and throw error so it's caught and displayed
        const validationError = new Error(errorMsg);
        validationError.code = 'INVALID_TIN_FORMAT';
        validationError.details = `TIN "${taxpayerData.tin}" does not match required format (9 digits)`;
        throw validationError;
      }

      // Format TIN to ensure it's clean (digits only)
      const formattedTIN = formatTIN(taxpayerData.tin);

      const finalData = {
        name: taxpayerData.name,
        nin: registrationType === 'nin' ? taxpayerData.nin : null,
        tin: formattedTIN, // Use formatted TIN (9 digits only)
        type: taxpayerData.type,
        businessCategory: taxpayerData.businessCategory,
        registrationAddress: taxpayerData.registrationAddress,
        contactEmail: taxpayerData.contactEmail,
        phoneNumber: taxpayerData.phoneNumber,
        authorizedSignatories: taxpayerData.authorizedSignatories || [],
        nidaVerification: registrationType === 'nin' ? nidaVerification : null,
        tinVerification: registrationType === 'non-nin' ? tinVerification : null,
        complianceScore: complianceScore?.score || 100,
        registrationDate: new Date().toISOString(),
        registrationType,
      };

      // Remove null values
      Object.keys(finalData).forEach((key) => {
        if (finalData[key] === null || finalData[key] === undefined) {
          delete finalData[key];
        }
      });

      // Validate TIN one more time before sending
      if (finalData.tin && !/^\d{9}$/.test(finalData.tin)) {
        throw new Error('TIN must be exactly 9 digits. Please check your TIN and try again.');
      }

      const result = await registerTaxpayer(finalData);

      if (result.success) {
        if (onSuccess) {
          onSuccess(result);
        }
        onClose();
      }
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is handled by TRA context, but we can set a local error if needed
      let errorMessage = 'Registration failed. Please try again.';
      
      // Extract error message properly
      if (error?.message) {
        if (typeof error.message === 'string') {
          errorMessage = error.message;
        } else if (typeof error.message === 'object') {
          errorMessage = error.message.message || error.message.code || errorMessage;
        }
      } else if (error?.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error?.response?.data?.error) {
        const errorData = error.response.data.error;
        errorMessage = errorData.message || errorData.code || errorMessage;
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`;
        }
      } else if (error?.response?.data?.message) {
        if (typeof error.response.data.message === 'string') {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data.message === 'object') {
          errorMessage = error.response.data.message.message || error.response.data.message.code || errorMessage;
        }
      }
      
      console.error('Registration error details:', errorMessage);
      // Note: Error is already set in TRA context, so user will see it in the Alert component
    }
  };

  // Auto-progress through verification steps
  useEffect(() => {
    if (activeStep === 1 && registrationType === 'nin' && taxpayerData.nin) {
      // Simulate NIDA verification
      setTimeout(() => {
        setNidaVerification({ verified: true, timestamp: new Date().toISOString() });
        handleNext();
      }, 2000);
    } else if (activeStep === 1 && registrationType === 'non-nin' && taxpayerData.tin) {
      // Simulate TIN verification
      setTimeout(() => {
        setTinVerification({ verified: true, timestamp: new Date().toISOString() });
        handleNext();
      }, 2000);
    }
  }, [activeStep, registrationType, taxpayerData.nin, taxpayerData.tin]);

  useEffect(() => {
    if (activeStep === 2) {
      // Simulate compliance scoring
      setTimeout(() => {
        const score = Math.floor(Math.random() * 30) + 70; // 70-100
        setComplianceScore({ score, timestamp: new Date().toISOString() });
        handleNext();
      }, 2000);
    }
  }, [activeStep]);

  useEffect(() => {
    if (activeStep === 3) {
      // Simulate blockchain registration
      setTimeout(() => {
        setBlockchainRegistration({
          success: true,
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          blockNumber: Math.floor(Math.random() * 10000) + 1000,
        });
        handleNext();
      }, 3000);
    }
  }, [activeStep]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="bold">
                  Select Registration Type
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Choose whether the taxpayer has a National Identification Number (NIN) or needs a
                  TIN assigned.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Registration Type *</InputLabel>
                <Select
                  value={registrationType}
                  label="Registration Type *"
                  onChange={(e) => {
                    setRegistrationType(e.target.value);
                    setTaxpayerData((prev) => ({
                      ...prev,
                      hasNIN: e.target.value === 'nin',
                    }));
                  }}
                  required
                >
                  <MenuItem value="nin">With NIN (National ID Number)</MenuItem>
                  <MenuItem value="non-nin">Without NIN (Enter TIN)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Taxpayer Name *"
                value={taxpayerData.name}
                onChange={(e) => setTaxpayerData({ ...taxpayerData, name: e.target.value })}
                required
              />
            </Grid>
            {registrationType === 'nin' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="NIN (National Identification Number) *"
                  value={taxpayerData.nin}
                  onChange={(e) => setTaxpayerData({ ...taxpayerData, nin: e.target.value })}
                  placeholder="1234567890123456"
                  helperText="Enter your NIDA number"
                  required
                />
              </Grid>
            )}
            {registrationType === 'non-nin' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="TIN (Tax Identification Number) *"
                  value={taxpayerData.tin}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow user to type, but we'll format on blur
                    setTaxpayerData({ ...taxpayerData, tin: value });
                  }}
                  onBlur={(e) => {
                    // Format TIN on blur (remove non-digits)
                    const formatted = formatTIN(e.target.value);
                    setTaxpayerData({ ...taxpayerData, tin: formatted });
                  }}
                  placeholder="123456789"
                  helperText={
                    taxpayerData.tin && !validateTIN(taxpayerData.tin)
                      ? 'TIN must be exactly 9 digits'
                      : 'Enter 9-digit TIN (e.g., 123456789)'
                  }
                  error={taxpayerData.tin ? !validateTIN(taxpayerData.tin) : false}
                  inputProps={{
                    maxLength: 15, // Allow some extra for formatting, but we'll clean it
                  }}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Taxpayer Type</InputLabel>
                <Select
                  value={taxpayerData.type}
                  label="Taxpayer Type"
                  onChange={(e) => setTaxpayerData({ ...taxpayerData, type: e.target.value })}
                >
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Company">Company</MenuItem>
                  <MenuItem value="Partnership">Partnership</MenuItem>
                  <MenuItem value="NGO">NGO</MenuItem>
                  <MenuItem value="Government">Government Agency</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Business Category</InputLabel>
                <Select
                  value={taxpayerData.businessCategory}
                  label="Business Category"
                  onChange={(e) =>
                    setTaxpayerData({ ...taxpayerData, businessCategory: e.target.value })
                  }
                >
                  <MenuItem value="Retail">Retail</MenuItem>
                  <MenuItem value="Wholesale">Wholesale</MenuItem>
                  <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                  <MenuItem value="Services">Services</MenuItem>
                  <MenuItem value="Agriculture">Agriculture</MenuItem>
                  <MenuItem value="Mining">Mining</MenuItem>
                  <MenuItem value="High Risk">High Risk</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={taxpayerData.contactEmail}
                onChange={(e) => setTaxpayerData({ ...taxpayerData, contactEmail: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={taxpayerData.phoneNumber}
                onChange={(e) => setTaxpayerData({ ...taxpayerData, phoneNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Registration Address"
                multiline
                rows={3}
                value={taxpayerData.registrationAddress}
                onChange={(e) =>
                  setTaxpayerData({ ...taxpayerData, registrationAddress: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        if (registrationType === 'nin') {
          return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Verifying with NIDA...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Validating National Identification Number: {taxpayerData.nin}
              </Typography>
              {nidaVerification?.verified && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  NIN verified successfully!
                </Alert>
              )}
            </Box>
          );
        } else if (registrationType === 'non-nin') {
          return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Verifying TIN...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Validating Tax Identification Number: {taxpayerData.tin}
              </Typography>
              {tinVerification?.verified && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  TIN verified successfully!
                </Alert>
              )}
            </Box>
          );
        }
        return null;

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Calculating Compliance Score...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Analyzing taxpayer data and risk factors
            </Typography>
            {complianceScore && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h4" color="primary" fontWeight={700}>
                  {complianceScore.score}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Compliance Score
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Registering on Blockchain...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Creating immutable record on Hyperledger Fabric
            </Typography>
            {blockchainRegistration?.success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Successfully registered on blockchain!
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Transaction: {blockchainRegistration.transactionHash?.substring(0, 20)}...
                </Typography>
              </Alert>
            )}
          </Box>
        );

      case 4:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Registration Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Taxpayer Name
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {taxpayerData.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    TIN
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {taxpayerData.tin}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Compliance Score
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {complianceScore?.score || 0}%
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Blockchain Status
                  </Typography>
                  <Chip
                    label={blockchainRegistration?.success ? 'Registered' : 'Pending'}
                    color={blockchainRegistration?.success ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.primary.main,
          color: theme.palette.text.primary,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          fontWeight: 700,
        }}
      >
          Enhanced Taxpayer Registration
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.text.primary,
            '&:hover': {
              bgcolor: alpha(theme.palette.text.primary, 0.1),
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {(() => {
                // Ensure we always display a string, never an object
                if (typeof error === 'string') {
                  return error;
                }
                if (error?.message) {
                  if (typeof error.message === 'string') {
                    return error.message;
                  }
                  if (typeof error.message === 'object') {
                    const msg = error.message.message || error.message.code;
                    const details = error.message.details;
                    return details ? `${msg}: ${details}` : msg || 'An error occurred during registration';
                  }
                }
                if (error?.error?.message) {
                  const details = error.error.details;
                  return details ? `${error.error.message}: ${details}` : error.error.message;
                }
                if (error?.error?.details) {
                  return error.error.details;
                }
                if (error?.code) {
                  return error.code;
                }
                return 'An error occurred during registration. Please try again.';
              })()}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  position: 'sticky',
                  top: 20,
                  maxHeight: 'calc(90vh - 200px)',
                  overflow: 'auto',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Registration Progress
                  </Typography>
                  <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel
                          StepIconComponent={() => {
                            const iconColor =
                              index <= activeStep
                                ? theme.palette.text.primary
                                : theme.palette.text.secondary;
                            const iconWithColor = React.isValidElement(step.icon)
                              ? React.cloneElement(step.icon, {
                                  color: iconColor,
                                  ...(step.icon.props?.size ? {} : { fontSize: 'inherit' }),
                                })
                              : step.icon;
                            return (
                              <Avatar
                                sx={{
                                  bgcolor:
                                    index <= activeStep
                                      ? theme.palette.primary.main
                                      : theme.palette.grey[300],
                                  color: iconColor,
                                }}
                              >
                                {iconWithColor}
                              </Avatar>
                            );
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight="medium">
                            {step.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {step.description}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {steps[activeStep]?.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {steps[activeStep]?.description}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    {renderStepContent(activeStep)}
                    {activeStep === 0 && registrationType && (
                      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          disabled={
                            !taxpayerData.name ||
                            (registrationType === 'nin' && !taxpayerData.nin) ||
                            (registrationType === 'non-nin' && (!taxpayerData.tin || !validateTIN(taxpayerData.tin)))
                          }
                        >
                          Continue
                        </Button>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {activeStep > 0 && activeStep < steps.length - 1 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleCompleteRegistration}
                disabled={
                  loading ||
                  !taxpayerData.name ||
                  (registrationType === 'nin' && !taxpayerData.nin) ||
                  (registrationType === 'non-nin' && (!taxpayerData.tin || !validateTIN(taxpayerData.tin)))
                }
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {loading ? 'Completing Registration...' : 'Complete Registration'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

EnhancedRegistrationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default EnhancedRegistrationModal;

