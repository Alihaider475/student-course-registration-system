// Routes for registering students into courses
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/registrations - list all registrations with student and course info
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT registrations.id,
             registrations.registered_at,
             students.id AS student_id,
             students.name AS student_name,
             courses.id AS course_id,
             courses.code AS course_code,
             courses.title AS course_title
      FROM registrations
      JOIN students ON students.id = registrations.student_id
      JOIN courses ON courses.id = registrations.course_id
      ORDER BY registrations.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// POST /api/registrations - register a student for a course
router.post('/', async (req, res) => {
  const { student_id, course_id } = req.body;

  if (!student_id || !course_id) {
    return res.status(400).json({ error: 'student_id and course_id are required' });
  }

  try {
    // Check the course exists and has space left
    const courseResult = await pool.query(
      `SELECT courses.capacity,
              COUNT(registrations.id)::int AS enrolled
       FROM courses
       LEFT JOIN registrations ON registrations.course_id = courses.id
       WHERE courses.id = $1
       GROUP BY courses.id`,
      [course_id]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { capacity, enrolled } = courseResult.rows[0];
    if (enrolled >= capacity) {
      return res.status(400).json({ error: 'This course is full' });
    }

    const result = await pool.query(
      'INSERT INTO registrations (student_id, course_id) VALUES ($1, $2) RETURNING *',
      [student_id, course_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'This student is already registered for this course' });
    }
    // 23503 is the PostgreSQL error code for a foreign key violation
    if (err.code === '23503') {
      return res.status(404).json({ error: 'Student not found' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to register student' });
  }
});

// DELETE /api/registrations/:id - drop a registration
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM registrations WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ message: 'Registration dropped' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to drop registration' });
  }
});

module.exports = router;
