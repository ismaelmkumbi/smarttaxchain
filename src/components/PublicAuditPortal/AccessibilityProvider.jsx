import React, { createContext, useContext, useState, useEffect } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import {
  AccessibilityNew as AccessibilityIcon,
  TextIncrease as TextIncreaseIcon,
  TextDecrease as TextDecreaseIcon,
  Contrast as ContrastIcon,
} from '@mui/icons-material';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderAnnouncements, setScreenReaderAnnouncements] = useState('');
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Alt + A to toggle accessibility menu
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setShowAccessibilityMenu(!showAccessibilityMenu);
        announce('Accessibility menu toggled');
      }

      // Alt + + to increase font size
      if (event.altKey && event.key === '=') {
        event.preventDefault();
        increaseFontSize();
      }

      // Alt + - to decrease font size
      if (event.altKey && event.key === '-') {
        event.preventDefault();
        decreaseFontSize();
      }

      // Alt + C to toggle high contrast
      if (event.altKey && event.key === 'c') {
        event.preventDefault();
        toggleHighContrast();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showAccessibilityMenu]);

  // Apply font size changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}rem`;
  }, [fontSize]);

  // Apply high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const increaseFontSize = () => {
    if (fontSize < 1.5) {
      setFontSize((prev) => Math.min(prev + 0.1, 1.5));
      announce(`Font size increased to ${Math.round((fontSize + 0.1) * 100)}%`);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 0.8) {
      setFontSize((prev) => Math.max(prev - 0.1, 0.8));
      announce(`Font size decreased to ${Math.round((fontSize - 0.1) * 100)}%`);
    }
  };

  const resetFontSize = () => {
    setFontSize(1);
    announce('Font size reset to default');
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    announce(`High contrast mode ${!highContrast ? 'enabled' : 'disabled'}`);
  };

  const announce = (message) => {
    setScreenReaderAnnouncements(message);
    // Clear announcement after screen reader has time to read it
    setTimeout(() => setScreenReaderAnnouncements(''), 1000);
  };

  const contextValue = {
    fontSize,
    highContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast,
    announce,
    showAccessibilityMenu,
    setShowAccessibilityMenu,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {screenReaderAnnouncements}
      </div>

      {/* Accessibility Menu */}
      {showAccessibilityMenu && (
        <Box
          sx={{
            position: 'fixed',
            top: 80,
            right: 16,
            zIndex: 9999,
            backgroundColor: 'background.paper',
            border: 2,
            borderColor: 'primary.main',
            borderRadius: 2,
            p: 2,
            boxShadow: 4,
            minWidth: 250,
          }}
          role="dialog"
          aria-label="Accessibility options"
        >
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessibilityIcon />
            Accessibility Options
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                size="small"
                variant="outlined"
                onClick={decreaseFontSize}
                disabled={fontSize <= 0.8}
                aria-label="Decrease font size"
              >
                <TextDecreaseIcon />
              </Button>
              <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'center' }}>
                {Math.round(fontSize * 100)}%
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={increaseFontSize}
                disabled={fontSize >= 1.5}
                aria-label="Increase font size"
              >
                <TextIncreaseIcon />
              </Button>
            </Box>

            <Button
              size="small"
              variant="outlined"
              onClick={resetFontSize}
              disabled={fontSize === 1}
            >
              Reset Font Size
            </Button>

            <Button
              size="small"
              variant={highContrast ? 'contained' : 'outlined'}
              onClick={toggleHighContrast}
              startIcon={<ContrastIcon />}
            >
              High Contrast
            </Button>

            <Button size="small" variant="outlined" onClick={() => setShowAccessibilityMenu(false)}>
              Close Menu
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Keyboard shortcuts: Alt+A (menu), Alt+= (larger), Alt+- (smaller), Alt+C (contrast)
          </Typography>
        </Box>
      )}

      {children}

      {/* Floating Accessibility Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 1000,
          minWidth: 'auto',
          width: 56,
          height: 56,
          borderRadius: '50%',
        }}
        aria-label="Open accessibility options"
      >
        <AccessibilityIcon />
      </Button>
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
