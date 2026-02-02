import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, useTheme } from '@mui/material';
import VerificationForm from 'src/components/verification-portal/VerificationForm';
import VerificationDashboard from './VerificationDashboard';
import { storeSessionToken, getSessionToken } from 'src/utils/verification/security';
import { mockAssessmentData } from 'src/components/verification-portal/testData';

const VerificationPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [verificationResult, setVerificationResult] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  // Load dashboard by default with mock data
  useEffect(() => {
    // Check if there's a stored session token
    const storedToken = getSessionToken();
    if (storedToken) {
      // If session exists, load dashboard with mock data
      const mockResult = {
        sessionToken: storedToken,
        assessment: mockAssessmentData.assessment,
        auditTrail: mockAssessmentData.auditTrail,
        payments: mockAssessmentData.payments,
        blockchain: mockAssessmentData.blockchain,
      };
      setVerificationResult(mockResult);
      setSessionToken(storedToken);
    } else {
      // No session, but still show dashboard by default with mock data
      const mockResult = {
        sessionToken: `session_${Date.now()}`,
        assessment: mockAssessmentData.assessment,
        auditTrail: mockAssessmentData.auditTrail,
        payments: mockAssessmentData.payments,
        blockchain: mockAssessmentData.blockchain,
      };
      const token = mockResult.sessionToken;
      storeSessionToken(token, mockResult.assessment?.id || mockResult.assessment?.ID);
      setVerificationResult(mockResult);
      setSessionToken(token);
    }
  }, []);

  const handleVerificationSuccess = (result) => {
    // Store session token
    const token = result.sessionToken || `session_${Date.now()}`;
    storeSessionToken(token, result.assessment?.id || result.assessment?.ID);
    setSessionToken(token);
    setVerificationResult(result);
  };

  // Always show dashboard by default
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {verificationResult ? (
        <VerificationDashboard
          sessionToken={sessionToken}
          assessmentData={verificationResult}
        />
      ) : (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <VerificationForm onVerificationSuccess={handleVerificationSuccess} />
        </Container>
      )}
    </Box>
  );
};

export default VerificationPage;

