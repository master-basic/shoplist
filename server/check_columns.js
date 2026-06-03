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
    
    // Check grocery_lists columns
    const res = await c.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'grocery_lists' 
      ORDER BY ordinal_position
    `);
    console.log('grocery_lists columns:', JSON.stringify(res.rows, null, 2));
    
    // Check if description column exists
    const hasDescription = res.rows.some(r => r.column_name === 'description');
    if (!hasDescription) {
      await c.query(`
        ALTER TABLE grocery_lists 
        ADD COLUMN IF NOT EXISTS description TEXT
      `);
      console.log('Added description column');
    }
    
    await c.end();
  } catch (error) {
    console.error('Error:', error);
  }
})();