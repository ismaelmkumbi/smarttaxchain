import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  useTheme,
  alpha,
  Button,
} from '@mui/material';
import {
  Assessment,
  AccountBalance,
  Schedule,
  Warning,
  AccountBalanceWallet,
  Timeline,
} from '@mui/icons-material';

const steps = [
  {
    label: 'Assessment Created',
    icon: <Assessment />,
    description: 'Tax assessment is created and assigned to taxpayer',
    color: 'primary',
  },
  {
    label: 'Payment Due',
    icon: <AccountBalance />,
    description: 'Taxpayer receives notification of payment due date',
    color: 'info',
  },
  {
    label: 'Payment Late',
    icon: <Schedule />,
    description: 'Interest begins accruing on overdue amount',
    color: 'warning',
  },
  {
    label: 'Non-compliance',
    icon: <Warning />,
    description: 'Penalties are applied for late payment',
    color: 'error',
  },
  {
    label: 'Ledger Entry',
    icon: <Timeline />,
    description: 'All transactions recorded on immutable blockchain ledger',
    color: 'success',
  },
];

const TaxLifecycleFlow = ({ assessment, currentStep = 0 }) => {
  const theme = useTheme();

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Tax Assessment Lifecycle
      </Typography>

      <Stepper activeStep={currentStep} orientation="vertical">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isActive = status === 'active';
          const isCompleted = status === 'completed';

          return (
            <Step key={step.label} completed={isCompleted} active={isActive}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isCompleted
                        ? theme.palette.success.main
                        : isActive
                        ? theme.palette[step.color].main
                        : alpha(theme.palette.grey[500], 0.2),
                      color: isCompleted || isActive ? 'white' : theme.palette.grey[600],
                      border: `2px solid ${
                        isActive
                          ? theme.palette[step.color].main
                          : isCompleted
                          ? theme.palette.success.main
                          : 'transparent'
                      }`,
                    }}
                  >
                    {step.icon}
                  </Box>
                )}
              >
                <Typography variant="h6" fontWeight={isActive ? 700 : 500}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Card
                  sx={{
                    mt: 1,
                    mb: 2,
                    bgcolor: isActive
                      ? alpha(theme.palette[step.color].main, 0.1)
                      : 'transparent',
                    border: isActive
                      ? `2px solid ${theme.palette[step.color].main}`
                      : '1px solid',
                    borderColor: isActive
                      ? theme.palette[step.color].main
                      : theme.palette.divider,
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                    {isActive && assessment && (
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={`Current Status: ${assessment.status || 'Active'}`}
                          color={step.color}
                          size="small"
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Paper>
  );
};

export default TaxLifecycleFlow;

