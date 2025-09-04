package com.scheduleplanner.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalTime;

public class TimeBlockDTO {
    
    private Long timeBlockId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotNull(message = "Start time is required")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime startTime;
    
    @NotNull(message = "End time is required")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;
    
    @NotNull(message = "Day is required")
    private String day; // String for easier JSON handling, will be converted to enum
    
    @NotBlank(message = "Type is required")
    private String type;
    
    private Integer weeks;
    
    private String description;
    
    private String color;
    
    private Long studentId;
    
    // Constructors
    public TimeBlockDTO() {}
    
    public TimeBlockDTO(TimeBlock timeBlock) {
        this.timeBlockId = timeBlock.getTimeBlockId();
        this.title = timeBlock.getTitle();
        this.startTime = timeBlock.getStartTime();
        this.endTime = timeBlock.getEndTime();
        this.day = timeBlock.getDay() != null ? timeBlock.getDay().name() : null;
        this.type = timeBlock.getType();
        this.weeks = timeBlock.getWeeks();
        this.description = timeBlock.getDescription();
        this.color = timeBlock.getColor();
        this.studentId = timeBlock.getStudentId();
    }
    
    // Convert DTO to Entity
    public TimeBlock toEntity() {
        TimeBlock timeBlock = new TimeBlock();
        timeBlock.setTimeBlockId(this.timeBlockId);
        timeBlock.setTitle(this.title);
        timeBlock.setStartTime(this.startTime);
        timeBlock.setEndTime(this.endTime);
        if (this.day != null) {
            timeBlock.setDay(TimeBlock.DayOfWeek.valueOf(this.day));
        }
        timeBlock.setType(this.type);
        timeBlock.setWeeks(this.weeks);
        timeBlock.setDescription(this.description);
        timeBlock.setColor(this.color);
        timeBlock.setStudentId(this.studentId);
        return timeBlock;
    }
    
    // Getters and Setters
    public Long getTimeBlockId() {
        return timeBlockId;
    }
    
    public void setTimeBlockId(Long timeBlockId) {
        this.timeBlockId = timeBlockId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public LocalTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
    
    public String getDay() {
        return day;
    }
    
    public void setDay(String day) {
        this.day = day;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Integer getWeeks() {
        return weeks;
    }
    
    public void setWeeks(Integer weeks) {
        this.weeks = weeks;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    // Legacy compatibility
    public Long getId() {
        return timeBlockId;
    }
    
    public void setId(Long id) {
        this.timeBlockId = id;
    }
} 