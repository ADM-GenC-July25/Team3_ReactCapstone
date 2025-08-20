import React, { useState } from 'react';
import './Schedule.css';

// no conflict handling

const Schedule = ({ courseList }) => {
  // Generate time slots from 6 AM to 10 PM in 15-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 6; // 6 AM
    const endHour = 22; // 10 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    console.log(slots);
    return slots;
  };

  const timeSlots = generateTimeSlots();
  
  // Sample class data - this will be replaced with actual class data
  // const [classes, setClasses] = useState([
  //   {
  //     id: 1,
  //     name: "Computer Science 101",
  //     startTime: "09:00",
  //     endTime: "10:30",
  //     room: "Room 201",
  //     instructor: "Dr. Smith",
  //     color: "#4CAF50",
  //     isSelected:true
  //   },
  //   {
  //     id: 2,
  //     name: "Mathematics 205",
  //     startTime: "11:00",
  //     endTime: "12:15",
  //     room: "Room 305",
  //     instructor: "Prof. Johnson",
  //     color: "#2196F3",
  //     isSelected:false
  //   },
  //   {
  //     id: 3,
  //     name: "Physics Lab",
  //     startTime: "14:00",
  //     endTime: "16:00",
  //     room: "Lab 102",
  //     instructor: "Dr. Williams",
  //     color: "#FF9800",
  //     isSelected:false
  //   }
  // ]); //delete after courseList works

  // Helper function to check if a time slot has a class
  const getClassForTimeSlot = (timeSlot) => {
    // return classes.find(cls => {
    //   const slotTime = timeSlot;
    //   const classStart = cls.startTime;
    //   const classEnd = cls.endTime;
    //   const selected = cls.isSelected;
      
    //   // Check if the time slot falls within the class time
    //   return selected && slotTime >= classStart && slotTime < classEnd;
    return courseList.find(cls => {
      const slotTime = timeSlot;
      const classStart = cls.startTime;
      const classEnd = cls.endTime;
      const selected = cls.isSelected;
      
      // Check if the time slot falls within the class time
      return selected && slotTime >= classStart && slotTime < classEnd;
    });
  };

  // Helper function to format time for display
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h1>Daily Schedule</h1>
        <p>15-minute intervals from 6:00 AM to 10:00 PM</p>
      </div>
      
      <div className="schedule-grid">                                 {/*displays classes and stuff*/}
        <div className="time-column">                                 {/*time column*/}
          <div className="time-header">Time</div>
          {timeSlots.map((time, index) => (
            <div key={index} className="time-slot">
              {formatTime(time)}
            </div>
          ))}
        </div>                                                        {/*end of time column*/}
        
        <div className="schedule-column">                                       {/*classes column*/}
          <div className="schedule-header-cell">Schedule</div>
          {timeSlots.map((time, index) => {
            const classItem = getClassForTimeSlot(time);
            const isClassStart = classItem && time === classItem.startTime;
            const isClassEnd = classItem && time === classItem.endTime;
            
            return (
              <div 
                key={index} 
                className={`schedule-slot ${classItem ? 'has-class' : ''} ${isClassStart ? 'class-start' : ''} ${isClassEnd ? 'class-end' : ''}`}
                style={{
                  backgroundColor: classItem ? classItem.color : 'transparent',
                  color: classItem ? 'white' : 'inherit'
                }}
              >
                {isClassStart && classItem && (
                  <div className="class-info">
                    <div className="class-name">{classItem.name}</div>
                    <div className="class-details">
                      {classItem.location} • {classItem.instructor}
                    </div>
                  </div>
                )}
                {!classItem && time.endsWith(':00') && (
                  <div className="hour-marker"></div>
                )}
              </div>
            );
          })}
        </div>                                                                 {/*classes column end*/}
      </div>                                                          {/*end of classes and stuff*/}
      
      <div className="schedule-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          {courseList.map(cls => (
            <div key={cls.id} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: cls.color }}
              ></div>
              <span>{cls.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule; 