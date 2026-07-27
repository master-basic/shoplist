const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../auth');
const pool = require('../db');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { householdId } = req.query;
    if (!householdId) return res.status(400).json({ error: 'householdId is required' });

    const result = await pool.query(
      'SELECT * FROM household_budgets WHERE household_id = $1 ORDER BY period_start DESC LIMIT 1',
      [householdId]
    );

    if (result.rows.length === 0) {
      return res.json({ budget: null });
    }

    const budget = result.rows[0];

    const spentResult = await pool.query(
      `SELECT COALESCE(SUM(r.total_amount), 0) as total_spent
       FROM receipts r
       WHERE r.household_id = $1
       AND r.created_at >= $2
       AND r.created_at < $3`,
      [householdId, budget.period_start, budget.period_end]
    );

    const totalSpent = parseFloat(spentResult.rows[0]?.total_spent || 0);
    const remaining = parseFloat(budget.amount) - totalSpent;
    const usagePercent = parseFloat(budget.amount) > 0 ? (totalSpent / parseFloat(budget.amount)) * 100 : 0;

    res.json({
      budget: {
        ...budget,
        totalSpent,
        remaining,
        usagePercent: Math.round(usagePercent * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Failed to get budget', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { householdId, amount, periodStart, periodEnd, description } = req.body;
    if (!householdId || !amount || !periodStart || !periodEnd) {
      return res.status(400).json({ error: 'householdId, amount, periodStart, and periodEnd are required' });
    }

    const result = await pool.query(
      `INSERT INTO household_budgets (household_id, amount, period_start, period_end, description)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (household_id, period_start, period_end)
       DO UPDATE SET amount = $2, description = $5
       RETURNING *`,
      [householdId, amount, periodStart, periodEnd, description || null]
    );

    res.status(201).json({ budget: result.rows[0] });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Failed to create budget', message: error.message });
  }
});

module.exports = router;
