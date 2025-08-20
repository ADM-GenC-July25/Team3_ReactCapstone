import React from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, clearCart, checkout, cartCount } = useCart();

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleCheckout = () => {
    checkout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Cart ({cartCount})</h2>
          <button className="close-cart" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p>Add some courses or time blocks to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="cart-item">
                    <div className="item-header">
                      <h4>{item.name || item.title}</h4>
                      <button 
                        className="remove-item" 
                        onClick={() => removeFromCart(item.cartId)}
                        title="Remove from cart"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="item-details">
                      <span className="item-type">
                        {item.type === 'course' ? '📚 Course' : '⏰ Time Block'}
                      </span>
                      
                      {item.type === 'course' ? (
                        <div className="course-details">
                          <div>📅 {item.day?.join(', ') || 'No days specified'}</div>
                          <div>🕐 {formatTime(item.startTime)} - {formatTime(item.endTime)}</div>
                          <div>📍 {item.location || 'No location'}</div>
                          <div>👨‍🏫 {item.instructor || 'No instructor'}</div>
                        </div>
                      ) : (
                        <div className="timeblock-details">
                          <div>📅 {item.day}</div>
                          <div>🕐 {formatTime(item.startTime)} - {formatTime(item.endTime)}</div>
                          <div>📝 {item.type?.charAt(0).toUpperCase() + item.type?.slice(1)}</div>
                          {item.description && <div>💬 {item.description}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Checkout & Update Schedule
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart; 