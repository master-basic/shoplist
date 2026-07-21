const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { authenticateToken } = require('../auth');

const router = express.Router();

router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (!req.user.is_admin) return res.status(403).json({ error: 'Admin access required' });
    const result = await pool.query(
      "SELECT id, email, name, username, is_admin, preferred_currency, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Admin list users error:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.post('/users', authenticateToken, async (req, res) => {
  try {
    if (!req.user.is_admin) return res.status(403).json({ error: 'Admin access required' });
    const { email, password, name, username } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name are required' });
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const uname = username || email.split('@')[0];
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, username, is_admin, preferred_currency) VALUES ($1, $2, $3, $4, FALSE, $5) RETURNING id, email, name, username, is_admin, preferred_currency, created_at',
      [email, passwordHash, name, uname, 'AZN']
    );
    const newUserId = result.rows[0].id;
    const hh = await pool.query(
      'INSERT INTO households (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
      [`${name}'s Household`, '', newUserId]
    );
    await pool.query(
      'INSERT INTO user_households (user_id, household_id, role, is_owner) VALUES ($1, $2, $3, $4)',
      [newUserId, hh.rows[0].id, 'admin', true]
    );
    res.status(201).json({ user: result.rows[0], message: 'User created' });
  } catch (error) {
    console.error('Admin create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/users/:id/password', authenticateToken, async (req, res) => {
  try {
    if (!req.user.is_admin) return res.status(403).json({ error: 'Admin access required' });
    const { id } = req.params;
    const { password } = req.body;
    if (!password || password.length < 3) return res.status(400).json({ error: 'Password must be at least 3 characters' });
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, id]);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Admin reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

router.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user.is_admin) return res.status(403).json({ error: 'Admin access required' });
    const { id } = req.params;
    if (id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
    await pool.query('BEGIN');
    await pool.query('DELETE FROM list_items WHERE list_id IN (SELECT id FROM grocery_lists WHERE created_by = $1)', [id]);
    await pool.query('DELETE FROM grocery_lists WHERE created_by = $1', [id]);
    await pool.query('DELETE FROM user_households WHERE user_id = $1', [id]);
    await pool.query('DELETE FROM price_history WHERE bought_by = $1', [id]);
    await pool.query('DELETE FROM receipts WHERE user_id = $1', [id]);
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    await pool.query('COMMIT');
    res.json({ message: 'User deleted' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Admin delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
