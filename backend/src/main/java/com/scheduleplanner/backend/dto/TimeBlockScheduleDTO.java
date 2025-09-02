package com.scheduleplanner.backend.dto;

public class TimeBlockScheduleDTO {
    private Integer studentId;
    private String fullName;
    private String timeBlockName;
    private String timeBlockStartTime;
    private String timeBlockEndTime;
    private String timeBlockDay;
    private Integer timeBlockWeeks;
    private String timeBlockDescription;

    // Constructors
    public TimeBlockScheduleDTO() {}

    public TimeBlockScheduleDTO(Integer studentId, String fullName, String timeBlockName,
                                String timeBlockStartTime, String timeBlockEndTime,
                                String timeBlockDay, Integer timeBlockWeeks, String timeBlockDescription) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.timeBlockName = timeBlockName;
        this.timeBlockStartTime = timeBlockStartTime;
        this.timeBlockEndTime = timeBlockEndTime;
        this.timeBlockDay = timeBlockDay;
        this.timeBlockWeeks = timeBlockWeeks;
        this.timeBlockDescription = timeBlockDescription;
    }

    // Getters and Setters
    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getTimeBlockName() {
        return timeBlockName;
    }

    public void setTimeBlockName(String timeBlockName) {
        this.timeBlockName = timeBlockName;
    }

    public String getTimeBlockStartTime() {
        return timeBlockStartTime;
    }

    public void setTimeBlockStartTime(String timeBlockStartTime) {
        this.timeBlockStartTime = timeBlockStartTime;
    }

    public String getTimeBlockEndTime() {
        return timeBlockEndTime;
    }

    public void setTimeBlockEndTime(String timeBlockEndTime) {
        this.timeBlockEndTime = timeBlockEndTime;
    }

    public String getTimeBlockDay() {
        return timeBlockDay;
    }

    public void setTimeBlockDay(String timeBlockDay) {
        this.timeBlockDay = timeBlockDay;
    }

    public Integer getTimeBlockWeeks() {
        return timeBlockWeeks;
    }

    public void setTimeBlockWeeks(Integer timeBlockWeeks) {
        this.timeBlockWeeks = timeBlockWeeks;
    }

    public String getTimeBlockDescription() {
        return timeBlockDescription;
    }

    public void setTimeBlockDescription(String timeBlockDescription) {
        this.timeBlockDescription = timeBlockDescription;
    }
}