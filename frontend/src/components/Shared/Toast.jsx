import React from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className={`toast toast-${type}`} onClick={onClose}>
      {message}
      <span className="toast-close">×</span>
    </div>
  );
};

export default Toast; 