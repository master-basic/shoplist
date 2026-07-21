const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  logger.error('FATAL: JWT_SECRET environment variable is required in production');
  process.exit(1);
}

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
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/export', require('./routes/export'));
app.use('/api/log', require('./routes/logging'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let scraperJob = null;
if (process.env.NODE_ENV !== 'test') {
  try {
    const cron = require('node-cron');
    const { runPriceScrape } = require('./scripts/priceScraper');
    scraperJob = cron.schedule('0 3 */2 * *', async () => {
      console.log('[Scheduler] Running scheduled price scrape...');
      try {
        const count = await runPriceScrape();
        console.log(`[Scheduler] Scrape complete: ${count} prices recorded`);
      } catch (err) {
        logger.error('[Scheduler] Scrape failed', { message: err.message });
      }
    });
    console.log('[Scheduler] Price scraper scheduled: every 2 days at 03:00');
  } catch (err) {
    console.warn('[Scheduler] node-cron not available, skipping scheduler:', err.message);
  }
}

app.post('/api/price-check/trigger-scrape', async (req, res) => {
  try {
    const { runPriceScrape } = require('./scripts/priceScraper');
    const count = await runPriceScrape();
    res.json({ success: true, count, message: `Scraped ${count} prices` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  logger.error(`[SERVER] ${req.method} ${req.originalUrl}`, { message: err.message, status: err.status || 500, stack: err.stack });
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const server = http.createServer(app);

const { setupWebSocket } = require('./ws');
setupWebSocket(server);

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    logger.info(`GroceryMind API server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
