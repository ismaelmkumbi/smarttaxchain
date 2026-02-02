import React from 'react';
import { TextField, Box } from '@mui/material';

export const TaxpayerSearch = ({ search, setSearch }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label="Search Taxpayers by Name or TIN"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Box>
  );
};
