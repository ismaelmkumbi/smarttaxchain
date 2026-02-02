import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { alpha, useTheme } from '@mui/material/styles';
import { Shield, Hub, ReceiptLong, Verified } from '@mui/icons-material';
import { ReactComponent as TRALogo } from 'src/assets/images/logos/tra_logo.svg';

import PageContainer from 'src/components/container/PageContainer';
import smartTaxChainBg from 'src/assets/images/backgrounds/smart-tax-chain-login.svg';
import AuthLogin from '../authForms/AuthLogin';
import PropTypes from 'prop-types';

const LedgerRow = ({ title, subtitle, meta, status = 'Verified' }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      borderRadius: 2.5,
      border: '1px solid',
      borderColor: alpha('#111111', 0.08),
      backgroundColor: '#ffffff',
      boxShadow: `0 10px 28px ${alpha('#111111', 0.08)}`,
    }}
  >
    <Stack direction="row" spacing={1.25} alignItems="flex-start">
      <Box
        sx={{
          mt: 0.2,
          width: 34,
          height: 34,
          borderRadius: 2,
          background: alpha('#fff200', 0.22),
          border: `1px solid ${alpha('#fff200', 0.28)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Hub sx={{ fontSize: 18, color: '#111111' }} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: '#111111',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          <Chip
            size="small"
            label={status}
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#111111',
              backgroundColor: alpha('#fff200', 0.22),
              border: `1px solid ${alpha('#fff200', 0.6)}`,
            }}
          />
        </Stack>
        <Typography variant="caption" sx={{ display: 'block', color: '#5f6368', mt: 0.25 }}>
          {subtitle}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: '#80868b',
            mt: 0.5,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        >
          {meta}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

LedgerRow.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  meta: PropTypes.string.isRequired,
  status: PropTypes.string,
};

const Login = () => {
  const theme = useTheme();

  return (
    <PageContainer
      title="Login - Smart Tax Chain"
      description="Tanzania Revenue Authority Blockchain Taxation System"
    >
      <Grid container spacing={0} sx={{ overflowX: 'hidden', minHeight: '100vh' }}>
        <Grid
          size={{ xs: 12, sm: 12, lg: 7, xl: 8 }}
          sx={{
            position: 'relative',
            background: 'linear-gradient(135deg, #ffffff 0%, #fffef7 55%, #fffde7 100%)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              '&:before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at 20% 30%, ${alpha(
                  theme.palette.primary.main,
                  0.18,
                )} 0%, transparent 60%),
                radial-gradient(circle at 85% 75%, ${alpha(
                  theme.palette.primary.main,
                  0.12,
                )} 0%, transparent 60%)`,
              },
              '&:after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `repeating-linear-gradient(90deg, ${alpha('#111111', 0.05)} 0px, ${alpha(
                  '#111111',
                  0.05,
                )} 1px, transparent 1px, transparent 26px)`,
                opacity: 0.7,
              },
            }}
          />

          <Box position="relative" height="100vh" display="flex" flexDirection="column">
            {/* Brand header */}
            <Box
              sx={{
                px: 4,
                pt: 3,
                pb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                component={Link}
                to="/"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  borderRadius: 2,
                  px: 1.25,
                  py: 0.75,
                  background: alpha('#ffffff', 0.9),
                  border: `1px solid ${alpha('#111111', 0.08)}`,
                  boxShadow: `0 10px 28px ${alpha('#111111', 0.08)}`,
                  '&:hover': { background: '#ffffff' },
                  '& svg': { width: 140, height: 'auto', display: 'block' },
                }}
              >
                <TRALogo />
              </Box>

              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography
                  variant="caption"
                  sx={{ color: alpha('#111111', 0.75), fontWeight: 700, letterSpacing: 0.8 }}
                >
                  TANZANIA REVENUE AUTHORITY
                </Typography>
              </Box>
            </Box>

            {/* Hero */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                flex: 1,
                px: 4,
                pb: 4,
                alignItems: 'stretch',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  pr: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Stack spacing={2.25} sx={{ maxWidth: 560 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Verified sx={{ color: '#111111 !important' }} />}
                      label="Immutable audit trail"
                      sx={{
                        backgroundColor: '#fff200',
                        color: '#111111',
                        fontWeight: 800,
                        borderRadius: 999,
                      }}
                    />
                    <Chip
                      icon={<Shield sx={{ color: '#111111 !important' }} />}
                      label="Secure access"
                      variant="outlined"
                      sx={{
                        borderColor: alpha('#111111', 0.14),
                        backgroundColor: alpha('#ffffff', 0.7),
                        color: '#111111',
                        borderRadius: 999,
                        '& .MuiChip-icon': { color: '#111111' },
                      }}
                    />
                    <Chip
                      icon={<ReceiptLong sx={{ color: '#111111 !important' }} />}
                      label="Verifiable receipts"
                      variant="outlined"
                      sx={{
                        borderColor: alpha('#111111', 0.14),
                        backgroundColor: alpha('#ffffff', 0.7),
                        color: '#111111',
                        borderRadius: 999,
                        '& .MuiChip-icon': { color: '#111111' },
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      letterSpacing: '-1px',
                      lineHeight: 1.05,
                      color: '#111111',
                    }}
                  >
                    Smart Tax Chain
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#3c4043',
                      lineHeight: 1.6,
                      fontWeight: 500,
                      maxWidth: 520,
                    }}
                  >
                    A blockchain-first taxation platform for the Tanzania Revenue Authority—built
                    for transparency, integrity, and real-time traceability.
                  </Typography>

                  {/* “Live ledger” concept */}
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="overline"
                      sx={{ color: alpha('#111111', 0.65), letterSpacing: 1.4 }}
                    >
                      LIVE LEDGER SNAPSHOT
                    </Typography>
                    <Stack spacing={1.25} sx={{ mt: 1.25 }}>
                      <LedgerRow
                        title="Block #210,934"
                        subtitle="VAT filing recorded • Dar es Salaam"
                        meta="hash: 0x7a3d…c21f • 12 confirmations"
                        status="Verified"
                      />
                      <LedgerRow
                        title="Payment Receipt"
                        subtitle="PAYE remittance • Verified on-chain"
                        meta="tx: 0x19b1…8d2e • immutable receipt"
                        status="Sealed"
                      />
                      <LedgerRow
                        title="Compliance Proof"
                        subtitle="Audit-ready evidence package"
                        meta="proof: zk-commitment • exported in 1 click"
                        status="Ready"
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Watermark illustration */}
              <Box
                sx={{
                  width: 420,
                  position: 'relative',
                  display: { xs: 'none', xl: 'block' },
                }}
              >
                <Box
                  component="img"
                  src={smartTaxChainBg}
                  alt=""
                  aria-hidden="true"
                  sx={{
                    position: 'absolute',
                    right: -60,
                    bottom: -80,
                    width: 520,
                    maxWidth: 'none',
                    opacity: 0.12,
                    filter: 'contrast(1.05)',
                    transform: 'rotate(-6deg)',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, sm: 12, lg: 5, xl: 4 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: 'relative',
            background: 'linear-gradient(180deg, #ffffff 0%, #fffef7 100%)',
            minHeight: { xs: 'auto', lg: '100vh' },
            py: { xs: 4, lg: 0 },
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `radial-gradient(circle at 50% 10%, ${alpha(
                theme.palette.primary.main,
                0.16,
              )} 0%, transparent 55%)`,
            },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 480, px: { xs: 2, sm: 3 } }}>
            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                borderRadius: 4,
                border: '1px solid',
                borderColor: alpha('#111111', 0.08),
                backgroundColor: '#ffffff',
                boxShadow: `0 18px 50px ${alpha('#111111', 0.12)}`,
                overflow: 'hidden',
              }}
            >
              {/* TRA accent bar */}
              <Box
                sx={{
                  height: 6,
                  background: 'linear-gradient(90deg, #fff200 0%, #e6d700 100%)',
                }}
              />

              <Box sx={{ p: { xs: 3, sm: 4 } }}>
                {/* Header (portal-like) */}
                <Stack spacing={0.75} sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: 2,
                        backgroundColor: alpha('#fff200', 0.22),
                        border: `1px solid ${alpha('#fff200', 0.6)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Verified sx={{ fontSize: 18, color: '#111111' }} />
                    </Box>
                    <Typography
                      variant="overline"
                      sx={{ letterSpacing: 1.2, color: alpha('#111111', 0.7), fontWeight: 800 }}
                    >
                      Smart Tax Chain • TRA Portal
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, color: '#111111', letterSpacing: '-0.6px' }}
                  >
                    Sign in
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#5f6368', lineHeight: 1.6 }}>
                    Secure access to blockchain-verified tax operations and immutable audit trails.
                  </Typography>
                </Stack>

                <AuthLogin
                  title={undefined}
                  subtext={null}
                  subtitle={
                    <Stack
                      direction="row"
                      spacing={1}
                      mt={3}
                      justifyContent="center"
                      flexWrap="wrap"
                    >
                      <Typography color="text.secondary" variant="body2" fontWeight="400">
                        New to Smart Tax Chain?
                      </Typography>
                      <Typography
                        component={Link}
                        to="/auth/register"
                        fontWeight="700"
                        sx={{
                          textDecoration: 'none',
                          color: 'primary.main',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Create an account
                      </Typography>
                    </Stack>
                  }
                />
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;
