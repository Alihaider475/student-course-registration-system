// Routes for managing courses
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/courses - list all courses (with how many students are enrolled)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT courses.*,
             COUNT(registrations.id)::int AS enrolled
      FROM courses
      LEFT JOIN registrations ON registrations.course_id = courses.id
      GROUP BY courses.id
      ORDER BY courses.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id - get one course
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST /api/courses - add a new course
router.post('/', async (req, res) => {
  const { code, title, instructor, capacity } = req.body;

  if (!code || !title || !instructor) {
    return res.status(400).json({ error: 'Code, title and instructor are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO courses (code, title, instructor, capacity) VALUES ($1, $2, $3, $4) RETURNING *',
      [code, title, instructor, capacity || 30]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'A course with this code already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to add course' });
  }
});

// PUT /api/courses/:id - update a course
router.put('/:id', async (req, res) => {
  const { code, title, instructor, capacity } = req.body;

  if (!code || !title || !instructor) {
    return res.status(400).json({ error: 'Code, title and instructor are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE courses SET code = $1, title = $2, instructor = $3, capacity = $4 WHERE id = $5 RETURNING *',
      [code, title, instructor, capacity || 30, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'A course with this code already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE /api/courses/:id - delete a course
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;
