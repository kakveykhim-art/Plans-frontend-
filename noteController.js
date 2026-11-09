const db = require('../config/db');

exports.getNotes = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT sn.*, c.category_name 
       FROM study_notes sn 
       LEFT JOIN categories c ON sn.category_id = c.id 
       WHERE sn.user_id = $1 
       ORDER BY sn.updated_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
  }
};

exports.createNote = async (req, res) => {
  const { category_id, title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO study_notes (user_id, category_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, category_id || null, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note', error: error.message });
  }
};

exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { category_id, title, content } = req.body;

  try {
    const result = await db.query(
      `UPDATE study_notes 
       SET category_id = $1, title = $2, content = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 AND user_id = $5 
       RETURNING *`,
      [category_id || null, title, content, id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note', error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM study_notes WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note', error: error.message });
  }
};
