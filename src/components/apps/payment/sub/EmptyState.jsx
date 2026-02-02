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

export const EmptyState = () => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <CheckCircle sx={{ fontSize: 60, color: theme.palette.success.light, mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        No payments found
      </Typography>
      <Typography color="text.secondary">
        No payments match your search criteria or adjust your filters
      </Typography>
    </Paper>
  );
};
