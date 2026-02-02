// BulkPaymentPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
} from '@mui/material';
import { AttachMoney, Payment, ArrowBack } from '@mui/icons-material';

export default BulkPaymentPage = ({ assessments }) => {
  const [selected, setSelected] = useState([]);

  const toggleAssessment = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const selectedAssessments = assessments.filter((a) => selected.includes(a.id));
  const totalAmount = selectedAssessments.reduce((sum, a) => sum + a.amount, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/payments')} sx={{ mb: 2 }}>
        Back to Payments
      </Button>

      <Typography variant="h4" gutterBottom>
        <Payment sx={{ verticalAlign: 'middle', mr: 1 }} />
        Bulk Payment
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Assessments
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select multiple assessments to pay together
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="50px"></TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Year</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assessments
                .filter((a) => a.status === 'Pending')
                .map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(a.id)}
                        onChange={() => toggleAssessment(a.id)}
                      />
                    </TableCell>
                    <TableCell>{a.id}</TableCell>
                    <TableCell>{a.type}</TableCell>
                    <TableCell>{a.year}</TableCell>
                    <TableCell align="right">{formatCurrency(a.amount)}</TableCell>
                    <TableCell>
                      <Chip
                        label={formatDate(a.dueDate)}
                        color={new Date(a.dueDate) < new Date() ? 'error' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {selected.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Selected Assessments:</Typography>
            <Typography>{selected.length}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Total Amount:</Typography>
            <Typography variant="h5">{formatCurrency(totalAmount)}</Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() =>
              navigate('/payments/process/bulk', { state: { assessmentIds: selected } })
            }
            startIcon={<Payment />}
          >
            Proceed to Payment
          </Button>
        </Paper>
      )}
    </Box>
  );
};
