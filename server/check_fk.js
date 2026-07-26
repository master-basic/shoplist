const { Pool } = require('pg');
const pool = new Pool({
  user: 'grocerymind_user',
  host: 'localhost',
  database: 'grocerymind',
  password: 'grocerymind_dev',
  port: 5432
});

async function main() {
  const cols = await pool.query(
    "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'price_history' ORDER BY ordinal_position"
  );
  console.log('price_history columns:', JSON.stringify(cols.rows, null, 2));
  await pool.end();
}
main().catch(e => { console.error(e.message); process.exit(1); });
