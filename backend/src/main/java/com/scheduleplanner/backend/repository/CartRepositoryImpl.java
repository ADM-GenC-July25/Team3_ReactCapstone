package com.scheduleplanner.backend.repository;

import com.scheduleplanner.backend.dto.CartItemDTO;
import com.scheduleplanner.backend.dto.ConflictDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class CartRepositoryImpl implements CartRepository {
	
	private static final Logger logger = LoggerFactory.getLogger(CartRepositoryImpl.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public boolean addCourseToSchedule(Integer studentId, Integer instructorCourseId) {
    	try {
            logger.info("Adding course to schedule - studentId: {}, instructorCourseId: {}", 
                studentId, instructorCourseId);
            
            // Check if student has already enrolled in the course
            String checkSql = "SELECT COUNT(*) FROM students_courses WHERE student_id = ? AND instructor_course_id = ? AND enrolled = true";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, studentId, instructorCourseId);
            logger.info("Existing enrollment count: {}", count);

            if (count > 0) {
                logger.warn("Student {} already enrolled in course {}", studentId, instructorCourseId);
                return false; // Already enrolled
            }

            // Add course to students_courses (enrolled = true)
            String sql = "INSERT INTO students_courses (student_id, instructor_course_id, enrolled) VALUES (?, ?, true)";
            int rowsAffected = jdbcTemplate.update(sql, studentId, instructorCourseId);
            logger.info("Insert result - rows affected: {}", rowsAffected);
            
            return rowsAffected > 0;
        } catch (Exception e) {
            logger.error("Error adding course to schedule: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean addTimeBlockToSchedule(Integer studentId, String title, String startTime,
                                          String endTime, String day, Integer weeks, String description) {
    	try {
            logger.info("Adding time block - studentId: {}, title: {}, startTime: {}, endTime: {}, day: {}, weeks: {}, description: {}", 
                studentId, title, startTime, endTime, day, weeks, description);
            
            // Check if student exists
            String checkStudentSql = "SELECT COUNT(*) FROM students WHERE student_id = ?";
            Integer studentCount = jdbcTemplate.queryForObject(checkStudentSql, Integer.class, studentId);
            logger.info("Student {} exists: {}", studentId, studentCount > 0);
            
            if (studentCount == 0) {
                logger.error("Student {} does not exist", studentId);
                return false;
            }
            
            // Add time block to time_blocks table
            String sql = "INSERT INTO time_blocks (title, start_time, end_time, day, weeks, description, student_id) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            logger.info("Executing SQL: {}", sql);
            logger.info("Parameters: title={}, startTime={}, endTime={}, day={}, weeks={}, description={}, studentId={}", 
                title, startTime, endTime, day, weeks, description, studentId);
            
            int rowsAffected = jdbcTemplate.update(sql, title, startTime, endTime, day, weeks, description, studentId);
            logger.info("Time block insert result - rows affected: {}", rowsAffected);
            
            return rowsAffected > 0;
        } catch (Exception e) {
            logger.error("Error adding time block: {}", e.getMessage(), e);
            return false;
        }
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
                "ORDER BY ic.instructor_course_id, ic.day, ic.start_time";
    	
    	 // Get all rows from database
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, studentId);
        
        // Group by instructor_course_id to combine multiple days
        Map<Integer, CartItemDTO> courseMap = new LinkedHashMap<>();

        for (Map<String, Object> row : rows) {
            Integer itemId = (Integer) row.get("itemId");
            String day = (String) row.get("day");
            
            if (courseMap.containsKey(itemId)) {
                // Add day to existing course
                CartItemDTO existingCourse = courseMap.get(itemId);
                existingCourse.getDays().add(day);
            } else {
                // Create new course
                CartItemDTO course = new CartItemDTO();
                course.setItemId(itemId);
                course.setItemType((String) row.get("itemType"));
                course.setName((String) row.get("name"));
                course.setStartTime((String) row.get("startTime"));
                course.setEndTime((String) row.get("endTime"));
                course.setDays(new ArrayList<>(Arrays.asList(day)));
                course.setDescription((String) row.get("description"));
                course.setInstructor((String) row.get("instructor"));
                course.setLocation((String) row.get("location"));
                course.setSeatsOpen((Integer) row.get("seatsOpen"));
                course.setCredits((Integer) row.get("credits"));
                courseMap.put(itemId, course);
            }
        }
        
        return new ArrayList<>(courseMap.values());
    }

    @Override
    public List<CartItemDTO> getTimeBlocks(Integer studentId) {
    	String sql = "SELECT tb.time_block_id as itemId, 'timeblock' as itemType, " +
                "tb.title as name, tb.start_time as startTime, tb.end_time as endTime, " +
                "tb.day as day, tb.description as description " +
                "FROM time_blocks tb " +
                "WHERE tb.student_id = ? " +
                "ORDER BY tb.time_block_id, tb.day, tb.start_time";
    	
    	// Get all rows from database
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, studentId);
        
        // Group by time_block_id to combine multiple days
        Map<Integer, CartItemDTO> timeBlockMap = new LinkedHashMap<>();
        
        for (Map<String, Object> row : rows) {
            Integer itemId = (Integer) row.get("itemId");
            String day = (String) row.get("day");
            
            if (timeBlockMap.containsKey(itemId)) {
                // Add day to existing time block
            	CartItemDTO existingTimeBlock = timeBlockMap.get(itemId);
                existingTimeBlock.getDays().add(day);
            } else {
                // Create new time block
            	CartItemDTO timeBlock = new CartItemDTO();
                timeBlock.setItemId(itemId);
                timeBlock.setItemType((String) row.get("itemType"));
                timeBlock.setName((String) row.get("name"));
                timeBlock.setStartTime((String) row.get("startTime"));
                timeBlock.setEndTime((String) row.get("endTime"));
                timeBlock.setDays(new ArrayList<>(Arrays.asList(day)));
                timeBlock.setDescription((String) row.get("description"));
                timeBlockMap.put(itemId, timeBlock);
            }
        }
        
        return new ArrayList<>(timeBlockMap.values());
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
        // Get days for both items
        List<String> days1 = item1.getDays();
        List<String> days2 = item2.getDays();
        
        // Check if items have any common days
        List<String> commonDays = days1.stream()
            .filter(days2::contains)
            .collect(Collectors.toList());
        
        if (commonDays.isEmpty()) {
            return false; // No common days, no conflict
        }

        // Check for time overlap on common days
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
    
    // Helper method to create conflict DTO - FIXED METHOD
    private ConflictDTO createConflictDTO(CartItemDTO item1, CartItemDTO item2) {  
        ConflictDTO conflict = new ConflictDTO();  
        conflict.setItemType(item1.getItemType());
        conflict.setItemId(item1.getItemId());
        conflict.setItemName(item1.getName());  
        conflict.setConflictingItemType(item2.getItemType());
        conflict.setConflictingItemId(item2.getItemId());
        conflict.setConflictingItemName(item2.getName());  
        
        // Find the conflicting day
        List<String> commonDays = item1.getDays().stream()
            .filter(item2.getDays()::contains)
            .collect(Collectors.toList());
        conflict.setDay(commonDays.isEmpty() ? "Unknown" : commonDays.get(0));
        
        conflict.setTimeRange(item1.getStartTime() + " - " + item1.getEndTime());
        conflict.setConflictType("overlap");
        conflict.setSeverity("high");
        conflict.setMessage("Time conflict detected between " + item1.getName() + " and " + item2.getName());
        return conflict;
    }

    @Override
    public Integer findInstructorCourseId(String courseName, String day, String startTime, String endTime) {
    	String sql = "SELECT instructor_course_id FROM instructors_courses " +
                "WHERE course_name = ? AND day = ? AND start_time = ? AND end_time = ?";
    	
//    	String sql = "SELECT instructor_course_id FROM instructors_courses " +
//                "WHERE course_name = ?";
    
	    try {
	        logger.info("Finding instructor_course_id for: course={}, day={}, start={}, end={}", 
	            courseName, day, startTime, endTime);
	        
	        Integer result = jdbcTemplate.queryForObject(sql, Integer.class, courseName, day, startTime, endTime);
	        logger.info("Found instructor_course_id: {}", result);
	        return result;
	    } catch (Exception e) {
	        logger.error("Error finding instructor_course_id: {}", e.getMessage(), e);
	        return null;
	    }
    }
}