import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * PublicRoute component
 * Prevents authenticated users from accessing public routes (e.g., login page)
 * Redirects them to the dashboard if they're already logged in
 */
const PublicRoute = () => {
  const { currentUser, isLoading } = useContext(AuthContext);
  const location = useLocation();
  
  // Redirect if we know the user is authenticated
  if (currentUser) {
    // Redirect to the location they were trying to access, or to dashboard
    const redirectPath = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
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
  
  // Render child routes if not authenticated
  return <Outlet />;
};

export default PublicRoute;