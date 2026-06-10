// Database connection setup using the "pg" library
const { Pool } = require('pg');
require('dotenv').config();

// The password must come from the .env file - PostgreSQL rejects the
// connection with a confusing "SASL" error if it is missing.
if (!process.env.DB_PASSWORD) {
  console.error(
    'ERROR: DB_PASSWORD is not set. Copy backend/.env.example to backend/.env and fill in your PostgreSQL password.'
  );
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'course_registration',
});

module.exports = pool;
