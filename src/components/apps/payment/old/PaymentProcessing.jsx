// PaymentProcessing.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Payment,
  History,
  Receipt,
  PendingActions,
  AttachMoney,
  CalendarMonth,
  Warning,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key');

const PaymentProcessing = ({ assessments }) => {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const foundAssessment = assessments.find((a) => a.id === assessmentId);
    setAssessment(foundAssessment);
  }, [assessmentId, assessments]);

  const handlePaymentSubmit = async () => {
    setProcessing(true);

    try {
      // Process payment based on method
      const paymentResult = await processPayment({
        assessmentId,
        amount: assessment.amount,
        method: paymentMethod,
        // other payment details
      });

      // Record in blockchain
      const blockchainTx = await blockchainService.recordPayment({
        assessmentId,
        amount: assessment.amount,
        paymentMethod,
        receiptNumber: paymentResult.receiptNumber,
      });

      // Update assessment status
      await updateAssessmentStatus(assessmentId, 'Completed', blockchainTx.txId);

      // Generate receipt
      const receiptData = generateReceipt(assessment, paymentResult, blockchainTx);
      setReceipt(receiptData);
      setSuccess(true);
    } catch (error) {
      console.error('Payment failed:', error);
      // Show error
    } finally {
      setProcessing(false);
    }
  };

  if (!assessment) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Process Payment
      </Typography>

      <Grid container spacing={3}>
        {/* Assessment Summary */}
        <Grid item xs={12} md={5}>
          <AssessmentSummaryCard assessment={assessment} />
        </Grid>

        {/* Payment Form */}
        <Grid item xs={12} md={7}>
          {success ? (
            <PaymentSuccess receipt={receipt} />
          ) : (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={assessment.amount}
                  paymentMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  onSubmit={handlePaymentSubmit}
                  processing={processing}
                />
              </Elements>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
