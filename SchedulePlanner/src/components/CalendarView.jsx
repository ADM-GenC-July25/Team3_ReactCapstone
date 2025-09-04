import React, { useContext } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import { AuthContext } from '../context/AuthContext';
import './CalendarView.css';

const CalendarView = () => {
  const {
    calendarView,
    currentDate,
    selectedEvent,
    showEventDetails,
    navigateCalendar,
    goToToday,
    changeCalendarView,
    getCurrentViewEvents,
    selectEvent,
    closeEventDetails,
    getViewTitle,
    formatTimeFor12Hour,
    getTimeSlots,
    getDaysInWeek,
    getWeekStart,
    getEventsForDate,
    isLoading,
    error
  } = useSchedule();

  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return (
      <div className="calendar-view">
        <div className="not-logged-in">
          <h2>Please log in to view your schedule</h2>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="calendar-view">
        <div className="loading">Loading your schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-view">
        <div className="error">Error loading schedule: {error}</div>
      </div>
    );
  }

  const renderCalendarHeader = () => (
    <div className="calendar-header">
      <div className="calendar-navigation">
        <button onClick={() => navigateCalendar('prev')} className="nav-button">
          &#8249;
        </button>
        <h2 className="view-title">{getViewTitle()}</h2>
        <button onClick={() => navigateCalendar('next')} className="nav-button">
          &#8250;
        </button>
      </div>
      
      <div className="calendar-controls">
        <button onClick={goToToday} className="today-button">
          Today
        </button>
        
        <div className="view-switcher">
          <button 
            onClick={() => changeCalendarView('day')}
            className={`view-button ${calendarView === 'day' ? 'active' : ''}`}
          >
            Day
          </button>
          <button 
            onClick={() => changeCalendarView('week')}
            className={`view-button ${calendarView === 'week' ? 'active' : ''}`}
          >
            Week
          </button>
          <button 
            onClick={() => changeCalendarView('month')}
            className={`view-button ${calendarView === 'month' ? 'active' : ''}`}
          >
            Month
          </button>
        </div>
      </div>
    </div>
  );

  const renderDayView = () => {
    const events = getEventsForDate(currentDate);
    const timeSlots = getTimeSlots(6, 22, 60); // Hourly slots from 6 AM to 10 PM
    
    return (
      <div className="day-view">
        <div className="day-header">
          <h3>{currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}</h3>
        </div>
        
        <div className="day-timeline">
          {timeSlots.map(timeSlot => {
            const eventsAtTime = events.filter(event => {
              const eventStart = event.startTime.substring(0, 2);
              const slotHour = timeSlot.substring(0, 2);
              return eventStart === slotHour;
            });
            
            return (
              <div key={timeSlot} className="time-slot">
                <div className="time-label">
                  {formatTimeFor12Hour(timeSlot)}
                </div>
                <div className="time-events">
                  {eventsAtTime.map(event => (
                    <div
                      key={event.id}
                      className="event-block"
                      style={{ backgroundColor: event.color }}
                      onClick={() => selectEvent(event)}
                    >
                      <div className="event-title">{event.title}</div>
                      <div className="event-time">
                        {formatTimeFor12Hour(event.startTime)} - {formatTimeFor12Hour(event.endTime)}
                      </div>
                      {event.location && (
                        <div className="event-location">{event.location}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = getWeekStart(currentDate);
    const weekDays = getDaysInWeek(weekStart);
    const timeSlots = getTimeSlots(6, 22, 60);
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return (
      <div className="week-view">
        <div className="week-header">
          {weekDays.map((day, index) => (
            <div key={index} className="week-day-header">
              <div className="day-name">{dayNames[day.getDay() === 0 ? 6 : day.getDay() - 1]}</div>
              <div className="day-date">{day.getDate()}</div>
            </div>
          ))}
        </div>
        
        <div className="week-grid">
          <div className="time-column">
            {timeSlots.map(timeSlot => (
              <div key={timeSlot} className="time-label">
                {formatTimeFor12Hour(timeSlot)}
              </div>
            ))}
          </div>
          
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDate(day);
            
            return (
              <div key={dayIndex} className="week-day-column">
                {timeSlots.map(timeSlot => {
                  const eventsAtTime = dayEvents.filter(event => {
                    const eventStart = event.startTime.substring(0, 2);
                    const slotHour = timeSlot.substring(0, 2);
                    return eventStart === slotHour;
                  });
                  
                  return (
                    <div key={timeSlot} className="week-time-slot">
                      {eventsAtTime.map(event => (
                        <div
                          key={event.id}
                          className="week-event"
                          style={{ backgroundColor: event.color }}
                          onClick={() => selectEvent(event)}
                        >
                          <div className="event-title">{event.title}</div>
                          <div className="event-time">
                            {formatTimeFor12Hour(event.startTime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    
    const weeks = [];
    const currentWeek = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 42; i++) { // 6 weeks × 7 days
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek.length = 0;
      }
    }
    
    return (
      <div className="month-view">
        <div className="month-header">
          {dayNames.map(dayName => (
            <div key={dayName} className="month-day-header">
              {dayName}
            </div>
          ))}
        </div>
        
        <div className="month-grid">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="month-week">
              {week.map((day, dayIndex) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`month-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}`}
                  >
                    <div className="day-number">{day.getDate()}</div>
                    <div className="day-events">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className="month-event"
                          style={{ backgroundColor: event.color }}
                          onClick={() => selectEvent(event)}
                          title={`${event.title} - ${formatTimeFor12Hour(event.startTime)}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="more-events">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEventDetails = () => {
    if (!selectedEvent) return null;
    
    return (
      <div className="event-details-overlay" onClick={closeEventDetails}>
        <div className="event-details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="event-details-header">
            <h3>{selectedEvent.title}</h3>
            <button className="close-button" onClick={closeEventDetails}>
              ×
            </button>
          </div>
          
          <div className="event-details-content">
            <div className="event-detail-row">
              <strong>Time:</strong>
              <span>
                {formatTimeFor12Hour(selectedEvent.startTime)} - {formatTimeFor12Hour(selectedEvent.endTime)}
              </span>
            </div>
            
            <div className="event-detail-row">
              <strong>Day:</strong>
              <span>{selectedEvent.dayName}</span>
            </div>
            
            {selectedEvent.instructor && (
              <div className="event-detail-row">
                <strong>Instructor:</strong>
                <span>{selectedEvent.instructor}</span>
              </div>
            )}
            
            {selectedEvent.location && (
              <div className="event-detail-row">
                <strong>Location:</strong>
                <span>{selectedEvent.location}</span>
              </div>
            )}
            
            {selectedEvent.description && (
              <div className="event-detail-row">
                <strong>Description:</strong>
                <span>{selectedEvent.description}</span>
              </div>
            )}
            
            <div className="event-detail-row">
              <strong>Type:</strong>
              <span>{selectedEvent.type === 'course' ? 'Course' : 'Time Block'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendarContent = () => {
    switch (calendarView) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      default:
        return renderWeekView();
    }
  };

  return (
    <div className="calendar-view">
      {renderCalendarHeader()}
      <div className="calendar-content">
        {renderCalendarContent()}
      </div>
      {showEventDetails && renderEventDetails()}
    </div>
  );
};

export default CalendarView;
