-- Test data for integration tests
-- This file is loaded before each integration test

-- Create tables (using H2 database syntax)
CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    building VARCHAR(100),
    floor INT,
    capacity INT,
    location_type VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS instructors (
    instructor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    instructor_course_id INT,
    department VARCHAR(100),
    office_location VARCHAR(100),
    phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS instructors_courses (
    instructor_course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(200) NOT NULL,
    course_code VARCHAR(20),
    course_number VARCHAR(20),
    section VARCHAR(10),
    description TEXT,
    instructor_id INT,
    location_id INT,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day VARCHAR(20) NOT NULL,
    weeks INT DEFAULT 15,
    seats_total INT DEFAULT 30,
    seats_open INT DEFAULT 30,
    waitlist_capacity INT DEFAULT 10,
    waitlist_open INT DEFAULT 10,
    credits INT DEFAULT 3
);

CREATE TABLE IF NOT EXISTS students_courses (
    selected_course_id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_course_id INT,
    student_id INT,
    enrolled BOOLEAN
);

CREATE TABLE IF NOT EXISTS time_blocks (
    time_block_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    weeks INT,
    description TEXT,
    color VARCHAR(7),
    student_id INT
);

-- Insert test data
INSERT INTO students(full_name, username, email, password_hash) VALUES
('Test Student 1', 'test1', 'test@example.com', 'hash1'),
('Test Student 2', 'test2', 'test2@example.com', 'hash2');

INSERT INTO locations(name, building, floor, capacity, location_type) VALUES
('Room 101', 'Test Building', 1, 30, 'classroom'),
('Lab 201', 'Test Building', 2, 20, 'lab');

INSERT INTO instructors(name, email, department, office_location, phone) VALUES
('Test Instructor 1', 'instructor1@example.com', 'Computer Science', 'Office 101', '555-0001'),
('Test Instructor 2', 'instructor2@example.com', 'Mathematics', 'Office 102', '555-0002');

INSERT INTO instructors_courses(course_name, course_code, course_number, section, description, instructor_id, location_id, start_time, end_time, day, weeks, credits) VALUES
('Test Course 1', 'CS', '101', '001', 'Introduction to Computer Science', 1, 1, '09:00:00', '10:30:00', 'Monday', 15, 3),
('Test Course 2', 'MATH', '201', '001', 'Calculus I', 2, 2, '11:00:00', '12:30:00', 'Tuesday', 15, 4);

-- Update instructors with course references
UPDATE instructors SET instructor_course_id = 1 WHERE instructor_id = 1;
UPDATE instructors SET instructor_course_id = 2 WHERE instructor_id = 2;

INSERT INTO students_courses(instructor_course_id, student_id, enrolled) VALUES
(1, 1, true),
(2, 1, false),
(1, 2, true);

INSERT INTO time_blocks(title, start_time, end_time, day, type, weeks, description, color, student_id) VALUES
('Study Time', '15:00:00', '16:00:00', 'Monday', 'study', 15, 'Dedicated study time', '#FF9800', 1),
('Gym Session', '17:00:00', '18:00:00', 'Wednesday', 'personal', 15, 'Workout time', '#4CAF50', 1),
('Work', '14:00:00', '18:00:00', 'Friday', 'job', 15, 'Part-time job', '#FF5722', 2);
