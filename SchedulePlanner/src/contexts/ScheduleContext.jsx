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
    startTime: "09:30", // CONFLICT: Overlaps with CS 101 on Monday/Wednesday
    endTime: "10:45",
    days: ["Monday", "Wednesday"],
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
    startTime: "10:00", // CONFLICT: Overlaps with CS 101 and MATH 205 on Monday/Wednesday
    endTime: "11:15",
    days: ["Monday", "Wednesday", "Friday"],
    room: "Room 110",
    instructor: "Ms. Brown",
    courseDescription: "Study of classic English literature",
    color: "#9C27B0",
    isSelected: true, // Changed to true to show conflicts
    status: "Enrolled", // Changed to Enrolled to show conflicts
    seatsOpen: 20,
    waitlistSeats: 5,
    waitlistOpen: 10,
    weeks: 15
  },
  {
    id: 5,
    itemType: 'course',
    name: "Chemistry 101",
    subject: "CHEM",
    course: "101",
    section: "001",
    startTime: "15:30", // CONFLICT: Overlaps with Physics Lab on Friday
    endTime: "17:00",
    days: ["Friday"],
    room: "Lab 201",
    instructor: "Dr. Davis",
    courseDescription: "Introduction to Chemistry",
    color: "#E91E63",
    isSelected: true,
    status: "Enrolled",
    seatsOpen: 18,
    waitlistSeats: 0,
    waitlistOpen: 12,
    weeks: 15
  },
  // Time Blocks

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
  return conflicts.map(conflict => {
    const conflictType = conflict.itemType === 'course' ? 'Course' : 'Time Block';
    const severity = conflict.itemType === 'course' ? 'High' : 'Medium';
    
    // Calculate overlap duration
    const start1 = timeToMinutes(newItem.startTime);
    const end1 = timeToMinutes(newItem.endTime);
    const start2 = timeToMinutes(conflict.startTime);
    const end2 = timeToMinutes(conflict.endTime);
    const overlapStart = Math.max(start1, start2);
    const overlapEnd = Math.min(end1, end2);
    const overlapMinutes = overlapEnd - overlapStart;
    
    return {
      ...conflict,
      conflictType,
      severity,
      overlapMinutes,
      conflictDetails: {
        days: conflict.itemType === 'course' ? conflict.days.join(', ') : conflict.day,
        time: `${conflict.startTime} - ${conflict.endTime}`,
        location: conflict.itemType === 'course' ? conflict.room : conflict.description,
        overlap: `${Math.floor(overlapMinutes / 60)}h ${overlapMinutes % 60}m`
      },
      suggestions: generateConflictSuggestions(newItem, conflict)
    };
  });
};

const generateConflictSuggestions = (newItem, conflict) => {
  const suggestions = [];
  
  if (newItem.itemType === 'course' && conflict.itemType === 'course') {
    suggestions.push('Consider enrolling in a different section of the course');
    suggestions.push('Check if the course is offered at a different time');
    suggestions.push('Verify if both courses are required for your degree');
  } else if (newItem.itemType === 'timeBlock' && conflict.itemType === 'course') {
    suggestions.push('Reschedule your personal activity to avoid class time');
    suggestions.push('Check if the course has alternative meeting times');
  } else if (newItem.itemType === 'course' && conflict.itemType === 'timeBlock') {
    suggestions.push('Reschedule your personal activity to avoid class time');
    suggestions.push('Consider if the time block is flexible');
  } else {
    suggestions.push('Reschedule one of the activities to avoid overlap');
  }
  
  return suggestions;
};

// Enhanced conflict checking with more detailed analysis
const checkScheduleConflicts = (newItem, existingItems) => {
  const conflicts = getDetailedConflicts(newItem, existingItems);
  
  // Categorize conflicts by severity
  const highPriorityConflicts = conflicts.filter(c => c.severity === 'High');
  const mediumPriorityConflicts = conflicts.filter(c => c.severity === 'Medium');
  
  // Check for potential conflicts (items that are close in time but don't overlap)
  const potentialConflicts = findPotentialConflicts(newItem, existingItems);
  
  return {
    conflicts,
    highPriorityConflicts,
    mediumPriorityConflicts,
    potentialConflicts,
    totalConflicts: conflicts.length,
    hasConflicts: conflicts.length > 0,
    canProceed: conflicts.length === 0
  };
};

const findPotentialConflicts = (newItem, existingItems) => {
  const potential = [];
  const bufferMinutes = 15; // 15-minute buffer between items
  
  existingItems.forEach(item => {
    const days1 = newItem.itemType === 'course' ? newItem.days : [newItem.day];
    const days2 = item.itemType === 'course' ? item.days : [item.day];
    
    const commonDays = days1.filter(day => days2.includes(day));
    if (commonDays.length === 0) return;
    
    const start1 = timeToMinutes(newItem.startTime);
    const end1 = timeToMinutes(newItem.endTime);
    const start2 = timeToMinutes(item.startTime);
    const end2 = timeToMinutes(item.endTime);
    
    // Check if items are too close together (within buffer time)
    const gap1 = start2 - end1; // gap between newItem end and existing start
    const gap2 = start1 - end2; // gap between existing end and newItem start
    
    if (gap1 >= 0 && gap1 < bufferMinutes) {
      potential.push({
        ...item,
        type: 'gap',
        gapMinutes: gap1,
        message: `Very short break between ${newItem.itemType === 'course' ? 'course' : 'activity'} and ${item.itemType === 'course' ? 'course' : 'activity'}`
      });
    } else if (gap2 >= 0 && gap2 < bufferMinutes) {
      potential.push({
        ...item,
        type: 'gap',
        gapMinutes: gap2,
        message: `Very short break between ${item.itemType === 'course' ? 'course' : 'activity'} and ${newItem.itemType === 'course' ? 'course' : 'activity'}`
      });
    }
  });
  
  return potential;
};

// Schedule Provider Component
export const ScheduleProvider = ({ children }) => {
  const [scheduleItems, setScheduleItems] = useState(initialScheduleItems);
  const [userTimeBlocks, setUserTimeBlocks] = useState([]); // User's created time blocks (not in schedule yet)
  const [conflicts, setConflicts] = useState([]);
  const [potentialConflicts, setPotentialConflicts] = useState([]);

  // Add a new course with enhanced conflict detection
  const addCourse = useCallback((newCourse) => {
    const courseWithDays = {
      ...newCourse,
      itemType: 'course',
      days: Array.isArray(newCourse.days) ? newCourse.days : [newCourse.day]
    };
    
    // Only check against enrolled courses and time blocks
    const enrolledCourses = scheduleItems.filter(item => item.itemType === 'course' && item.isSelected);
    const timeBlocks = scheduleItems.filter(item => item.itemType === 'timeBlock');
    const conflictAnalysis = checkScheduleConflicts(courseWithDays, [...enrolledCourses, ...timeBlocks]);
    
    if (conflictAnalysis.hasConflicts) {
      setConflicts(conflictAnalysis.conflicts);
      setPotentialConflicts(conflictAnalysis.potentialConflicts);
      return { 
        success: false, 
        conflicts: conflictAnalysis.conflicts,
        potentialConflicts: conflictAnalysis.potentialConflicts,
        analysis: conflictAnalysis
      };
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
    
    // Set potential conflicts as warnings (not blocking)
    setPotentialConflicts(conflictAnalysis.potentialConflicts);
    setConflicts([]);
    
    return { 
      success: true, 
      conflicts: [],
      potentialConflicts: conflictAnalysis.potentialConflicts,
      analysis: conflictAnalysis
    };
  }, [scheduleItems]);

  // Add a new time block to user's collection (not to schedule)
  const createTimeBlock = useCallback((newTimeBlock) => {
    const timeBlockToAdd = {
      ...newTimeBlock,
      id: Date.now(),
      itemType: 'timeBlock'
    };
    
    setUserTimeBlocks(prev => [...prev, timeBlockToAdd]);
    return { success: true, timeBlock: timeBlockToAdd };
  }, []);

  // Remove a time block from user's collection
  const removeUserTimeBlock = useCallback((timeBlockId) => {
    setUserTimeBlocks(prev => prev.filter(block => block.id !== timeBlockId));
  }, []);

  // Get user's created time blocks
  const getUserTimeBlocks = useCallback(() => {
    return userTimeBlocks;
  }, [userTimeBlocks]);

  // Add a new time block with enhanced conflict detection (for checkout)
  const addTimeBlock = useCallback((newTimeBlock) => {
    const timeBlockWithDays = {
      ...newTimeBlock,
      itemType: 'timeBlock',
      days: [newTimeBlock.day] // Time blocks are single-day
    };
    
    // Only check against enrolled courses and existing time blocks
    const enrolledCourses = scheduleItems.filter(item => item.itemType === 'course' && item.isSelected);
    const existingTimeBlocks = scheduleItems.filter(item => item.itemType === 'timeBlock');
    const conflictAnalysis = checkScheduleConflicts(timeBlockWithDays, [...enrolledCourses, ...existingTimeBlocks]);
    
    if (conflictAnalysis.hasConflicts) {
      setConflicts(conflictAnalysis.conflicts);
      setPotentialConflicts(conflictAnalysis.potentialConflicts);
      return { 
        success: false, 
        conflicts: conflictAnalysis.conflicts,
        potentialConflicts: conflictAnalysis.potentialConflicts,
        analysis: conflictAnalysis
      };
    }
    
    // Add the time block with proper itemType
    setScheduleItems(prev => [...prev, { 
      ...newTimeBlock, 
      itemType: 'timeBlock',
      id: Date.now() 
    }]);
    
    // Set potential conflicts as warnings (not blocking)
    setPotentialConflicts(conflictAnalysis.potentialConflicts);
    setConflicts([]);
    
    return { 
      success: true, 
      conflicts: [],
      potentialConflicts: conflictAnalysis.potentialConflicts,
      analysis: conflictAnalysis
    };
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
    setPotentialConflicts([]);
  }, []);

  // Clear only potential conflicts
  const clearPotentialConflicts = useCallback(() => {
    setPotentialConflicts([]);
  }, []);

  const value = {
    // Data
    scheduleItems,
    conflicts,
    potentialConflicts,
    
    // Backward compatibility
    courses: getCourses(),
    timeBlocks: getTimeBlocks(),
    
    // Actions
    addCourse,
    addTimeBlock,
    createTimeBlock,
    removeUserTimeBlock,
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
    getUserTimeBlocks,
    clearConflicts,
    clearPotentialConflicts,
    hasTimeConflict,
    findConflicts,
    getDetailedConflicts,
    checkScheduleConflicts,
    findPotentialConflicts
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