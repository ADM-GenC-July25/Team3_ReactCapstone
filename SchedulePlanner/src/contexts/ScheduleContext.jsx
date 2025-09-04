import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const ScheduleContext = createContext();

// Initial sample data - unified schedule items with type identification
const initialScheduleItems = [
  // Courses - Keep 1-2 enrolled to show functionality, rest available
  {
    id: 1,
    itemType: 'course',
    name: "Computer Science 101",
    subject: "CS",
    course: "101",
    section: "001",
    startTime: "9:00 AM",
    endTime: "10:30 AM",
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
    startTime: "11:00 AM",
    endTime: "12:15 PM",
    days: ["Monday", "Wednesday"],
    room: "Room 305",
    instructor: "Prof. Johnson",
    courseDescription: "Advanced Calculus",
    color: "#2196F3",
    isSelected: false,
    status: "Available",
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
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    days: ["Friday"],
    room: "Lab 102",
    instructor: "Dr. Williams",
    courseDescription: "Experimental Physics",
    color: "#FF9800",
    isSelected: false,
    status: "Available",
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
    startTime: "10:00 AM",
    endTime: "11:15 AM",
    days: ["Monday", "Wednesday", "Friday"],
    room: "Room 110",
    instructor: "Ms. Brown",
    courseDescription: "Study of classic English literature",
    color: "#9C27B0",
    isSelected: false,
    status: "Available",
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
    startTime: "3:30 PM",
    endTime: "5:00 PM",
    days: ["Friday"],
    room: "Lab 201",
    instructor: "Dr. Davis",
    courseDescription: "Introduction to Chemistry",
    color: "#E91E63",
    isSelected: false,
    status: "Available",
    seatsOpen: 18,
    waitlistSeats: 0,
    waitlistOpen: 12,
    weeks: 15
  },
  // New expanded course catalog
  {
    id: 6,
    itemType: 'course',
    name: "Biology 110",
    subject: "BIO",
    course: "110",
    section: "001",
    startTime: "8:00 AM",
    endTime: "9:30 AM",
    days: ["Tuesday", "Thursday"],
    room: "Lab 205",
    instructor: "Dr. Martinez",
    courseDescription: "Introduction to Biology and Life Sciences",
    color: "#4CAF50",
    isSelected: false,
    status: "Available",
    seatsOpen: 25,
    waitlistSeats: 0,
    waitlistOpen: 15,
    weeks: 15
  },
  {
    id: 7,
    itemType: 'course',
    name: "Psychology 101",
    subject: "PSY",
    course: "101",
    section: "002",
    startTime: "12:30 PM",
    endTime: "2:00 PM",
    days: ["Monday", "Wednesday"],
    room: "Room 150",
    instructor: "Prof. Garcia",
    courseDescription: "Introduction to Psychology",
    color: "#FF5722",
    isSelected: false,
    status: "Available",
    seatsOpen: 30,
    waitlistSeats: 2,
    waitlistOpen: 8,
    weeks: 15
  },
  {
    id: 8,
    itemType: 'course',
    name: "History 201",
    subject: "HIST",
    course: "201",
    section: "001",
    startTime: "9:45 AM",
    endTime: "11:00 AM",
    days: ["Tuesday", "Thursday"],
    room: "Room 180",
    instructor: "Dr. Chen",
    courseDescription: "World History from 1500 to Present",
    color: "#795548",
    isSelected: false,
    status: "Available",
    seatsOpen: 22,
    waitlistSeats: 1,
    waitlistOpen: 12,
    weeks: 15
  },
  {
    id: 9,
    itemType: 'course',
    name: "Statistics 301",
    subject: "STAT",
    course: "301",
    section: "003",
    startTime: "1:15 PM",
    endTime: "2:30 PM",
    days: ["Monday", "Wednesday", "Friday"],
    room: "Room 220",
    instructor: "Prof. Kim",
    courseDescription: "Intermediate Statistics and Data Analysis",
    color: "#3F51B5",
    isSelected: false,
    status: "Available",
    seatsOpen: 18,
    waitlistSeats: 3,
    waitlistOpen: 10,
    weeks: 15
  },
  {
    id: 10,
    itemType: 'course',
    name: "Art History 150",
    subject: "ART",
    course: "150",
    section: "001",
    startTime: "4:00 PM",
    endTime: "5:15 PM",
    days: ["Tuesday"],
    room: "Art Building 101",
    instructor: "Ms. Rodriguez",
    courseDescription: "Survey of Western Art History",
    color: "#E91E63",
    isSelected: false,
    status: "Available",
    seatsOpen: 20,
    waitlistSeats: 0,
    waitlistOpen: 15,
    weeks: 15
  },
  {
    id: 11,
    itemType: 'course',
    name: "Economics 201",
    subject: "ECON",
    course: "201",
    section: "002",
    startTime: "11:30 AM",
    endTime: "12:45 PM",
    days: ["Tuesday", "Thursday"],
    room: "Room 165",
    instructor: "Dr. Thompson",
    courseDescription: "Microeconomics Principles",
    color: "#607D8B",
    isSelected: false,
    status: "Available",
    seatsOpen: 28,
    waitlistSeats: 0,
    waitlistOpen: 12,
    weeks: 15
  },
  {
    id: 12,
    itemType: 'course',
    name: "Philosophy 101",
    subject: "PHIL",
    course: "101",
    section: "001",
    startTime: "2:45 PM",
    endTime: "4:00 PM",
    days: ["Monday", "Wednesday"],
    room: "Room 125",
    instructor: "Prof. Wilson",
    courseDescription: "Introduction to Philosophy",
    color: "#9C27B0",
    isSelected: false,
    status: "Available",
    seatsOpen: 25,
    waitlistSeats: 1,
    waitlistOpen: 10,
    weeks: 15
  },
  {
    id: 13,
    itemType: 'course',
    name: "Computer Science 201",
    subject: "CS",
    course: "201",
    section: "001",
    startTime: "1:00 PM",
    endTime: "2:15 PM",
    days: ["Tuesday", "Thursday"],
    room: "Room 202",
    instructor: "Prof. Lee",
    courseDescription: "Data Structures and Algorithms",
    color: "#4CAF50",
    isSelected: false,
    status: "Available",
    seatsOpen: 20,
    waitlistSeats: 5,
    waitlistOpen: 8,
    weeks: 15
  },
  {
    id: 14,
    itemType: 'course',
    name: "Calculus I",
    subject: "MATH",
    course: "151",
    section: "003",
    startTime: "8:15 AM",
    endTime: "9:30 AM",
    days: ["Monday", "Wednesday", "Friday"],
    room: "Room 301",
    instructor: "Dr. Patel",
    courseDescription: "Differential and Integral Calculus",
    color: "#2196F3",
    isSelected: false,
    status: "Available",
    seatsOpen: 35,
    waitlistSeats: 0,
    waitlistOpen: 20,
    weeks: 15
  },
  {
    id: 15,
    itemType: 'course',
    name: "Spanish 101",
    subject: "SPAN",
    course: "101",
    section: "002",
    startTime: "10:15 AM",
    endTime: "11:30 AM",
    days: ["Tuesday", "Thursday"],
    room: "Room 145",
    instructor: "Prof. Hernandez",
    courseDescription: "Beginning Spanish Language",
    color: "#FF9800",
    isSelected: false,
    status: "Available",
    seatsOpen: 22,
    waitlistSeats: 2,
    waitlistOpen: 10,
    weeks: 15
  },
  {
    id: 16,
    itemType: 'course',
    name: "Sociology 201",
    subject: "SOC",
    course: "201",
    section: "001",
    startTime: "3:00 PM",
    endTime: "4:15 PM",
    days: ["Monday", "Wednesday"],
    room: "Room 175",
    instructor: "Dr. Anderson",
    courseDescription: "Introduction to Sociology",
    color: "#795548",
    isSelected: false,
    status: "Available",
    seatsOpen: 30,
    waitlistSeats: 0,
    waitlistOpen: 15,
    weeks: 15
  },
  {
    id: 17,
    itemType: 'course',
    name: "Business Administration 101",
    subject: "BUS",
    course: "101",
    section: "001",
    startTime: "5:30 PM",
    endTime: "6:45 PM",
    days: ["Tuesday", "Thursday"],
    room: "Business Building 201",
    instructor: "Prof. Clarke",
    courseDescription: "Fundamentals of Business Administration",
    color: "#607D8B",
    isSelected: false,
    status: "Available",
    seatsOpen: 40,
    waitlistSeats: 0,
    waitlistOpen: 25,
    weeks: 15
  },
  {
    id: 18,
    itemType: 'course',
    name: "Chemistry 201",
    subject: "CHEM",
    course: "201",
    section: "002",
    startTime: "9:30 AM",
    endTime: "10:45 AM",
    days: ["Tuesday", "Thursday"],
    room: "Lab 203",
    instructor: "Dr. Taylor",
    courseDescription: "Organic Chemistry",
    color: "#E91E63",
    isSelected: false,
    status: "Available",
    seatsOpen: 16,
    waitlistSeats: 4,
    waitlistOpen: 8,
    weeks: 15
  },
  {
    id: 19,
    itemType: 'course',
    name: "Political Science 101",
    subject: "POLS",
    course: "101",
    section: "001",
    startTime: "4:30 PM",
    endTime: "5:45 PM",
    days: ["Monday", "Wednesday"],
    room: "Room 190",
    instructor: "Dr. Roberts",
    courseDescription: "Introduction to Political Science",
    color: "#3F51B5",
    isSelected: false,
    status: "Available",
    seatsOpen: 35,
    waitlistSeats: 0,
    waitlistOpen: 20,
    weeks: 15
  },
  {
    id: 20,
    itemType: 'course',
    name: "Music Theory 101",
    subject: "MUS",
    course: "101",
    section: "001",
    startTime: "12:00 PM",
    endTime: "1:15 PM",
    days: ["Tuesday", "Thursday"],
    room: "Music Hall 110",
    instructor: "Prof. Mozart",
    courseDescription: "Fundamentals of Music Theory",
    color: "#FF5722",
    isSelected: false,
    status: "Available",
    seatsOpen: 15,
    waitlistSeats: 0,
    waitlistOpen: 8,
    weeks: 15
  },
  {
    id: 21,
    itemType: 'course',
    name: "Environmental Science 201",
    subject: "ENV",
    course: "201",
    section: "001",
    startTime: "8:30 AM",
    endTime: "9:45 AM",
    days: ["Monday", "Wednesday", "Friday"],
    room: "Science Building 301",
    instructor: "Dr. Green",
    courseDescription: "Environmental Systems and Sustainability",
    color: "#8BC34A",
    isSelected: false,
    status: "Available",
    seatsOpen: 20,
    waitlistSeats: 2,
    waitlistOpen: 12,
    weeks: 15
  },
  {
    id: 22,
    itemType: 'course',
    name: "Anthropology 150",
    subject: "ANTH",
    course: "150",
    section: "001",
    startTime: "1:45 PM",
    endTime: "3:00 PM",
    days: ["Tuesday", "Thursday"],
    room: "Room 235",
    instructor: "Dr. White",
    courseDescription: "Cultural Anthropology",
    color: "#795548",
    isSelected: false,
    status: "Available",
    seatsOpen: 25,
    waitlistSeats: 0,
    waitlistOpen: 15,
    weeks: 15
  },
  {
    id: 23,
    itemType: 'course',
    name: "Computer Science 301",
    subject: "CS",
    course: "301",
    section: "001",
    startTime: "3:15 PM",
    endTime: "4:30 PM",
    days: ["Monday", "Wednesday"],
    room: "Computer Lab 205",
    instructor: "Dr. Zhang",
    courseDescription: "Database Systems",
    color: "#4CAF50",
    isSelected: false,
    status: "Available",
    seatsOpen: 18,
    waitlistSeats: 7,
    waitlistOpen: 5,
    weeks: 15
  },
  {
    id: 24,
    itemType: 'course',
    name: "French 101",
    subject: "FREN",
    course: "101",
    section: "001",
    startTime: "9:15 AM",
    endTime: "10:30 AM",
    days: ["Tuesday", "Thursday"],
    room: "Language Center 120",
    instructor: "Mme. Dubois",
    courseDescription: "Beginning French Language",
    color: "#3F51B5",
    isSelected: false,
    status: "Available",
    seatsOpen: 20,
    waitlistSeats: 0,
    waitlistOpen: 12,
    weeks: 15
  },
  {
    id: 25,
    itemType: 'course',
    name: "Accounting 201",
    subject: "ACCT",
    course: "201",
    section: "002",
    startTime: "6:00 PM",
    endTime: "7:15 PM",
    days: ["Monday", "Wednesday"],
    room: "Business Building 105",
    instructor: "Prof. Miller",
    courseDescription: "Financial Accounting Principles",
    color: "#607D8B",
    isSelected: false,
    status: "Available",
    seatsOpen: 32,
    waitlistSeats: 0,
    waitlistOpen: 18,
    weeks: 15
  },
  {
    id: 26,
    itemType: 'course',
    name: "Physics 201",
    subject: "PHYS",
    course: "201",
    section: "001",
    startTime: "11:15 AM",
    endTime: "12:30 PM",
    days: ["Tuesday", "Thursday"],
    room: "Physics Building 102",
    instructor: "Dr. Newton",
    courseDescription: "Classical Mechanics",
    color: "#FF9800",
    isSelected: false,
    status: "Available",
    seatsOpen: 24,
    waitlistSeats: 1,
    waitlistOpen: 10,
    weeks: 15
  },
  {
    id: 27,
    itemType: 'course',
    name: "Literature Writing",
    subject: "ENG",
    course: "102",
    section: "003",
    startTime: "2:15 PM",
    endTime: "3:30 PM",
    days: ["Monday", "Wednesday"],
    room: "Room 115",
    instructor: "Prof. Shakespeare",
    courseDescription: "Creative and Academic Writing",
    color: "#9C27B0",
    isSelected: false,
    status: "Available",
    seatsOpen: 18,
    waitlistSeats: 0,
    waitlistOpen: 12,
    weeks: 15
  },
  {
    id: 28,
    itemType: 'course',
    name: "Calculus II",
    subject: "MATH",
    course: "152",
    section: "001",
    startTime: "10:45 AM",
    endTime: "12:00 PM",
    days: ["Monday", "Wednesday", "Friday"],
    room: "Room 302",
    instructor: "Dr. Euler",
    courseDescription: "Integral Calculus and Series",
    color: "#2196F3",
    isSelected: false,
    status: "Available",
    seatsOpen: 28,
    waitlistSeats: 2,
    waitlistOpen: 15,
    weeks: 15
  },
  {
    id: 29,
    itemType: 'course',
    name: "Marketing 301",
    subject: "MKTG",
    course: "301",
    section: "001",
    startTime: "5:00 PM",
    endTime: "6:15 PM",
    days: ["Tuesday", "Thursday"],
    room: "Business Building 210",
    instructor: "Prof. Brand",
    courseDescription: "Principles of Marketing",
    color: "#FF5722",
    isSelected: false,
    status: "Available",
    seatsOpen: 30,
    waitlistSeats: 0,
    waitlistOpen: 20,
    weeks: 15
  },
  {
    id: 30,
    itemType: 'course',
    name: "Geology 101",
    subject: "GEOL",
    course: "101",
    section: "001",
    startTime: "1:30 PM",
    endTime: "2:45 PM",
    days: ["Tuesday", "Thursday"],
    room: "Earth Sciences 150",
    instructor: "Dr. Stone",
    courseDescription: "Physical Geology",
    color: "#795548",
    isSelected: false,
    status: "Available",
    seatsOpen: 22,
    waitlistSeats: 0,
    waitlistOpen: 15,
    weeks: 15
  },
  {
    id: 31,
    itemType: 'course',
    name: "Linear Algebra",
    subject: "MATH",
    course: "220",
    section: "002",
    startTime: "12:15 PM",
    endTime: "1:30 PM",
    days: ["Monday", "Wednesday", "Friday"],
    room: "Room 303",
    instructor: "Prof. Matrix",
    courseDescription: "Linear Algebra and Vector Spaces",
    color: "#2196F3",
    isSelected: false,
    status: "Available",
    seatsOpen: 24,
    waitlistSeats: 3,
    waitlistOpen: 10,
    weeks: 15
  },
  {
    id: 32,
    itemType: 'course',
    name: "Web Development",
    subject: "CS",
    course: "350",
    section: "002",
    startTime: "4:45 PM",
    endTime: "6:00 PM",
    days: ["Tuesday", "Thursday"],
    room: "Computer Lab 301",
    instructor: "Prof. Code",
    courseDescription: "Full-Stack Web Development",
    color: "#4CAF50",
    isSelected: false,
    status: "Available",
    seatsOpen: 15,
    waitlistSeats: 8,
    waitlistOpen: 3,
    weeks: 15
  },
  {
    id: 33,
    itemType: 'course',
    name: "Public Speaking",
    subject: "COMM",
    course: "101",
    section: "001",
    startTime: "11:45 AM",
    endTime: "1:00 PM",
    days: ["Tuesday", "Thursday"],
    room: "Communications 210",
    instructor: "Prof. Voice",
    courseDescription: "Fundamentals of Public Speaking",
    color: "#FF5722",
    isSelected: false,
    status: "Available",
    seatsOpen: 20,
    waitlistSeats: 0,
    waitlistOpen: 15,
    weeks: 15
  },
  {
    id: 34,
    itemType: 'course',
    name: "Biology Lab",
    subject: "BIO",
    course: "110L",
    section: "001",
    startTime: "2:30 PM",
    endTime: "5:00 PM",
    days: ["Friday"],
    room: "Biology Lab 301",
    instructor: "Dr. Cell",
    courseDescription: "Biology Laboratory Experiments",
    color: "#4CAF50",
    isSelected: false,
    status: "Available",
    seatsOpen: 12,
    waitlistSeats: 0,
    waitlistOpen: 8,
    weeks: 15
  },
  {
    id: 35,
    itemType: 'course',
    name: "Ethics 201",
    subject: "PHIL",
    course: "201",
    section: "001",
    startTime: "6:30 PM",
    endTime: "7:45 PM",
    days: ["Monday", "Wednesday"],
    room: "Room 130",
    instructor: "Dr. Kant",
    courseDescription: "Moral Philosophy and Ethics",
    color: "#9C27B0",
    isSelected: false,
    status: "Available",
    seatsOpen: 25,
    waitlistSeats: 0,
    waitlistOpen: 12,
    weeks: 15
  },
  // Time Blocks

];

// Utility functions for conflict detection
const timeToMinutes = (time) => {
  // Handle 12-hour format with AM/PM
  const timePattern = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const match = time.match(timePattern);
  
  if (!match) {
    console.error('Invalid time format:', time);
    return 0;
  }
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  // Convert to 24-hour format for calculations
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
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