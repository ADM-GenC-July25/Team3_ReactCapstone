package com.scheduleplanner.backend.dto;

import java.util.List;

public class CompleteScheduleDTO {
    private List<TimeBlockScheduleDTO> timeBlocks;
    private List<CourseScheduleDTO> courses;
    
    // Constructors
    public CompleteScheduleDTO() {}
    
    public CompleteScheduleDTO(List<TimeBlockScheduleDTO> timeBlocks, List<CourseScheduleDTO> courses) {
        this.timeBlocks = timeBlocks;
        this.courses = courses;
    }
    
    // Getters and Setters
    public List<TimeBlockScheduleDTO> getTimeBlocks() {
        return timeBlocks;
    }
    
    public void setTimeBlocks(List<TimeBlockScheduleDTO> timeBlocks) {
        this.timeBlocks = timeBlocks;
    }
    
    public List<CourseScheduleDTO> getCourses() {
        return courses;
    }
    
    public void setCourses(List<CourseScheduleDTO> courses) {
        this.courses = courses;
    }
} 