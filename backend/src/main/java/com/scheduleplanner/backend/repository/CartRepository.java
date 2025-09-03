package com.scheduleplanner.backend.repository;

import com.scheduleplanner.backend.dto.CartItemDTO;
import com.scheduleplanner.backend.dto.ConflictDTO;
import java.util.List;

public interface CartRepository {
    
    // Add a course to students_courses table (enrolled = true)
    boolean addCourseToSchedule(Integer studentId, Integer instructorCourseId);
    
    // Add a time block to time_blocks table
    boolean addTimeBlockToSchedule(Integer studentId, String title, String startTime, 
                                  String endTime, String day, Integer weeks, String description);
    
    // Find instructor_course_id for a course on a specific day
    Integer findInstructorCourseId(String courseName, String day, String startTime, String endTime);
    
    // Check for conflicts between new items and existing schedule
    List<ConflictDTO> checkScheduleConflicts(Integer studentId, List<CartItemDTO> newItems);
    
    // Check for conflicts between a single item and existing schedule
    List<ConflictDTO> checkItemConflicts(Integer studentId, CartItemDTO newItem);
    
    // Get enrolled courses for a student
    List<CartItemDTO> getEnrolledCourses(Integer studentId);
    
    // Get time blocks for a student
    List<CartItemDTO> getTimeBlocks(Integer studentId);
    
    // Get all schedule items (courses + time blocks) for a student
    List<CartItemDTO> getScheduleItems(Integer studentId);
}