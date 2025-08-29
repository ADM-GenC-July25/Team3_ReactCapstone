package com.scheduleplanner.backend.dto;

import com.scheduleplanner.backend.model.Student;

public class LoginResponse {

    private String token;
    private String fullName;
    private String username;
    private String email;
    private Student.EventType eventType;
    private Integer timeBlockId;
    private Integer selectedCourseId;

    // Constructors
    public LoginResponse() {}

    public LoginResponse(String token, String fullName, String username, String email, Student.EventType eventType, Integer timeBlockId, Integer selectedCourseId) {
        this.token = token;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.eventType = eventType;
        this.timeBlockId = timeBlockId;
        this.selectedCourseId = selectedCourseId;
    }

    // Getters and Setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Student.EventType getEventType() {
        return eventType;
    }

    public void setEventType(Student.EventType eventType) {
        this.eventType = eventType;
    }

    public Integer getTimeBlockId() {
        return timeBlockId;
    }

    public void setTimeBlockId(Integer timeBlockId) {
        this.timeBlockId = timeBlockId;
    }

    public Integer getSelectedCourseId() {
        return selectedCourseId;
    }

    public void setSelectedCourseId(Integer selectedCourseId) {
        this.selectedCourseId = selectedCourseId;
    }
}