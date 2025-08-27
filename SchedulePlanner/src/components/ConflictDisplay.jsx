import React from 'react';
import './ConflictDisplay.css';

const ConflictDisplay = ({ conflicts, potentialConflicts, onClearConflicts, onClearPotentialConflicts }) => {
  if (!conflicts || conflicts.length === 0) {
    return null;
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'High':
        return '🔴';
      case 'Medium':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'High':
        return 'high-priority';
      case 'Medium':
        return 'medium-priority';
      default:
        return 'low-priority';
    }
  };

  return (
    <div className="conflict-display">
      {/* Main Conflicts */}
      {conflicts.length > 0 && (
        <div className="conflicts-section">
          <div className="conflicts-header">
            <h3 className="conflicts-title">
              ⚠️ Schedule Conflicts Detected
            </h3>
            <button 
              className="clear-conflicts-btn"
              onClick={onClearConflicts}
              title="Clear conflicts"
            >
              ×
            </button>
          </div>
          
          <div className="conflicts-list">
            {conflicts.map((conflict, index) => (
              <div key={index} className={`conflict-item ${getSeverityClass(conflict.severity)}`}>
                <div className="conflict-header">
                  <span className="severity-icon">
                    {getSeverityIcon(conflict.severity)}
                  </span>
                  <span className="conflict-type">{conflict.conflictType}</span>
                  <span className="severity-badge">{conflict.severity} Priority</span>
                </div>
                
                <div className="conflict-details">
                  <div className="conflict-info">
                    <strong>{conflict.name || conflict.title}</strong>
                    <span className="conflict-time">
                      {conflict.conflictDetails.days} • {conflict.conflictDetails.time}
                    </span>
                    <span className="conflict-location">
                      📍 {conflict.conflictDetails.location}
                    </span>
                  </div>
                  
                  <div className="conflict-overlap">
                    <span className="overlap-label">Overlap:</span>
                    <span className="overlap-time">{conflict.conflictDetails.overlap}</span>
                  </div>
                </div>
                
                {conflict.suggestions && conflict.suggestions.length > 0 && (
                  <div className="conflict-suggestions">
                    <strong>Suggestions:</strong>
                    <ul>
                      {conflict.suggestions.map((suggestion, suggestionIndex) => (
                        <li key={suggestionIndex}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="conflict-summary">
            <p>
              <strong>{conflicts.length}</strong> conflict{conflicts.length !== 1 ? 's' : ''} found. 
              Please resolve these conflicts before adding the item to your schedule.
            </p>
          </div>
        </div>
      )}

      {/* Potential Conflicts (Warnings) */}
      {potentialConflicts && potentialConflicts.length > 0 && (
        <div className="potential-conflicts-section">
          <div className="potential-conflicts-header">
            <h4 className="potential-conflicts-title">
              💡 Scheduling Warnings
            </h4>
            <button 
              className="clear-warnings-btn"
              onClick={onClearPotentialConflicts}
              title="Clear warnings"
            >
              ×
            </button>
          </div>
          
          <div className="potential-conflicts-list">
            {potentialConflicts.map((warning, index) => (
              <div key={index} className="potential-conflict-item">
                <div className="warning-icon">💡</div>
                <div className="warning-content">
                  <div className="warning-message">{warning.message}</div>
                  <div className="warning-details">
                    <strong>{warning.name || warning.title}</strong>
                    <span className="warning-time">
                      {warning.itemType === 'course' ? warning.days?.join(', ') : warning.day} • {warning.startTime} - {warning.endTime}
                    </span>
                    {warning.gapMinutes && (
                      <span className="gap-info">
                        Gap: {warning.gapMinutes} minutes
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="warning-summary">
            <p>
              These are suggestions to improve your schedule timing. Items can still be added.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConflictDisplay; 