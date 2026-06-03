const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'grocerymind',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function runMigrations() {
  try {
    await client.connect();
    
    // Drop email column constraint if it exists (for username-based login)
    await client.query(`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS email
    `);
    
    // Add username column if it doesn't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE
    `);
    
    // Add avatar column
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS avatar VARCHAR(500)
    `);
    
    // Create index on username
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
    `);
    
    // Update users table to remove email constraint
    await client.query(`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS users_email_key
    `);
    
    console.log('Migration completed successfully!');
    
    await client.end();
  } catch (err) {
    console.error('Migration failed:', err);
    await client.end();
    process.exit(1);
  }
}

runMigrations();