import { useAuth } from 'contexts/auth';
import React from 'react'
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ roles, children }) => {
  const { authState, isAuthenticated } = useAuth();

  if (!isAuthenticated() || !authState.user || !roles.includes(authState.user.role)) {
    return <Navigate to='/login' />
  }

  return children;
}

export default RequireAuth
