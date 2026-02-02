// PaymentHistoryPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
} from '@mui/material';
import { History, Search, FilterList, Receipt, Download } from '@mui/icons-material';

export const PaymentHistoryPage = ({ payments }) => {
  const [search, setSearch] = useState('');
  const [taxType, setTaxType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.assessmentId.toLowerCase().includes(search.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(search.toLowerCase());

    const matchesType = taxType ? p.taxType === taxType : true;

    const matchesDate =
      (!dateRange.start || new Date(p.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(p.date) <= new Date(dateRange.end));

    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <History sx={{ verticalAlign: 'middle', mr: 1 }} />
        Payment History
      </Typography>

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" />,
            }}
          />

          <Select
            value={taxType}
            onChange={(e) => setTaxType(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="">All Tax Types</MenuItem>
            {taxTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="From Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />

          <TextField
            label="To Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />

          <Button variant="outlined" startIcon={<Download />} onClick={exportToExcel}>
            Export
          </Button>
        </Box>
      </Paper>

      {/* Payment History Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Receipt #</TableCell>
                <TableCell>Assessment ID</TableCell>
                <TableCell>Tax Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Date Paid</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Blockchain</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.receiptNumber}>
                  <TableCell>{payment.receiptNumber}</TableCell>
                  <TableCell>{payment.assessmentId}</TableCell>
                  <TableCell>{payment.taxType}</TableCell>
                  <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>
                    <Chip label={payment.method} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.blockchainTxId.substring(0, 8)}
                      size="small"
                      onClick={() => navigate(`/blockchain/${payment.blockchainTxId}`)}
                      clickable
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<Receipt />}
                      onClick={() => navigate(`/payments/receipts/${payment.receiptNumber}`)}
                    >
                      Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
