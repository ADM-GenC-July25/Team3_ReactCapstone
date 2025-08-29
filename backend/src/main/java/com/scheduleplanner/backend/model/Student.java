package com.scheduleplanner.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "students")
public class Student {

    public enum EventType {
        time_block, course
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer studentId;

    @NotBlank(message = "Student name is required")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotBlank(message = "Username is required")
    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @NotBlank(message = "Event type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Column(name = "time_block_id")
    private Integer timeBlockId;

    @Column(name = "selected_course_id")
    private Integer selectedCourseId;

    // Constructors
    public Student() {
    }

    public Student(Integer studentId, String fullName, String username, String email, String passwordHash, EventType eventType, Integer timeBlockId, Integer selectedCourseId) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.eventType = eventType;
        this.timeBlockId = timeBlockId;
        this.selectedCourseId = selectedCourseId;
    }

    // Getters and setters
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

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
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
