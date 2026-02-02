// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Grid,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Button,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Divider,
//   Avatar,
//   Stack,
//   IconButton,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
//   LinearProgress,
//   InputAdornment,
//   Badge,
// } from '@mui/material';
// import {
//   Search,
//   FilterList,
//   Add,
//   Print,
//   Download,
//   Payment,
//   Receipt,
//   Business,
//   CalendarToday,
//   Warning,
//   CheckCircle,
//   Edit,
//   Delete,
//   Close,
//   AccountBalanceWallet,
//   Verified,
//   AttachMoney,
//   Timeline,
//   BarChart,
//   ListAlt,
// } from '@mui/icons-material';
// import { Link } from 'react-router';

// import BlockchainService from '../BlockchainService.JS';
// import { initialAssessments } from '../data/InitialAssessments';
// import taxAssessmentService from '../../../../services/taxAssessmentService';

// // Enhanced Blockchain Service with more realistic simulation
// // Initialize blockchain service
// const blockchain = new BlockchainService();

// // Enhanced dummy data with more realistic values
// const initialTaxpayer = {
//   id: 'taxpayer-001',
//   name: 'John Doe Enterprises Ltd',
//   type: 'Company',
//   tin: '123456789-TZ',
//   registrationDate: '2020-06-15',
//   outstandingTax: 5200000,
//   sector: 'Manufacturing',
//   region: 'Dar es Salaam',
//   contact: {
//     email: 'accounts@johndoe.tz',
//     phone: '+255 712 345 678',
//     address: '123 Industrial Area, Dar es Salaam',
//   },
//   complianceRating: 'Medium Risk',
//   lastAuditDate: '2023-11-15',
// };

// const statusColors = {
//   Pending: 'warning',
//   Completed: 'success',
//   Overdue: 'error',
// };

// const taxTypes = ['VAT', 'Income Tax', 'Excise', 'Withholding', 'Corporate Tax', 'Payroll Tax'];
// const taxOffices = ['TRA Dar es Salaam', 'TRA Arusha', 'TRA Mwanza', 'TRA Dodoma', 'TRA Mbeya'];
// const years = ['2024', '2023', '2022', '2021', '2020'];

// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-TZ', {
//     style: 'currency',
//     currency: 'TZS',
//     minimumFractionDigits: 0,
//   }).format(amount);
// };

// const formatDate = (dateString) => {
//   if (!dateString) return '-';
//   const options = { year: 'numeric', month: 'short', day: 'numeric' };
//   return new Date(dateString).toLocaleDateString('en-TZ', options);
// };

// const getStatusIcon = (status) => {
//   switch (status) {
//     case 'Completed':
//       return <CheckCircle color="success" />;
//     case 'Pending':
//       return <Warning color="warning" />;
//     case 'Overdue':
//       return <Warning color="error" />;
//     default:
//       return <CheckCircle />;
//   }
// };

// export default function TaxpayerDashboard() {
//   const [taxpayer, setTaxpayer] = useState(initialTaxpayer);
//   const [assessments, setAssessments] = useState(initialAssessments);
//   const [search, setSearch] = useState('');
//   const [taxYear, setTaxYear] = useState('');
//   const [taxType, setTaxType] = useState('');
//   const [status, setStatus] = useState('');
//   const [taxOffice, setTaxOffice] = useState('');
//   const [openDialog, setOpenDialog] = useState(false);
//   const [currentAssessment, setCurrentAssessment] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [blockchainDialog, setBlockchainDialog] = useState(false);
//   const [blockchainData, setBlockchainData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [viewMode, setViewMode] = useState('list'); // 'list' or 'chart'

//   // Form state
//   const [formData, setFormData] = useState({
//     year: '2024',
//     type: 'VAT',
//     amount: '',
//     description: '',
//     dueDate: '',
//     taxOffice: 'TRA Dar es Salaam',
//     assignedOfficer: '',
//   });

//   // Filter assessments
//   const filteredAssessments = assessments.filter((a) => {
//     const matchesSearch =
//       a.id.toLowerCase().includes(search.toLowerCase()) ||
//       a.type.toLowerCase().includes(search.toLowerCase()) ||
//       a.description?.toLowerCase().includes(search.toLowerCase()) ||
//       a.taxOffice?.toLowerCase().includes(search.toLowerCase()) ||
//       a.assignedOfficer?.toLowerCase().includes(search.toLowerCase());

//     return (
//       matchesSearch &&
//       (taxYear ? a.year === taxYear : true) &&
//       (taxType ? a.type === taxType : true) &&
//       (status ? a.status === status : true) &&
//       (taxOffice ? a.taxOffice === taxOffice : true)
//     );
//   });

//   // Calculate summary metrics
//   const totalAssessments = assessments.length;
//   const completedAssessments = assessments.filter((a) => a.status === 'Completed').length;
//   const pendingAssessments = assessments.filter((a) => a.status === 'Pending').length;
//   const overdueAssessments = assessments.filter(
//     (a) => a.status === 'Pending' && new Date(a.dueDate) < new Date(),
//   ).length;

//   const totalTaxAmount = assessments.reduce((sum, a) => sum + a.amount, 0);
//   const outstandingAmount = assessments
//     .filter((a) => a.status === 'Pending')
//     .reduce((sum, a) => sum + a.amount + (a.penalty || 0) + (a.interest || 0), 0);

//   // CRUD Operations
//   const handleCreate = () => {
//     setCurrentAssessment(null);
//     setIsEditing(false);
//     setFormData({
//       year: '2024',
//       type: 'VAT',
//       amount: '',
//       description: '',
//       dueDate: '',
//       taxOffice: 'TRA Dar es Salaam',
//       assignedOfficer: '',
//     });
//     setOpenDialog(true);
//   };

//   const handleEdit = (assessment) => {
//     setCurrentAssessment(assessment);
//     setIsEditing(true);
//     setFormData({
//       year: assessment.year,
//       type: assessment.type,
//       amount: assessment.amount,
//       description: assessment.description,
//       dueDate: assessment.dueDate || '',
//       taxOffice: assessment.taxOffice || '',
//       assignedOfficer: assessment.assignedOfficer || '',
//     });
//     setOpenDialog(true);
//   };

//   const handleDelete = (id) => {
//     setAssessments((prev) => prev.filter((a) => a.id !== id));
//     showSnackbar('Assessment deleted successfully', 'success');

//     // Simulate blockchain record
//     blockchain.addTransaction({
//       type: 'DELETE_ASSESSMENT',
//       assessmentId: id,
//       action: 'Deleted assessment record',
//     });
//   };

//   const handleSubmit = () => {
//     setLoading(true);

//     // Simulate API call delay
//     setTimeout(() => {
//       if (isEditing) {
//         // Update existing assessment
//         setAssessments((prev) =>
//           prev.map((a) => (a.id === currentAssessment.id ? { ...a, ...formData } : a)),
//         );
//         showSnackbar('Assessment updated successfully', 'success');

//         // Simulate blockchain record
//         blockchain.addTransaction({
//           type: 'UPDATE_ASSESSMENT',
//           assessmentId: currentAssessment.id,
//           action: 'Updated assessment details',
//           changes: formData,
//         });
//       } else {
//         // Create new assessment
//         const newAssessment = {
//           id: `T${formData.year}-${Math.floor(Math.random() * 1000)}`,
//           taxpayerId: taxpayer.id,
//           year: formData.year,
//           type: formData.type,
//           amount: Number(formData.amount),
//           status: 'Pending',
//           date: new Date().toISOString().split('T')[0],
//           dueDate: formData.dueDate,
//           description: formData.description,
//           taxOffice: formData.taxOffice,
//           assignedOfficer: formData.assignedOfficer,
//           blockchainTxId: null,
//           penalty: 0,
//           interest: 0,
//         };

//         setAssessments((prev) => [...prev, newAssessment]);
//         showSnackbar('Assessment created successfully', 'success');

//         // Simulate blockchain record
//         blockchain.addTransaction({
//           type: 'CREATE_ASSESSMENT',
//           assessmentId: newAssessment.id,
//           action: 'Created new assessment',
//           details: newAssessment,
//         });
//       }

//       setOpenDialog(false);
//       setLoading(false);
//     }, 1000);
//   };

//   const handlePayment = (assessment) => {
//     setLoading(true);

//     // Simulate API call delay
//     setTimeout(() => {
//       const updatedAssessment = {
//         ...assessment,
//         status: 'Completed',
//         paymentDate: new Date().toISOString().split('T')[0],
//         receiptNo: `RC${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
//       };

//       // Generate blockchain transaction
//       const { tx } = blockchain.addTransaction({
//         type: 'PAYMENT',
//         assessmentId: assessment.id,
//         amount: assessment.amount,
//         action: 'Processed tax payment',
//       });

//       // Update with blockchain TX ID
//       updatedAssessment.blockchainTxId = tx.txId;

//       setAssessments((prev) => prev.map((a) => (a.id === assessment.id ? updatedAssessment : a)));

//       // Update taxpayer outstanding balance
//       setTaxpayer((prev) => ({
//         ...prev,
//         outstandingTax: Math.max(0, prev.outstandingTax - assessment.amount),
//       }));

//       showSnackbar('Payment processed successfully', 'success');
//       setLoading(false);
//     }, 1500);
//   };

//   const viewBlockchainRecords = () => {
//     setBlockchainData(blockchain.getChain());
//     setBlockchainDialog(true);
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   const clearFilters = () => {
//     setSearch('');
//     setTaxYear('');
//     setTaxType('');
//     setStatus('');
//     setTaxOffice('');
//   };

//   // Chart data calculation
//   const chartData = assessments.reduce((acc, assessment) => {
//     if (!acc[assessment.type]) {
//       acc[assessment.type] = 0;
//     }
//     acc[assessment.type] += assessment.amount;
//     return acc;
//   }, {});

//   return (
//     <Box p={3}>
//       {/* Loading Indicator */}
//       {loading && (
//         <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />
//       )}

//       {/* Taxpayer Profile Header */}
//       <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
//         <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
//           <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }}>
//             <Business sx={{ fontSize: 40 }} />
//           </Avatar>
//           <Box flexGrow={1}>
//             <Typography variant="h4">{taxpayer.name}</Typography>
//             <Stack direction="row" spacing={2} alignItems="center" mt={1} flexWrap="wrap">
//               <Chip label={`TIN: ${taxpayer.tin}`} size="small" variant="outlined" />
//               <Chip label={taxpayer.type} size="small" color="info" />
//               <Chip label={taxpayer.sector} size="small" />
//               <Chip label={taxpayer.region} size="small" color="secondary" />
//               <Chip
//                 label={`Compliance: ${taxpayer.complianceRating}`}
//                 color={
//                   taxpayer.complianceRating === 'High Risk'
//                     ? 'error'
//                     : taxpayer.complianceRating === 'Medium Risk'
//                     ? 'warning'
//                     : 'success'
//                 }
//                 size="small"
//               />
//             </Stack>
//           </Box>
//           <Box textAlign={{ xs: 'left', md: 'right' }}>
//             <Typography variant="h6" color="error">
//               Outstanding: {formatCurrency(taxpayer.outstandingTax)}
//             </Typography>
//             <Button
//               variant="outlined"
//               startIcon={<AccountBalanceWallet />}
//               onClick={viewBlockchainRecords}
//               sx={{ mt: 1 }}
//             >
//               View Blockchain
//             </Button>
//           </Box>
//         </Stack>
//       </Paper>

//       {/* Summary Cards */}
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ height: '100%', borderRadius: 2 }}>
//             <CardContent>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <Avatar sx={{ bgcolor: 'primary.light' }}>
//                   <ListAlt color="primary" />
//                 </Avatar>
//                 <Box>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Total Assessments
//                   </Typography>
//                   <Typography variant="h4">{totalAssessments}</Typography>
//                 </Box>
//               </Stack>
//               <Typography variant="caption" color="text.secondary">
//                 Total: {formatCurrency(totalTaxAmount)}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ height: '100%', borderRadius: 2 }}>
//             <CardContent>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <Avatar sx={{ bgcolor: 'success.light' }}>
//                   <CheckCircle color="success" />
//                 </Avatar>
//                 <Box>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Completed
//                   </Typography>
//                   <Typography variant="h4" color="success.main">
//                     {completedAssessments}
//                   </Typography>
//                 </Box>
//               </Stack>
//               <Typography variant="caption" color="text.secondary">
//                 Paid in full
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ height: '100%', borderRadius: 2 }}>
//             <CardContent>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <Avatar sx={{ bgcolor: 'warning.light' }}>
//                   <Warning color="warning" />
//                 </Avatar>
//                 <Box>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Pending
//                   </Typography>
//                   <Typography variant="h4" color="warning.main">
//                     {pendingAssessments}
//                   </Typography>
//                 </Box>
//               </Stack>
//               <Typography variant="caption" color="text.secondary">
//                 Due: {formatCurrency(outstandingAmount)}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card sx={{ height: '100%', borderRadius: 2 }}>
//             <CardContent>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <Avatar sx={{ bgcolor: 'error.light' }}>
//                   <Warning color="error" />
//                 </Avatar>
//                 <Box>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Overdue
//                   </Typography>
//                   <Typography variant="h4" color="error.main">
//                     {overdueAssessments}
//                   </Typography>
//                 </Box>
//               </Stack>
//               <Typography variant="caption" color="text.secondary">
//                 Needs immediate attention
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Search and Filters Section */}
//       <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={4}>
//             <TextField
//               fullWidth
//               label="Search assessments"
//               variant="outlined"
//               size="small"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={2}>
//             <Select
//               fullWidth
//               size="small"
//               value={taxYear}
//               displayEmpty
//               onChange={(e) => setTaxYear(e.target.value)}
//             >
//               <MenuItem value="">All Years</MenuItem>
//               {years.map((year) => (
//                 <MenuItem key={year} value={year}>
//                   {year}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2}>
//             <Select
//               fullWidth
//               size="small"
//               value={taxType}
//               displayEmpty
//               onChange={(e) => setTaxType(e.target.value)}
//             >
//               <MenuItem value="">All Types</MenuItem>
//               {taxTypes.map((type) => (
//                 <MenuItem key={type} value={type}>
//                   {type}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2}>
//             <Select
//               fullWidth
//               size="small"
//               value={status}
//               displayEmpty
//               onChange={(e) => setStatus(e.target.value)}
//             >
//               <MenuItem value="">All Statuses</MenuItem>
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="Completed">Completed</MenuItem>
//               <MenuItem value="Overdue">Overdue</MenuItem>
//             </Select>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2}>
//             <Select
//               fullWidth
//               size="small"
//               value={taxOffice}
//               displayEmpty
//               onChange={(e) => setTaxOffice(e.target.value)}
//             >
//               <MenuItem value="">All Offices</MenuItem>
//               {taxOffices.map((office) => (
//                 <MenuItem key={office} value={office}>
//                   {office}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Grid>
//           <Grid item xs={12} sm={6} md={1}>
//             <Tooltip title="Clear Filters">
//               <IconButton onClick={clearFilters}>
//                 <FilterList />
//               </IconButton>
//             </Tooltip>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* View Toggle and Action Buttons */}
//       <Box display="flex" justifyContent="space-between" mb={2}>
//         <Box>
//           <Button
//             variant={viewMode === 'list' ? 'contained' : 'outlined'}
//             onClick={() => setViewMode('list')}
//             sx={{ mr: 1 }}
//           >
//             List View
//           </Button>
//           <Button
//             variant={viewMode === 'chart' ? 'contained' : 'outlined'}
//             onClick={() => setViewMode('chart')}
//           >
//             Chart View
//           </Button>
//         </Box>
//         <Stack direction="row" spacing={1}>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleCreate}
//             sx={{ borderRadius: 2 }}
//           >
//             New Assessment
//           </Button>
//           <Button variant="outlined" startIcon={<Print />} sx={{ borderRadius: 2 }}>
//             Print
//           </Button>
//           <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 2 }}>
//             Export
//           </Button>
//         </Stack>
//       </Box>

//       {/* Chart View */}
//       {viewMode === 'chart' && (
//         <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, height: 400 }}>
//           <Typography variant="h6" gutterBottom>
//             Tax Assessment Overview
//           </Typography>
//           <Box sx={{ height: 350, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
//             {Object.entries(chartData).map(([type, amount]) => (
//               <Tooltip key={type} title={`${type}: ${formatCurrency(amount)}`} arrow>
//                 <Box
//                   sx={{
//                     flexGrow: 1,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                   }}
//                 >
//                   <Typography variant="caption" sx={{ mb: 1 }}>
//                     {type}
//                   </Typography>
//                   <Box
//                     sx={{
//                       width: '80%',
//                       backgroundColor: 'primary.main',
//                       height: `${Math.min(
//                         100,
//                         (amount / Math.max(...Object.values(chartData))) * 100,
//                       )}%`,
//                       borderRadius: 1,
//                       display: 'flex',
//                       justifyContent: 'center',
//                       alignItems: 'flex-end',
//                     }}
//                   >
//                     <Typography variant="caption" sx={{ color: 'white', p: 1 }}>
//                       {formatCurrency(amount).replace('TZS', '').trim()}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Tooltip>
//             ))}
//           </Box>
//         </Paper>
//       )}

//       {/* List View */}
//       {viewMode === 'list' && (
//         <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
//           <Table>
//             <TableHead sx={{ bgcolor: 'background.default' }}>
//               <TableRow>
//                 <TableCell>Reference #</TableCell>
//                 <TableCell>Tax Year</TableCell>
//                 <TableCell>Tax Type</TableCell>
//                 <TableCell align="right">Amount</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Due Date</TableCell>
//                 <TableCell>Tax Office</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredAssessments.map((a) => (
//                 <TableRow key={a.id} hover>
//                   <TableCell>
//                     <Stack direction="row" alignItems="center">
//                       <Typography fontWeight="bold">{a.id}</Typography>
//                       {a.blockchainTxId && (
//                         <Tooltip title="Verified on blockchain">
//                           <Verified color="success" fontSize="small" sx={{ ml: 1 }} />
//                         </Tooltip>
//                       )}
//                     </Stack>
//                   </TableCell>
//                   <TableCell>{a.year}</TableCell>
//                   <TableCell>{a.type}</TableCell>
//                   <TableCell align="right">{formatCurrency(a.amount)}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={a.status}
//                       size="small"
//                       color={
//                         a.status === 'Completed'
//                           ? 'success'
//                           : new Date(a.dueDate) < new Date()
//                           ? 'error'
//                           : 'warning'
//                       }
//                       icon={getStatusIcon(a.status)}
//                     />
//                   </TableCell>
//                   <TableCell>{formatDate(a.date)}</TableCell>
//                   <TableCell>{formatDate(a.dueDate)}</TableCell>
//                   <TableCell>{a.taxOffice}</TableCell>
//                   <TableCell align="center">
//                     <Stack direction="row" spacing={1} justifyContent="center">
//                       <Tooltip title="View Details">
//                         <IconButton size="small">
//                           <Receipt fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Edit">
//                         <IconButton size="small" color="info" onClick={() => handleEdit(a)}>
//                           <Edit fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                       {a.status === 'Pending' && (
//                         <Tooltip title="Make Payment">
//                           {/* <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={() => navigate(`tax/payments/process/${assessment.id}`)}
//                           >
//                             <Payment fontSize="small" />
//                           </IconButton> */}

//                           <Link to={`/tax/payments/process/${taxpayer.id}`}>
//                             <IconButton size="small" color="primary">
//                               <Payment fontSize="small" />
//                             </IconButton>
//                             {/* <Button
//                                         variant="contained"
//                                         startIcon={<Assessment />}
//                                         size="small"
//                                         sx={{ borderRadius: 2 }}
//                                       >
//                                         View Details
//                                       </Button> */}
//                           </Link>
//                         </Tooltip>
//                       )}
//                       <Tooltip title="Delete">
//                         <IconButton size="small" color="error" onClick={() => handleDelete(a.id)}>
//                           <Delete fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           {filteredAssessments.length === 0 && (
//             <Box p={4} textAlign="center">
//               <Typography variant="h6" color="text.secondary">
//                 No assessments found matching your criteria
//               </Typography>
//               <Button variant="text" onClick={clearFilters} sx={{ mt: 2 }}>
//                 Clear Filters
//               </Button>
//             </Box>
//           )}
//         </TableContainer>
//       )}

//       {/* Create/Edit Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>{isEditing ? 'Edit Tax Assessment' : 'Create New Tax Assessment'}</DialogTitle>
//         <DialogContent dividers>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Year"
//                 value={formData.year}
//                 onChange={(e) => setFormData({ ...formData, year: e.target.value })}
//               >
//                 {years.map((year) => (
//                   <MenuItem key={year} value={year}>
//                     {year}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Tax Type"
//                 value={formData.type}
//                 onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//               >
//                 {taxTypes.map((type) => (
//                   <MenuItem key={type} value={type}>
//                     {type}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Amount (TZS)"
//                 type="number"
//                 value={formData.amount}
//                 onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Due Date"
//                 type="date"
//                 InputLabelProps={{ shrink: true }}
//                 value={formData.dueDate}
//                 onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Tax Office"
//                 value={formData.taxOffice}
//                 onChange={(e) => setFormData({ ...formData, taxOffice: e.target.value })}
//               >
//                 {taxOffices.map((office) => (
//                   <MenuItem key={office} value={office}>
//                     {office}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Assigned Officer"
//                 value={formData.assignedOfficer}
//                 onChange={(e) => setFormData({ ...formData, assignedOfficer: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Description"
//                 multiline
//                 rows={3}
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={!formData.amount || !formData.description}
//           >
//             {isEditing ? 'Update' : 'Create'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Blockchain Dialog */}
//       <Dialog
//         open={blockchainDialog}
//         onClose={() => setBlockchainDialog(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <AccountBalanceWallet />
//             <Typography>Blockchain Transaction Records</Typography>
//           </Stack>
//         </DialogTitle>
//         <DialogContent dividers>
//           {blockchainData.length === 0 ? (
//             <Typography color="text.secondary" align="center" py={4}>
//               No blockchain transactions yet
//             </Typography>
//           ) : (
//             <TableContainer>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Block #</TableCell>
//                     <TableCell>Timestamp</TableCell>
//                     <TableCell>Transaction Type</TableCell>
//                     <TableCell>Assessment ID</TableCell>
//                     <TableCell>Action</TableCell>
//                     <TableCell>Hash</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {blockchainData
//                     .slice()
//                     .reverse()
//                     .flatMap((block, blockIndex) =>
//                       block.transactions.map((tx, txIndex) => (
//                         <TableRow key={`${block.index}-${txIndex}`}>
//                           <TableCell>{block.index}</TableCell>
//                           <TableCell>{formatDate(block.timestamp)}</TableCell>
//                           <TableCell>{tx.type}</TableCell>
//                           <TableCell>{tx.assessmentId || '-'}</TableCell>
//                           <TableCell>{tx.action}</TableCell>
//                           <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
//                             {block.hash.substring(0, 12)}...
//                             {block.hash.substring(block.hash.length - 12)}
//                           </TableCell>
//                         </TableRow>
//                       )),
//                     )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setBlockchainDialog(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
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
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  LinearProgress,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Print,
  Download,
  Payment,
  Receipt,
  Business,
  CheckCircle,
  Edit,
  Delete,
  Warning,
  AccountBalanceWallet,
  Verified,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

const statusColors = {
  Pending: 'warning',
  Paid: 'success',
  Overdue: 'error',
};

const taxTypes = ['VAT', 'Income Tax', 'Excise', 'Withholding', 'Corporate Tax', 'Payroll Tax'];
const years = ['2024', '2023', '2022', '2021', '2020'];

const formatCurrency = (amount, currency = 'TZS') => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-TZ', options);
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Paid':
      return <CheckCircle color="success" />;
    case 'Pending':
      return <Warning color="warning" />;
    case 'Overdue':
      return <Warning color="error" />;
    default:
      return <CheckCircle />;
  }
};

// export default function TaxpayerDashboard() {
//   const [taxpayer, setTaxpayer] = useState(null);
//   const [assessments, setAssessments] = useState([]);
//   const [search, setSearch] = useState('');
//   const [taxYear, setTaxYear] = useState('');
//   const [taxType, setTaxType] = useState('');
//   const [status, setStatus] = useState('');
//   const [openDialog, setOpenDialog] = useState(false);
//   const [currentAssessment, setCurrentAssessment] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('list');
//   const [Tin, setTin] = useState('');
//   const [blockChainTpId, setblockChainTpId] = useState('');
//   const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
//   const [selected, setSelected] = React.useState([]);
//   const [isDeleting, setIsDeleting] = React.useState(false);
//   const [formLoading, setFormLoading] = React.useState(false);

//   const [formData, setFormData] = useState({
//     id: 1, // Make sure this function is defined
//     tin: '123456789', // Or fetch/set dynamically
//     taxType: 'Income Tax',
//     year: 2024,
//     amount: 1200000,
//     currency: 'TZS',
//     status: 'Pending',
//     createdBy: 'TRA Officer',
//     description: 'Annual income tax for 2025',
//     dueDate: '2025-06-30',
//   });

//   useEffect(() => {
//     const fetchTaxpayer = async () => {
//       try {
//         // Temporary solution to parse ID from URL
//         const url = new URL(window.location.href);
//         const id = url.pathname.split('/').pop();
//         setblockChainTpId(id);
//         console.log('Taxpayer ID from URL:', id);
//         const response = await fetch(`http://localhost:3000/taxpayers/${id}`);
//         if (!response.ok) throw new Error('Failed to fetch taxpayer');
//         const data = await response.json();
//         setTaxpayer(data.taxpayer);
//       } catch (error) {
//         showSnackbar(error.message, 'error');
//       }
//     };

//     fetchTaxpayer();
//   }, []);

//   useEffect(() => {
//     const fetchAssessments = async () => {
//       if (taxpayer?.TIN) {
//         try {
//           setLoading(true);
//           setTin(taxpayer.TIN);
//           console.log('testing TIN', taxpayer.TIN);
//           const response = await fetch(
//             `http://localhost:3000/api/tax-assessments/tin/${taxpayer.TIN}`,
//           );
//           const data = await response.json();
//           console.log('API Response for Assessments:', data); // <-- Add this line to inspect the response
//           setAssessments(data.assessments);
//         } catch (error) {
//           showSnackbar('Error loading assessments', 'error');
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchAssessments();
//   }, [taxpayer]);

//   const filteredAssessments = (assessments || []).filter((a) => {
//     console.log('testing:', a); // Log each assessment to inspect
//     const searchLower = search.toLowerCase();

//     // Use the correct field names matching the provided data structure
//     const idMatch = a.ID && a.ID.toLowerCase().includes(searchLower);
//     const taxTypeMatch = a.TaxType && a.TaxType.toLowerCase().includes(searchLower);
//     const descriptionMatch = a.Description && a.Description.toLowerCase().includes(searchLower);

//     return (
//       (idMatch || taxTypeMatch || descriptionMatch) &&
//       (taxYear ? a.Year.toString() === taxYear : true) &&
//       (taxType ? a.TaxType === taxType : true) &&
//       (status ? a.Status === status : true)
//     );
//   });
//   const handleCreate = () => {
//     setCurrentAssessment(null);
//     setIsEditing(false);

//     setFormData({
//       id: generateRandomAssessmentId(), // ensure this function is defined
//       tin: Tin, // optionally make this dynamic
//       taxType: 'Income Tax',
//       year: 2024,
//       amount: '',
//       description: '',
//       dueDate: '',
//       status: 'Pending',
//       currency: 'TZS',
//       createdBy: 'TRA Officer',
//     });

//     setOpenDialog(true);
//   };

//   const generateRandomAssessmentId = () => {
//     const randomNumber = Math.floor(10000 + Math.random() * 90000); // generates a number between 10000–99999
//     return `TAX-${randomNumber}`;
//   };

//   const handleEdit = (assessment) => {
//     setCurrentAssessment(assessment);

//     console.log('Edit:', assessments);
//     setIsEditing(true);
//     setFormData({
//       id: assessment.ID,
//       tin: assessment.Tin,
//       taxType: assessment.TaxType,
//       year: assessment.Year.toString(),
//       amount: assessment.Amount.toString(),
//       description: assessment.Description,
//       dueDate: assessment.DueDate?.split('T')[0] || '', // in case it's already formatted
//       status: assessment.Status,
//       currency: assessment.Currency,
//       createdBy: assessment.CreatedBy,
//     });
//     setOpenDialog(true);
//   };

//   const handleDelete = async (assessmentId) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:3000/api/tax-assessments/${assessmentId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) throw new Error('Failed to delete assessment');

//       // Fix key name from `id` to `ID`
//       setAssessments((prev) => prev.filter((a) => a.ID !== assessmentId));
//       showSnackbar('Assessment deleted successfully', 'success');
//     } catch (error) {
//       showSnackbar(error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteTaxpayers = async () => {
//     setIsDeleting(true);
//     setDeletingRows([...selected]);

//     try {
//       // Simulate network delay
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       // Send the delete request
//       const response =
//         selected.length === 1
//           ? await taxpayerService.delete(selected[0])
//           : await taxpayerService.deleteMultiple(selected);

//       // If successful, update the state and show success message
//       setTaxpayers((prev) => prev.filter((t) => !selected.includes(t.id)));
//       setSelected([]);
//       showSnackbar(response?.message || 'Taxpayer(s) deleted successfully!', 'success');
//     } catch (error) {
//       console.error('Error during taxpayer deletion:', error);

//       // Check for specific error context from chaincode (like validation issues)
//       if (error.context === 'ChaincodeInvokeError') {
//         // Display the error message from the chaincode if it's a validation error
//         showSnackbar(error.message, 'error');
//       } else {
//         // Show a generic error message for any other failure
//         showSnackbar(error?.message || 'Error deleting taxpayer(s)', 'error');
//       }
//     } finally {
//       // Reset states after operation is complete
//       setDeletingRows([]);
//       setIsDeleting(false);
//       setOpenDeleteDialog(false);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       // Print data before the action
//       console.log('Data before submission:', formData);

//       setLoading(true);
//       console.log('form data:', formData);

//       const payload = {
//         ...formData,
//         id: isEditing ? formData.id : generateRandomAssessmentId(), // Use your ID generator
//         tin: taxpayer.TIN,
//         amount: Number(formData.amount),
//         year: Number(formData.year),
//       };

//       const url = isEditing
//         ? `http://localhost:3000/api/tax-assessments/${formData.id}`
//         : 'http://localhost:3000/api/tax-assessments';

//       const method = isEditing ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} assessment`);

//       const result = await response.json();
//       const updatedAssessment = result.taxAssessment; // ✅ Extract only the taxAssessment object

//       setAssessments((prev) =>
//         isEditing
//           ? prev.map((a) => (a.ID === updatedAssessment.ID ? updatedAssessment : a))
//           : [...prev, updatedAssessment],
//       );
//       showSnackbar(`Assessment ${isEditing ? 'updated' : 'created'} successfully`, 'success');
//       setOpenDialog(false);
//     } catch (error) {
//       showSnackbar(error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async (assessment) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:3000/api/tax-assessments/${assessment.ID}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...assessment, status: 'Paid' }),
//       });

//       if (!response.ok) throw new Error('Payment processing failed');

//       const updatedAssessment = await response.json();

//       setAssessments((prev) =>
//         prev.map((a) => (a.ID === updatedAssessment.ID ? updatedAssessment : a)),
//       );

//       showSnackbar('Payment processed successfully', 'success');
//     } catch (error) {
//       showSnackbar(error.message, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   const clearFilters = () => {
//     setSearch('');
//     setTaxYear('');
//     setTaxType('');
//     setStatus('');
//   };

//   if (!taxpayer || loading) return <LinearProgress sx={{ width: '100%' }} />;

//   return (
//     <Box p={3}>
//       {/* Taxpayer Profile Header */}
//       <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
//         <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
//           <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }}>
//             <Business sx={{ fontSize: 40 }} />
//           </Avatar>
//           <Box flexGrow={1}>
//             <Typography variant="h4">{taxpayer.Name}</Typography>
//             <Stack direction="row" spacing={2} alignItems="center" mt={1} flexWrap="wrap">
//               <Chip label={`TIN: ${taxpayer.TIN}`} size="small" variant="outlined" />
//               <Chip label={taxpayer.Type} size="small" color="info" />
//               <Chip label={taxpayer.BusinessCategory} size="small" />
//               <Chip
//                 label={`Status: ${taxpayer.Status}`}
//                 color={taxpayer.Status === 'Active' ? 'success' : 'error'}
//                 size="small"
//               />
//             </Stack>
//           </Box>
//           <Box textAlign={{ xs: 'left', md: 'right' }}>
//             <Typography variant="body2" color="text.secondary">
//               Registered: {formatDate(taxpayer.RegisteredDate)}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {taxpayer.RegistrationAddress}
//             </Typography>
//           </Box>
//         </Stack>
//       </Paper>
//       {/* Summary Cards */}
//       <Grid container spacing={2} mb={3}>
//         {[
//           { title: 'Total Assessments', value: assessments.length, color: 'primary' },
//           {
//             title: 'Paid',
//             value: assessments.filter((a) => a.Status === 'Paid').length,
//             color: 'success',
//           },
//           {
//             title: 'Pending',
//             value: assessments.filter((a) => a.Status === 'Pending').length,
//             color: 'warning',
//           },
//           {
//             title: 'Overdue',
//             value: assessments.filter(
//               (a) => a.status === 'Pending' && new Date(a.DueDate) < new Date(),
//             ).length,
//             color: 'error',
//           },
//         ].map((metric, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Card sx={{ height: '100%', borderRadius: 2 }}>
//               <CardContent>
//                 <Stack direction="row" alignItems="center" spacing={2}>
//                   <Avatar sx={{ bgcolor: `${metric.color}.light` }}>
//                     {metric.title === 'Total Assessments' ? (
//                       <Receipt color={metric.color} />
//                     ) : (
//                       <Warning color={metric.color} />
//                     )}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="subtitle2" color="text.secondary">
//                       {metric.title}
//                     </Typography>
//                     <Typography variant="h4" color={`${metric.color}.main`}>
//                       {metric.value}
//                     </Typography>
//                   </Box>
//                 </Stack>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       {/* Search and Filters */}
//       <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={4}>
//             <TextField
//               fullWidth
//               label="Search assessments"
//               variant="outlined"
//               size="small"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={6} sm={4} md={2}>
//             <Select
//               fullWidth
//               size="small"
//               value={taxYear}
//               onChange={(e) => setTaxYear(e.target.value)}
//               displayEmpty
//             >
//               <MenuItem value="">All Years</MenuItem>
//               {years.map((year) => (
//                 <MenuItem key={year} value={year}>
//                   {year}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Grid>
//           <Grid item xs={6} sm={4} md={2}>
//             <Select
//               fullWidth
//               size="small"
//               value={taxType}
//               onChange={(e) => setTaxType(e.target.value)}
//               displayEmpty
//             >
//               <MenuItem value="">All Types</MenuItem>
//               {taxTypes.map((type) => (
//                 <MenuItem key={type} value={type}>
//                   {type}
//                 </MenuItem>
//               ))}
//             </Select>
//           </Grid>
//           <Grid item xs={6} sm={4} md={2}>
//             <Select
//               fullWidth
//               size="small"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               displayEmpty
//             >
//               <MenuItem value="">All Statuses</MenuItem>
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="Paid">Paid</MenuItem>
//               <MenuItem value="Overdue">Overdue</MenuItem>
//             </Select>
//           </Grid>
//           <Grid item xs={6} sm={4} md={1}>
//             <Tooltip title="Clear Filters">
//               <IconButton onClick={clearFilters}>
//                 <FilterList />
//               </IconButton>
//             </Tooltip>
//           </Grid>
//         </Grid>
//       </Paper>
//       {/* Action Bar */}
//       <Box display="flex" justifyContent="space-between" mb={2}>
//         <Box>
//           <Button
//             variant={viewMode === 'list' ? 'contained' : 'outlined'}
//             onClick={() => setViewMode('list')}
//             sx={{ mr: 1 }}
//           >
//             List View
//           </Button>
//           <Button
//             variant={viewMode === 'chart' ? 'contained' : 'outlined'}
//             onClick={() => setViewMode('chart')}
//           >
//             Chart View
//           </Button>
//         </Box>
//         <Stack direction="row" spacing={1}>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleCreate}
//             sx={{ borderRadius: 2 }}
//           >
//             New Assessment
//           </Button>
//           <Button variant="outlined" startIcon={<Print />} sx={{ borderRadius: 2 }}>
//             Print
//           </Button>
//           <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 2 }}>
//             Export
//           </Button>
//         </Stack>
//       </Box>
//       {/* Assessments Table */}
//       <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
//         <Table>
//           <TableHead sx={{ bgcolor: 'background.default' }}>
//             <TableRow>
//               <TableCell>Reference</TableCell>
//               <TableCell>Year</TableCell>
//               <TableCell>Type</TableCell>
//               <TableCell align="right">Amount</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Due Date</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredAssessments.map((assessment) => (
//               <TableRow key={assessment.ID} hover>
//                 <TableCell>
//                   <Stack direction="row" alignItems="center">
//                     <Typography fontWeight="bold">{assessment.ID}</Typography>
//                     {assessment.status === 'Paid' && (
//                       <Verified color="success" fontSize="small" sx={{ ml: 1 }} />
//                     )}
//                   </Stack>
//                 </TableCell>
//                 <TableCell>{assessment.Year}</TableCell>
//                 <TableCell>{assessment.TaxType}</TableCell>
//                 <TableCell align="right">
//                   {formatCurrency(assessment.Amount, assessment.currency)}
//                 </TableCell>
//                 <TableCell>
//                   <Chip
//                     label={assessment.status}
//                     size="small"
//                     color={statusColors[assessment.Status] || 'default'}
//                     icon={getStatusIcon(assessment.Status)}
//                   />
//                 </TableCell>
//                 <TableCell>{formatDate(assessment.DueDate)}</TableCell>
//                 <TableCell align="center">
//                   <Stack direction="row" spacing={1} justifyContent="center">
//                     <Tooltip title="Edit">
//                       <IconButton size="small" color="info" onClick={() => handleEdit(assessment)}>
//                         <Edit fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                     {assessment.status !== 'Paid' && (
//                       <Tooltip title="Mark as Paid">
//                         <IconButton
//                           size="small"
//                           color="primary"
//                           onClick={() => handlePayment(assessment)}
//                         >
//                           <Payment fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                     )}
//                     <Tooltip title="Delete">
//                       <IconButton
//                         size="small"
//                         color="error"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setSelected([assessment.ID]);
//                           setOpenDeleteDialog(true);
//                         }}
//                       >
//                         <Delete fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                   </Stack>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         {filteredAssessments.length === 0 && (
//           <Box p={4} textAlign="center">
//             <Typography variant="h6" color="text.secondary">
//               No assessments found
//             </Typography>
//           </Box>
//         )}
//       </TableContainer>
//       {/* Assessment Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>{isEditing ? 'Edit Assessment' : 'Create New Assessment'}</DialogTitle>
//         <DialogContent dividers>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Year"
//                 value={formData.year}
//                 onChange={(e) => setFormData({ ...formData, year: e.target.value })}
//               >
//                 {years.map((year) => (
//                   <MenuItem key={year} value={year}>
//                     {year}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Tax Type"
//                 value={formData.taxType}
//                 onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
//               >
//                 {taxTypes.map((type) => (
//                   <MenuItem key={type} value={type}>
//                     {type}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Amount"
//                 type="number"
//                 value={formData.amount}
//                 onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">{formData.currency}</InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Due Date"
//                 type="date"
//                 InputLabelProps={{ shrink: true }}
//                 value={formData.dueDate}
//                 onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Description"
//                 multiline
//                 rows={3}
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={!formData.amount || !formData.description}
//           >
//             {isEditing ? 'Update' : 'Create'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//       {/* Delete Dialog*/}
//       <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
//         <DialogTitle sx={{ bgcolor: '#D32F2F', color: 'white' }}>Confirm Deletion</DialogTitle>
//         <DialogContent sx={{ p: 3 }}>
//           <Typography>
//             Are you sure you want to delete {selected.length} taxpayer(s)? This action cannot be
//             undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={() => setOpenDeleteDialog(false)} disabled={isDeleting}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleDeleteTaxpayers}
//             disabled={isDeleting}
//             startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
//           >
//             {isDeleting ? 'Deleting...' : 'Confirm Delete'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//       //USE THIS DIALOG FOR CREATING AND UPDATING
//       <DialogActions sx={{ p: 3 }}>
//         <Button onClick={onClose} sx={{ color: '#002855' }} disabled={loading}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           sx={{
//             bgcolor: '#002855',
//             '&:hover': { bgcolor: '#001B3D' },
//             color: 'white',
//           }}
//         >
//           {loading ? (
//             <CircularProgress size={24} color="inherit" />
//           ) : taxpayer ? (
//             'Update Taxpayer'
//           ) : (
//             'Register Taxpayer'
//           )}
//         </Button>
//       </DialogActions>
//     </Box>
//   );
// }

/*for delete onClick={() => handleDelete(assessment.ID)}*/

//hiI kodi ya chini  i nachangamoto ya laoding naenda kunyoa narudi

export default function TaxpayerDashboard() {
  const [taxpayer, setTaxpayer] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [search, setSearch] = useState('');
  const [taxYear, setTaxYear] = useState('');
  const [taxType, setTaxType] = useState('');
  const [status, setStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [Tin, setTin] = useState('');
  const [blockChainTpId, setblockChainTpId] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [formLoading, setFormLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [formData, setFormData] = useState({
    id: 1,
    tin: '123456789',
    taxType: 'Income Tax',
    year: 2024,
    amount: 1200000,
    currency: 'TZS',
    status: 'Pending',
    createdBy: 'TRA Officer',
    description: 'Annual income tax for 2025',
    dueDate: '2025-06-30',
  });

  const years = [2023, 2024, 2025];
  const taxTypes = ['Income Tax', 'VAT', 'Corporate Tax', 'Excise Duty'];
  const statusColors = {
    Pending: 'warning',
    Paid: 'success',
    Overdue: 'error',
  };

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const url = new URL(window.location.href);
        const id = url.pathname.split('/').pop();
        setblockChainTpId(id);
        // Use the correct assessment endpoint: /api/tax-assessments/:id
        const response = await fetch(`http://localhost:3000/api/tax-assessments/${id}`);
        if (!response.ok) throw new Error('Failed to fetch assessment');
        const data = await response.json();
        // Response structure: { success: true, taxAssessment: {...} }
        const assessment = data.taxAssessment || data.data || data;
        if (assessment.Tin) {
          // Fetch taxpayer info using TIN
          const taxpayerResponse = await fetch(`http://localhost:3000/taxpayers`);
          if (taxpayerResponse.ok) {
            const taxpayerData = await taxpayerResponse.json();
            const foundTaxpayer = taxpayerData.taxpayers?.find((tp) => tp.TIN === assessment.Tin);
            if (foundTaxpayer) {
              setTaxpayer(foundTaxpayer);
            }
          }
        }
        // Store assessment data for display
        setAssessments([assessment]);
      } catch (error) {
        showSnackbar(error.message, 'error');
      }
    };

    fetchAssessment();
  }, []);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (taxpayer?.TIN) {
        try {
          setLoading(true);
          setTin(taxpayer.TIN);
          const response = await fetch(
            `http://localhost:3000/api/tax-assessments/tin/${taxpayer.TIN}`,
          );
          const data = await response.json();
          setAssessments(data.assessments);
        } catch (error) {
          showSnackbar('Error loading assessments', 'error');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssessments();
  }, [taxpayer]);

  const filteredAssessments = (assessments || []).filter((a) => {
    const searchLower = search.toLowerCase();
    const idMatch = a.ID && a.ID.toLowerCase().includes(searchLower);
    const taxTypeMatch = a.TaxType && a.TaxType.toLowerCase().includes(searchLower);
    const descriptionMatch = a.Description && a.Description.toLowerCase().includes(searchLower);

    return (
      (idMatch || taxTypeMatch || descriptionMatch) &&
      (taxYear ? a.Year.toString() === taxYear : true) &&
      (taxType ? a.TaxType === taxType : true) &&
      (status ? a.Status === status : true)
    );
  });

  const handleCreate = () => {
    setCurrentAssessment(null);
    setIsEditing(false);
    setFormData({
      id: generateRandomAssessmentId(),
      tin: Tin,
      taxType: 'Income Tax',
      year: 2024,
      amount: '',
      description: '',
      dueDate: '',
      status: 'Pending',
      currency: 'TZS',
      createdBy: 'TRA Officer',
    });
    setOpenDialog(true);
  };

  const generateRandomAssessmentId = () => {
    return `TAX-${Math.floor(10000 + Math.random() * 90000)}`;
  };

  const handleEdit = (assessment) => {
    setCurrentAssessment(assessment);
    setIsEditing(true);
    setFormData({
      id: assessment.ID,
      tin: assessment.Tin,
      taxType: assessment.TaxType,
      year: assessment.Year.toString(),
      amount: assessment.Amount.toString(),
      description: assessment.Description,
      dueDate: assessment.DueDate?.split('T')[0] || '',
      status: assessment.Status,
      currency: assessment.Currency,
      createdBy: assessment.CreatedBy,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (assessmentId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/tax-assessments/${assessmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete assessment');

      setAssessments((prev) => prev.filter((a) => a.ID !== assessmentId));
      showSnackbar('Assessment deleted successfully', 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setFormLoading(true);
      const payload = {
        ...formData,
        id: isEditing ? formData.id : generateRandomAssessmentId(),
        tin: taxpayer.TIN,
        amount: Number(formData.amount),
        year: Number(formData.year),
      };

      const url = isEditing
        ? `http://localhost:3000/api/tax-assessments/${formData.id}`
        : 'http://localhost:3000/api/tax-assessments';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} assessment`);

      const result = await response.json();
      const updatedAssessment = result.taxAssessment;

      setAssessments((prev) =>
        isEditing
          ? prev.map((a) => (a.ID === updatedAssessment.ID ? updatedAssessment : a))
          : [...prev, updatedAssessment],
      );
      showSnackbar(`Assessment ${isEditing ? 'updated' : 'created'} successfully`, 'success');
      setOpenDialog(false);
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handlePayment = async (assessment) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/tax-assessments/${assessment.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...assessment, status: 'Paid' }),
      });

      if (!response.ok) throw new Error('Payment processing failed');

      const updatedAssessment = await response.json();

      setAssessments((prev) =>
        prev.map((a) => (a.ID === updatedAssessment.ID ? updatedAssessment : a)),
      );

      showSnackbar('Payment processed successfully', 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const clearFilters = () => {
    setSearch('');
    setTaxYear('');
    setTaxType('');
    setStatus('');
  };

  if (!taxpayer || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Taxpayer Profile Header */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80 }}>
            <Business sx={{ fontSize: 40 }} />
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h4">{taxpayer.Name}</Typography>
            <Stack direction="row" spacing={2} alignItems="center" mt={1} flexWrap="wrap">
              <Chip label={`TIN: ${taxpayer.TIN}`} size="small" variant="outlined" />
              <Chip label={taxpayer.Type} size="small" color="info" />
              <Chip label={taxpayer.BusinessCategory} size="small" />
              <Chip
                label={`Status: ${taxpayer.Status}`}
                color={taxpayer.Status === 'Active' ? 'success' : 'error'}
                size="small"
              />
            </Stack>
          </Box>
          <Box textAlign={{ xs: 'left', md: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Registered: {taxpayer.RegisteredDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {taxpayer.RegistrationAddress}
            </Typography>
          </Box>
        </Stack>
      </Paper>
      {/* Summary Cards */}*{/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        {[
          { title: 'Total Assessments', value: assessments.length, color: 'primary' },
          {
            title: 'Paid',
            value: assessments.filter((a) => a.Status === 'Paid').length,
            color: 'success',
          },
          {
            title: 'Pending',
            value: assessments.filter((a) => a.Status === 'Pending').length,
            color: 'warning',
          },
          {
            title: 'Overdue',
            value: assessments.filter(
              (a) => a.status === 'Pending' && new Date(a.DueDate) < new Date(),
            ).length,
            color: 'error',
          },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: `${metric.color}.light` }}>
                    {metric.title === 'Total Assessments' ? (
                      <Receipt color={metric.color} />
                    ) : (
                      <Warning color={metric.color} />
                    )}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" color={`${metric.color}.main`}>
                      {metric.value}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Search and Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search assessments"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Select
              fullWidth
              size="small"
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Years</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Select
              fullWidth
              size="small"
              value={taxType}
              onChange={(e) => setTaxType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Types</MenuItem>
              {taxTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Select
              fullWidth
              size="small"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6} sm={4} md={1}>
            <Tooltip title="Clear Filters">
              <IconButton onClick={clearFilters}>
                <FilterList />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
      {/* Action Bar */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('list')}
            sx={{ mr: 1 }}
          >
            List View
          </Button>
          <Button
            variant={viewMode === 'chart' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('chart')}
          >
            Chart View
          </Button>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{ borderRadius: 2 }}
          >
            New Assessment
          </Button>
          <Button variant="outlined" startIcon={<Print />} sx={{ borderRadius: 2 }}>
            Print
          </Button>
          <Button variant="outlined" startIcon={<Download />} sx={{ borderRadius: 2 }}>
            Export
          </Button>
        </Stack>
      </Box>
      {/* Assessments Table */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssessments.map((assessment) => (
              <TableRow key={assessment.ID} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center">
                    <Typography fontWeight="bold">{assessment.ID}</Typography>
                    {assessment.status === 'Paid' && (
                      <Verified color="success" fontSize="small" sx={{ ml: 1 }} />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>{assessment.Year}</TableCell>
                <TableCell>{assessment.TaxType}</TableCell>
                <TableCell align="right">
                  {assessment.Amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'TZS',
                  })}
                </TableCell>
                <TableCell>
                  <Chip
                    label={assessment.Status}
                    size="small"
                    color={statusColors[assessment.Satus] || 'default'}
                  />
                </TableCell>
                <TableCell>{new Date(assessment.DueDate).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" color="info" onClick={() => handleEdit(assessment)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected([assessment.ID]);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredAssessments.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              No assessments found
            </Typography>
          </Box>
        )}
      </TableContainer>
      {/* Assessment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Assessment' : 'Create New Assessment'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tax Type"
                value={formData.taxType}
                onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
              >
                {taxTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{formData.currency}</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={formLoading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={formLoading}>
            {formLoading ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={20} color="inherit" />
                <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
              </Stack>
            ) : isEditing ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ bgcolor: '#D32F2F', color: 'white' }}>Confirm Deletion</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>
            Are you sure you want to delete {selected.length} assessment(s)? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await Promise.all(selected.map((id) => handleDelete(id)));
              setSelected([]);
              showSnackbar('Assessment(s) deleted successfully', 'success');
              setOpenDeleteDialog(false);
            }}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={20} color="inherit" />
                <span>Deleting...</span>
              </Stack>
            ) : (
              'Confirm Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
