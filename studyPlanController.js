const db = require('../config/db');

exports.getStudyPlans = async (req, res) => {
  const userId = req.user.id;
  const { status, subject, priority, date } = req.query;

  let queryText = 'SELECT * FROM study_plans WHERE user_id = $1';
  let queryParams = [userId];
  let paramCount = 1;

  if (status) {
    paramCount++;
    queryText += ` AND status = $${paramCount}`;
    queryParams.push(status);
  }
  if (subject) {
    paramCount++;
    queryText += ` AND subject = $${paramCount}`;
    queryParams.push(subject);
  }
  if (priority) {
    paramCount++;
    queryText += ` AND priority = $${paramCount}`;
    queryParams.push(priority);
  }
  if (date) {
    paramCount++;
    queryText += ` AND study_date = $${paramCount}`;
    queryParams.push(date);
  }

  queryText += ' ORDER BY study_date DESC, start_time ASC';

  try {
    const result = await db.query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch study plans', error: error.message });
  }
};

exports.createStudyPlan = async (req, res) => {
  const userId = req.user.id;
  const { subject, topic, description, study_date, start_time, end_time, priority, status } = req.body;

  if (!subject || !topic || !study_date || !start_time || !end_time) {
    return res.status(400).json({ message: 'Required fields: subject, topic, study_date, start_time, end_time' });
  }

  try {
    const result = await db.query(
      `INSERT INTO study_plans 
        (user_id, subject, topic, description, study_date, start_time, end_time, priority, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [userId, subject, topic, description || '', study_date, start_time, end_time, priority || 'Medium', status || 'Not Started']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create study plan', error: error.message });
  }
};

exports.updateStudyPlan = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { subject, topic, description, study_date, start_time, end_time, priority, status } = req.body;

  try {
    const check = await db.query('SELECT id FROM study_plans WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Study plan not found or unauthorized' });
    }

    const result = await db.query(
      `UPDATE study_plans 
       SET subject = $1, topic = $2, description = $3, study_date = $4, start_time = $5, 
           end_time = $6, priority = $7, status = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10 
       RETURNING *`,
      [subject, topic, description, study_date, start_time, end_time, priority, status, id, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update study plan', error: error.message });
  }
};

exports.deleteStudyPlan = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM study_plans WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Study plan not found or unauthorized' });
    }
    res.json({ message: 'Study plan deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete study plan', error: error.message });
  }
};
