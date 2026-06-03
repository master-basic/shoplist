const bcrypt = require('bcryptjs');
const {Client} = require('pg');

const c = new Client({user: 'postgres', host: 'localhost', database: 'grocerymind', password: 'postgres'});

async function resetDemoData() {
  try {
    await c.connect();
    console.log('Resetting demo data...');
    
    // Drop existing users table
    await c.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('Dropped users table');
    
    // Create users table with all columns
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
    console.log('Created users table');
    
    // Create indexes
    await c.query('CREATE INDEX idx_users_username ON users(username)');
    await c.query('CREATE INDEX idx_users_email ON users(email)');
    
    // Create admin user with bcrypt hash
    const passwordHash = bcrypt.hashSync('admin123', 10);
    await c.query(`
      INSERT INTO users (username, password_hash, password_plaintext, email, name, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['admin', passwordHash, 'admin123', 'admin@example.com', 'Admin User', true]);
    console.log('Created admin user');
    
    // Create household
    const adminResult = await c.query('SELECT id FROM users WHERE username = $1', ['admin']);
    const adminId = adminResult.rows[0].id;
    
    await c.query(`
      INSERT INTO households (name, description, created_by)
      VALUES ($1, $2, $3)
    `, ['Main Household', 'Primary household', adminId]);
    console.log('Created household');
    
    const householdResult = await c.query('SELECT id FROM households ORDER BY created_at DESC LIMIT 1');
    const householdId = householdResult.rows[0].id;
    
    await c.query(`
      INSERT INTO user_households (user_id, household_id, role, is_owner)
      VALUES ($1, $2, 'admin', TRUE)
    `, [adminId, householdId]);
    console.log('Created household membership');
    
    // Create lists and items
    const lists = [
      { name: 'Weekly Groceries', count: 12 },
      { name: 'Cleaning Supplies', count: 5 },
      { name: 'Vegetables & Fruits', count: 7 }
    ];
    
    for (const list of lists) {
      const listResult = await c.query(`
        INSERT INTO lists (household_id, name, created_by)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [householdId, list.name, adminId]);
      
      const listId = listResult.rows[0].id;
      
      const items = list.name === 'Weekly Groceries' 
        ? ['Milk', 'Bread', 'Eggs', 'Chicken Breast', 'Rice', 'Tomatoes', 'Potatoes', 'Cheese', 'Apples', 'Bananas', 'Yogurt', 'Coffee']
        : list.name === 'Cleaning Supplies'
          ? ['Dish Soap', 'Laundry Detergent', 'Paper Towels', 'Trash Bags', 'All-purpose Cleaner']
          : ['Carrots', 'Onions', 'Garlic', 'Lemons', 'Oranges', 'Cucumber', 'Bell Peppers'];
      
      for (const itemName of items) {
        await c.query(`
          INSERT INTO list_items (list_id, name, quantity, created_by)
          VALUES ($1, $2, $3, $4)
        `, [listId, itemName, 1, adminId]);
      }
      
      console.log(`Created list: ${list.name} (${items.length} items)`);
    }
    
    console.log('');
    console.log('=== RESET COMPLETE ===');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await c.end();
  }
}

resetDemoData();