import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const ScheduleContext = createContext();

// Initial sample data - unified schedule items with type identification
const initialScheduleItems = [
  // Courses
  {
    id: 1,
    itemType: 'course',
    name: "Computer Science 101",
    subject: "CS",
    course: "101",
    section: "001",
    startTime: "09:00",
    endTime: "10:30",
    days: ["Monday", "Wednesday"],
    room: "Room 201",
    instructor: "Dr. Smith",
    courseDescription: "Introduction to Computer Science",
    color: "#4CAF50",
    isSelected: true,
    status: "Enrolled",
    seatsOpen: 16,
    waitlistSeats: 0,
    waitlistOpen: 10,
    weeks: 15
  },
  {
    id: 2,
    itemType: 'course',
    name: "Mathematics 205",
    subject: "MATH",
    course: "205",
    section: "002",
    startTime: "11:00",
    endTime: "12:15",
    days: ["Tuesday", "Thursday"],
    room: "Room 305",
    instructor: "Prof. Johnson",
    courseDescription: "Advanced Calculus",
    color: "#2196F3",
    isSelected: true,
    status: "Enrolled",
    seatsOpen: 15,
    waitlistSeats: 0,
    waitlistOpen: 15,
    weeks: 15
  },
  {
    id: 3,
    itemType: 'course',
    name: "Physics Lab",
    subject: "PHYS",
    course: "101",
    section: "003",
    startTime: "14:00",
    endTime: "16:00",
    days: ["Friday"],
    room: "Lab 102",
    instructor: "Dr. Williams",
    courseDescription: "Experimental Physics",
    color: "#FF9800",
    isSelected: true,
    status: "Enrolled",
    seatsOpen: 14,
    waitlistSeats: 0,
    waitlistOpen: 20,
    weeks: 15
  },
  {
    id: 4,
    itemType: 'course',
    name: "English Literature",
    subject: "ENG",
    course: "201",
    section: "004",
    startTime: "10:45",
    endTime: "12:00",
    days: ["Monday", "Wednesday", "Friday"],
    room: "Room 110",
    instructor: "Ms. Brown",
    courseDescription: "Study of classic English literature",
    color: "#9C27B0",
    isSelected: false,
    status: "Not Enrolled",
    seatsOpen: 20,
    waitlistSeats: 5,
    waitlistOpen: 10,
    weeks: 15
  },
  // Time Blocks
  {
    id: 5,
    itemType: 'timeBlock',
    title: 'Chess Club',
    day: 'Monday',
    startTime: '15:30',
    endTime: '17:00',
    type: 'club',
    description: 'Weekly chess club meeting',
    color: '#9C27B0'
  },
  {
    id: 6,
    itemType: 'timeBlock',
    title: 'Part-time Job',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '18:00',
    type: 'job',
    description: 'Customer service at local store',
    color: '#FF5722'
  },
  {
    id: 7,
    itemType: 'timeBlock',
    title: 'Study Break',
    day: 'Friday',
    startTime: '12:00',
    endTime: '13:00',
    type: 'break',
    description: 'Lunch and relaxation',
    color: '#4CAF50'
  },
  {
    id: 8,
    itemType: 'timeBlock',
    title: 'Gym Session',
    day: 'Tuesday',
    startTime: '18:00',
    endTime: '19:30',
    type: 'personal',
    description: 'Evening workout',
    color: '#FF9800'
  }
];

// Utility functions for conflict detection
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const hasTimeConflict = (item1, item2) => {
  // Check if items are on the same day
  const days1 = item1.itemType === 'course' ? item1.days : [item1.day];
  const days2 = item2.itemType === 'course' ? item2.days : [item2.day];
  
  const commonDays = days1.filter(day => days2.includes(day));
  if (commonDays.length === 0) return false;
  
  // Check for time overlap on common days
  const start1 = timeToMinutes(item1.startTime);
  const end1 = timeToMinutes(item1.endTime);
  const start2 = timeToMinutes(item2.startTime);
  const end2 = timeToMinutes(item2.endTime);
  
  return (start1 < end2 && start2 < end1);
};

const findConflicts = (newItem, existingItems) => {
  return existingItems.filter(item => hasTimeConflict(newItem, item));
};

const getDetailedConflicts = (newItem, existingItems) => {
  const conflicts = findConflicts(newItem, existingItems);
  return conflicts.map(conflict => ({
    ...conflict,
    conflictType: conflict.itemType === 'course' ? 'Course' : 'Time Block',
    conflictDetails: {
      days: conflict.itemType === 'course' ? conflict.days.join(', ') : conflict.day,
      time: `${conflict.startTime} - ${conflict.endTime}`,
      location: conflict.itemType === 'course' ? conflict.room : conflict.description
    }
  }));
};

// Schedule Provider Component
export const ScheduleProvider = ({ children }) => {
  const [scheduleItems, setScheduleItems] = useState(initialScheduleItems);
  const [conflicts, setConflicts] = useState([]);

  // Add a new course with conflict detection
  const addCourse = useCallback((newCourse) => {
    const courseWithDays = {
      ...newCourse,
      itemType: 'course',
      days: Array.isArray(newCourse.days) ? newCourse.days : [newCourse.day]
    };
    
    // Only check against enrolled courses and time blocks
    const enrolledCourses = scheduleItems.filter(item => item.itemType === 'course' && item.isSelected);
    const timeBlocks = scheduleItems.filter(item => item.itemType === 'timeBlock');
    const courseConflicts = getDetailedConflicts(courseWithDays, [...enrolledCourses, ...timeBlocks]);
    
    if (courseConflicts.length > 0) {
      setConflicts(courseConflicts);
      return { success: false, conflicts: courseConflicts };
    }
    
    // If the course already exists in the list, just mark it as selected
    const existingCourseIndex = scheduleItems.findIndex(item => 
      item.itemType === 'course' && (
        item.id === newCourse.id || 
        (item.subject === newCourse.subject && 
         item.course === newCourse.course && 
         item.section === newCourse.section)
      )
    );
    
    if (existingCourseIndex !== -1) {
      // Update existing course to be selected
      setScheduleItems(prev => prev.map((item, index) => 
        index === existingCourseIndex 
          ? { ...item, isSelected: true, status: 'Enrolled' }
          : item
      ));
    } else {
      // Add new course
      setScheduleItems(prev => [...prev, { ...courseWithDays, id: Date.now(), isSelected: true, status: 'Enrolled' }]);
    }
    
    setConflicts([]);
    return { success: true, conflicts: [] };
  }, [scheduleItems]);

  // Add a new time block with conflict detection
  const addTimeBlock = useCallback((newTimeBlock) => {
    const timeBlockWithDays = {
      ...newTimeBlock,
      itemType: 'timeBlock',
      days: [newTimeBlock.day] // Time blocks are single-day
    };
    
    // Only check against enrolled courses and existing time blocks
    const enrolledCourses = scheduleItems.filter(item => item.itemType === 'course' && item.isSelected);
    const existingTimeBlocks = scheduleItems.filter(item => item.itemType === 'timeBlock');
    const timeBlockConflicts = getDetailedConflicts(timeBlockWithDays, [...enrolledCourses, ...existingTimeBlocks]);
    
    if (timeBlockConflicts.length > 0) {
      setConflicts(timeBlockConflicts);
      return { success: false, conflicts: timeBlockConflicts };
    }
    
    setScheduleItems(prev => [...prev, { ...newTimeBlock, id: Date.now() }]);
    setConflicts([]);
    return { success: true, conflicts: [] };
  }, [scheduleItems]);

  // Update an existing course
  const updateCourse = useCallback((courseId, updates) => {
    setScheduleItems(prev => prev.map(item => 
      item.id === courseId && item.itemType === 'course' ? { ...item, ...updates } : item
    ));
  }, []);

  // Update an existing time block
  const updateTimeBlock = useCallback((timeBlockId, updates) => {
    setScheduleItems(prev => prev.map(item => 
      item.id === timeBlockId && item.itemType === 'timeBlock' ? { ...item, ...updates } : item
    ));
  }, []);

  // Remove a course
  const removeCourse = useCallback((courseId) => {
    setScheduleItems(prev => prev.filter(item => !(item.id === courseId && item.itemType === 'course')));
  }, []);

  // Remove a time block
  const removeTimeBlock = useCallback((timeBlockId) => {
    setScheduleItems(prev => prev.filter(item => !(item.id === timeBlockId && item.itemType === 'timeBlock')));
  }, []);

  // Get all schedule items (courses + time blocks) for a specific day
  const getScheduleForDay = useCallback((day) => {
    const dayCourses = scheduleItems.filter(item => 
      item.itemType === 'course' && 
      (Array.isArray(item.days) ? item.days.includes(day) : item.days === day)
    );
    const dayTimeBlocks = scheduleItems.filter(item => 
      item.itemType === 'timeBlock' && item.day === day
    );
    
    return [...dayCourses, ...dayTimeBlocks].sort((a, b) => 
      timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );
  }, [scheduleItems]);

  // Get all schedule items for the current week
  const getAllScheduleItems = useCallback(() => {
    return scheduleItems;
  }, [scheduleItems]);

  // Get only enrolled/selected courses
  const getEnrolledCourses = useCallback(() => {
    return scheduleItems.filter(item => item.itemType === 'course' && item.isSelected);
  }, [scheduleItems]);

  // Helper functions for backward compatibility
  const getCourses = useCallback(() => {
    return scheduleItems.filter(item => item.itemType === 'course');
  }, [scheduleItems]);

  const getTimeBlocks = useCallback(() => {
    return scheduleItems.filter(item => item.itemType === 'timeBlock');
  }, [scheduleItems]);

  // Clear conflicts
  const clearConflicts = useCallback(() => {
    setConflicts([]);
  }, []);

  const value = {
    // Data
    scheduleItems,
    conflicts,
    
    // Backward compatibility
    courses: getCourses(),
    timeBlocks: getTimeBlocks(),
    
    // Actions
    addCourse,
    addTimeBlock,
    updateCourse,
    updateTimeBlock,
    removeCourse,
    removeTimeBlock,
    
    // Utilities
    getScheduleForDay,
    getAllScheduleItems,
    getEnrolledCourses,
    getCourses,
    getTimeBlocks,
    clearConflicts,
    hasTimeConflict,
    findConflicts,
    getDetailedConflicts
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Custom hook to use the schedule context
export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export default ScheduleContext; 