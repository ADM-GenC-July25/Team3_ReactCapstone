import React, { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';

const ConflictDemo = () => {
  const { courses, timeBlocks, addTimeBlock, conflicts, clearConflicts } = useSchedule();
  const [newTimeBlock, setNewTimeBlock] = useState({
    title: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    type: 'club',
    description: 'Test time block'
  });

  const handleAddTimeBlock = () => {
    const result = addTimeBlock(newTimeBlock);
    if (result.success) {
      setNewTimeBlock({
        title: '',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        type: 'club',
        description: 'Test time block'
      });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Conflict Detection Demo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current Schedule</h3>
        <div style={{ marginBottom: '10px' }}>
          <strong>Courses:</strong>
          {courses.map(course => (
            <div key={course.id} style={{ marginLeft: '20px', color: course.color }}>
              {course.name} - {course.days.join(', ')} {course.startTime}-{course.endTime}
            </div>
          ))}
        </div>
        <div>
          <strong>Time Blocks:</strong>
          {timeBlocks.map(block => (
            <div key={block.id} style={{ marginLeft: '20px', color: block.color }}>
              {block.title} - {block.day} {block.startTime}-{block.endTime}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Add Time Block (Test Conflict Detection)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Title"
            value={newTimeBlock.title}
            onChange={(e) => setNewTimeBlock({...newTimeBlock, title: e.target.value})}
          />
          <select
            value={newTimeBlock.day}
            onChange={(e) => setNewTimeBlock({...newTimeBlock, day: e.target.value})}
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
          <input
            type="time"
            value={newTimeBlock.startTime}
            onChange={(e) => setNewTimeBlock({...newTimeBlock, startTime: e.target.value})}
          />
          <input
            type="time"
            value={newTimeBlock.endTime}
            onChange={(e) => setNewTimeBlock({...newTimeBlock, endTime: e.target.value})}
          />
        </div>
        <button 
          onClick={handleAddTimeBlock}
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add Time Block
        </button>
      </div>

      {conflicts.length > 0 && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#856404', margin: '0 0 10px 0' }}>⚠️ Conflicts Detected!</h3>
          {conflicts.map((conflict, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              <strong>{conflict.name || conflict.title}</strong> - 
              {Array.isArray(conflict.days) ? conflict.days.join(', ') : conflict.day} 
              {conflict.startTime}-{conflict.endTime}
            </div>
          ))}
          <button 
            onClick={clearConflicts}
            style={{ 
              marginTop: '10px', 
              padding: '5px 10px', 
              backgroundColor: '#f39c12', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px' 
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      <div style={{ fontSize: '14px', color: '#666' }}>
        <p><strong>Tip:</strong> Try adding a time block that overlaps with existing courses or time blocks to see conflict detection in action!</p>
        <p><strong>Example conflicts:</strong></p>
        <ul>
          <li>Monday 09:00-10:30 (conflicts with Computer Science 101)</li>
          <li>Wednesday 14:00-16:00 (conflicts with Part-time Job)</li>
          <li>Friday 12:00-13:00 (conflicts with Study Break)</li>
        </ul>
      </div>
    </div>
  );
};

export default ConflictDemo; 