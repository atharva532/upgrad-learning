import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface OnboardingRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for onboarding screens
 * - Requires authentication
 * - Redirects to /home if user has already completed onboarding
 */
export function OnboardingRoute({ children }: OnboardingRouteProps) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();
  const location = useLocation();

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

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Already completed onboarding - redirect to home
  if (hasCompletedOnboarding) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
