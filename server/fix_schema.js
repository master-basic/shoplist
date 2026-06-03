const {Client} = require('pg');

const c = new Client({host:'localhost',database:'grocerymind',user:'postgres',password:'postgres'});

async function fixSchema() {
  try {
    await c.connect();
    
    // Add missing unit_price column to list_items if it doesn't exist
    await c.query(`
      DO $$ BEGIN
        ALTER TABLE list_items ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2) DEFAULT 0;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END $$;
    `);
    console.log('Added unit_price column to list_items');
    
    // Add missing category column if needed
    await c.query(`
      DO $$ BEGIN
        ALTER TABLE list_items ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Other';
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END $$;
    `);
    console.log('Added category column to list_items');
    
    // Add is_checked column
    await c.query(`
      DO $$ BEGIN
        ALTER TABLE list_items ADD COLUMN IF NOT EXISTS is_checked BOOLEAN DEFAULT FALSE;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END $$;
    `);
    console.log('Added is_checked column to list_items');
    
    // Add sort_order column
    await c.query(`
      DO $$ BEGIN
        ALTER TABLE list_items ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END $$;
    `);
    console.log('Added sort_order column to list_items');
    
    // Add is_recurring column
    await c.query(`
      DO $$ BEGIN
        ALTER TABLE list_items ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END $$;
    `);
    console.log('Added is_recurring column to list_items');
    
    console.log('Schema fixes applied successfully!');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await c.end();
  }
}

fixSchema();