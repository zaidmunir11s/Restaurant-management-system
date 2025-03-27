// src/context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import GlobalStyles from '../styles/globalStyles';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    // Check if user previously selected dark mode
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    // Save user preference
    localStorage.setItem('darkMode', darkMode);
    
    // Update theme based on dark mode preference
    if (darkMode) {
      setCurrentTheme({
        ...theme,
        colors: {
          ...theme.colors,
          background: {
            main: '#121212',
            paper: '#1E1E1E',
            dark: '#0A0A0A'
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#B0BEC5',
            disabled: '#666666',
            hint: '#666666'
          }
        }
      });
    } else {
      setCurrentTheme(theme);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const value = {
    theme: currentTheme,
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={currentTheme}>
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;