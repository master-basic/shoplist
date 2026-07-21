const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../auth');

router.use(authenticateToken);

router.get('/summary', async (req, res) => {
  try {
    let { householdId } = req.query;
    if (!householdId) {
      const userResult = await pool.query(
        'SELECT household_id FROM user_households WHERE user_id = $1 LIMIT 1',
        [req.user.id]
      );
      if (userResult.rows.length === 0) return res.status(400).json({ error: 'No household found' });
      householdId = userResult.rows[0].household_id;
    }

    const [spendingResult, itemsResult, listsResult, receiptsResult] = await Promise.all([
      pool.query(
        `SELECT COALESCE(SUM(ri.total_price), 0) as total_spent
         FROM receipts r
         JOIN receipt_items ri ON r.id = ri.receipt_id
         WHERE r.household_id = $1
           AND r.created_at >= date_trunc('month', CURRENT_TIMESTAMP)`,
        [householdId]
      ),
      pool.query(
        `SELECT COALESCE(SUM(ri.quantity), 0) as total_items
         FROM receipts r
         JOIN receipt_items ri ON r.id = ri.receipt_id
         WHERE r.household_id = $1
           AND r.created_at >= date_trunc('month', CURRENT_TIMESTAMP)`,
        [householdId]
      ),
      pool.query(
        'SELECT COUNT(*) as active_lists FROM grocery_lists WHERE household_id = $1 AND status = $2',
        [householdId, 'active']
      ),
      pool.query(
        `SELECT COUNT(*) as total_receipts FROM receipts
         WHERE household_id = $1
           AND created_at >= date_trunc('month', CURRENT_TIMESTAMP)`,
        [householdId]
      ),
    ]);

    res.json({
      totalSpentThisMonth: parseFloat(spendingResult.rows[0].total_spent),
      totalItemsBought: parseInt(itemsResult.rows[0].total_items, 10),
      activeListsCount: parseInt(listsResult.rows[0].active_lists, 10),
      totalReceipts: parseInt(receiptsResult.rows[0].total_receipts, 10),
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ error: 'Failed to get summary', message: error.message });
  }
});

router.get('/spending-by-category', async (req, res) => {
  try {
    let { householdId } = req.query;
    if (!householdId) {
      const userResult = await pool.query(
        'SELECT household_id FROM user_households WHERE user_id = $1 LIMIT 1',
        [req.user.id]
      );
      if (userResult.rows.length === 0) return res.status(400).json({ error: 'No household found' });
      householdId = userResult.rows[0].household_id;
    }

    const result = await pool.query(
      `SELECT COALESCE(li.category, 'Other') as category, SUM(ri.total_price) as total
       FROM receipts r
       JOIN receipt_items ri ON r.id = ri.receipt_id
       LEFT JOIN list_items li ON ri.list_item_id = li.id
       WHERE r.household_id = $1
         AND r.created_at >= date_trunc('month', CURRENT_TIMESTAMP)
       GROUP BY li.category
       ORDER BY total DESC`,
      [householdId]
    );

    res.json({ categories: result.rows.map(r => ({ category: r.category, total: parseFloat(r.total) })) });
  } catch (error) {
    console.error('Analytics category error:', error);
    res.status(500).json({ error: 'Failed to get spending by category', message: error.message });
  }
});

router.get('/top-items', async (req, res) => {
  try {
    let { householdId } = req.query;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    if (!householdId) {
      const userResult = await pool.query(
        'SELECT household_id FROM user_households WHERE user_id = $1 LIMIT 1',
        [req.user.id]
      );
      if (userResult.rows.length === 0) return res.status(400).json({ error: 'No household found' });
      householdId = userResult.rows[0].household_id;
    }

    const result = await pool.query(
      `SELECT li.name, SUM(ri.total_price) as total_spent, COUNT(*) as times_bought,
              AVG(ri.unit_price) as avg_price, MAX(ri.purchased_at) as last_bought
       FROM receipts r
       JOIN receipt_items ri ON r.id = ri.receipt_id
       LEFT JOIN list_items li ON ri.list_item_id = li.id
       WHERE r.household_id = $1
       GROUP BY li.name
       ORDER BY total_spent DESC
       LIMIT $2`,
      [householdId, limit]
    );

    res.json({
      items: result.rows.map(r => ({
        name: r.name,
        totalSpent: parseFloat(r.total_spent),
        timesBought: parseInt(r.times_bought, 10),
        avgPrice: parseFloat(r.avg_price),
        lastBought: r.last_bought,
      })),
    });
  } catch (error) {
    console.error('Analytics top items error:', error);
    res.status(500).json({ error: 'Failed to get top items', message: error.message });
  }
});

module.exports = router;
