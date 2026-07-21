const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { householdId, itemName, store, limit } = req.query;
    let query = `SELECT ph.*, li.name as item_name FROM price_history ph LEFT JOIN list_items li ON ph.list_item_id = li.id`;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (householdId) {
      conditions.push(`ph.list_item_id IN (SELECT li2.id FROM list_items li2 JOIN grocery_lists gl ON li2.list_id = gl.id WHERE gl.household_id = $${paramIndex})`);
      params.push(householdId);
      paramIndex++;
    }
    if (itemName) { conditions.push(`li.name ILIKE $${paramIndex}`); params.push(`%${itemName}%`); paramIndex++; }
    if (store) { conditions.push(`ph.store ILIKE $${paramIndex}`); params.push(`%${store}%`); paramIndex++; }

    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY ph.purchase_date DESC';
    if (limit) { query += ` LIMIT $${paramIndex}`; params.push(parseInt(limit)); }

    const result = await pool.query(query, params);
    res.json({ priceHistory: result.rows });
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({ error: 'Failed to get price history', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { listItemId, price, currency, store, purchaseDate, createdBy } = req.body;
    if (!listItemId || price === undefined) return res.status(400).json({ error: 'listItemId and price are required' });
    const result = await pool.query(
      'INSERT INTO price_history (list_item_id, price, currency, store, purchase_date, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [listItemId, price, currency || 'AZN', store || 'Unknown', purchaseDate || new Date().toISOString().split('T')[0], createdBy]
    );
    res.status(201).json({ priceEntry: result.rows[0], message: 'Price entry created successfully' });
  } catch (error) {
    console.error('Create price history error:', error);
    res.status(500).json({ error: 'Failed to create price entry', message: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { itemName } = req.query;
    if (!itemName) return res.status(400).json({ error: 'itemName query parameter is required' });
    const result = await pool.query(
      `SELECT COUNT(*) as count, MIN(ph.price) as min_price, MAX(ph.price) as max_price, AVG(ph.price) as avg_price, array_agg(DISTINCT ph.store) as stores
       FROM price_history ph LEFT JOIN list_items li ON ph.list_item_id = li.id WHERE li.name ILIKE $1`,
      [`%${itemName}%`]
    );
    const stats = result.rows[0];
    const cheapestResult = await pool.query(
      'SELECT ph.store, ph.price FROM price_history ph LEFT JOIN list_items li ON ph.list_item_id = li.id WHERE li.name ILIKE $1 ORDER BY ph.price ASC LIMIT 1',
      [`%${itemName}%`]
    );
    stats.cheapest_store = cheapestResult.rows[0]?.store || null;
    stats.cheapest_price = cheapestResult.rows[0]?.price || null;
    res.json({ stats });
  } catch (error) {
    console.error('Get price stats error:', error);
    res.status(500).json({ error: 'Failed to get price stats', message: error.message });
  }
});

router.post('/best-deals', async (req, res) => {
  try {
    const { itemNames } = req.body;
    if (!itemNames || !Array.isArray(itemNames) || itemNames.length === 0) return res.json({ deals: {} });
    const deals = {};
    for (const name of itemNames) {
      const result = await pool.query(
        `SELECT DISTINCT ON (li.name) li.name as item_name, ph.store, ph.price
         FROM price_history ph JOIN list_items li ON ph.list_item_id = li.id
         WHERE LOWER(li.name) = LOWER($1) ORDER BY li.name, ph.price ASC LIMIT 1`,
        [name]
      );
      if (result.rows.length > 0) {
        deals[name] = { store: result.rows[0].store, price: parseFloat(result.rows[0].price) };
      }
    }
    res.json({ deals });
  } catch (error) {
    console.error('Get best deals error:', error);
    res.status(500).json({ error: 'Failed to get best deals', message: error.message });
  }
});

router.get('/alerts', async (req, res) => {
  try {
    const { userId, threshold } = req.query;
    const pctThreshold = parseFloat(String(threshold)) || 5;
    let result;
    if (userId) {
      result = await pool.query(
        `SELECT ph.*, li.name as item_name FROM price_history ph LEFT JOIN list_items li ON ph.list_item_id = li.id WHERE ph.created_by = $1 ORDER BY li.name, ph.purchase_date DESC`,
        [userId]
      );
    } else {
      result = await pool.query(`SELECT ph.*, li.name as item_name FROM price_history ph LEFT JOIN list_items li ON ph.list_item_id = li.id ORDER BY li.name, ph.purchase_date DESC`);
    }
    const byItem = {};
    for (const row of result.rows) {
      const name = (row.item_name || 'unknown').toLowerCase().trim();
      if (!byItem[name]) byItem[name] = { prices: [], latest: { store: row.store, price: parseFloat(row.price), date: row.purchase_date }, store: row.store };
      if (byItem[name].prices.length < 10) byItem[name].prices.push(parseFloat(row.price));
    }
    const alerts = [];
    for (const [name, data] of Object.entries(byItem)) {
      if (data.prices.length < 2) continue;
      const avg = data.prices.reduce((a, b) => a + b, 0) / data.prices.length;
      const change = ((data.latest.price - avg) / avg) * 100;
      if (Math.abs(change) >= pctThreshold) {
        alerts.push({ itemName: name, store: data.latest.store, currentPrice: data.latest.price, averagePrice: Math.round(avg * 100) / 100, changePercent: Math.round(change * 10) / 10, direction: change > 0 ? 'up' : 'down', lastPurchased: data.latest.date });
      }
    }
    alerts.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
    res.json({ alerts });
  } catch (error) {
    console.error('Get price alerts error:', error);
    res.status(500).json({ error: 'Failed to get price alerts', message: error.message });
  }
});

module.exports = router;
