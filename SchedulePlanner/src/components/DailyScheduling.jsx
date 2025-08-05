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
    '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00'
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
      startTime: '8:00',
      endTime: '11:15',
      subject: 'OPRE 6301 002',
      instructor: 'Sonia F Leach',
      location: 'JSOM 2.118',
      color: '#2196F3'
    }
  ];

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
    
    if (dayIndex === -1 || startIndex === -1 || endIndex === -1) return null;
    
    return {
      gridColumn: dayIndex + 2, // +2 because first column is time labels
      gridRowStart: startIndex + 2, // +2 because first row is headers
      gridRowEnd: endIndex + 2,
      backgroundColor: event.color
    };
  };

  return (
    <div className="daily-scheduling-container">
      <div className="header-section">
        <button className="back-button" onClick={onBack}>← Back</button>
      </div>

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
                  <span className="data_in_table">{cls.class}</span>
                </td>
                <td>
                  <span className="data_in_table">{cls.subject}</span>
                </td>
                <td>
                  <span className="data_in_table">{cls.course}</span>
                </td>
                <td>
                  <span className="data_in_table">{cls.section}</span>
                </td>
                <td>
                  <span className="data_in_table">{cls.seatsOpen}</span>
                </td>
                <td>
                  <span className="data_in_table">{cls.waitlistSeats}</span>
                </td>
                <td>
                  <span className="data_in_table">{cls.waitlistOpen}</span>
                </td>
                <td>
                  <span className="data_in_table">{cls.schedule}</span><br/>
                  <span className="data_in_table">{cls.location}</span>
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
              <div className="time-label">{time}</div>
              {weekDays.map(day => (
                <div key={`${day}-${time}`} className="time-slot"></div>
              ))}
            </React.Fragment>
          ))}

          {/* Schedule events */}
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
  );
};

export default DailyScheduling; 