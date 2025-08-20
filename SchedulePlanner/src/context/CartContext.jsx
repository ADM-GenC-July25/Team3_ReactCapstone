import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const addToCart = (item, type) => {
    const cartItem = {
      ...item,
      cartId: `${type}-${item.id}-${Date.now()}`, // Unique cart ID
      type: type, // 'course' or 'timeblock'
      addedAt: new Date().toISOString()
    };

    setCartItems(prevItems => [...prevItems, cartItem]);
    showToastMessage(`${item.name || item.title} added to cart!`);
  };

  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 3000);
  };

  const checkout = () => {
    // For now, just show a toast message without updating actual schedule
    showToastMessage('Schedule updated successfully!');
    clearCart();
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    checkout,
    showToast,
    toastMessage,
    cartCount: cartItems.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 