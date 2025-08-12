import React, { useState } from 'react';
import './Homepage.css';
import DailyScheduling from './DailyScheduling';
import CourseList from './CourseList';
import CourseSelection from './CourseSelection';

const Homepage = () => {
  const [currentView, setCurrentView] = useState('home');

  const handleDailySchedulingClick = () => {
    setCurrentView('dailyScheduling');
  };

  const handleCourseSelectionClick = () => {
    setCurrentView('courseSelection');  
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'dailyScheduling') {
    return <DailyScheduling onBack={handleBackToHome} />;
  }

   if (currentView === 'courseSelection') {
    return <CourseSelection />;
  }

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
          <div className="feature-card clickable" onClick={handleDailySchedulingClick}>
            <div className="feature-icon">📅</div>
            <h3>View Schedule</h3>
            <p>View your day</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Color Coding</h3>
            <p>Organize classes and events with customizable color schemes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Room & Instructor Info</h3>
            <p>Keep track of locations and instructors for each scheduled item</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Generate Schedule</h3>
            <p>Plan your day with 15-minute interval precision from 6 AM to 10 PM</p>
          </div>
          <div className="feature-card clickable" onClick={handleCourseSelectionClick}>
            <div className="feature-icon">📚</div>
            <h3>Course List</h3>
            <p>Add, delete and view your courses</p>
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
            <p>Add your classes, meetings, and appointments</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <p>Customize colors and details for better organization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage; 
