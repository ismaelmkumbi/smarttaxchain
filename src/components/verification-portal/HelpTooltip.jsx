import React from 'react';
import {
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  HelpOutline,
  CheckCircle,
  Info,
  Security,
  Timeline,
  Verified,
} from '@mui/icons-material';

const HelpTooltip = ({ topic = 'general' }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const helpContent = {
    general: {
      title: 'How to Verify Your Assessment',
      items: [
        {
          icon: <CheckCircle />,
          text: 'Enter your 9-digit TIN (Taxpayer Identification Number)',
        },
        {
          icon: <CheckCircle />,
          text: 'Enter your Assessment ID (found on your assessment notice)',
        },
        {
          icon: <CheckCircle />,
          text: 'Request an OTP (One-Time Password) sent to your registered email/phone',
        },
        {
          icon: <CheckCircle />,
          text: 'Enter the OTP to verify and view your assessment details',
        },
      ],
    },
    auditTrail: {
      title: 'What is an Audit Trail?',
      description:
        'An audit trail is a complete history of all changes made to your assessment. It shows:',
      items: [
        {
          icon: <Timeline />,
          text: 'When your assessment was created',
        },
        {
          icon: <Edit />,
          text: 'All modifications and who made them',
        },
        {
          icon: <Verified />,
          text: 'Approval steps and timestamps',
        },
        {
          icon: <Security />,
          text: 'Cryptographic proof of each change',
        },
      ],
    },
    blockchain: {
      title: 'What is Blockchain Verification?',
      description:
        'Blockchain verification ensures your assessment data is tamper-proof and authentic:',
      items: [
        {
          icon: <Security />,
          text: 'Each assessment is recorded on an immutable blockchain ledger',
        },
        {
          icon: <Verified />,
          text: 'Cryptographic hashes prove data integrity',
        },
        {
          icon: <Info />,
          text: 'Any attempt to modify data would be immediately detectable',
        },
        {
          icon: <CheckCircle />,
          text: 'Provides independent verification of your assessment',
        },
      ],
    },
  };

  const content = helpContent[topic] || helpContent.general;

  return (
    <>
      <Tooltip title="Click for help">
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{ color: 'text.secondary' }}
        >
          <HelpOutline fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info color="primary" />
            <Typography variant="h6" component="span">{content.title}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {content.description && (
            <Typography variant="body2" color="text.secondary" paragraph>
              {content.description}
            </Typography>
          )}
          <List>
            {content.items.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="contained">
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HelpTooltip;

