const {Client} = require('pg');

const c = new Client({
  host: 'localhost',
  database: 'grocerymind',
  user: 'postgres',
  password: 'postgres'
});

(async () => {
  try {
    await c.connect();
    const householdId = 'e4f10c80-62f3-4374-9666-7342dbf9704d';
    const res = await c.query(`SELECT * FROM grocery_lists WHERE household_id = $1`, [householdId]);
    console.log('Grocery lists for Main Household:', JSON.stringify(res.rows, null, 2));
    
    await c.end();
  } catch (error) {
    console.error('Error:', error);
  }
})();