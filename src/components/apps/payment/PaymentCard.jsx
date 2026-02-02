import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Button,
  Grid,
  Chip,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  CircularProgress,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { MonetizationOn, Payment, Warning } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const PaymentCard = ({ payment, onPay }) => {
  const theme = useTheme();
  const dueDate = new Date(payment.dueDate);
  const isOverdue = payment.status === 'Pending' && dueDate < new Date();

  const [openDialog, setOpenDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setPhoneNumber('');
    setOpenDialog(false);
  };

  const handleConfirmPayment = () => {
    if (phoneNumber.trim()) {
      onPay(payment, phoneNumber); // Pass both payment and entered phone number
      handleCloseDialog();
      // Optionally: you could show a toast/snackbar saying "Prompt sent to your phone!"
    }
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          overflowX: 'auto',
          '& .MuiTableCell-root': {
            py: 1.5,
            '&:last-child': { pr: 3 },
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Taxpayer</TableCell>
              <TableCell align="right">Amount Due</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Tax Type</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
              {/* Taxpayer Column */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MonetizationOn
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: 32,
                      mr: 1.5,
                    }}
                  />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1">{payment.taxpayerName}</Typography>
                      {isOverdue && <Warning color="error" sx={{ ml: 1, fontSize: '1.2rem' }} />}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {payment.taxpayerTin}
                    </Typography>
                    <Chip label={payment.region} size="small" color="secondary" sx={{ mt: 0.5 }} />
                  </Box>
                </Box>
              </TableCell>

              {/* Amount Due */}
              <TableCell align="right">
                <Typography variant="body1">
                  {new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: 'TZS',
                  }).format(payment.amount)}
                </Typography>
              </TableCell>

              {/* Due Date */}
              <TableCell>
                <Typography variant="body1">{dueDate.toLocaleDateString()}</Typography>
              </TableCell>

              {/* Tax Type */}
              <TableCell>
                <Typography variant="body1">{payment.taxType}</Typography>
              </TableCell>

              {/* Period */}
              <TableCell>
                <Typography variant="body1">{payment.period}</Typography>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Box>
                  <Chip
                    label={isOverdue ? 'Overdue' : payment.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(payment.status, theme) + '20',
                      color: getStatusColor(payment.status, theme),
                      mb: 0.5,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {payment.referenceNumber}
                  </Typography>
                </Box>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <Button
                  variant="contained"
                  startIcon={<Payment />}
                  size="small"
                  sx={{ borderRadius: 2 }}
                  onClick={handleOpenDialog}
                >
                  Pay
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Payment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Enter Mobile Number</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Please enter your mobile phone number. A payment prompt will be sent for you to confirm.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Mobile Number"
            placeholder="e.g. 0654123456"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmPayment}>
            Confirm and Wait for Prompt
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Helper function to get status colors
const getStatusColor = (status, theme) => {
  switch (status) {
    case 'Paid':
      return theme.palette.success.main;
    case 'Pending':
      return theme.palette.warning.main;
    case 'Overdue':
      return theme.palette.error.main;
    default:
      return theme.palette.text.primary;
  }
};

export default PaymentCard;
