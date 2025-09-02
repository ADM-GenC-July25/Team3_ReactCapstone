package com.scheduleplanner.backend.service;

import com.scheduleplanner.backend.dto.CartItemDTO;
import com.scheduleplanner.backend.dto.CartResponse;
import com.scheduleplanner.backend.dto.ConflictDTO;
import com.scheduleplanner.backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    /**
     * Process cart items - check conflicts and add to schedule if no conflicts
     * @param studentId The student ID
     * @param cartItems List of items to add to schedule
     * @return CartResponse with success status and any conflicts
     */
    public CartResponse processCartItems(Integer studentId, List<CartItemDTO> cartItems) {
        try {
            // Check for conflicts
            List<ConflictDTO> conflicts = cartRepository.checkScheduleConflicts(studentId, cartItems);

            if (!conflicts.isEmpty()) {
                CartResponse response = new CartResponse(false, "Conflicts detected. Cannot add items to schedule.");
                response.setConflicts(conflicts);
                return response;
            }

            // Add items to schedule
            int successCount = 0;
            int failCount = 0;

            for (CartItemDTO item : cartItems) {
                boolean success = false;

                if ("course".equals(item.getItemType())) {
                    success = cartRepository.addCourseToSchedule(studentId, item.getItemId());
                } else if ("timeblock".equals(item.getItemType())) {
                    success = cartRepository.addTimeBlockToSchedule(
                            studentId,
                            item.getName(),
                            item.getStartTime(),
                            item.getEndTime(),
                            item.getDay(),
                            15, // Default weeks
                            item.getDescription()
                    );
                }

                if (success) {
                    successCount++;
                } else {
                    failCount++;
                }
            }

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
     * Get schedule items for a student
     * @param studentId The student ID
     * @return CartResponse with schedule items
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
     * @param studentId The student ID
     * @param cartItems List of items to check
     * @return CartResponse with conflicts
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