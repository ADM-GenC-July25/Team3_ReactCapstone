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

// Get student ID by email from the backend
export const getStudentIdByEmail = async (email) => {
  try {
    console.log(`Fetching student ID for email: ${email}`);
    const response = await fetch(`${API_BASE_URL}/student-id?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (response.status === 404) {
      console.log('Student not found for email:', email);
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }
    
    const studentId = await response.json();
    console.log('Student ID:', studentId);
    return studentId;
  } catch (error) {
    console.error('Error fetching student ID:', error);
    return null;
  }
};

// Helper function to get user student ID (dynamic from backend with fallback)
export const getUserStudentId = async (userEmail) => {
  try {
    console.log(`Getting student ID for email: ${userEmail}`);
    const studentId = await getStudentIdByEmail(userEmail);
    
    if (studentId !== null) {
      console.log(`Found student ID ${studentId} for email: ${userEmail}`);
      return studentId;
    }
    
    // Fallback to hardcoded mapping if backend call fails or student not found
    console.log('Falling back to hardcoded mapping for email:', userEmail);
    const emailToIdMap = {
      'Rhushabh@gmail.com': 7,
      'Kinjal@gmail.com': 8,
      'Patralika@gmail.com': 5,
      'Nikhil@gmail.com': 6,
      'Vishaka@gmail.com': 4,
    };
    
    return emailToIdMap[userEmail] || 5; // Default to student ID 5 which has test data
  } catch (error) {
    console.error('Error getting student ID:', error);
    // Fallback to hardcoded mapping on error
    const emailToIdMap = {
      'Rhushabh@gmail.com': 7,
      'Kinjal@gmail.com': 8,
      'Patralika@gmail.com': 5,
      'Nikhil@gmail.com': 6,
      'Vishaka@gmail.com': 4,
    };
    
    return emailToIdMap[userEmail] || 5;
  }
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
