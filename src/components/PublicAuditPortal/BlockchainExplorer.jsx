import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Box,
} from '@mui/material';
import { blockchainStats } from './mockBlockchainData';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LayersIcon from '@mui/icons-material/Layers';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DataDownloader from './DataDownloader';

const TRA_YELLOW = '#f5e800';
const TRA_BLACK = '#000000';
const TRA_WHITE = '#ffffff';

const BlockchainExplorer = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h4" gutterBottom>
      Blockchain Explorer
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Public, aggregated blockchain metrics. No access to individual wallets or receipts.
    </Typography>
    <Box sx={{ mb: 2 }}>
      <DataDownloader
        data={blockchainStats.recentBlocks}
        filename="blockchain_blocks"
        title="Blockchain Recent Blocks"
      />
    </Box>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card role="region" aria-label="Total Blocks">
          <CardContent>
            <Tooltip title="Total number of blocks in the blockchain">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LayersIcon color="primary" />
                <Typography variant="h6">Total Blocks</Typography>
              </Box>
            </Tooltip>
            <Typography variant="h4">{blockchainStats.totalBlocks.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card role="region" aria-label="Total Transactions">
          <CardContent>
            <Tooltip title="Total number of transactions recorded">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6">Transactions</Typography>
              </Box>
            </Tooltip>
            <Typography variant="h4">
              {blockchainStats.totalTransactions.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card role="region" aria-label="Active Nodes">
          <CardContent>
            <Tooltip title="Number of active nodes in the network">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleAltIcon color="primary" />
                <Typography variant="h6">Active Nodes</Typography>
              </Box>
            </Tooltip>
            <Typography variant="h4">{blockchainStats.activeNodes}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card role="region" aria-label="Network Uptime">
          <CardContent>
            <Tooltip title="Network uptime percentage">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="primary" />
                <Typography variant="h6">Uptime</Typography>
              </Box>
            </Tooltip>
            <Typography variant="h4">{blockchainStats.networkUptime}</Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Block Time: {blockchainStats.avgBlockTime}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
      Recent Blocks
    </Typography>
    <TableContainer
      component={Paper}
      aria-label="Recent Blocks Table"
      sx={{ backgroundColor: TRA_WHITE }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: TRA_YELLOW }}>
            <TableCell sx={{ color: TRA_BLACK, fontWeight: 700 }}>Block Height</TableCell>
            <TableCell sx={{ color: TRA_BLACK, fontWeight: 700 }}>Transactions</TableCell>
            <TableCell sx={{ color: TRA_BLACK, fontWeight: 700 }}>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blockchainStats.recentBlocks.map((block) => (
            <TableRow key={block.height}>
              <TableCell sx={{ color: TRA_BLACK }}>{block.height}</TableCell>
              <TableCell sx={{ color: TRA_BLACK }}>{block.txCount}</TableCell>
              <TableCell sx={{ color: TRA_BLACK }}>
                {new Date(block.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default BlockchainExplorer;
