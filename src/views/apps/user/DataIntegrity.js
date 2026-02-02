// src/views/apps/user/DataIntegrity.js
import { Helmet } from 'react-helmet';
import { Box } from '@mui/material';
import DataIntegrity from 'src/components/apps/user/DataIntegrity';

const DataIntegrityPage = () => {
  return (
    <>
      <Helmet>
        <title>Data Integrity Verification | TRA Tax Chain</title>
      </Helmet>
      <Box>
        <DataIntegrity />
      </Box>
    </>
  );
};

export default DataIntegrityPage;

