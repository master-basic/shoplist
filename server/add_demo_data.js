const {Client} = require('pg');

const c = new Client({user: 'postgres', host: 'localhost', database: 'grocerymind', password: 'postgres'});

async function addDemoData() {
  try {
    await c.connect();
    
    // Check if admin user exists
    const checkUser = await c.query('SELECT id FROM users WHERE username = $1', ['admin']);
    
    let adminId;
    
    if (checkUser.rows.length > 0) {
      adminId = checkUser.rows[0].id;
      console.log('Admin user already exists:', adminId);
    } else {
      const passwordHash = require('bcryptjs').hashSync('admin123', 10);
      
      const result = await c.query(`
        INSERT INTO users (username, password_hash, name, is_admin, avatar)
        VALUES ($1, $2, $3, TRUE, $4)
        RETURNING id
      `, ['admin', passwordHash, 'Admin User', null]);
      
      adminId = result.rows[0].id;
      console.log('Created admin user:', adminId);
    }
    
    // Check if household exists
    const checkHousehold = await c.query('SELECT id FROM households WHERE created_by = $1', [adminId]);
    
    let householdId;
    
    if (checkHousehold.rows.length > 0) {
      householdId = checkHousehold.rows[0].id;
      console.log('Household already exists:', householdId);
    } else {
      const householdResult = await c.query(`
        INSERT INTO households (name, description, created_by)
        VALUES ($1, $2, $3)
        RETURNING id
      `, ['Main Household', 'Primary household for grocery management', adminId]);
      
      householdId = householdResult.rows[0].id;
      console.log('Created household:', householdId);
      
      await c.query(`
        INSERT INTO user_households (user_id, household_id, role, is_owner)
        VALUES ($1, $2, 'admin', TRUE)
      `, [adminId, householdId]);
    }
    
    // Use 'lists' table (old migration) for demo data
    const lists = [
      { name: 'Weekly Groceries' },
      { name: 'Cleaning Supplies' },
      { name: 'Vegetables & Fruits' }
    ];
    
    let listIds = [];
    
    for (const list of lists) {
      const listResult = await c.query(`
        INSERT INTO lists (household_id, name, created_by)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [householdId, list.name, adminId]);
      
      listIds.push(listResult.rows[0].id);
      console.log(`Created list: ${list.name} (id: ${listResult.rows[0].id})`);
      
      const items = list.name === 'Weekly Groceries' 
        ? ['Milk', 'Bread', 'Eggs', 'Chicken Breast', 'Rice', 'Tomatoes', 'Potatoes', 'Cheese', 'Apples', 'Bananas', 'Yogurt', 'Coffee']
        : list.name === 'Cleaning Supplies'
          ? ['Dish Soap', 'Laundry Detergent', 'Paper Towels', 'Trash Bags', 'All-purpose Cleaner']
          : ['Carrots', 'Onions', 'Garlic', 'Lemons', 'Oranges', 'Cucumber', 'Bell Peppers'];
      
      for (const itemName of items) {
        const insert = await c.query(`
          INSERT INTO list_items (list_id, name, quantity, created_by)
          VALUES ($1, $2, $3, $4)
          RETURNING id
        `, [listResult.rows[0].id, itemName, 1, adminId]);
      }
      
      console.log(`  Added ${items.length} items to ${list.name}`);
    }
    
    console.log('');
    console.log('=== DEMO DATA CREATED SUCCESSFULLY! ===');
    console.log('');
    console.log('=== LOGIN CREDENTIALS ===');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('');
    console.log('=== LIST ACCESS ===');
    console.log('Lists are accessible via the Admin user account');
    console.log('');
    console.log('=== NEXT STEPS ===');
    console.log('1. Open the application (http://localhost:5173)');
    console.log('2. Login with admin / admin123');
    console.log('3. Explore the grocery lists and features');
    
    await c.end();
  } catch (err) {
    console.error('Failed to add demo data:', err);
    await c.end();
    process.exit(1);
  }
}

addDemoData();