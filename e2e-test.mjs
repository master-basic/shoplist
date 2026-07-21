// GroceryMind E2E Test Suite - covers full user flow
import http from 'node:http';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const BASE = 'http://localhost:3001';
let token, userId, householdId, listId;
let step = 0, passed = 0, failed = 0;

function api(method, path, body) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE);
    const mod = url.protocol === 'https:' ? require('https') : http;
    const opts = {
      method, hostname: url.hostname, port: url.port,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    const req = mod.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: parsed });
      });
    });
    req.on('error', (err) => resolve({ ok: false, status: 0, error: err.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function test(name, fn) {
  step++;
  process.stdout.write(`\n[${step}] ${name}... `);
  return fn().then((msg) => { passed++; console.log(`\x1b[32m  PASS: ${msg}\x1b[0m`); })
    .catch((err) => { failed++; console.log(`\x1b[31m  FAIL: ${err.message || err}\x1b[0m`); });
}

const T = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };

async function run() {
  console.log('\x1b[33m=============================================\x1b[0m');
  console.log('\x1b[33m  GroceryMind E2E Test Suite\x1b[0m');
  console.log('\x1b[33m=============================================\x1b[0m');

  const rand = Math.random().toString(36).slice(2, 8);
  const testUser = {
    name: `TestUser${rand}`, email: `test${rand}@example.com`,
    username: `testuser${rand}`, password: 'test123',
  };

  // 1. Register
  await test('Register new user', async () => {
    const r = await api('POST', '/api/auth/register', testUser);
    if (!r.ok && r.data?.error?.includes('already registered')) {
      const r2 = await api('POST', '/api/auth/login', { username: testUser.email, password: testUser.password });
      T(r2.ok && r2.data.token, `Login failed: ${JSON.stringify(r2.data)}`);
      token = r2.data.token; userId = r2.data.user.id;
      return `Logged in as ${r2.data.user.name}`;
    }
    T(r.ok && r.data.token, `Register failed: ${JSON.stringify(r.data)}`);
    token = r.data.token; userId = r.data.user.id;
    return `User registered: ${r.data.user.name} (id=${userId})`;
  });

  // 2. Get user
  await test('GET /api/auth/user/:id', async () => {
    const r = await api('GET', `/api/auth/user/${userId}`);
    T(r.ok && r.data.user?.id === userId, `Expected user.id ${userId}, got ${JSON.stringify(r.data)}`);
    return `Got user: ${r.data.user.name}`;
  });

  // 3. Create household
  await test('POST /api/auth/households', async () => {
    const r = await api('POST', '/api/auth/households', { name: `Test Household ${rand}`, description: 'E2E test', userId });
    T(r.ok && r.data.household?.id, `Create household failed: ${JSON.stringify(r.data)}`);
    householdId = r.data.household.id;
    return `Household created: ${r.data.household.name}`;
  });

  // 4. Get households
  await test('GET /api/auth/user/:id/households', async () => {
    const r = await api('GET', `/api/auth/user/${userId}/households`);
    T(r.ok && Array.isArray(r.data.households), `Expected households array, got: ${JSON.stringify(r.data)}`);
    T(r.data.households.length > 0, 'Expected at least 1 household');
    return `Got ${r.data.households.length} household(s)`;
  });

  // 5. Create list
  await test('POST /api/lists', async () => {
    const r = await api('POST', '/api/lists', { name: 'Weekly Groceries', householdId, userId });
    T(r.ok && r.data.list?.id, `Create list failed: ${JSON.stringify(r.data)}`);
    listId = r.data.list.id;
    return `List created: ${r.data.list.name} (id=${listId})`;
  });

  // 6. Add items
  const items = [
    { name: 'Milk', quantity: 2, unitPrice: 2.50, category: 'Dairy' },
    { name: 'Bread', quantity: 1, unitPrice: 1.20, category: 'Bakery' },
    { name: 'Eggs', quantity: 12, unitPrice: 0.25, category: 'Dairy' },
  ];
  const itemIds = [];
  for (const item of items) {
    await test(`Add item: ${item.name}`, async () => {
      const r = await api('POST', `/api/lists/${listId}/items`, { ...item, createdBy: userId });
      T(r.ok && r.data.item?.id, `Add ${item.name} failed: ${JSON.stringify(r.data)}`);
      itemIds.push(r.data.item.id);
      return `${item.name} added (id=${r.data.item.id})`;
    });
  }

  // 7. Get items
  await test('GET /api/lists/:id/items', async () => {
    const r = await api('GET', `/api/lists/${listId}/items`);
    T(r.ok && Array.isArray(r.data.items), `Expected items array, got: ${JSON.stringify(r.data)}`);
    T(r.data.items.length === 3, `Expected 3 items, got ${r.data.items.length}`);
    return `Got ${r.data.items.length} items`;
  });

  // 8. Toggle item checked
  await test('PATCH /api/lists/items/:id (toggle checked)', async () => {
    const r = await api('PATCH', `/api/lists/items/${itemIds[0]}`, { isChecked: true });
    T(r.ok, `Toggle failed: ${JSON.stringify(r.data)}`);
    return 'Item toggled checked';
  });

  // 9. Complete purchase
  await test('POST /api/purchase-sessions', async () => {
    const purchaseItems = items.map((item, i) => ({
      listItemId: itemIds[i], name: item.name, quantity: item.quantity,
      unitPrice: item.unitPrice, totalPrice: item.unitPrice * item.quantity,
    }));
    const r = await api('POST', '/api/purchase-sessions', {
      listId, storeName: 'Test Store', userId, householdId, items: purchaseItems,
    });
    T(r.ok && r.data.session?.id, `Purchase failed: ${JSON.stringify(r.data)}`);
    return `Purchase completed: session=${r.data.session.id}`;
  });

  // 10. Get purchase sessions
  await test('GET /api/purchase-sessions/user/:userId', async () => {
    const r = await api('GET', `/api/purchase-sessions/user/${userId}`);
    T(r.ok && Array.isArray(r.data.sessions), `Expected sessions, got: ${JSON.stringify(r.data)}`);
    T(r.data.sessions.length >= 1, `Expected >=1 session, got ${r.data.sessions.length}`);
    return `Got ${r.data.sessions.length} purchase session(s)`;
  });

  // 11. Get price history
  await test('GET /api/price-history', async () => {
    const r = await api('GET', '/api/price-history?limit=50');
    T(r.ok && Array.isArray(r.data.priceHistory), `Expected priceHistory array, got: ${JSON.stringify(r.data)}`);
    T(r.data.priceHistory.length >= 3, `Expected >=3 price entries, got ${r.data.priceHistory.length}`);
    return `Got ${r.data.priceHistory.length} price history entries`;
  });

  // 12. Get price history stats
  await test('GET /api/price-history/stats?itemName=Milk', async () => {
    const r = await api('GET', '/api/price-history/stats?itemName=Milk');
    T(r.ok && r.data.stats, `Stats failed: ${JSON.stringify(r.data)}`);
    return `Got stats: count=${r.data.stats.count}`;
  });

  // 13. Get best deals
  await test('POST /api/price-history/best-deals', async () => {
    const r = await api('POST', '/api/price-history/best-deals', { itemNames: ['Milk', 'Bread', 'Eggs'] });
    T(r.ok, `Best deals failed: ${JSON.stringify(r.data)}`);
    return `Got deals for ${Object.keys(r.data.deals || {}).length} items`;
  });

  // 14. Get household members
  await test('GET /api/households/:id/members', async () => {
    const r = await api('GET', `/api/households/${householdId}/members`);
    T(r.ok && Array.isArray(r.data.members), `Expected members, got: ${JSON.stringify(r.data)}`);
    T(r.data.members.length >= 1, 'Expected at least 1 member');
    return `Got ${r.data.members.length} member(s)`;
  });

  // 15. Get list stats
  await test('GET /api/lists/:id/stats', async () => {
    const r = await api('GET', `/api/lists/${listId}/stats`);
    T(r.ok && r.data.stats, `Stats failed: ${JSON.stringify(r.data)}`);
    T(parseInt(r.data.stats.total_items) === 3, `Expected 3 items, got ${r.data.stats.total_items}`);
    return `List stats: ${r.data.stats.total_items} items, ${r.data.stats.completed_items} completed`;
  });

  // 16. Login by username
  await test('Login by username', async () => {
    const r = await api('POST', '/api/auth/login', { username: testUser.username, password: testUser.password });
    T(r.ok && r.data.token, `Login by username failed: ${JSON.stringify(r.data)}`);
    return 'Login by username works';
  });

  // 17. Login by email
  await test('Login by email', async () => {
    const r = await api('POST', '/api/auth/login', { username: testUser.email, password: testUser.password });
    T(r.ok && r.data.token, `Login by email failed: ${JSON.stringify(r.data)}`);
    return 'Login by email works';
  });

  // 18. Verify token
  await test('GET /api/auth/verify', async () => {
    const r = await api('GET', '/api/auth/verify');
    T(r.ok && r.data.user?.id === userId, `Verify failed: ${JSON.stringify(r.data)}`);
    return 'Token verified';
  });

  // 19. Update list name
  await test('PUT /api/lists/:id', async () => {
    const r = await api('PUT', `/api/lists/${listId}`, { name: 'Updated Weekly Groceries' });
    T(r.ok && r.data.list?.name === 'Updated Weekly Groceries', `Update failed: ${JSON.stringify(r.data)}`);
    return 'List renamed';
  });

  // Summary
  console.log('\n\x1b[33m=============================================\x1b[0m');
  const color = failed === 0 ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}  RESULTS: ${passed} passed, ${failed} failed\x1b[0m`);
  console.log('\x1b[33m=============================================\x1b[0m');
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => { console.error('\x1b[31mFATAL:\x1b[0m', err); process.exit(1); });
