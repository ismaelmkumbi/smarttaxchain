import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  useTheme,
  alpha,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import {
  Security,
  Visibility,
  VisibilityOff,
  Lock,
  Person,
  Info,
} from '@mui/icons-material';

const PrivacySecurityControls = ({ settings = {}, onSettingsChange }) => {
  const theme = useTheme();

  const defaultSettings = {
    maskOfficerNames: true,
    hideOtherTaxpayers: true,
    showTechnicalDetails: false,
    enableNotifications: true,
    ...settings,
  };

  const [localSettings, setLocalSettings] = React.useState(defaultSettings);

  const handleSettingChange = (key) => (event) => {
    const newSettings = {
      ...localSettings,
      [key]: event.target.checked,
    };
    setLocalSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Security color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Confidentiality & Security Controls
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Manage your privacy settings and data visibility
            </Typography>
          </Box>

          <Divider />

          {/* Privacy Settings */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Privacy Settings
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.maskOfficerNames}
                    onChange={handleSettingChange('maskOfficerNames')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Person fontSize="small" />
                      <Typography variant="body2">Mask Officer Identities</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Show only officer roles, never full names
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.hideOtherTaxpayers}
                    onChange={handleSettingChange('hideOtherTaxpayers')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <VisibilityOff fontSize="small" />
                      <Typography variant="body2">Hide Other Taxpayers' Data</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Only show your own assessment and payment data
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.showTechnicalDetails}
                    onChange={handleSettingChange('showTechnicalDetails')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Visibility fontSize="small" />
                      <Typography variant="body2">Show Technical Details</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Display blockchain hashes and technical information
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.enableNotifications}
                    onChange={handleSettingChange('enableNotifications')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Info fontSize="small" />
                      <Typography variant="body2">Enable Notifications</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Receive alerts for new assessments and payments
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </Box>

          <Divider />

          {/* Security Features */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Security Features
            </Typography>
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Lock color="success" />
                  <Typography variant="body2" fontWeight={600}>
                    Zero-Knowledge Verification
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Your sensitive details are verified without exposing full data to the system
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Security color="info" />
                  <Typography variant="body2" fontWeight={600}>
                    Role-Based Access Control
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Access is restricted based on your taxpayer role and permissions
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Data Privacy Notice */}
          <Alert severity="info" icon={<Info />}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Data Privacy Notice
            </Typography>
            <Typography variant="caption" component="div">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Your personal information is encrypted and stored securely</li>
                <li>Officer names are never displayed - only roles and IDs</li>
                <li>All access attempts are logged for security auditing</li>
                <li>Data is only accessible with proper authentication</li>
                <li>Blockchain records are immutable and tamper-proof</li>
              </ul>
            </Typography>
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PrivacySecurityControls;

