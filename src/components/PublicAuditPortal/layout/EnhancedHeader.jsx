import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Chip,
  Avatar,
  Tooltip,
  Breadcrumbs,
  Link,
  useMediaQuery,
  useTheme,
  Fade,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Accessibility as AccessibilityIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

// Remove TRALogo component

const EnhancedHeader = ({
  onMenuClick,
  activeSection,
  onLanguageChange,
  currentLanguage = 'en',
  showBreadcrumbs = true,
  notifications = [],
  themeMode = 'light',
  onThemeModeChange,
  logo,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [helpAnchor, setHelpAnchor] = useState(null);

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleLanguageSelect = (lang) => {
    i18n.changeLanguage(lang);
    onLanguageChange?.(lang);
    handleLanguageClose();
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleHelpClick = (event) => {
    setHelpAnchor(event.currentTarget);
  };

  const handleHelpClose = () => {
    setHelpAnchor(null);
  };

  const getSectionTitle = (section) => {
    const titles = {
      dashboard: t('nav.dashboard', 'Dashboard'),
      charts: t('nav.taxData', 'Tax Data'),
      blockchain: t('nav.blockchain', 'Blockchain Explorer'),
      simulation: t('simulation.title', 'Smart Tax Chain Simulation'),
      education: t('nav.education', 'Civic Education'),
      feedback: t('nav.feedback', 'Feedback'),
    };
    return titles[section] || t('nav.dashboard', 'Dashboard');
  };

  const breadcrumbItems = [
    { label: t('nav.home', 'Home'), icon: <HomeIcon fontSize="small" /> },
    { label: t('dashboard.title', 'Public Audit Portal') },
    { label: getSectionTitle(activeSection) },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  ];

  const helpItems = [
    { label: t('help.userGuide', 'User Guide'), icon: <HelpIcon /> },
    { label: t('help.accessibility', 'Accessibility'), icon: <AccessibilityIcon /> },
    { label: t('help.downloads', 'Downloads'), icon: <DownloadIcon /> },
    { label: t('help.share', 'Share Portal'), icon: <ShareIcon /> },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 3 } }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          {logo && (
            <Box
              component="img"
              src={logo}
              alt="TRA Logo"
              sx={{
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                borderRadius: 1,
                boxShadow: '0px 2px 8px #fff20033',
                background: '#fff',
                p: 0.5,
              }}
            />
          )}
          <Box sx={{ ml: 2 }}>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              component="div"
              sx={{
                fontWeight: 700,
                color: '#f5e800',
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
                lineHeight: 1.2,
              }}
            >
              {t('dashboard.title', 'Public Audit Portal')}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#f5e800',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              {t('dashboard.subtitle', 'Tanzania Revenue Authority')}
            </Typography>
          </Box>
        </Box>

        {/* Breadcrumbs - Desktop Only */}
        {!isMobile && showBreadcrumbs && (
          <Box sx={{ flexGrow: 1, mx: 3 }}>
            <Breadcrumbs
              separator={
                <NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              }
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              {breadcrumbItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color:
                      index === breadcrumbItems.length - 1 ? '#FFD100' : 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.875rem',
                    fontWeight: index === breadcrumbItems.length - 1 ? 600 : 400,
                  }}
                >
                  {item.icon}
                  {item.label}
                </Box>
              ))}
            </Breadcrumbs>
          </Box>
        )}

        {/* Spacer for mobile */}
        {isMobile && <Box sx={{ flexGrow: 1 }} />}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Status Indicator */}
          <Chip
            label={t('status.live', 'Live Data')}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #13DEB9 0%, #02B3A9 100%)',
              color: 'white',
              fontWeight: 600,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.7 },
                '100%': { opacity: 1 },
              },
            }}
          />

          {/* Notifications */}
          <Tooltip title={t('notifications.title', 'Notifications')}>
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFD100',
                },
              }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Language Selector */}
          <Tooltip title={t('language.select', 'Select Language')}>
            <Button
              color="inherit"
              onClick={handleLanguageClick}
              startIcon={<LanguageIcon />}
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFD100',
                },
              }}
            >
              {!isMobile && languages.find((lang) => lang.code === currentLanguage)?.name}
            </Button>
          </Tooltip>

          {/* Help Menu */}
          <Tooltip title={t('help.title', 'Help & Support')}>
            <IconButton
              color="inherit"
              onClick={handleHelpClick}
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFD100',
                },
              }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>

          {/* Dark mode toggle */}
          <Tooltip title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              color="inherit"
              onClick={onThemeModeChange}
              aria-label={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              sx={{ ml: 1 }}
            >
              {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Language Menu */}
        <Menu
          anchorEl={languageAnchor}
          open={Boolean(languageAnchor)}
          onClose={handleLanguageClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: '0px 8px 32px rgba(0, 40, 85, 0.15)',
              border: '1px solid rgba(0, 40, 85, 0.1)',
            },
          }}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              selected={currentLanguage === lang.code}
              sx={{
                gap: 1,
                minWidth: 150,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 40, 85, 0.08)',
                  color: '#002855',
                },
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
              {lang.name}
            </MenuItem>
          ))}
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: '0px 8px 32px rgba(0, 40, 85, 0.15)',
              border: '1px solid rgba(0, 40, 85, 0.1)',
              minWidth: 300,
            },
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <MenuItem key={index} sx={{ whiteSpace: 'normal', maxWidth: 280 }}>
                <Box>
                  <Typography variant="subtitle2">{notification.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.message}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {t('notifications.empty', 'No new notifications')}
              </Typography>
            </MenuItem>
          )}
        </Menu>

        {/* Help Menu */}
        <Menu
          anchorEl={helpAnchor}
          open={Boolean(helpAnchor)}
          onClose={handleHelpClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: '0px 8px 32px rgba(0, 40, 85, 0.15)',
              border: '1px solid rgba(0, 40, 85, 0.1)',
              minWidth: 200,
            },
          }}
        >
          {helpItems.map((item, index) => (
            <MenuItem key={index} onClick={handleHelpClose} sx={{ gap: 1.5 }}>
              {item.icon}
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

EnhancedHeader.propTypes = {
  onMenuClick: PropTypes.func,
  activeSection: PropTypes.string,
  onLanguageChange: PropTypes.func,
  currentLanguage: PropTypes.string,
  showBreadcrumbs: PropTypes.bool,
  notifications: PropTypes.array,
  themeMode: PropTypes.string,
  onThemeModeChange: PropTypes.func,
  logo: PropTypes.string,
};

export default EnhancedHeader;
