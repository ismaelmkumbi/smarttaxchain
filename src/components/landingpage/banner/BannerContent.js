import React from 'react';
import { Typography, Box, Button, Stack, styled, useMediaQuery } from '@mui/material';
import { IconRocket } from '@tabler/icons';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '16px 48px',
  fontSize: '18px',
  fontWeight: 700,
  borderRadius: '32px',
  boxShadow: `0 4px 32px 0 #fff20033`,
  background: `linear-gradient(90deg, #fff200 0%, #fff200 100%)`,
  color: '#111',
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: `0 6px 48px 0 #fff20066`,
    background: `linear-gradient(90deg, #fff200 0%, #e6d700 100%)`,
  },
}));

const AnimatedHeadline = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
  lineHeight: 1.1,
  background: `linear-gradient(90deg, #fff200, #fff200, #fff200)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: 'gradient-move 6s ease-in-out infinite',
  '@keyframes gradient-move': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
  textShadow: `0 4px 32px #fff20022`,
  color: '#111',
}));

const UnderlineSpan = styled('span')(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  color: '#111',
  '&:after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    left: 0,
    bottom: -4,
    width: '100%',
    height: 6,
    background: `linear-gradient(90deg, #fff200, #fff200)`,
    borderRadius: 4,
    opacity: 0.5,
    animation: 'underline-move 2s infinite alternate',
  },
  '@keyframes underline-move': {
    '0%': { width: '60%' },
    '100%': { width: '100%' },
  },
}));

const BannerContent = () => {
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  return (
    <Box
      mt={lgDown ? 8 : 0}
      sx={{
        boxShadow: (theme) => `0 8px 48px 0 ${theme.palette.primary.main}22`,
        borderRadius: 6,
        background: (theme) => theme.palette.background.paper,
        p: { xs: 3, md: 6 },
        maxWidth: 700,
        mx: { xs: 0, md: 'auto' },
      }}
    >
      <motion.div
        initial={{ opacity: 0, translateY: 80 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 30 }}
      >
        <Typography variant="h6" display={'flex'} gap={1} mb={2} color="secondary">
          <IconRocket size={28} style={{ marginRight: 8 }} />
          Tanzania Revenue Authority
        </Typography>
        <AnimatedHeadline variant="h1">
          Empowering <UnderlineSpan>Transparency</UnderlineSpan>, Trust & Innovation
        </AnimatedHeadline>
        <Typography variant="h5" fontWeight={400} color="text.secondary" sx={{ mt: 3, mb: 2 }}>
          Welcome to the TRA Public Audit Portal – a new era of open, secure, and citizen-focused
          tax administration. Experience real-time blockchain transparency, AI-powered insights, and
          world-class digital services.
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, translateY: 80 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.3 }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
          <StyledButton variant="contained" color="primary" to="/auth/login" component={NavLink}>
            Access Portal
          </StyledButton>
          <Button
            variant="outlined"
            color="secondary"
            to="/dashboards/modern"
            component={NavLink}
            sx={{
              fontWeight: 700,
              borderRadius: '32px',
              px: 5,
              py: 2,
              borderWidth: 2,
              borderColor: (theme) => theme.palette.secondary.main,
              color: (theme) => theme.palette.secondary.main,
              background: 'rgba(255,255,255,0.7)',
              boxShadow: (theme) => `0 2px 12px 0 ${theme.palette.secondary.main}11`,
              '&:hover': {
                background: (theme) => theme.palette.secondary.light,
                color: (theme) => theme.palette.secondary.contrastText,
              },
            }}
          >
            Live Preview
          </Button>
        </Stack>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, translateY: 80 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.5 }}
      >
        <Typography
          variant="subtitle1"
          color="primary"
          sx={{ mt: 5, fontWeight: 600, letterSpacing: 1, textAlign: { xs: 'left', md: 'center' } }}
        >
          "Building a transparent, secure, and efficient future for every Tanzanian."
        </Typography>
      </motion.div>
    </Box>
  );
};

export default BannerContent;
