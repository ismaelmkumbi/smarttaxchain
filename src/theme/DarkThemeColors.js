import { alpha } from '@mui/material/styles';

// Professional color palette with semantic naming

// Professional TRA Dark Theme Colors
const DarkThemeColors = [
  {
    name: 'TRA_THEME',
    palette: {
      // Enhanced primary palette
      primary: {
        50: '#fffef9',
        100: '#fffdf2',
        200: '#fffbe6',
        300: '#fff7cc',
        400: '#fff2a8',
        main: '#fef567', // Your original primary
        500: '#fef567',
        600: '#f4e654',
        700: '#e6d441',
        800: '#d4c12f',
        900: '#b2a429', // Your original dark
        light: '#fff2a8',
        dark: '#b2a429',
        contrastText: '#000000',
      },

      // Enhanced secondary palette
      secondary: {
        50: '#f9f8f0',
        100: '#f2f0e1',
        200: '#e6e0c3',
        300: '#d9d1a5',
        400: '#ccc287',
        main: '#b2a429', // Your original secondary
        500: '#b2a429',
        600: '#9f931f',
        700: '#8b8115',
        800: '#786f0c',
        900: '#655e03',
        light: '#ccc287',
        dark: '#8b8115',
        contrastText: '#000000',
      },

      // Professional dark backgrounds
      background: {
        default: '#494521', // Your original default
        paper: alpha('#b2a429', 0.95), // Softer paper background
        nav: alpha('#494521', 0.98),
        dashboard: '#3e3a1c',
        grid: alpha('#b2a429', 0.8),
        gridSelect: alpha('#fef567', 0.2),
        elevated: alpha('#b2a429', 0.9),
        contrast: '#000000',
      },

      // Surface variations for depth
      surface: {
        primary: alpha('#b2a429', 0.95),
        secondary: alpha('#b2a429', 0.85),
        tertiary: alpha('#b2a429', 0.75),
        accent: alpha('#fef567', 0.15),
      },

      // Enhanced text system
      text: {
        primary: '#000000', // Your original
        secondary: '#2c2a15',
        tertiary: '#3e3a1c',
        disabled: alpha('#000000', 0.4),
        contrast: '#ffffff',
        accent: '#b2a429',
      },

      // Action states
      action: {
        hover: alpha('#000000', 0.08),
        selected: alpha('#fef567', 0.24),
        disabled: alpha('#000000', 0.3),
        disabledBackground: alpha('#b2a429', 0.5),
        focus: alpha('#fef567', 0.32),
      },

      // Enhanced divider system
      divider: alpha('#b2a429', 0.8), // Your original concept enhanced
      border: {
        light: alpha('#b2a429', 0.4),
        main: alpha('#b2a429', 0.6),
        strong: '#b2a429',
      },

      // Semantic colors adapted for your theme
      success: {
        main: '#4aba7b',
        light: alpha('#4aba7b', 0.15),
        dark: '#2d7049',
        contrastText: '#000000',
      },

      error: {
        main: '#d32f2f',
        light: alpha('#d32f2f', 0.15),
        dark: '#8b1f1f',
        contrastText: '#ffffff',
      },

      warning: {
        main: '#ed6c02',
        light: alpha('#ed6c02', 0.15),
        dark: '#9c4601',
        contrastText: '#000000',
      },

      info: {
        main: '#0288d1',
        light: alpha('#0288d1', 0.15),
        dark: '#01579b',
        contrastText: '#ffffff',
      },

      // Professional grey system
      grey: {
        50: '#f9f8f0',
        100: '#f2f0e1',
        200: '#e6e0c3',
        300: '#d9d1a5',
        400: '#ccc287',
        500: '#b2a429',
        600: '#9f931f',
        700: '#8b8115',
        800: '#786f0c',
        900: '#655e03',
      },
    },

    // Enhanced component overrides
    components: {
      // Global styles
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#494521',
            backgroundImage: `linear-gradient(135deg, ${alpha(
              '#b2a429',
              0.05,
            )} 0%, transparent 50%)`,
          },
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: alpha('#b2a429', 0.6),
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: alpha('#494521', 0.3),
          },
        },
      },

      // Enhanced AppBar
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: `linear-gradient(135deg, #b2a429 0%, ${alpha('#b2a429', 0.9)} 100%)`,
            color: '#000000',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 4px 20px ${alpha('#b2a429', 0.3)}`,
            borderBottom: `1px solid ${alpha('#fef567', 0.2)}`,
          },
        },
      },

      // Enhanced Drawer
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: `linear-gradient(180deg, #b2a429 0%, ${alpha('#b2a429', 0.95)} 100%)`,
            borderRight: `2px solid ${alpha('#fef567', 0.3)}`,
            boxShadow: `4px 0 20px ${alpha('#000000', 0.2)}`,
          },
        },
      },

      // Enhanced Cards
      MuiCard: {
        styleOverrides: {
          root: {
            background: `linear-gradient(145deg, ${alpha('#b2a429', 0.95)} 0%, ${alpha(
              '#b2a429',
              0.85,
            )} 100%)`,
            borderRadius: 16,
            border: `1px solid ${alpha('#fef567', 0.2)}`,
            boxShadow: `0 8px 32px ${alpha('#000000', 0.3)}, inset 0 1px 0 ${alpha(
              '#fef567',
              0.1,
            )}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 48px ${alpha('#000000', 0.4)}, 0 0 20px ${alpha('#fef567', 0.2)}`,
              borderColor: alpha('#fef567', 0.4),
            },
          },
        },
      },

      // Enhanced Buttons
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            padding: '12px 24px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },

          containedPrimary: {
            background: `linear-gradient(135deg, #fef567 0%, ${alpha('#fef567', 0.9)} 100%)`,
            color: '#000000',
            boxShadow: `0 4px 16px ${alpha('#fef567', 0.4)}, inset 0 1px 0 ${alpha(
              '#ffffff',
              0.2,
            )}`,
            '&:hover': {
              background: `linear-gradient(135deg, #b2a429 0%, ${alpha('#b2a429', 0.9)} 100%)`,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha('#fef567', 0.5)}, 0 0 16px ${alpha('#fef567', 0.3)}`,
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },

          outlinedPrimary: {
            borderColor: '#fef567',
            color: '#000000',
            backgroundColor: alpha('#fef567', 0.1),
            '&:hover': {
              backgroundColor: alpha('#fef567', 0.2),
              borderColor: '#b2a429',
            },
          },

          containedSecondary: {
            background: `linear-gradient(135deg, #b2a429 0%, ${alpha('#b2a429', 0.9)} 100%)`,
            color: '#000000',
            boxShadow: `0 4px 16px ${alpha('#b2a429', 0.3)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha('#b2a429', 0.8)} 0%, ${alpha(
                '#b2a429',
                0.7,
              )} 100%)`,
            },
          },

          outlinedSecondary: {
            borderColor: '#b2a429',
            color: '#b2a429',
            '&:hover': {
              backgroundColor: alpha('#b2a429', 0.1),
              borderColor: alpha('#b2a429', 0.8),
            },
          },
        },
      },

      // Enhanced Chips
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            fontWeight: 600,
          },

          colorPrimary: {
            background: `linear-gradient(135deg, #fef567 0%, ${alpha('#fef567', 0.9)} 100%)`,
            color: '#000000',
            border: `1px solid ${alpha('#b2a429', 0.3)}`,
            '&:hover': {
              backgroundColor: alpha('#fef567', 0.8),
            },
          },

          colorSecondary: {
            background: `linear-gradient(135deg, #b2a429 0%, ${alpha('#b2a429', 0.9)} 100%)`,
            color: '#000000',
            border: `1px solid ${alpha('#fef567', 0.2)}`,
            '&:hover': {
              backgroundColor: alpha('#b2a429', 0.8),
            },
          },
        },
      },

      // Enhanced Alerts
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '16px 20px',
            fontWeight: 500,
          },

          standardSuccess: {
            background: `linear-gradient(135deg, #fef567 0%, ${alpha('#fef567', 0.9)} 100%)`,
            color: '#000000',
            border: `1px solid ${alpha('#4aba7b', 0.3)}`,
          },

          standardError: {
            background: `linear-gradient(135deg, #ffffff 0%, ${alpha('#ffffff', 0.95)} 100%)`,
            color: '#d32f2f',
            border: `1px solid ${alpha('#d32f2f', 0.3)}`,
          },

          standardWarning: {
            background: `linear-gradient(135deg, #fffde7 0%, ${alpha('#fffde7', 0.95)} 100%)`,
            color: '#000000',
            border: `1px solid ${alpha('#ed6c02', 0.3)}`,
          },

          standardInfo: {
            background: `linear-gradient(135deg, #ffffff 0%, ${alpha('#ffffff', 0.95)} 100%)`,
            color: '#000000',
            border: `1px solid ${alpha('#0288d1', 0.3)}`,
          },
        },
      },

      // Enhanced TextField
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: alpha('#ffffff', 0.1),
              '& fieldset': {
                borderColor: alpha('#b2a429', 0.5),
              },
              '&:hover fieldset': {
                borderColor: '#b2a429',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#fef567',
                borderWidth: 2,
              },
            },
          },
        },
      },

      // Enhanced Paper
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: alpha('#b2a429', 0.9),
          },
          elevation1: {
            boxShadow: `0 2px 8px ${alpha('#000000', 0.2)}`,
          },
          elevation2: {
            boxShadow: `0 4px 16px ${alpha('#000000', 0.25)}`,
          },
          elevation3: {
            boxShadow: `0 8px 32px ${alpha('#000000', 0.3)}`,
          },
        },
      },
    },
  },
];

export { DarkThemeColors };
