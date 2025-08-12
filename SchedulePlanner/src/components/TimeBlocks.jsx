import React, { useState } from 'react';
import './TimeBlocks.css';
import { useSchedule } from '../contexts/ScheduleContext';

const TimeBlocks = () => {
  const [currentWeek, setCurrentWeek] = useState(2);
  const totalWeeks = 15;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTimeBlock, setNewTimeBlock] = useState({
    title: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    type: 'club',
    description: ''
  });

  // Use centralized data from context
  const { timeBlocks, addTimeBlock, removeTimeBlock, conflicts, clearConflicts } = useSchedule();

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:15', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '21:45', '22:00'
  ];

  const typeColors = {
    club: '#9C27B0',
    job: '#FF5722',
    break: '#4CAF50',
    personal: '#FF9800',
    other: '#607D8B'
  };

  const formatTimeDisplay = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getWeekDateRange = (weekNumber) => {
    const startDate = new Date(2025, 8, 1); // September 1, 2025
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return `${weekStart.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`;
  };

  const getEventPosition = (event) => {
    const dayIndex = weekDays.indexOf(event.day);
    const startIndex = timeSlots.indexOf(event.startTime);
    const endIndex = timeSlots.indexOf(event.endTime);
    
    if (dayIndex === -1 || startIndex === -1 || endIndex === -1) {
      return null;
    }
    
    return {
      gridColumn: dayIndex + 2, // +2 because first column is time labels
      gridRowStart: startIndex + 2, // +2 because first row is headers
      gridRowEnd: endIndex + 2,
      backgroundColor: event.color
    };
  };

  const handleAddTimeBlock = () => {
    const color = typeColors[newTimeBlock.type] || typeColors.other;
    const timeBlockWithColor = {
      ...newTimeBlock,
      color
    };
    
    const result = addTimeBlock(timeBlockWithColor);
    
    if (result.success) {
      setNewTimeBlock({
        title: '',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        type: 'club',
        description: ''
      });
      setShowAddForm(false);
    }
    // If there are conflicts, they will be displayed in the UI
  };

  const handleDeleteTimeBlock = (id) => {
    removeTimeBlock(id);
  };

  const renderWeekSelector = () => {
    const weekNumbers = [];
    for (let i = 1; i <= totalWeeks; i++) {
      weekNumbers.push(i);
    }

    return (
      <div className="week-selector">
        <button 
          className="nav-button"
          onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
          disabled={currentWeek === 1}
        >
          ◀
        </button>
        
        <div className="week-info">
          <h3>Week {currentWeek} ({getWeekDateRange(currentWeek)})</h3>
        </div>

        <button 
          className="nav-button"
          onClick={() => setCurrentWeek(Math.min(totalWeeks, currentWeek + 1))}
          disabled={currentWeek === totalWeeks}
        >
          ▶
        </button>

        <div className="week-numbers">
          {weekNumbers.map(week => (
            <button
              key={week}
              className={`week-number ${week === currentWeek ? 'active' : ''}`}
              onClick={() => setCurrentWeek(week)}
            >
              {week}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="timeblocks-container">
      <div className="timeblocks-header">
        <h1>Time Blocks</h1>
        <p>Manage your non-class activities: clubs, jobs, breaks, and personal time</p>
      </div>

      <div className="controls-section">
        <button 
          className="add-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Time Block'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          <h3>Add New Time Block</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={newTimeBlock.title}
                onChange={(e) => setNewTimeBlock({...newTimeBlock, title: e.target.value})}
                placeholder="e.g., Chess Club, Part-time Job"
              />
            </div>
            
            <div className="form-group">
              <label>Type:</label>
              <select
                value={newTimeBlock.type}
                onChange={(e) => setNewTimeBlock({...newTimeBlock, type: e.target.value})}
              >
                <option value="club">Club/Organization</option>
                <option value="job">Part-time Job</option>
                <option value="break">Break/Rest</option>
                <option value="personal">Personal Activity</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Day:</label>
              <select
                value={newTimeBlock.day}
                onChange={(e) => setNewTimeBlock({...newTimeBlock, day: e.target.value})}
              >
                {weekDays.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Start Time:</label>
              <select
                value={newTimeBlock.startTime}
                onChange={(e) => setNewTimeBlock({...newTimeBlock, startTime: e.target.value})}
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{formatTimeDisplay(time)}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>End Time:</label>
              <select
                value={newTimeBlock.endTime}
                onChange={(e) => setNewTimeBlock({...newTimeBlock, endTime: e.target.value})}
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{formatTimeDisplay(time)}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Description (optional):</label>
              <input
                type="text"
                value={newTimeBlock.description}
                onChange={(e) => setNewTimeBlock({...newTimeBlock, description: e.target.value})}
                placeholder="Brief description of the activity"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              className="save-button"
              onClick={handleAddTimeBlock}
              disabled={!newTimeBlock.title.trim()}
            >
              Add Time Block
            </button>
          </div>
        </div>
      )}

      {/* Conflict Display */}
      {conflicts.length > 0 && (
        <div className="conflict-alert">
          <h3>⚠️ Scheduling Conflict Detected!</h3>
          <p>The following items conflict with your new time block:</p>
          <div className="conflict-list">
            {conflicts.map((conflict, index) => (
              <div key={index} className="conflict-item">
                <strong>{conflict.name || conflict.title}</strong>
                <span>{conflict.day || (Array.isArray(conflict.days) ? conflict.days.join(', ') : conflict.days)}</span>
                <span>{conflict.startTime} - {conflict.endTime}</span>
              </div>
            ))}
          </div>
          <button 
            className="clear-conflicts-button"
            onClick={clearConflicts}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Time Blocks List */}
      <div className="timeblocks-list">
        <h3>Your Time Blocks</h3>
        {timeBlocks.length === 0 ? (
          <p className="no-blocks">No time blocks added yet. Click "Add Time Block" to get started!</p>
        ) : (
          <div className="blocks-grid">
            {timeBlocks.map(block => (
              <div key={block.id} className="timeblock-card" style={{borderLeftColor: block.color}}>
                <div className="block-header">
                  <h4>{block.title}</h4>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteTimeBlock(block.id)}
                    title="Delete time block"
                  >
                    ×
                  </button>
                </div>
                <div className="block-details">
                  <div className="block-type">{block.type.charAt(0).toUpperCase() + block.type.slice(1)}</div>
                  <div className="block-schedule">
                    {block.day} • {formatTimeDisplay(block.startTime)} - {formatTimeDisplay(block.endTime)}
                  </div>
                  {block.description && (
                    <div className="block-description">{block.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Week Selector */}
      {renderWeekSelector()}

      {/* Calendar View */}
      <div className="calendar-section">
        <h3>Weekly View</h3>
        <div className="calendar-container">
          <div className="calendar-grid">
            {/* Header row */}
            <div className="calendar-header time-header"></div>
            {weekDays.map(day => (
              <div key={day} className="calendar-header day-header">
                <div className="day-name">{day}</div>
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((time, index) => (
              <React.Fragment key={time}>
                <div className="time-label">{formatTimeDisplay(time)}</div>
                {weekDays.map(day => (
                  <div key={`${day}-${time}`} className="time-slot"></div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Time blocks overlay */}
          <div className="events-overlay">
            {timeBlocks.map((block, index) => {
              const position = getEventPosition(block);
              if (!position) return null;
              
              return (
                <div
                  key={index}
                  className="schedule-event timeblock-event"
                  style={position}
                  title={`${block.title}\n${block.description}`}
                >
                  <div className="event-title">{block.title}</div>
                  <div className="event-type">{block.type}</div>
                  {block.description && (
                    <div className="event-description">{block.description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="timeblocks-legend">
        <h3>Activity Types</h3>
        <div className="legend-items">
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: color }}
              ></div>
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeBlocks; 