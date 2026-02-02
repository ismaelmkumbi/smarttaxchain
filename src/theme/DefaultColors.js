import { alpha } from '@mui/material/styles';

// Professional color palette with semantic naming
const colors = {
  // Primary brand colors
  primary: {
    50: '#fffef7',
    100: '#fffceb',
    200: '#fff9d6',
    300: '#fff4b8',
    400: '#ffed94',
    500: '#fdee02', // Main brand yellow
    600: '#e6d600',
    700: '#ccbf00',
    800: '#b3a600',
    900: '#998c00',
  },

  // Sophisticated neutral palette
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Semantic colors
  success: {
    50: '#f0f9f4',
    500: '#10b981',
    600: '#059669',
  },

  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },

  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },

  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
  },
};

// Add missing 400 values for semantic colors
colors.success[400] = colors.success[500];
colors.error[400] = colors.error[500];
colors.warning[400] = colors.warning[500];
colors.info[400] = colors.info[500];

// Advanced shadow system
const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 0 1px rgba(253, 238, 2, 0.1), 0 4px 16px rgba(253, 238, 2, 0.15)',
};

// Professional typography scale
const typography = {
  fontFamily: [
    "'Inter'",
    "'SF Pro Display'",
    '-apple-system',
    'BlinkMacSystemFont',
    "'Segoe UI'",
    'Roboto',
    "'Helvetica Neue'",
    'Arial',
    'sans-serif',
  ].join(','),

  // Display typography for headers
  fontFamilyDisplay: [
    "'Inter'",
    "'SF Pro Display'",
    '-apple-system',
    'BlinkMacSystemFont',
    'sans-serif',
  ].join(','),

  // Mono for code
  fontFamilyMono: ["'SF Mono'", "'Monaco'", "'Inconsolata'", "'Roboto Mono'", 'monospace'].join(
    ',',
  ),
};

const baselightTheme = {
  direction: 'ltr',

  palette: {
    mode: 'light',

    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: colors.neutral[900],
    },

    secondary: {
      main: colors.neutral[700],
      light: colors.neutral[500],
      dark: colors.neutral[800],
      contrastText: colors.neutral[50],
    },

    background: {
      default: colors.neutral[50],
      paper: '#ffffff',
      nav: colors.neutral[50],
      dashboard: alpha(colors.primary[50], 0.3),
      grid: '#ffffff',
      gridSelect: colors.primary[50],
      elevated: '#ffffff',
    },

    surface: {
      primary: '#ffffff',
      secondary: colors.neutral[50],
      tertiary: alpha(colors.primary[100], 0.5),
    },

    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      tertiary: colors.neutral[500],
      disabled: colors.neutral[400],
    },

    divider: alpha(colors.neutral[300], 0.8),

    action: {
      hover: alpha(colors.neutral[900], 0.04),
      selected: alpha(colors.primary[500], 0.08),
      disabled: colors.neutral[300],
      disabledBackground: colors.neutral[100],
    },

    // Semantic colors
    success: {
      main: colors.success[500],
      light: colors.success[50],
      dark: colors.success[600],
      contrastText: '#ffffff',
    },

    error: {
      main: colors.error[500],
      light: colors.error[50],
      dark: colors.error[600],
      contrastText: '#ffffff',
    },

    warning: {
      main: colors.warning[500],
      light: colors.warning[50],
      dark: colors.warning[600],
      contrastText: '#ffffff',
    },

    info: {
      main: colors.info[500],
      light: colors.info[50],
      dark: colors.info[600],
      contrastText: '#ffffff',
    },

    // Extended greys for flexibility
    grey: {
      50: colors.neutral[50],
      100: colors.neutral[100],
      200: colors.neutral[200],
      300: colors.neutral[300],
      400: colors.neutral[400],
      500: colors.neutral[500],
      600: colors.neutral[600],
      700: colors.neutral[700],
      800: colors.neutral[800],
      900: colors.neutral[900],
    },
    purple: {
      500: '#b39ddb', // placeholder, not used in new brand but needed for code
    },
  },

  typography: {
    fontFamily: typography.fontFamily,

    h1: {
      fontFamily: typography.fontFamilyDisplay,
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },

    h2: {
      fontFamily: typography.fontFamilyDisplay,
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },

    h3: {
      fontFamily: typography.fontFamilyDisplay,
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.4,
      letterSpacing: '-0.005em',
    },

    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },

    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },

    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },

    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },

    subtitle2: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },

    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.neutral[700],
    },

    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.neutral[600],
    },

    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: colors.neutral[500],
      fontWeight: 400,
    },

    overline: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },

    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },

  spacing: 8,

  shape: {
    borderRadius: 8,
  },

  components: {
    // Global overrides
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          backgroundColor: colors.neutral[50],
          fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.neutral[300]} transparent`,
        },
        '*::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: colors.neutral[300],
          borderRadius: '3px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
      },
    },

    // AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: colors.neutral[900],
          boxShadow: shadows.sm,
          borderBottom: `1px solid ${alpha(colors.neutral[300], 0.5)}`,
          backdropFilter: 'blur(20px)',
        },
      },
    },

    // Drawer
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: `1px solid ${alpha(colors.neutral[200], 0.8)}`,
          boxShadow: shadows.lg,
        },
      },
    },

    // Cards
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 16,
          border: `1px solid ${alpha(colors.neutral[200], 0.6)}`,
          boxShadow: shadows.md,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: shadows.lg,
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    // Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '10px 20px',
          minHeight: 40,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },

        containedPrimary: {
          backgroundColor: colors.primary[500],
          color: colors.neutral[900],
          boxShadow: shadows.glow,
          '&:hover': {
            backgroundColor: colors.primary[600],
            boxShadow: shadows.xl,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },

        outlinedPrimary: {
          borderColor: colors.primary[500],
          color: colors.primary[700],
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: colors.primary[50],
            borderColor: colors.primary[600],
          },
        },

        containedSecondary: {
          backgroundColor: colors.neutral[800],
          color: '#ffffff',
          boxShadow: shadows.sm,
          '&:hover': {
            backgroundColor: colors.neutral[900],
            boxShadow: shadows.md,
          },
        },

        textPrimary: {
          color: colors.primary[700],
          '&:hover': {
            backgroundColor: colors.primary[50],
          },
        },

        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem',
          minHeight: 48,
        },

        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
          minHeight: 32,
        },
      },
    },

    // Chips
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 20,
        },

        colorPrimary: {
          backgroundColor: colors.primary[100],
          color: colors.primary[800],
          '&:hover': {
            backgroundColor: colors.primary[200],
          },
        },

        colorSecondary: {
          backgroundColor: colors.neutral[100],
          color: colors.neutral[700],
          '&:hover': {
            backgroundColor: colors.neutral[200],
          },
        },
      },
    },

    // Alerts
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 16px',
        },

        standardSuccess: {
          backgroundColor: colors.success[50],
          color: colors.success[800],
          border: `1px solid ${alpha(colors.success[500], 0.2)}`,
        },

        standardError: {
          backgroundColor: colors.error[50],
          color: colors.error[800],
          border: `1px solid ${alpha(colors.error[500], 0.2)}`,
        },

        standardWarning: {
          backgroundColor: colors.warning[50],
          color: colors.warning[800],
          border: `1px solid ${alpha(colors.warning[500], 0.2)}`,
        },

        standardInfo: {
          backgroundColor: colors.info[50],
          color: colors.info[800],
          border: `1px solid ${alpha(colors.info[500], 0.2)}`,
        },
      },
    },

    // Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
        elevation1: {
          boxShadow: shadows.sm,
        },
        elevation2: {
          boxShadow: shadows.md,
        },
        elevation3: {
          boxShadow: shadows.lg,
        },
      },
    },

    // TextField
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.neutral[400],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary[500],
              borderWidth: 2,
            },
          },
        },
      },
    },

    // Table
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: colors.neutral[50],
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: colors.neutral[700],
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
        },
      },
    },
  },
};

// Professional Dark Theme
const baseDarkTheme = {
  direction: 'ltr',

  palette: {
    mode: 'dark',

    primary: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[600],
      contrastText: colors.neutral[900],
    },

    secondary: {
      main: '#ffffff',
      light: colors.neutral[200],
      dark: colors.neutral[300],
      contrastText: colors.neutral[900],
    },

    background: {
      default: '#0a0a0a',
      paper: '#151515',
      nav: alpha('#000000', 0.9),
      dashboard: '#111111',
      grid: '#1a1a1a',
      gridSelect: alpha(colors.primary[500], 0.1),
      elevated: '#1f1f1f',
    },

    surface: {
      primary: '#151515',
      secondary: '#1a1a1a',
      tertiary: '#252525',
    },

    text: {
      primary: '#ffffff',
      secondary: colors.neutral[300],
      tertiary: colors.neutral[400],
      disabled: colors.neutral[600],
    },

    divider: alpha(colors.neutral[700], 0.6),

    action: {
      hover: alpha('#ffffff', 0.04),
      selected: alpha(colors.primary[500], 0.12),
      disabled: colors.neutral[700],
      disabledBackground: colors.neutral[800],
    },

    // Semantic colors for dark mode
    success: {
      main: colors.success[400],
      light: alpha(colors.success[400], 0.1),
      dark: colors.success[600],
      contrastText: colors.neutral[900],
    },

    error: {
      main: colors.error[400],
      light: alpha(colors.error[400], 0.1),
      dark: colors.error[600],
      contrastText: '#ffffff',
    },

    warning: {
      main: colors.warning[400],
      light: alpha(colors.warning[400], 0.1),
      dark: colors.warning[600],
      contrastText: colors.neutral[900],
    },

    info: {
      main: colors.info[400],
      light: alpha(colors.info[400], 0.1),
      dark: colors.info[600],
      contrastText: '#ffffff',
    },

    grey: {
      50: colors.neutral[900],
      100: colors.neutral[800],
      200: colors.neutral[700],
      300: colors.neutral[600],
      400: colors.neutral[500],
      500: colors.neutral[400],
      600: colors.neutral[300],
      700: colors.neutral[200],
      800: colors.neutral[100],
      900: colors.neutral[50],
    },
  },

  typography: {
    fontFamily: typography.fontFamily,

    h1: {
      fontFamily: typography.fontFamilyDisplay,
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },

    h2: {
      fontFamily: typography.fontFamilyDisplay,
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },

    h3: {
      fontFamily: typography.fontFamilyDisplay,
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.4,
      letterSpacing: '-0.005em',
    },

    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },

    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },

    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },

    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.neutral[300],
    },

    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.neutral[400],
    },

    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },

  spacing: 8,

  shape: {
    borderRadius: 8,
  },

  components: {
    // Global dark mode overrides
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0a0a0a',
          backgroundImage:
            'radial-gradient(ellipse at top, rgba(253, 238, 2, 0.02), transparent 50%)',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: colors.neutral[600],
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#000000', 0.9),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(colors.neutral[700], 0.3)}`,
          boxShadow: `0 4px 20px ${alpha(colors.primary[500], 0.1)}`,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#151515',
          borderRight: `1px solid ${alpha(colors.neutral[700], 0.3)}`,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#151515',
          border: `1px solid ${alpha(colors.neutral[700], 0.2)}`,
          boxShadow: `0 4px 20px ${alpha('#000000', 0.3)}`,
          '&:hover': {
            backgroundColor: '#1a1a1a',
            borderColor: alpha(colors.primary[500], 0.3),
            boxShadow: `0 8px 40px ${alpha(colors.primary[500], 0.1)}`,
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: colors.primary[500],
          color: colors.neutral[900],
          boxShadow: `0 4px 20px ${alpha(colors.primary[500], 0.3)}`,
          '&:hover': {
            backgroundColor: colors.primary[400],
            boxShadow: `0 8px 40px ${alpha(colors.primary[500], 0.4)}`,
          },
        },

        containedSecondary: {
          backgroundColor: '#ffffff',
          color: colors.neutral[900],
          '&:hover': {
            backgroundColor: colors.neutral[200],
          },
        },

        outlinedPrimary: {
          borderColor: colors.primary[500],
          color: colors.primary[400],
          '&:hover': {
            backgroundColor: alpha(colors.primary[500], 0.1),
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: alpha(colors.primary[500], 0.2),
          color: colors.primary[300],
        },

        colorSecondary: {
          backgroundColor: alpha('#ffffff', 0.1),
          color: colors.neutral[300],
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: alpha(colors.success[500], 0.1),
          color: colors.success[300],
          border: `1px solid ${alpha(colors.success[500], 0.3)}`,
        },

        standardError: {
          backgroundColor: alpha(colors.error[500], 0.1),
          color: colors.error[300],
          border: `1px solid ${alpha(colors.error[500], 0.3)}`,
        },

        standardWarning: {
          backgroundColor: alpha(colors.warning[500], 0.1),
          color: colors.warning[300],
          border: `1px solid ${alpha(colors.warning[500], 0.3)}`,
        },

        standardInfo: {
          backgroundColor: alpha(colors.info[500], 0.1),
          color: colors.info[300],
          border: `1px solid ${alpha(colors.info[500], 0.3)}`,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: alpha(colors.neutral[600], 0.5),
            },
            '&:hover fieldset': {
              borderColor: colors.neutral[500],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary[500],
            },
          },
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
        },
      },
    },
  },
};

// Ensure both baselightTheme and baseDarkTheme are objects, not arrays, and all color keys exist
export { baseDarkTheme, baselightTheme };
