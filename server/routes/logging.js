const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.post('/error', (req, res) => {
  const { message, stack, url, userAgent, context } = req.body;
  logger.error(`[CLIENT] ${message}`, { stack, url, userAgent, context });
  res.json({ ok: true });
});

router.post('/frontend', (req, res) => {
  const { logs } = req.body;
  if (!Array.isArray(logs)) return res.json({ ok: true });
  for (const entry of logs) {
    const level = (entry.level || 'INFO').toLowerCase();
    const line = `[FRONTEND] ${entry.msg}`;
    if (level === 'error') logger.error(line, { data: entry.data, ts: entry.ts });
    else if (level === 'warn') logger.warn(line, { data: entry.data, ts: entry.ts });
    else logger.info(line, { data: entry.data, ts: entry.ts });
  }
  res.json({ ok: true });
});

module.exports = router;
