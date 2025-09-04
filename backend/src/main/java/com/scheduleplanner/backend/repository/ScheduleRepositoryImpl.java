package com.scheduleplanner.backend.repository;

import com.scheduleplanner.backend.dto.TimeBlockScheduleDTO;
import com.scheduleplanner.backend.dto.CourseScheduleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ScheduleRepositoryImpl implements ScheduleRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Override
    public List<TimeBlockScheduleDTO> getTimeBlockSchedule() {
        String sql = "SELECT s.student_id as studentId, s.full_name as fullName, " +
                    "tb.title as timeBlockName, tb.start_time as timeBlockStartTime, " +
                    "tb.end_time as timeBlockEndTime, tb.day as timeBlockDay, " +
                    "tb.weeks as timeBlockWeeks, tb.description as timeBlockDescription " +
                    "FROM students s " +
                    "JOIN time_blocks tb ON s.student_id = tb.student_id " +
                    "ORDER BY s.student_id, tb.day, tb.start_time";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> 
            new TimeBlockScheduleDTO(
                rs.getInt("studentId"),
                rs.getString("fullName"),
                rs.getString("timeBlockName"),
                rs.getString("timeBlockStartTime"),
                rs.getString("timeBlockEndTime"),
                rs.getString("timeBlockDay"),
                rs.getInt("timeBlockWeeks"),
                rs.getString("timeBlockDescription")
            )
        );
    }
    
    @Override
    public List<CourseScheduleDTO> getCourseSchedule() {
        String sql = "SELECT s.student_id as studentId, s.full_name as fullName, " +
                    "ic.course_name as courseName, ic.course_code as courseCode, " +
                    "ic.course_number as courseNumber, ic.start_time as courseStartTime, " +
                    "ic.end_time as courseEndTime, ic.day as courseDay, " +
                    "ic.weeks as courseWeeks, l.name as courseLocationName, sc.enrolled as enrolled " +
                    "FROM students s " +
                    "JOIN students_courses sc ON s.student_id = sc.student_id " +
                    "JOIN instructors_courses ic ON sc.instructor_course_id = ic.instructor_course_id " +
                    "JOIN locations l ON ic.location_id = l.location_id " +
                    "ORDER BY s.student_id, ic.day, ic.start_time";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> 
            new CourseScheduleDTO(
                rs.getInt("studentId"),
                rs.getString("fullName"),
                rs.getString("courseName"),
                rs.getString("courseCode"),
                rs.getString("courseNumber"),
                rs.getString("courseStartTime"),
                rs.getString("courseEndTime"),
                rs.getString("courseDay"),
                rs.getInt("courseWeeks"),
                rs.getString("courseLocationName"),
                rs.getBoolean("enrolled")
            )
        );
    }
    
    @Override
    public List<TimeBlockScheduleDTO> getTimeBlockScheduleByStudent(Integer studentId) {
        String sql = "SELECT s.student_id as studentId, s.full_name as fullName, " +
                    "tb.title as timeBlockName, tb.start_time as timeBlockStartTime, " +
                    "tb.end_time as timeBlockEndTime, tb.day as timeBlockDay, " +
                    "tb.weeks as timeBlockWeeks, tb.description as timeBlockDescription " +
                    "FROM students s " +
                    "JOIN time_blocks tb ON s.student_id = tb.student_id " +
                    "WHERE s.student_id = ? " +
                    "ORDER BY tb.day, tb.start_time";
        
        return jdbcTemplate.query(sql, new Object[]{studentId}, (rs, rowNum) -> 
            new TimeBlockScheduleDTO(
                rs.getInt("studentId"),
                rs.getString("fullName"),
                rs.getString("timeBlockName"),
                rs.getString("timeBlockStartTime"),
                rs.getString("timeBlockEndTime"),
                rs.getString("timeBlockDay"),
                rs.getInt("timeBlockWeeks"),
                rs.getString("timeBlockDescription")
            )
        );
    }
    
    @Override
    public List<CourseScheduleDTO> getCourseScheduleByStudent(Integer studentId) {
        String sql = "SELECT s.student_id as studentId, s.full_name as fullName, " +
                    "ic.course_name as courseName, ic.course_code as courseCode, " +
                    "ic.course_number as courseNumber, ic.start_time as courseStartTime, " +
                    "ic.end_time as courseEndTime, ic.day as courseDay, " +
                    "ic.weeks as courseWeeks, l.name as courseLocationName, sc.enrolled as enrolled " +
                    "FROM students s " +
                    "JOIN students_courses sc ON s.student_id = sc.student_id " +
                    "JOIN instructors_courses ic ON sc.instructor_course_id = ic.instructor_course_id " +
                    "JOIN locations l ON ic.location_id = l.location_id " +
                    "WHERE s.student_id = ? " +
                    "ORDER BY s.student_id, ic.day, ic.start_time";
        
        return jdbcTemplate.query(sql, new Object[]{studentId}, (rs, rowNum) -> 
            new CourseScheduleDTO(
                rs.getInt("studentId"),
                rs.getString("fullName"),
                rs.getString("courseName"),
                rs.getString("courseCode"),
                rs.getString("courseNumber"),
                rs.getString("courseStartTime"),
                rs.getString("courseEndTime"),
                rs.getString("courseDay"),
                rs.getInt("courseWeeks"),
                rs.getString("courseLocationName"),
                rs.getBoolean("enrolled")
            )
        );
    }
    
    @Override
    public Integer getStudentIdByEmail(String email) {
        String sql = "SELECT student_id FROM students WHERE email = ?";
        
        try {
            return jdbcTemplate.queryForObject(sql, Integer.class, email);
        } catch (Exception e) {
            // Return null if student not found
            return null;
        }
    }
}