const express = require('express');
const router = express.Router();
const { createWorker } = require('tesseract.js');
const upload = require('../upload');

async function parseReceiptText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const items = [];
  let storeName = lines[0] || 'Unknown Store';
  let subtotal = 0;
  let tax = 0;
  let total = 0;
  let idCounter = 0;

  const priceRegex = /^(\d+[.,]\d{2})$/;
  const lineItemRegex = /^(.+?)\s+(\d+[.,]\d{2})\s*$/;
  const qtyItemRegex = /^(.+?)\s+(\d+)\s*x\s*(\d+[.,]\d{2})\s+(\d+[.,]\d{2})\s*$/i;
  const totalLabelRegex = /^(subtotal|sub total|tax|total|vat|sale total|amount due)/i;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    const totalMatch = line.match(totalLabelRegex);
    if (totalMatch) {
      const label = totalMatch[1].toLowerCase().replace(/\s+/g, '');
      const numMatch = line.match(priceRegex);
      const value = numMatch ? parseFloat(numMatch[1].replace(',', '.')) : 0;
      if (label.includes('subtotal') || label === 'subtotal') subtotal = value;
      else if (label === 'tax' || label === 'vat') tax = value;
      else if (label === 'total' || label === 'saletotal' || label === 'amountdue') total = value;
      continue;
    }

    const qtyMatch = line.match(qtyItemRegex);
    if (qtyMatch) {
      idCounter++;
      const name = qtyMatch[1].trim();
      const quantity = parseInt(qtyMatch[2], 10);
      const unitPrice = parseFloat(qtyMatch[3].replace(',', '.'));
      const totalPrice = parseFloat(qtyMatch[4].replace(',', '.'));
      items.push({ id: `item-${idCounter}`, name, quantity, unitPrice, totalPrice });
      continue;
    }

    const itemMatch = line.match(lineItemRegex);
    if (itemMatch) {
      const name = itemMatch[1].trim();
      const price = parseFloat(itemMatch[2].replace(',', '.'));
      if (name.length > 1 && !name.match(/^\d+$/)) {
        idCounter++;
        items.push({ id: `item-${idCounter}`, name, quantity: 1, unitPrice: price, totalPrice: price });
      }
    }
  }

  if (total === 0 && items.length > 0) {
    total = items.reduce((sum, i) => sum + i.totalPrice, 0);
  }

  return { storeName, date: new Date().toISOString(), items, subtotal, tax, total, confidence: 0, imageUrl: null };
}

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const worker = await createWorker('eng');
    const { data } = await worker.recognize(req.file.path);
    await worker.terminate();

    const parsed = parseReceiptText(data.text);
    const result = {
      ...parsed,
      confidence: data.confidence || 0,
      imageUrl: req.file.filename ? `/uploads/${req.file.filename}` : null
    };

    res.json({ ocrResult: result });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ error: 'Failed to process OCR', message: error.message });
  }
});

module.exports = router;
