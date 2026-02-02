import { useSelector } from 'react-redux';
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/Router';
import { AuthProvider } from './context/AuthContext';
import { TRAProvider } from './context/TRAContext';

// Initialize i18n for Public Audit Portal
import './i18n';

function App() {
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={customizer.activeDir}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <TRAProvider>
              <Router />
 cle           </TRAProvider>
          </AuthProvider>
        </BrowserRouter>
      </RTL>
    </ThemeProvider>
  );
}

export default App;
