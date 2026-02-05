import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectAuthenticated?: boolean;
}

export function PublicRoute({ children, redirectAuthenticated = false }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-spinner"></div>
          <p className="auth-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users away from login page
  if (redirectAuthenticated && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
