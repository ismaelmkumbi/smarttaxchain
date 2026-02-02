import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ToggleButton, 
  ToggleButtonGroup, 
  Box, 
  Typography 
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      i18n.changeLanguage(newLanguage);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        p: 1
      }}
    >
      <LanguageIcon color="primary" />
      <Typography variant="body2" sx={{ mr: 1 }}>
        {t('nav.language')}:
      </Typography>
      <ToggleButtonGroup
        value={i18n.language}
        exclusive
        onChange={handleLanguageChange}
        aria-label="language selection"
        size="small"
      >
        <ToggleButton 
          value="en" 
          aria-label="English"
          sx={{ px: 2, py: 0.5 }}
        >
          EN
        </ToggleButton>
        <ToggleButton 
          value="sw" 
          aria-label="Kiswahili"
          sx={{ px: 2, py: 0.5 }}
        >
          SW
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default LanguageToggle;
