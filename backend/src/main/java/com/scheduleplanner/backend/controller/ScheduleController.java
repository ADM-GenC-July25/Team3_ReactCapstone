package com.scheduleplanner.backend.controller;

import com.scheduleplanner.backend.dto.TimeBlockScheduleDTO;
import com.scheduleplanner.backend.dto.CourseScheduleDTO;
import com.scheduleplanner.backend.dto.CompleteScheduleDTO;
import com.scheduleplanner.backend.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "http://localhost:3000")
public class ScheduleController {
    
    @Autowired
    private ScheduleService scheduleService;
    
    /**
     * Get all time blocks for all students
     * @return List of time block schedules
     */
    @GetMapping("/timeblocks")
    public ResponseEntity<List<TimeBlockScheduleDTO>> getAllTimeBlockSchedules() {
        try {
            List<TimeBlockScheduleDTO> timeBlocks = scheduleService.getAllTimeBlockSchedules();
            return ResponseEntity.ok(timeBlocks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get all courses for all students
     * @return List of course schedules
     */
    @GetMapping("/courses")
    public ResponseEntity<List<CourseScheduleDTO>> getAllCourseSchedules() {
        try {
            List<CourseScheduleDTO> courses = scheduleService.getAllCourseSchedules();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get time blocks for a specific student
     * @param studentId The ID of the student
     * @return List of time block schedules for the student
     */
    @GetMapping("/timeblocks/student/{studentId}")
    public ResponseEntity<List<TimeBlockScheduleDTO>> getTimeBlockScheduleByStudent(@PathVariable Integer studentId) {
        try {
            List<TimeBlockScheduleDTO> timeBlocks = scheduleService.getTimeBlockScheduleByStudent(studentId);
            return ResponseEntity.ok(timeBlocks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get courses for a specific student
     * @param studentId The ID of the student
     * @return List of course schedules for the student
     */
    @GetMapping("/courses/student/{studentId}")
    public ResponseEntity<List<CourseScheduleDTO>> getCourseScheduleByStudent(@PathVariable Integer studentId) {
        try {
            List<CourseScheduleDTO> courses = scheduleService.getCourseScheduleByStudent(studentId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get complete schedule (both time blocks and courses) for a specific student
     * @param studentId The ID of the student
     * @return CompleteScheduleDTO containing both time blocks and courses
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<CompleteScheduleDTO> getCompleteScheduleByStudent(@PathVariable Integer studentId) {
        try {
            CompleteScheduleDTO schedule = scheduleService.getCompleteScheduleByStudent(studentId);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 