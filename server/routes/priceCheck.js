const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/price-check/products - all tracked products with latest price per store
router.get('/products', async (req, res) => {
  try {
    const { category, store, search } = req.query;
    let query = `
      SELECT DISTINCT ON (lp.product_name, lp.store)
        lp.id,
        lp.product_name,
        lp.store,
        lp.price,
        lp.currency,
        lp.category,
        lp.unit,
        lp.checked_at
      FROM latest_prices lp
    `;
    const conditions = [];
    const params = [];
    let paramIdx = 1;

    if (category) {
      conditions.push(`lp.category = $${paramIdx++}`);
      params.push(category);
    }
    if (store) {
      conditions.push(`lp.store = $${paramIdx++}`);
      params.push(store);
    }
    if (search) {
      conditions.push(`lp.product_name ILIKE $${paramIdx++}`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY lp.product_name, lp.store';

    const result = await pool.query(query, params);
    res.json({ products: result.rows });
  } catch (err) {
    console.error('Error fetching price check products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/price-check/products/:productName/history - full price history
router.get('/products/:productName/history', async (req, res) => {
  try {
    const { productName } = req.params;
    const { store, days } = req.query;

    let query = `
      SELECT id, product_name, store, price, currency, category, unit, checked_at, source
      FROM price_checks
      WHERE product_name = $1
    `;
    const params = [productName];
    let paramIdx = 2;

    if (store) {
      query += ` AND store = $${paramIdx++}`;
      params.push(store);
    }
    if (days) {
      query += ` AND checked_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
    }

    query += ' ORDER BY checked_at DESC';

    const result = await pool.query(query, params);
    res.json({ history: result.rows });
  } catch (err) {
    console.error('Error fetching price history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// GET /api/price-check/compare - compare prices across stores for a product
router.get('/compare', async (req, res) => {
  try {
    const { productName } = req.query;
    if (!productName) {
      return res.status(400).json({ error: 'productName is required' });
    }

    const result = await pool.query(`
      SELECT lp.*, ph.price AS previous_price, ph.checked_at AS previous_checked_at
      FROM latest_prices lp
      LEFT JOIN LATERAL (
        SELECT price, checked_at
        FROM price_checks pc
        WHERE pc.product_name = lp.product_name
          AND pc.store = lp.store
          AND pc.id != lp.id
        ORDER BY pc.checked_at DESC
        LIMIT 1
      ) ph ON true
      WHERE lp.product_name = $1
      ORDER BY lp.store
    `, [productName]);

    const compare = result.rows.map(r => {
      const change = r.previous_price
        ? ((parseFloat(r.price) - parseFloat(r.previous_price)) / parseFloat(r.previous_price) * 100).toFixed(2)
        : null;
      return {
        ...r,
        change_percent: change ? parseFloat(change) : null,
        trend: change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'same') : 'new',
      };
    });

    res.json({ compare });
  } catch (err) {
    console.error('Error comparing prices:', err);
    res.status(500).json({ error: 'Failed to compare prices' });
  }
});

// GET /api/price-check/trends - price trends for all products
router.get('/trends', async (req, res) => {
  try {
    const { days } = req.query;
    const interval = days ? `${parseInt(days)} days` : '30 days';

    const result = await pool.query(`
      WITH ranked AS (
        SELECT
          pc.product_name,
          pc.store,
          pc.price,
          pc.checked_at,
          ROW_NUMBER() OVER (PARTITION BY pc.product_name, pc.store ORDER BY pc.checked_at DESC) AS rn,
          FIRST_VALUE(pc.price) OVER (PARTITION BY pc.product_name, pc.store ORDER BY pc.checked_at) AS first_price
        FROM price_checks pc
        WHERE pc.checked_at >= NOW() - INTERVAL '${interval}'
      ),
      latest AS (
        SELECT * FROM ranked WHERE rn = 1
      )
      SELECT
        l.product_name,
        l.store,
        l.price AS current_price,
        l.first_price AS period_start_price,
        l.checked_at,
        ROUND(
          ((l.price - l.first_price) / NULLIF(l.first_price, 0)) * 100, 2
        ) AS change_percent
      FROM latest l
      ORDER BY ABS(
        ((l.price - l.first_price) / NULLIF(l.first_price, 0)) * 100
      ) DESC
    `);

    res.json({ trends: result.rows });
  } catch (err) {
    console.error('Error fetching trends:', err);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// GET /api/price-check/stores - list all stores we track
router.get('/stores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT store FROM price_checks ORDER BY store
    `);
    res.json({ stores: result.rows.map(r => r.store) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// GET /api/price-check/categories - list all categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT category FROM price_checks WHERE category IS NOT NULL ORDER BY category
    `);
    res.json({ categories: result.rows.map(r => r.category) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
