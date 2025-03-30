// src/config/index.js

// Base API URL - change this to your actual backend URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Environment configurations
const config = {
  // API and server settings
  api: {
    baseURL: API_URL,
    timeout: 10000
  },
  
  // Feature flags
  features: {
    // Enable localStorage fallback for demo mode
    useLocalStorageFallback: process.env.REACT_APP_USE_LOCALSTORAGE_FALLBACK === 'true',
    
    // Enable demo data initialization
    initializeDemoData: process.env.REACT_APP_INITIALIZE_DEMO_DATA === 'true'
  },
  
  // Authentication settings
  auth: {
    tokenStorageKey: 'token',
    userStorageKey: 'user',
    refreshTokenStorageKey: 'refresh_token'
  }
};

export default config;