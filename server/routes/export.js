const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../auth');
const { exportListAsCsv, exportPriceHistoryAsCsv } = require('../utils/exporter');

router.use(authenticateToken);

router.get('/list/:id/csv', async (req, res) => {
  try {
    const result = await exportListAsCsv(req.params.id, pool);
    if (!result) return res.status(404).json({ error: 'List not found' });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.csv);
  } catch (error) {
    console.error('Export list error:', error);
    res.status(500).json({ error: 'Failed to export list', message: error.message });
  }
});

router.get('/price-history/csv', async (req, res) => {
  try {
    const { householdId } = req.query;
    const result = await exportPriceHistoryAsCsv(householdId, pool);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.csv);
  } catch (error) {
    console.error('Export price history error:', error);
    res.status(500).json({ error: 'Failed to export price history', message: error.message });
  }
});

module.exports = router;
