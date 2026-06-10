# Docker Deployment

This document explains how to run the Student Course Registration System with Docker Compose.

## Services

Docker Compose starts three containers:

| Service  | Description                  | Image / Build      | Port on host |
| -------- | ---------------------------- | ------------------ | ------------ |
| db       | PostgreSQL database          | postgres:15-alpine | 5432         |
| backend  | Node.js Express API          | ./backend          | 5000         |
| frontend | React app (Vite dev server)  | ./frontend         | 3000         |

The database schema and sample data from `database/schema.sql` are loaded
automatically the **first time** the database container starts. Data is kept
in a named Docker volume (`postgres_data`), so it survives restarts.

## Prerequisites

- Docker Desktop installed and running.
- Ports 3000, 5000, and 5432 free on your machine.
  (If you have PostgreSQL installed locally, stop it first or it will
  conflict with the database container on port 5432.)

## Run the app

From the project root:

```bash
docker compose up --build
```

Add `-d` to run in the background:

```bash
docker compose up --build -d
```

Then open the frontend in your browser: <http://localhost:3000>

## Check the running containers

```bash
docker compose ps
```

You should see three containers: `course-registration-db` (healthy),
`course-registration-backend`, and `course-registration-frontend`.

To watch the logs:

```bash
docker compose logs -f
```

## Check the backend health endpoint

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{"status":"ok"}
```

You can also try a real API route:

```bash
curl http://localhost:5000/api/students
```

## Verify PostgreSQL data inside the container

List the tables:

```bash
docker compose exec db psql -U postgres -d course_registration -c "\dt"
```

Query the sample data:

```bash
docker compose exec db psql -U postgres -d course_registration -c "SELECT * FROM students;"
```

## Stop the app

```bash
docker compose down
```

Database data is kept in the `postgres_data` volume. To delete the data and
start fresh (the schema and sample data will be reloaded on next startup):

```bash
docker compose down -v
```
