import { createTheme } from '@mui/material/styles';

const getTraTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#fef567' : '#fdee02',
        contrastText: '#000',
      },
      secondary: {
        main: '#b2a429',
        contrastText: '#000',
      },
      background: {
        default: mode === 'dark' ? '#494521' : '#ececec',
        paper: mode === 'dark' ? '#494521' : '#e4e3db',
      },
      text: {
        primary: '#000',
        secondary: '#515b75',
      },
      divider: '#acb0b6',
      grey: {
        100: mode === 'dark' ? '#494521' : '#fffeeb',
        300: '#acb0b6',
      },
      error: {
        main: '#D32F2F',
      },
      success: {
        main: '#388E3C',
      },
      info: {
        main: '#1976D2',
      },
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
      h1: { fontWeight: 900 },
      h2: { fontWeight: 900 },
      h3: { fontWeight: 900 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 700, textTransform: 'none' },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#000',
            color: mode === 'dark' ? '#fef567' : '#fdee02',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#b2a429' : '#dce1e4',
            color: '#000',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 4px 24px 0 #acb0b633',
            border: '1.5px solid #acb0b6',
            background: mode === 'dark' ? '#494521' : '#fff',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            background: mode === 'dark' ? '#fef567' : '#fdee02',
            color: '#000',
            fontWeight: 700,
            '&:hover': {
              background: '#b2a429',
              color: '#000',
            },
          },
          outlined: {
            borderColor: '#b2a429',
            color: '#000',
            fontWeight: 700,
            '&:hover': {
              background: mode === 'dark' ? '#fef567' : '#fdee02',
              color: '#000',
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? '#fef567' : '#fdee02',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            color: '#000',
            fontWeight: 700,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? '#fef567' : '#fdee02',
            color: '#000',
            fontWeight: 700,
          },
        },
      },
    },
  });

export default getTraTheme;
