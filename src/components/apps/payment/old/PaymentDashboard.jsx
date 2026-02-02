import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Tabs, Tab, Divider, Chip, Tooltip } from '@mui/material';
import {
  Payment,
  History,
  Receipt,
  PendingActions,
  CalendarMonth,
  Warning,
  AccountBalanceWallet,
} from '@mui/icons-material';

import { PendingPaymentsTable } from './PendingPaymentsTable';
import { PaymentHistoryPage } from './PaymentHistoryPage';
import { ScheduledPaymentsPage } from './ScheduledPaymentsPage';
import { TaxpayerSearch } from './TaxpayerSearch';
import { SummaryCard } from './SummaryCard';
import { PaymentFormModal } from './PaymentFormModal';

export const PaymentDashboard = ({ assessments, taxpayer }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const pendingPayments = assessments.filter((a) => a.status === 'Pending');
  const completedPayments = assessments.filter((a) => a.status === 'Completed');
  const overduePayments = assessments.filter(
    (a) => ['Pending', 'Overdue'].includes(a.status) && new Date(a.dueDate) < new Date(),
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(amount);

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat('en-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));

  const handlePay = (assessment) => {
    setSelectedAssessment(assessment);
    setModalOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <AccountBalanceWallet sx={{ verticalAlign: 'middle', mr: 1 }} />
        TRA Blockchain Tax Portal
      </Typography>

      {/* Taxpayer Info */}
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6">{taxpayer.name}</Typography>
        <Typography variant="body2">TIN: {taxpayer.tin}</Typography>
        <Typography variant="body2">Region: {taxpayer.region}</Typography>
        <Tooltip title="Blockchain Wallet Address">
          <Chip
            label={taxpayer.walletAddress}
            size="small"
            sx={{ mt: 1, fontFamily: 'monospace' }}
          />
        </Tooltip>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <SummaryCard
          title="Pending Payments"
          value={pendingPayments.length}
          total={formatCurrency(pendingPayments.reduce((sum, a) => sum + a.amount, 0))}
          icon={<PendingActions />}
          color="warning"
        />
        <SummaryCard
          title="Overdue Payments"
          value={overduePayments.length}
          total={formatCurrency(overduePayments.reduce((sum, a) => sum + a.amount, 0))}
          icon={<Warning />}
          color="error"
        />
        <SummaryCard
          title="Paid This Year"
          value={completedPayments.length}
          total={formatCurrency(completedPayments.reduce((sum, a) => sum + a.amount, 0))}
          icon={<Receipt />}
          color="success"
        />
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab icon={<PendingActions />} label="Pending Payments" />
          <Tab icon={<History />} label="Payment History" />
          <Tab icon={<CalendarMonth />} label="Scheduled Payments" />
        </Tabs>
        <Divider />
        <Box sx={{ p: 2 }}>
          {tabValue === 0 && (
            <PendingPaymentsTable
              payments={pendingPayments}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onPay={handlePay}
            />
          )}
          {tabValue === 1 && (
            <PaymentHistoryPage
              payments={completedPayments}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
          {tabValue === 2 && <ScheduledPaymentsPage />}
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<Payment />} onClick={() => alert('Bulk pay')}>
          Initiate Bulk Payment
        </Button>
        <Button variant="outlined" startIcon={<Receipt />}>
          View Receipts
        </Button>
        <Button variant="outlined" startIcon={<AccountBalanceWallet />}>
          Manage Wallet
        </Button>
      </Box>

      {/* Modal for Payment */}
      <PaymentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        assessment={selectedAssessment}
        taxpayer={taxpayer}
        formatCurrency={formatCurrency}
      />
    </Box>
  );
};
