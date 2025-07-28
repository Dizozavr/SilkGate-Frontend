import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  }, []);

  const closeToast = () => setToast(t => ({ ...t, visible: false }));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast {...toast} onClose={closeToast} />
    </ToastContext.Provider>
  );
}; 