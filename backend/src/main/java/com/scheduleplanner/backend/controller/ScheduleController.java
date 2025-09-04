package com.scheduleplanner.backend.controller;

import com.scheduleplanner.backend.dto.TimeBlockScheduleDTO;
import com.scheduleplanner.backend.dto.CourseScheduleDTO;
import com.scheduleplanner.backend.dto.CompleteScheduleDTO;
import com.scheduleplanner.backend.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@Tag(name = "Schedule", description = "API for managing student schedules, courses, and time blocks")
public class ScheduleController {
    
    @Autowired
    private ScheduleService scheduleService;
    
    /**
     * Get all time blocks for all students
     * @return List of time block schedules
     */
    @Operation(summary = "Get all time block schedules", description = "Retrieves all time block schedules for all students")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved time blocks"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
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
    @Operation(summary = "Get all course schedules", description = "Retrieves all course schedules for all students")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved courses"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
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
    @Operation(summary = "Get complete schedule for a student", description = "Retrieves complete schedule including both courses and time blocks for a specific student")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved student schedule"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/student/{studentId}")
    public ResponseEntity<CompleteScheduleDTO> getCompleteScheduleByStudent(
            @Parameter(description = "Student ID", required = true) @PathVariable Integer studentId) {
        try {
            CompleteScheduleDTO schedule = scheduleService.getCompleteScheduleByStudent(studentId);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get student ID by email
     * @param email The email of the student
     * @return Student ID
     */
    @Operation(summary = "Get student ID by email", description = "Retrieves student ID for a given email address")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved student ID"),
        @ApiResponse(responseCode = "404", description = "Student not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/student-id")
    public ResponseEntity<Integer> getStudentIdByEmail(
            @Parameter(description = "Student email", required = true) @RequestParam String email) {
        try {
            Integer studentId = scheduleService.getStudentIdByEmail(email);
            if (studentId != null) {
                return ResponseEntity.ok(studentId);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 