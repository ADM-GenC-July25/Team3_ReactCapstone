import React, { useState } from 'react';
import './DailyScheduling.css';

const DailyScheduling = ({ onBack }) => {
  const [currentWeek, setCurrentWeek] = useState(2);
  const totalWeeks = 15;

  // State for custom colors - maps class ID to color
  const [customColors, setCustomColors] = useState({
    1: '#4CAF50', // Java - default green
    2: '#FF9800', // Hackerrank - default orange
    3: '#2196F3'  // Emerging Talent Bootcamp - default blue
  });

  // Predefined color palette for easy selection
  const colorPalette = [
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#F44336', // Red
    '#FF5722', // Deep Orange
    '#795548', // Brown
    '#607D8B', // Blue Grey
    '#E91E63', // Pink
    '#00BCD4', // Cyan
    '#8BC34A', // Light Green
    '#FFC107'  // Amber
  ];

  // Function to update color for a specific class
  const updateClassColor = (classId, newColor) => {
    setCustomColors(prev => ({
      ...prev,
      [classId]: newColor
    }));
  };

  // Color Picker Component
  const ColorPicker = ({ classId, currentColor, onColorChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Close color picker when clicking outside or pressing escape
    React.useEffect(() => {
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      const handleClickOutside = (event) => {
        if (event.target.classList.contains('color-picker-overlay')) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const handleColorSelect = (color) => {
      onColorChange(classId, color);
      setIsOpen(false);
    };

    const handleCustomColorChange = (e) => {
      onColorChange(classId, e.target.value);
    };

    const getSubjectName = () => {
      const classItem = classes.find(cls => cls.id === classId);
      return classItem ? classItem.subject : 'Class';
    };

    return (
      <>
        <div className="color-picker-container">
          <div 
            className="color-preview"
            style={{ backgroundColor: currentColor }}
            onClick={() => setIsOpen(true)}
            title="Click to change color"
          />
        </div>
        
        {isOpen && (
          <div className="color-picker-overlay">
            <div className="color-picker-modal">
              <div className="color-picker-header">
                <h3 className="color-picker-title">Choose Color for {getSubjectName()}</h3>
                <button 
                  className="color-picker-close"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                >
                  ×
                </button>
              </div>
              
              <label className="color-picker-label">Select from palette:</label>
              <div className="color-palette">
                {colorPalette.map(color => (
                  <div
                    key={color}
                    className={`color-option ${currentColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                  />
                ))}
              </div>
              
              <div className="custom-color-section">
                <label className="color-picker-label">Or choose custom color:</label>
                <input
                  type="color"
                  value={currentColor}
                  onChange={handleCustomColorChange}
                  className="custom-color-input"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Example class data based on the image
  const classes = [
    {
      id: 1,
      status: 'Enrolled',
      class: '10000',
      subject: 'Java',
      course: '201',
      section: '003',
      seatsOpen: 16,
      waitlistSeats: 0,
      waitlistOpen: 10,
      schedule: 'M W => 17:30am - 21:00pm => 12 weeks',
      location: 'Microsoft Teams'
    },
    {
      id: 2,
      status: 'Enrolled',
      class: '20000',
      subject: 'Hackerrank',
      course: '202',
      section: '206',
      seatsOpen: 15,
      waitlistSeats: 0,
      waitlistOpen: 15,
      schedule: 'T => 7:00pm - 9:45pm => 15 weeks',
      location: 'Microsoft Teams'
    },
    {
      id: 3,
      status: 'Not Enrolled',
      class: '30000',
      subject: 'Emerging Talent Bootcamp',
      course: '203',
      section: '005',
      seatsOpen: 14,
      waitlistSeats: 0,
      waitlistOpen: 20,
      schedule: 'T Th => 1:00pm - 3:15pm => 10 weeks',
      location: 'Microsoft Teams'
    }
  ];

  // Calendar data based on the image
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:15', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '21:45', '22:00'
  ];

  // Example schedule events
  const scheduleEvents = [
    {
      day: ['Monday', 'Wednesday'],
      startTime: '17:30',
      endTime: '21:00',
      subject: 'Java',
      instructor: 'Taryn Ernd',
      location: 'Microsoft Teams',
      classId: 1,
      weeks: 12
    },
    {
      day: 'Tuesday',
      startTime: '19:00',
      endTime: '21:45',
      subject: 'Hackerrank',
      instructor: 'Antoinette Saade',
      location: 'Microsoft Teams',
      classId: 2,
      weeks: 15
    },
    {
      day: ['Tuesday', 'Thursday'],
      startTime: '08:00',
      endTime: '11:15',
      subject: 'Emerging Talent Bootcamp',
      instructor: 'Akshat Sharma',
      location: 'Microsoft Teams',
      classId: 3,
      weeks: 10
    }
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
    // Handle both single day (string) and multiple days (array)
    const days = Array.isArray(event.day) ? event.day : [event.day];
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
      backgroundColor: customColors[event.classId] || '#E0E0E0' // Use custom color or a default
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

    // Handle both single day (string) and multiple days (array)
    const days = Array.isArray(event.day) ? event.day : [event.day];
    
    return days.map((day, dayIndex) => {
      const position = getEventPosition(event, day);
      if (!position) return null;
      
      return (
        <div
          key={`${index}-${dayIndex}`}
          className="schedule-event"
          style={position}
        >
          <div className="event-title">{event.subject}</div>
          <div className="event-instructor">{event.instructor}</div>
          <div className="event-location">{event.location}</div>
        </div>
      );
    }).filter(Boolean); // Remove null entries
  };

  return (
    <div className="daily-scheduling-container">
      {/* <div className="header-section">
      </div> */}

      <div className="alert-section">
        <div className="alert">
          You are viewing a potential schedule only and you must still register.
        </div>
      </div>

      <h2>Potential Schedule</h2>

      {/* Class Table */}
      <div className="class-table-section">
        <table className="class-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Course</th>
              <th>Section</th>
              <th>Seats Open</th>
              <th>Waitlist Seats</th>
              <th>Waitlist Open</th>
              <th>Schedule & Location</th>
              <th>Color</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls.id}>
                <td>
                  <span className={`status ${cls.status.toLowerCase().replace(' ', '-')}`}>
                    {cls.status === 'Enrolled' ? '●' : '○'} {cls.status}
                  </span>
                </td>
                <td>
                  <span className='table-data'>{cls.class}</span>
                </td>
                <td>
                  <span className='table-data'>{cls.subject}</span>
                </td>
                <td>
                  <span className='table-data'>{cls.course}</span>
                </td>
                <td>
                  <span className='table-data'>{cls.section}</span>
                </td>
                <td>
                  <span className='table-data'>{cls.seatsOpen}</span>
                </td>
                <td>
                  <span className='table-data'>{cls.waitlistSeats}</span>
                </td>
                <td>
                  <span className='table-data'>{cls.waitlistOpen}</span>
                </td>
                <td>
                  <span className='table-data'>{cls.schedule}</span><br/>
                  <span className='table-data'>{cls.location}</span>
                </td>
                <td>
                  <ColorPicker
                    classId={cls.id}
                    currentColor={customColors[cls.id]}
                    onColorChange={updateClassColor}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default DailyScheduling; 