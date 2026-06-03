const {Client} = require('pg');

const c = new Client({host:'localhost',database:'grocerymind',user:'postgres',password:'postgres'});

async function checkAndFix() {
  try {
    await c.connect();
    
    // Check foreign key constraints on list_items
    const fkResult = await c.query(`
      SELECT 
        tc.table_name, 
        tc.constraint_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS ccu 
        ON tc.constraint_name = ccu.constraint_name 
      WHERE tc.table_name = 'list_items' AND tc.constraint_type = 'FOREIGN KEY'
    `);
    
    console.log('Foreign keys on list_items:');
    fkResult.rows.forEach(r => {
      console.log(`  ${r.table_name}.${r.column_name} -> ${r.foreign_table_name}.${r.foreign_column_name}`);
    });
    
    // Drop the list_items_list_id_fkey constraint and recreate it
    await c.query('ALTER TABLE list_items DROP CONSTRAINT IF EXISTS list_items_list_id_fkey');
    console.log('Dropped list_items_list_id_fkey constraint');
    
    // Recreate the constraint pointing to grocery_lists
    await c.query(`
      ALTER TABLE list_items 
      ADD CONSTRAINT list_items_list_id_fkey 
      FOREIGN KEY (list_id) REFERENCES grocery_lists(id)
    `);
    console.log('Recreated list_items_list_id_fkey constraint pointing to grocery_lists(id)');
    
    console.log('Fix applied!');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await c.end();
  }
}

checkAndFix();