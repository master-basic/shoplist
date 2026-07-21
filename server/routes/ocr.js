const express = require('express');
const router = express.Router();
const { createWorker } = require('tesseract.js');
const upload = require('../upload');
const { authenticateToken } = require('../auth');
const { matchReceiptItems } = require('../matcher');
const pool = require('../db');

router.use(authenticateToken);

let worker = null;
let workerReady = false;

async function getWorker() {
  if (worker && workerReady) return worker;
  if (worker) {
    try { await worker.terminate(); } catch (_) {}
  }
  worker = await createWorker('eng', 1, {
    logger: m => { if (m.status === 'recognizing text') {} }
  });
  workerReady = true;
  return worker;
}

function parseReceiptText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const items = [];
  let storeName = 'Unknown Store';
  let subtotal = 0, tax = 0, total = 0;
  let idCounter = 0;

  const storeKeywords = /(market|store|pharmacy|shop|mart|walmart|target|cvs|walgreens|kroger|aldi|lidl|publix|costco|whole foods|safeway|wegmans|giant|stop.?shop|acme|food.?lion|supermarket)/i;
  const dateRegex = /(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/;
  const priceRegex = /^\d+[.,]\d{2}$/;
  const lineItemRegex = /^(.+?)\s+(\d+[.,]\d{2})\s*$/;
  const qtyItemRegex = /^(.+?)\s+(\d+)\s*x\s*(\d+[.,]\d{2})\s+(\d+[.,]\d{2})\s*$/i;
  const totalLabelRegex = /^(subtotal|sub.?total|tax|total|vat|sale.?total|amount.?due|grand.?total)/i;
  const storeLineRegex = /^[A-Z][A-Za-z\s&.'-]+$/;

  function parsePrice(s) {
    return parseFloat(s.replace(',', '.'));
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const storeMatch = line.match(storeKeywords);
    if (storeMatch && i < 3) {
      storeName = line;
      i++;
      continue;
    }

    if (i < 4 && storeLineRegex.test(line) && line.length > 3 && !priceRegex.test(line)) {
      storeName = line;
      i++;
      continue;
    }

    if (dateRegex.test(line)) {
      i++;
      continue;
    }

    const totalMatch = line.match(totalLabelRegex);
    if (totalMatch) {
      const label = totalMatch[1].toLowerCase().replace(/[\s.]+/g, '');
      const numMatch = line.match(priceRegex);
      const value = numMatch ? parsePrice(numMatch[0]) : 0;
      if (label.includes('subtotal')) subtotal = value;
      else if (label === 'tax' || label === 'vat') tax = value;
      else if (label === 'total' || label === 'saletotal' || label === 'amountdue' || label === 'grandtotal') total = value;
      i++;
      continue;
    }

    const qtyMatch = line.match(qtyItemRegex);
    if (qtyMatch && qtyMatch[1].trim().length > 1) {
      idCounter++;
      items.push({
        id: `item-${idCounter}`,
        name: qtyMatch[1].trim(),
        quantity: parseInt(qtyMatch[2], 10),
        unitPrice: parsePrice(qtyMatch[3]),
        totalPrice: parsePrice(qtyMatch[4])
      });
      i++;
      continue;
    }

    const itemMatch = line.match(lineItemRegex);
    if (itemMatch) {
      const name = itemMatch[1].trim();
      const price = parsePrice(itemMatch[2]);
      if (name.length > 1 && !name.match(/^\d+$/) && !name.match(totalLabelRegex)) {
        idCounter++;
        items.push({ id: `item-${idCounter}`, name, quantity: 1, unitPrice: price, totalPrice: price });
      }
      i++;
      continue;
    }

    i++;
  }

  if (total === 0 && items.length > 0) {
    total = items.reduce((sum, i) => sum + i.totalPrice, 0);
  }

  return { storeName, date: new Date().toISOString(), items, subtotal, tax, total };
}

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const ocrWorker = await getWorker();
    const { data } = await ocrWorker.recognize(req.file.path);
    const parsed = parseReceiptText(data.text);
    let items = parsed.items;
    if (req.body.householdId) {
      items = await matchReceiptItems(items, req.body.householdId, pool);
    }
    const result = {
      ...parsed,
      items,
      confidence: Math.round((data.confidence || 0) * 100) / 100,
      imageUrl: req.file.filename ? `/uploads/${req.file.filename}` : null
    };

    res.json({ ocrResult: result });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ error: 'Failed to process OCR', message: error.message });
  }
});

module.exports = router;
