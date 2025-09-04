import React from 'react';
import { useCart } from '../context/CartContext';
import { useSchedule } from '../contexts/ScheduleContext';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, clearCart, checkout, cartCount } = useCart();
  const scheduleContext = useSchedule();

  const formatTime = (time12) => {
    // Since times are now stored in 12-hour format, just return as-is
    if (!time12) return '';
    return time12;
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

    // First check conflicts with existing schedule
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

    // Check for conflicts between items in the cart
    for (let i = 0; i < cartItems.length; i++) {
      for (let j = i + 1; j < cartItems.length; j++) {
        const item1 = {
          ...cartItems[i],
          itemType: cartItems[i].type,
          days: cartItems[i].type === 'course' ? (Array.isArray(cartItems[i].days) ? cartItems[i].days : [cartItems[i].day]) : [cartItems[i].day]
        };
        const item2 = {
          ...cartItems[j],
          itemType: cartItems[j].type,
          days: cartItems[j].type === 'course' ? (Array.isArray(cartItems[j].days) ? cartItems[j].days : [cartItems[j].day]) : [cartItems[j].day]
        };

        // Use the same conflict detection logic from ScheduleContext
        if (hasTimeConflict(item1, item2)) {
          hasConflicts = true;
          conflictInfo.push({
            item: item1.name || item1.title,
            conflicts: [item2.name || item2.title]
          });
        }
      }
    }

    return { hasConflicts, conflictInfo };
  };

  // Helper function to check time conflicts (copied from ScheduleContext)
  const hasTimeConflict = (item1, item2) => {
    // Check if items are on the same day
    const days1 = item1.itemType === 'course' ? item1.days : [item1.day];
    const days2 = item2.itemType === 'course' ? item2.days : [item2.day];
    
    const commonDays = days1.filter(day => days2.includes(day));
    if (commonDays.length === 0) return false;
    
    // Check for time overlap on common days
    const start1 = timeToMinutes(item1.startTime);
    const end1 = timeToMinutes(item1.endTime);
    const start2 = timeToMinutes(item2.startTime);
    const end2 = timeToMinutes(item2.endTime);
    
    return (start1 < end2 && start2 < end1);
  };

  // Helper function to convert time to minutes (updated for 12-hour format)
  const timeToMinutes = (timeStr) => {
    // Handle 12-hour format with AM/PM
    const timePattern = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = timeStr.match(timePattern);
    
    if (!match) {
      console.error('Invalid time format:', timeStr);
      return 0;
    }
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    
    // Convert to 24-hour format for calculations
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
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