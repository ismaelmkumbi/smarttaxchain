import { useState, useMemo } from 'react';
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
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  InputAdornment,
  MenuItem,
  Select,
  Modal,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  Pagination,
  FormControlLabel,
  Switch,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  Warning,
  Payment,
  History,
  Receipt,
  PendingActions,
  Download,
  AccountBalanceWallet,
  CheckCircle,
  Schedule,
  MonetizationOn,
  Close,
  Edit,
  Save,
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';
const getStatusColor = (status, theme) => {
  switch (status) {
    case 'Paid':
    case 'Completed':
      return theme.palette.success.main;
    case 'Pending':
      return theme.palette.warning.main;
    case 'Overdue':
      return theme.palette.error.main;
    default:
      return theme.palette.text.primary;
  }
};
export const PaymentRow = ({ payment, onPay, onEdit }) => {
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
      onPay(payment, phoneNumber);
      handleCloseDialog();
    }
  };

  return (
    <>
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
          {isOverdue && (
            <Typography variant="caption" color="error">
              Overdue
            </Typography>
          )}
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
                bgcolor: getStatusColor(isOverdue ? 'Overdue' : payment.status, theme) + '20',
                color: getStatusColor(isOverdue ? 'Overdue' : payment.status, theme),
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
          <Stack direction="row" spacing={1}>
            {payment.status === 'Pending' && (
              <Button
                variant="contained"
                startIcon={<Payment />}
                size="small"
                sx={{ borderRadius: 2 }}
                onClick={handleOpenDialog}
              >
                Pay
              </Button>
            )}
            <IconButton color="primary" onClick={() => onEdit(payment)}>
              <Edit />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

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
