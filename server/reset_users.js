const pool = require('./db');

async function reset() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM list_items');
    await client.query('DELETE FROM grocery_lists');
    await client.query('DELETE FROM lists');
    await client.query('DELETE FROM user_households');
    await client.query('DELETE FROM households');
    await client.query('DELETE FROM price_history');
    await client.query('DELETE FROM receipt_items');
    await client.query('DELETE FROM receipts');
    await client.query('DELETE FROM notifications');
    await client.query('DELETE FROM user_preferences');
    await client.query('DELETE FROM users');
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin', 10);
    const admin = await client.query(
      `INSERT INTO users (email, password_hash, name, username, is_admin, preferred_currency)
       VALUES ('admin@example.com', $1, 'Admin', 'admin', TRUE, 'AZN') RETURNING id`,
      [hash]
    );
    const adminId = admin.rows[0].id;
    const household = await client.query(
      `INSERT INTO households (name, description, created_by)
       VALUES ('Default Household', 'Auto-created household', $1) RETURNING id`,
      [adminId]
    );
    await client.query(
      `INSERT INTO user_households (user_id, household_id, role, is_owner)
       VALUES ($1, $2, 'admin', TRUE)`,
      [adminId, household.rows[0].id]
    );
    await client.query('COMMIT');
    console.log('Reset complete. Admin: admin@example.com / admin');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Reset failed:', e.message);
  } finally {
    client.release();
    pool.end();
  }
}

reset();
