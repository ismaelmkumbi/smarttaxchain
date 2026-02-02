import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Dashboard,
  Assessment,
  Payment,
  Analytics,
  Gavel,
  Notifications,
  Security,
  ArrowBack,
  VerifiedUser,
} from '@mui/icons-material';
import DashboardOverview from 'src/components/verification-portal/DashboardOverview';
import EnhancedAssessmentVerification from 'src/components/verification-portal/EnhancedAssessmentVerification';
import PaymentVerificationSection from 'src/components/verification-portal/PaymentVerificationSection';
import TaxInsightsAnalytics from 'src/components/verification-portal/TaxInsightsAnalytics';
import DisputeAppealModule from 'src/components/verification-portal/DisputeAppealModule';
import NotificationsCenter from 'src/components/verification-portal/NotificationsCenter';
import PrivacySecurityControls from 'src/components/verification-portal/PrivacySecurityControls';
import CertificateVerification from 'src/components/verification-portal/CertificateVerification';
import { formatCurrency } from 'src/utils/verification/formatters';

const VerificationDashboard = ({ sessionToken, assessmentData }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [privacySettings, setPrivacySettings] = useState({
    maskOfficerNames: true,
    hideOtherTaxpayers: true,
    showTechnicalDetails: false,
    enableNotifications: true,
  });

  // Calculate dashboard data from assessment data
  const calculateDashboardData = () => {
    const assessments = assessmentData?.assessments || [];
    const payments = assessmentData?.payments || [];
    
    const totalTaxesPaid = payments.reduce((sum, p) => sum + (p.amount || p.Amount || 0), 0);
    const pendingAssessments = assessments.filter(a => 
      (a.status || a.Status) === 'PENDING' || (a.status || a.Status) === 'OPEN'
    ).length;
    const overdueAssessments = assessments.filter(a => 
      (a.status || a.Status) === 'OVERDUE'
    ).length;
    const verifiedPayments = payments.filter(p => 
      (p.status || p.Status) === 'CONFIRMED' || (p.status || p.Status) === 'PAID'
    ).length;

    // Generate alerts from recent activities
    const alerts = [];
    const recentActivities = [];

    // Check for new assessments
    assessments.forEach(assessment => {
      const createdDate = new Date(assessment.createdAt || assessment.CreatedAt);
      const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceCreation <= 7) {
        alerts.push({
          type: 'Assessment',
          severity: 'info',
          title: 'New Assessment Created',
          message: `New assessment ${assessment.id || assessment.ID} for ${assessment.period || assessment.Period || 'N/A'}. Amount: ${formatCurrency(assessment.amount || assessment.Amount || 0)}`,
          timestamp: assessment.createdAt || assessment.CreatedAt,
        });
        
        recentActivities.push({
          action: 'New Assessment Created',
          description: `Assessment ${assessment.id || assessment.ID} - ${formatCurrency(assessment.amount || assessment.Amount || 0)}`,
          timestamp: assessment.createdAt || assessment.CreatedAt,
          icon: <Assessment />,
        });
      }

      // Check for overdue assessments
      if ((assessment.status || assessment.Status) === 'OVERDUE') {
        alerts.push({
          type: 'Alert',
          severity: 'error',
          title: 'Overdue Assessment',
          message: `Assessment ${assessment.id || assessment.ID} is overdue. Please make payment immediately.`,
          timestamp: assessment.dueDate || assessment.DueDate,
        });
      }
    });

    // Check for new payments
    payments.forEach(payment => {
      const paymentDate = new Date(payment.paymentDate || payment.PaymentDate || payment.timestamp);
      const daysSincePayment = (Date.now() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSincePayment <= 7) {
        alerts.push({
          type: 'Payment',
          severity: 'success',
          title: 'New Payment Received',
          message: `Payment of ${formatCurrency(payment.amount || payment.Amount || 0)} has been confirmed and recorded`,
          timestamp: payment.paymentDate || payment.PaymentDate || payment.timestamp,
        });
        
        recentActivities.push({
          action: 'Payment Received',
          description: `Payment of ${formatCurrency(payment.amount || payment.Amount || 0)} confirmed`,
          timestamp: payment.paymentDate || payment.PaymentDate || payment.timestamp,
          icon: <Payment />,
        });
      }
    });

    // Sort by timestamp (newest first)
    alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    recentActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      totalTaxesPaid,
      pendingAssessments,
      overdueAssessments,
      verifiedPayments,
      totalAssessments: assessments.length,
      totalPayments: payments.length,
      complianceScore: 92, // TODO: Calculate from actual data
      alerts: alerts.slice(0, 5), // Show latest 5
      recentActivities: recentActivities.slice(0, 5), // Show latest 5
    };
  };

  const dashboardData = calculateDashboardData();

  // Generate notifications from dashboard data
  const notifications = [
    ...dashboardData.alerts.map((alert, index) => ({
      id: `alert-${index}`,
      type: alert.type.toLowerCase(),
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      timestamp: alert.timestamp,
    })),
    {
      id: 'compliance-reminder',
      type: 'system',
      severity: 'info',
      title: 'Compliance Reminder',
      message: `Your compliance score is ${dashboardData.complianceScore}%. Keep up the good work!`,
      timestamp: new Date().toISOString(),
    },
  ];

  const handleViewAuditTrail = (assessmentId) => {
    // Navigate to audit trail view
    console.log('View audit trail for:', assessmentId);
  };

  const handleActionClick = (action) => {
    switch (action) {
      case 'verify-assessment':
        setActiveTab(1);
        break;
      case 'verify-payment':
        setActiveTab(2);
        break;
      case 'raise-dispute':
        setActiveTab(4);
        break;
      case 'view-history':
        // TODO: Navigate to history view
        console.log('View history');
        break;
      case 'view-receipts':
        // TODO: Show receipts
        console.log('View receipts');
        break;
      case 'download-reports':
        // TODO: Download reports
        console.log('Download reports');
        break;
      default:
        break;
    }
  };

  const tabs = [
    {
      label: 'Dashboard',
      icon: <Dashboard />,
      component: (
        <DashboardOverview
          dashboardData={dashboardData}
          tin={assessmentData?.assessment?.tin || assessmentData?.assessment?.TIN}
          sessionToken={sessionToken}
          onActionClick={handleActionClick}
        />
      ),
    },
    {
      label: 'Assessment Verification',
      icon: <Assessment />,
      component: (
        <EnhancedAssessmentVerification
          onViewAuditTrail={handleViewAuditTrail}
          onVerify={(data) => console.log('Verify:', data)}
        />
      ),
    },
    {
      label: 'Payment Verification',
      icon: <Payment />,
      component: <PaymentVerificationSection />,
    },
    {
      label: 'Certificate Verification',
      icon: <VerifiedUser />,
      component: <CertificateVerification />,
    },
    {
      label: 'Tax Insights',
      icon: <Analytics />,
      component: <TaxInsightsAnalytics />,
    },
    {
      label: 'Disputes',
      icon: <Gavel />,
      component: <DisputeAppealModule />,
    },
    {
      label: 'Notifications',
      icon: <Notifications />,
      component: <NotificationsCenter notifications={notifications} />,
    },
    {
      label: 'Privacy & Security',
      icon: <Security />,
      component: (
        <PrivacySecurityControls
          settings={privacySettings}
          onSettingsChange={setPrivacySettings}
        />
      ),
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sticky Header */}
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => navigate('/verify')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            Taxpayer Verification Portal
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="Verified" color="success" size="small" icon={<Security />} />
            <Chip label="Secure Session" color="info" size="small" />
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Tabs Navigation */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 4,
            position: 'sticky',
            top: 64,
            bgcolor: 'background.paper',
            zIndex: 10,
            pb: 1,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ mt: 3 }}>{tabs[activeTab].component}</Box>
      </Container>
    </Box>
  );
};

export default VerificationDashboard;

