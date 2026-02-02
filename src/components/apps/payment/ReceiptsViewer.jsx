import React from 'react';
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton,
} from '@mui/material';
import { ReceiptLong, Download } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const dummyReceipts = [
  {
    id: 'TXN12345',
    amount: 150000,
    date: '2025-04-25',
    status: 'Completed',
  },
  {
    id: 'TXN67890',
    amount: 75000,
    date: '2025-04-22',
    status: 'Completed',
  },
];

export const ReceiptsViewer = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          <ReceiptLong sx={{ verticalAlign: 'middle', mr: 1 }} />
          Payment Receipts
        </Typography>

        {dummyReceipts.length === 0 ? (
          <Typography>No receipts available.</Typography>
        ) : (
          <List>
            {dummyReceipts.map((receipt) => (
              <React.Fragment key={receipt.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="download">
                      <Download />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`TZS ${receipt.amount.toLocaleString()}`}
                    secondary={`Date: ${new Date(receipt.date).toLocaleDateString()} | Status: ${
                      receipt.status
                    }`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}

        <Box mt={2} textAlign="right">
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
