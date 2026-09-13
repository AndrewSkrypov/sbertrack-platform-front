import { alpha, createTheme } from '@mui/material/styles';

// Фирменная палитра платформы «Трек». Единый источник правды — используйте
// эти константы вместо хардкода hex-цветов в компонентах, чтобы тема
// оставалась управляемой из одного места.
export const brand = {
  ink: '#0e2a22',
  forest: '#136452',
  teal: '#159078',
  lime: '#3d9a55',
  blue: '#0057d9',
  paper: '#fafafa',
  paperDim: '#eaf1ec',
  stone: '#4a5a54',
  stone2: '#7c8a84'
} as const;

export const fontDisplay = '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const fontBody = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const fontMono = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
// Публично доступный гротеск с пропорциями, близкими к корпоративному
// шрифту финансового сектора — используется на auth-экранах (вход/регистрация),
// где важно ощущение «банковского» интерфейса.
export const fontSber = '"Golos Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

declare module '@mui/material/styles' {
  interface Theme {
    brand: typeof brand;
    fontMono: string;
  }
  interface ThemeOptions {
    brand?: typeof brand;
    fontMono?: string;
  }
}

export const sberTrackTheme = createTheme({
  brand,
  fontMono,
  palette: {
    mode: 'light',
    primary: { main: brand.teal, dark: brand.forest, light: '#e8f5f2' },
    secondary: { main: '#64748b', dark: '#475569', light: '#f1f5f9' },
    success: { main: brand.lime },
    warning: { main: '#d97706' },
    error: { main: '#dc2626' },
    background: { default: brand.paper, paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' }
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: fontBody,
    h1: { fontFamily: fontDisplay, fontWeight: 800, letterSpacing: '-0.03em', fontSize: '3.5rem', lineHeight: 1.05 },
    h2: { fontFamily: fontDisplay, fontWeight: 800, letterSpacing: '-0.025em', fontSize: '2.5rem', lineHeight: 1.15 },
    h3: { fontFamily: fontDisplay, fontWeight: 800, letterSpacing: '-0.02em', fontSize: '2rem', lineHeight: 1.2 },
    h4: { fontFamily: fontDisplay, fontWeight: 800, letterSpacing: '-0.015em', fontSize: '1.5rem', lineHeight: 1.3 },
    h5: { fontFamily: fontDisplay, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.4 },
    h6: { fontFamily: fontDisplay, fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.4 },
    body1: { lineHeight: 1.65, fontSize: '1rem' },
    body2: { lineHeight: 1.6, fontSize: '0.875rem' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*:focus-visible': {
          outline: `2px solid ${brand.teal}`,
          outlineOffset: 2
        }
      }
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined'
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: 8,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          transition: 'border-color 150ms ease',
          '&:hover': {
            borderColor: alpha(theme.palette.text.primary, 0.12)
          }
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          backgroundImage: 'none',
          borderRadius: 8,
          ...(ownerState.variant === 'outlined' && {
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: 'none'
          })
        })
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 6 },
        notchedOutline: ({ theme }) => ({
          borderColor: alpha(theme.palette.text.primary, 0.1)
        })
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontWeight: 500 }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': { paddingBottom: 24 }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          minHeight: 40,
          boxShadow: 'none',
          padding: '8px 16px'
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)'
          }
        },
        sizeSmall: {
          minHeight: 32,
          padding: '4px 12px'
        },
        sizeLarge: {
          minHeight: 48,
          padding: '12px 24px'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.8125rem'
        }
      }
    }
  }
});
