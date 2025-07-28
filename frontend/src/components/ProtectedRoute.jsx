import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children, role }) {
  let token = null;
  if (role === 'admin') {
    token = localStorage.getItem('adminToken');
    if (!token) return <Navigate to="/admin" replace />;
  } else if (role === 'investor') {
    token = localStorage.getItem('investorToken');
    if (!token) return <Navigate to="/login" replace />;
  } else if (role === 'startup') {
    token = localStorage.getItem('startupToken');
    if (!token) return <Navigate to="/startup-login" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
  // Проверка срока действия токена
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && Date.now() / 1000 > decoded.exp) {
      if (role === 'admin') localStorage.removeItem('adminToken');
      if (role === 'investor') localStorage.removeItem('investorToken');
      if (role === 'startup') localStorage.removeItem('startupToken');
      return <Navigate to={role === 'admin' ? '/admin' : role === 'startup' ? '/startup-login' : '/login'} replace />;
    }
  } catch {
    if (role === 'admin') localStorage.removeItem('adminToken');
    if (role === 'investor') localStorage.removeItem('investorToken');
    if (role === 'startup') localStorage.removeItem('startupToken');
    return <Navigate to={role === 'admin' ? '/admin' : role === 'startup' ? '/startup-login' : '/login'} replace />;
  }
  return children;
} 