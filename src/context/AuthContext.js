// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage and validate token on app init
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      
      try {
        // First check if we have a user in localStorage
        const storedUser = authService.getUserFromStorage();
        
        if (storedUser && authService.isAuthenticated()) {
          // Validate token by fetching current user
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setCurrentUser(null);
        authService.logout();
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   */
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await authService.register(userData);
      setCurrentUser(data.user);
      setIsLoading(false);
      
      // Redirect to dashboard
      navigate('/dashboard');
      return data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  /**
   * Login user
   * @param {Object} credentials - User login credentials
   */
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await authService.login(credentials);
      setCurrentUser(data.user);
      setIsLoading(false);
      
      // Redirect to dashboard or return URL
      navigate('/dashboard');
      return data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/signin');
  };

  /**
   * Request password reset
   * @param {string} email - User email
   */
  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await authService.forgotPassword(email);
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to process request');
      throw err;
    }
  };

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} password - New password
   */
  const resetPassword = async (token, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await authService.resetPassword(token, password);
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to reset password');
      throw err;
    }
  };

  // Context value
  const value = {
    currentUser,
    isLoading,
    error,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;