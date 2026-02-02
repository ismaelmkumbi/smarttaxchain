import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Chip, 
  Typography, 
  Tooltip,
  Stack
} from '@mui/material';
import { 
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const TrustIndicators = ({ lastUpdated, isVerified = true, complianceScore = 95 }) => {
  const { t } = useTranslation();

  const formatDate = (date) => {
    return new Intl.DateTimeFormat(
      'en-TZ', 
      { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(new Date(date));
  };

  return (
    <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {/* Verification Badge */}
        <Tooltip title={t('trust.source')}>
          <Chip
            icon={<VerifiedIcon />}
            label={t('trust.verified')}
            color="success"
            variant="outlined"
            size="small"
          />
        </Tooltip>

        {/* Last Updated */}
        <Tooltip title={`${t('trust.lastUpdated')}: ${formatDate(lastUpdated)}`}>
          <Chip
            icon={<ScheduleIcon />}
            label={formatDate(lastUpdated)}
            color="info"
            variant="outlined"
            size="small"
          />
        </Tooltip>

        {/* Compliance Badge */}
        <Tooltip title={`${t('trust.compliance')}: ${complianceScore}%`}>
          <Chip
            icon={<CheckCircleIcon />}
            label={`${complianceScore}% ${t('trust.compliance')}`}
            color={complianceScore >= 90 ? 'success' : complianceScore >= 70 ? 'warning' : 'error'}
            variant="outlined"
            size="small"
          />
        </Tooltip>

        {/* Security Badge */}
        <Tooltip title={t('trust.source')}>
          <Chip
            icon={<SecurityIcon />}
            label="TRA Official"
            color="primary"
            variant="outlined"
            size="small"
          />
        </Tooltip>
      </Stack>

      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ mt: 1, display: 'block' }}
      >
        {t('trust.source')}
      </Typography>
    </Box>
  );
};

export default TrustIndicators;
