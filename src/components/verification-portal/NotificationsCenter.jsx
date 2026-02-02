import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  useTheme,
  alpha,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
} from '@mui/material';
import {
  Notifications,
  Assessment,
  Payment,
  Warning,
  CheckCircle,
  Info,
  Close,
  MarkEmailRead,
} from '@mui/icons-material';
import { formatDate, formatRelativeTime } from 'src/utils/verification/formatters';

const NotificationsCenter = ({ notifications = [] }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [readNotifications, setReadNotifications] = useState(new Set());

  const notificationTypes = ['all', 'assessments', 'payments', 'alerts', 'disputes'];
  const filteredNotifications = activeTab === 0
    ? notifications
    : notifications.filter((n) => n.type === notificationTypes[activeTab]);

  const unreadCount = notifications.filter((n) => !readNotifications.has(n.id)).length;

  const getNotificationIcon = (type) => {
    const iconMap = {
      assessment: <Assessment />,
      payment: <Payment />,
      alert: <Warning />,
      dispute: <Info />,
      system: <Info />,
    };
    return iconMap[type] || <Info />;
  };

  const getNotificationColor = (severity) => {
    const colorMap = {
      info: 'info',
      warning: 'warning',
      error: 'error',
      success: 'success',
    };
    return colorMap[severity] || 'info';
  };

  const handleMarkAsRead = (id) => {
    setReadNotifications((prev) => new Set([...prev, id]));
  };

  const handleMarkAllAsRead = () => {
    setReadNotifications(new Set(notifications.map((n) => n.id)));
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications color="primary" />
                </Badge>
                <Typography variant="h6" fontWeight={700}>
                  Notifications Center
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Stay updated with your tax assessments, payments, and system alerts
              </Typography>
            </Box>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<MarkEmailRead />}
                onClick={handleMarkAllAsRead}
                variant="outlined"
              >
                Mark All as Read
              </Button>
            )}
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab
                label={
                  <Badge badgeContent={notifications.length} color="primary">
                    All
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge
                    badgeContent={notifications.filter((n) => n.type === 'assessment').length}
                    color="primary"
                  >
                    Assessments
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge
                    badgeContent={notifications.filter((n) => n.type === 'payment').length}
                    color="primary"
                  >
                    Payments
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge
                    badgeContent={notifications.filter((n) => n.type === 'alert').length}
                    color="error"
                  >
                    Alerts
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge
                    badgeContent={notifications.filter((n) => n.type === 'dispute').length}
                    color="primary"
                  >
                    Disputes
                  </Badge>
                }
              />
            </Tabs>
          </Box>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <List>
              {filteredNotifications.map((notification, index) => {
                const isRead = readNotifications.has(notification.id);
                return (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        bgcolor: isRead
                          ? 'transparent'
                          : alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: alpha(
                              theme.palette[getNotificationColor(notification.severity)]?.main ||
                                theme.palette.primary.main,
                              0.1
                            ),
                            color: `${getNotificationColor(notification.severity)}.main`,
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Typography variant="subtitle2" fontWeight={isRead ? 400 : 600}>
                              {notification.title}
                            </Typography>
                            {!isRead && (
                              <Chip label="New" size="small" color="error" sx={{ height: 20 }} />
                            )}
                            <Chip
                              label={notification.type}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20 }}
                            />
                          </Stack>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              {formatRelativeTime(notification.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Stack direction="row" spacing={1}>
                          {!isRead && (
                            <IconButton
                              size="small"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <MarkEmailRead fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredNotifications.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Notifications sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You're all caught up! No new notifications.
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NotificationsCenter;

