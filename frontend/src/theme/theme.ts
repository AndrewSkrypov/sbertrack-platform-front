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
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em' },
    h4: { fontWeight: 800, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.55 },
    button: { fontWeight: 700, textTransform: 'none' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Единый видимый фокус-контур для клавиатурной навигации: MUI по
        // умолчанию полагается на browser outline, который непоследователен
        // между компонентами. :focus-visible не мешает мышиному клику.
        '*:focus-visible': {
          outline: '2px solid #0b7a64',
          outlineOffset: 2
        }
      }
    },
    MuiCard: {
      defaultProps: {
        variant: 'elevation'
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: 12,
          border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          boxShadow: ownerState.variant === 'outlined' ? 'none' : '0 1px 2px rgba(23, 33, 43, 0.04), 0 8px 24px rgba(23, 33, 43, 0.05)'
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          backgroundImage: 'none',
          borderRadius: 12,
          ...(ownerState.variant === 'outlined' && {
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: 'none'
          })
        })
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
        notchedOutline: ({ theme }) => ({
          borderColor: alpha(theme.palette.text.primary, 0.14)
        })
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontWeight: 600 }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        // Единый ритм отступов внутри карточек по всей системе — вместо
        // ситуативных p: { xs: 2.5, md: 3 } на отдельных страницах.
        root: {
          padding: 20,
          '&:last-child': { paddingBottom: 20 }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, minHeight: 40, boxShadow: 'none' },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 }
      }
    }
  }
});
