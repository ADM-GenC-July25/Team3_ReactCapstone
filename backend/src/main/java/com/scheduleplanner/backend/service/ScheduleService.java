package com.scheduleplanner.backend.service;

import com.scheduleplanner.backend.dto.TimeBlockScheduleDTO;
import com.scheduleplanner.backend.dto.CourseScheduleDTO;
import com.scheduleplanner.backend.dto.CompleteScheduleDTO;
import com.scheduleplanner.backend.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {
    
    @Autowired
    private ScheduleRepository scheduleRepository;
    
    /**
     * Get all time blocks for all students
     * @return List of time block schedule DTOs
     */
    public List<TimeBlockScheduleDTO> getAllTimeBlockSchedules() {
        return scheduleRepository.getTimeBlockSchedule();
    }
    
    /**
     * Get all courses for all students
     * @return List of course schedule DTOs
     */
    public List<CourseScheduleDTO> getAllCourseSchedules() {
        return scheduleRepository.getCourseSchedule();
    }
    
    /**
     * Get time blocks for a specific student
     * @param studentId The ID of the student
     * @return List of time block schedule DTOs for the student
     */
    public List<TimeBlockScheduleDTO> getTimeBlockScheduleByStudent(Integer studentId) {
        return scheduleRepository.getTimeBlockScheduleByStudent(studentId);
    }
    
    /**
     * Get courses for a specific student
     * @param studentId The ID of the student
     * @return List of course schedule DTOs for the student
     */
    public List<CourseScheduleDTO> getCourseScheduleByStudent(Integer studentId) {
        return scheduleRepository.getCourseScheduleByStudent(studentId);
    }
    
    /**
     * Get complete schedule (both time blocks and courses) for a specific student
     * @param studentId The ID of the student
     * @return CompleteScheduleDTO containing both time blocks and courses
     */
    public CompleteScheduleDTO getCompleteScheduleByStudent(Integer studentId) {
        List<TimeBlockScheduleDTO> timeBlocks = getTimeBlockScheduleByStudent(studentId);
        List<CourseScheduleDTO> courses = getCourseScheduleByStudent(studentId);
        
        return new CompleteScheduleDTO(timeBlocks, courses);
    }
} 