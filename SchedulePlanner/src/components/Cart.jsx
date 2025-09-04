import React from 'react';
import { useCart } from '../context/CartContext';
import { useSchedule } from '../contexts/ScheduleContext';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, clearCart, checkout, cartCount } = useCart();
  const scheduleContext = useSchedule();

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDays = (days) => {
    if (!days) return 'No days specified';
    if (Array.isArray(days)) return days.join(', ');
    return days;
  };

  const handleCheckout = () => {
    const result = checkout(scheduleContext);
    
    if (result.success) {
      // Close cart only if completely successful
      onClose();
    }
    // If there are conflicts, keep cart open so user can see remaining items
  };

  // Check for potential conflicts before checkout
  const checkForConflicts = () => {
    let hasConflicts = false;
    const conflictInfo = [];

    cartItems.forEach(item => {
      const enrolledCourses = scheduleContext.getEnrolledCourses();
      const timeBlocks = scheduleContext.getTimeBlocks();
      const existingItems = [...enrolledCourses, ...timeBlocks];
      
      const itemWithDays = {
        ...item,
        itemType: item.type,
        days: item.type === 'course' ? (Array.isArray(item.days) ? item.days : item.day) : [item.day]
      };

      const conflicts = scheduleContext.findConflicts(itemWithDays, existingItems);
      if (conflicts.length > 0) {
        hasConflicts = true;
        conflictInfo.push({
          item: item.name || item.title,
          conflicts: conflicts.map(c => c.name || c.title)
        });
      }
    });

    return { hasConflicts, conflictInfo };
  };

  const { hasConflicts, conflictInfo } = checkForConflicts();

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
              {/* Show conflict warning if any exist */}
              {hasConflicts && (
                <div className="conflict-warning">
                  <h4>⚠️ Potential Conflicts Detected</h4>
                  <div className="conflict-details">
                    {conflictInfo.map((info, index) => (
                      <div key={index} className="conflict-item">
                        <strong>{info.item}</strong> conflicts with: {info.conflicts.join(', ')}
                      </div>
                    ))}
                  </div>
                  <p><small>These conflicts will prevent checkout. Please remove conflicting items or resolve schedule conflicts first.</small></p>
                </div>
              )}

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
                          <div>📅 {formatDays(item.days || item.day)}</div>
                          <div>🕐 {formatTime(item.startTime)} - {formatTime(item.endTime)}</div>
                          <div>📍 {item.room || item.location || 'No location'}</div>
                          <div>👨‍🏫 {item.instructor || 'No instructor'}</div>
                          {item.subject && item.course && (
                            <div>📋 {item.subject} {item.course}-{item.section}</div>
                          )}
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
                <button 
                  className={`checkout-btn ${hasConflicts ? 'disabled' : ''}`} 
                  onClick={handleCheckout}
                  disabled={hasConflicts}
                  title={hasConflicts ? 'Resolve conflicts before checkout' : 'Add items to schedule'}
                >
                  {hasConflicts ? 'Conflicts Detected' : 'Checkout & Update Schedule'}
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