import { alpha } from '@mui/material/styles';

// Professional color palette with semantic naming

// Professional TRA Theme Colors with complete palette system
const LightThemeColors = [
  {
    name: 'TRA_THEME',
    palette: {
      // TRA Primary Yellow - Complete shade range
      primary: {
        50: '#fffef7',
        100: '#fffceb',
        200: '#fff9d6',
        300: '#fff4b8',
        400: '#fff394',
        main: '#fff200', // TRA Official Yellow
        500: '#fff200',
        600: '#e6d700',
        700: '#ccbf00',
        800: '#b3a600',
        900: '#998c00',
        light: '#fffde7',
        dark: '#e6d700',
        contrastText: '#111111',
      },

      // TRA Secondary Black - Complete shade range
      secondary: {
        50: '#f8f9fa',
        100: '#f1f3f4',
        200: '#e8eaed',
        300: '#dadce0',
        400: '#bdc1c6',
        500: '#9aa0a6',
        600: '#80868b',
        700: '#5f6368',
        800: '#3c4043',
        main: '#111111', // TRA Black
        900: '#111111',
        light: '#333333',
        dark: '#000000',
        contrastText: '#ffffff',
      },

      // Professional background system
      background: {
        default: '#ffffff',
        paper: '#ffffff',
        nav: '#ffffff',
        dashboard: alpha('#fff200', 0.02), // Subtle yellow tint
        grid: '#ffffff',
        gridSelect: alpha('#fff200', 0.08),
        elevated: '#ffffff',
        contrast: '#111111',
      },

      // Surface variations for depth
      surface: {
        primary: '#ffffff',
        secondary: '#fafafa',
        tertiary: alpha('#fff200', 0.03),
        accent: alpha('#fff200', 0.1),
      },

      // Text hierarchy
      text: {
        primary: '#111111',
        secondary: '#5f6368',
        tertiary: '#80868b',
        disabled: '#bdc1c6',
        contrast: '#ffffff',
        accent: '#e6d700', // Darker yellow for text
      },

      // Action states
      action: {
        hover: alpha('#111111', 0.04),
        selected: alpha('#fff200', 0.12),
        disabled: '#e8eaed',
        disabledBackground: '#f8f9fa',
        focus: alpha('#fff200', 0.16),
      },

      // Dividers and borders
      divider: alpha('#111111', 0.08),
      border: {
        light: alpha('#111111', 0.06),
        main: alpha('#111111', 0.12),
        strong: alpha('#111111', 0.2),
      },

      // Semantic colors adapted for TRA branding
      success: {
        50: '#f0f9f4',
        100: '#dcf4e3',
        200: '#bce7cc',
        300: '#86d4a7',
        400: '#4aba7b',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        main: '#22c55e',
        light: '#dcf4e3',
        dark: '#15803d',
        contrastText: '#ffffff',
      },

      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        main: '#ef4444',
        light: '#fee2e2',
        dark: '#b91c1c',
        contrastText: '#ffffff',
      },

      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        main: '#f59e0b',
        light: '#fef3c7',
        dark: '#b45309',
        contrastText: '#111111',
      },

      info: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        main: '#3b82f6',
        light: '#dbeafe',
        dark: '#1d4ed8',
        contrastText: '#ffffff',
      },

      // Extended grey palette
      grey: {
        50: '#f8f9fa',
        100: '#f1f3f4',
        200: '#e8eaed',
        300: '#dadce0',
        400: '#bdc1c6',
        500: '#9aa0a6',
        600: '#80868b',
        700: '#5f6368',
        800: '#3c4043',
        900: '#111111',
      },

      // TRA Brand specific colors
      brand: {
        yellow: {
          primary: '#fff200',
          secondary: '#fffde7',
          accent: '#e6d700',
          dark: '#ccbf00',
        },
        black: {
          primary: '#111111',
          secondary: '#333333',
          light: '#5f6368',
        },
      },

      // Status colors for TRA operations
      status: {
        active: '#22c55e',
        inactive: '#9aa0a6',
        pending: '#f59e0b',
        cancelled: '#ef4444',
        completed: '#3b82f6',
      },

      // Special TRA transport colors
      transport: {
        bus: '#fff200',
        train: '#111111',
        ferry: '#3b82f6',
        airport: '#f59e0b',
      },
    },
  },
];

// Enhanced TRA Dark Theme Colors
const DarkThemeColors = [
  {
    name: 'TRA_DARK_THEME',
    palette: {
      // TRA Primary Yellow for dark mode
      primary: {
        50: '#fffef7',
        100: '#fffceb',
        200: '#fff9d6',
        300: '#fff4b8',
        400: '#fff394',
        main: '#fff200',
        500: '#fff200',
        600: '#e6d700',
        700: '#ccbf00',
        800: '#b3a600',
        900: '#998c00',
        light: '#fff394',
        dark: '#ccbf00',
        contrastText: '#111111',
      },

      // White/Light for dark mode secondary
      secondary: {
        50: '#111111',
        100: '#1f1f1f',
        200: '#2d2d2d',
        300: '#404040',
        400: '#525252',
        500: '#737373',
        600: '#a3a3a3',
        700: '#d4d4d4',
        800: '#e5e5e5',
        main: '#ffffff',
        900: '#ffffff',
        light: '#e5e5e5',
        dark: '#d4d4d4',
        contrastText: '#111111',
      },

      // Dark mode backgrounds
      background: {
        default: '#0a0a0a',
        paper: '#111111',
        nav: alpha('#000000', 0.95),
        dashboard: '#0f0f0f',
        grid: '#151515',
        gridSelect: alpha('#fff200', 0.12),
        elevated: '#1a1a1a',
        contrast: '#ffffff',
      },

      // Dark surface variations
      surface: {
        primary: '#111111',
        secondary: '#1a1a1a',
        tertiary: '#252525',
        accent: alpha('#fff200', 0.08),
      },

      // Dark mode text
      text: {
        primary: '#ffffff',
        secondary: '#d4d4d4',
        tertiary: '#a3a3a3',
        disabled: '#525252',
        contrast: '#111111',
        accent: '#fff200',
      },

      // Dark mode actions
      action: {
        hover: alpha('#ffffff', 0.04),
        selected: alpha('#fff200', 0.16),
        disabled: '#404040',
        disabledBackground: '#1f1f1f',
        focus: alpha('#fff200', 0.2),
      },

      // Dark mode dividers
      divider: alpha('#ffffff', 0.08),
      border: {
        light: alpha('#ffffff', 0.06),
        main: alpha('#ffffff', 0.12),
        strong: alpha('#ffffff', 0.2),
      },

      // Dark mode semantic colors
      success: {
        main: '#22c55e',
        light: alpha('#22c55e', 0.12),
        dark: '#15803d',
        contrastText: '#ffffff',
      },

      error: {
        main: '#ef4444',
        light: alpha('#ef4444', 0.12),
        dark: '#b91c1c',
        contrastText: '#ffffff',
      },

      warning: {
        main: '#f59e0b',
        light: alpha('#f59e0b', 0.12),
        dark: '#b45309',
        contrastText: '#111111',
      },

      info: {
        main: '#3b82f6',
        light: alpha('#3b82f6', 0.12),
        dark: '#1d4ed8',
        contrastText: '#ffffff',
      },

      // Dark mode greys (inverted)
      grey: {
        50: '#111111',
        100: '#1f1f1f',
        200: '#2d2d2d',
        300: '#404040',
        400: '#525252',
        500: '#737373',
        600: '#a3a3a3',
        700: '#d4d4d4',
        800: '#e5e5e5',
        900: '#ffffff',
      },
    },
  },
];

export { LightThemeColors, DarkThemeColors };
