import React, { useState, useEffect } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { PaymentDashboard } from '../../../components/apps/payment/PaymentDashboard';
import { InvoiceProvider } from 'src/context/InvoiceContext/index';
import BlankCard from 'src/components/shared/BlankCard';
import { CardContent, CircularProgress, Box, Alert, Snackbar } from '@mui/material';
import taxAssessmentService from 'src/services/taxAssessmentService';
import paymentService from 'src/services/paymentService';
import { useAuth } from 'src/context/AuthContext';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Tax Payment List',
  },
];

const Payment = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch assessments on mount
  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taxAssessmentService.getAllAssessments({
        // Get all assessments including paid ones
        pageSize: 100,
      });
      
      // Transform assessments to match PaymentDashboard format
      const transformedAssessments = (result.assessments || []).map((assessment) => {
        const status = assessment.Status || assessment.status || 'PENDING';
        const dueDate = assessment.DueDate || assessment.dueDate || assessment.CreatedAt || assessment.createdAt;
        const isOverdue = dueDate && new Date(dueDate) < new Date() && (status === 'PENDING' || status === 'PARTIALLY_PAID');
        
        // Map backend status to display status
        let displayStatus = 'Pending';
        if (status === 'PAID') {
          displayStatus = 'Paid';
        } else if (isOverdue) {
          displayStatus = 'Overdue';
        } else if (status === 'PARTIALLY_PAID') {
          displayStatus = 'Pending'; // Show as pending for partial payments
        } else {
          displayStatus = 'Pending';
        }

        return {
          id: assessment.ID || assessment.id,
          assessmentId: assessment.ID || assessment.id,
          taxpayerTin: assessment.Tin || assessment.tin || assessment.TaxpayerId || assessment.taxpayerId,
          taxpayerName: assessment.TaxpayerName || assessment.taxpayerName || 'N/A',
          region: assessment.Region || assessment.region || 'N/A',
          invoiceNo: assessment.ID || assessment.id,
          amount: assessment.TotalDue || assessment.totalDue || assessment.Amount || assessment.amount || 0,
          dueDate: dueDate,
          status: displayStatus,
          taxType: assessment.TaxType || assessment.taxType || 'N/A',
          period: assessment.Period || assessment.period || `${assessment.Year || assessment.year || new Date().getFullYear()}-Q${assessment.Quarter || assessment.quarter || 1}`,
          referenceNumber: assessment.ID || assessment.id,
          totalPaid: assessment.TotalPaid || assessment.totalPaid || 0,
          remainingBalance: assessment.RemainingBalance || assessment.remainingBalance || (assessment.TotalDue || assessment.totalDue || 0) - (assessment.TotalPaid || assessment.totalPaid || 0),
        };
      });
      
      setAssessments(transformedAssessments);
    } catch (err) {
      console.error('Error loading assessments:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async (paymentData) => {
    try {
      // paymentData should contain: assessmentId, amount, paymentMethod, paymentReference, etc.
      const result = await paymentService.recordPayment(paymentData.assessmentId, {
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod || 'BANK_TRANSFER',
        paymentDate: paymentData.paymentDate || new Date().toISOString(),
        receivedBy: user?.email || user?.username || 'system',
      });

      // Show success notification
      const receipt = result?.data?.receipt || result?.receipt;
      const receiptId = receipt?.receipt_id || 'N/A';
      setSnackbar({
        open: true,
        message: `Payment recorded successfully! Receipt: ${receiptId}`,
        severity: 'success',
      });

      // Reload assessments to reflect updated status
      await loadAssessments();
    } catch (err) {
      console.error('Error processing payment:', err);
      const errorMessage = 
        err?.response?.data?.error || 
        err?.response?.data?.message || 
        err?.message || 
        'Failed to process payment';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <PageContainer title="Tax Payment" description="this is Invoice List">
        <Breadcrumb title="Tax Payment List" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress />
            </Box>
          </CardContent>
        </BlankCard>
      </PageContainer>
    );
  }

  // Mock taxpayer data (can be enhanced to fetch from API)
  const taxpayer = {
    name: user?.name || 'System User',
    tin: user?.staffId || 'N/A',
  region: 'Dar es Salaam',
  walletAddress: '0xABC123456789DEF000',
    balance: 2500000,
};

  return (
    <InvoiceProvider>
      <PageContainer title="Tax Payment" description="this is Invoice List">
        <Breadcrumb title="Tax Payment List" items={BCrumb} />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <BlankCard>
          <CardContent>
            <PaymentDashboard 
              assessments={assessments} 
              taxpayer={taxpayer}
              onPaymentConfirm={handlePaymentConfirm}
              onRefresh={loadAssessments}
            />
          </CardContent>
        </BlankCard>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </PageContainer>
    </InvoiceProvider>
  );
};

export default Payment;
