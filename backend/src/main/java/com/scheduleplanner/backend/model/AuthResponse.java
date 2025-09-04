package com.scheduleplanner.backend.model;

public class AuthResponse {
    
    private String token;
    private String tokenType = "Bearer";
    private Long studentId;
    private String email;
    private String fullName;
    private String username;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, Student student) {
        this.token = token;
        this.studentId = student.getStudentId();
        this.email = student.getEmail();
        this.fullName = student.getFullName();
        this.username = student.getUsername();
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
} 