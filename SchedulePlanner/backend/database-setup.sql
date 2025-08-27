-- Database setup script for Schedule Planner
-- Run this script in your MySQL database to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS schedule_planner;

-- Use the database
USE schedule_planner;

-- Show databases to verify creation
SHOW DATABASES;

-- Show current database
SELECT DATABASE();

-- Students table
-- - student_id (INT, PRIMARY KEY, AUTO_INCREMENT)
-- - full_name (VARCHAR(50))
-- - username (VARCHAR(50), UNIQUE, NOT NULL)
-- - email (VARCHAR(100), UNIQUE, NOT NULL)
-- - password_hash (VARCHAR(255), NOT NULL)
-- - event_type (ENUM: 'time_block', 'course')
-- - time_block_id(VARCHAR(50), FOREIGN KEY)
-- - selected_course_id(VARCHAR(50), FOREIGN KEY)

CREATE TABLE IF NOT EXISTS students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    event_type ENUM('time_block', 'course') NOT NULL,
    time_block_id INT,
    selected_course_id INT,
    FOREIGN KEY (time_block_id) REFERENCES time_blocks(time_block_id),
    FOREIGN KEY (selected_course_id) REFERENCES students_courses(course_id)
);

-- Time Blocks table
-- - time_block_id (INT, PRIMARY KEY, AUTO_INCREMENT)
-- - title (VARCHAR(200), NOT NULL) -- e.g., "Chess Club", "Part-time Job"
-- - start_time (TIME, NOT NULL) -- e.g., "15:30:00"
-- - end_time (TIME, NOT NULL) -- e.g., "17:00:00"
-- - day (ENUM: 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
-- - weeks (INT)
-- - description (TEXT)
-- - student_id (INT, FOREIGN KEY)

CREATE TABLE IF NOT EXISTS time_blocks (
    time_block_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    weeks INT,
    description TEXT,
    student_id INT,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Cart Table
-- - cart_id (INT, PRIMARY KEY, AUTO_INCREMENT)
-- - student_id (INT, FOREIGN KEY)
-- - time_block_id (INT, FOREIGN KEY)
-- - selected_course_id (INT, FOREIGN KEY)

CREATE TABLE IF NOT EXISTS cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    time_block_id INT,
    selected_course_id INT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (time_block_id) REFERENCES time_blocks(time_block_id),
    FOREIGN KEY (selected_course_id) REFERENCES students_courses(course_id)
);


-- Students Courses Table
-- - selected_course_id (INT, PRIMARY KEY, AUTO_INCREMENT)
-- - instructor_course_id(INT, FOREIGN KEY) 
-- - course_name (VARCHAR(200), FOREIGN KEY)
-- - enrolled (BOOLEAN)

CREATE TABLE IF NOT EXISTS students_courses (
    selected_course_id INT PRIMARY KEY AUTO_INCREMENT,
    instructor_course_id INT,
    course_name VARCHAR(200),
    enrolled BOOLEAN,
    FOREIGN KEY (instructor_course_id) REFERENCES instructors_courses(instructor_id),
    FOREIGN KEY (course_name) REFERENCES instructors_courses(course_name)
);

-- Instructors Courses Table
-- - instructor_course_id (INT, PRIMARY KEY, AUTO_INCREMENT)
-- - course_name (VARCHAR(200), NOT NULL) -- e.g., "Computer Science 101"
-- - course_code (VARCHAR(20)) -- e.g., "CS"
-- - course_number (VARCHAR(20)) -- e.g., "101"
-- - section (VARCHAR(10)) -- e.g., "001"
-- - description (TEXT)
-- - instructor_id (INT, FOREIGN KEY -> instructors.id)
-- - location_id (INT, FOREIGN KEY -> locations.id)
-- - start_time (TIME, NOT NULL) -- e.g., "15:30:00"
-- - end_time (TIME, NOT NULL) -- e.g., "17:00:00"
-- - day (ENUM: 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
-- - weeks (INT, DEFAULT 15)
-- - seats_total (INT, DEFAULT 30)
-- - seats_open (INT, DEFAULT 30)
-- - waitlist_capacity (INT, DEFAULT 10)
-- - waitlist_open (INT, DEFAULT 10)
-- - credits (INT, DEFAULT 3)

CREATE TABLE IF NOT EXISTS instructors_courses (
    instructor_course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(200) NOT NULL,
    course_code VARCHAR(20),
    course_number VARCHAR(20),
    section VARCHAR(10),
    description TEXT,
    instructor_id INT,
    location_id INT,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    weeks INT DEFAULT 15,
    seats_total INT DEFAULT 30,
    seats_open INT DEFAULT 30,
    waitlist_capacity INT DEFAULT 10,
    waitlist_open INT DEFAULT 10,
    credits INT DEFAULT 3,
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

-- Locations Table
-- - locations_id (INT, PRIMARY KEY, AUTO_INCREMENT)
-- - name (VARCHAR(100), NOT NULL) -- e.g., "Room 201", "Lab 102"
-- - building (VARCHAR(100))
-- - floor (INT)
-- - capacity (INT)
-- - location_type (ENUM: 'classroom', 'lab', 'studio', 'auditorium', 'other')

CREATE TABLE IF NOT EXISTS locations (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    building VARCHAR(100),
    floor INT,
    capacity INT,
    location_type ENUM('classroom', 'lab', 'studio', 'auditorium', 'other')
);

-- Instructors Table
-- - id (INT, PRIMARY KEY, AUTO_INCREMENT)
-- - name (VARCHAR(100), NOT NULL)
-- - email (VARCHAR(100))
-- - instructor_course_id(INT, FOREIGN KEY) 
-- - department (VARCHAR(100))
-- - office_location (VARCHAR(100))
-- - phone (VARCHAR(20))

CREATE TABLE IF NOT EXISTS instructors (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    instructor_course_id INT,
    department VARCHAR(100),
    office_location VARCHAR(100),
    phone VARCHAR(20),
    FOREIGN KEY (instructor_course_id) REFERENCES instructors_courses(instructor_course_id)
);