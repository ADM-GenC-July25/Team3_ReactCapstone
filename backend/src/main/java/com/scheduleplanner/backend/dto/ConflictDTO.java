package com.scheduleplanner.backend.dto;

public class ConflictDTO {

    private String itemType; // "course" or "timeblock"
    private Integer itemId;
    private String itemName;
    private String conflictingItemType;
    private Integer conflictingItemId;
    private String conflictingItemName;
    private String day;
    private String timeRange;
    private String conflictType; // "overlap", "gap"
    private String severity; // "high", "medium", "low"
    private String message;

    // Constructors
    public ConflictDTO() {}

    public ConflictDTO(String itemType, Integer itemId, String itemName,
                       String conflictingItemType, Integer conflictingItemId,
                       String conflictingItemName, String day, String timeRange,
                       String conflictType, String severity, String message) {
        this.itemType = itemType;
        this.itemId = itemId;
        this.itemName = itemName;
        this.conflictingItemType = conflictingItemType;
        this.conflictingItemId = conflictingItemId;
        this.conflictingItemName = conflictingItemName;
        this.day = day;
        this.timeRange = timeRange;
        this.conflictType = conflictType;
        this.severity = severity;
        this.message = message;
    }

    // Getters and Setters
    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getConflictingItemType() {
        return conflictingItemType;
    }

    public void setConflictingItemType(String conflictingItemType) {
        this.conflictingItemType = conflictingItemType;
    }

    public Integer getConflictingItemId() {
        return conflictingItemId;
    }

    public void setConflictingItemId(Integer conflictingItemId) {
        this.conflictingItemId = conflictingItemId;
    }

    public String getConflictingItemName() {
        return conflictingItemName;
    }

    public void setConflictingItemName(String conflictingItemName) {
        this.conflictingItemName = conflictingItemName;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getTimeRange() {
        return timeRange;
    }

    public void setTimeRange(String timeRange) {
        this.timeRange = timeRange;
    }

    public String getConflictType() {
        return conflictType;
    }

    public void setConflictType(String conflictType) {
        this.conflictType = conflictType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}