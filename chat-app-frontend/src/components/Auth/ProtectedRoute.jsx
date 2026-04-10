import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ component: Component}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You can render a loading spinner here
    return <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">Loading...</div>;
  }

  return isAuthenticated ? (
    <Component />
  ) : (
    <Navigate to="/" replace /> // Redirect to login page if not authenticated
  );
};

export default ProtectedRoute;