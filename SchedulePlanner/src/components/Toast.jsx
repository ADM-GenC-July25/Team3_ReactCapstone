import React from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Toast = () => {
  const { showToast, toastMessage } = useCart();

  if (!showToast) return null;

  return (
    <div className="toast">
      {toastMessage}
    </div>
  );
};

export default Toast; 