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
    const userId = '5ef3404c-a226-4ee0-b295-bdf0beb3a8fb';
    const res = await c.query(`SELECT * FROM user_households WHERE user_id = $1`, [userId]);
    console.log('User households:', JSON.stringify(res.rows, null, 2));
    
    const households = await c.query(`SELECT DISTINCT h.id, h.name FROM households h JOIN user_households uh ON h.id = uh.household_id WHERE uh.user_id = $1`, [userId]);
    console.log('User households (joined):', JSON.stringify(households.rows, null, 2));
    
    await c.end();
  } catch (error) {
    console.error('Error:', error);
  }
})();