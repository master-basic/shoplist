const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../auth');

const router = express.Router();

router.use(authenticateToken);

router.post('/', async (req, res) => {
  try {
    const { listId, storeName, userId, householdId, items } = req.body;
    if (!listId || !userId || !items || !items.length) return res.status(400).json({ error: 'listId, userId, and items array are required' });
    const totalAmount = items.reduce((sum, i) => sum + (i.totalPrice || i.unitPrice || 0), 0);
    const receiptResult = await pool.query(
      'INSERT INTO receipts (household_id, list_id, user_id, name, total_amount, currency, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [householdId || null, listId, userId, `Purchase - ${storeName || 'Unknown'}`, totalAmount, 'AZN', 'purchased']
    );
    const receipt = receiptResult.rows[0];
    const createdItems = [];
    for (const item of items) {
      const ri = await pool.query(
        'INSERT INTO receipt_items (receipt_id, list_item_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [receipt.id, item.listItemId || null, item.quantity || 1, item.unitPrice || 0, item.totalPrice || item.unitPrice || 0]
      );
      createdItems.push(ri.rows[0]);
      await pool.query(
        'INSERT INTO price_history (list_item_id, price, currency, store, purchase_date, created_by) VALUES ($1, $2, $3, $4, $5, $6)',
        [item.listItemId || null, item.unitPrice || 0, 'AZN', storeName || 'Unknown', new Date().toISOString().split('T')[0], userId]
      );
    }
    res.status(201).json({ session: { ...receipt, items: createdItems } });
  } catch (error) {
    console.error('Create purchase session error:', error);
    res.status(500).json({ error: 'Failed to create purchase session', message: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT r.*, u.name as user_name FROM receipts r LEFT JOIN users u ON r.user_id = u.id WHERE r.user_id = $1 AND r.status = $2 ORDER BY r.created_at DESC',
      [userId, 'purchased']
    );
    const sessions = [];
    for (const row of result.rows) {
      const itemsResult = await pool.query('SELECT ri.*, li.name, li.category FROM receipt_items ri LEFT JOIN list_items li ON ri.list_item_id = li.id WHERE ri.receipt_id = $1 ORDER BY ri.created_at', [row.id]);
      sessions.push({ ...row, items: itemsResult.rows });
    }
    res.json({ sessions });
  } catch (error) {
    console.error('Get purchase sessions error:', error);
    res.status(500).json({ error: 'Failed to get purchase sessions', message: error.message });
  }
});

module.exports = router;
