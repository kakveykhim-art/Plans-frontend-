# Daily Study Planner & LMS - Backend Service

Node.js, Express, and PostgreSQL backend for the Daily Study Planner web application.

## Quick Start Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Up Database:**
   - Ensure PostgreSQL is running.
   - Run `schema.sql` to create database and tables:
     ```bash
     psql -U postgres -f schema.sql
     ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`
   - Update database credentials (`DB_USER`, `DB_PASSWORD`, `DB_NAME`) and `JWT_SECRET`.

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The backend server runs on `http://localhost:3000`.
