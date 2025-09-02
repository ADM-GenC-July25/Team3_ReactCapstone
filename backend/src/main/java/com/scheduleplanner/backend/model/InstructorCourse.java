package com.scheduleplanner.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "instructors_courses")
public class InstructorCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "instructor_course_id")
    private Integer instructorCourseId;

    @Column(name = "course_name", nullable = false)
    private String courseName;

    @Column(name = "course_code")
    private String courseCode;

    @Column(name = "course_number")
    private String courseNumber;

    @Column
    private String section;

    @Column
    private String description;

    @Column(name = "instructor_id")
    private Integer instructorId;

    @Column(name = "location_id")
    private Integer locationId;

    @Column(name = "start_time", nullable = false)
    private String startTime;

    @Column(name = "end_time", nullable = false)
    private String endTime;

    @Column(nullable = false)
    private String day;

    @Column
    private Integer weeks;

    @Column(name = "seats_total")
    private Integer seatsTotal;

    @Column(name = "seats_open")
    private Integer seatsOpen;

    @Column(name = "waitlist_capacity")
    private Integer waitlistCapacity;

    @Column(name = "waitlist_open")
    private Integer waitlistOpen;

    @Column
    private Integer credits;

    // Constructors
    public InstructorCourse() {}

    // Getters and Setters
    public Integer getInstructorCourseId() {
        return instructorCourseId;
    }

    public void setInstructorCourseId(Integer instructorCourseId) {
        this.instructorCourseId = instructorCourseId;
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

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(Integer instructorId) {
        this.instructorId = instructorId;
    }

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
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

    public Integer getSeatsTotal() {
        return seatsTotal;
    }

    public void setSeatsTotal(Integer seatsTotal) {
        this.seatsTotal = seatsTotal;
    }

    public Integer getSeatsOpen() {
        return seatsOpen;
    }

    public void setSeatsOpen(Integer seatsOpen) {
        this.seatsOpen = seatsOpen;
    }

    public Integer getWaitlistCapacity() {
        return waitlistCapacity;
    }

    public void setWaitlistCapacity(Integer waitlistCapacity) {
        this.waitlistCapacity = waitlistCapacity;
    }

    public Integer getWaitlistOpen() {
        return waitlistOpen;
    }

    public void setWaitlistOpen(Integer waitlistOpen) {
        this.waitlistOpen = waitlistOpen;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }
}