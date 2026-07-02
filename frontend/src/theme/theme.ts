import { alpha, createTheme } from '@mui/material/styles';

export const sberTrackTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0b7a64', dark: '#075747', light: '#dff3ec' },
    secondary: { main: '#2563eb', dark: '#1d4ed8', light: '#dbeafe' },
    success: { main: '#16803c' },
    warning: { main: '#b45309' },
    error: { main: '#b42318' },
    background: { default: '#f6f8fa', paper: '#ffffff' },
    text: { primary: '#17212b', secondary: '#5b6673' }
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
          boxShadow: '0 10px 28px rgba(23, 33, 43, 0.06)'
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, minHeight: 40 }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 }
      }
    }
  }
});
