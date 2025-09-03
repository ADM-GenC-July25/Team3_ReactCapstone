package com.scheduleplanner.backend.service;

import com.scheduleplanner.backend.dto.CartItemDTO;
import com.scheduleplanner.backend.dto.CartResponse;
import com.scheduleplanner.backend.dto.ConflictDTO;
import com.scheduleplanner.backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class CartService {
	
	private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartRepository cartRepository;

    /**
     * Process cart items - check conflicts and add to schedule if no conflicts
     */
    public CartResponse processCartItems(Integer studentId, List<CartItemDTO> cartItems) {
        try {
            // Check for conflicts
            List<ConflictDTO> conflicts = cartRepository.checkScheduleConflicts(studentId, cartItems);
            logger.info("Conflict check result: {} conflicts found", conflicts.size());

            if (!conflicts.isEmpty()) {
            	logger.warn("Conflicts detected: {}", conflicts);
                CartResponse response = new CartResponse(false, "Conflicts detected. Cannot add items to schedule.");
                response.setConflicts(conflicts);
                return response;
            }

            // Add items to schedule
            int successCount = 0;
            int failCount = 0;

            for (CartItemDTO item : cartItems) {
            	logger.info("Processing item: {} - {}", item.getItemType(), item.getName());
                boolean success = false;

                if ("course".equals(item.getItemType())) {
                    // For courses with multiple days, we need to add each day separately
                	logger.info("Adding course with days: {}", item.getDays());
                    success = addCourseWithMultipleDays(studentId, item);
                } else if ("timeblock".equals(item.getItemType())) {
                    // For time blocks, we need to add each day as a separate record
                	logger.info("Adding time block with days: {}", item.getDays());
                    success = addTimeBlockWithMultipleDays(studentId, item);
                }
                
                logger.info("Item {} result: {}", item.getName(), success ? "SUCCESS" : "FAILED");

                if (success) {
                    successCount++;
                } else {
                    failCount++;
                }
            }
            
            String message = "Added " + successCount + " items, failed to add " + failCount + " items.";
            logger.info("Final result: {}", message);

            if (failCount == 0) {
                return new CartResponse(true, "All " + successCount + " items added to schedule successfully.");
            } else {
                return new CartResponse(false, "Added " + successCount + " items, failed to add " + failCount + " items.");
            }

        } catch (Exception e) {
            return new CartResponse(false, "Error processing cart items: " + e.getMessage());
        }
    }

    /**
     * Add a course with multiple days to the schedule
     */
    private boolean addCourseWithMultipleDays(Integer studentId, CartItemDTO course) {
        try {
        	logger.info("Adding course {} for student {} on days: {}", course.getName(), studentId, course.getDays());
            boolean allSuccess = true;

            // For each day, find the corresponding instructor_course_id and add to students_courses
            for (String day : course.getDays()) {
            	logger.info("Processing day: {} for course: {}", day, course.getName());
            	
                // Find the instructor_course_id for this course on this specific day
                Integer instructorCourseId = cartRepository.findInstructorCourseId(
                    course.getName(), day, course.getStartTime(), course.getEndTime());
                
                logger.info("Found instructor_course_id: {} for course {} on {}", 
                        instructorCourseId, course.getName(), day);
                
                if (instructorCourseId != null) {
                    boolean success = cartRepository.addCourseToSchedule(studentId, instructorCourseId);
                    logger.info("Add course to schedule result: {}", success);
                    if (!success) {
                        allSuccess = false;
                    }
                } else {
                	logger.error("Could not find instructor_course_id for course {} on day {}", 
                            course.getName(), day);
                    allSuccess = false;
                }
            }

            logger.info("Course {} addition result: {}", course.getName(), allSuccess);
            return allSuccess;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Find the instructor_course_id for a course on a specific day
     * This is a simplified version - you might need to implement this in the repository
     */
    private Integer findInstructorCourseId(Integer baseCourseId, String day) {
        // This is a simplified mapping based on your data
        // You might need to implement a proper database query for this
        
        // Based on your data:
        // Course 1 (CS 101) on Monday = instructor_course_id 1
        // Course 1 (CS 101) on Wednesday = instructor_course_id 4
        // Course 2 (MT 201) on Tuesday = instructor_course_id 2
        // Course 3 (EN 301) on Wednesday = instructor_course_id 3
        
        if (baseCourseId == 1) {
            if ("Monday".equals(day)) {
                return 1;
            } else if ("Wednesday".equals(day)) {
                return 4;
            }
        } else if (baseCourseId == 2) {
            if ("Tuesday".equals(day)) {
                return 2;
            }
        } else if (baseCourseId == 3) {
            if ("Wednesday".equals(day)) {
                return 3;
            }
        }
        
        return null;
    }

    /**
     * Add a time block with multiple days to the schedule
     */
    private boolean addTimeBlockWithMultipleDays(Integer studentId, CartItemDTO timeBlock) {
        try {
        	logger.info("Adding time block {} for student {} on days: {}", 
                    timeBlock.getName(), studentId, timeBlock.getDays());
            boolean allSuccess = true;

            // Add each day as a separate time block record
            for (String day : timeBlock.getDays()) {
            	logger.info("Processing time block day: {} for: {}", day, timeBlock.getName());
            	
                boolean success = cartRepository.addTimeBlockToSchedule(
                        studentId,
                        timeBlock.getName(),
                        timeBlock.getStartTime(),
                        timeBlock.getEndTime(),
                        day,
                        15, // Default weeks
                        timeBlock.getDescription()
                );

                logger.info("Add time block result for day {}: {}", day, success);
                if (!success) {
                    allSuccess = false;
                }
            }

            logger.info("Time block {} addition result: {}", timeBlock.getName(), allSuccess);
            return allSuccess;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get schedule items for a student
     */
    public CartResponse getScheduleItems(Integer studentId) {
        try {
            List<CartItemDTO> scheduleItems = cartRepository.getScheduleItems(studentId);
            return new CartResponse(true, "Schedule items retrieved successfully.", scheduleItems);
        } catch (Exception e) {
            return new CartResponse(false, "Error retrieving schedule items: " + e.getMessage());
        }
    }

    /**
     * Check for conflicts in a list of items
     */
    public CartResponse checkConflicts(Integer studentId, List<CartItemDTO> cartItems) {
        try {
            List<ConflictDTO> conflicts = cartRepository.checkScheduleConflicts(studentId, cartItems);

            if (conflicts.isEmpty()) {
                return new CartResponse(true, "No conflicts detected.");
            } else {
                CartResponse response = new CartResponse(false, "Conflicts detected.");
                response.setConflicts(conflicts);
                return response;
            }

        } catch (Exception e) {
            return new CartResponse(false, "Error checking conflicts: " + e.getMessage());
        }
    }
}