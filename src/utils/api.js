// src/utils/api.js
import axios from 'axios';

// Base API URL - replace with your actual API URL or use environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      // For backward compatibility with some APIs that use x-auth-token
      config.headers['x-auth-token'] = token;
      
      console.log(`Making ${config.method.toUpperCase()} request to ${config.url} with auth token`);
    } else {
      console.warn(`Making ${config.method.toUpperCase()} request to ${config.url} WITHOUT auth token`);
    }
    
    // For debugging
    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
      console.log('Request data:', config.data);
    } else if (config.data instanceof FormData) {
      console.log('Sending FormData');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}: ${response.status}`);
    return response;
  },
  async (error) => {
    console.error('API Response Error:', error);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error message:', error.message);
    }
    
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Unauthorized error, attempting token refresh...');
      originalRequest._retry = true;
      
      // Try to refresh token or logout if that fails
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          // Call refresh token endpoint
          const response = await axios.post(
            `${API_URL}/auth/refresh-token`,
            { refreshToken },
            { 
              headers: { 'Content-Type': 'application/json' }
            }
          );
          
          const { token } = response.data;
          
          // Update stored token
          localStorage.setItem('token', token);
          console.log('Token refreshed successfully');
          
          // Update authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          
          // Retry the original request
          return api(originalRequest);
        } else {
          console.warn('No refresh token available, redirecting to login');
          // No refresh token, clear auth and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/signin';
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh token failed, clear auth and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;