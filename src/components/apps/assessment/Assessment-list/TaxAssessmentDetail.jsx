import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Avatar,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack,
  MonetizationOn,
  Receipt,
  CalendarToday,
  Business,
  Person,
  Warning,
  Phone,
  Email,
  LocationOn,
  CheckCircle,
  Pending,
} from '@mui/icons-material';

const mockAssessmentDetails = {
  1: {
    id: '1',
    name: 'John Smith',
    tin: '145288-TZ',
    type: 'Individual',
    sector: 'Agriculture',
    region: 'Arusha',
    assessments: [
      {
        id: 'A1001',
        period: 'Q1 2024',
        date: '2024-03-15',
        amount: 450000,
        status: 'Pending',
        taxType: 'Income Tax',
        details: 'Quarterly income tax assessment',
      },
      {
        id: 'A1002',
        period: 'Q4 2023',
        date: '2023-12-10',
        amount: 800000,
        status: 'Paid',
        taxType: 'Income Tax',
        details: 'Year-end adjustment',
      },
    ],
    contact: {
      phone: '+255 789 456 123',
      email: 'john.smith@example.com',
      address: '123 Farm Road, Arusha',
    },
    complianceRating: 'Medium Risk',
    lastAudit: '2023-11-15',
  },
  2: {
    id: '2',
    name: 'Jane Co. Ltd',
    tin: '738820-TZ',
    type: 'Business',
    sector: 'Retail',
    region: 'Dar es Salaam',
    assessments: [
      {
        id: 'A2001',
        period: 'Jan 2024',
        date: '2024-02-28',
        amount: 1200000,
        status: 'Paid',
        taxType: 'VAT',
        details: 'Monthly VAT return',
      },
    ],
    contact: {
      phone: '+255 712 345 678',
      email: 'accounts@janeco.tz',
      address: '456 Business Street, Dar es Salaam',
    },
    complianceRating: 'Low Risk',
    lastAudit: '2024-01-20',
  },
  3: {
    id: '3',
    name: 'Green Energy NGO',
    tin: '992165-TZ',
    type: 'NGO',
    sector: 'Energy',
    region: 'Mwanza',
    assessments: [
      {
        id: 'A3001',
        period: 'FY 2023',
        date: '2024-04-01',
        amount: 750000,
        status: 'In Progress',
        taxType: 'Withholding Tax',
        details: 'Annual withholding tax on donations',
      },
    ],
    contact: {
      phone: '+255 765 432 100',
      email: 'finance@greenenergy.tz',
      address: '789 Solar Avenue, Mwanza',
    },
    complianceRating: 'High Risk',
    lastAudit: '2022-09-10',
  },
  4: {
    id: '4',
    name: 'City Water Authority',
    tin: '441203-TZ',
    type: 'Gov Agency',
    sector: 'Utilities',
    region: 'Dodoma',
    assessments: [
      {
        id: 'A4001',
        period: 'Q1 2024',
        date: '2024-01-10',
        amount: 0,
        status: 'Completed',
        taxType: 'Exempt',
        details: 'Government entity - tax exempt',
      },
    ],
    contact: {
      phone: '+255 262 111 222',
      email: 'water@dodoma.gov.tz',
      address: '101 Government Circle, Dodoma',
    },
    complianceRating: 'Low Risk',
    lastAudit: '2024-02-05',
  },
  5: {
    id: '5',
    name: 'Sara Johnson',
    tin: '667234-TZ',
    type: 'Individual',
    sector: 'Professional Services',
    region: 'Arusha',
    assessments: [
      {
        id: 'A5001',
        period: 'March 2024',
        date: '2024-03-28',
        amount: 890000,
        status: 'Pending',
        taxType: 'Professional Tax',
        details: 'Consulting services tax',
      },
    ],
    contact: {
      phone: '+255 787 878 787',
      email: 'sara@consultant.tz',
      address: '234 Consultant Lane, Arusha',
    },
    complianceRating: 'Medium Risk',
    lastAudit: '2023-08-15',
  },
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Paid':
      return <CheckCircle color="success" />;
    case 'Pending':
      return <Pending color="error" />;
    case 'In Progress':
      return <Pending color="warning" />;
    default:
      return <CheckCircle />;
  }
};

export default function TaxAssessmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const taxpayer = mockAssessmentDetails[id];

  if (!taxpayer) {
    return (
      <Box p={4}>
        <Typography variant="h5">Taxpayer not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Box>
    );
  }

  const unpaidAssessments = taxpayer.assessments.filter((a) => a.status === 'Pending');
  const totalDue = unpaidAssessments.reduce((sum, a) => sum + a.amount, 0);

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back to List
      </Button>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor:
                      taxpayer.type === 'Business'
                        ? 'info.main'
                        : taxpayer.type === 'NGO'
                        ? 'warning.main'
                        : taxpayer.type === 'Gov Agency'
                        ? 'success.main'
                        : 'primary.main',
                    mr: 2,
                    width: 56,
                    height: 56,
                  }}
                >
                  {taxpayer.type === 'Business' ? (
                    <Business fontSize="large" />
                  ) : taxpayer.type === 'NGO' || taxpayer.type === 'Gov Agency' ? (
                    <Domain fontSize="large" />
                  ) : (
                    <Person fontSize="large" />
                  )}
                </Avatar>
                <Box>
                  <Typography variant="h4">{taxpayer.name}</Typography>
                  <Typography color="text.secondary">TIN: {taxpayer.tin}</Typography>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Taxpayer Type:
                  </Typography>
                  <Typography variant="body1">{taxpayer.type}</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Sector:
                  </Typography>
                  <Typography variant="body1">{taxpayer.sector}</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Region:
                  </Typography>
                  <Typography variant="body1">{taxpayer.region}</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Compliance:
                  </Typography>
                  <Chip
                    label={taxpayer.complianceRating}
                    size="small"
                    color={
                      taxpayer.complianceRating === 'Low Risk'
                        ? 'success'
                        : taxpayer.complianceRating === 'Medium Risk'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Last Audit:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(taxpayer.lastAudit).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="action" />
                  </ListItemIcon>
                  <ListItemText primary={taxpayer.contact.phone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email color="action" />
                  </ListItemIcon>
                  <ListItemText primary={taxpayer.contact.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn color="action" />
                  </ListItemIcon>
                  <ListItemText primary={taxpayer.contact.address} />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Financial Summary
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <Receipt color="primary" sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2">Total Assessments</Typography>
                          <Typography variant="h5">{taxpayer.assessments.length}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <MonetizationOn color={totalDue > 0 ? 'error' : 'success'} sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body2">Total Due</Typography>
                          <Typography variant="h5" color={totalDue > 0 ? 'error' : 'textPrimary'}>
                            TZS {totalDue.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List dense>
                {taxpayer.assessments.slice(0, 3).map((assessment) => (
                  <ListItem key={assessment.id}>
                    <ListItemIcon>
                      <StatusIcon status={assessment.status} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${assessment.taxType} - ${assessment.period}`}
                      secondary={`${new Date(
                        assessment.date,
                      ).toLocaleDateString()} • TZS ${assessment.amount.toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Assessment History
      </Typography>

      {taxpayer.assessments.map((assessment) => (
        <Card key={assessment.id} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle1">{assessment.taxType}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {assessment.period}
                </Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography variant="body2">Amount</Typography>
                <Typography variant="body1">TZS {assessment.amount.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography variant="body2">Status</Typography>
                <Chip
                  label={assessment.status}
                  size="small"
                  color={
                    assessment.status === 'Paid'
                      ? 'success'
                      : assessment.status === 'Pending'
                      ? 'error'
                      : 'warning'
                  }
                  icon={<StatusIcon status={assessment.status} />}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography variant="body2">Date</Typography>
                <Typography variant="body1">
                  {new Date(assessment.date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3} sx={{ textAlign: 'right' }}>
                <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                  View Details
                </Button>
                {assessment.status === 'Pending' && (
                  <Button size="small" variant="contained" color="primary">
                    Process Payment
                  </Button>
                )}
              </Grid>
            </Grid>
            {assessment.details && (
              <Box sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2">{assessment.details}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2 }}>
          New Assessment
        </Button>
      </Box>
    </Box>
  );
}
