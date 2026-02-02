import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Assessment,
  Payment,
  Receipt,
  Download,
  Gavel,
  History,
  Verified,
} from '@mui/icons-material';

const QuickActions = ({ onActionClick }) => {
  const theme = useTheme();

  const actions = [
    {
      label: 'Verify Assessment',
      icon: <Assessment />,
      color: 'primary',
      description: 'Verify assessment status and details',
      onClick: () => onActionClick?.('verify-assessment'),
    },
    {
      label: 'Verify Payment',
      icon: <Payment />,
      color: 'success',
      description: 'Verify payment receipt and status',
      onClick: () => onActionClick?.('verify-payment'),
    },
    {
      label: 'View Receipts',
      icon: <Receipt />,
      color: 'info',
      description: 'Download payment receipts',
      onClick: () => onActionClick?.('view-receipts'),
    },
    {
      label: 'Raise Dispute',
      icon: <Gavel />,
      color: 'warning',
      description: 'File a dispute or appeal',
      onClick: () => onActionClick?.('raise-dispute'),
    },
    {
      label: 'View History',
      icon: <History />,
      color: 'secondary',
      description: 'View complete tax history',
      onClick: () => onActionClick?.('view-history'),
    },
    {
      label: 'Download Reports',
      icon: <Download />,
      color: 'primary',
      description: 'Download compliance reports',
      onClick: () => onActionClick?.('download-reports'),
    },
  ];

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={action.icon}
                onClick={action.onClick}
                sx={{
                  height: 80,
                  flexDirection: 'column',
                  gap: 1,
                  border: `2px solid ${alpha(theme.palette[action.color].main, 0.3)}`,
                  '&:hover': {
                    border: `2px solid ${theme.palette[action.color].main}`,
                    bgcolor: alpha(theme.palette[action.color].main, 0.05),
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {action.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'none' }}>
                  {action.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;

