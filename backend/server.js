// Main server file - sets up Express and mounts the routes
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const studentsRouter = require('./routes/students');
const coursesRouter = require('./routes/courses');
const registrationsRouter = require('./routes/registrations');

const app = express();

app.use(cors());          // allow requests from the React frontend
app.use(express.json());  // parse JSON request bodies

// API routes
app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/registrations', registrationsRouter);

// Simple health check route
app.get('/', (req, res) => {
  res.json({ message: 'Student Course Registration API is running' });
});

// Health check used by the frontend status indicator
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
