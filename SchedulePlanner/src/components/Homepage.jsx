import React from 'react';
import './Homepage.css';

const Homepage = ({ onNavigate }) => {
  const handleNavigateToTab = (tabName) => {
    if (onNavigate) {
      onNavigate(tabName);
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
          <div className="feature-card clickable" onClick={() => handleNavigateToTab('schedule')}>
            <div className="feature-icon">📅</div>
            <h3>View Schedule</h3>
            <p>View your day</p>
          </div>
          <div className="feature-card clickable" onClick={() => handleNavigateToTab('timeblocks')}>
            <div className="feature-icon">⏰</div>
            <h3>Time Blocks</h3>
            <p>Manage your non-class activities: clubs, jobs, breaks, and personal time</p>
          </div>
          <div className="feature-card clickable" onClick={() => handleNavigateToTab('courses')}>
            <div className="feature-icon">📚</div>
            <h3>Courses</h3>
            <p>Select and manage your course schedule</p>
          </div>

        </div>
      </div>

      <div className="getting-started-section">
        <h2>Getting Started</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <p>Click "View Schedule" to see your daily timeline</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <p>Add your classes and courses through the Courses tab</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <p>Manage your non-class activities through the Time Blocks tab</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage; 
