const db = require('../config/db');

exports.getGoals = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM learning_goals WHERE user_id = $1 ORDER BY deadline ASC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch goals', error: error.message });
  }
};

exports.createGoal = async (req, res) => {
  const { goal_name, target_hours, deadline, status } = req.body;
  if (!goal_name || !target_hours) {
    return res.status(400).json({ message: 'Goal name and target hours are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO learning_goals (user_id, goal_name, target_hours, deadline, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, goal_name, target_hours, deadline || null, status || 'Active']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create goal', error: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  const { id } = req.params;
  const { goal_name, target_hours, deadline, status } = req.body;

  try {
    const result = await db.query(
      `UPDATE learning_goals 
       SET goal_name = $1, target_hours = $2, deadline = $3, status = $4 
       WHERE id = $5 AND user_id = $6 
       RETURNING *`,
      [goal_name, target_hours, deadline, status, id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update goal', error: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM learning_goals WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete goal', error: error.message });
  }
};
