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

CREATE TABLE IF NOT EXISTS students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
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
    student_id INT
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
    selected_course_id INT
);


-- Students Courses Table
-- - selected_course_id (INT, PRIMARY KEY, AUTO_INCREMENT)
-- - instructor_course_id(INT, FOREIGN KEY) 
-- - student_id(INT, FOREIGN KEY) 
-- - enrolled (BOOLEAN)

CREATE TABLE IF NOT EXISTS students_courses (
    selected_course_id INT PRIMARY KEY AUTO_INCREMENT,
    instructor_course_id INT,
    student_id INT,
    enrolled BOOLEAN
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
    credits INT DEFAULT 3
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


ALTER TABLE time_blocks
    ADD FOREIGN KEY (student_id) REFERENCES students(student_id);

ALTER TABLE cart
    ADD FOREIGN KEY (student_id) REFERENCES students(student_id),
    ADD FOREIGN KEY (time_block_id) REFERENCES time_blocks(time_block_id),
    ADD FOREIGN KEY (selected_course_id) REFERENCES students_courses(selected_course_id);

ALTER TABLE students_courses
    ADD FOREIGN KEY (instructor_course_id) REFERENCES instructors_courses(instructor_course_id),
    ADD FOREIGN KEY (student_id) REFERENCES students(student_id);

ALTER TABLE instructors_courses
    ADD FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id),
    ADD FOREIGN KEY (location_id) REFERENCES locations(location_id);


-- Input script for the schedule planner

use schedule_planner;
-- locations data
INSERT INTO locations(name, building, floor, capacity, location_type) VALUES
('Room 101', 'Science Hall', 1, 40, 'classroom'),
('Lab 202', 'ENGR Hall', 2, 25, 'lab'),
('AUDI A', 'Main Hall', 0, 200, 'auditorium');

-- instructors data
INSERT INTO instructors(name, email, department, office_location, phone) VALUES
('Alice', 'alice@gmail.com', "CSCE", 'Room 301', '555-1234'),
('Bob', 'bob@gmail.com', "MATH", 'Room 205', '555-2345'),
('John', 'john@gmail.com', "PHYS", 'Room 110', '555-3456');
-- instructors_courses data
INSERT INTO instructors_courses (course_name, course_code, course_number, section, description, instructor_id, location_id, start_time, end_time, day, credits) VALUES
('Intro to CompSci', 'CS', '101', '001', 'Basic Concepts of Programming', 1,1,'09:00:00', '10:30:00', 'Monday', 3),
('Intro to Math', 'MT', '201', '002', 'Basic Concepts of Math', 2,1,'11:00:00', '12:30:00', 'Tuesday', 4),
('Intro to English', 'EN', '301', '003', 'Basic Concepts of English', 3,3, '14:00:00', '15:30:00', 'Wednesday', 4);

-- update instructors with instructor_course_id (to resolve FK loop)
UPDATE instructors SET instructor_course_id = 1 WHERE instructor_id = 1;
UPDATE instructors SET instructor_course_id = 2 WHERE instructor_id = 2;
UPDATE instructors SET instructor_course_id = 3 WHERE instructor_id = 3;

-- students data

INSERT INTO students(full_name, username, email, password_hash) VALUES
('Student 1 Name Here', 'stu1', 'student1@example.com', 'hashed_pw_1'),
('Student 2 Name Here', 'stu2', 'student2@example.com', 'hashed_pw_2'),
('Student 3 Name Here', 'stu3', 'student3@example.com', 'hashed_pw_3');


-- Time Blocks data
INSERT INTO time_blocks(title, start_time, end_time, day, weeks, description, student_id) VALUES
('Part-time Job', '15:30:00', '17:30:00', 'Monday', 12, 'Work at Macys', 1),
('Basketball Practice', '18:00:00', '20:00:00', 'Thursday', 10, 'Training', 1),
('Chess Club', '18:00:00', '19:30:00', 'Wednesday', 10, 'Training', 2),
('Chess Club', '18:00:00', '19:30:00', 'Wednesday', 10, 'Training', 3);

-- Student Course Enrollments 
INSERT INTO students_courses (student_id, instructor_course_id, enrolled) VALUES
(1,1,TRUE),
(1,2,FALSE),
(2,1,TRUE),
(2,3,TRUE),
(3,2,TRUE);

-- student1 has 2 time_blocks + 1 course enrolled + 1 course waitlisted
-- student2 has 1 time_blocks + 2 courses
-- student3 has 1 course

select* from instructors;
select* from instructors_courses;
select* from locations;
select* from students;
select* from students_courses;
select* from time_blocks;

-- Query for organizing time blocks for view schedule
SELECT s.student_id,
s.full_name,
tb.title AS time_block_name,
tb.start_time AS time_block_start_time,
tb.end_time AS time_block_end_time,
tb.day AS time_block_day,
tb.weeks AS time_block_weeks,
tb.description AS time_block_description
FROM students s
JOIN time_blocks tb ON s.student_id = tb.student_id
ORDER BY s.student_id, tb.day, tb.start_time;

-- Query for organizing courses for view schedule
SELECT s.student_id,
s.full_name,
ic.course_name,
ic.course_code,
ic.course_number,
ic.start_time AS course_start_time,
ic.end_time AS course_end_time,
ic.day AS course_day,
ic.weeks AS course_weeks,
l.name AS course_location_name,
sc.enrolled
FROM students s
JOIN students_courses sc ON s.student_id = sc.student_id
JOIN instructors_courses ic ON sc.instructor_course_id = ic.instructor_course_id
JOIN locations l ON ic.location_id = l.location_id
ORDER BY s.student_id, ic.day, ic.start_time;