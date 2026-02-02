import { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  Fab,
  Zoom,
  Snackbar,
  Alert,
  LinearProgress,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import getTraTheme from '../../../theme/tra-mui-theme';
import EnhancedHeader from './EnhancedHeader';
import EnhancedSidebar from './EnhancedSidebar';
import AccessibilityProvider from '../AccessibilityProvider';
import traLogo from '../../../assets/images/logos/tra_logo.svg';

const SIDEBAR_WIDTH = 280;
const HEADER_HEIGHT = 72;

const EnhancedLayout = ({
  children,
  activeSection = 'dashboard',
  onSectionChange,
  loading = false,
  notifications = [],
}) => {
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notification, setNotification] = useState(null);
  const [themeMode, setThemeMode] = useState('light');

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme creation
  const theme = getTraTheme(themeMode);
  useEffect(() => {
    document.body.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);
  const handleThemeModeChange = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    setNotification({
      type: 'success',
      message: `Language changed to ${lang === 'en' ? 'English' : 'Kiswahili'}`,
    });
  };

  const handleSectionChange = (section) => {
    onSectionChange?.(section);
    // Add smooth transition effect
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  const sidebarWidth = sidebarOpen && !isMobile ? SIDEBAR_WIDTH : 0;

  return (
    <ThemeProvider theme={theme}>
      <AccessibilityProvider>
        <CssBaseline />

        {/* Loading Backdrop */}
        <Backdrop
          sx={{
            color: theme.palette.secondary.main,
            zIndex: theme.zIndex.drawer + 1,
            background: 'rgba(0, 40, 85, 0.8)',
            backdropFilter: 'blur(4px)',
          }}
          open={loading}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="secondary" size={60} thickness={4} sx={{ mb: 2 }} />
            <Box sx={{ color: 'white', fontSize: '1.1rem', fontWeight: 500 }}>
              Loading Portal...
            </Box>
          </Box>
        </Backdrop>

        {/* Progress Bar for Loading States */}
        {loading && (
          <LinearProgress
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: theme.zIndex.appBar + 1,
              height: 3,
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #FFD100 0%, #E6B800 100%)',
              },
            }}
          />
        )}

        {/* Enhanced Header */}
        <EnhancedHeader
          onMenuClick={handleSidebarToggle}
          activeSection={activeSection}
          onLanguageChange={handleLanguageChange}
          currentLanguage={currentLanguage}
          notifications={notifications}
          themeMode={themeMode}
          onThemeModeChange={handleThemeModeChange}
          logo={traLogo}
        />

        {/* Enhanced Sidebar */}
        <EnhancedSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isMobile={isMobile}
          width={SIDEBAR_WIDTH}
          logo={traLogo}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: '100vh',
            marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
            marginTop: `${HEADER_HEIGHT}px`,
            transition: theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            background: 'linear-gradient(180deg, #fafbfb 0%, #f2f6fa 100%)',
            position: 'relative',
          }}
        >
          {/* Content Container */}
          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              maxWidth: '1400px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Page Transition Animation */}
            <Box
              sx={{
                animation: 'fadeInUp 0.6s ease-out',
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              {children}
            </Box>
          </Box>

          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: `
                radial-gradient(circle at 20% 50%, rgba(0, 40, 85, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 209, 0, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(0, 87, 146, 0.03) 0%, transparent 50%)
              `,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        </Box>

        {/* Floating Action Buttons */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: theme.zIndex.speedDial,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {/* Accessibility Button */}
          <Fab
            size="medium"
            color="secondary"
            aria-label="accessibility options"
            sx={{
              background: 'linear-gradient(135deg, #FFD100 0%, #E6B800 100%)',
              color: '#002855',
              boxShadow: '0px 4px 20px rgba(255, 209, 0, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E6B800 0%, #FFD100 100%)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <AccessibilityIcon />
          </Fab>

          {/* Scroll to Top Button */}
          <Zoom in={showScrollTop}>
            <Fab
              size="medium"
              color="primary"
              aria-label="scroll to top"
              onClick={handleScrollToTop}
              sx={{
                background: 'linear-gradient(135deg, #002855 0%, #005792 100%)',
                boxShadow: '0px 4px 20px rgba(0, 40, 85, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #005792 0%, #002855 100%)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          </Zoom>
        </Box>

        {/* Notification Snackbar */}
        <Snackbar
          open={Boolean(notification)}
          autoHideDuration={4000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          sx={{ mb: 2, ml: isMobile ? 2 : `${sidebarWidth + 16}px` }}
        >
          {notification && (
            <Alert
              onClose={handleNotificationClose}
              severity={notification.type}
              variant="filled"
              sx={{
                borderRadius: 2,
                boxShadow: '0px 4px 20px rgba(0, 40, 85, 0.15)',
              }}
            >
              {notification.message}
            </Alert>
          )}
        </Snackbar>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: theme.zIndex.drawer - 1,
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AccessibilityProvider>
    </ThemeProvider>
  );
};

EnhancedLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeSection: PropTypes.string,
  onSectionChange: PropTypes.func,
  loading: PropTypes.bool,
  notifications: PropTypes.array,
};

export default EnhancedLayout;
