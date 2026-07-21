const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { authenticateToken, generateToken } = require('../auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, username: reqUsername, password } = req.body;
    if (!name || !password) return res.status(400).json({ error: 'Name and password are required' });
    if (!email && !reqUsername) return res.status(400).json({ error: 'Email or username is required' });
    if (email) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already registered' });
    }
    if (reqUsername) {
      const existing = await pool.query('SELECT id FROM users WHERE username = $1', [reqUsername]);
      if (existing.rows.length > 0) return res.status(400).json({ error: 'Username already taken' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const username = reqUsername || (email ? email.split('@')[0] : '');
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, username, is_admin, preferred_currency) VALUES ($1, $2, $3, $4, FALSE, $5) RETURNING id, email, name, is_admin, preferred_currency, created_at',
      [email, passwordHash, name, username, 'AZN']
    );
    const user = result.rows[0];
    const token = generateToken(user);
    res.status(201).json({ user, token, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginId = email || username;
    if (!loginId || !password) return res.status(400).json({ error: 'Email/username and password are required' });
    const result = await pool.query(
      'SELECT id, email, name, username, is_admin, preferred_currency, created_at, password_hash FROM users WHERE email = $1 OR username = $1',
      [loginId]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' });
    const { password_hash, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);
    res.json({ user: userWithoutPassword, token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, is_admin, preferred_currency, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ error: 'Failed to verify token', message: error.message });
  }
});

router.get('/user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, email, name, username, is_admin, preferred_currency, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user', message: error.message });
  }
});

router.get('/user/:id/households', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT h.id, h.name, h.description, h.created_at, h.created_by, ARRAY_AGG(DISTINCT uh.role::text) as roles
       FROM households h JOIN user_households uh ON h.id = uh.household_id
       WHERE uh.user_id = $1 GROUP BY h.id, h.name, h.description, h.created_at, h.created_by`,
      [id]
    );
    res.json({ households: result.rows });
  } catch (error) {
    console.error('Get households error:', error);
    res.status(500).json({ error: 'Failed to get households', message: error.message });
  }
});

router.post('/households', authenticateToken, async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    if (!name || !userId) return res.status(400).json({ error: 'Name and userId are required' });
    const householdResult = await pool.query(
      'INSERT INTO households (name, description, created_by) VALUES ($1, $2, $3) RETURNING id, name, description, created_by, created_at',
      [name, description, userId]
    );
    const householdId = householdResult.rows[0].id;
    await pool.query('INSERT INTO user_households (user_id, household_id, role, is_owner) VALUES ($1, $2, $3, $4)', [userId, householdId, 'admin', true]);
    res.status(201).json({ household: householdResult.rows[0], message: 'Household created successfully' });
  } catch (error) {
    console.error('Create household error:', error);
    res.status(500).json({ error: 'Failed to create household', message: error.message });
  }
});

module.exports = router;
