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
  const [toastType, setToastType] = useState('success'); // 'success', 'error', 'warning'

  const addToCart = (item, type) => {
    // Check if item is already in cart
    const isAlreadyInCart = cartItems.some(cartItem => 
      cartItem.type === type && cartItem.id === item.id
    );

    if (isAlreadyInCart) {
      showToastMessage(`${item.name || item.title} is already in your cart!`, 'warning');
      return false;
    }

    const cartItem = {
      ...item,
      cartId: `${type}-${item.id}-${Date.now()}`, // Unique cart ID
      type: type, // 'course' or 'timeblock'
      addedAt: new Date().toISOString()
    };

    setCartItems(prevItems => [...prevItems, cartItem]);
    showToastMessage(`${item.name || item.title} added to cart!`, 'success');
    return true;
  };

  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
    showToastMessage('Item removed from cart', 'success');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
      setToastType('success');
    }, 4000); // Increased timeout for error messages
  };

  const showConflictError = (conflicts) => {
    const conflictNames = conflicts.map(c => c.name || c.title).join(', ');
    showToastMessage(
      `Cannot add to schedule: Time conflict with ${conflictNames}. Please resolve conflicts first.`, 
      'error'
    );
  };

  const checkout = (scheduleContext) => {
    if (!scheduleContext) {
      showToastMessage('Error: Schedule system not available', 'error');
      return { success: false };
    }

    let hasErrors = false;
    const conflictedItems = [];
    const successfulItems = [];

    // Process each cart item
    cartItems.forEach(item => {
      if (item.type === 'course') {
        const result = scheduleContext.addCourse(item);
        if (!result.success) {
          hasErrors = true;
          conflictedItems.push({
            item,
            conflicts: result.conflicts || []
          });
        } else {
          successfulItems.push(item);
        }
      } else if (item.type === 'timeblock') {
        const result = scheduleContext.addTimeBlock(item);
        if (!result.success) {
          hasErrors = true;
          conflictedItems.push({
            item,
            conflicts: result.conflicts || []
          });
        } else {
          successfulItems.push(item);
        }
      }
    });

    if (hasErrors) {
      // Show detailed conflict information
      const conflictMessages = conflictedItems.map(({ item, conflicts }) => {
        const conflictNames = conflicts.map(c => c.name || c.title).join(', ');
        return `${item.name || item.title} conflicts with: ${conflictNames}`;
      });
      
      showToastMessage(
        `Checkout partially failed. Conflicts found:\n${conflictMessages.join('\n')}`, 
        'error'
      );

      // Remove only successful items from cart
      const successfulCartIds = successfulItems.map(item => item.cartId);
      setCartItems(prevItems => 
        prevItems.filter(item => !successfulCartIds.includes(item.cartId))
      );

      return { 
        success: false, 
        conflicts: conflictedItems,
        successful: successfulItems.length
      };
    } else {
      // All items added successfully
      showToastMessage(
        `Successfully added ${cartItems.length} item(s) to your schedule!`, 
        'success'
      );
      clearCart();
      return { success: true, itemsAdded: cartItems.length };
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    checkout,
    showToast,
    toastMessage,
    toastType,
    showConflictError,
    showToastMessage,
    cartCount: cartItems.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 