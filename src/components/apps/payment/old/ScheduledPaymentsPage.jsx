// ScheduledPaymentsPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  TextField,
} from '@mui/material';
import { CalendarMonth, Add, PendingActions, Schedule } from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers';

export const ScheduledPaymentsPage = ({ taxpayer }) => {
  const [tabValue, setTabValue] = useState(0);
  const [openNewPlan, setOpenNewPlan] = useState(false);

  const scheduledPayments = taxpayer.scheduledPayments || [];
  const activePayments = scheduledPayments.filter((p) => p.status === 'Active');
  const completedPayments = scheduledPayments.filter((p) => p.status === 'Completed');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <CalendarMonth sx={{ verticalAlign: 'middle', mr: 1 }} />
        Scheduled Payments
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenNewPlan(true)}>
          New Payment Plan
        </Button>
      </Box>

      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)}>
          <Tab label="Active Plans" icon={<PendingActions />} />
          <Tab label="Payment Calendar" icon={<CalendarMonth />} />
          <Tab label="Completed Plans" icon={<CheckCircle />} />
        </Tabs>

        <Divider />

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <ActivePlansTable
              plans={activePayments}
              onEdit={handleEditPlan}
              onCancel={handleCancelPlan}
            />
          )}

          {tabValue === 1 && (
            <Box sx={{ height: 600 }}>
              <DateCalendar events={scheduledPayments} onEventClick={handleEventClick} />
            </Box>
          )}

          {tabValue === 2 && <CompletedPlansTable plans={completedPayments} />}
        </Box>
      </Paper>

      {/* New Payment Plan Dialog */}
      <NewPaymentPlanDialog
        open={openNewPlan}
        onClose={() => setOpenNewPlan(false)}
        onCreate={handleCreatePlan}
        taxpayer={taxpayer}
      />
    </Box>
  );
};

const ActivePlansTable = ({ plans, onEdit, onCancel }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Plan ID</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Installments</TableCell>
            <TableCell>Next Payment</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>{plan.id}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>{formatCurrency(plan.totalAmount)}</TableCell>
              <TableCell>
                {plan.completedInstallments} of {plan.totalInstallments}
              </TableCell>
              <TableCell>
                {formatDate(plan.nextPaymentDate)}
                {plan.overdue && <Chip label="Overdue" color="error" size="small" sx={{ ml: 1 }} />}
              </TableCell>
              <TableCell>
                <Chip label={plan.status} color="primary" size="small" />
              </TableCell>
              <TableCell>
                <Button size="small" onClick={() => onEdit(plan)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => onCancel(plan)}>
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const NewPaymentPlanDialog = ({ open, onClose, onCreate, taxpayer }) => {
  const [planData, setPlanData] = useState({
    description: '',
    totalAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    frequency: 'monthly',
    numberOfPayments: 3,
    assessments: [],
  });

  const handleSubmit = () => {
    // Validate and create the plan
    onCreate(planData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Payment Plan</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Plan Description"
              value={planData.description}
              onChange={(e) => setPlanData({ ...planData, description: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Total Amount (TZS)"
              type="number"
              value={planData.totalAmount}
              onChange={(e) => setPlanData({ ...planData, totalAmount: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={planData.startDate}
              onChange={(e) => setPlanData({ ...planData, startDate: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Select
              fullWidth
              label="Payment Frequency"
              value={planData.frequency}
              onChange={(e) => setPlanData({ ...planData, frequency: e.target.value })}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number of Payments"
              type="number"
              value={planData.numberOfPayments}
              onChange={(e) => setPlanData({ ...planData, numberOfPayments: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Select Assessments to Include in Plan
            </Typography>
            <AssessmentSelectionTable
              assessments={taxpayer.assessments.filter((a) => a.status === 'Pending')}
              selected={planData.assessments}
              onSelect={(selected) => setPlanData({ ...planData, assessments: selected })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
};
