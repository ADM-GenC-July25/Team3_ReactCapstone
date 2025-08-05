import React, { useState } from 'react';
import './DailyScheduling.css';

const DailyScheduling = ({ onBack }) => {
  const [currentWeek, setCurrentWeek] = useState(2);
  const totalWeeks = 15;

  // Example class data based on the image
  const classes = [
    {
      id: 1,
      status: 'Enrolled',
      class: '87631',
      subject: 'ACCT',
      course: '6301',
      section: '001',
      seatsOpen: 16,
      waitlistSeats: 0,
      waitlistOpen: 20,
      schedule: 'W 17:30am - 21:00pm',
      location: 'JSOM 2.106'
    },
    {
      id: 2,
      status: 'Enrolled',
      class: '86492',
      subject: 'CS',
      course: '6301',
      section: '501',
      seatsOpen: 15,
      waitlistSeats: 0,
      waitlistOpen: 15,
      schedule: 'T 7:00pm - 9:45pm',
      location: 'JSOM No Meeting'
    },
    {
      id: 3,
      status: 'Not Enrolled',
      class: '87632',
      subject: 'OPRE',
      course: '6301',
      section: '002',
      seatsOpen: 5,
      waitlistSeats: 0,
      waitlistOpen: 20,
      schedule: 'M 1:00pm - 3:15pm',
      location: 'JSOM 2.118'
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
      day: 'Wednesday',
      startTime: '17:30',
      endTime: '21:00',
      subject: 'ACCT 6301 001',
      instructor: 'Nihongo Li',
      location: 'JSOM 2.106',
      color: '#4CAF50'
    },
    {
      day: 'Tuesday',
      startTime: '19:00',
      endTime: '21:45',
      subject: 'CS 6301 501',
      instructor: 'Jeffrey Neal Ricks',
      location: 'JSOM',
      color: '#FF9800'
    },
    {
      day: 'Tuesday',
      startTime: '08:00',
      endTime: '11:15',
      subject: 'OPRE 6301 002',
      instructor: 'Sonia F Leach',
      location: 'JSOM 2.118',
      color: '#2196F3'
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
    const startDate = new Date(2025, 8, 1); // September 1, 2025
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
              const position = getEventPosition(event);
              if (!position) return null;
              
              return (
                <div
                  key={index}
                  className="schedule-event"
                  style={position}
                >
                  <div className="event-title">{event.subject}</div>
                  <div className="event-instructor">{event.instructor}</div>
                  <div className="event-location">{event.location}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyScheduling; 