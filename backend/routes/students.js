// Routes for managing students
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/students - list all students
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET /api/students/:id - get one student
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// POST /api/students - add a new student
router.post('/', async (req, res) => {
  const { name, email, department } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO students (name, email, department) VALUES ($1, $2, $3) RETURNING *',
      [name, email, department || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // 23505 is the PostgreSQL error code for a unique constraint violation
    if (err.code === '23505') {
      return res.status(400).json({ error: 'A student with this email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// PUT /api/students/:id - update a student
router.put('/:id', async (req, res) => {
  const { name, email, department } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE students SET name = $1, email = $2, department = $3 WHERE id = $4 RETURNING *',
      [name, email, department || '', req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'A student with this email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE /api/students/:id - delete a student
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
