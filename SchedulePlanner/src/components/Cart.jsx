import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeItem, clearCart, getCartItemCount } = useCart();
  const [showToast, setShowToast] = useState(false);

  const handleCheckout = () => {
    // Show toast message
    setShowToast(true);
    
    // Clear cart after checkout
    clearCart();
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const formatTimeDisplay = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDays = (days) => {
    if (Array.isArray(days)) {
      return days.join(', ');
    }
    return days;
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Schedule Cart</h1>
        <div className="cart-count">
          {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add courses and time blocks to your cart to build your schedule!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cartId} className="cart-item">
                <div className="cart-item-header">
                  <div 
                    className="cart-item-color" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="cart-item-title">
                    <h3>{item.name || item.title}</h3>
                    <span className="cart-item-type">
                      {item.type === 'course' ? 'Course' : 'Time Block'}
                    </span>
                  </div>
                  <button 
                    className="remove-button"
                    onClick={() => removeItem(item.cartId)}
                    title="Remove from cart"
                  >
                    ×
                  </button>
                </div>
                
                <div className="cart-item-details">
                  {item.type === 'course' ? (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Time:</span>
                        <span>{formatTimeDisplay(item.startTime)} - {formatTimeDisplay(item.endTime)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Days:</span>
                        <span>{formatDays(item.day)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Location:</span>
                        <span>{item.location}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Instructor:</span>
                        <span>{item.instructor}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Time:</span>
                        <span>{formatTimeDisplay(item.startTime)} - {formatTimeDisplay(item.endTime)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Day:</span>
                        <span>{item.day}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Type:</span>
                        <span>{item.type === 'timeblock' ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : item.type}</span>
                      </div>
                      {item.description && (
                        <div className="detail-row">
                          <span className="detail-label">Description:</span>
                          <span>{item.description}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-actions">
            <button 
              className="clear-cart-button"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <button 
              className="checkout-button"
              onClick={handleCheckout}
            >
              Checkout & Update Schedule
            </button>
          </div>
        </>
      )}

      {/* Toast notification */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">
            <span className="toast-icon">✅</span>
            <span className="toast-message">Schedule updated successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 