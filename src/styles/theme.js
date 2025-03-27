// src/styles/theme.js
const theme = {
    colors: {
      primary: '#FF5722',        // Vibrant orange for key actions and branding
      secondary: '#2196F3',      // Blue for secondary elements
      accent: '#8BC34A',         // Green for success states
      error: '#F44336',          // Red for errors
      warning: '#FFC107',        // Amber for warnings
      dark: '#263238',           // Deep blue-grey for text
      light: '#ECEFF1',          // Light blue-grey for backgrounds
      white: '#FFFFFF',
      black: '#000000',
      background: {
        main: '#F5F5F5',         // Light grey for main background
        paper: '#FFFFFF',        // White for cards and elevated surfaces
        dark: '#121212',         // Dark mode background
      },
      text: {
        primary: '#263238',      // Primary text color
        secondary: '#607D8B',    // Secondary text color
        disabled: '#9E9E9E',     // Disabled text color
        hint: '#9E9E9E',         // Hint text color
      }
    },
    typography: {
      fontFamily: "'Poppins', 'Roboto', sans-serif",
      h1: { fontSize: '2.5rem', fontWeight: 600 },
      h2: { fontSize: '2rem', fontWeight: 600 },
      h3: { fontSize: '1.75rem', fontWeight: 600 },
      h4: { fontSize: '1.5rem', fontWeight: 500 },
      h5: { fontSize: '1.25rem', fontWeight: 500 },
      h6: { fontSize: '1rem', fontWeight: 500 },
      body1: { fontSize: '1rem', lineHeight: 1.5 },
      body2: { fontSize: '0.875rem', lineHeight: 1.43 },
    },
    shadows: {
      small: '0 2px 8px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
      large: '0 8px 24px rgba(0, 0, 0, 0.2)',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '16px',
      full: '9999px',
    },
    transitions: {
      short: '0.2s ease',
      medium: '0.3s ease',
      long: '0.5s ease',
    }
  };
  
  export default theme;