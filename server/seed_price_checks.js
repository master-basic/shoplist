const { Client } = require('pg');
const client = new Client({
  user: 'grocerymind_user',
  host: 'localhost',
  database: 'grocerymind',
  password: 'grocerymind_dev',
  port: 5432
});

const seedData = [
  { product_name: 'Nestle Nesquik Şokoladlı Səhər Yeməyi 310 qr', store: 'Bravo', price: 7.98, category: 'Grain Products and Cereals', unit: '1 əd.' },
  { product_name: 'Nestle Xrutka Duo Süt və Qaşıq Yeməyi 230qr', store: 'Bravo', price: 2.49, category: 'Grain Products and Cereals', unit: '1 əd.' },
  { product_name: 'Nestle Xrutka Qara Yemək Lopaları 320qr', store: 'Bravo', price: 4.49, category: 'Grain Products and Cereals', unit: '1 əd.' },
  { product_name: 'Nestle Nesquik Mix Süt və Qaşıq Yeməyi 225qr', store: 'Bravo', price: 5.59, category: 'Grain Products and Cereals', unit: '1 əd.' },
  { product_name: 'Coolsy Cola 2L', store: 'Bravo', price: 1.99, category: 'Non-alcoholic Beverages', unit: '2 L' },
  { product_name: 'Toyuq yumurtası (Eggs) 10lu', store: 'Bravo', price: 2.39, category: 'Dairy Products', unit: '10 əd.' },
  { product_name: 'Toyuq döş filesi (Chicken breast)', store: 'Bravo', price: 8.99, category: 'Fresh Meat and Poultry', unit: '1 kq' },
  { product_name: 'Armudu Earl Grey Qara Cay 225 Qr', store: 'Bravo', price: 3.49, category: 'Non-alcoholic Beverages', unit: '225 qr' },
  { product_name: 'Kahı (Lettuce)', store: 'Bravo', price: 1.29, category: 'Produce', unit: '1 əd.' },
  { product_name: 'Şəkər (Sugar) 1kg', store: 'Bravo', price: 1.89, category: 'Pantry', unit: '1 kq' },
  { product_name: 'Nestle Nesquik Şokoladlı Səhər Yeməyi 310 qr', store: 'Araz', price: 8.50, category: 'Grain Products and Cereals', unit: '1 əd.' },
  { product_name: 'Coolsy Cola 2L', store: 'Araz', price: 1.79, category: 'Non-alcoholic Beverages', unit: '2 L' },
  { product_name: 'Toyuq yumurtası (Eggs) 10lu', store: 'Araz', price: 2.59, category: 'Dairy Products', unit: '10 əd.' },
  { product_name: 'Şəkər (Sugar) 1kg', store: 'Araz', price: 2.10, category: 'Pantry', unit: '1 kq' },
  { product_name: 'Toyuq döş filesi (Chicken breast)', store: 'Araz', price: 9.49, category: 'Fresh Meat and Poultry', unit: '1 kq' },
];

async function main() {
  await client.connect();
  // Run migration
  const fs = require('fs');
  const migration = fs.readFileSync(require('path').join(__dirname, 'migrations', '002_create_price_checks.sql'), 'utf-8');
  await client.query(migration);
  console.log('Migration 002_create_price_checks.sql applied');

  // Seed data
  for (const row of seedData) {
    await client.query(
      'INSERT INTO price_checks (product_name, store, price, currency, category, unit) VALUES ($1, $2, $3, $4, $5, $6)',
      [row.product_name, row.store, row.price, 'AZN', row.category, row.unit]
    );
  }
  console.log(`Seeded ${seedData.length} price check records`);

  // Refresh materialized view
  await client.query('REFRESH MATERIALIZED VIEW CONCURRENTLY latest_prices');
  console.log('Materialized view refreshed');

  await client.end();
}
main().catch(e => { console.error(e.message); process.exit(1); });
