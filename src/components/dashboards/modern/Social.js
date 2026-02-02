import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Typography, Avatar, Box, AvatarGroup } from '@mui/material';
import { IconMessage2 } from '@tabler/icons';

import DashboardCard from '../../shared/DashboardCard';
import LeadDevImg from '../../../assets/images/profile/user-1.jpg';
import Dev1Img from '../../../assets/images/profile/user-2.jpg';
import Dev2Img from '../../../assets/images/profile/user-3.jpg';
import Dev3Img from '../../../assets/images/profile/user-5.jpg';
import Dev4Img from '../../../assets/images/profile/user-5.jpg';

const LedgerMessageCard = () => {
  return (
    <DashboardCard>
      <>
        <Stack direction="row" spacing={2}>
          <Avatar
            src={LeadDevImg}
            alt="Lead Developer"
            sx={{ borderRadius: '8px', width: 70, height: 70 }}
          />
          <Box>
            <Typography variant="h5">Audit Trail Module Deployed</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              21 April, 2025
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="space-between" mt={5}>
          <AvatarGroup max={4}>
            <Avatar alt="Amina" src={Dev1Img} />
            <Avatar alt="John" src={Dev2Img} />
            <Avatar alt="Musa" src={Dev3Img} />
            <Avatar alt="Farida" src={Dev4Img} />
          </AvatarGroup>
          <Link to="/chain/logs">
            <Box
              width="40px"
              height="40px"
              bgcolor="primary.light"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="8px"
            >
              <Typography
                color="primary.main"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <IconMessage2 width={22} />
              </Typography>
            </Box>
          </Link>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default LedgerMessageCard;
