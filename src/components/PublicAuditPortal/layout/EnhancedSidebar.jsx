import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Badge,
  Tooltip,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Feedback as FeedbackIcon,
  BarChart as BarChartIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const EnhancedSidebar = ({ open, onClose, width = 280, logo }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeItem, setActiveItem] = useState('dashboard');

  const navigationItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard', 'Dashboard'),
      icon: <DashboardIcon />,
      path: '/public-audit-portal/dashboard',
      badge: null,
      description: t('nav.dashboardDesc', 'Overview and key metrics'),
    },
    {
      id: 'tax-data',
      label: t('nav.taxData', 'Tax Data Analytics'),
      icon: <BarChartIcon />,
      path: '/public-audit-portal/tax-data',
      badge: 'Live',
      description: t('nav.taxDataDesc', 'Interactive charts and analysis'),
    },
    {
      id: 'simulation',
      label: t('simulation.title', 'Smart Tax Chain Simulation'),
      icon: <TrendingUpIcon />,
      path: '/public-audit-portal/simulation',
      badge: null,
      description: t('simulation.description', 'Interactive tax simulation'),
    },
    {
      id: 'education',
      label: t('nav.education', 'Civic Education'),
      icon: <SchoolIcon />,
      path: '/public-audit-portal/education',
      badge: null,
      description: t('nav.educationDesc', 'Learn about tax policies'),
    },
    {
      id: 'feedback',
      label: t('nav.feedback', 'Feedback'),
      icon: <FeedbackIcon />,
      path: '/public-audit-portal/feedback',
      badge: null,
      description: t('nav.feedbackDesc', 'Share your thoughts with us'),
    },
    {
      id: 'download',
      label: t('nav.download', 'Download Data'),
      icon: <DownloadIcon />,
      path: '/public-audit-portal/download',
      badge: null,
      description: t('nav.downloadDesc', 'Export tax data in various formats'),
    },
  ];

  // Update active item based on current path
  useEffect(() => {
    const currentItem = navigationItems.find((item) => location.pathname.startsWith(item.path));
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const renderNavItem = (item) => (
    <Tooltip key={item.id} title={!open ? item.description : ''} placement="right" arrow>
      <ListItemButton
        selected={activeItem === item.id}
        onClick={() => handleNavigation(item.path)}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
            color: activeItem === item.id ? theme.palette.primary.main : 'inherit',
          }}
        >
          {item.badge ? (
            <Badge badgeContent={item.badge} color="primary">
              {item.icon}
            </Badge>
          ) : (
            item.icon
          )}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          sx={{ opacity: open ? 1 : 0 }}
          primaryTypographyProps={{
            variant: 'body2',
            fontWeight: activeItem === item.id ? 'medium' : 'regular',
          }}
        />
      </ListItemButton>
    </Tooltip>
  );

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {logo && (
            <Box
              component="img"
              src={logo}
              alt="TRA Logo"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                boxShadow: '0px 2px 8px #fff20033',
                background: '#fff',
                p: 0.5,
                mr: 1.5,
              }}
            />
          )}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, lineHeight: 1.2, color: '#f5e800' }}
            >
              {t('dashboard.title', 'Public Audit Portal')}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
              {t('dashboard.version', 'v2.0 - Enhanced')}
            </Typography>
          </Box>
          {isMobile && (
            <IconButton onClick={onClose} size="small" sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Chip
          label={t('status.online', 'System Online')}
          size="small"
          sx={{
            background: '#f5e800', // TRA Yellow
            color: '#000000', // TRA Black
            border: '1px solid #f5e800',
            fontSize: '0.7rem',
            height: 20,
            mt: 1,
          }}
        />
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List>{navigationItems.map((item) => renderNavItem(item))}</List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <InfoIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
          <Typography variant="caption" color="text.secondary">
            {t('footer.lastUpdate', 'Last updated: Today')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={t('status.secure', 'Secure')}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20, borderColor: '#f5e800', color: '#f5e800' }}
          />
          <Chip
            label={t('status.verified', 'Verified')}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20, borderColor: '#f5e800', color: '#f5e800' }}
          />
        </Box>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: width,
            boxShadow: '0px 8px 32px #cfcfcf33',
            backgroundColor: '#000000', // TRA Black
            color: '#f5e800', // TRA Yellow for text/icons
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          width: width,
          boxShadow: '0px 4px 20px #cfcfcf33',
          borderRight: '2px solid #f5e800', // TRA Yellow
          backgroundColor: '#000000', // TRA Black
          color: '#f5e800', // TRA Yellow for text/icons
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

EnhancedSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.number,
  logo: PropTypes.string, // Added logo prop type
};

export default EnhancedSidebar;
