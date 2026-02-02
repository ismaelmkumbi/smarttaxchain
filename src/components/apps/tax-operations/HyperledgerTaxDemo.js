// Hyperledger Fabric Tax Operations Demo
// Revolutionary demonstration for TRA management

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  LinearProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  ListItemIcon,
} from '@mui/material';
import {
  IconActivity,
  IconAlertCircle,
  IconAlertTriangle,
  IconApi,
  IconBrain,
  IconBriefcase,
  IconBug,
  IconBuilding,
  IconBuildingBank,
  IconCalculator,
  IconCalendar,
  IconCertificate,
  IconChartArea,
  IconChartBar,
  IconCheck,
  IconClock,
  IconCloud,
  IconCode,
  IconCreditCard,
  IconDatabase,
  IconDeviceMobile,
  IconDownload,
  IconFile,
  IconFileText,
  IconFilter,
  IconFingerprint,
  IconFlask,
  IconFunction,
  IconGavel,
  IconHelp,
  IconInfoCircle,
  IconKey,
  IconLock,
  IconNetwork,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerStop,
  IconQrcode,
  IconReceipt,
  IconRefresh,
  IconReport,
  IconScale,
  IconSchool,
  IconSearch,
  IconServer,
  IconSettings,
  IconShield,
  IconShieldCheck,
  IconShieldLock,
  IconShieldOff,
  IconShieldX,
  IconTools,
  IconTrendingDown,
  IconTrendingUp,
  IconUpload,
  IconUsers,
  IconWallet,
  IconWorld,
  IconX,
} from '@tabler/icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import hyperledgerService from '../../../services/hyperledgerFabricService';

const HyperledgerTaxDemo = () => {
  const theme = useTheme();
  const [activeDemo, setActiveDemo] = useState('network');
  const [demoRunning, setDemoRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [demoData, setDemoData] = useState({});
  const [transactionLog, setTransactionLog] = useState([]);
  const [complianceScore, setComplianceScore] = useState(85);
  const [fraudAlerts, setFraudAlerts] = useState([]);

  // Demo scenarios
  const demoScenarios = {
    network: {
      title: 'Network Infrastructure',
      description: 'Hyperledger Fabric network setup and organization management',
      icon: <IconNetwork size={24} />,
      color: theme.palette.primary.main,
      steps: [
        'Initialize TRA network with 4 organizations',
        'Deploy smart contracts across all peers',
        'Establish consensus mechanism (Raft)',
        'Configure channel policies and permissions',
      ],
    },
    taxpayer: {
      title: 'Taxpayer Registration',
      description: 'Blockchain-based taxpayer identity management',
      icon: <IconUsers size={24} />,
      color: theme.palette.success.main,
      steps: [
        'Verify taxpayer identity with NIDA',
        'Create digital identity on blockchain',
        'Assign compliance score and risk level',
        'Generate immutable audit trail',
      ],
    },
    vat: {
      title: 'VAT Transaction Processing',
      description: 'Real-time VAT calculation and processing',
      icon: <IconReceipt size={24} />,
      color: theme.palette.info.main,
      steps: [
        'Record VAT transaction on blockchain',
        'Validate EFD signature and receipt',
        'Calculate compliance score in real-time',
        'Generate automated audit trail',
      ],
    },
    compliance: {
      title: 'AI-Powered Compliance',
      description: 'Machine learning-based compliance monitoring',
      icon: <IconBrain size={24} />,
      color: theme.palette.warning.main,
      steps: [
        'Analyze transaction patterns',
        'Detect fraud indicators',
        'Calculate risk scores',
        'Generate compliance recommendations',
      ],
    },
    audit: {
      title: 'Immutable Audit Trail',
      description: 'Complete transaction history and verification',
      icon: <IconShield size={24} />,
      color: theme.palette.error.main,
      steps: [
        'Record all transactions on blockchain',
        'Verify data integrity',
        'Generate audit reports',
        'Enable public transparency',
      ],
    },
  };

  useEffect(() => {
    if (demoRunning) {
      const interval = setInterval(() => {
        runDemoStep();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [demoRunning, activeDemo, currentStep]);

  const runDemoStep = async () => {
    const scenario = demoScenarios[activeDemo];

    if (currentStep < scenario.steps.length) {
      // Simulate step execution
      const stepResult = await executeDemoStep(activeDemo, currentStep);

      setTransactionLog((prev) => [
        {
          timestamp: new Date().toISOString(),
          step: scenario.steps[currentStep],
          result: stepResult,
          status: 'SUCCESS',
        },
        ...prev.slice(0, 9),
      ]);

      setCurrentStep((prev) => prev + 1);
    } else {
      // Demo completed
      setDemoRunning(false);
      setCurrentStep(0);
    }
  };

  const executeDemoStep = async (demoType, step) => {
    switch (demoType) {
      case 'network':
        return await executeNetworkStep(step);
      case 'taxpayer':
        return await executeTaxpayerStep(step);
      case 'vat':
        return await executeVATStep(step);
      case 'compliance':
        return await executeComplianceStep(step);
      case 'audit':
        return await executeAuditStep(step);
      default:
        return { success: true, message: 'Step completed' };
    }
  };

  const executeNetworkStep = async (step) => {
    switch (step) {
      case 0:
        return {
          success: true,
          message: 'Network initialized with TRA, Banks, Businesses, and Auditors organizations',
          data: { organizations: 4, peers: 12, orderers: 3 },
        };
      case 1:
        return {
          success: true,
          message:
            'Smart contracts deployed: TaxpayerRegistry, VATManagement, ComplianceMonitoring',
          data: { contracts: 6, functions: 24 },
        };
      case 2:
        return {
          success: true,
          message: 'Raft consensus mechanism established with 3 orderer nodes',
          data: { consensus: 'Raft', orderers: 3 },
        };
      case 3:
        return {
          success: true,
          message: 'Channel policies configured with role-based access control',
          data: { policies: 8, permissions: 16 },
        };
      default:
        return { success: true, message: 'Network step completed' };
    }
  };

  const executeTaxpayerStep = async (step) => {
    switch (step) {
      case 0:
        return {
          success: true,
          message: 'Taxpayer identity verified with NIDA system',
          data: { nationalId: '1234567890123456', verificationHash: 'hash-abc123' },
        };
      case 1:
        return {
          success: true,
          message: 'Digital identity created on blockchain with unique address',
          data: { blockchainAddress: '0x1234567890abcdef', tin: '145288-TZ' },
        };
      case 2:
        return {
          success: true,
          message: 'Initial compliance score calculated: 100/100 (LOW RISK)',
          data: { complianceScore: 100, riskLevel: 'LOW' },
        };
      case 3:
        return {
          success: true,
          message: 'Immutable audit trail generated for taxpayer registration',
          data: { auditTrail: 1, transactionId: 'tx-reg-123' },
        };
      default:
        return { success: true, message: 'Taxpayer step completed' };
    }
  };

  const executeVATStep = async (step) => {
    switch (step) {
      case 0:
        return {
          success: true,
          message: 'VAT transaction recorded on blockchain with EFD integration',
          data: { amount: 1000000, vatAmount: 180000, transactionId: 'tx-vat-456' },
        };
      case 1:
        return {
          success: true,
          message: 'EFD signature validated and digital receipt verified',
          data: { efdSignature: 'sig-efd-789', receiptHash: 'hash-receipt-abc' },
        };
      case 2:
        return {
          success: true,
          message: 'Real-time compliance score updated: 92/100',
          data: { newScore: 92, change: '+2' },
        };
      case 3:
        return {
          success: true,
          message: 'Automated audit trail entry created with blockchain proof',
          data: { auditEntry: 1, blockNumber: 15421 },
        };
      default:
        return { success: true, message: 'VAT step completed' };
    }
  };

  const executeComplianceStep = async (step) => {
    switch (step) {
      case 0:
        return {
          success: true,
          message: 'Transaction patterns analyzed using AI algorithms',
          data: { patterns: 15, anomalies: 2 },
        };
      case 1:
        return {
          success: true,
          message: 'Fraud indicators detected: Unusual transaction patterns',
          data: { fraudIndicators: 1, riskScore: 75 },
        };
      case 2:
        return {
          success: true,
          message: 'Risk score calculated: 75/100 (MEDIUM RISK)',
          data: { riskScore: 75, riskLevel: 'MEDIUM' },
        };
      case 3:
        return {
          success: true,
          message: 'Compliance recommendations generated',
          data: { recommendations: 3, nextAudit: '2024-05-15' },
        };
      default:
        return { success: true, message: 'Compliance step completed' };
    }
  };

  const executeAuditStep = async (step) => {
    switch (step) {
      case 0:
        return {
          success: true,
          message: 'All transactions recorded on immutable blockchain',
          data: { transactions: 15420, blocks: 1542 },
        };
      case 1:
        return {
          success: true,
          message: 'Data integrity verified with cryptographic proofs',
          data: { integrityChecks: 100, verified: true },
        };
      case 2:
        return {
          success: true,
          message: 'Comprehensive audit report generated',
          data: { reportPages: 25, findings: 0 },
        };
      case 3:
        return {
          success: true,
          message: 'Public transparency enabled through blockchain explorer',
          data: { publicAccess: true, explorerUrl: 'explorer.tra.gov.tz' },
        };
      default:
        return { success: true, message: 'Audit step completed' };
    }
  };

  const startDemo = () => {
    setDemoRunning(true);
    setCurrentStep(0);
    setTransactionLog([]);
  };

  const stopDemo = () => {
    setDemoRunning(false);
    setCurrentStep(0);
  };

  const resetDemo = () => {
    setDemoRunning(false);
    setCurrentStep(0);
    setTransactionLog([]);
    setComplianceScore(85);
    setFraudAlerts([]);
  };

  const DemoScenarioCard = ({ scenario, scenarioKey }) => (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border:
          activeDemo === scenarioKey ? `3px solid ${scenario.color}` : '1px solid transparent',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
      onClick={() => setActiveDemo(scenarioKey)}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: scenario.color, width: 48, height: 48, mr: 2 }}>
            {scenario.icon}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" component="div">
              {scenario.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {scenario.description}
            </Typography>
          </Box>
          {activeDemo === scenarioKey && <Chip label="ACTIVE" color="primary" size="small" />}
        </Box>
      </CardContent>
    </Card>
  );

  const DemoProgress = () => {
    const scenario = demoScenarios[activeDemo];
    const progress = (currentStep / scenario.steps.length) * 100;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">{scenario.title} Demo Progress</Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconPlayerPlay size={20} />}
                onClick={startDemo}
                disabled={demoRunning}
              >
                Start
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<IconPlayerStop size={20} />}
                onClick={stopDemo}
                disabled={!demoRunning}
              >
                Stop
              </Button>
              <Button
                variant="outlined"
                color="default"
                startIcon={<IconRefresh size={20} />}
                onClick={resetDemo}
              >
                Reset
              </Button>
            </Box>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4, mb: 2 }}
          />

          <Typography variant="body2" color="text.secondary">
            Step {currentStep + 1} of {scenario.steps.length}:{' '}
            {scenario.steps[currentStep] || 'Demo completed'}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const TransactionLog = () => (
    <Card sx={{ height: '400px' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Live Transaction Log
        </Typography>
        <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
          {transactionLog.map((log, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                background: index === 0 ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {log.step}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {log.result.message}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </Typography>
                  <Chip label={log.status} color="success" size="small" sx={{ mt: 0.5 }} />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const ComplianceMetrics = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Real-time Compliance Metrics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                color={
                  complianceScore >= 80
                    ? 'success.main'
                    : complianceScore >= 60
                    ? 'warning.main'
                    : 'error.main'
                }
              >
                {complianceScore}%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Compliance Score
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h3" color="info.main">
                {fraudAlerts.length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Fraud Alerts
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h3" color="primary.main">
                {transactionLog.length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Transactions
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🚀 Hyperledger Fabric Tax Operations Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Revolutionary blockchain-powered tax administration demonstration for TRA management
      </Typography>

      {/* Demo Scenario Selection */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.entries(demoScenarios).map(([key, scenario]) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={key}>
            <DemoScenarioCard scenario={scenario} scenarioKey={key} />
          </Grid>
        ))}
      </Grid>

      {/* Demo Progress */}
      <DemoProgress />

      <Grid container spacing={3}>
        {/* Transaction Log */}
        <Grid item xs={12} lg={8}>
          <TransactionLog />
        </Grid>

        {/* Compliance Metrics */}
        <Grid item xs={12} lg={4}>
          <ComplianceMetrics />
        </Grid>

        {/* Network Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hyperledger Fabric Network Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      4
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Organizations
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Peers
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      15,420
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Block Height
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      2.3s
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Block Time
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HyperledgerTaxDemo;
