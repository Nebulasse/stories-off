import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff9f',
      light: '#33ffb5',
      dark: '#00b36f',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff00ff',
      light: '#ff33ff',
      dark: '#b300b3',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      background: 'linear-gradient(45deg, #00ff9f 30%, #ff00ff 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
    },
    h2: {
      color: '#00ff9f',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          '&:hover': {
            boxShadow: '0 0 15px rgba(0, 255, 159, 0.5)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #00ff9f 30%, #ff00ff 90%)',
          color: '#000000',
        },
        outlined: {
          borderColor: '#00ff9f',
          color: '#00ff9f',
          '&:hover': {
            borderColor: '#ff00ff',
            color: '#ff00ff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(0, 255, 159, 0.1)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 255, 159, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 255, 159, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 255, 159, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00ff9f',
            },
          },
        },
      },
    },
  },
});

export default theme; 