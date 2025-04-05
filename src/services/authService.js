// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
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

const getDefaultPermissions = (role) => {
  switch (role) {
    case 'owner':
      return {
        manageUsers: true,
        manageMenu: true,
        manageTables: true,
        accessPOS: true,
        manageRestaurants: true,
        manageBranches: true
      };
    case 'manager':
      return {
        manageUsers: false,
        manageMenu: true,
        manageTables: true,
        accessPOS: true,
        manageRestaurants: false,
        manageBranches: true
      };
    case 'waiter':
      return {
        manageUsers: false,
        manageMenu: false,
        manageTables: false,
        accessPOS: true,
        manageRestaurants: false,
        manageBranches: false
      };
    default:
      return {
        manageUsers: false,
        manageMenu: false,
        manageTables: false,
        accessPOS: false,
        manageRestaurants: false,
        manageBranches: false
      };
  }
};

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        if (response.data.user && response.data.user._id && !response.data.user.id) {
          response.data.user.id = response.data.user._id;
        }
        
        if (!response.data.user.branchPermissions) {
          response.data.user.branchPermissions = { menu: [], tables: [] };
        } else {
          if (!response.data.user.branchPermissions.menu) {
            response.data.user.branchPermissions.menu = [];
          }
          if (!response.data.user.branchPermissions.tables) {
            response.data.user.branchPermissions.tables = [];
          }
        }
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  getUserFromStorage: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;