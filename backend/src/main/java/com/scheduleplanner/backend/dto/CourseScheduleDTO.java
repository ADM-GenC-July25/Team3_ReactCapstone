package com.scheduleplanner.backend.dto;

public class CourseScheduleDTO {
    private Integer studentId;
    private String fullName;
    private String courseName;
    private String courseCode;
    private String courseNumber;
    private String courseStartTime;
    private String courseEndTime;
    private String courseDay;
    private Integer courseWeeks;
    private String courseLocationName;
    private Boolean enrolled;

    // Constructors
    public CourseScheduleDTO() {}

    public CourseScheduleDTO(Integer studentId, String fullName, String courseName,
                             String courseCode, String courseNumber, String courseStartTime,
                             String courseEndTime, String courseDay, Integer courseWeeks,
                             String courseLocationName, Boolean enrolled) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.courseNumber = courseNumber;
        this.courseStartTime = courseStartTime;
        this.courseEndTime = courseEndTime;
        this.courseDay = courseDay;
        this.courseWeeks = courseWeeks;
        this.courseLocationName = courseLocationName;
        this.enrolled = enrolled;
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

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getCourseNumber() {
        return courseNumber;
    }

    public void setCourseNumber(String courseNumber) {
        this.courseNumber = courseNumber;
    }

    public String getCourseStartTime() {
        return courseStartTime;
    }

    public void setCourseStartTime(String courseStartTime) {
        this.courseStartTime = courseStartTime;
    }

    public String getCourseEndTime() {
        return courseEndTime;
    }

    public void setCourseEndTime(String courseEndTime) {
        this.courseEndTime = courseEndTime;
    }

    public String getCourseDay() {
        return courseDay;
    }

    public void setCourseDay(String courseDay) {
        this.courseDay = courseDay;
    }

    public Integer getCourseWeeks() {
        return courseWeeks;
    }

    public void setCourseWeeks(Integer courseWeeks) {
        this.courseWeeks = courseWeeks;
    }

    public String getCourseLocationName() {
        return courseLocationName;
    }

    public void setCourseLocationName(String courseLocationName) {
        this.courseLocationName = courseLocationName;
    }

    public Boolean getEnrolled() {
        return enrolled;
    }

    public void setEnrolled(Boolean enrolled) {
        this.enrolled = enrolled;
    }
}