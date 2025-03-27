// src/routes/RoleRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * RoleRoute component
 * Restricts access based on user role
 * 
 * @param {Array} allowedRoles - Array of roles allowed to access the route
 */
const RoleRoute = ({ allowedRoles }) => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  
  // Check if user's role is in the allowed roles
  const hasPermission = currentUser && allowedRoles.includes(currentUser.role);
  
  if (!hasPermission) {
    // Redirect to appropriate dashboard based on role
    let redirectPath = '/';
    
    if (currentUser) {
      switch (currentUser.role) {
        case 'owner':
          redirectPath = '/owner/dashboard';
          break;
        case 'manager':
          redirectPath = '/manager/dashboard';
          break;
        case 'waiter':
          redirectPath = '/waiter/dashboard';
          break;
        default:
          redirectPath = '/';
      }
    }
    
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // Render child routes if user has permission
  return <Outlet />;
};

export default RoleRoute;