const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../auth');

const router = express.Router();

router.use(authenticateToken);

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
    const { listItemId, price, currency, store, purchaseDate, createdBy, itemName, storeName, unitPrice, quantity, purchasedAt } = req.body;
    const finalListItemId = listItemId || null;
    const finalPrice = price !== undefined ? price : (unitPrice !== undefined ? unitPrice : null);
    if (finalPrice === null) return res.status(400).json({ error: 'price or unitPrice is required' });
    const result = await pool.query(
      'INSERT INTO price_history (list_item_id, item_name, store_name, price, unit_price, currency, store, quantity, purchase_date, purchased_at, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [finalListItemId, itemName || null, storeName || null, finalPrice, unitPrice || finalPrice, currency || 'AZN', store || storeName || 'Unknown', quantity || 1, purchaseDate || (purchasedAt ? purchasedAt.split('T')[0] : new Date().toISOString().split('T')[0]), purchasedAt || new Date().toISOString(), createdBy]
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

router.get('/normalized', async (req, res) => {
  try {
    const { itemName, householdId } = req.query;
    if (!itemName) return res.status(400).json({ error: 'itemName query parameter is required' });
    const { normalizeItemPrice } = require('../utils/priceNormalizer');

    let query = `SELECT ph.item_name, ph.unit_price, ph.store_name, ph.quantity, ph.purchased_at
                 FROM price_history ph`;
    const conditions = [`LOWER(ph.item_name) LIKE LOWER($1)`];
    const params = [`%${itemName}%`];
    let paramIndex = 2;

    if (householdId) {
      query += ` JOIN receipts r ON ph.session_id = r.id`;
      conditions.push(`r.household_id = $${paramIndex}`);
      params.push(householdId);
      paramIndex++;
    }

    query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY ph.purchased_at DESC';

    const result = await pool.query(query, params);
    const normalized = result.rows.map(row => {
      const norm = normalizeItemPrice(row.item_name, parseFloat(row.unit_price));
      return {
        originalName: row.item_name,
        storeName: row.store_name,
        originalPrice: norm.originalPrice,
        quantity: norm.quantity,
        rawUnit: norm.rawUnit,
        normalizedPrice: norm.normalizedPrice,
        normalizedUnit: norm.normalizedUnit,
        baseUnit: norm.baseUnit,
        purchasedAt: row.purchased_at,
      };
    });

    res.json({ normalizedPrices: normalized });
  } catch (error) {
    console.error('Normalized prices error:', error);
    res.status(500).json({ error: 'Failed to get normalized prices', message: error.message });
  }
});

router.get('/cheapest-store', async (req, res) => {
  try {
    const { itemNames, listId, householdId } = req.query;
    let items = [];

    if (listId) {
      const itemResult = await pool.query(
        'SELECT id, name, unit_price FROM list_items WHERE list_id = $1 AND name IS NOT NULL AND name != $2',
        [listId, '']
      );
      items = itemResult.rows;
    } else if (itemNames) {
      const names = itemNames.split(',').map(s => s.trim()).filter(Boolean);
      if (names.length > 0) {
        const itemResult = await pool.query(
          'SELECT id, name, unit_price FROM list_items WHERE LOWER(name) = ANY($1)',
          [names.map(n => n.toLowerCase())]
        );
        items = itemResult.rows;
      }
    }

    if (items.length === 0) {
      return res.json({ cheapestStores: [], perItem: [] });
    }

    const perItem = [];
    for (const item of items) {
      const priceResult = await pool.query(
        `SELECT DISTINCT ON (ph.store_name) ph.store_name, ph.unit_price, ph.purchased_at
         FROM price_history ph
         WHERE LOWER(ph.item_name) LIKE LOWER($1)
         ORDER BY ph.store_name, ph.unit_price ASC`,
        [`%${item.name}%`]
      );
      if (priceResult.rows.length > 0) {
        const cheapest = priceResult.rows.reduce((min, r) =>
          parseFloat(r.unit_price) < parseFloat(min.unit_price) ? r : min
        );
        perItem.push({ itemId: item.id, itemName: item.name, cheapestStore: cheapest.store_name, cheapestPrice: parseFloat(cheapest.unit_price), allStores: priceResult.rows.map(r => ({ store: r.store_name, price: parseFloat(r.unit_price), lastSeen: r.purchased_at })) });
      } else {
        perItem.push({ itemId: item.id, itemName: item.name, cheapestStore: null, cheapestPrice: null, allStores: [] });
      }
    }

    const storeTotals = {};
    for (const entry of perItem) {
      if (entry.allStores.length === 0) continue;
      for (const s of entry.allStores) {
        if (!storeTotals[s.store]) storeTotals[s.store] = { store: s.store, totalPrice: 0, itemCount: 0 };
        storeTotals[s.store].totalPrice += s.price;
        storeTotals[s.store].itemCount++;
      }
    }

    const cheapestStores = Object.values(storeTotals)
      .sort((a, b) => {
        const aAvg = a.totalPrice / a.itemCount;
        const bAvg = b.totalPrice / b.itemCount;
        return aAvg - bAvg;
      })
      .map(s => ({ store: s.store, avgItemPrice: Math.round((s.totalPrice / s.itemCount) * 100) / 100, itemCount: s.itemCount }));

    res.json({ cheapestStores, perItem });
  } catch (error) {
    console.error('Cheapest store error:', error);
    res.status(500).json({ error: 'Failed to find cheapest store', message: error.message });
  }
});

module.exports = router;
