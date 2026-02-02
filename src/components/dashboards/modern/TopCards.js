import React from 'react';
import { Box, CardContent, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link, useInRouterContext } from 'react-router-dom';

// Icon imports
import TaxIcon from 'src/assets/images/new_images/tax.png';
import BlockchainIcon from 'src/assets/images/new_images/blockchain.png';
import AuditIcon from 'src/assets/images/new_images/audit.png';
import FraudIcon from 'src/assets/images/new_images/fraud.png';
import VatIcon from 'src/assets/images/new_images/vat.png';
import ContractIcon from 'src/assets/images/new_images/smart_contract.png';

const topcards = [
  {
    icon: TaxIcon,
    title: 'Total Tax Collected',
    digits: '12.4B TZS',
    caption: 'Last 30 days',
    color: 'primary',
    route: '/tax-collection',
  },
  {
    icon: BlockchainIcon,
    title: 'Blockchain Transactions',
    digits: '358K',
    caption: 'On-chain verified',
    color: 'primary',
    route: '/transactions',
  },
  {
    icon: AuditIcon,
    title: 'Pending Audits',
    digits: '1,230',
    caption: 'Awaiting review',
    color: 'warning',
    route: '/audits',
  },
  // {
  //   icon: FraudIcon,
  //   title: 'Fraud Cases Detected',
  //   digits: '89',
  //   caption: 'AI-detected cases',
  //   color: 'error',
  //   route: '/fraud-detection',
  // },
  // {
  //   icon: VatIcon,
  //   title: 'VAT Returns Filed',
  //   digits: '24.7K',
  //   caption: 'This month',
  //   color: 'info',
  //   route: '/vat',
  // },
  {
    icon: ContractIcon,
    title: 'Smart Contracts',
    digits: '1,502',
    caption: 'Deployed',
    color: 'secondary',
    route: '/smart-contracts',
  },
];

/**
 * TopCards Component for TRA SmartTax
 * White background cards with colored accent stripe and icon circle
 */
const TopCards = () => {
  const theme = useTheme();
  const inRouter = useInRouterContext();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {topcards.map(({ icon, title, digits, caption, color, route }, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <Box
            component={inRouter ? Link : 'a'}
            to={inRouter ? route : undefined}
            href={!inRouter ? route : undefined}
            sx={{
              display: 'block',
              bgcolor: theme.palette.background.paper,
              borderLeft: `4px solid ${theme.palette[color].main}`,
              textAlign: 'center',
              textDecoration: 'none',
              borderRadius: 2,
              p: 2,
              boxShadow: 1,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
              cursor: 'pointer',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  mx: 'auto',
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette[color].light,
                  borderRadius: '50%',
                }}
              >
                <Box component="img" src={icon} alt={`${title} icon`} width={24} height={24} />
              </Box>
              <Typography color="textPrimary" variant="subtitle1" fontWeight={600} noWrap>
                {title}
              </Typography>
              <Typography color="textPrimary" variant="h4" fontWeight={700} noWrap gutterBottom>
                {digits}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {caption}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
