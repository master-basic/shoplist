require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = require('./db');

app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    res.json({ status: 'ok', message: 'Database connected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', message: error.message });
  }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/households', require('./routes/households'));
app.use('/api/lists', require('./routes/lists'));
app.use('/api/price-history', require('./routes/priceHistory'));
app.use('/api/receipts', require('./routes/receipts'));
app.use('/api/receipts/ocr', require('./routes/ocr'));
app.use('/api/purchase-sessions', require('./routes/purchases'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/price-check', require('./routes/priceCheck'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Price scraper scheduler — runs every 2 days at 03:00
let scraperJob = null;
try {
  const cron = require('node-cron');
  const { runPriceScrape } = require('./scripts/priceScraper');
  scraperJob = cron.schedule('0 3 */2 * *', async () => {
    console.log('[Scheduler] Running scheduled price scrape...');
    try {
      const count = await runPriceScrape();
      console.log(`[Scheduler] Scrape complete: ${count} prices recorded`);
    } catch (err) {
      console.error('[Scheduler] Scrape failed:', err.message);
    }
  });
  console.log('[Scheduler] Price scraper scheduled: every 2 days at 03:00');
} catch (err) {
  console.warn('[Scheduler] node-cron not available, skipping scheduler:', err.message);
}

// Also expose a manual trigger endpoint
app.post('/api/price-check/trigger-scrape', async (req, res) => {
  try {
    const { runPriceScrape } = require('./scripts/priceScraper');
    const count = await runPriceScrape();
    res.json({ success: true, count, message: `Scraped ${count} prices` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`GroceryMind API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;

module.exports = app;
