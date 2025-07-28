import React, { createContext, useContext, useState, useEffect } from 'react';

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
      setToken(startupToken);
      setRole('startup');
      setUser({ type: 'startup' });
    } else if (investorToken) {
      setToken(investorToken);
      setRole('investor');
      setUser({ type: 'investor' });
    } else if (adminToken) {
      setToken(adminToken);
      setRole('admin');
      setUser({ type: 'admin' });
    } else if (userToken) {
      setToken(userToken);
      setRole('user');
      setUser({ type: 'user' });
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
    window.addEventListener('storage', updateAuthState);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', updateAuthState);
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
      // Дополнительно обновляем состояние
      updateAuthState();
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

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 