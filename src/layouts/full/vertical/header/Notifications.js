import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { Stack } from '@mui/system';
import { IconBellRinging } from '@tabler/icons';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);

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
        aria-label="View notifications"
        color="inherit"
        aria-controls="notification-menu"
        aria-haspopup="true"
        sx={{ ...(anchorEl && { color: 'primary.main' }) }}
        onClick={handleOpen}
      >
        <Badge variant="dot" color="primary">
          <IconBellRinging size="21" stroke="1.5" />
        </Badge>
      </IconButton>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        keepMounted
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
          },
        }}
      >
        <Stack direction="row" py={2} px={4} justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Notifications</Typography>
          <Chip label={`${notifications.length} new`} color="primary" size="small" />
        </Stack>

        <Scrollbar sx={{ height: '385px' }}>
          {notifications.map((notif, index) => (
            <MenuItem key={index} sx={{ py: 2, px: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={notif.avatar}
                  alt={notif.title}
                  sx={{ width: 48, height: 48 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/users/default.png';
                  }}
                />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    fontWeight={600}
                    noWrap
                    sx={{ width: '240px' }}
                  >
                    {notif.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ width: '240px' }} noWrap>
                    {notif.subtitle}
                  </Typography>
                </Box>
              </Stack>
            </MenuItem>
          ))}
        </Scrollbar>

        <Box px={3} pb={2}>
          <Button
            component={Link}
            to="/dashboard/notifications"
            variant="outlined"
            color="primary"
            fullWidth
          >
            See all notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Notifications;

export const notifications = [
  {
    title: 'New Taxpayer Registered',
    subtitle: 'TIN 823456789 added to SmartTax ledger',
    avatar: '/assets/images/users/new-taxpayer.png',
  },
  {
    title: 'EFD Transaction Recorded',
    subtitle: 'Retail sale logged for TZS 1,200,000 at Shop#432',
    avatar: '/assets/images/users/efd.png',
  },
  {
    title: 'VAT Invoice Audited',
    subtitle: 'INV-234567 flagged for compliance check',
    avatar: '/assets/images/users/audit.png',
  },
  {
    title: 'Blockchain Block Synced',
    subtitle: 'Block #345 contains 25 verified tax entries',
    avatar: '/assets/images/users/blockchain.png',
  },
  {
    title: 'Digital Payment Logged',
    subtitle: 'TZS 300,000 received from taxpayer ID 982174',
    avatar: '/assets/images/users/payment.png',
  },
];
