package com.scheduleplanner.backend.repository;

import com.scheduleplanner.backend.dto.CartItemDTO;
import com.scheduleplanner.backend.dto.ConflictDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class CartRepositoryImpl implements CartRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public boolean addCourseToSchedule(Integer studentId, Integer instructorCourseId) {
        // Check if student has already enrolled in the course
        String checkSql = "SELECT COUNT(*) FROM students_courses WHERE student_id = ? AND instructor_course_id = ? AND enrolled = true";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, studentId, instructorCourseId);

        // Already enrolled
        if (count > 0) {
            return false;
        }

        // Add course to students_courses (enrolled = true)
        String sql = "INSERT INTO students_courses (student_id, instructor_course_id, enrolled) VALUES (?, ?, true)";
        int rowsAffected = jdbcTemplate.update(sql, studentId, instructorCourseId);
        return rowsAffected > 0;
    }

    @Override
    public boolean addTimeBlockToSchedule(Integer studentId, String title, String startTime,
                                          String endTime, String day, Integer weeks, String description) {
        // Add time blocks to students_courses (enrolled = true)
        String sql = "INSERT INTO time_blocks (title, start_time, end_time, day, weeks, description, student_id) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        int rowsAffected = jdbcTemplate.update(sql, title, startTime, endTime, day, weeks, description, studentId);
        return rowsAffected > 0;
    }

    @Override
    public List<ConflictDTO> checkScheduleConflicts(Integer studentId, List<CartItemDTO> newItems) {
        List<ConflictDTO> allConflicts = new ArrayList<>();

        // Get existing schedule items
        List<CartItemDTO> existingItems = getScheduleItems(studentId);

        // Check each new item against existing items
        for (CartItemDTO newItem : newItems) {
            List<ConflictDTO> itemConflicts = checkItemConflicts(studentId, newItem);
            allConflicts.addAll(itemConflicts);
        }

        // Check conflicts between new items themselves
        for (int i = 0; i < newItems.size(); i++) {
            for (int j = i + 1; j < newItems.size(); j++) {
                if (hasTimeConflict(newItems.get(i), newItems.get(j))) {
                    ConflictDTO conflict = createConflictDTO(newItems.get(i), newItems.get(j));
                    allConflicts.add(conflict);
                }
            }
        }

        return allConflicts;
    }

    @Override
    public List<ConflictDTO> checkItemConflicts(Integer studentId, CartItemDTO newItem) {
        List<ConflictDTO> conflicts = new ArrayList<>();

        // Get existing schedule items
        List<CartItemDTO> existingItems = getScheduleItems(studentId);

        // Check new item against existing items
        for (CartItemDTO existingItem : existingItems) {
            if (hasTimeConflict(newItem, existingItem)) {
                ConflictDTO conflict = createConflictDTO(newItem, existingItem);
                conflicts.add(conflict);
            }
        }

        return conflicts;
    }

    @Override
    public List<CartItemDTO> getEnrolledCourses(Integer studentId) {
        String sql = "SELECT sc.instructor_course_id as itemId, 'course' as itemType, " +
                "ic.course_name as name, ic.start_time as startTime, ic.end_time as endTime, " +
                "ic.day as day, ic.description as description, " +
                "i.name as instructor, l.name as location, " +
                "ic.seats_open as seatsOpen, ic.credits as credits " +
                "FROM students_courses sc " +
                "JOIN instructors_courses ic ON sc.instructor_course_id = ic.instructor_course_id " +
                "LEFT JOIN instructors i ON ic.instructor_id = i.instructor_id " +
                "LEFT JOIN locations l ON ic.location_id = l.location_id " +
                "WHERE sc.student_id = ? AND sc.enrolled = true " +
                "ORDER BY ic.day, ic.start_time";

        return jdbcTemplate.query(sql, new Object[]{studentId}, (rs, rowNum) -> {
            CartItemDTO dto = new CartItemDTO();
            dto.setItemId(rs.getInt("itemId"));
            dto.setItemType(rs.getString("itemType"));
            dto.setName(rs.getString("name"));
            dto.setStartTime(rs.getString("startTime"));
            dto.setEndTime(rs.getString("endTime"));
            dto.setDay(rs.getString("day"));
            dto.setDescription(rs.getString("description"));
            dto.setInstructor(rs.getString("instructor"));
            dto.setLocation(rs.getString("location"));
            dto.setSeatsOpen(rs.getInt("seatsOpen"));
            dto.setCredits(rs.getInt("credits"));
            return dto;
        });
    }

    @Override
    public List<CartItemDTO> getTimeBlocks(Integer studentId) {
        String sql = "SELECT tb.time_block_id as itemId, 'timeblock' as itemType, " +
                "tb.title as name, tb.start_time as startTime, tb.end_time as endTime, " +
                "tb.day as day, tb.description as description " +
                "FROM time_blocks tb " +
                "WHERE tb.student_id = ? " +
                "ORDER BY tb.day, tb.start_time";

        return jdbcTemplate.query(sql, new Object[]{studentId}, (rs, rowNum) -> {
            CartItemDTO dto = new CartItemDTO();
            dto.setItemId(rs.getInt("itemId"));
            dto.setItemType(rs.getString("itemType"));
            dto.setName(rs.getString("name"));
            dto.setStartTime(rs.getString("startTime"));
            dto.setEndTime(rs.getString("endTime"));
            dto.setDay(rs.getString("day"));
            dto.setDescription(rs.getString("description"));
            return dto;
        });
    }

    @Override
    public List<CartItemDTO> getScheduleItems(Integer studentId) {
        List<CartItemDTO> scheduleItems = new ArrayList<>();
        scheduleItems.addAll(getEnrolledCourses(studentId));
        scheduleItems.addAll(getTimeBlocks(studentId));
        return scheduleItems;
    }

    // Helper method to check if two items have time conflicts
    private boolean hasTimeConflict(CartItemDTO item1, CartItemDTO item2) {
        // Check if items are on the same day
        if (!item1.getDay().equals(item2.getDay())) {
            return false;
        }

        // Check for time overlap
        String start1 = item1.getStartTime();
        String end1 = item1.getEndTime();
        String start2 = item2.getStartTime();
        String end2 = item2.getEndTime();

        // Convert time strings to minutes for comparison
        int start1Minutes = timeToMinutes(start1);
        int end1Minutes = timeToMinutes(end1);
        int start2Minutes = timeToMinutes(start2);
        int end2Minutes = timeToMinutes(end2);

        // Check for overlap: start1 < end2 AND start2 < end1
        return (start1Minutes < end2Minutes && start2Minutes < end1Minutes);
    }

    // Helper method to convert time string to minutes
    private int timeToMinutes(String time) {
        String[] parts = time.split(":");
        int hours = Integer.parseInt(parts[0]);
        int minutes = Integer.parseInt(parts[1]);
        return hours * 60 + minutes;
    }

    // Helper method to create conflict DTO
    private ConflictDTO createConflictDTO(CartItemDTO item1, CartItemDTO item2) {
        ConflictDTO conflict = new ConflictDTO();
        conflict.setItemType(item1.getItemType());
        conflict.setItemId(item1.getItemId());
        conflict.setItemName(item1.getName());
        conflict.setConflictingItemType(item2.getItemType());
        conflict.setConflictingItemId(item2.getItemId());
        conflict.setConflictingItemName(item2.getName());
        conflict.setDay(item1.getDay());
        conflict.setTimeRange(item1.getStartTime() + " - " + item1.getEndTime());
        conflict.setConflictType("overlap");
        conflict.setSeverity("high");
        conflict.setMessage("Time conflict detected between " + item1.getName() + " and " + item2.getName());
        return conflict;
    }
}