import React, { useContext, useState } from 'react';
import { InvoiceContext } from '../../../../context/InvoiceContext/index';
import NewTransactionModal from '../modal/NewTransactionModal';
import {
  Table,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  IconButton,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Stack,
  InputAdornment,
  Chip,
  Link,
  Card,
  CardHeader,
  CardContent,
  Grid,
  CircularProgress,
  TablePagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
  Divider,
  Avatar,
  Slide,
  Collapse,
  LinearProgress,
} from '@mui/material';
import {
  IconNetwork,
  IconLock,
  IconCurrencyDollar,
  IconShieldCheck,
  IconExternalLink,
  IconFile,
  IconFileText,
  IconDatabase,
  IconCode,
  IconAlertCircle,
  IconHistory,
  IconEdit,
  IconChecks,
  IconDeviceFloppy,
  IconId,
  IconReceipt,
  IconFingerprint,
} from '@tabler/icons-react';

const InvoiceList = () => {
  const { invoices, addBlock, updateInvoice } = useContext(InvoiceContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tamperedTx, setTamperedTx] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [openAudit, setOpenAudit] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [newTxOpen, setNewTxOpen] = useState(false);
  const [efdData, setEfdData] = useState({
    tin: '',
    invoiceNumber: '',
    deviceId: '',
    customerTIN: '',
    amount: 0,
    vatRate: 18,
    items: [],
  });

  const [networkStatus, setNetworkStatus] = useState({
    nodes: 4,
    currentBlock: 1428,
    transactions: 4567,
    uptime: '99.9%',
    consensus: 'Kafka',
  });

  const statusConfig = {
    CONFIRMED: { color: 'success', icon: <IconShieldCheck size={16} /> },
    PENDING: { color: 'warning', icon: <IconNetwork size={16} /> },
    INVALID: { color: 'error', icon: <IconLock size={16} /> },
    PROCESSING: { color: 'info', icon: <CircularProgress size={16} /> },
  };

  const handleEFDSubmit = () => {
    const newBlock = {
      ...efdData,
      id: `TX-${Date.now()}`,
      transactionHash: `0x${Math.random().toString(36).substring(2, 10)}${Math.random()
        .toString(36)
        .substring(2, 10)}`,
      blockNumber: networkStatus.currentBlock + 1,
      timestamp: new Date().toISOString(),
      billFrom: 'TanzBiz Ltd',
      billTo: 'TRA Treasury',
      status: 'PENDING',
      previousHash: `0x${Math.random().toString(36).substring(2, 10)}...`,
      signature: '0xSIGNATURE',
    };

    const dataString = JSON.stringify({
      tin: newBlock.tin,
      amount: newBlock.amount,
      items: newBlock.items,
      customerTIN: newBlock.customerTIN,
      vatRate: newBlock.vatRate,
    });

    newBlock.checksum = btoa(dataString).slice(0, 16);
    newBlock.originalData = { ...newBlock };

    const updateBlocks = () => {
      addBlock({ ...newBlock, status: 'CONFIRMED' });
      setNetworkStatus((prev) => ({
        ...prev,
        currentBlock: prev.currentBlock + 1,
        transactions: prev.transactions + 1,
      }));
    };

    setTimeout(updateBlocks, 1500);
    setNewTxOpen(false);
  };

  const verifyBlockchainIntegrity = () => {
    const discrepancies = invoices.filter((tx) => {
      const currentData = JSON.stringify({
        amount: tx.amount,
        taxAmount: tx.taxAmount,
        billTo: tx.billTo,
        tin: tx.tin,
      });
      return btoa(currentData).slice(0, 16) !== tx.checksum;
    });

    if (discrepancies.length > 0) {
      setShowAlert(true);
      setAuditTrail(discrepancies);
    }
  };

  const simulateDataTampering = (tx) => {
    const modifiedTx = {
      ...tx,
      amount: tx.amount * 0.8,
      taxAmount: tx.taxAmount * 0.5,
      status: 'INVALID',
      _tampered: true,
    };
    updateInvoice(modifiedTx);
    setTamperedTx(modifiedTx);
  };

  const filteredInvoices = invoices.filter((tx) => {
    const search = searchTerm.toLowerCase();
    return (
      tx.transactionHash?.toLowerCase().includes(search) ||
      tx.billFrom?.toLowerCase().includes(search) ||
      tx.billTo?.toLowerCase().includes(search) ||
      tx.tin?.toLowerCase().includes(search)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const TamperIndicator = ({ tx }) => {
    const isTampered = tx.checksum !== btoa(JSON.stringify(tx.originalData)).slice(0, 16);

    return isTampered ? (
      <Tooltip
        title={
          <Box>
            <Typography variant="body2">Data Integrity Alert</Typography>
            <Typography variant="caption">
              This transaction's critical fields have been modified post-certification. Blockchain
              verification failed.
            </Typography>
          </Box>
        }
      >
        <Box
          sx={{
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: -4,
              right: -4,
              width: 16,
              height: 16,
              bgcolor: 'error.main',
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite',
            },
          }}
        >
          <IconAlertCircle color="error" size={20} />
        </Box>
      </Tooltip>
    ) : (
      <Tooltip title="Verified by Blockchain">
        <IconShieldCheck color="success" size={20} />
      </Tooltip>
    );
  };

  const TransactionRow = ({ tx }) => (
    <TableRow
      sx={{
        '&:hover': { bgcolor: 'action.hover' },
        ...(tx._tampered && {
          background:
            'repeating-linear-gradient(45deg, transparent, transparent 5px, #ffebee 5px, #ffebee 10px)',
        }),
      }}
    >
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TamperIndicator tx={tx} />
          <Link href={`#tx/${tx.transactionHash}`} sx={{ fontFamily: 'monospace' }}>
            {tx.transactionHash}
          </Link>
        </Stack>
      </TableCell>
      <TableCell>#{tx.blockNumber}</TableCell>
      <TableCell>
        <Box sx={{ minWidth: 140 }}>
          <Typography variant="body2">{new Date(tx.timestamp).toLocaleDateString()}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(tx.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box>
          <Typography>{tx.billFrom}</Typography>
          <Typography variant="caption" color="text.secondary">
            TIN: {tx.tin}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" fontWeight="bold">
            TZS {Number(tx.amount).toLocaleString()}
          </Typography>
          <Chip
            label={`VAT ${tx.vatRate}%`}
            size="small"
            sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}
          />
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={tx.status}
          variant="outlined"
          color={statusConfig[tx.status]?.color || 'default'}
          icon={statusConfig[tx.status]?.icon}
        />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => setOpenAudit(true)}>
          <IconHistory color="action" />
        </IconButton>
        <Tooltip title="Simulate Tampering (Demo)">
          <IconButton color="warning" onClick={() => simulateDataTampering(tx)}>
            <IconEdit />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Blockchain Network Status"
          subheader="Hyperledger Fabric Network"
          avatar={<IconNetwork size={32} />}
          action={
            <Button
              variant="outlined"
              startIcon={<IconShieldCheck />}
              onClick={verifyBlockchainIntegrity}
            >
              Verify Integrity
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Stack alignItems="center">
                <Typography variant="body2">Nodes Online</Typography>
                <Typography variant="h5" color="success.main">
                  {networkStatus.nodes}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack alignItems="center">
                <Typography variant="body2">Current Block</Typography>
                <Typography variant="h5">#{networkStatus.currentBlock}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack alignItems="center">
                <Typography variant="body2">Total Transactions</Typography>
                <Typography variant="h5">{networkStatus.transactions}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack alignItems="center">
                <Typography variant="body2">Consensus</Typography>
                <Chip label={networkStatus.consensus} color="info" />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="New EFD Transaction"
          avatar={<IconDeviceFloppy size={32} />}
          action={
            <Button
              variant="contained"
              onClick={() => setNewTxOpen(true)}
              startIcon={<IconFileText />}
            >
              Create Transaction
            </Button>
          }
        />
        <CardContent>
          <LinearProgress
            variant="determinate"
            value={(networkStatus.transactions % 100) + 10}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Next block confirmation in {100 - (networkStatus.transactions % 100)} transactions
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Transaction Ledger"
          subheader="Immutable Blockchain Records"
          avatar={<IconDatabase size={32} />}
          action={
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              variant="outlined"
              size="small"
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconFileText size={20} />
                  </InputAdornment>
                ),
              }}
            />
          }
        />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>TX Hash</TableCell>
                <TableCell>Block</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>TIN</TableCell>
                <TableCell>Merchant</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredInvoices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      <NewTransactionModal />

      <Dialog open={openAudit} onClose={() => setOpenAudit(false)} maxWidth="md">
        <DialogTitle>Transaction Audit Trail</DialogTitle>
        <DialogContent>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<IconChecks />}>
              <Typography>Original Blockchain Record</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <pre>{JSON.stringify(tamperedTx?.originalData, null, 2)}</pre>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<IconAlertCircle />}>
              <Typography color="error">Current State</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <pre>{JSON.stringify(tamperedTx, null, 2)}</pre>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
      </Dialog>

      <Snackbar open={showAlert} autoHideDuration={6000} onClose={() => setShowAlert(false)}>
        <Alert severity="error" icon={<IconAlertCircle />}>
          {auditTrail.length} tampered transactions detected in blockchain!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoiceList;
