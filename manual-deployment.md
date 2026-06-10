# Manual Deployment on AWS EC2

This branch contains the manual deployment version of the Student Course Registration System.

## Purpose

This deployment method runs each tier manually on an AWS EC2 Ubuntu server:

- React frontend
- Node.js Express backend
- PostgreSQL database

## Basic Manual Deployment Flow

1. Launch AWS EC2 Ubuntu instance.
2. Install Node.js, npm, Git, and PostgreSQL.
3. Clone this repository branch.
4. Create PostgreSQL database.
5. Import database schema.
6. Configure backend environment variables.
7. Run backend manually.
8. Run frontend manually.
9. Verify frontend, backend, and database connection.

## Branch

manual-deployment