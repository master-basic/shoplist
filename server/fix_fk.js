const {Client} = require('pg');

const c = new Client({host:'localhost',database:'grocerymind',user:'postgres',password:'postgres'});

async function fixForeignKey() {
  try {
    await c.connect();
    
    // First, delete any existing list_items that reference a non-existent list
    await c.query('DELETE FROM list_items');
    console.log('Deleted all list_items');
    
    // Drop the existing constraint
    await c.query("ALTER TABLE list_items DROP CONSTRAINT IF EXISTS list_items_list_id_fkey");
    console.log('Dropped existing constraint');
    
    // Recreate the constraint pointing to grocery_lists
    await c.query(`
      ALTER TABLE list_items 
      ADD CONSTRAINT list_items_list_id_fkey 
      FOREIGN KEY (list_id) REFERENCES grocery_lists(id)
      ON DELETE CASCADE
    `);
    console.log('Recreated constraint pointing to grocery_lists(id)');
    
    console.log('Fix complete!');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await c.end();
  }
}

fixForeignKey();