'use client';

import { createTheme } from '@mui/material/styles';

/**
 * Minimal Material-UI theme
 * Matches our main project's color scheme
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00A76F', // Green (our brand color)
    },
    secondary: {
      main: '#8E33FF',
    },
    error: {
      main: '#FF5630',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F9FAFB',
    },
  },
  typography: {
    fontFamily: '"Public Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;













