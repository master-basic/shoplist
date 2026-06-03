const {Client} = require('pg');

const c = new Client({user: 'postgres', host: 'localhost', database: 'grocerymind', password: 'postgres'});

async function migrateUsers() {
  try {
    await c.connect();
    console.log('Starting users table migration...');
    
    // Drop existing users table (will cascade to user_households)
    await c.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('Dropped users table');
    
    // Create new users table with username
    await c.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        password_plaintext VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        name VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        preferred_currency VARCHAR(10) DEFAULT 'AZN',
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created users table with username column');
    
    // Create indexes
    await c.query('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
    await c.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await c.query('CREATE INDEX IF NOT EXISTS idx_users_id ON users(id)');
    console.log('Created indexes');
    
    // Create demo admin user
    await c.query(`
      INSERT INTO users (username, password_hash, password_plaintext, email, name, is_admin)
      VALUES ('admin', 'admin123', 'admin123', 'admin@example.com', 'Admin User', true)
      ON CONFLICT (username) DO NOTHING
    `);
    console.log('Created demo admin user');
    
    await c.end();
    console.log('');
    console.log('=== MIGRATION COMPLETE ===');
  } catch (err) {
    console.error('Migration failed:', err);
    await c.end();
    process.exit(1);
  }
}

migrateUsers();