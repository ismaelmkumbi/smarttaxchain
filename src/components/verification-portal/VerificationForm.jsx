import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Send,
  VerifiedUser,
  Assessment,
  Lock,
  HelpOutline,
} from '@mui/icons-material';
import { validateTIN, validateAssessmentId, validateOTP } from 'src/utils/verification/validators';
import { maskTIN, checkRateLimit, resetRateLimit } from 'src/utils/verification/security';
import verificationService from 'src/services/verificationService';

const VerificationForm = ({ onVerificationSuccess }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    tin: '',
    assessmentId: '',
    otp: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showTIN, setShowTIN] = useState(false);
  const [rateLimit, setRateLimit] = useState({ allowed: true, remaining: 10 });
  const [countdown, setCountdown] = useState(0);

  // Check rate limit on mount and reset in development if needed
  useEffect(() => {
    const limit = checkRateLimit('verification', 10, 24 * 60 * 60 * 1000);
    setRateLimit(limit);
    
    // In development, reset rate limits on mount to allow testing
    if (import.meta.env.DEV) {
      resetRateLimit('otp_request');
      resetRateLimit('verification');
      console.log('🔄 Development mode: Rate limits reset');
    }
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const tinValidation = validateTIN(formData.tin);
    if (!tinValidation.valid) {
      newErrors.tin = tinValidation.error;
    }

    const assessmentValidation = validateAssessmentId(formData.assessmentId);
    if (!assessmentValidation.valid) {
      newErrors.assessmentId = assessmentValidation.error;
    }

    if (otpSent) {
      const otpValidation = validateOTP(formData.otp);
      if (!otpValidation.valid) {
        newErrors.otp = otpValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOTP = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('🔘 Request OTP button clicked', { 
      tin: formData.tin, 
      assessmentId: formData.assessmentId,
      otpLoading,
      otpSent 
    });
    
    // Validate inputs
    const tinValidation = validateTIN(formData.tin);
    const assessmentValidation = validateAssessmentId(formData.assessmentId);
    
    console.log('✅ Validation:', { tin: tinValidation, assessment: assessmentValidation });
    
    if (!tinValidation.valid || !assessmentValidation.valid) {
      console.warn('❌ Validation failed');
      validateForm();
      return;
    }

    // Check rate limit (with error handling)
    // In development, be more lenient with rate limits
    let limit;
    try {
      // In development, allow more requests (100 per hour instead of 5)
      const maxAttempts = import.meta.env.DEV ? 100 : 5;
      limit = checkRateLimit('otp_request', maxAttempts, 60 * 60 * 1000); // per hour
      console.log('📊 Rate limit check:', limit);
      
      if (!limit.allowed) {
        // In development, automatically reset rate limit and continue
        if (import.meta.env.DEV) {
          console.warn('⚠️ Rate limit exceeded, resetting for development mode');
          resetRateLimit('otp_request');
          // Reset and create new limit entry
          limit = checkRateLimit('otp_request', maxAttempts, 60 * 60 * 1000);
          console.log('📊 Rate limit after reset:', limit);
          // Continue even if still blocked (shouldn't happen after reset)
          if (!limit.allowed) {
            console.warn('⚠️ Still blocked after reset, forcing allow in dev mode');
            limit = { allowed: true, remaining: maxAttempts - 1 };
          }
        } else {
          setErrors({
            otp: `Too many OTP requests. Please try again later.`,
          });
          return;
        }
      }
    } catch (rateLimitError) {
      console.warn('⚠️ Rate limit check failed, continuing anyway:', rateLimitError);
      // Continue even if rate limit check fails
      limit = { allowed: true, remaining: 100 };
    }

    setOtpLoading(true);
    setErrors({});

    try {
      console.log('📧 Requesting OTP...', { tin: formData.tin, assessmentId: formData.assessmentId });
      const response = await verificationService.requestOTP(formData.tin, formData.assessmentId);
      console.log('✅ OTP Response:', response);
      
      if (response && response.success !== false) {
        setOtpSent(true);
        setCountdown(60); // 60 second countdown
        console.log('✅ OTP sent successfully, countdown started');
      } else {
        throw new Error(response?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('❌ OTP Request Error:', error);
      setErrors({ 
        otp: error.message || 'Failed to send OTP. Please try again.' 
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!otpSent) {
      setErrors({ otp: 'Please request an OTP first' });
      return;
    }

    // Check rate limit
    if (!rateLimit.allowed) {
      setErrors({
        submit: `Rate limit exceeded. You can verify ${rateLimit.remaining} more time(s) today.`,
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log('🔍 Verifying assessment...', { 
        tin: formData.tin, 
        assessmentId: formData.assessmentId,
        otpLength: formData.otp?.length 
      });
      
      const result = await verificationService.verifyAssessment(
        formData.tin,
        formData.assessmentId,
        formData.otp
      );
      
      console.log('✅ Verification Result:', result);
      
      if (result && (result.success !== false || result.assessment)) {
        if (onVerificationSuccess) {
          onVerificationSuccess(result);
        }
      } else {
        throw new Error(result?.message || 'Verification failed');
      }
    } catch (error) {
      console.error('❌ Verification Error:', error);
      setErrors({ 
        submit: error.message || 'Verification failed. Please check your details and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        boxShadow: 3,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <VerifiedUser
              sx={{
                fontSize: 48,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Verify Your Assessment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your details to view your assessment history and blockchain verification
            </Typography>
          </Box>

          {/* Help Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Open help dialog
              }}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
              }}
            >
              <HelpOutline fontSize="small" />
              <Typography variant="caption">What is this? How does it work?</Typography>
            </Link>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              {/* TIN Input */}
              <TextField
                label="Taxpayer Identification Number (TIN)"
                value={formData.tin || ''}
                onChange={handleChange('tin')}
                error={!!errors.tin}
                helperText={errors.tin || 'Enter your 9-digit TIN'}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VerifiedUser color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: formData.tin && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowTIN(!showTIN);
                        }}
                        edge="end"
                        size="small"
                        type="button"
                      >
                        {showTIN ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showTIN ? 'text' : 'password'}
                placeholder="123456789"
              />

              {/* Assessment ID Input */}
              <TextField
                label="Assessment ID"
                value={formData.assessmentId || ''}
                onChange={handleChange('assessmentId')}
                error={!!errors.assessmentId}
                helperText={errors.assessmentId || 'Enter your Assessment ID (e.g., ASSESS-2025-...)'}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Assessment color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="ASSESS-2025-..."
              />

              {/* OTP Section */}
              {otpSent && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Typography variant="body2" color="success.main" gutterBottom>
                    ✓ OTP sent to your registered email/phone
                  </Typography>
                  <TextField
                    label="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange('otp')}
                    error={!!errors.otp}
                    helperText={errors.otp || 'Enter the 6-digit code sent to you'}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="123456"
                    sx={{ mt: 1 }}
                  />
                  {countdown > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Resend OTP in {countdown} seconds
                    </Typography>
                  )}
                  {countdown === 0 && (
                    <Button
                      size="small"
                      onClick={handleRequestOTP}
                      disabled={otpLoading}
                      sx={{ mt: 1 }}
                    >
                      Resend OTP
                    </Button>
                  )}
                </Box>
              )}

              {/* Request OTP Button */}
              {!otpSent && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('🔘 Button clicked, calling handleRequestOTP');
                    handleRequestOTP();
                  }}
                  disabled={otpLoading || !formData.tin?.trim() || !formData.assessmentId?.trim()}
                  startIcon={otpLoading ? <CircularProgress size={20} /> : <Send />}
                  type="button"
                >
                  {otpLoading ? 'Sending...' : 'Request OTP'}
                </Button>
              )}

              {/* Submit Button */}
              {otpSent && (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || !formData.otp}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VerifiedUser />}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify Assessment'}
                </Button>
              )}

              {/* Rate Limit Info */}
              {rateLimit.remaining < 5 && (
                <Alert severity="info">
                  You have {rateLimit.remaining} verification attempt(s) remaining today.
                </Alert>
              )}

              {/* Error Messages */}
              {errors.submit && (
                <Alert severity="error">{errors.submit}</Alert>
              )}
            </Stack>
          </Box>

          {/* Security Notice */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: alpha(theme.palette.info.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              <strong>Security:</strong> Your TIN is masked for privacy. All verification data is
              encrypted and stored securely. Officer names are never displayed.
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VerificationForm;

