const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../auth');
const { broadcastToHousehold } = require('../ws');

const router = express.Router();

router.use(authenticateToken);

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT h.*, ARRAY_AGG(DISTINCT uh.user_id) as member_ids, ARRAY_AGG(DISTINCT uh.role) as member_roles
       FROM households h JOIN user_households uh ON h.id = uh.household_id
       WHERE h.id = $1 GROUP BY h.id`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Household not found' });
    res.json({ household: result.rows[0] });
  } catch (error) {
    console.error('Get household error:', error);
    res.status(500).json({ error: 'Failed to get household', message: error.message });
  }
});

router.get('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.email, u.name, u.is_admin, uhm.role, uhm.is_owner, uhm.joined_at
       FROM households h JOIN user_households uhm ON h.id = uhm.household_id
       JOIN users u ON uhm.user_id = u.id WHERE h.id = $1`,
      [id]
    );
    res.json({ members: result.rows });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to get members', message: error.message });
  }
});

router.post('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;
    if (!userId || !role) return res.status(400).json({ error: 'userId and role are required' });
    const existing = await pool.query('SELECT * FROM user_households WHERE user_id = $1 AND household_id = $2', [userId, id]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'User already in this household' });
    await pool.query('INSERT INTO user_households (user_id, household_id, role) VALUES ($1, $2, $3)', [userId, id, role]);
    broadcastToHousehold(id, { type: 'member_added', payload: { householdId: id, userId } });
    res.json({ message: 'User added to household successfully' });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member', message: error.message });
  }
});

router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;
    await pool.query('DELETE FROM user_households WHERE user_id = $1 AND household_id = $2', [userId, id]);
    broadcastToHousehold(id, { type: 'member_removed', payload: { householdId: id, userId } });
    res.json({ message: 'User removed from household successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member', message: error.message });
  }
});

router.get('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT li.* FROM list_items li JOIN grocery_lists gl ON li.list_id = gl.id WHERE gl.household_id = $1 ORDER BY li.created_at DESC`,
      [id]
    );
    res.json({ items: result.rows });
  } catch (error) {
    console.error('Get household items error:', error);
    res.status(500).json({ error: 'Failed to get household items', message: error.message });
  }
});

module.exports = router;
