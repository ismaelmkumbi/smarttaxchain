import React from 'react';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import {
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TableContainer,
  Stack,
} from '@mui/material';
import TopPerformerData from './TopPerformerData';

const performers = [
  {
    id: 1,
    imgsrc: 'path_to_avatar_image', // Replace with actual image paths
    name: 'John Doe',
    post: 'Blockchain Developer',
    pname: 'InvoiceContract',
    status: 'High', // Urgency Level
    budget: '12.5', // Replace with actual budget or gas cost estimates
    auditScore: '9.2',
  },
  {
    id: 2,
    imgsrc: 'path_to_avatar_image', // Replace with actual image paths
    name: 'Asha Mussa',
    post: 'Blockchain Developer',
    pname: 'TaxpayerContract',
    status: 'Medium',
    budget: '7.1',
    auditScore: '8.7',
  },
  {
    id: 3,
    imgsrc: 'path_to_avatar_image', // Replace with actual image paths
    name: 'Peter Kimaro',
    post: 'Smart Contract Auditor',
    pname: 'AuditContract',
    status: 'Low',
    budget: '5.3',
    auditScore: '7.5',
  },
  // Add more performers/contracts here as needed
];

const TopPerformers = () => {
  // for select
  const [month, setMonth] = React.useState('1');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <DashboardCard
      title="Top Blockchain Contracts"
      subtitle="TRA Smart Contract Performance"
      action={
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small"
          value={month}
          onChange={handleChange}
        >
          <MenuItem value={1}>March 2025</MenuItem>
          <MenuItem value={2}>April 2025</MenuItem>
          <MenuItem value={3}>May 2025</MenuItem>
        </CustomSelect>
      }
    >
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Assigned
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Contract
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Urgency Level
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Audit Score
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {performers.map((basic) => (
              <TableRow key={basic.id}>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Avatar src={basic.imgsrc} alt={basic.imgsrc} sx={{ width: 40, height: 40 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {basic.name}
                      </Typography>
                      <Typography color="textSecondary" fontSize="12px" variant="subtitle2">
                        {basic.post}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {basic.pname}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      bgcolor:
                        basic.status === 'High'
                          ? (theme) => theme.palette.error.light
                          : basic.status === 'Medium'
                          ? (theme) => theme.palette.warning.light
                          : basic.status === 'Low'
                          ? (theme) => theme.palette.success.light
                          : (theme) => theme.palette.secondary.light,
                      color:
                        basic.status === 'High'
                          ? (theme) => theme.palette.error.main
                          : basic.status === 'Medium'
                          ? (theme) => theme.palette.warning.main
                          : basic.status === 'Low'
                          ? (theme) => theme.palette.success.main
                          : (theme) => theme.palette.secondary.main,
                      borderRadius: '8px',
                    }}
                    size="small"
                    label={basic.status}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{basic.auditScore}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default TopPerformers;
