package com.scheduleplanner.backend.dto;

import java.util.List;

public class CartResponse {

    private boolean success;
    private String message;
    private List<CartItemDTO> cartItems;
    private List<ConflictDTO> conflicts;
    private int totalItems;

    // Constructors
    public CartResponse() {}

    public CartResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public CartResponse(boolean success, String message, List<CartItemDTO> cartItems) {
        this.success = success;
        this.message = message;
        this.cartItems = cartItems;
        this.totalItems = cartItems != null ? cartItems.size() : 0;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<CartItemDTO> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItemDTO> cartItems) {
        this.cartItems = cartItems;
        this.totalItems = cartItems != null ? cartItems.size() : 0;
    }

    public List<ConflictDTO> getConflicts() {
        return conflicts;
    }

    public void setConflicts(List<ConflictDTO> conflicts) {
        this.conflicts = conflicts;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }
}