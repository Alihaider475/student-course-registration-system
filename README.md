# Student Course Registration System

A simple full-stack web app for managing students, courses, and course registrations.

## Tech Stack

- **Frontend:** React + Vite + JavaScript + Axios + CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL

## Features

- Add, edit, and delete students
- Add, edit, and delete courses (with capacity limits)
- Register students for courses
- Prevents duplicate registrations and over-capacity enrollment
- View and drop registrations

## Project Structure

```
student-course-registration-system/
├── backend/
│   ├── routes/
│   │   ├── students.js        # Student CRUD endpoints
│   │   ├── courses.js         # Course CRUD endpoints
│   │   └── registrations.js   # Registration endpoints
│   ├── db.js                  # PostgreSQL connection
│   ├── server.js              # Express app entry point
│   └── .env.example           # Environment variable template
├── database/
│   └── schema.sql             # Tables + sample data
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Students.jsx
│   │   │   ├── Courses.jsx
│   │   │   └── Registrations.jsx
│   │   ├── api.js             # Axios API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### 1. Database

Make sure PostgreSQL is installed and running, then create the database and load the schema:

```bash
psql -U postgres -c "CREATE DATABASE course_registration;"
psql -U postgres -d course_registration -f database/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file by copying the example, then edit it with your PostgreSQL password:

```bash
copy .env.example .env    # Windows
# cp .env.example .env    # Mac/Linux
```

Start the server:

```bash
npm start
```

The API runs at `http://localhost:5000`.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## API Endpoints

| Method | Endpoint                 | Description                      |
|--------|--------------------------|----------------------------------|
| GET    | /api/students            | List all students                |
| POST   | /api/students            | Add a student                    |
| PUT    | /api/students/:id        | Update a student                 |
| DELETE | /api/students/:id        | Delete a student                 |
| GET    | /api/courses             | List all courses (with enrolled count) |
| POST   | /api/courses             | Add a course                     |
| PUT    | /api/courses/:id         | Update a course                  |
| DELETE | /api/courses/:id         | Delete a course                  |
| GET    | /api/registrations       | List all registrations           |
| POST   | /api/registrations       | Register a student for a course  |
| DELETE | /api/registrations/:id   | Drop a registration              |
