package com.scheduleplanner.backend.service;

import com.scheduleplanner.backend.config.JwtUtil;
import com.scheduleplanner.backend.model.*;
import com.scheduleplanner.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse login(LoginRequest loginRequest) throws Exception {
        Optional<Student> studentOpt = studentRepository.findByEmail(loginRequest.getEmail());
        
        if (studentOpt.isEmpty()) {
            throw new Exception("Invalid email or password");
        }
        
        Student student = studentOpt.get();
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), student.getPasswordHash())) {
            throw new Exception("Invalid email or password");
        }
        
        String token = jwtUtil.generateToken(student.getEmail(), student.getStudentId());
        
        return new AuthResponse(token, student);
    }
    
    public AuthResponse register(RegisterRequest registerRequest) throws Exception {
        // Check if email already exists
        if (studentRepository.existsByEmail(registerRequest.getEmail())) {
            throw new Exception("Email is already registered");
        }
        
        // Check if username already exists
        if (studentRepository.existsByUsername(registerRequest.getUsername())) {
            throw new Exception("Username is already taken");
        }
        
        // Create new student
        Student student = new Student();
        student.setFullName(registerRequest.getFullName());
        student.setUsername(registerRequest.getUsername());
        student.setEmail(registerRequest.getEmail());
        student.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        
        // Save student to database
        Student savedStudent = studentRepository.save(student);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedStudent.getEmail(), savedStudent.getStudentId());
        
        return new AuthResponse(token, savedStudent);
    }
    
    public Student getCurrentUser(String email) {
        return studentRepository.findByEmail(email).orElse(null);
    }
} 