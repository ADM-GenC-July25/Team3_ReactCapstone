package com.scheduleplanner.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students_courses")
public class StudentCourse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "selected_course_id")
    private Integer selectedCourseId;
    
    @Column(name = "instructor_course_id")
    private Integer instructorCourseId;
    
    @Column(name = "student_id")
    private Integer studentId;
    
    @Column
    private Boolean enrolled;
    
    // Constructors
    public StudentCourse() {}
    
    // Getters and Setters
    public Integer getSelectedCourseId() {
        return selectedCourseId;
    }
    
    public void setSelectedCourseId(Integer selectedCourseId) {
        this.selectedCourseId = selectedCourseId;
    }
    
    public Integer getInstructorCourseId() {
        return instructorCourseId;
    }
    
    public void setInstructorCourseId(Integer instructorCourseId) {
        this.instructorCourseId = instructorCourseId;
    }
    
    public Integer getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }
    
    public Boolean getEnrolled() {
        return enrolled;
    }
    
    public void setEnrolled(Boolean enrolled) {
        this.enrolled = enrolled;
    }
} 