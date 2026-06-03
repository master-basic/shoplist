const {Client} = require('pg');

const c = new Client({host:'localhost',database:'grocerymind',user:'postgres',password:'postgres'});

async function checkTables() {
  try {
    await c.connect();
    const result = await c.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name');
    console.log('=== TABLES IN DATABASE ===');
    result.rows.forEach(row => console.log(`- ${row.table_name}`));
    
    // Check lists table data
    console.log('\n=== LISTS TABLE ===');
    const lists = await c.query('SELECT * FROM lists');
    console.log('Lists:', lists.rows.length);
    
    console.log('\n=== GROCERY_LISTS TABLE ===');
    const groceryLists = await c.query('SELECT * FROM grocery_lists');
    console.log('Grocery Lists:', groceryLists.rows.length);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await c.end();
  }
}

checkTables();