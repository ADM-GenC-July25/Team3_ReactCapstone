import React from 'react';
import './Logo.css';

const Logo = ({ variant = 'default', size = 'normal' }) => {
  return (
    <div className={`logo-container ${variant} ${size}`}>
      <div className="logo-icon">
        <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
            <linearGradient id="logoGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8a9eff" />
              <stop offset="100%" stopColor="#9d6cc7" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Calendar base */}
          <rect x="15" y="25" width="70" height="60" rx="8" ry="8" 
                fill="url(#logoGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          
          {/* Calendar header */}
          <rect x="15" y="25" width="70" height="18" rx="8" ry="8" 
                fill="rgba(255,255,255,0.2)"/>
          <rect x="15" y="35" width="70" height="8" 
                fill="rgba(255,255,255,0.1)"/>
          
          {/* Calendar rings */}
          <circle cx="30" cy="20" r="3" fill="rgba(255,255,255,0.8)" stroke="url(#logoGradient)" strokeWidth="2"/>
          <circle cx="50" cy="20" r="3" fill="rgba(255,255,255,0.8)" stroke="url(#logoGradient)" strokeWidth="2"/>
          <circle cx="70" cy="20" r="3" fill="rgba(255,255,255,0.8)" stroke="url(#logoGradient)" strokeWidth="2"/>
          
          {/* Calendar grid dots */}
          <circle cx="25" cy="55" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="35" cy="55" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="45" cy="55" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="55" cy="55" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="65" cy="55" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="75" cy="55" r="2" fill="rgba(255,255,255,0.6)"/>
          
          <circle cx="25" cy="65" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="35" cy="65" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="45" cy="65" r="2" fill="rgba(255,255,255,0.8)"/>
          <circle cx="55" cy="65" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="65" cy="65" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="75" cy="65" r="2" fill="rgba(255,255,255,0.6)"/>
          
          <circle cx="25" cy="75" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="35" cy="75" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="45" cy="75" r="2" fill="rgba(255,255,255,0.6)"/>
          <circle cx="55" cy="75" r="2" fill="rgba(255,255,255,0.6)"/>
          
          {/* Highlight today */}
          <circle cx="45" cy="65" r="6" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"/>
          
          {/* Clock overlay for planning concept */}
          <circle cx="75" cy="35" r="12" fill="rgba(255,255,255,0.95)" stroke="url(#logoGradient)" strokeWidth="2"/>
          <line x1="75" y1="35" x2="75" y2="28" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="75" y1="35" x2="80" y2="35" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="75" cy="35" r="1.5" fill="url(#logoGradient)"/>
        </svg>
      </div>
      <div className="logo-text">
        <h1 className="logo-title">Schedule Planner</h1>
      </div>
    </div>
  );
};

export default Logo; 
