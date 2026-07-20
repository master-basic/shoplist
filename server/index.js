// =====================================================
// GroceryMind - Express.js Backend API
// =====================================================

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Configure body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|tiff|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image and PDF files are allowed'));
  }
});

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'grocerymind',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    res.json({ status: 'ok', message: 'Database connected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', message: error.message });
  }
});

// Generic query endpoint for browser-side operations
app.post('/api/db/query', async (req, res) => {
  try {
    const { text, params } = req.body;
    if (!text) return res.status(400).json({ error: 'Query text is required' });
    const result = await pool.query(text, params || []);
    res.json({ rows: result.rows });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Query failed', message: error.message });
  }
});

// =====================================================
// AUTH ROUTES
// =====================================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const existingUser = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, is_admin, preferred_currency)
       VALUES ($1, $2, $3, FALSE, $4) RETURNING id, email, name, is_admin, preferred_currency, created_at`,
      [email, passwordHash, name, 'AZN']
    );
    res.status(201).json({ user: result.rows[0], message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginId = email || username;
    if (!loginId || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await pool.query(
      'SELECT id, email, name, is_admin, preferred_currency, created_at, password_hash FROM users WHERE email = $1',
      [loginId]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const { password_hash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

app.get('/api/auth/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, email, name, is_admin, preferred_currency, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password_hash, ...userWithoutPassword } = result.rows[0];
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user', message: error.message });
  }
});

app.get('/api/auth/user/:id/households', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT h.id, h.name, h.description, h.created_at, h.created_by, ARRAY_AGG(DISTINCT uh.role::text) as roles
       FROM households h JOIN user_households uh ON h.id = uh.household_id
       WHERE uh.user_id = $1 GROUP BY h.id, h.name, h.description, h.created_at, h.created_by`,
      [id]
    );
    res.json({ households: result.rows });
  } catch (error) {
    console.error('Get households error:', error);
    res.status(500).json({ error: 'Failed to get households', message: error.message });
  }
});

app.post('/api/auth/households', async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: 'Name and userId are required' });
    }
    const householdResult = await pool.query(
      `INSERT INTO households (name, description, created_by)
       VALUES ($1, $2, $3) RETURNING id, name, description, created_by, created_at`,
      [name, description, userId]
    );
    const householdId = householdResult.rows[0].id;
    await pool.query(`INSERT INTO user_households (user_id, household_id, role, is_owner) VALUES ($1, $2, 'admin', TRUE)`, [userId, householdId]);
    res.status(201).json({ household: householdResult.rows[0], message: 'Household created successfully' });
  } catch (error) {
    console.error('Create household error:', error);
    res.status(500).json({ error: 'Failed to create household', message: error.message });
  }
});

// =====================================================
// HOUSEHOLD ROUTES
// =====================================================

app.get('/api/households/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT h.*, ARRAY_AGG(DISTINCT uh.user_id) as member_ids, ARRAY_AGG(DISTINCT uh.role) as member_roles
       FROM households h JOIN user_households uh ON h.id = uh.household_id
       WHERE h.id = $1 GROUP BY h.id`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Household not found' });
    res.json({ household: result.rows[0] });
  } catch (error) {
    console.error('Get household error:', error);
    res.status(500).json({ error: 'Failed to get household', message: error.message });
  }
});

app.get('/api/households/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT u.id, u.email, u.name, u.is_admin, uhm.role, uhm.is_owner, uhm.joined_at
       FROM households h JOIN user_households uhm ON h.id = uhm.household_id
       JOIN users u ON uhm.user_id = u.id WHERE h.id = $1`,
      [id]
    );
    res.json({ members: result.rows });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to get members', message: error.message });
  }
});

app.post('/api/households/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;
    if (!userId || !role) return res.status(400).json({ error: 'userId and role are required' });
    const existing = await pool.query('SELECT * FROM user_households WHERE user_id = $1 AND household_id = $2', [userId, id]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'User already in this household' });
    await pool.query(`INSERT INTO user_households (user_id, household_id, role) VALUES ($1, $2, $3)`, [userId, id, role]);
    res.json({ message: 'User added to household successfully' });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member', message: error.message });
  }
});

app.delete('/api/households/:id/members/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;
    await pool.query('DELETE FROM user_households WHERE user_id = $1 AND household_id = $2', [userId, id]);
    res.json({ message: 'User removed from household successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member', message: error.message });
  }
});

// =====================================================
// GROCERY LIST ROUTES
// =====================================================

app.post('/api/lists', async (req, res) => {
  try {
    const { householdId, name, items, userId } = req.body;
    if (!householdId || !name) return res.status(400).json({ error: 'householdId and name are required' });
    const result = await pool.query(
      `INSERT INTO grocery_lists (household_id, name, created_by)
       VALUES ($1, $2, $3) RETURNING *`,
      [householdId, name, userId]
    );
    const listId = result.rows[0].id;
    if (items && items.length > 0) {
      for (const item of items) {
        await pool.query(
          `INSERT INTO list_items (list_id, name, quantity, unit_price, category, is_checked, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [listId, item.name, item.quantity || 1, item.unitPrice || 0, item.category || 'Other', item.isChecked || false, userId]
        );
      }
    }
    res.status(201).json({ list: result.rows[0], message: 'Grocery list created successfully' });
  } catch (error) {
    console.error('Create list error:', error);
    res.status(500).json({ error: 'Failed to create list', message: error.message });
  }
});

app.get('/api/lists', async (req, res) => {
  try {
    const { householdId } = req.query;
    let query = `SELECT gl.*, ARRAY_AGG(DISTINCT li.id) as item_ids,
             ARRAY_AGG(DISTINCT li.name) as item_names, ARRAY_AGG(DISTINCT li.quantity) as item_quantities
       FROM grocery_lists gl JOIN user_households uh ON gl.household_id = uh.household_id`;
    const params = [];
    if (householdId) {
      query += ' WHERE gl.household_id = $1';
      params.push(householdId);
    }
    query += ' GROUP BY gl.id ORDER BY gl.created_at DESC';
    const result = await pool.query(query, params);
    res.json({ lists: result.rows });
  } catch (error) {
    console.error('Get lists error:', error);
    res.status(500).json({ error: 'Failed to get lists', message: error.message });
  }
});

// =====================================================
// LIST ROUTES - SPECIAL PATTERNS (MUST COME BEFORE :id ROUTES)
// =====================================================

app.get('/api/lists/my', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    const householdsResult = await pool.query(
      `SELECT DISTINCT h.id FROM households h
       JOIN user_households uh ON h.id = uh.household_id WHERE uh.user_id = $1`,
      [userId]
    );
    const householdIds = householdsResult.rows.map(h => h.id);
    if (householdIds.length === 0) return res.json({ lists: [] });
    const listsResult = await pool.query(
      `SELECT gl.id, gl.name, gl.description, gl.household_id, gl.created_by,
               gl.created_at, gl.updated_at,
               (SELECT COUNT(*) FROM list_items li WHERE li.list_id = gl.id AND li.is_checked = FALSE) as total_items,
               (SELECT COUNT(*) FROM list_items li WHERE li.list_id = gl.id AND li.is_checked = TRUE) as completed_items,
               (SELECT COUNT(*) FROM list_items li WHERE li.list_id = gl.id) as total_items_count
       FROM grocery_lists gl
       WHERE gl.household_id = ANY($1::uuid[]) ORDER BY gl.created_at DESC`,
      [householdIds]
    );
    const listsWithItems = [];
    for (const list of listsResult.rows) {
      const itemsResult = await pool.query('SELECT * FROM list_items WHERE list_id = $1 ORDER BY created_at', [list.id]);
      listsWithItems.push({ ...list, items: itemsResult.rows });
    }
    res.json({ lists: listsWithItems });
  } catch (error) {
    console.error('Get all lists error:', error);
    res.status(500).json({ error: 'Failed to get lists', message: error.message });
  }
});

// =====================================================
// LIST ROUTES
// =====================================================

app.get('/api/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM grocery_lists WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'List not found' });
    const itemsResult = await pool.query('SELECT * FROM list_items WHERE list_id = $1', [id]);
    res.json({ list: result.rows[0], items: itemsResult.rows });
  } catch (error) {
    console.error('Get list error:', error);
    res.status(500).json({ error: 'Failed to get list', message: error.message });
  }
});

app.put('/api/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, householdId } = req.body;
    const result = await pool.query(
      `UPDATE grocery_lists SET name = COALESCE($1, name), household_id = COALESCE($2, household_id), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [name, householdId, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'List not found' });
    res.json({ list: result.rows[0], message: 'List updated successfully' });
  } catch (error) {
    console.error('Update list error:', error);
    res.status(500).json({ error: 'Failed to update list', message: error.message });
  }
});

app.delete('/api/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM grocery_lists WHERE id = $1', [id]);
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Delete list error:', error);
    res.status(500).json({ error: 'Failed to delete list', message: error.message });
  }
});

// =====================================================
// LIST ITEMS ROUTES
// =====================================================

app.get('/api/lists/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM list_items WHERE list_id = $1 ORDER BY created_at', [id]);
    res.json({ items: result.rows });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to get items', message: error.message });
  }
});

app.post('/api/lists/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, unitPrice, category, isChecked } = req.body;
    const result = await pool.query(
      `INSERT INTO list_items (list_id, name, quantity, unit_price, category, is_checked, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, name, quantity || 1, unitPrice || 0, category || 'Other', isChecked || false, req.body.createdBy]
    );
    res.status(201).json({ item: result.rows[0], message: 'Item added successfully' });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Failed to create item', message: error.message });
  }
});

app.put('/api/lists/:listId/items/:itemId', async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const { name, quantity, unitPrice, category, isChecked } = req.body;
    const result = await pool.query(
      `UPDATE list_items SET name = COALESCE($1, name), quantity = COALESCE($2, quantity),
       unit_price = COALESCE($3, unit_price), category = COALESCE($4, category),
       is_checked = COALESCE($5, is_checked), updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND list_id = $7 RETURNING *`,
      [name, quantity, unitPrice, category, isChecked, itemId, listId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ item: result.rows[0], message: 'Item updated successfully' });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Failed to update item', message: error.message });
  }
});

app.delete('/api/lists/:listId/items/:itemId', async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    await pool.query('DELETE FROM list_items WHERE id = $1 AND list_id = $2', [itemId, listId]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Failed to delete item', message: error.message });
  }
});

app.patch('/api/lists/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_checked, isChecked } = req.body;
    const checked = is_checked !== undefined ? is_checked : isChecked;
    const result = await pool.query(
      `UPDATE list_items SET is_checked = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [checked, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ item: result.rows[0], message: 'Item toggled successfully' });
  } catch (error) {
    console.error('Toggle item error:', error);
    res.status(500).json({ error: 'Failed to toggle item', message: error.message });
  }
});

app.get('/api/lists/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT
        COUNT(*) as total_items,
        COUNT(*) FILTER (WHERE is_checked = TRUE) as completed_items,
        COUNT(*) FILTER (WHERE is_checked = FALSE) as pending_items,
        COALESCE(SUM(unit_price * quantity), 0) as total_estimated_cost,
        COALESCE(SUM(unit_price * quantity) FILTER (WHERE is_checked = TRUE), 0) as total_actual_cost
       FROM list_items WHERE list_id = $1`,
      [id]
    );
    res.json({ stats: result.rows[0] });
  } catch (error) {
    console.error('Get list stats error:', error);
    res.status(500).json({ error: 'Failed to get list stats', message: error.message });
  }
});

// =====================================================
// HOUSEHOLD ITEMS ROUTE
// =====================================================

app.get('/api/households/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT li.* FROM list_items li
       JOIN grocery_lists gl ON li.list_id = gl.id
       WHERE gl.household_id = $1 ORDER BY li.created_at DESC`,
      [id]
    );
    res.json({ items: result.rows });
  } catch (error) {
    console.error('Get household items error:', error);
    res.status(500).json({ error: 'Failed to get household items', message: error.message });
  }
});

// =====================================================
// PRICE HISTORY ROUTES
// =====================================================

app.get('/api/price-history', async (req, res) => {
  try {
    const { householdId, itemName, store, limit } = req.query;
    let query = 'SELECT * FROM price_history';
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (householdId) {
      conditions.push(`list_item_id IN (SELECT li.id FROM list_items li JOIN grocery_lists gl ON li.list_id = gl.id WHERE gl.household_id = $${paramIndex})`);
      params.push(householdId);
      paramIndex++;
    }
    if (itemName) {
      conditions.push(`item_name ILIKE $${paramIndex}`);
      params.push(`%${itemName}%`);
      paramIndex++;
    }
    if (store) {
      conditions.push(`store_name ILIKE $${paramIndex}`);
      params.push(`%${store}%`);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY purchased_at DESC';
    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit));
    }

    const result = await pool.query(query, params);
    res.json({ priceHistory: result.rows });
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({ error: 'Failed to get price history', message: error.message });
  }
});

app.post('/api/price-history', async (req, res) => {
  try {
    const { listItemId, itemName, storeName, unitPrice, currency, purchasedAt, quantity } = req.body;
    if (!itemName || unitPrice === undefined) {
      return res.status(400).json({ error: 'itemName and unitPrice are required' });
    }
    const result = await pool.query(
      `INSERT INTO price_history (list_item_id, item_name, store_name, unit_price, currency, purchased_at, quantity)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [listItemId || null, itemName, storeName || null, unitPrice, currency || 'AZN', purchasedAt || new Date().toISOString(), quantity || 1]
    );
    res.status(201).json({ priceEntry: result.rows[0], message: 'Price entry created successfully' });
  } catch (error) {
    console.error('Create price history error:', error);
    res.status(500).json({ error: 'Failed to create price entry', message: error.message });
  }
});

app.get('/api/price-history/stats', async (req, res) => {
  try {
    const { itemName } = req.query;
    if (!itemName) return res.status(400).json({ error: 'itemName query parameter is required' });
    const result = await pool.query(
      `SELECT
        COUNT(*) as count,
        MIN(unit_price) as min_price,
        MAX(unit_price) as max_price,
        AVG(unit_price) as avg_price,
        array_agg(DISTINCT store_name) as stores
       FROM price_history WHERE item_name ILIKE $1`,
      [`%${itemName}%`]
    );
    const stats = result.rows[0];
    const cheapestResult = await pool.query(
      `SELECT store_name, unit_price FROM price_history
       WHERE item_name ILIKE $1 ORDER BY unit_price ASC LIMIT 1`,
      [`%${itemName}%`]
    );
    stats.cheapest_store = cheapestResult.rows[0]?.store_name || null;
    stats.cheapest_price = cheapestResult.rows[0]?.unit_price || null;
    res.json({ stats });
  } catch (error) {
    console.error('Get price stats error:', error);
    res.status(500).json({ error: 'Failed to get price stats', message: error.message });
  }
});

// =====================================================
// RECEIPT ROUTES
// =====================================================

app.post('/api/receipts/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = req.file.path;
    const filename = req.file.filename;
    res.json({ filePath, filename, url: `/uploads/${filename}`, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file', message: error.message });
  }
});

app.post('/api/receipts', async (req, res) => {
  try {
    const { householdId, listId, name, totalAmount, currency, imageUrl, ocrData, status, items } = req.body;
    const result = await pool.query(
      `INSERT INTO receipts (household_id, list_id, name, total_amount, currency, image_url, ocr_data, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [householdId, listId || null, name, totalAmount || null, currency || 'AZN', imageUrl || null,
       ocrData ? JSON.stringify(ocrData) : null, status || 'pending']
    );
    const receiptId = result.rows[0].id;
    if (items && items.length > 0) {
      for (const item of items) {
        await pool.query(
          `INSERT INTO receipt_items (receipt_id, list_item_id, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5)`,
          [receiptId, item.listItemId || null, item.quantity, item.unitPrice, item.totalPrice]
        );
      }
    }
    res.status(201).json({ receipt: result.rows[0], message: 'Receipt created successfully' });
  } catch (error) {
    console.error('Create receipt error:', error);
    res.status(500).json({ error: 'Failed to create receipt', message: error.message });
  }
});

app.get('/api/receipts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT r.*, u.name as user_name FROM receipts r
       JOIN users u ON r.user_id = u.id WHERE r.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Receipt not found' });
    const itemsResult = await pool.query('SELECT * FROM receipt_items WHERE receipt_id = $1 ORDER BY created_at', [id]);
    res.json({ receipt: result.rows[0], items: itemsResult.rows });
  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({ error: 'Failed to get receipt', message: error.message });
  }
});

app.get('/api/receipts/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { householdId } = req.query;
    let query = `SELECT r.*, u.name as user_name FROM receipts r
       JOIN users u ON r.user_id = u.id WHERE r.user_id = $1`;
    const params = [userId];
    if (householdId) {
      query += ' AND r.household_id = $2';
      params.push(householdId);
    }
    query += ' ORDER BY r.created_at DESC';
    const result = await pool.query(query, params);
    res.json({ receipts: result.rows });
  } catch (error) {
    console.error('Get user receipts error:', error);
    res.status(500).json({ error: 'Failed to get receipts', message: error.message });
  }
});

app.get('/api/receipts/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM receipt_items WHERE receipt_id = $1 ORDER BY created_at', [id]);
    res.json({ items: result.rows });
  } catch (error) {
    console.error('Get receipt items error:', error);
    res.status(500).json({ error: 'Failed to get items', message: error.message });
  }
});

app.post('/api/receipts/batch-items', async (req, res) => {
  try {
    const { receiptId, items } = req.body;
    if (!receiptId || !items || !Array.isArray(items)) return res.status(400).json({ error: 'receiptId and items array are required' });
    const createdItems = [];
    for (const item of items) {
      const result = await pool.query(
        `INSERT INTO receipt_items (receipt_id, list_item_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [receiptId, item.listItemId || null, item.quantity, item.unitPrice, item.totalPrice]
      );
      createdItems.push(result.rows[0]);
    }
    res.json({ items: createdItems, message: 'Receipt items created successfully' });
  } catch (error) {
    console.error('Batch create items error:', error);
    res.status(500).json({ error: 'Failed to create receipt items', message: error.message });
  }
});

app.put('/api/receipts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      `UPDATE receipts SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Receipt not found' });
    res.json({ receipt: result.rows[0], message: 'Receipt updated successfully' });
  } catch (error) {
    console.error('Update receipt error:', error);
    res.status(500).json({ error: 'Failed to update receipt', message: error.message });
  }
});

app.delete('/api/receipts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM receipts WHERE id = $1', [id]);
    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    console.error('Delete receipt error:', error);
    res.status(500).json({ error: 'Failed to delete receipt', message: error.message });
  }
});

// =====================================================
// STATIC FILES
// =====================================================

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================================================
// SERVER START
// =====================================================

app.listen(PORT, () => {
  console.log(`GroceryMind API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;