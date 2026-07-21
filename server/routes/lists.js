const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../auth');
const { broadcastToHousehold } = require('../ws');

const router = express.Router();

router.use(authenticateToken);

async function getHouseholdId(listId) {
  const result = await pool.query('SELECT household_id FROM grocery_lists WHERE id = $1', [listId]);
  return result.rows[0]?.household_id;
}

router.post('/', async (req, res) => {
  try {
    const { householdId, name, items, userId } = req.body;
    if (!householdId || !name) return res.status(400).json({ error: 'householdId and name are required' });
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const result = await pool.query(
      'INSERT INTO grocery_lists (household_id, name, created_by) VALUES ($1, $2, $3) RETURNING *',
      [householdId, name, userId]
    );
    const listId = result.rows[0].id;
    await pool.query(
      'INSERT INTO lists (id, household_id, name, created_by) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
      [listId, householdId, name, userId]
    );
    if (items && items.length > 0) {
      for (const item of items) {
        await pool.query(
          'INSERT INTO list_items (list_id, name, quantity, unit_price, category, is_checked, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [listId, item.name, item.quantity || 1, item.unitPrice || 0, item.category || 'Other', item.isChecked || false, userId]
        );
      }
    }
    broadcastToHousehold(householdId, { type: 'list_created', payload: { list: result.rows[0] } });
    res.status(201).json({ list: result.rows[0], message: 'Grocery list created successfully' });
  } catch (error) {
    console.error('Create list error:', error);
    res.status(500).json({ error: 'Failed to create list', message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { householdId } = req.query;
    let query = `SELECT gl.*,
       COALESCE(ARRAY_AGG(DISTINCT li.id) FILTER (WHERE li.id IS NOT NULL), '{}') as item_ids,
       COALESCE(ARRAY_AGG(DISTINCT li.name) FILTER (WHERE li.name IS NOT NULL), '{}') as item_names,
       COALESCE(ARRAY_AGG(DISTINCT li.quantity) FILTER (WHERE li.quantity IS NOT NULL), '{}') as item_quantities
       FROM grocery_lists gl
       JOIN user_households uh ON gl.household_id = uh.household_id
       LEFT JOIN list_items li ON gl.id = li.list_id`;
    const params = [];
    if (householdId) {
      query += ' WHERE gl.household_id = $1';
      params.push(householdId);
    }
    query += ' GROUP BY gl.id ORDER BY gl.created_at DESC';
    const result = await pool.query(query, params);
    res.json({ lists: result.rows });
  } catch (error) {
    console.error('Get lists error:', error);
    res.status(500).json({ error: 'Failed to get lists', message: error.message });
  }
});

router.get('/my', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    const listsResult = await pool.query(
      `SELECT gl.id, gl.name, gl.household_id, gl.created_by,
               gl.created_at, gl.updated_at,
               (SELECT COUNT(*) FROM list_items li WHERE li.list_id = gl.id AND li.is_checked = FALSE) as total_items,
               (SELECT COUNT(*) FROM list_items li WHERE li.list_id = gl.id AND li.is_checked = TRUE) as completed_items,
               (SELECT COUNT(*) FROM list_items li WHERE li.list_id = gl.id) as total_items_count
       FROM grocery_lists gl
       JOIN user_households uh ON gl.household_id = uh.household_id
       WHERE uh.user_id = $1
       ORDER BY gl.created_at DESC`,
      [userId]
    );
    const listsWithItems = [];
    for (const list of listsResult.rows) {
      const itemsResult = await pool.query('SELECT * FROM list_items WHERE list_id = $1 ORDER BY created_at', [list.id]);
      listsWithItems.push({ ...list, items: itemsResult.rows });
    }
    res.json({ lists: listsWithItems });
  } catch (error) {
    console.error('Get my lists error:', error?.message || error, error?.stack);
    res.status(500).json({ error: 'Failed to get lists', message: error?.message || String(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM grocery_lists WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'List not found' });
    const itemsResult = await pool.query('SELECT * FROM list_items WHERE list_id = $1', [id]);
    res.json({ list: result.rows[0], items: itemsResult.rows });
  } catch (error) {
    console.error('Get list error:', error);
    res.status(500).json({ error: 'Failed to get list', message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, householdId } = req.body;
    const result = await pool.query(
      'UPDATE grocery_lists SET name = COALESCE($1, name), household_id = COALESCE($2, household_id), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, householdId, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'List not found' });
    broadcastToHousehold(result.rows[0].household_id, { type: 'list_updated', payload: { id, list: result.rows[0] } });
    res.json({ list: result.rows[0], message: 'List updated successfully' });
  } catch (error) {
    console.error('Update list error:', error);
    res.status(500).json({ error: 'Failed to update list', message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const householdId = await getHouseholdId(id);
    await pool.query('DELETE FROM grocery_lists WHERE id = $1', [id]);
    if (householdId) broadcastToHousehold(householdId, { type: 'list_deleted', payload: { id } });
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Delete list error:', error);
    res.status(500).json({ error: 'Failed to delete list', message: error.message });
  }
});

router.get('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM list_items WHERE list_id = $1 ORDER BY created_at', [id]);
    res.json({ items: result.rows });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to get items', message: error.message });
  }
});

router.post('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, unitPrice, category, isChecked, unit } = req.body;
    const userId = req.body.createdBy || req.user.id;
    const result = await pool.query(
      'INSERT INTO list_items (list_id, name, quantity, unit_price, category, is_checked, created_by, unit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id, name, quantity || 1, unitPrice || 0, category || 'Other', isChecked || false, userId, unit || 'pcs']
    );
    const householdId = await getHouseholdId(id);
    if (householdId) broadcastToHousehold(householdId, { type: 'item_added', payload: { listId: id, item: result.rows[0] } });
    res.status(201).json({ item: result.rows[0], message: 'Item added successfully' });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Failed to create item', message: error.message });
  }
});

router.put('/:listId/items/:itemId', async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const { name, quantity, unitPrice, category, isChecked, unit } = req.body;
    const result = await pool.query(
      `UPDATE list_items SET name = COALESCE($1, name), quantity = COALESCE($2, quantity),
       unit_price = COALESCE($3, unit_price), category = COALESCE($4, category),
       is_checked = COALESCE($5, is_checked), unit = COALESCE($6, unit),
       updated_at = CURRENT_TIMESTAMP WHERE id = $7 AND list_id = $8 RETURNING *`,
      [name, quantity, unitPrice, category, isChecked, unit, itemId, listId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    const householdId = await getHouseholdId(listId);
    if (householdId) broadcastToHousehold(householdId, { type: 'item_updated', payload: { listId, itemId, item: result.rows[0] } });
    res.json({ item: result.rows[0], message: 'Item updated successfully' });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Failed to update item', message: error.message });
  }
});

router.delete('/:listId/items/:itemId', async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    await pool.query('DELETE FROM list_items WHERE id = $1 AND list_id = $2', [itemId, listId]);
    const householdId = await getHouseholdId(listId);
    if (householdId) broadcastToHousehold(householdId, { type: 'item_deleted', payload: { listId, itemId } });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Failed to delete item', message: error.message });
  }
});

router.patch('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_checked, isChecked } = req.body;
    const checked = is_checked !== undefined ? is_checked : isChecked;
    const result = await pool.query(
      'UPDATE list_items SET is_checked = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [checked, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    const listId = result.rows[0].list_id;
    const householdId = await getHouseholdId(listId);
    if (householdId) broadcastToHousehold(householdId, { type: 'item_toggled', payload: { listId, itemId: id, item: result.rows[0] } });
    res.json({ item: result.rows[0], message: 'Item toggled successfully' });
  } catch (error) {
    console.error('Toggle item error:', error);
    res.status(500).json({ error: 'Failed to toggle item', message: error.message });
  }
});

router.get('/recurring/:householdId', async (req, res) => {
  try {
    const { householdId } = req.params;
    const result = await pool.query(
      `SELECT li.* FROM list_items li
       JOIN grocery_lists gl ON li.list_id = gl.id
       WHERE gl.household_id = $1 AND li.is_recurring = TRUE
       ORDER BY li.name`,
      [householdId]
    );
    res.json({ items: result.rows });
  } catch (error) {
    console.error('Get recurring items error:', error);
    res.status(500).json({ error: 'Failed to get recurring items', message: error.message });
  }
});

router.patch('/items/:id/recurring', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_recurring } = req.body;
    const result = await pool.query(
      'UPDATE list_items SET is_recurring = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [is_recurring, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    const listId = result.rows[0].list_id;
    const householdId = await getHouseholdId(listId);
    if (householdId) broadcastToHousehold(householdId, { type: 'item_updated', payload: { listId, itemId: id, item: result.rows[0] } });
    res.json({ item: result.rows[0], message: 'Recurring flag updated' });
  } catch (error) {
    console.error('Update recurring error:', error);
    res.status(500).json({ error: 'Failed to update recurring flag', message: error.message });
  }
});

router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT COUNT(*) as total_items, COUNT(*) FILTER (WHERE is_checked = TRUE) as completed_items,
       COUNT(*) FILTER (WHERE is_checked = FALSE) as pending_items,
       COALESCE(SUM(unit_price * quantity), 0) as total_estimated_cost,
       COALESCE(SUM(unit_price * quantity) FILTER (WHERE is_checked = TRUE), 0) as total_actual_cost
       FROM list_items WHERE list_id = $1`,
      [id]
    );
    res.json({ stats: result.rows[0] });
  } catch (error) {
    console.error('Get list stats error:', error);
    res.status(500).json({ error: 'Failed to get list stats', message: error.message });
  }
});

module.exports = router;
