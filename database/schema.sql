-- Student Course Registration System - Database Schema
-- Run this file with: psql -U postgres -f schema.sql

-- Create the database (run this line separately if needed)
-- CREATE DATABASE course_registration;

-- Connect to the database before running the rest:
-- \c course_registration

-- Drop tables if they already exist (so the script can be re-run)
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Registrations table (links students to courses)
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, course_id)  -- a student can register for a course only once
);

-- Sample students
INSERT INTO students (name, email, department) VALUES
    ('Ali Khan', 'ali.khan@example.com', 'Computer Science'),
    ('Sara Ahmed', 'sara.ahmed@example.com', 'Computer Science'),
    ('John Smith', 'john.smith@example.com', 'Mathematics');

-- Sample courses
INSERT INTO courses (code, title, instructor, capacity) VALUES
    ('CS101', 'Introduction to Programming', 'Dr. Rachel Green', 3),
    ('CS201', 'Data Structures', 'Dr. Alan Turing', 25),
    ('MATH110', 'Calculus I', 'Dr. Emmy Noether', 40),
    ('ENG105', 'Academic Writing', 'Prof. Jane Austen', 20);

-- Sample registrations
INSERT INTO registrations (student_id, course_id) VALUES
    (1, 1),
    (1, 2),
    (2, 1),
    (3, 3);
