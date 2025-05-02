import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return (savedTheme as ThemeMode) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#00ff9f',
        light: '#33ffb5',
        dark: '#00b36f',
        contrastText: themeMode === 'dark' ? '#000000' : '#ffffff',
      },
      secondary: {
        main: '#ff00ff',
        light: '#ff33ff',
        dark: '#b300b3',
        contrastText: '#ffffff',
      },
      background: {
        default: themeMode === 'dark' ? '#121212' : '#ffffff',
        paper: themeMode === 'dark' ? '#1e1e1e' : '#f5f5f5',
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#000000',
        secondary: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
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
        color: themeMode === 'dark' ? '#00ff9f' : '#00b36f',
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
            color: themeMode === 'dark' ? '#000000' : '#ffffff',
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
            background: themeMode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            border: '1px solid rgba(0, 255, 159, 0.1)',
            '&:hover': {
              boxShadow: '0 0 20px rgba(0, 255, 159, 0.2)',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 