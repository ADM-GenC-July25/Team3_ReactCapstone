import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthStatus.css';

const AuthStatus = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="auth-status">
      <div className="user-profile">
        <div className="user-avatar">
          {auth.user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="user-details">
          <div className="user-name">
            {auth.user?.name || auth.user?.email || 'User'}
          </div>
          <div className="user-email">
            {auth.user?.email}
          </div>
        </div>
      </div>
      
      <div className="auth-actions">
        <button 
          className="profile-btn"
          onClick={() => console.log('Profile clicked')}
          title="View Profile"
        >
          👤
        </button>
        <button 
          className="signout-btn"
          onClick={() => auth.signOut()}
          title="Sign Out"
        >
          🚪
        </button>
      </div>
    </div>
  );
};

export default AuthStatus; 