import React from 'react';
import { useCart } from '../context/CartContext';
import './Toast.css';

const Toast = () => {
  const { showToast, toastMessage, toastType } = useCart();

  if (!showToast) return null;

  const getToastIcon = () => {
    switch (toastType) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`toast toast-${toastType}`}>
      <div className="toast-content">
        <span className="toast-icon">{getToastIcon()}</span>
        <span className="toast-message">{toastMessage}</span>
      </div>
    </div>
  );
};

export default Toast; 