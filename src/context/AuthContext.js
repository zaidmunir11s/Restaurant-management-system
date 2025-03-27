// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          // Check if it's a demo token
          if (token === 'demo-jwt-token-123456') {
            // Set mock user for demo
            setCurrentUser({
              id: 1,
              firstName: "Admin",
              lastName: "User",
              email: "admin@example.com",
              role: "owner"
            });
          } else {
            // Set token in API headers
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Fetch current user info from API
            const response = await api.get('/users/me');
            setCurrentUser(response.data);
          }
        } catch (error) {
          // If token is invalid, remove it
          localStorage.removeItem('auth_token');
          api.defaults.headers.common['Authorization'] = '';
          setError('Authentication session expired. Please login again.');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // DEMO CREDENTIALS - Remove this in production and use real API
      if (credentials.email === "admin@example.com" && credentials.password === "password123") {
        // Mock successful login response
        const mockUser = {
          id: 1,
          firstName: "Admin",
          lastName: "User",
          email: "admin@example.com",
          role: "owner"
        };
        
        const mockToken = "demo-jwt-token-123456";
        
        // Save token to localStorage
        localStorage.setItem('auth_token', mockToken);
        
        // Set token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        setCurrentUser(mockUser);
        setError(null);
        
        // Redirect to owner dashboard
        navigate('/owner/dashboard');
        
        return mockUser;
      }
      
      // If not using demo credentials, attempt the regular API call
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('auth_token', token);
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      setError(null);
      
      // Redirect based on role
      if (user.role === 'owner') {
        navigate('/owner/dashboard');
      } else if (user.role === 'manager') {
        navigate('/manager/dashboard');
      } else if (user.role === 'waiter') {
        navigate('/waiter/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Authentication failed. Try using admin@example.com / password123';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      // DEMO REGISTRATION - Add demo registration if needed
      if (userData.email === "newuser@example.com") {
        // Mock registration
        const mockUser = {
          id: 2,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: "owner"
        };
        
        const mockToken = "demo-jwt-token-new-user";
        
        // Save token to localStorage
        localStorage.setItem('auth_token', mockToken);
        
        // Set token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        setCurrentUser(mockUser);
        setError(null);
        
        navigate('/dashboard');
        
        return mockUser;
      }
      
      // Regular API call for registration
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('auth_token', token);
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      setError(null);
      
      navigate('/dashboard');
      
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
    
    // Clear Authorization header
    api.defaults.headers.common['Authorization'] = '';
    
    // Clear current user
    setCurrentUser(null);
    
    // Redirect to login page
    navigate('/signin');
  };

  const createUserAccount = async (userData) => {
    try {
      // DEMO USER CREATION - For demo purposes
      if (!userData.email.includes('@api.com')) {
        // Mock user creation
        return {
          id: Math.floor(Math.random() * 1000),
          ...userData,
          createdAt: new Date().toISOString()
        };
      }
      
      // Regular API call
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user';
      throw new Error(message);
    }
  };

  const updateRole = async (userId, role) => {
    try {
      // DEMO ROLE UPDATE - For demo purposes
      if (userId < 1000) {
        // Mock role update
        return {
          id: userId,
          role,
          updated: true
        };
      }
      
      // Regular API call
      const response = await api.patch(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update role';
      throw new Error(message);
    }
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
    createUserAccount,
    updateRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;