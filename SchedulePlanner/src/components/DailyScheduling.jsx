import React, { useState, useEffect, useMemo } from 'react';
import './DailyScheduling.css';
import { useSchedule } from '../contexts/ScheduleContext';

const DailyScheduling = ({ onBack }) => {
  const [currentWeek, setCurrentWeek] = useState(2);
  const totalWeeks = 15;
  
  // Use centralized data from context
  const { courses, timeBlocks, getAllScheduleItems } = useSchedule();

  // State for custom colors - maps class ID to color
  const [customColors, setCustomColors] = useState(() => {
    const initialColors = {};
    // Initialize colors for courses
    courses.forEach(course => {
      initialColors[course.id] = course.color;
    });
    // Initialize colors for time blocks
    timeBlocks.forEach(block => {
      initialColors[block.id] = block.color;
    });
    return initialColors;
  });

  // Update colors when courses or time blocks change
  useEffect(() => {
    const newColors = {};
    // Update colors for courses
    courses.forEach(course => {
      newColors[course.id] = course.color;
    });
    // Update colors for time blocks
    timeBlocks.forEach(block => {
      newColors[block.id] = block.color;
    });
    setCustomColors(newColors);
  }, [courses, timeBlocks]);

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
      // Check both courses and time blocks
      const courseItem = courses.find(course => course.id === classId);
      const timeBlockItem = timeBlocks.find(block => block.id === classId);
      
      if (courseItem) {
        return courseItem.subject || courseItem.name;
      } else if (timeBlockItem) {
        return timeBlockItem.title;
      }
      return 'Class';
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

  // Use centralized course data from context
  const classes = courses;

  // Calendar data based on the image
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:15', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '21:45', '22:00'
  ];

  // Generate schedule events from centralized data using useMemo
  const scheduleEvents = useMemo(() => {
    console.log('Regenerating schedule events with:', { courses, timeBlocks });
    
    const courseEvents = courses.map(course => ({
      days: course.days,
      startTime: course.startTime,
      endTime: course.endTime,
      subject: course.subject,
      instructor: course.instructor,
      location: course.room,
      classId: course.id,
      weeks: course.weeks,
      color: course.color
    }));
    
    const timeBlockEvents = timeBlocks.map(block => ({
      days: [block.day], // Convert single day to array
      startTime: block.startTime,
      endTime: block.endTime,
      subject: block.title,
      instructor: block.type,
      location: block.description,
      classId: block.id,
      weeks: 15,
      color: block.color
    }));
    
    const allEvents = [...courseEvents, ...timeBlockEvents];
    console.log('Generated events:', allEvents);
    
    return allEvents;
  }, [courses, timeBlocks]);

  // Test data flow after scheduleEvents is defined
  console.log('DailyScheduling - Courses:', courses);
  console.log('DailyScheduling - Time Blocks:', timeBlocks);
  console.log('DailyScheduling - Schedule Events:', scheduleEvents);



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
    // All events should now have a days array
    const days = event.days;
    const targetDay = specificDay || days[0];
    
    const dayIndex = weekDays.indexOf(targetDay);
    const startIndex = timeSlots.indexOf(event.startTime);
    const endIndex = timeSlots.indexOf(event.endTime);
    
    // Debug logging for positioning issues
    if (dayIndex === -1 || startIndex === -1 || endIndex === -1) {
      console.log('Positioning failed for event:', event, {
        targetDay,
        dayIndex,
        startTime: event.startTime,
        startIndex,
        endTime: event.endTime,
        endIndex
      });
      return null;
    }
    
    return {
      gridColumn: dayIndex + 2, // +2 because first column is time labels
      gridRowStart: startIndex + 2, // +2 because first row is headers
      gridRowEnd: endIndex + 2,
      backgroundColor: customColors[event.classId] || event.color || '#E0E0E0' // Use custom color, event color, or default
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

    // All events should now have a days array
    const days = event.days;
    
    // Debug logging for event rendering
    console.log('Rendering event:', event, 'for days:', days);
    
    return days.map((day, dayIndex) => {
      const position = getEventPosition(event, day);
      if (!position) {
        console.log('Position failed for day:', day, 'event:', event);
        return null;
      }
      
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
      
      {/* Debug Info */}
      <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px', borderRadius: '4px', fontSize: '12px' }}>
        <strong>Debug Info:</strong><br/>
        Courses: {courses.length} | Time Blocks: {timeBlocks.length} | Total Events: {scheduleEvents.length}<br/>
        Current Week: {currentWeek} | Week Range: {getWeekDateRange(currentWeek)}<br/>
        <button 
          onClick={() => {
            console.log('Current courses:', courses);
            console.log('Current time blocks:', timeBlocks);
            console.log('Current schedule events:', scheduleEvents);
          }}
          style={{ marginTop: '10px', padding: '5px 10px' }}
        >
          Log Data to Console
        </button>
      </div>

      {/* Schedule Table */}
      <div className="class-table-section">
        <table className="class-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Subject/Category</th>
              <th>Course/Section</th>
              <th>Days</th>
              <th>Time</th>
              <th>Location</th>
              <th>Color</th>
            </tr>
          </thead>
          <tbody>
            {/* Courses */}
            {courses.map(course => (
              <tr key={`course-${course.id}`}>
                <td>
                  <span className={`type-badge course ${course.isSelected ? 'enrolled' : 'not-enrolled'}`}>
                    {course.isSelected ? 'Enrolled' : 'Available'}
                  </span>
                </td>
                <td>
                  <span className='table-data'>{course.name}</span>
                </td>
                <td>
                  <span className='table-data'>{course.subject}</span>
                </td>
                <td>
                  <span className='table-data'>{course.course}-{course.section}</span>
                </td>
                <td>
                  <span className='table-data'>{Array.isArray(course.days) ? course.days.join(', ') : course.days}</span>
                </td>
                <td>
                  <span className='table-data'>{course.startTime} - {course.endTime}</span>
                </td>
                <td>
                  <span className='table-data'>{course.room}</span>
                </td>
                <td>
                  <ColorPicker
                    classId={course.id}
                    currentColor={customColors[course.id]}
                    onColorChange={updateClassColor}
                  />
                </td>
              </tr>
            ))}
            {/* Time Blocks */}
            {timeBlocks.map(block => (
              <tr key={`block-${block.id}`}>
                <td>
                  <span className="type-badge timeblock">{block.type}</span>
                </td>
                <td>
                  <span className='table-data'>{block.title}</span>
                </td>
                <td>
                  <span className='table-data'>{block.type}</span>
                </td>
                <td>
                  <span className='table-data'>-</span>
                </td>
                <td>
                  <span className='table-data'>{block.day}</span>
                </td>
                <td>
                  <span className='table-data'>{block.startTime} - {block.endTime}</span>
                </td>
                <td>
                  <span className='table-data'>{block.description}</span>
                </td>
                <td>
                  <ColorPicker
                    classId={block.id}
                    currentColor={customColors[block.id]}
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
              const renderedEvents = renderEventForAllDays(event, index);
              if (renderedEvents && renderedEvents.length > 0) {
                console.log(`Successfully rendered ${renderedEvents.length} instances of event:`, event);
              } else {
                console.log(`Failed to render event:`, event);
              }
              return renderedEvents;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyScheduling; 