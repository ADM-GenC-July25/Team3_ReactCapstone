package com.scheduleplanner.backend.dto;

public class AddToCartRequest {

    private Integer studentId;
    private String itemType; // "course" or "timeblock"
    private Integer instructorCourseId; // Required if itemType is "course"
    private Integer timeBlockId; // Required if itemType is "timeblock"

    // For creating new time blocks
    private String title;
    private String startTime;
    private String endTime;
    private String day;
    private Integer weeks;
    private String description;

    // Constructors
    public AddToCartRequest() {}

    public AddToCartRequest(Integer studentId, String itemType, Integer instructorCourseId,
                            String title, String startTime, String endTime, String day,
                            Integer weeks, String description) {
        this.studentId = studentId;
        this.itemType = itemType;
        this.instructorCourseId = instructorCourseId;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.day = day;
        this.weeks = weeks;
        this.description = description;
    }

    // Getters and Setters
    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public Integer getInstructorCourseId() {
        return instructorCourseId;
    }

    public void setInstructorCourseId(Integer instructorCourseId) {
        this.instructorCourseId = instructorCourseId;
    }

    public Integer getTimeBlockId() {
        return timeBlockId;
    }

    public void setTimeBlockId(Integer timeBlockId) {
        this.timeBlockId = timeBlockId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
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
}