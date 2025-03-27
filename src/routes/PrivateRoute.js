// src/routes/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * PrivateRoute component
 * Redirects to login page if user is not authenticated
 */
const PrivateRoute = () => {
  const { currentUser, isLoading } = useContext(AuthContext);
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '3px solid #e0e0e0',
              borderTopColor: '#FF5722',
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }}
          />
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // Render child routes if authenticated
  return <Outlet />;
};

export default PrivateRoute;