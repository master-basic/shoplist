const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../auth');
const { categorizeItem, autoCategorizeItems } = require('../utils/categorizer');

router.use(authenticateToken);

router.post('/categorize', (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'items array is required' });
    }
    const categorized = autoCategorizeItems(items);
    res.json({ items: categorized });
  } catch (error) {
    console.error('Categorize error:', error);
    res.status(500).json({ error: 'Failed to categorize items', message: error.message });
  }
});

router.get('/categories', (req, res) => {
  const { categoryRules } = require('../utils/categorizer');
  const categories = [...new Set(categoryRules.map(r => r.category))];
  res.json({ categories });
});

module.exports = router;
