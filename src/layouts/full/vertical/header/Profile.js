import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import { IconMail } from '@tabler/icons';

import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import { useAuth } from 'src/context/AuthContext';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import unlimitedImg from 'src/assets/images/backgrounds/unlimited-bg.png';

export const profileOptions = [
  {
    title: 'My Account',
    subtitle: 'Manage your profile settings',
    icon: '/assets/icons/account-settings.png',
    href: '/dashboard/profile',
  },
  {
    title: 'Taxpayer List',
    subtitle: 'Access registered taxpayers',
    icon: '/assets/icons/taxpayer.png',
    href: '/dashboard/taxpayers',
  },
  {
    title: 'Audit Reports',
    subtitle: 'See compliance audits',
    icon: '/assets/icons/audit.png',
    href: '/dashboard/audits',
  },
  {
    title: 'System Preferences',
    subtitle: 'Configure system settings',
    icon: '/assets/icons/settings.png',
    href: '/dashboard/settings',
  },
];

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleOpen}
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{
          ...(Boolean(anchorEl) && {
            color: 'primary.main',
          }),
        }}
      >
        <Avatar
          src={ProfileImg}
          alt="User Profile"
          sx={{ width: 35, height: 35 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/profile/default-user.png';
          }}
        />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        keepMounted
        sx={{ '& .MuiMenu-paper': { width: '360px' } }}
      >
        <Scrollbar sx={{ maxHeight: '85vh' }}>
          <Box p={3}>
            <Typography variant="h5">User Profile</Typography>

            <Stack direction="row" py={3} spacing={2} alignItems="center">
              <Avatar src={ProfileImg} alt={user?.name || 'User'} sx={{ width: 95, height: 95 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user?.name || 'Admin User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.role || 'Admin'}
                </Typography>
                {user?.email && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <IconMail width={16} height={16} />
                    {user.email}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {profileOptions.map((option) => (
              <Box key={option.title} className="hover-text-primary" sx={{ py: 1 }}>
                <Link to={option.href}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      width={45}
                      height={45}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor="primary.light"
                    >
                      <Avatar
                        src={option.icon}
                        alt={option.title}
                        sx={{ width: 24, height: 24, borderRadius: 0 }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        noWrap
                        sx={{ width: '240px' }}
                      >
                        {option.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ width: '240px' }}
                      >
                        {option.subtitle}
                      </Typography>
                    </Box>
                  </Stack>
                </Link>
              </Box>
            ))}

            <Box mt={3}>
              <Button
                onClick={() => {
                  handleClose();
                  logout();
                }}
                variant="outlined"
                color="primary"
                fullWidth
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;
