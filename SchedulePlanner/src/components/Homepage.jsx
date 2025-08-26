import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Homepage.css';

const Homepage = ({ onNavigateToTab }) => {
  // Get current user info from AuthContext
  const { userInfo, isLoggedIn } = useContext(AuthContext);

  const handleFeatureClick = (tabName) => {
    if (onNavigateToTab) {
      onNavigateToTab(tabName);
    }
  };

  return (
    <div className="homepage-container">
      <div className="hero-section">
        <h1 className="hero-title">Schedule Planner</h1>
        <p className="hero-subtitle">
          Organize your daily schedule with ease and efficiency
        </p>
        <div className="hero-description">
          {isLoggedIn && <h2>Hello {userInfo.first_name} {userInfo.last_name},</h2>}
          <p>
            Welcome to Schedule Planner - your comprehensive solution for managing 
            daily schedules, classes, and appointments. Create, view, and organize 
            your time with our intuitive interface.
          </p>
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card clickable" onClick={() => handleFeatureClick('schedule')}>
            <div className="feature-icon">📅</div>
            <h3>Schedule Management</h3>
            <p>View and manage your daily schedule with ease</p>
          </div>
          <div className="feature-card clickable" onClick={() => handleFeatureClick('courses')}>
            <div className="feature-icon">📚</div>
            <h3>Course Selection</h3>
            <p>Browse and enroll in courses with conflict detection</p>
          </div>
          <div className="feature-card clickable" onClick={() => handleFeatureClick('timeblocks')}>
            <div className="feature-icon">⏰</div>
            <h3>Time Blocks</h3>
            <p>Schedule personal activities and commitments</p>
          </div>
        </div>
      </div>

      <div className="getting-started-section">
        <h2>Getting Started</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <p>Navigate to the Schedule tab to view your daily timeline</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <p>Browse available courses in the Courses tab and add them to your cart</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <p>Use Time Blocks to schedule personal activities and commitments</p>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <p>Review and finalize your schedule with automatic conflict detection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage; 
