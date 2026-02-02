import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ReactComponent as TRALogo } from 'src/assets/images/logos/tra_logo.svg';
import { styled, Box } from '@mui/material';

// Styled Link container - Compact for dashboard sidebar
const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textDecoration: 'none',
  overflow: 'visible !important',
  minHeight: '48px',
  maxHeight: '48px',
  padding: theme.spacing(0.5, 0),
  width: '100%',
  '&:hover': {
    opacity: 0.85,
  },
}));

// Logo size wrapper - Compact and aligned
const StyledLogo = styled(Box)(({ theme, isCollapsed }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: isCollapsed ? 'center' : 'flex-start',
  width: '100%',
  overflow: 'visible !important',
  flexShrink: 0,
  '& svg': {
    width: isCollapsed ? '32px' : '100px',
    maxWidth: isCollapsed ? '32px' : '100px',
    height: 'auto',
    display: 'block',
    objectFit: 'contain',
    transition: theme.transitions.create(['width', 'max-width'], {
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const isCollapsed = customizer.isCollapse && !customizer.isSidebarHover;

  return (
    <LinkStyled
      to="/"
      sx={{
        height: '48px',
        width: '100%',
        maxWidth: '100%',
        px: isCollapsed ? 1 : 2,
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        overflow: 'visible !important',
        alignItems: 'center',
      }}
    >
      <StyledLogo
        isCollapsed={isCollapsed}
        sx={{
          width: 'auto',
          maxWidth: '100%',
          overflow: 'visible !important',
        }}
      >
        <TRALogo />
      </StyledLogo>
    </LinkStyled>
  );
};

export default Logo;
