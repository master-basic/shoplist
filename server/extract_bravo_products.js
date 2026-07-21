// Extract products from Wolt category pages
// Usage: node extract_bravo_products.js

const fs = require('fs');
const path = require('path');

// HTML files
const files = [
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f843a0d1a3001e8q8s6x4s4s4s4s',
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f843a0d1a3001e8q8s6x4s4s4s5s',
  'C:\\Users\\admin\\.local\\share\\opencode\\tool-output\\tool_f843a0d1a3001e8q8s6x4s4s4s6s'
];

function extractProducts(html, category) {
  // Look for product data in script tags containing JSON
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
  const products = [];

  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];

    // Look for React Query data with venue-assortment or category-items
    try {
      // Check if this is a script with JSON data
      if (scriptContent.includes('"venue_slug"') || scriptContent.includes('venue-assortment')) {
        const jsonMatch = scriptContent.match(/(\{[\s\S]*?"venue_slug":\s*"[^"]*"[\s\S]*\})/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[1]);

          // Recursively find items in the JSON structure
          function findItems(obj, items = []) {
            if (Array.isArray(obj)) {
              for (const item of obj) {
                if (item && typeof item === 'object') {
                  if (item.name && (item.price || item.price_amount)) {
                    const price = item.price_amount || item.price;
                    const unit = item.unit || item.unit_display || '';
                    const currency = item.currency || 'AZN';

                    products.push({
                      name: item.name,
                      price: parseFloat(price) / 100, // Wolt uses qəpik
                      unit: unit,
                      currency: currency,
                      category: category,
                      store: 'Bravo',
                      source: 'Wolt'
                    });
                  }
                  findItems(item, items);
                }
              }
            } else if (typeof obj === 'object' && obj !== null) {
              findItems(Object.values(obj), items);
            }
            return items;
          }

          findItems(jsonData);
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  return products;
}

// Process each file
const allProducts = [];
files.forEach((file, index) => {
  const categoryNames = ['Təzə Ət və Toyuq Məhsulları', 'Süd Məhsulları', 'Spirtsiz İçkilər'];
  console.log(`Processing ${file}...`);

  try {
    const html = fs.readFileSync(file, 'utf-8');
    const products = extractProducts(html, categoryNames[index]);
    console.log(`Found ${products.length} products in ${categoryNames[index]}`);
    allProducts.push(...products);
  } catch (e) {
    console.error(`Error reading ${file}:`, e.message);
  }
});

// Remove duplicates (same product name)
const uniqueProducts = [];
const seen = new Set();
allProducts.forEach(p => {
  const key = `${p.name}_${p.unit}`;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueProducts.push(p);
  }
});

console.log(`\nTotal unique products: ${uniqueProducts.length}`);

// Write to file
const output = {
  venue: 'Bravo Supermarket Mərdəkan Şosesi',
  store: 'Bravo',
  source: 'Wolt',
  currency: 'AZN',
  products: uniqueProducts
};

fs.writeFileSync(
  'C:\\ailab\\shoplist\\src\\data\\bravo_products.json',
  JSON.stringify(output, null, 2)
);

console.log(`\nProducts saved to: src/data/bravo_products.json`);
