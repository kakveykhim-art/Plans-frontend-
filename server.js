const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const noteRoutes = require('./routes/noteRoutes');
const goalRoutes = require('./routes/goalRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/study-plans', studyPlanRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/goals', goalRoutes);

// បន្ថែមចូលក្នុង server.js
app.get('/api/test-db', async (req, res) => {
  try {
    const db = require('./config/db');
    const [tables] = await db.query('SHOW TABLES;');
    const [users] = await db.query('SELECT id, name, email, created_at FROM users;');
    const [plans] = await db.query('SELECT * FROM study_plans;');

    res.json({
      status: 'Connected successfully!',
      tables,
      total_users: users.length,
      users,
      total_plans: plans.length,
      plans
    });
  } catch (error) {
    res.status(500).json({ status: 'Database Connection Failed', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Daily Study Planner API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
