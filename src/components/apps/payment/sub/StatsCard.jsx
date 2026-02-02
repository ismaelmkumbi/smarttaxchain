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

export const StatsCard = ({ icon, title, value, color }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 2,
        bgcolor: theme.palette[color].light,
        color: theme.palette[color].dark,
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: theme.palette[color].main }}>{icon}</Avatar>
        <Box>
          <Typography variant="subtitle2" color="inherit">
            {title}
          </Typography>
          <Typography variant="h6" color="inherit">
            {value}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
