package com.scheduleplanner.backend.repository;

import com.scheduleplanner.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

    // Find student by email
    Optional<Student> findByEmail(String email);

    // Check if email exists
    boolean existsByEmail(String email);
}
