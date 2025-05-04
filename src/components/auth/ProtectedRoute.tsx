import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode | ((props: { isAdmin: boolean }) => React.ReactNode);
  requireAdmin?: boolean;
  requireCounselor?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requireCounselor = false
}) => {
  const { user, isLoading, isAdmin, isCounselor } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireCounselor && !isCounselor) {
    return <Navigate to="/admin" replace />;
  }

  if (typeof children === 'function') {
    return <>{children({ isAdmin })}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;