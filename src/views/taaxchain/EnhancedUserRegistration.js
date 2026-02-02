// src/views/taaxchain/EnhancedUserRegistration.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  LinearProgress,
  CircularProgress,
  useTheme,
  alpha,
  Paper,
  Fade,
  Grow,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Person,
  Business,
  Domain,
  Assessment,
  Payment,
  Receipt,
  Security,
  AutoAwesome,
  DataUsage,
  Public,
  Smartphone,
  Warning,
  CheckCircle,
  Error,
  Info,
  Refresh,
  Block,
  VerifiedUser,
  Timeline,
  MonetizationOn,
  Analytics,
  IntegrationInstructions,
  MobileFriendly,
  Notifications,
  Speed,
  Shield,
  ExpandMore,
  Add,
  Edit,
  Delete,
  Visibility,
  Download,
  Upload,
  Calculate,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import {
  IconEye,
  IconShield,
  IconBrain,
  IconDatabase,
  IconWorld,
  IconDeviceMobile,
  IconChartBar,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconClock,
  IconRefresh,
  IconDownload,
  IconUpload,
  IconSearch,
  IconFilter,
  IconSettings,
  IconHelp,
  IconInfoCircle,
  IconTrendingUp,
  IconTrendingDown,
  IconActivity,
  IconUsers,
  IconFileText,
  IconCalculator,
  IconReceipt2,
  IconCreditCard,
  IconWallet,
  IconQrcode,
  IconFingerprint,
  IconLock,
  IconKey,
  IconCertificate,
  IconShieldCheck,
  IconShieldX,
  IconShieldLock,
  IconShieldOff,
} from '@tabler/icons';
import { useTRA } from '../../context/TRAContext';
import { useTaxContext } from '../../context/TaxContext';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import BlankCard from '../../components/shared/BlankCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Enhanced Taxpayer Registration',
  },
];

// NIDA Verification Component (for NIN flow)
const NIDAVerification = ({ nidaNumber, taxpayerName, onVerificationComplete }) => {
  const theme = useTheme();
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Removed auto-verification - user must click button

  const handleVerify = async () => {
    if (!nidaNumber || nidaNumber.length < 10) {
      setVerificationResult({ verified: false, error: 'Please enter a valid NIDA number' });
      return;
    }

    setVerifying(true);
    try {
      // Simulate NIDA verification with NIDA API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = {
        verified: true,
        data: {
          nidaNumber: nidaNumber,
          fullName: taxpayerName || 'Retrieved from NIDA',
          verifiedAt: new Date().toISOString(),
          verificationHash: `NIDA-${nidaNumber}-${Date.now()}`,
        },
      };
      setVerificationResult(result);
      // Auto-proceed to next step
      if (result.verified) {
        setTimeout(() => {
          onVerificationComplete(result);
        }, 1500);
      }
    } catch (error) {
      setVerificationResult({ verified: false, error: error.message });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Fade in={true} timeout={600}>
      <Card
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fffef7 100%)',
          border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(17, 17, 17, 0.08), 0 0 0 1px rgba(255, 242, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 16px 48px rgba(17, 17, 17, 0.12), 0 0 0 1px rgba(255, 242, 0, 0.2)',
            borderColor: alpha(theme.palette.primary.main, 0.25),
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 64,
                height: 64,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                border: `3px solid ${alpha('#ffffff', 0.9)}`,
                color: theme.palette.text.primary,
              }}
            >
              <IconShieldCheck size={32} color={theme.palette.text.primary} />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                NIDA Verification
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                Verify identity with National ID Authority
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  border: `1.5px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                <TextField
                  fullWidth
                  label="NIDA Number (NIN)"
                  value={nidaNumber || ''}
                  disabled
                  placeholder="1234567890123456"
                  helperText="NIN number from Basic Information step"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                      fontWeight: 600,
                      '&.Mui-disabled': {
                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                        color: theme.palette.text.primary,
                      },
                    },
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              {!verifying && !verificationResult && (
                <Button
                  variant="contained"
                  onClick={handleVerify}
                  disabled={!nidaNumber || nidaNumber.length < 10}
                  startIcon={<IconShieldCheck size={22} />}
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.75,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: theme.palette.primary.contrastText,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.45)}`,
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      bgcolor: alpha(theme.palette.primary.main, 0.3),
                      color: alpha(theme.palette.text.primary, 0.5),
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Verify with NIDA
                </Button>
              )}
              {verifying && (
                <Box>
                  <LinearProgress
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      mb: 2.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      },
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                    fontWeight={500}
                    sx={{ fontSize: '0.95rem' }}
                  >
                    Verifying with NIDA system...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          {verificationResult && (
            <Grow in={true} timeout={500}>
              <Alert
                severity={verificationResult.verified ? 'success' : 'error'}
                sx={{
                  mt: 3,
                  borderRadius: 3,
                  border: `2px solid ${
                    verificationResult.verified ? alpha('#22c55e', 0.3) : alpha('#ef4444', 0.3)
                  }`,
                  bgcolor: verificationResult.verified
                    ? alpha('#22c55e', 0.08)
                    : alpha('#ef4444', 0.08),
                  '& .MuiAlert-icon': {
                    fontSize: 32,
                  },
                }}
                icon={verificationResult.verified ? <IconCheck size={28} /> : <IconX size={28} />}
              >
                {verificationResult.verified ? (
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom color="success.dark">
                      ✓ NIDA Verification Successful!
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mt: 2,
                        mb: 1.5,
                        bgcolor: alpha('#22c55e', 0.1),
                        border: `1px solid ${alpha('#22c55e', 0.3)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" fontWeight={600} color="text.secondary">
                        Verification Hash:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ mt: 0.5, fontFamily: 'monospace' }}
                      >
                        {verificationResult.data.verificationHash}
                      </Typography>
                    </Paper>
                    <Typography
                      variant="body2"
                      display="block"
                      sx={{ mt: 1.5, fontWeight: 600, color: 'success.dark' }}
                    >
                      Proceeding to Compliance Assessment...
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body1" fontWeight={600}>
                    Verification failed: {verificationResult.error}
                  </Typography>
                )}
              </Alert>
            </Grow>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

// TIN Verification Component (for non-NIN flow) - Verify entered TIN
const TINVerification = ({ tinNumber, taxpayerName, onVerificationComplete }) => {
  const theme = useTheme();
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerifyTIN = async () => {
    if (!tinNumber || tinNumber.length < 5) {
      setVerificationResult({ verified: false, error: 'Please enter a valid TIN number' });
      return;
    }

    setVerifying(true);
    try {
      // Simulate TIN verification
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = {
        verified: true,
        data: {
          tin: tinNumber,
          verifiedAt: new Date().toISOString(),
          verificationHash: `TIN-${tinNumber}-${Date.now()}`,
        },
      };
      setVerificationResult(result);
      // Auto-proceed to next step
      if (result.verified) {
        setTimeout(() => {
          onVerificationComplete(result);
        }, 1500);
      }
    } catch (error) {
      setVerificationResult({ verified: false, error: error.message });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Fade in={true} timeout={600}>
      <Card
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          border: `2px solid ${alpha(theme.palette.info.main, 0.15)}`,
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(17, 17, 17, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 16px 48px rgba(17, 17, 17, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.2)',
            borderColor: alpha(theme.palette.info.main, 0.25),
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Avatar
              sx={{
                bgcolor: theme.palette.info.main,
                width: 64,
                height: 64,
                boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.4)}`,
                border: `3px solid ${alpha('#ffffff', 0.9)}`,
              }}
            >
              <IconCertificate size={32} color="#ffffff" />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                TIN Verification
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                Verify Tax Identification Number
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: alpha(theme.palette.info.main, 0.04),
                  border: `1.5px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  borderRadius: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.info.main, 0.06),
                    borderColor: alpha(theme.palette.info.main, 0.3),
                  },
                }}
              >
                <TextField
                  fullWidth
                  label="TIN (Tax Identification Number)"
                  value={tinNumber || ''}
                  disabled
                  placeholder="TIN-XXX-XXX-XXX"
                  helperText="TIN number from Basic Information step"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                      fontWeight: 600,
                      '&.Mui-disabled': {
                        bgcolor: alpha(theme.palette.info.main, 0.03),
                        color: theme.palette.text.primary,
                      },
                    },
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              {!verifying && !verificationResult && (
                <Button
                  variant="contained"
                  onClick={handleVerifyTIN}
                  disabled={!tinNumber || tinNumber.length < 5}
                  startIcon={<IconCertificate size={22} />}
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.75,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                    color: '#ffffff',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.35)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`,
                      boxShadow: `0 12px 32px ${alpha(theme.palette.info.main, 0.45)}`,
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      bgcolor: alpha(theme.palette.info.main, 0.3),
                      color: alpha('#ffffff', 0.5),
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Verify TIN
                </Button>
              )}
              {verifying && (
                <Box>
                  <LinearProgress
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      mb: 2.5,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                      },
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                    fontWeight={500}
                    sx={{ fontSize: '0.95rem' }}
                  >
                    Verifying TIN number...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          {verificationResult && (
            <Grow in={true} timeout={500}>
              <Alert
                severity={verificationResult.verified ? 'success' : 'error'}
                sx={{
                  mt: 3,
                  borderRadius: 3,
                  border: `2px solid ${
                    verificationResult.verified ? alpha('#22c55e', 0.3) : alpha('#ef4444', 0.3)
                  }`,
                  bgcolor: verificationResult.verified
                    ? alpha('#22c55e', 0.08)
                    : alpha('#ef4444', 0.08),
                  '& .MuiAlert-icon': {
                    fontSize: 32,
                  },
                }}
                icon={verificationResult.verified ? <IconCheck size={28} /> : <IconX size={28} />}
              >
                {verificationResult.verified ? (
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom color="success.dark">
                      ✓ TIN Verification Successful!
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mt: 2,
                        mb: 1.5,
                        bgcolor: alpha('#22c55e', 0.1),
                        border: `1px solid ${alpha('#22c55e', 0.3)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" fontWeight={600} color="text.secondary">
                        Verification Hash:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ mt: 0.5, fontFamily: 'monospace' }}
                      >
                        {verificationResult.data.verificationHash}
                      </Typography>
                    </Paper>
                    <Typography
                      variant="body2"
                      display="block"
                      sx={{ mt: 1.5, fontWeight: 600, color: 'success.dark' }}
                    >
                      Proceeding to Compliance Assessment...
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body1" fontWeight={600}>
                    Verification failed: {verificationResult.error}
                  </Typography>
                )}
              </Alert>
            </Grow>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

// Compliance Scoring Component
const ComplianceScoring = ({ taxpayerData, onScoreCalculated }) => {
  const theme = useTheme();
  const [complianceScore, setComplianceScore] = useState(0);
  const [riskFactors, setRiskFactors] = useState([]);
  const [calculating, setCalculating] = useState(true);

  useEffect(() => {
    // Calculate initial compliance score based on taxpayer data
    const calculateScore = async () => {
      setCalculating(true);
      // Simulate calculation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let score = 100;
      const factors = [];

      if (taxpayerData.type === 'Individual') {
        score -= 5;
        factors.push({ factor: 'Individual taxpayer', impact: -5, risk: 'low' });
      }

      if (taxpayerData.businessCategory === 'High Risk') {
        score -= 15;
        factors.push({ factor: 'High-risk business category', impact: -15, risk: 'high' });
      }

      // Bonus for NIDA verification
      if (taxpayerData.hasNIN) {
        score += 10;
        factors.push({ factor: 'NIDA verified identity', impact: +10, risk: 'low' });
      }

      const finalScore = Math.max(0, Math.min(100, score));
      setComplianceScore(finalScore);
      setRiskFactors(factors);
      setCalculating(false);

      // Auto-proceed to blockchain registration
      setTimeout(() => {
        if (onScoreCalculated) {
          onScoreCalculated({ score: finalScore, factors });
        }
      }, 2000);
    };

    calculateScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxpayerData]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const getScoreColor = () => {
    if (complianceScore >= 80) return theme.palette.success.main;
    if (complianceScore >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Fade in={true} timeout={600}>
      <Card
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          border: `2px solid ${alpha(getScoreColor(), 0.15)}`,
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(17, 17, 17, 0.08), 0 0 0 1px rgba(34, 197, 94, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 16px 48px rgba(17, 17, 17, 0.12), 0 0 0 1px rgba(34, 197, 94, 0.2)',
            borderColor: alpha(getScoreColor(), 0.25),
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: `linear-gradient(90deg, ${getScoreColor()} 0%, ${alpha(
              getScoreColor(),
              0.7,
            )} 100%)`,
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Avatar
              sx={{
                bgcolor: getScoreColor(),
                width: 64,
                height: 64,
                boxShadow: `0 8px 24px ${alpha(getScoreColor(), 0.4)}`,
                border: `3px solid ${alpha('#ffffff', 0.9)}`,
              }}
            >
              <IconShieldCheck size={32} color="#ffffff" />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                Compliance Assessment
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                Calculate initial compliance score
              </Typography>
            </Box>
          </Box>

          {calculating ? (
            <Box>
              <LinearProgress
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mb: 2.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  },
                }}
              />
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                fontWeight={500}
                sx={{ fontSize: '0.95rem' }}
              >
                Calculating compliance score...
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={4}
                mb={4}
                sx={{
                  p: 4,
                  bgcolor: alpha(getScoreColor(), 0.06),
                  borderRadius: 4,
                  border: `2px solid ${alpha(getScoreColor(), 0.2)}`,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: getScoreColor(),
                    width: 100,
                    height: 100,
                    boxShadow: `0 12px 32px ${alpha(getScoreColor(), 0.4)}`,
                    border: `4px solid ${alpha('#ffffff', 0.9)}`,
                  }}
                >
                  <IconShieldCheck size={48} color="#ffffff" />
                </Avatar>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    color={getScoreColor()}
                    sx={{ lineHeight: 1, mb: 1 }}
                  >
                    {complianceScore}%
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="text.secondary">
                    Initial Compliance Score
                  </Typography>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={complianceScore}
                sx={{
                  height: 16,
                  borderRadius: 8,
                  mb: 3,
                  bgcolor: alpha(getScoreColor(), 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 8,
                    background: `linear-gradient(90deg, ${getScoreColor()} 0%, ${alpha(
                      getScoreColor(),
                      0.8,
                    )} 100%)`,
                    boxShadow: `0 4px 12px ${alpha(getScoreColor(), 0.4)}`,
                  },
                }}
              />
            </>
          )}

          {riskFactors.length > 0 && !calculating && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                Risk Factors Identified:
              </Typography>
              <List>
                {riskFactors.map((factor, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      mb: 1.5,
                      p: 2,
                      bgcolor: alpha(
                        getRiskColor(factor.risk) === 'success'
                          ? '#22c55e'
                          : getRiskColor(factor.risk) === 'warning'
                          ? '#f59e0b'
                          : '#ef4444',
                        0.06,
                      ),
                      border: `1.5px solid ${alpha(
                        getRiskColor(factor.risk) === 'success'
                          ? '#22c55e'
                          : getRiskColor(factor.risk) === 'warning'
                          ? '#f59e0b'
                          : '#ef4444',
                        0.2,
                      )}`,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(
                          getRiskColor(factor.risk) === 'success'
                            ? '#22c55e'
                            : getRiskColor(factor.risk) === 'warning'
                            ? '#f59e0b'
                            : '#ef4444',
                          0.1,
                        ),
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            getRiskColor(factor.risk) === 'success'
                              ? '#22c55e'
                              : getRiskColor(factor.risk) === 'warning'
                              ? '#f59e0b'
                              : '#ef4444',
                          width: 40,
                          height: 40,
                          boxShadow: `0 4px 12px ${alpha(
                            getRiskColor(factor.risk) === 'success'
                              ? '#22c55e'
                              : getRiskColor(factor.risk) === 'warning'
                              ? '#f59e0b'
                              : '#ef4444',
                            0.3,
                          )}`,
                        }}
                      >
                        <IconShield size={20} color="#ffffff" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={600}>
                          {factor.factor}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Impact: {factor.impact > 0 ? '+' : ''}
                          {factor.impact} points
                        </Typography>
                      }
                    />
                    <Chip
                      label={factor.risk.toUpperCase()}
                      size="medium"
                      color={getRiskColor(factor.risk)}
                      sx={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

// Blockchain Registration Component
const BlockchainRegistration = ({ taxpayerData, onRegistrationComplete }) => {
  const theme = useTheme();
  const [registering, setRegistering] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);

  useEffect(() => {
    // Auto-register on blockchain when component mounts
    if (taxpayerData.tin && !registrationResult) {
      handleBlockchainRegistration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlockchainRegistration = async () => {
    setRegistering(true);
    try {
      // Simulate blockchain registration
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const result = {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(Math.random() * 10000) + 1000,
        timestamp: new Date().toISOString(),
        blockchainAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      };
      setRegistrationResult(result);
      // Auto-proceed to final step
      setTimeout(() => {
        onRegistrationComplete(result);
      }, 2000);
    } catch (error) {
      setRegistrationResult({ success: false, error: error.message });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <Fade in={true} timeout={600}>
      <Card
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
          border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(17, 17, 17, 0.08), 0 0 0 1px rgba(255, 242, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 16px 48px rgba(17, 17, 17, 0.12), 0 0 0 1px rgba(255, 242, 0, 0.2)',
            borderColor: alpha(theme.palette.primary.main, 0.25),
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 64,
                height: 64,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                border: `3px solid ${alpha('#ffffff', 0.9)}`,
              }}
            >
              <IconDatabase size={32} color="#111111" />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                Blockchain Registration
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                Register on blockchain for transparency and auditability
              </Typography>
            </Box>
          </Box>

          {registering && (
            <Box>
              <LinearProgress
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mb: 2.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  },
                }}
              />
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                fontWeight={500}
                sx={{ fontSize: '0.95rem' }}
              >
                Registering taxpayer on blockchain...
              </Typography>
            </Box>
          )}

          {registrationResult && (
            <Grow in={true} timeout={500}>
              <Alert
                severity={registrationResult.success ? 'success' : 'error'}
                sx={{
                  mt: 3,
                  borderRadius: 3,
                  border: `2px solid ${
                    registrationResult.success ? alpha('#22c55e', 0.3) : alpha('#ef4444', 0.3)
                  }`,
                  bgcolor: registrationResult.success
                    ? alpha('#22c55e', 0.08)
                    : alpha('#ef4444', 0.08),
                  '& .MuiAlert-icon': {
                    fontSize: 32,
                  },
                }}
                icon={registrationResult.success ? <IconCheck size={28} /> : <IconX size={28} />}
              >
                {registrationResult.success ? (
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom color="success.dark">
                      ✓ Blockchain Registration Successful!
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            Transaction Hash:
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ mt: 0.5, fontFamily: 'monospace', wordBreak: 'break-all' }}
                          >
                            {registrationResult.transactionHash}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            Block Number:
                          </Typography>
                          <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
                            #{registrationResult.blockNumber}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            Blockchain Address:
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ mt: 0.5, fontFamily: 'monospace', wordBreak: 'break-all' }}
                          >
                            {registrationResult.blockchainAddress}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                    <Typography
                      variant="body2"
                      display="block"
                      sx={{ mt: 2, fontWeight: 600, color: 'success.dark' }}
                    >
                      Proceeding to Complete Registration...
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body1" fontWeight={600}>
                    Registration failed: {registrationResult.error}
                  </Typography>
                )}
              </Alert>
            </Grow>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

// Enhanced User Registration Component
const EnhancedUserRegistration = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Use TRA context if available, otherwise use fallback
  let traContext = null;
  try {
    traContext = useTRA();
  } catch (error) {
    // TRA context not available, using fallback
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
  const [registrationType, setRegistrationType] = useState(''); // 'nin' or 'non-nin'
  const [taxpayerData, setTaxpayerData] = useState({
    name: '',
    nin: '', // NIN number (for NIN flow)
    tin: '', // TIN number (for non-NIN flow, will be auto-assigned)
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
      },
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

  const handleNidaVerification = (result) => {
    setNidaVerification(result);
    if (result.verified) {
      // Update taxpayer data with NIN info
      setTaxpayerData((prev) => ({
        ...prev,
        hasNIN: true,
        tin: prev.tin || `TIN-${prev.nin?.substring(0, 9)}`,
      }));
      handleNext();
    }
  };

  const handleTINVerification = (result) => {
    setTinVerification(result);
    if (result.verified) {
      // Update taxpayer data with verified TIN
      setTaxpayerData((prev) => ({
        ...prev,
        hasNIN: false,
      }));
      // Auto-proceed to next step
      handleNext();
    }
  };

  const handleComplianceScoreCalculated = (result) => {
    setComplianceScore(result);
    // Auto-proceed to next step
    handleNext();
  };

  const handleBlockchainRegistration = (result) => {
    setBlockchainRegistration(result);
    // Auto-proceed to final step
    if (result.success) {
      handleNext();
    }
  };

  const handleCompleteRegistration = async () => {
    try {
      // Build final data - backend will handle blockchain registration
      const finalData = {
        name: taxpayerData.name,
        nin: registrationType === 'nin' ? taxpayerData.nin : null,
        tin: taxpayerData.tin,
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

      console.log('Sending registration data to backend:', JSON.stringify(finalData, null, 2));

      const result = await registerTaxpayer(finalData);

      if (result.success) {
        navigate('/dashboards/enhanced-modern');
      } else {
        console.error('Registration failed:', result);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

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
                  onChange={(e) => setTaxpayerData({ ...taxpayerData, tin: e.target.value })}
                  placeholder="TIN-XXX-XXX-XXX"
                  helperText="Enter your Tax Identification Number"
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
            <NIDAVerification
              nidaNumber={taxpayerData.nin}
              taxpayerName={taxpayerData.name}
              onVerificationComplete={handleNidaVerification}
            />
          );
        } else if (registrationType === 'non-nin') {
          return (
            <TINVerification
              tinNumber={taxpayerData.tin}
              taxpayerName={taxpayerData.name}
              onVerificationComplete={handleTINVerification}
            />
          );
        }
        return null;

      case 2:
        return (
          <ComplianceScoring
            taxpayerData={taxpayerData}
            onScoreCalculated={handleComplianceScoreCalculated}
          />
        );

      case 3:
        return (
          <BlockchainRegistration
            taxpayerData={taxpayerData}
            onRegistrationComplete={handleBlockchainRegistration}
          />
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
                {registrationType === 'nin' && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      NIN / NIDA Verification
                    </Typography>
                    <Chip
                      icon={
                        nidaVerification?.verified ? <IconCheck size={16} /> : <IconX size={16} />
                      }
                      label={nidaVerification?.verified ? 'Verified' : 'Not Verified'}
                      color={nidaVerification?.verified ? 'success' : 'error'}
                      size="small"
                    />
                    {nidaVerification?.verified && (
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        NIN: {taxpayerData.nin}
                      </Typography>
                    )}
                  </Grid>
                )}
                {registrationType === 'non-nin' && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      TIN Verification
                    </Typography>
                    <Chip
                      icon={
                        tinVerification?.verified ? <IconCheck size={16} /> : <IconX size={16} />
                      }
                      label={tinVerification?.verified ? 'Verified' : 'Not Verified'}
                      color={tinVerification?.verified ? 'success' : 'error'}
                      size="small"
                    />
                    {tinVerification?.verified && (
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        TIN: {taxpayerData.tin}
                      </Typography>
                    )}
                  </Grid>
                )}
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
                    Blockchain Registration
                  </Typography>
                  <Chip
                    icon={
                      blockchainRegistration?.success ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconX size={16} />
                      )
                    }
                    label={blockchainRegistration?.success ? 'Registered' : 'Not Registered'}
                    color={blockchainRegistration?.success ? 'success' : 'error'}
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

  if (loading) {
    return (
      <PageContainer
        title="Enhanced Taxpayer Registration"
        description="Blockchain-powered taxpayer registration"
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Enhanced Taxpayer Registration"
      description="Blockchain-powered taxpayer registration"
    >
      <Breadcrumb title="Enhanced Taxpayer Registration" items={BCrumb} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
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
                        // Clone icon and add color prop if it's a Tabler icon or MUI icon
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
                    <StepContent>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                            disabled={index === steps.length - 1}
                          >
                            {index === steps.length - 1 ? 'Finish' : 'Continue'}
                          </Button>
                          <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                            Back
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
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
                        (registrationType === 'non-nin' && !taxpayerData.tin)
                      }
                    >
                      Continue
                    </Button>
                  </Box>
                )}
              </Box>

              {activeStep === steps.length - 1 && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleCompleteRegistration}
                    fullWidth
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                  >
                    {loading ? 'Completing Registration...' : 'Complete Registration'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default EnhancedUserRegistration;
