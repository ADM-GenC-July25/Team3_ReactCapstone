package com.scheduleplanner.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "instructors")
public class Instructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "instructor_id")
    private Integer instructorId;

    @Column(nullable = false)
    private String name;

    @Column
    private String email;

    @Column(name = "instructor_course_id")
    private Integer instructorCourseId;

    @Column
    private String department;

    @Column(name = "office_location")
    private String officeLocation;

    @Column
    private String phone;


    // Constructors
    public Instructor() {
    }

    public Instructor(String name, String email, Integer instructorCourseId, String department, String officeLocation, String phone) {
        this.name = name;
        this.email = email;
        this.instructorCourseId = instructorCourseId;
        this.department = department;
        this.officeLocation = officeLocation;
        this.phone = phone;
    }

    public Integer getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(Integer instructorId) {
        this.instructorId = instructorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getInstructorCourseId() {
        return instructorCourseId;
    }

    public void setInstructorCourseId(Integer instructorCourseId) {
        this.instructorCourseId = instructorCourseId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getOfficeLocation() {
        return officeLocation;
    }

    public void setOfficeLocation(String officeLocation) {
        this.officeLocation = officeLocation;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}