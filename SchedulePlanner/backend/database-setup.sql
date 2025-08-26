-- Database setup script for Schedule Planner
-- Run this script in your MySQL database to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS schedule_planner;

-- Use the database
USE schedule_planner;

-- Create a dedicated user for the application (optional but recommended)
-- Replace 'your_password_here' with a secure password
CREATE USER IF NOT EXISTS 'schedule_user'@'localhost' IDENTIFIED BY 'your_password_here';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON schedule_planner.* TO 'schedule_user'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Show databases to verify creation
SHOW DATABASES;

-- Show current database
SELECT DATABASE();

-- The application will automatically create the tables when it starts
-- due to the hibernate.ddl-auto=update setting
