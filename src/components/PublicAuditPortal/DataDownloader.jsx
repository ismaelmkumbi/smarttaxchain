import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Typography,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Download as DownloadIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material';

const DataDownloader = ({ data, filename = 'tax_data', title }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const downloadCSV = async () => {
    setLoading(true);
    try {
      // Convert data to CSV format
      if (!data || data.length === 0) {
        showNotification('No data available for download', 'warning');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      showNotification('CSV file downloaded successfully');
    } catch (error) {
      showNotification('Error downloading CSV file', 'error');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const downloadJSON = async () => {
    setLoading(true);
    try {
      if (!data) {
        showNotification('No data available for download', 'warning');
        return;
      }

      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.json`);
      showNotification('JSON file downloaded successfully');
    } catch (error) {
      showNotification('Error downloading JSON file', 'error');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
        onClick={handleClick}
        disabled={loading || !data}
        aria-label={`Download ${title || 'data'}`}
      >
        {loading ? 'Downloading...' : t('download.report')}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={downloadCSV} disabled={loading}>
          <GetAppIcon sx={{ mr: 1 }} />
          <Typography>{t('download.csv')}</Typography>
        </MenuItem>
        <MenuItem onClick={downloadJSON} disabled={loading}>
          <GetAppIcon sx={{ mr: 1 }} />
          <Typography>{t('download.json')}</Typography>
        </MenuItem>
      </Menu>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataDownloader;
