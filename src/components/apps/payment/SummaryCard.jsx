import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

export const SummaryCard = ({ title, value, total, icon, color = 'primary' }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 320,
        minHeight: 160,
        borderLeft: `4px solid`,
        borderColor: theme.palette[color].main,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      role="region"
      aria-labelledby="summary-card-title"
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              color: theme.palette[color].main,
              display: 'flex',
              padding: 1,
              borderRadius: '50%',
              backgroundColor: theme.palette[color].light + '33', // 20% opacity
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="subtitle1"
            component="h3"
            id="summary-card-title"
            sx={{
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              color: theme.palette[color].main,
              [theme.breakpoints.down('sm')]: {
                fontSize: '2rem',
              },
            }}
          >
            {value}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.875rem',
          }}
        >
          <span aria-hidden="true">Total:</span>
          <span role="text" aria-label={`Total ${title}`}>
            {total}
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success']),
};
