const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  user: 'grocerymind_user',
  host: 'localhost',
  database: 'grocerymind',
  password: 'grocerymind_dev',
  port: 5432
});

async function loadProducts() {
  await client.connect();
  
  const inputPath = path.join(__dirname, 'data', 'all_bravo_products.json');
  const raw = fs.readFileSync(inputPath, 'utf-8');
  const data = JSON.parse(raw);
  
  let inserted = 0;
  for (const p of data.products) {
    try {
      await client.query(
        'INSERT INTO price_checks (product_name, store, price, currency, category, unit) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
        [p.name, p.store, p.price, p.currency || 'AZN', p.category, p.unit_info || '1 əd.']
      );
      inserted++;
    } catch (e) {
      console.log(`Error inserting ${p.name}: ${e.message}`);
    }
  }
  
  console.log(`\nInserted ${inserted} products into price_checks table`);
  
  await client.query('REFRESH MATERIALIZED VIEW CONCURRENTLY latest_prices');
  console.log('Materialized view refreshed');
  
  await client.end();
}

loadProducts().catch(e => { console.error(e.message); process.exit(1); });