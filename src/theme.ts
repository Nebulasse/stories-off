import { createTheme } from '@mui/material/styles';

// Неоновые цвета
const neonColors = {
  primary: '#00ff9d',
  secondary: '#ff00ff',
  accent: '#00ffff',
  error: '#ff0055',
  warning: '#ffaa00',
  info: '#00aaff',
  success: '#00ff88'
};

// Градиенты
const gradients = {
  primary: 'linear-gradient(135deg, #00ff9d 0%, #00ffff 100%)',
  secondary: 'linear-gradient(135deg, #ff00ff 0%, #ff0055 100%)',
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: neonColors.primary,
      light: '#33ffb1',
      dark: '#00cc7d'
    },
    secondary: {
      main: neonColors.secondary,
      light: '#ff33ff',
      dark: '#cc00cc'
    },
    error: {
      main: neonColors.error
    },
    warning: {
      main: neonColors.warning
    },
    info: {
      main: neonColors.info
    },
    success: {
      main: neonColors.success
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a'
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)'
    }
  },
  typography: {
    fontFamily: 'var(--font-main)',
    h1: {
      fontFamily: 'var(--font-heading)',
      fontSize: '3.5rem',
      fontWeight: 700,
      background: gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    h2: {
      fontFamily: 'var(--font-heading)',
      fontSize: '2.5rem',
      fontWeight: 600,
      background: gradients.secondary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    h3: {
      fontFamily: 'var(--font-heading)',
      fontSize: '2rem',
      fontWeight: 600
    },
    h4: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.75rem',
      fontWeight: 600
    },
    h5: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.5rem',
      fontWeight: 500
    },
    h6: {
      fontFamily: 'var(--font-heading)',
      fontSize: '1.25rem',
      fontWeight: 500
    },
    body1: {
      fontFamily: 'var(--font-main)',
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontFamily: 'var(--font-main)',
      fontSize: '0.875rem',
      lineHeight: 1.43
    },
    techno: {
      fontFamily: 'var(--font-techno)',
      fontWeight: 700,
      letterSpacing: '0.05em'
    },
    creative: {
      fontFamily: 'var(--font-creative)',
      fontWeight: 700,
      letterSpacing: '0.05em'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: gradients.background,
          minHeight: '100vh'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 0 20px ${neonColors.primary}40`
          }
        },
        contained: {
          background: gradients.primary,
          '&:hover': {
            background: gradients.primary
          }
        },
        outlined: {
          borderColor: neonColors.primary,
          color: neonColors.primary,
          '&:hover': {
            borderColor: neonColors.primary,
            background: `${neonColors.primary}10`
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: gradients.card,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: gradients.card,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 0 30px ${neonColors.primary}20`
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)'
            },
            '&:hover fieldset': {
              borderColor: neonColors.primary
            },
            '&.Mui-focused fieldset': {
              borderColor: neonColors.primary
            }
          }
        }
      }
    }
  }
});

declare module '@mui/material/styles' {
  interface TypographyVariants {
    techno: React.CSSProperties;
    creative: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    techno?: React.CSSProperties;
    creative?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    techno: true;
    creative: true;
  }
} 