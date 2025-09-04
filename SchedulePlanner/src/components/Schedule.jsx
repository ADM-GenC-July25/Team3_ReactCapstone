import React, { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import ConflictDisplay from './ConflictDisplay';
import './Schedule.css';

const Schedule = () => {
  const { 
    getAllScheduleItems, 
    conflicts, 
    potentialConflicts 
  } = useSchedule();

  const [currentWeek, setCurrentWeek] = useState(2);
  const totalWeeks = 15;

  // Get all schedule items (courses + time blocks) from ScheduleContext
  const allScheduleItems = getAllScheduleItems();

  // Transform schedule items into events format for the calendar
  const scheduleEvents = allScheduleItems.map(item => {
    if (item.itemType === 'course') {
      // Handle courses with multiple days
      return item.days.map(day => ({
        day: day,
        startTime: item.startTime,
        endTime: item.endTime,
        subject: item.name,
        instructor: item.instructor,
        location: item.room,
        classId: item.id,
        weeks: item.weeks,
        color: item.color,
        isSelected: item.isSelected
      }));
    } else {
      // Handle time blocks (single day)
      return [{
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
        subject: item.title,
        instructor: item.description,
        location: item.description,
        classId: item.id,
        weeks: item.weeks || 15,
        color: item.color,
        isSelected: true
      }];
    }
  }).flat().filter(event => event.isSelected);

  // Calendar data
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM', '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM', 
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
    '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', 
    '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM',
    '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM', '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM', 
    '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM', '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM',
    '8:00 PM'
  ];

  const formatTimeDisplay = (time12) => {
    // Since times are now stored in 12-hour format, just return as-is
    return time12;
  };

  const getWeekDateRange = (weekNumber) => {
    const startDate = new Date(2025, 8, 1); 
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return `${weekStart.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`;
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

  const getEventPosition = (event, specificDay = null) => {
    const days = [event.day];
    const targetDay = specificDay || days[0];
    
    const dayIndex = weekDays.indexOf(targetDay);
    const startIndex = timeSlots.indexOf(event.startTime);
    const endIndex = timeSlots.indexOf(event.endTime);
    
    if (dayIndex === -1 || startIndex === -1 || endIndex === -1) {
      return null;
    }
    
    return {
      gridColumn: dayIndex + 2, // +2 because first column is time labels
      gridRowStart: startIndex + 2, // +2 because first row is headers
      gridRowEnd: endIndex + 2,
      backgroundColor: event.color || '#E0E0E0'
    };
  };

  const isEventActiveInWeek = (event, weekNumber) => {
    // If weeks property is not specified, default to showing for all weeks
    if (!event.weeks) return true;
    
    // Event is active if current week is within the event's duration
    return weekNumber <= event.weeks;
  };

  const renderEventForAllDays = (event, index) => {
    // Check if event should be shown in current week
    if (!isEventActiveInWeek(event, currentWeek)) {
      return null;
    }

    const position = getEventPosition(event, event.day);
    if (!position) return null;
    
    return (
      <div
        key={`${index}-${event.day}`}
        className="schedule-event"
        style={position}
      >
        <div className="event-title">{event.subject}</div>
        <div className="event-instructor">{event.instructor}</div>
        <div className="event-location">{event.location}</div>
      </div>
    );
  };

  return (
    <div className="daily-scheduling-container">
      {/* Show conflict display if there are any conflicts */}
      {(conflicts.length > 0 || potentialConflicts.length > 0) && (
        <ConflictDisplay />
      )}

      <div className="alert-section">
        <div className="alert">
          You are viewing your current schedule. Use the cart to add new courses and time blocks.
        </div>
      </div>

      <h2>My Schedule</h2>

      {/* Week Selector */}
      {renderWeekSelector()}

      {/* Calendar View */}
      <div className="calendar-section">
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

          {/* Schedule events overlay */}
          <div className="events-overlay">
            {scheduleEvents.map((event, index) => {
              return renderEventForAllDays(event, index);
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule; 