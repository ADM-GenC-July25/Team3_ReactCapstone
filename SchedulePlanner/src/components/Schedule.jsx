import React, { useState, useEffect, useContext } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import { AuthContext } from '../context/AuthContext';
import ConflictDisplay from './ConflictDisplay';
import './Schedule.css';

const Schedule = () => {
  const { 
    getAllScheduleItems, 
    conflicts, 
    potentialConflicts,
    isLoading,
    error,
    loadScheduleData
  } = useSchedule();

  const { isLoggedIn, userInfo } = useContext(AuthContext);
  const [currentWeek, setCurrentWeek] = useState(2);
  const totalWeeks = 15;

  // Load schedule data when user logs in
  useEffect(() => {
    if (isLoggedIn && userInfo?.email) {
      loadScheduleData(userInfo.email);
    }
  }, [isLoggedIn, userInfo?.email, loadScheduleData]);

  // Get all schedule items (courses + time blocks) from ScheduleContext
  const allScheduleItems = getAllScheduleItems();

  // Transform schedule items into events format for the calendar
  const scheduleEvents = allScheduleItems.map(item => {
    console.log('Processing schedule item for calendar:', item);
    if (item.itemType === 'course') {
      // Handle courses with multiple days
      return item.days.map(day => {
        const event = {
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
        };
        console.log('Created course event:', event);
        return event;
      });
    } else {
      // Handle time blocks (single day)
      const event = {
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
      };
      console.log('Created time block event:', event);
      return [event];
    }
  }).flat().filter(event => event.isSelected);

  console.log('Final schedule events for calendar:', scheduleEvents);

  // Calendar data
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', 
    '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', 
    '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', 
    '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', 
    '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45',
    '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', 
    '22:00', '22:15', '22:30', '22:45'
  ];

  const formatTimeDisplay = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
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
    
    console.log(`Getting position for event on ${targetDay}:`, event);
    
    const dayIndex = weekDays.indexOf(targetDay);
    const startIndex = timeSlots.indexOf(event.startTime);
    const endIndex = timeSlots.indexOf(event.endTime);
    
    console.log(`Day index: ${dayIndex}, Start index: ${startIndex}, End index: ${endIndex}`);
    console.log(`Looking for start time: "${event.startTime}" in timeSlots`);
    console.log(`Looking for end time: "${event.endTime}" in timeSlots`);
    
    if (dayIndex === -1 || startIndex === -1 || endIndex === -1) {
      console.log('Position calculation failed - index not found');
      return null;
    }
    
    const position = {
      gridColumn: dayIndex + 2, // +2 because first column is time labels
      gridRowStart: startIndex + 2, // +2 because first row is headers
      gridRowEnd: endIndex + 2,
      backgroundColor: event.color || '#E0E0E0'
    };
    
    console.log('Calculated position:', position);
    return position;
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
          You are viewing your current schedule. Use the cart to add new courses.
        </div>
      </div>

      <h2>My Schedule</h2>

      {/* Loading state */}
      {isLoading && (
        <div className="loading-container" style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading your schedule...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="error-container" style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="alert alert-danger">
            Error loading schedule: {error}
          </div>
        </div>
      )}

      {/* Schedule content - only show when not loading and no error */}
      {!isLoading && !error && (
        <>
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
        </>
      )}
    </div>
  );
};

export default Schedule; 