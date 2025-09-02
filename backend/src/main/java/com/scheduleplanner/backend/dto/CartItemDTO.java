package com.scheduleplanner.backend.dto;

public class CartItemDTO {

    private Integer itemId;
    private String itemType; // "course" or "timeblock"
    private String name;
    private String startTime;
    private String endTime;
    private String day;
    private String description;
    private String instructor;
    private String location;
    private Integer seatsOpen;
    private Integer credits;

    // Constructors
    public CartItemDTO() {}

    public CartItemDTO(Integer itemId, String itemType, String name, String startTime,
                       String endTime, String day, String description, String instructor,
                       String location, Integer seatsOpen, Integer credits) {
        this.itemId = itemId;
        this.itemType = itemType;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.day = day;
        this.description = description;
        this.instructor = instructor;
        this.location = location;
        this.seatsOpen = seatsOpen;
        this.credits = credits;
    }

    // Getters and Setters
    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getSeatsOpen() {
        return seatsOpen;
    }

    public void setSeatsOpen(Integer seatsOpen) {
        this.seatsOpen = seatsOpen;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }
}