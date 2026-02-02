import React from 'react';
import { Box, CardContent, Chip, Paper, Stack, Typography, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LedgerImg from '../../../assets/images/new_images/ledger.png'; // replace with TRA-related image

const contracts = [
  {
    contract: 'InvoiceContract',
    executions: '14,320',
    performance: 85,
    color: 'primary',
  },
  {
    contract: 'TaxpayerContract',
    executions: '9,870',
    performance: 65,
    color: 'secondary',
  },
];

const TopSmartContracts = () => {
  const theme = useTheme();
  const secondarylight = theme.palette.secondary.light;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  const borderColor = theme.palette.grey[100];

  return (
    <Paper sx={{ bgcolor: 'primary.main', border: `1px solid ${borderColor}` }} variant="outlined">
      <CardContent>
        <Typography variant="h5" color="white">
          Most Used Smart Contracts
        </Typography>
        <Typography variant="subtitle1" color="white" mb={4}>
          Execution Stats • 2025
        </Typography>

        <Box textAlign="center" mt={2} mb="-90px">
          <img src={LedgerImg} alt="Ledger Chart" width={'260px'} height={'210'} />
        </Box>
      </CardContent>

      <Paper sx={{ overflow: 'hidden', zIndex: '1', position: 'relative', margin: '10px' }}>
        <Box p={3}>
          <Stack spacing={3}>
            {contracts.map((item, index) => (
              <Box key={index}>
                <Stack
                  direction="row"
                  spacing={2}
                  mb={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6">{item.contract}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {item.executions} executions
                    </Typography>
                  </Box>
                  <Chip
                    sx={{
                      backgroundColor: item.color === 'primary' ? primarylight : secondarylight,
                      color: item.color === 'primary' ? primary : secondary,
                      borderRadius: '4px',
                      width: 55,
                      height: 24,
                    }}
                    label={item.performance + '%'}
                  />
                </Stack>
                <LinearProgress value={item.performance} variant="determinate" color={item.color} />
              </Box>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Paper>
  );
};

export default TopSmartContracts;
