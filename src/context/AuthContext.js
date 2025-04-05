import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      
      try {
        const storedUser = authService.getUserFromStorage();
        
        if (storedUser && authService.isAuthenticated()) {
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

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await authService.register(userData);
      setCurrentUser(data.user);
      setIsLoading(false);
      
      navigate('/dashboard');
      return data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await authService.login(credentials);
      
      if (data.user) {
        if (!data.user.permissions) {
          data.user.permissions = getDefaultPermissions(data.user.role);
        }
        
        if (!data.user.branchPermissions) {
          data.user.branchPermissions = {
            menu: [],
            tables: []
          };
        } else {
          if (!data.user.branchPermissions.menu) {
            data.user.branchPermissions.menu = [];
          }
          if (!data.user.branchPermissions.tables) {
            data.user.branchPermissions.tables = [];
          }
        }
      }
      
      setCurrentUser(data.user);
      setIsLoading(false);
      
      if (data.user.role === 'owner' || data.user.permissions?.manageRestaurants) {
        navigate('/restaurants');
      } else if (data.user.permissions?.manageBranches) {
        navigate('/branches');
      } else if (data.user.branchPermissions) {
        const hasBranchMenuAccess = data.user.branchPermissions.menu && 
                                  data.user.branchPermissions.menu.length > 0;
        const hasBranchTableAccess = data.user.branchPermissions.tables && 
                                   data.user.branchPermissions.tables.length > 0;
        
        if (hasBranchMenuAccess) {
          navigate('/assigned-menus');
        } else if (hasBranchTableAccess) {
          navigate('/assigned-tables');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
      
      return data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Login failed');
      throw err;
    }
  };
  
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

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/signin');
  };

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