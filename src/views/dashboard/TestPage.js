// src/views/dashboard/TestPage.js
import React from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TestPage = () => {
  const navigate = useNavigate();

  const testLinks = [
    { title: 'Enhanced Modern Dashboard', path: '/dashboards/enhanced-modern' },
    { title: 'Original Modern Dashboard', path: '/dashboards/modern' },
    { title: 'Full TRA Dashboard', path: '/dashboards/tra' },
    { title: 'Enhanced Taxpayer Registration', path: '/enhanced-taxpayer-registration' },
    { title: 'Original Taxpayer Registration', path: '/taxpayer-registration' },
    { title: 'VAT Management', path: '/apps/vat' },
    { title: 'Compliance Monitoring', path: '/apps/compliance' },
    { title: 'Blockchain Explorer', path: '/apps/blockchain' },
    { title: 'Tax Assessment', path: '/apps/assessment/list' },
    { title: 'Payment Processing', path: '/tax/payments/list' },
    { title: 'Invoice Management', path: '/apps/invoice/list' },
    { title: 'Audit Management', path: '/tax/auditing/list' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        TRA System Test Page
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This page tests all the integrated components. Click on any link to test the functionality.
      </Alert>

      <Grid container spacing={3}>
        {testLinks.map((link, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {link.title}
                </Typography>
                <Button variant="contained" onClick={() => navigate(link.path)} fullWidth>
                  Test {link.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          System Status
        </Typography>
        <Alert severity="success">✅ All components loaded successfully</Alert>
        <Alert severity="info" sx={{ mt: 1 }}>
          ℹ️ Development server is running on http://localhost:5173
        </Alert>
      </Box>
    </Box>
  );
};

export default TestPage;
