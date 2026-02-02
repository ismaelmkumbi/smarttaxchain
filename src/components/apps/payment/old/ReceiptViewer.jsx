// ReceiptViewer.jsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Payment,
  History,
  Receipt,
  PendingActions,
  AttachMoney,
  CalendarMonth,
  Warning,
} from '@mui/icons-material';
import { Print, ArrowBack, Download } from '@mui/icons-material';

export const ReceiptViewer = ({ receipt }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      {/* Printable Receipt */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 800,
          mx: 'auto',
          '@media print': {
            boxShadow: 'none',
            p: 2,
          },
        }}
        id="receipt-to-print"
      >
        {/* TRA Letterhead */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            TANZANIA REVENUE AUTHORITY
          </Typography>
          <Typography variant="subtitle1">Official Tax Payment Receipt</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Receipt Details */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Receipt Number:</Typography>
            <Typography>{receipt.receiptNumber}</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="subtitle2">Date:</Typography>
            <Typography>{formatDate(receipt.date)}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Taxpayer:</Typography>
            <Typography>{receipt.taxpayerName}</Typography>
            <Typography>{receipt.tin}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount (TZS)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {receipt.taxType} for {receipt.year}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(receipt.amount)}</TableCell>
                  </TableRow>
                  {receipt.penalty > 0 && (
                    <TableRow>
                      <TableCell>Penalty</TableCell>
                      <TableCell align="right">{formatCurrency(receipt.penalty)}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell variant="head">Total Paid</TableCell>
                    <TableCell variant="head" align="right">
                      {formatCurrency(receipt.amount + (receipt.penalty || 0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Payment Method:</Typography>
            <Typography>{receipt.paymentMethod}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Blockchain Verification:</Typography>
            <Typography
              component="a"
              href={`/blockchain/${receipt.blockchainTxId}`}
              target="_blank"
              sx={{ textDecoration: 'none' }}
            >
              {receipt.blockchainTxId}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" fontStyle="italic">
              This is an official receipt from Tanzania Revenue Authority
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button variant="contained" startIcon={<Print />} onClick={handlePrint}>
          Print Receipt
        </Button>
        <Button variant="outlined" startIcon={<Download />} onClick={downloadPDF}>
          Download PDF
        </Button>
      </Box>
    </Box>
  );

  function handlePrint() {
    const receiptElement = document.getElementById('receipt-to-print');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${receipt.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            @page { size: auto; margin: 0mm; }
          </style>
        </head>
        <body>
          ${receiptElement.innerHTML}
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  function downloadPDF() {
    // Implementation using a PDF library like jsPDF or html2pdf
    // This would generate a PDF version of the receipt
  }
};
