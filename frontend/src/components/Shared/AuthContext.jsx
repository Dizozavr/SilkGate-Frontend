import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  const updateAuthState = () => {
    // Проверяем токены в localStorage
    const investorToken = localStorage.getItem('investorToken');
    const adminToken = localStorage.getItem('adminToken');
    const startupToken = localStorage.getItem('startupToken');
    const userToken = localStorage.getItem('userToken');
    console.log('AuthContext update', { investorToken, adminToken, startupToken, userToken });
    
    if (startupToken) {
      try {
        const decoded = jwtDecode(startupToken);
        setToken(startupToken);
        setRole('startup');
        setUser({ name: decoded.name || decoded.email, email: decoded.email });
      } catch (e) {
        localStorage.removeItem('startupToken');
        setToken(null);
        setRole(null);
        setUser(null);
      }
    } else if (investorToken) {
      try {
        const decoded = jwtDecode(investorToken);
        setToken(investorToken);
        setRole('investor');
        setUser({ name: decoded.name || decoded.email, email: decoded.email });
      } catch (e) {
        localStorage.removeItem('investorToken');
        setToken(null);
        setRole(null);
        setUser(null);
      }
    } else if (adminToken) {
      try {
        const decoded = jwtDecode(adminToken);
        setToken(adminToken);
        setRole('admin');
        setUser({ name: decoded.name || 'Admin', email: decoded.email });
      } catch (e) {
        localStorage.removeItem('adminToken');
        setToken(null);
        setRole(null);
        setUser(null);
      }
    } else if (userToken) {
      try {
        const decoded = jwtDecode(userToken);
        setToken(userToken);
        setRole('user');
        setUser({ name: decoded.name || decoded.email, email: decoded.email });
      } catch (e) {
        localStorage.removeItem('userToken');
        setToken(null);
        setRole(null);
        setUser(null);
      }
    } else {
      setToken(null);
      setRole(null);
      setUser(null);
    }
  };

  useEffect(() => {
    updateAuthState();
    
    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      updateAuthState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authUpdate', updateAuthState);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authUpdate', updateAuthState);
    };
  }, []);

  const login = (userData, token, role) => {
    // Сброс всех токенов перед установкой нового
    localStorage.removeItem('investorToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('startupToken');
    localStorage.removeItem('userToken');
    
    // Устанавливаем токен в localStorage
    if (role === 'investor') localStorage.setItem('investorToken', token);
    if (role === 'admin') localStorage.setItem('adminToken', token);
    if (role === 'startup') localStorage.setItem('startupToken', token);
    if (role === 'user') localStorage.setItem('userToken', token);
    
    // Обновляем состояние
    setUser(userData);
    setToken(token);
    setRole(role);
    
    // Принудительно обновляем компоненты
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('authUpdate'));
    }, 100);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('investorToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('startupToken');
    localStorage.removeItem('userToken');
  };

  const checkApplicationStatus = async () => {
    if (!token || role !== 'user') return;

    try {
      const response = await fetch('/api/users/application-status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Если заявка одобрена, обновляем роль
        if (data.approvedRole) {
          // Удаляем информацию о заявке
          localStorage.removeItem('pendingInvestorApplication');
          localStorage.removeItem('pendingStartupApplication');
          
          // Обновляем роль пользователя
          if (data.approvedRole === 'investor') {
            localStorage.setItem('investorToken', token);
            localStorage.removeItem('userToken');
            setRole('investor');
          } else if (data.approvedRole === 'startup') {
            localStorage.setItem('startupToken', token);
            localStorage.removeItem('userToken');
            setRole('startup');
          }
          
          // Обновляем компоненты
          window.dispatchEvent(new Event('authUpdate'));
          
          return data.approvedRole;
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке статуса заявки:', error);
    }
    
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, checkApplicationStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 