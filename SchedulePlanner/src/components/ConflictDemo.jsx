import React, { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import './ConflictDemo.css';

const ConflictDemo = () => {
  const { addCourse, conflicts, potentialConflicts, clearConflicts, clearPotentialConflicts } = useSchedule();
  const [newCourse, setNewCourse] = useState({
    name: '',
    startTime: '9:00 AM', // Conflicts with CS 101
    endTime: '10:30 AM',
    days: [],
    room: '',
    instructor: '',
    color: '#FF5722'
  });

  const handleAddCourse = () => {
    if (!newCourse.name.trim()) {
      alert('Please enter a course name');
      return;
    }

    const result = addCourse(newCourse);
    
    if (result.success) {
      alert('Course added successfully!');
      // Reset form
      setNewCourse({
        name: '',
        subject: 'CS',
        course: '101',
        section: '001',
        startTime: '09:00',
        endTime: '10:30',
        days: ['Monday'],
        room: 'Room 201',
        instructor: 'Dr. Smith',
        courseDescription: 'Test Course',
        color: '#4CAF50'
      });
    } else {
      alert(`Course cannot be added due to conflicts. Check the conflict display above.`);
    }
  };

  const handleDayChange = (day, checked) => {
    if (checked) {
      setNewCourse(prev => ({
        ...prev,
        days: [...prev.days, day]
      }));
    } else {
      setNewCourse(prev => ({
        ...prev,
        days: prev.days.filter(d => d !== day)
      }));
    }
  };

  return (
    <div className="conflict-demo">
      <h3>Test Conflict Management</h3>
      <p>Try adding a course that conflicts with existing ones to see the conflict detection in action.</p>
      
      <div className="demo-form">
        <div className="form-group">
          <label>Course Name:</label>
          <input
            type="text"
            value={newCourse.name}
            onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter course name"
          />
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <select
            value={newCourse.subject}
            onChange={(e) => setNewCourse(prev => ({ ...prev, subject: e.target.value }))}
          >
            <option value="CS">CS</option>
            <option value="MATH">MATH</option>
            <option value="PHYS">PHYS</option>
            <option value="ENG">ENG</option>
          </select>
        </div>

        <div className="form-group">
          <label>Course Number:</label>
          <input
            type="text"
            value={newCourse.course}
            onChange={(e) => setNewCourse(prev => ({ ...prev, course: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>Section:</label>
          <input
            type="text"
            value={newCourse.section}
            onChange={(e) => setNewCourse(prev => ({ ...prev, section: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>Start Time:</label>
          <select
            value={newCourse.startTime}
            onChange={(e) => setNewCourse(prev => ({ ...prev, startTime: e.target.value }))}
          >
            <option value="8:00 AM">8:00 AM</option>
            <option value="8:30 AM">8:30 AM</option>
            <option value="9:00 AM">9:00 AM</option>
            <option value="9:30 AM">9:30 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="10:30 AM">10:30 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="11:30 AM">11:30 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="12:30 PM">12:30 PM</option>
            <option value="1:00 PM">1:00 PM</option>
            <option value="1:30 PM">1:30 PM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="2:30 PM">2:30 PM</option>
            <option value="3:00 PM">3:00 PM</option>
            <option value="3:30 PM">3:30 PM</option>
            <option value="4:00 PM">4:00 PM</option>
            <option value="4:30 PM">4:30 PM</option>
            <option value="5:00 PM">5:00 PM</option>
            <option value="5:30 PM">5:30 PM</option>
            <option value="6:00 PM">6:00 PM</option>
            <option value="6:30 PM">6:30 PM</option>
            <option value="7:00 PM">7:00 PM</option>
            <option value="7:30 PM">7:30 PM</option>
          </select>
        </div>

        <div className="form-group">
          <label>End Time:</label>
          <select
            value={newCourse.endTime}
            onChange={(e) => setNewCourse(prev => ({ ...prev, endTime: e.target.value }))}
          >
            <option value="8:30 AM">8:30 AM</option>
            <option value="9:00 AM">9:00 AM</option>
            <option value="9:30 AM">9:30 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="10:30 AM">10:30 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="11:30 AM">11:30 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="12:30 PM">12:30 PM</option>
            <option value="1:00 PM">1:00 PM</option>
            <option value="1:30 PM">1:30 PM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="2:30 PM">2:30 PM</option>
            <option value="3:00 PM">3:00 PM</option>
            <option value="3:30 PM">3:30 PM</option>
            <option value="4:00 PM">4:00 PM</option>
            <option value="4:30 PM">4:30 PM</option>
            <option value="5:00 PM">5:00 PM</option>
            <option value="5:30 PM">5:30 PM</option>
            <option value="6:00 PM">6:00 PM</option>
            <option value="6:30 PM">6:30 PM</option>
            <option value="7:00 PM">7:00 PM</option>
            <option value="7:30 PM">7:30 PM</option>
            <option value="8:00 PM">8:00 PM</option>
          </select>
        </div>

        <div className="form-group">
          <label>Days:</label>
          <div className="days-checkboxes">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <label key={day} className="day-checkbox">
                <input
                  type="checkbox"
                  checked={newCourse.days.includes(day)}
                  onChange={(e) => handleDayChange(day, e.target.checked)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Room:</label>
          <input
            type="text"
            value={newCourse.room}
            onChange={(e) => setNewCourse(prev => ({ ...prev, room: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>Instructor:</label>
          <input
            type="text"
            value={newCourse.instructor}
            onChange={(e) => setNewCourse(prev => ({ ...prev, instructor: e.target.value }))}
          />
        </div>

        <button className="add-course-btn" onClick={handleAddCourse}>
          Add Course
        </button>
      </div>

      <div className="demo-tips">
        <h4>💡 Try these scenarios to test conflicts:</h4>
        <ul>
          <li><strong>Monday 9:00-10:30:</strong> Conflicts with CS 101, MATH 205, and English Literature</li>
          <li><strong>Monday 10:00-11:00:</strong> Conflicts with CS 101, MATH 205, and English Literature</li>
          <li><strong>Friday 15:30-17:00:</strong> Conflicts with Physics Lab and Chemistry 101</li>
          <li><strong>Wednesday 14:00-16:00:</strong> Conflicts with Part-time Job</li>
          <li><strong>Close Timing:</strong> Try 10:30-11:00 on Monday (very close to existing courses)</li>
        </ul>
        
        <h4>🎯 Current Schedule Conflicts:</h4>
        <ul>
          <li><strong>Monday/Wednesday:</strong> CS 101 (9:00-10:30), MATH 205 (9:30-10:45), English Literature (10:00-11:15)</li>
          <li><strong>Friday:</strong> Physics Lab (14:00-16:00), Chemistry 101 (15:30-17:00)</li>
          <li><strong>Monday:</strong> Study Group (10:00-11:00) conflicts with multiple courses</li>
        </ul>
      </div>
    </div>
  );
};

export default ConflictDemo; 