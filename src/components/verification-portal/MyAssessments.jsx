import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import {
  Assessment,
  Visibility,
  Download,
  Payment,
  Schedule,
  CheckCircle,
  Warning,
  ArrowForward,
} from '@mui/icons-material';
import { formatCurrency, formatDate } from 'src/utils/verification/formatters';
import { formatCurrency as formatCurrencyUtil } from 'src/utils/formatters';

const MyAssessments = ({ tin, sessionToken }) => {
  const theme = useTheme();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch assessments from API
    // For now, use mock data
    setAssessments([
      {
        id: 'ASSESS-2025-1763533388302-2027',
        amount: 7800000,
        totalDue: 7800000,
        status: 'PENDING',
        dueDate: '2025-11-21T00:00:00.000Z',
        taxType: 'INDIVIDUAL_INCOME_TAX',
        period: '2025-Q2',
        createdAt: '2025-11-19T06:23:08.302Z',
      },
      {
        id: 'ASSESS-2025-1763505147280-1926',
        amount: 5000000,
        totalDue: 5500000,
        status: 'OVERDUE',
        dueDate: '2025-10-15T00:00:00.000Z',
        taxType: 'VAT',
        period: '2025-Q1',
        createdAt: '2025-10-01T10:00:00.000Z',
        interest: 300000,
        penalties: 200000,
      },
    ]);
    setLoading(false);
  }, [tin]);

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: { color: 'warning', icon: <Schedule />, label: 'Pending' },
      PAID: { color: 'success', icon: <CheckCircle />, label: 'Paid' },
      OVERDUE: { color: 'error', icon: <Warning />, label: 'Overdue' },
      APPROVED: { color: 'info', icon: <CheckCircle />, label: 'Approved' },
    };
    return configs[status] || configs.PENDING;
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                My Assessments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View all your tax assessments and their current status
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowForward />}
              onClick={() => {
                // TODO: Navigate to full assessments page
                console.log('View all assessments');
              }}
            >
              View All
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Loading assessments...
              </Typography>
            </Box>
          ) : assessments.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Assessment ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tax Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total Due</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessments.map((assessment) => {
                    const statusConfig = getStatusConfig(assessment.status);
                    return (
                      <TableRow key={assessment.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {assessment.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{assessment.taxType}</TableCell>
                        <TableCell>{assessment.period}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {formatCurrencyUtil(assessment.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color="primary.main">
                            {formatCurrencyUtil(assessment.totalDue)}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(assessment.dueDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                            icon={statusConfig.icon}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton size="small">
                                <Download fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {assessment.status !== 'PAID' && (
                              <Tooltip title="Make Payment">
                                <IconButton size="small" color="primary">
                                  <Payment fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Assessment sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No assessments found
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MyAssessments;

