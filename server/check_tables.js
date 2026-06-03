const {Client} = require('pg');

const c = new Client({user: 'postgres', host: 'localhost', database: 'grocerymind', password: 'postgres'});

async function checkTables() {
  try {
    await c.connect();
    const result = await c.query('SELECT tablename FROM pg_tables WHERE schemaname = $1 ORDER BY tablename', ['public']);
    console.log('Tables in database:');
    console.log(JSON.stringify(result.rows, null, 2));
    
    await c.end();
  } catch (err) {
    console.error('Error:', err);
    await c.end();
    process.exit(1);
  }
}

checkTables();