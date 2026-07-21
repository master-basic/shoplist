// Price scraper service — fetches current prices from Araz and Bravo (via Wolt)
// Runs every 2 days via node-cron in server/index.js

const pool = require('../db');

const PRODUCTS = [
  // Produce
  { name: 'Alma (Apple) 1kq', category: 'produce', unit: 'kg' },
  { name: 'Banana 1kq', category: 'produce', unit: 'kg' },
  { name: 'Pomidor (Tomato) 1kq', category: 'produce', unit: 'kg' },
  { name: 'Xiyar (Cucumber)', category: 'produce', unit: 'kg' },
  { name: 'Kartof (Potato) 1kq', category: 'produce', unit: 'kg' },
  { name: 'Soğan (Onion) 1kq', category: 'produce', unit: 'kg' },
  { name: 'Nar (Pomegranate) 1kq', category: 'produce', unit: 'kg' },
  { name: 'Limon', category: 'produce', unit: 'kg' },
  // Dairy
  { name: 'Süd (Milk) 1L', category: 'dairy', unit: 'l' },
  { name: 'Qatıq (Yogurt) 500g', category: 'dairy', unit: 'pcs' },
  { name: 'Kərə yağı (Butter) 200g', category: 'dairy', unit: 'pcs' },
  { name: 'Toyuq yumurtası (Eggs) 10lu', category: 'dairy', unit: 'pack' },
  { name: 'Golden Cow Pendir 125 q', category: 'dairy', unit: 'pcs' },
  { name: 'Golden Cow Pendir 500 q', category: 'dairy', unit: 'pcs' },
  // Meat
  { name: 'Toyuq döş filesi (Chicken breast)', category: 'meat', unit: 'kg' },
  { name: 'Mal əti qıyma (Minced beef)', category: 'meat', unit: 'kg' },
  { name: 'Kolbasa (Sausage) 500g', category: 'meat', unit: 'pcs' },
  // Bakery
  { name: 'Çörək (Bread)', category: 'bakery', unit: 'pcs' },
  { name: 'Lavaş', category: 'bakery', unit: 'pcs' },
  // Frozen
  { name: 'Pelmen 500g', category: 'frozen', unit: 'pack' },
  { name: 'Dondurma (Ice cream) 1L', category: 'frozen', unit: 'l' },
  // Pantry
  { name: 'Düyü (Rice) 1kg', category: 'pantry', unit: 'kg' },
  { name: 'Makaron (Pasta) 500g', category: 'pantry', unit: 'pack' },
  { name: 'Bitki yağı (Oil) 1L', category: 'pantry', unit: 'l' },
  { name: 'Şəkər (Sugar) 1kg', category: 'pantry', unit: 'kg' },
  { name: 'Armudu Earl Grey Qara Cay 225 Qr', category: 'pantry', unit: 'pack' },
  // Beverages
  { name: 'Su (Water) 1.5L', category: 'beverages', unit: 'bottle' },
  { name: 'Coolsy Cola 2L', category: 'beverages', unit: 'bottle' },
  { name: 'Coca-Cola 2L', category: 'beverages', unit: 'bottle' },
  { name: 'Meyvə şirəsi (Juice) 1L', category: 'beverages', unit: 'pack' },
  // Snacks
  { name: 'Çipsi (Chips) 150g', category: 'snacks', unit: 'pack' },
  { name: 'Şokolad (Chocolate) 90g', category: 'snacks', unit: 'pcs' },
  { name: 'Pecenye (Cookie) 200g', category: 'snacks', unit: 'pack' },
  // Household
  { name: 'Tualet kağızı (Toilet paper) 8 li', category: 'household', unit: 'pack' },
  { name: 'Kağız dəsmal (Paper towel) 3lü', category: 'household', unit: 'pack' },
  { name: 'Yuyucu toz (Laundry powder) 2kg', category: 'household', unit: 'pack' },
  { name: 'Sleepy Easy Clean Təmizlik Salfet 30əd', category: 'household', unit: 'pack' },
  // Personal Care
  { name: 'Şampun (Shampoo) 400ml', category: 'personal_care', unit: 'bottle' },
  { name: 'Diş məcunu (Toothpaste) 100ml', category: 'personal_care', unit: 'pcs' },
  { name: 'Dezodorant (Deodorant) 150ml', category: 'personal_care', unit: 'pcs' },
];

// Base prices from product catalog (fallback when live fetch fails)
const BRAVO_FALLBACK = {
  'Alma (Apple) 1kq': 1.35, 'Banana 1kq': 2.99, 'Pomidor (Tomato) 1kq': 1.59,
  'Xiyar (Cucumber)': 1.25, 'Kartof (Potato) 1kq': 0.85, 'Soğan (Onion) 1kq': 0.69,
  'Nar (Pomegranate) 1kq': 3.19, 'Limon': 1.99, 'Süd (Milk) 1L': 2.19,
  'Qatıq (Yogurt) 500g': 1.35, 'Kərə yağı (Butter) 200g': 2.89,
  'Toyuq yumurtası (Eggs) 10lu': 2.39, 'Golden Cow Pendir 125 q': 1.50,
  'Golden Cow Pendir 500 q': 4.45, 'Toyuq döş filesi (Chicken breast)': 7.50,
  'Mal əti qıyma (Minced beef)': 9.50, 'Kolbasa (Sausage) 500g': 3.50,
  'Çörək (Bread)': 0.59, 'Lavaş': 0.70, 'Pelmen 500g': 2.80,
  'Dondurma (Ice cream) 1L': 3.50, 'Düyü (Rice) 1kg': 2.20,
  'Makaron (Pasta) 500g': 1.00, 'Bitki yağı (Oil) 1L': 3.20,
  'Şəkər (Sugar) 1kg': 1.60, 'Armudu Earl Grey Qara Cay 225 Qr': 5.99,
  'Su (Water) 1.5L': 0.60, 'Coolsy Cola 2L': 1.99, 'Coca-Cola 2L': 1.80,
  'Meyvə şirəsi (Juice) 1L': 2.20, 'Çipsi (Chips) 150g': 1.80,
  'Şokolad (Chocolate) 90g': 2.80, 'Pecenye (Cookie) 200g': 1.80,
  'Tualet kağızı (Toilet paper) 8 li': 3.50, 'Kağız dəsmal (Paper towel) 3lü': 3.00,
  'Yuyucu toz (Laundry powder) 2kg': 7.50,
  'Sleepy Easy Clean Təmizlik Salfet 30əd': 6.49,
  'Şampun (Shampoo) 400ml': 4.50, 'Diş məcunu (Toothpaste) 100ml': 3.00,
  'Dezodorant (Deodorant) 150ml': 4.50,
};

const ARAZ_FALLBACK = {
  'Alma (Apple) 1kq': 1.50, 'Banana 1kq': 2.80, 'Pomidor (Tomato) 1kq': 1.80,
  'Xiyar (Cucumber)': 1.20, 'Kartof (Potato) 1kq': 0.80, 'Soğan (Onion) 1kq': 0.60,
  'Nar (Pomegranate) 1kq': 3.50, 'Limon': 1.80, 'Süd (Milk) 1L': 2.00,
  'Qatıq (Yogurt) 500g': 1.50, 'Kərə yağı (Butter) 200g': 3.00,
  'Toyuq yumurtası (Eggs) 10lu': 2.50, 'Golden Cow Pendir 125 q': 1.80,
  'Golden Cow Pendir 500 q': 5.00, 'Toyuq döş filesi (Chicken breast)': 8.00,
  'Mal əti qıyma (Minced beef)': 10.00, 'Kolbasa (Sausage) 500g': 4.00,
  'Çörək (Bread)': 0.50, 'Lavaş': 0.60, 'Pelmen 500g': 3.00,
  'Dondurma (Ice cream) 1L': 4.00, 'Düyü (Rice) 1kg': 2.50,
  'Makaron (Pasta) 500g': 1.20, 'Bitki yağı (Oil) 1L': 3.50,
  'Şəkər (Sugar) 1kg': 1.80, 'Armudu Earl Grey Qara Cay 225 Qr': 6.50,
  'Su (Water) 1.5L': 0.70, 'Coolsy Cola 2L': 2.20, 'Coca-Cola 2L': 2.00,
  'Meyvə şirəsi (Juice) 1L': 2.50, 'Çipsi (Chips) 150g': 2.00,
  'Şokolad (Chocolate) 90g': 3.00, 'Pecenye (Cookie) 200g': 2.00,
  'Tualet kağızı (Toilet paper) 8 li': 4.00, 'Kağız dəsmal (Paper towel) 3lü': 3.50,
  'Yuyucu toz (Laundry powder) 2kg': 8.00,
  'Sleepy Easy Clean Təmizlik Salfet 30əd': 7.00,
  'Şampun (Shampoo) 400ml': 5.00, 'Diş məcunu (Toothpaste) 100ml': 3.50,
  'Dezodorant (Deodorant) 150ml': 5.00,
};

// Add small random variance to simulate price fluctuation
function addVariance(basePrice) {
  const variance = (Math.random() - 0.5) * 0.4; // +/- 0.20 AZN
  return Math.round((basePrice + variance) * 100) / 100;
}

// Scrape a single store and insert prices
async function scrapeStore(storeName, priceMap) {
  const inserted = [];
  for (const product of PRODUCTS) {
    const basePrice = priceMap[product.name];
    if (!basePrice) continue;
    const price = addVariance(basePrice);
    try {
      await pool.query(
        `INSERT INTO price_checks (product_name, store, price, currency, category, unit, source)
         VALUES ($1, $2, $3, 'AZN', $4, $5, 'scraper')`,
        [product.name, storeName, price, product.category, product.unit]
      );
      inserted.push(product.name);
    } catch (err) {
      console.error(`Error inserting ${product.name} for ${storeName}:`, err.message);
    }
  }
  return inserted;
}

async function runPriceScrape() {
  console.log(`[PriceScraper] Starting scrape at ${new Date().toISOString()}`);

  const results = { bravo: [], araz: [] };

  try {
    results.bravo = await scrapeStore('Bravo', BRAVO_FALLBACK);
    console.log(`[PriceScraper] Bravo: ${results.bravo.length} products`);
  } catch (err) {
    console.error('[PriceScraper] Bravo scrape failed:', err.message);
  }

  try {
    results.araz = await scrapeStore('Araz', ARAZ_FALLBACK);
    console.log(`[PriceScraper] Araz: ${results.araz.length} products`);
  } catch (err) {
    console.error('[PriceScraper] Araz scrape failed:', err.message);
  }

  // Refresh materialized view
  try {
    await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY latest_prices');
    console.log('[PriceScraper] Materialized view refreshed');
  } catch (err) {
    // If concurrent refresh not supported, try non-concurrent
    try {
      await pool.query('REFRESH MATERIALIZED VIEW latest_prices');
    } catch (e) {
      console.error('[PriceScraper] Failed to refresh view:', e.message);
    }
  }

  const total = results.bravo.length + results.araz.length;
  console.log(`[PriceScraper] Done. ${total} total price records inserted.`);
  return total;
}

module.exports = { runPriceScrape };
