package com.scheduleplanner.backend.service;

import com.scheduleplanner.backend.model.Student;
import com.scheduleplanner.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Authenticate a student with username and password
     * @param email the username to authenticate
     * @param password the password to verify
     * @return Optional<Student> if authentication successful, empty otherwise
     */
    public Optional<Student> authenticateStudent(String email, String password) {

        Optional<Student> authStudent = studentRepository.findByEmail(email);

        if (authStudent.isPresent()) {
            Student student = authStudent.get();


            // Check if password matches the stored hash
            if (passwordEncoder.matches(password, student.getPasswordHash())) {
                return authStudent;
            }
        }

        return Optional.empty();
    }

    /**
     * Create a new student with encrypted password
     * @param student the student to create
     * @return the created student
     */
    public Student createStudent(Student student) {
        // Encrypt the password before saving
        student.setPasswordHash(passwordEncoder.encode(student.getPasswordHash()));
        return studentRepository.save(student);
    }

    /**
     * Check if email already exists
     * @param email the email to check
     * @return true if exists, false otherwise
     */
    public boolean emailExists(String email) {
        return studentRepository.existsByEmail(email);
    }

    /**
     * Update student's time block or course selection
     * @param studentId the student ID to update
     * @param timeBlockId the time block ID (can be null)
     * @param selectedCourseId the selected course ID (can be null)
     * @return the updated student
     */
    public Student updateStudentSelection(Integer studentId, Integer timeBlockId, Integer selectedCourseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        student.setTimeBlockId(timeBlockId);
        student.setSelectedCourseId(selectedCourseId);

        return studentRepository.save(student);
    }
}
