import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCompleteScheduleByStudent, getUserStudentId, getEventColor } from '../services/scheduleApi';

// Create the context
const ScheduleContext = createContext();

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
  const [scheduleItems, setScheduleItems] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [potentialConflicts, setPotentialConflicts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to convert time format from HH:mm:ss to HH:mm
  const formatTime = (timeString) => {
    if (!timeString) return timeString;
    // Convert "18:00:00" to "18:00"
    return timeString.substring(0, 5);
  };

  // Transform API data to internal format
  const transformApiDataToScheduleItems = useCallback((apiData) => {
    const items = [];
    let nextId = 1;

    console.log('Transforming API data:', apiData);

    // Transform courses
    if (apiData.courses) {
      console.log('Processing courses:', apiData.courses);
      apiData.courses.forEach(course => {
        console.log('Processing course:', course);
        // Parse days from the course day field (assuming single day from API)
        let days = [];
        if (course.courseDay) {
          // Handle both single day and multiple days
          days = [course.courseDay]; // API returns single day like "Monday"
        }

        items.push({
          id: nextId++,
          itemType: 'course',
          name: course.courseName || `${course.courseCode} ${course.courseNumber}`,
          subject: course.courseCode,
          course: course.courseNumber,
          section: "001", // Default section
          startTime: formatTime(course.courseStartTime),
          endTime: formatTime(course.courseEndTime),
          days: days,
          room: course.courseLocationName || "TBD",
          instructor: course.instructorName || "TBD",
          courseDescription: course.courseDescription || "",
          color: getEventColor(null, 'course'),
          isSelected: true,
          status: course.enrolled ? "Enrolled" : "Waitlisted",
          seatsOpen: 20,
          waitlistSeats: 0,
          waitlistOpen: 10,
          weeks: course.courseWeeks || 15
        });
      });
    }

    // Transform time blocks
    if (apiData.timeBlocks) {
      console.log('Processing time blocks:', apiData.timeBlocks);
      apiData.timeBlocks.forEach(timeBlock => {
        console.log('Processing time block:', timeBlock);
        items.push({
          id: nextId++,
          itemType: 'timeBlock',
          title: timeBlock.timeBlockName,
          day: timeBlock.timeBlockDay,
          startTime: formatTime(timeBlock.timeBlockStartTime),
          endTime: formatTime(timeBlock.timeBlockEndTime),
          type: 'other', // Default type since API doesn't provide it
          description: timeBlock.timeBlockDescription || '',
          color: getEventColor('other'),
          weeks: timeBlock.timeBlockWeeks || 15
        });
      });
    }

    console.log('Transformed schedule items:', items);
    return items;
  }, []);

  // Load schedule data for a specific student
  const loadScheduleData = useCallback(async (userEmail) => {
    if (!userEmail) return;

    setIsLoading(true);
    setError(null);

    try {
      const studentId = getUserStudentId(userEmail);
      console.log(`Loading schedule for student ID: ${studentId}`);
      
      const apiData = await getCompleteScheduleByStudent(studentId);
      console.log('API data received:', apiData);
      
      const transformedItems = transformApiDataToScheduleItems(apiData);
      console.log('Transformed schedule items:', transformedItems);
      
      setScheduleItems(transformedItems);
    } catch (err) {
      console.error('Error loading schedule data:', err);
      setError(err.message);
      // Fall back to empty array on error
      setScheduleItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [transformApiDataToScheduleItems]);

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

  // Add a new time block with enhanced conflict detection
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
    isLoading,
    error,
    
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
    loadScheduleData,
    
    // Utilities
    getScheduleForDay,
    getAllScheduleItems,
    getEnrolledCourses,
    getCourses,
    getTimeBlocks,
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