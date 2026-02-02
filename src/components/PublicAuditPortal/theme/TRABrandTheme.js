import { createTheme } from '@mui/material/styles';

// TRA Official Brand Colors (extracted from existing theme)
export const TRABrandColors = {
  primary: {
    main: '#002855', // TRA Primary Blue
    light: '#E6ECF5',
    dark: '#001B3D',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#FFD100', // TRA Signature Yellow
    light: '#FFF5CC',
    dark: '#E6B800',
    contrastText: '#2A3547',
  },
  government: {
    main: '#005792', // TRA Government Blue
    light: '#E3F2FD',
    dark: '#003F6F',
    contrastText: '#ffffff',
  },
  accent: {
    gold: '#D4A419', // Complementary Gold
    lightGold: '#F8F2E6',
    darkGold: '#BA8F16',
  },
  success: {
    main: '#13DEB9',
    light: '#E6FFFA',
    dark: '#02B3A9',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#FFAE1F',
    light: '#FEF5E7',
    dark: '#AE8E59',
    contrastText: '#ffffff',
  },
  error: {
    main: '#FA896B',
    light: '#FDEDE8',
    dark: '#F3704D',
    contrastText: '#ffffff',
  },
  info: {
    main: '#539BFF',
    light: '#EBF3FE',
    dark: '#1682FB',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#FAFBFB',
    100: '#F2F6FA',
    200: '#E5EDF5',
    300: '#C8D9E8',
    400: '#9FB4C7',
    500: '#7C8FAC',
    600: '#5A6A85',
    700: '#2A3547',
    800: '#212936',
    900: '#1A202C',
  },
};

// Enhanced TRA Brand Theme for Public Audit Portal
export const createTRABrandTheme = (mode = 'light') => {
  return createTheme({
    palette: {
      mode,
      primary: TRABrandColors.primary,
      secondary: TRABrandColors.secondary,
      success: TRABrandColors.success,
      warning: TRABrandColors.warning,
      error: TRABrandColors.error,
      info: TRABrandColors.info,
      grey: TRABrandColors.grey,
      background: {
        default: mode === 'light' ? '#FAFBFB' : '#1A202C',
        paper: mode === 'light' ? '#ffffff' : '#212936',
        accent: mode === 'light' ? TRABrandColors.primary.light : TRABrandColors.primary.dark,
      },
      text: {
        primary: mode === 'light' ? TRABrandColors.grey[700] : '#ffffff',
        secondary: mode === 'light' ? TRABrandColors.grey[600] : TRABrandColors.grey[400],
      },
      divider: mode === 'light' ? TRABrandColors.grey[200] : TRABrandColors.grey[700],
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        color: TRABrandColors.primary.main,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        color: TRABrandColors.primary.main,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.6,
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 1px 3px rgba(0, 40, 85, 0.08), 0px 1px 2px rgba(0, 40, 85, 0.06)',
      '0px 1px 5px rgba(0, 40, 85, 0.08), 0px 2px 4px rgba(0, 40, 85, 0.06)',
      '0px 1px 8px rgba(0, 40, 85, 0.08), 0px 3px 6px rgba(0, 40, 85, 0.06)',
      '0px 2px 10px rgba(0, 40, 85, 0.08), 0px 4px 8px rgba(0, 40, 85, 0.06)',
      '0px 3px 14px rgba(0, 40, 85, 0.08), 0px 5px 10px rgba(0, 40, 85, 0.06)',
      '0px 4px 18px rgba(0, 40, 85, 0.08), 0px 6px 12px rgba(0, 40, 85, 0.06)',
      '0px 5px 22px rgba(0, 40, 85, 0.08), 0px 7px 14px rgba(0, 40, 85, 0.06)',
      '0px 6px 26px rgba(0, 40, 85, 0.08), 0px 8px 16px rgba(0, 40, 85, 0.06)',
      '0px 7px 30px rgba(0, 40, 85, 0.08), 0px 9px 18px rgba(0, 40, 85, 0.06)',
      '0px 8px 34px rgba(0, 40, 85, 0.08), 0px 10px 20px rgba(0, 40, 85, 0.06)',
      '0px 9px 38px rgba(0, 40, 85, 0.08), 0px 11px 22px rgba(0, 40, 85, 0.06)',
      '0px 10px 42px rgba(0, 40, 85, 0.08), 0px 12px 24px rgba(0, 40, 85, 0.06)',
      '0px 11px 46px rgba(0, 40, 85, 0.08), 0px 13px 26px rgba(0, 40, 85, 0.06)',
      '0px 12px 50px rgba(0, 40, 85, 0.08), 0px 14px 28px rgba(0, 40, 85, 0.06)',
      '0px 13px 54px rgba(0, 40, 85, 0.08), 0px 15px 30px rgba(0, 40, 85, 0.06)',
      '0px 14px 58px rgba(0, 40, 85, 0.08), 0px 16px 32px rgba(0, 40, 85, 0.06)',
      '0px 15px 62px rgba(0, 40, 85, 0.08), 0px 17px 34px rgba(0, 40, 85, 0.06)',
      '0px 16px 66px rgba(0, 40, 85, 0.08), 0px 18px 36px rgba(0, 40, 85, 0.06)',
      '0px 17px 70px rgba(0, 40, 85, 0.08), 0px 19px 38px rgba(0, 40, 85, 0.06)',
      '0px 18px 74px rgba(0, 40, 85, 0.08), 0px 20px 40px rgba(0, 40, 85, 0.06)',
      '0px 19px 78px rgba(0, 40, 85, 0.08), 0px 21px 42px rgba(0, 40, 85, 0.06)',
      '0px 20px 82px rgba(0, 40, 85, 0.08), 0px 22px 44px rgba(0, 40, 85, 0.06)',
      '0px 21px 86px rgba(0, 40, 85, 0.08), 0px 23px 46px rgba(0, 40, 85, 0.06)',
      '0px 22px 90px rgba(0, 40, 85, 0.08), 0px 24px 48px rgba(0, 40, 85, 0.06)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 8px rgba(0, 40, 85, 0.15)',
            },
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${TRABrandColors.primary.main} 0%, ${TRABrandColors.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${TRABrandColors.primary.dark} 0%, ${TRABrandColors.primary.main} 100%)`,
            },
          },
          containedSecondary: {
            background: `linear-gradient(135deg, ${TRABrandColors.secondary.main} 0%, ${TRABrandColors.secondary.dark} 100%)`,
            color: TRABrandColors.primary.main,
            '&:hover': {
              background: `linear-gradient(135deg, ${TRABrandColors.secondary.dark} 0%, ${TRABrandColors.secondary.main} 100%)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0px 4px 20px rgba(0, 40, 85, 0.08)',
            border: `1px solid ${TRABrandColors.grey[200]}`,
            '&:hover': {
              boxShadow: '0px 8px 32px rgba(0, 40, 85, 0.12)',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease-in-out',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: `linear-gradient(135deg, ${TRABrandColors.primary.main} 0%, ${TRABrandColors.government.main} 100%)`,
            boxShadow: '0px 4px 20px rgba(0, 40, 85, 0.15)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${TRABrandColors.grey[200]}`,
            background: mode === 'light' ? '#ffffff' : TRABrandColors.grey[900],
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            margin: '4px 8px',
            '&.Mui-selected': {
              background: `linear-gradient(135deg, ${TRABrandColors.primary.light} 0%, ${TRABrandColors.secondary.light} 100%)`,
              color: TRABrandColors.primary.main,
              '&:hover': {
                background: `linear-gradient(135deg, ${TRABrandColors.primary.light} 0%, ${TRABrandColors.secondary.light} 100%)`,
              },
            },
            '&:hover': {
              background: TRABrandColors.grey[100],
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
          colorPrimary: {
            background: `linear-gradient(135deg, ${TRABrandColors.primary.main} 0%, ${TRABrandColors.primary.dark} 100%)`,
          },
          colorSecondary: {
            background: `linear-gradient(135deg, ${TRABrandColors.secondary.main} 0%, ${TRABrandColors.secondary.dark} 100%)`,
            color: TRABrandColors.primary.main,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            height: 8,
          },
          bar: {
            background: `linear-gradient(135deg, ${TRABrandColors.secondary.main} 0%, ${TRABrandColors.accent.gold} 100%)`,
          },
        },
      },
    },
  });
};

export default createTRABrandTheme;
