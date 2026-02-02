import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Chip,
  Divider,
  Tabs,
  Tab,
  Paper,
  Stack,
  useTheme,
  alpha,
  Button,
} from '@mui/material';
import {
  Business,
  AccountBalance,
  Assessment,
  Timeline,
  Payment,
  Receipt,
} from '@mui/icons-material';
import TaxLifecycleFlow from '../TaxLifecycleFlow';
import InterestPenaltyDisplay from '../InterestPenaltyDisplay';
import ImmutableLedgerTimeline from '../ImmutableLedgerTimeline';

const TaxpayerAccountView = ({ taxpayer, assessments = [] }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Calculate totals
  const totalAssessments = assessments.length;
  const totalDue = assessments.reduce((sum, a) => {
    const amount = a.Amount || a.amount || 0;
    const penalties = a.Penalties || a.penalties || 0;
    const interest = a.Interest || a.interest || 0;
    return sum + amount + penalties + interest;
  }, 0);

  const paidAssessments = assessments.filter(
    (a) => (a.Status || a.status || '').toUpperCase() === 'PAID'
  ).length;

  const pendingAssessments = assessments.filter(
    (a) => (a.Status || a.status || '').toUpperCase() === 'PENDING'
  ).length;

  // Get current assessment for lifecycle display
  const currentAssessment = assessments[0] || null;
  const getCurrentStep = () => {
    if (!currentAssessment) return 0;
    const status = (currentAssessment.Status || currentAssessment.status || '').toUpperCase();
    if (status === 'PAID') return 4;
    if (currentAssessment.Penalties > 0) return 3;
    if (currentAssessment.Interest > 0) return 2;
    if (status === 'OPEN' || status === 'PENDING') return 1;
    return 0;
  };

  const tabPanels = [
    {
      label: 'Overview',
      icon: <AccountBalance />,
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" color="text.secondary">
                    Total Assessments
                  </Typography>
                  <Typography variant="h3" fontWeight={700}>
                    {totalAssessments}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label={`${paidAssessments} Paid`} color="success" size="small" />
                    <Chip label={`${pendingAssessments} Pending`} color="warning" size="small" />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" color="text.secondary">
                    Total Amount Due
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="error.main">
                    {formatCurrency(totalDue)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" color="text.secondary">
                    Compliance Status
                  </Typography>
                  <Chip
                    label={pendingAssessments > 0 ? 'Non-Compliant' : 'Compliant'}
                    color={pendingAssessments > 0 ? 'error' : 'success'}
                    sx={{ fontSize: '1rem', py: 2 }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Lifecycle',
      icon: <Timeline />,
      content: (
        <Box>
          <TaxLifecycleFlow assessment={currentAssessment} currentStep={getCurrentStep()} />
        </Box>
      ),
    },
    {
      label: 'Interest & Penalties',
      icon: <Payment />,
      content: (
        <Box>
          {currentAssessment ? (
            <InterestPenaltyDisplay assessment={currentAssessment} showBreakdown={true} />
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No active assessment found
              </Typography>
            </Paper>
          )}
        </Box>
      ),
    },
    {
      label: 'Ledger Timeline',
      icon: <Receipt />,
      content: (
        <Box>
          <ImmutableLedgerTimeline
            ledgerEntries={assessments.map((a) => ({
              id: a.ID || a.id,
              type: 'ASSESSMENT_CREATED',
              timestamp: a.CreatedAt || a.createdAt || new Date().toISOString(),
              description: `Assessment ${a.ID || a.id} - ${a.TaxType || a.taxType}`,
              amount: a.Amount || a.amount || 0,
              status: 'CONFIRMED',
              blockNumber: Math.floor(Math.random() * 100000) + 10000,
              txHash: `0x${Math.random().toString(16).substr(2, 40)}`,
            }))}
          />
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Taxpayer Header */}
      <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <CardContent>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                fontSize: '2rem',
              }}
            >
              <Business />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {taxpayer?.Name || taxpayer?.name || 'Taxpayer Account'}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Chip
                  label={`TIN: ${taxpayer?.TIN || taxpayer?.tin || 'N/A'}`}
                  variant="outlined"
                />
                <Chip
                  label={`Type: ${taxpayer?.Type || taxpayer?.type || 'N/A'}`}
                  variant="outlined"
                />
                <Chip
                  label={`Status: ${taxpayer?.Status || taxpayer?.status || 'Active'}`}
                  color="success"
                  variant="outlined"
                />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabPanels.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{ minHeight: 72 }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>{tabPanels[activeTab].content}</Box>
    </Box>
  );
};

export default TaxpayerAccountView;

