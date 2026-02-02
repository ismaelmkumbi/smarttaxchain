import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  Receipt,
  Warning,
  CheckCircle,
  AutoAwesome,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useTransactionStore from '../../../store/transactionStore';

const TaxpayerPanel = ({ onTransaction }) => {
  const { t } = useTranslation();
  const { addTransaction } = useTransactionStore();
  const [amount, setAmount] = useState('10000');
  const [taxpayerType, setTaxpayerType] = useState('individual');
  const [businessCategory, setBusinessCategory] = useState('retail');
  const [isProcessing, setIsProcessing] = useState(false);

  const businessCategories = {
    retail: { name: t('simulation.retail', 'Retail'), vatRate: 0.18 },
    services: { name: t('simulation.services', 'Services'), vatRate: 0.18 },
    manufacturing: { name: t('simulation.manufacturing', 'Manufacturing'), vatRate: 0.18 },
    hospitality: { name: t('simulation.hospitality', 'Hospitality'), vatRate: 0.18 },
  };

  const generateTransactionData = (isCompliant = true, underreportFactor = 1) => {
    const originalAmount = Number(amount);
    const category = businessCategories[businessCategory];
    const calculatedVAT = Math.round(originalAmount * category.vatRate);
    const reportedVAT = isCompliant 
      ? calculatedVAT 
      : Math.round(calculatedVAT * underreportFactor);
    
    return {
      originalAmount,
      reportedVAT,
      calculatedVAT,
      taxpayerId: `${taxpayerType.toUpperCase()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      businessCategory,
      taxpayerType,
      fraudDetected: !isCompliant,
      vatRate: category.vatRate,
    };
  };

  const processTransaction = async (transactionData) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add to store and trigger parent callback
    const savedTransaction = addTransaction(transactionData);
    onTransaction(savedTransaction);
    
    setIsProcessing(false);
  };

  const handleGenerateSale = () => {
    const transactionData = generateTransactionData(true);
    processTransaction(transactionData);
  };

  const handleUnderreport = () => {
    const underreportFactor = 0.3 + Math.random() * 0.4; // 30-70% of actual VAT
    const transactionData = generateTransactionData(false, underreportFactor);
    processTransaction(transactionData);
  };

  const handleRandomTransaction = () => {
    const isCompliant = Math.random() > 0.2; // 80% compliance rate
    const randomAmount = Math.floor(Math.random() * 50000) + 5000; // 5K-55K TZS
    setAmount(randomAmount.toString());
    
    const transactionData = generateTransactionData(
      isCompliant, 
      isCompliant ? 1 : 0.2 + Math.random() * 0.6
    );
    transactionData.originalAmount = randomAmount;
    transactionData.calculatedVAT = Math.round(randomAmount * businessCategories[businessCategory].vatRate);
    
    processTransaction(transactionData);
  };

  return (
    <Box 
      sx={{ 
        p: 2, 
        border: 1, 
        borderRadius: 2, 
        borderColor: 'grey.300', 
        background: 'white',
        minHeight: 400,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {t('simulation.taxpayerPanel', 'Taxpayer Simulation Interface')}
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        {t('simulation.taxpayerInfo', 'Simulate different taxpayer scenarios to test the Smart Tax Chain system.')}
      </Alert>

      {/* Taxpayer Configuration */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>{t('simulation.taxpayerType', 'Taxpayer Type')}</InputLabel>
          <Select
            value={taxpayerType}
            label={t('simulation.taxpayerType', 'Taxpayer Type')}
            onChange={(e) => setTaxpayerType(e.target.value)}
          >
            <MenuItem value="individual">{t('simulation.individual', 'Individual')}</MenuItem>
            <MenuItem value="business">{t('simulation.business', 'Business')}</MenuItem>
            <MenuItem value="corporation">{t('simulation.corporation', 'Corporation')}</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>{t('simulation.businessCategory', 'Business Category')}</InputLabel>
          <Select
            value={businessCategory}
            label={t('simulation.businessCategory', 'Business Category')}
            onChange={(e) => setBusinessCategory(e.target.value)}
          >
            {Object.entries(businessCategories).map(([key, category]) => (
              <MenuItem key={key} value={key}>
                {category.name} ({(category.vatRate * 100).toFixed(0)}% VAT)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label={t('simulation.saleAmount', 'Sale Amount (TZS)')}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          inputProps={{ min: 0, max: 1000000 }}
          helperText={`${t('simulation.calculatedVat', 'Calculated VAT')}: ${Math.round(Number(amount || 0) * businessCategories[businessCategory].vatRate).toLocaleString()} TZS`}
        />
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Transaction Actions */}
      <Typography variant="subtitle2" gutterBottom>
        {t('simulation.transactionActions', 'Transaction Actions')}
      </Typography>
      
      <Stack spacing={2}>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleGenerateSale}
          disabled={isProcessing}
          startIcon={<CheckCircle />}
          fullWidth
        >
          {isProcessing 
            ? t('simulation.processing', 'Processing...') 
            : t('simulation.generateCompliantSale', 'Generate Compliant Sale')}
        </Button>
        
        <Button 
          variant="outlined" 
          color="warning" 
          onClick={handleUnderreport}
          disabled={isProcessing}
          startIcon={<Warning />}
          fullWidth
        >
          {t('simulation.simulateUnderreport', 'Simulate VAT Underreporting')}
        </Button>
        
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleRandomTransaction}
          disabled={isProcessing}
          startIcon={<AutoAwesome />}
          fullWidth
        >
          {t('simulation.randomTransaction', 'Generate Random Transaction')}
        </Button>
      </Stack>

      {/* Status Indicators */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip 
          icon={<Receipt />} 
          label={`${taxpayerType} - ${businessCategories[businessCategory].name}`}
          size="small"
          variant="outlined"
        />
        <Chip 
          label={`VAT: ${(businessCategories[businessCategory].vatRate * 100).toFixed(0)}%`}
          size="small"
          color="info"
        />
      </Box>
    </Box>
  );
};

TaxpayerPanel.propTypes = {
  onTransaction: PropTypes.func.isRequired,
};

export default TaxpayerPanel;
