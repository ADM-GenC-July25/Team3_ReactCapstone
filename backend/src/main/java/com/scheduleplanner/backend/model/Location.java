package com.scheduleplanner.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Integer locationId;

    @Column(nullable = false)
    private String name;

    @Column
    private String building;

    @Column
    private Integer floor;

    @Column
    private Integer capacity;

    @Column(name = "location_type")
    private String locationType;

    // Constructors
    public Location() {
    }

    public Location(String name, String building, Integer floor, Integer capacity, String locationType) {
        this.name = name;
        this.building = building;
        this.floor = floor;
        this.capacity = capacity;
        this.locationType = locationType;
    }

    // Getters and Setters
    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getLocationType() {
        return locationType;
    }

    public void setLocationType(String locationType) {
        this.locationType = locationType;
    }
}