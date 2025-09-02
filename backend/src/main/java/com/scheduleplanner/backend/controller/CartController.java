package com.scheduleplanner.backend.controller;

import com.scheduleplanner.backend.dto.CartItemDTO;
import com.scheduleplanner.backend.dto.CartResponse;
import com.scheduleplanner.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * Process cart items - add to schedule if no conflicts
     * POST /api/cart/process
     */
    @PostMapping("/process")
    public ResponseEntity<CartResponse> processCartItems(@RequestParam Integer studentId,
                                                         @RequestBody List<CartItemDTO> cartItems) {
        try {
            CartResponse response = cartService.processCartItems(studentId, cartItems);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

        } catch (Exception e) {
            CartResponse errorResponse = new CartResponse(false, "Error processing cart items: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get schedule items for a student
     * GET /api/cart/schedule/{studentId}
     */
    @GetMapping("/schedule/{studentId}")
    public ResponseEntity<CartResponse> getScheduleItems(@PathVariable Integer studentId) {
        try {
            CartResponse response = cartService.getScheduleItems(studentId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CartResponse errorResponse = new CartResponse(false, "Error retrieving schedule items: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Check for conflicts in cart items
     * POST /api/cart/check-conflicts
     */
    @PostMapping("/check-conflicts")
    public ResponseEntity<CartResponse> checkConflicts(@RequestParam Integer studentId,
                                                       @RequestBody List<CartItemDTO> cartItems) {
        try {
            CartResponse response = cartService.checkConflicts(studentId, cartItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            CartResponse errorResponse = new CartResponse(false, "Error checking conflicts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}