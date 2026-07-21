const express = require('express');
const pool = require('../db');
const upload = require('../upload');
const { authenticateToken } = require('../auth');

const router = express.Router();

router.use(authenticateToken);

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = req.file.path;
    const filename = req.file.filename;
    res.json({ filePath, filename, url: `/uploads/${filename}`, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { householdId, listId, name, totalAmount, currency, imageUrl, ocrData, status, items, userId } = req.body;
    const result = await pool.query(
      'INSERT INTO receipts (household_id, list_id, user_id, name, total_amount, currency, image_url, ocr_data, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [householdId, listId || null, userId || null, name, totalAmount || null, currency || 'AZN', imageUrl || null, ocrData ? JSON.stringify(ocrData) : null, status || 'pending']
    );
    const receiptId = result.rows[0].id;
    if (items && items.length > 0) {
      for (const item of items) {
        await pool.query(
          'INSERT INTO receipt_items (receipt_id, list_item_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5)',
          [receiptId, item.listItemId || null, item.quantity, item.unitPrice, item.totalPrice]
        );
      }
    }
    res.status(201).json({ receipt: result.rows[0], message: 'Receipt created successfully' });
  } catch (error) {
    console.error('Create receipt error:', error);
    res.status(500).json({ error: 'Failed to create receipt', message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT r.*, u.name as user_name FROM receipts r JOIN users u ON r.user_id = u.id WHERE r.id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Receipt not found' });
    const itemsResult = await pool.query('SELECT * FROM receipt_items WHERE receipt_id = $1 ORDER BY created_at', [id]);
    res.json({ receipt: result.rows[0], items: itemsResult.rows });
  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({ error: 'Failed to get receipt', message: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { householdId } = req.query;
    let query = 'SELECT r.*, u.name as user_name FROM receipts r JOIN users u ON r.user_id = u.id WHERE r.user_id = $1';
    const params = [userId];
    if (householdId) { query += ' AND r.household_id = $2'; params.push(householdId); }
    query += ' ORDER BY r.created_at DESC';
    const result = await pool.query(query, params);
    res.json({ receipts: result.rows });
  } catch (error) {
    console.error('Get user receipts error:', error);
    res.status(500).json({ error: 'Failed to get receipts', message: error.message });
  }
});

router.get('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM receipt_items WHERE receipt_id = $1 ORDER BY created_at', [id]);
    res.json({ items: result.rows });
  } catch (error) {
    console.error('Get receipt items error:', error);
    res.status(500).json({ error: 'Failed to get items', message: error.message });
  }
});

router.post('/batch-items', async (req, res) => {
  try {
    const { receiptId, items } = req.body;
    if (!receiptId || !items || !Array.isArray(items)) return res.status(400).json({ error: 'receiptId and items array are required' });
    const createdItems = [];
    for (const item of items) {
      const result = await pool.query(
        'INSERT INTO receipt_items (receipt_id, list_item_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [receiptId, item.listItemId || null, item.quantity, item.unitPrice, item.totalPrice]
      );
      createdItems.push(result.rows[0]);
    }
    res.json({ items: createdItems, message: 'Receipt items created successfully' });
  } catch (error) {
    console.error('Batch create items error:', error);
    res.status(500).json({ error: 'Failed to create receipt items', message: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE receipts SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Receipt not found' });
    res.json({ receipt: result.rows[0], message: 'Receipt updated successfully' });
  } catch (error) {
    console.error('Update receipt error:', error);
    res.status(500).json({ error: 'Failed to update receipt', message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM receipts WHERE id = $1', [id]);
    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    console.error('Delete receipt error:', error);
    res.status(500).json({ error: 'Failed to delete receipt', message: error.message });
  }
});

module.exports = router;
