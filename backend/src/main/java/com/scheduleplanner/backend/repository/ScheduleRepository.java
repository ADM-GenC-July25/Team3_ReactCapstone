package com.scheduleplanner.backend.repository;

import com.scheduleplanner.backend.dto.TimeBlockScheduleDTO;
import com.scheduleplanner.backend.dto.CourseScheduleDTO;

import java.util.List;

public interface ScheduleRepository {
    
    // Get all time blocks for all students
    List<TimeBlockScheduleDTO> getTimeBlockSchedule();
    
    // Get all courses for all students
    List<CourseScheduleDTO> getCourseSchedule();
    
    // Get time blocks for a specific student
    List<TimeBlockScheduleDTO> getTimeBlockScheduleByStudent(Integer studentId);
    
    // Get courses for a specific student
    List<CourseScheduleDTO> getCourseScheduleByStudent(Integer studentId);
    
    // Get student ID by email address
    Integer getStudentIdByEmail(String email);
}