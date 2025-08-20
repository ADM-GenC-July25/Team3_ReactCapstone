import React, { createContext, useContext, useReducer } from 'react';

// Cart action types
const CART_ACTIONS = {
  ADD_COURSE: 'ADD_COURSE',
  ADD_TIME_BLOCK: 'ADD_TIME_BLOCK',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_COURSE:
      // Check if course is already in cart
      const existingCourseIndex = state.items.findIndex(
        item => item.type === 'course' && item.id === action.payload.id
      );
      
      if (existingCourseIndex >= 0) {
        return state; // Course already in cart
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, type: 'course', cartId: Date.now() }]
      };
      
    case CART_ACTIONS.ADD_TIME_BLOCK:
      // Check if time block is already in cart
      const existingTimeBlockIndex = state.items.findIndex(
        item => item.type === 'timeblock' && item.id === action.payload.id
      );
      
      if (existingTimeBlockIndex >= 0) {
        return state; // Time block already in cart
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, type: 'timeblock', cartId: Date.now() }]
      };
      
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.cartId !== action.payload.cartId)
      };
      
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };
      
    default:
      return state;
  }
};

// Initial cart state
const initialState = {
  items: []
};

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);
  
  const addCourse = (course) => {
    dispatch({ type: CART_ACTIONS.ADD_COURSE, payload: course });
  };
  
  const addTimeBlock = (timeBlock) => {
    dispatch({ type: CART_ACTIONS.ADD_TIME_BLOCK, payload: timeBlock });
  };
  
  const removeItem = (cartId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { cartId } });
  };
  
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };
  
  const getCartItemCount = () => {
    return cartState.items.length;
  };
  
  const isItemInCart = (id, type) => {
    return cartState.items.some(item => item.id === id && item.type === type);
  };
  
  const value = {
    cartItems: cartState.items,
    addCourse,
    addTimeBlock,
    removeItem,
    clearCart,
    getCartItemCount,
    isItemInCart
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 