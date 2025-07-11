import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'customer' | 'owner' | 'admin'>;
  redirectPath?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectPath = '/' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className='flex justify-center items-center h-screen text-lg'><p>Loading...</p></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === 'customer') {
      return <Navigate to="/dashboard/customer" replace />;
    } else if (user.role === 'owner') {
      return <Navigate to="/dashboard/owner" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else {
      // Fallback to the provided redirect path
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
