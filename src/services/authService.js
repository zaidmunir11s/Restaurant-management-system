// src/services/authService.js
import axios from 'axios';

// Base API URL - replace with your actual API URL or use environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth service methods
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with the registration response
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  /**
   * Login user
   * @param {Object} credentials - User login credentials
   * @returns {Promise} Promise with the login response
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  /**
   * Get current user data
   * @returns {Promise} Promise with the current user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user');
      return response.data;
    } catch (error) {
      // Clear storage on auth error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Promise with the request response
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  /**
   * Reset password using token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise} Promise with the reset response
   */
  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  /**
   * Logout user - clears local storage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getUserFromStorage: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;