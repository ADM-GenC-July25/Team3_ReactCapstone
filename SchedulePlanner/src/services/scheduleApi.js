// API service for schedule data
const API_BASE_URL = 'http://localhost:8080/api/schedule';

// Get complete schedule for a student (both courses and time blocks)
export const getCompleteScheduleByStudent = async (studentId) => {
  try {
    console.log(`Fetching schedule for student ID: ${studentId}`);
    const response = await fetch(`${API_BASE_URL}/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching complete schedule:', error);
    // Provide more specific error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check if the backend is running on http://localhost:8080');
    }
    throw error;
  }
};

// Get courses for a student
export const getCoursesByStudent = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/student/${studentId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Get time blocks for a student
export const getTimeBlocksByStudent = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/timeblocks/student/${studentId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching time blocks:', error);
    throw error;
  }
};

// Helper function to map user email to student ID (temporary solution)
export const getUserStudentId = (userEmail) => {
  // For now, we'll use a simple mapping based on the sample users
  // In a real application, this would come from the authentication system
  const emailToIdMap = {
    'Rhushabh@gmail.com': 1,
    'Kinjal@gmail.com': 2,
    'Patralika@gmail.com': 11, // Updated to use student ID 11 which has data
    'patralika@gmail.com': 11, // Handle lowercase as well
    'Nikhil@gmail.com': 1,
    'Vishaka@gmail.com': 1,
  };
  
  return emailToIdMap[userEmail] || 11; // Default to student ID 11 which has test data
};

// Color mapping for different types
export const getEventColor = (type, itemType = null) => {
  if (itemType === 'course') {
    // Course colors based on subject or random
    const courseColors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', '#607D8B'];
    return courseColors[Math.floor(Math.random() * courseColors.length)];
  } else {
    // Time block colors based on type
    const typeColors = {
      'job': '#FF5722',
      'club': '#9C27B0',
      'personal': '#FF9800',
      'study': '#00BCD4',
      'break': '#4CAF50',
      'other': '#607D8B'
    };
    return typeColors[type] || '#607D8B';
  }
};
