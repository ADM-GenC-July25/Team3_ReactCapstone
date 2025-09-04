import React, { useState } from 'react';
import './DailyScheduling.css';
import SampleCourses from './SampleCourses';

const DailyScheduling = ({ onBack }) => {
  const [currentWeek, setCurrentWeek] = useState(2);
  const totalWeeks = 15;

  // Transform SampleCourses data into classes array format
  const classes = SampleCourses.map(course => ({
    id: course.id,
    status: course.isSelected ? 'Enrolled' : 'Not Enrolled',
    class: (course.id).toString(), // Generate class number based on ID
    subject: course.name,
    course: (200 + course.id).toString(), // Generate course number
    section: String(course.id).padStart(3, '0'), // Generate section number
    seatsOpen: Math.floor(Math.random() * 20) + 10, // Random seats open (10-29)
    waitlistSeats: 0,
    waitlistOpen: Math.floor(Math.random() * 25) + 10, // Random waitlist open (10-34)
    schedule: `${Array.isArray(course.day) ? course.day.join(' ') : course.day} => ${course.startTime} - ${course.endTime} => ${course.weeks} weeks`,
    location: course.location
  }));

  // Transform SampleCourses data into scheduleEvents array format
  const scheduleEvents = SampleCourses.map(course => ({
    day: course.day,
    startTime: course.startTime,
    endTime: course.endTime,
    subject: course.name,
    instructor: course.instructor,
    location: course.location,
    classId: course.id,
    weeks: course.weeks
  }));

  // Initialize custom colors from SampleCourses data
  const initialCustomColors = {};
  SampleCourses.forEach(course => {
    initialCustomColors[course.id] = course.color;
  });

  // State for custom colors - maps class ID to color
  const [customColors, setCustomColors] = useState(initialCustomColors);

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



  // Calendar data based on the image
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30',
    '11:00', '11:15', '11:30', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30',
    '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30',
    '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45'
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