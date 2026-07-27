const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [{ now: new Date().toISOString() }] }),
      release: jest.fn(),
    }),
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock('../ws', () => ({
  broadcastToHousehold: jest.fn(),
  setupWebSocket: jest.fn(),
}));

const app = require('../index');
const { Pool } = require('pg');
const pool = new Pool();

afterEach(() => {
  pool.query.mockReset();
});

function mockQuery(rows) {
  pool.query.mockResolvedValue({ rows });
}

function mockQuerySequence(responses) {
  pool.query.mockReset();
  responses.forEach(r => pool.query.mockResolvedValueOnce({ rows: r }));
  pool.query.mockResolvedValue({ rows: [] });
}

const JWT_SECRET = process.env.JWT_SECRET || 'grocerymind-dev-secret-change-in-production';
const mockUser = { id: 'u1', email: 'test@test.com', name: 'Test', is_admin: false, preferred_currency: 'AZN', created_at: new Date().toISOString() };
const mockToken = jwt.sign({ id: mockUser.id, email: mockUser.email, name: mockUser.name, is_admin: false }, JWT_SECRET, { expiresIn: '7d' });
const mockAdmin = { ...mockUser, id: 'admin1', is_admin: true };
const adminToken = jwt.sign({ id: mockAdmin.id, email: mockAdmin.email, name: mockAdmin.name, is_admin: true }, JWT_SECRET, { expiresIn: '7d' });

describe('Households API', () => {
  describe('GET /api/households/:id', () => {
    it('returns household with members', async () => {
      mockQuery([{
        id: 'h1', name: 'Family', description: null, created_by: 'u1',
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        member_ids: ['u1'], member_roles: ['admin']
      }]);
      const res = await request(app).get('/api/households/h1').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.household.id).toBe('h1');
    });

    it('returns 404 when household not found', async () => {
      mockQuery([]);
      const res = await request(app).get('/api/households/nonexistent').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/households/:id/members', () => {
    it('returns members list', async () => {
      mockQuery([{ id: 'u1', email: 'test@test.com', name: 'Test', is_admin: false, role: 'admin', is_owner: true, joined_at: new Date().toISOString() }]);
      const res = await request(app).get('/api/households/h1/members').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.members)).toBe(true);
    });
  });

  describe('POST /api/households/:id/members', () => {
    it('adds a member to household', async () => {
      pool.query.mockReset();
      pool.query.mockResolvedValueOnce({ rows: [] }); // no existing
      pool.query.mockResolvedValueOnce({ rows: [] }); // insert
      const res = await request(app)
        .post('/api/households/h1/members')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ userId: 'u2', role: 'member' });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('added');
    });

    it('returns 400 when user already in household', async () => {
      mockQuery([{ user_id: 'u2', household_id: 'h1' }]);
      const res = await request(app)
        .post('/api/households/h1/members')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ userId: 'u2', role: 'member' });
      expect(res.status).toBe(400);
    });

    it('returns 400 when userId or role missing', async () => {
      const res = await request(app)
        .post('/api/households/h1/members')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ userId: 'u2' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/households/:id/members/:userId', () => {
    it('removes a member from household', async () => {
      mockQuery([]);
      const res = await request(app)
        .delete('/api/households/h1/members/u2')
        .set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/households/:id/items', () => {
    it('returns all items across lists in household', async () => {
      mockQuery([{ id: 'i1', name: 'Milk', list_id: 'l1' }]);
      const res = await request(app).get('/api/households/h1/items').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });
});

describe('Purchases API', () => {
  describe('POST /api/purchase-sessions', () => {
    it('creates a purchase session with items', async () => {
      pool.query.mockReset();
      pool.query.mockResolvedValueOnce({ rows: [{ id: 'r1', list_id: 'l1', user_id: 'u1', name: 'Purchase - Store', total_amount: 10, currency: 'AZN', status: 'purchased', created_at: new Date().toISOString() }] }); // insert receipt
      pool.query.mockResolvedValueOnce({ rows: [{ id: 'ri1' }] }); // insert receipt item
      pool.query.mockResolvedValueOnce({ rows: [] }); // insert price history

      const res = await request(app)
        .post('/api/purchase-sessions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          listId: 'l1',
          storeName: 'Bravo',
          userId: 'u1',
          householdId: 'h1',
          items: [{ name: 'Milk', listItemId: 'li1', quantity: 2, unitPrice: 5, totalPrice: 10 }]
        });
      expect(res.status).toBe(201);
      expect(res.body.session).toBeDefined();
    });

    it('returns 400 when required fields missing', async () => {
      const res = await request(app)
        .post('/api/purchase-sessions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ storeName: 'Store' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/purchase-sessions/user/:userId', () => {
    it('returns purchase sessions for user', async () => {
      mockQuerySequence([
        [{ id: 'r1', user_id: 'u1', name: 'Purchase', total_amount: 10, status: 'purchased', created_at: new Date().toISOString() }],
        [{ id: 'ri1', receipt_id: 'r1', name: 'Milk', category: 'Dairy' }]
      ]);
      const res = await request(app).get('/api/purchase-sessions/user/u1').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.sessions)).toBe(true);
    });
  });
});

describe('Budget API', () => {
  describe('GET /api/budget', () => {
    it('returns budget for household', async () => {
      mockQuerySequence([
        [{ id: 'b1', household_id: 'h1', amount: 1000, period_start: '2026-07-01', period_end: '2026-07-31', description: 'July budget' }],
        [{ total_spent: 500 }]
      ]);
      const res = await request(app).get('/api/budget?householdId=h1').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.budget.amount).toBe(1000);
      expect(res.body.budget.totalSpent).toBe(500);
    });

    it('returns null budget when none exists', async () => {
      mockQuery([]);
      const res = await request(app).get('/api/budget?householdId=h1').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.budget).toBeNull();
    });

    it('returns 400 when householdId missing', async () => {
      const res = await request(app).get('/api/budget').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/budget', () => {
    it('creates a budget', async () => {
      mockQuery([{ id: 'b1', household_id: 'h1', amount: 1000, period_start: '2026-07-01', period_end: '2026-07-31', description: 'July' }]);
      const res = await request(app)
        .post('/api/budget')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ householdId: 'h1', amount: 1000, periodStart: '2026-07-01', periodEnd: '2026-07-31', description: 'July' });
      expect(res.status).toBe(201);
    });

    it('returns 400 when required fields missing', async () => {
      const res = await request(app)
        .post('/api/budget')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ householdId: 'h1' });
      expect(res.status).toBe(400);
    });
  });
});

describe('Receipts API', () => {
  describe('POST /api/receipts', () => {
    it('creates a receipt with items', async () => {
      pool.query.mockReset();
      pool.query.mockResolvedValueOnce({ rows: [{ id: 'r1', household_id: 'h1', user_id: 'u1', name: 'Receipt', total_amount: 50, currency: 'AZN', status: 'pending', created_at: new Date().toISOString() }] });
      pool.query.mockResolvedValueOnce({ rows: [] }); // insert receipt items

      const res = await request(app)
        .post('/api/receipts')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          householdId: 'h1',
          name: 'Receipt',
          totalAmount: 50,
          userId: 'u1',
          items: [{ quantity: 2, unitPrice: 25, totalPrice: 50 }]
        });
      expect(res.status).toBe(201);
      expect(res.body.receipt).toBeDefined();
    });
  });

  describe('GET /api/receipts/:id', () => {
    it('returns receipt by id', async () => {
      mockQuerySequence([
        [{ id: 'r1', name: 'Receipt', user_name: 'Test', created_at: new Date().toISOString() }],
        [{ id: 'ri1', receipt_id: 'r1' }]
      ]);
      const res = await request(app).get('/api/receipts/r1').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.receipt.id).toBe('r1');
    });

    it('returns 404 when receipt not found', async () => {
      mockQuery([]);
      const res = await request(app).get('/api/receipts/nonexistent').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/receipts/user/:userId', () => {
    it('returns receipts for user', async () => {
      mockQuery([{ id: 'r1', name: 'Receipt', user_name: 'Test', created_at: new Date().toISOString() }]);
      const res = await request(app).get('/api/receipts/user/u1').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.receipts)).toBe(true);
    });
  });

  describe('POST /api/receipts/batch-items', () => {
    it('creates multiple receipt items', async () => {
      pool.query.mockReset();
      pool.query.mockResolvedValueOnce({ rows: [{ id: 'ri1' }] });
      pool.query.mockResolvedValueOnce({ rows: [{ id: 'ri2' }] });
      const res = await request(app)
        .post('/api/receipts/batch-items')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ receiptId: 'r1', items: [{ quantity: 1, unitPrice: 10, totalPrice: 10 }, { quantity: 2, unitPrice: 5, totalPrice: 10 }] });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
    });

    it('returns 400 when receiptId missing', async () => {
      const res = await request(app)
        .post('/api/receipts/batch-items')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ items: [] });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/receipts/:id/status', () => {
    it('updates receipt status', async () => {
      mockQuery([{ id: 'r1', status: 'purchased' }]);
      const res = await request(app)
        .put('/api/receipts/r1/status')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ status: 'purchased' });
      expect(res.status).toBe(200);
    });

    it('returns 404 when receipt not found', async () => {
      mockQuery([]);
      const res = await request(app)
        .put('/api/receipts/nonexistent/status')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ status: 'purchased' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/receipts/:id', () => {
    it('deletes a receipt', async () => {
      mockQuery([]);
      const res = await request(app).delete('/api/receipts/r1').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
    });
  });
});

describe('Analytics API', () => {
  describe('GET /api/analytics/summary', () => {
    it('returns summary stats for household', async () => {
      mockQuerySequence([
        [{ total_spent: 500 }],
        [{ total_items: 20 }],
        [{ active_lists: 3 }],
        [{ total_receipts: 5 }]
      ]);
      const res = await request(app).get('/api/analytics/summary?householdId=h1').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.totalSpentThisMonth).toBe(500);
      expect(res.body.totalItemsBought).toBe(20);
      expect(res.body.activeListsCount).toBe(3);
      expect(res.body.totalReceipts).toBe(5);
    });
  });

  describe('GET /api/analytics/spending-by-category', () => {
    it('returns spending breakdown by category', async () => {
      mockQuery([{ category: 'Dairy', total: 100 }, { category: 'Meat', total: 200 }]);
      const res = await request(app).get('/api/analytics/spending-by-category?householdId=h1').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.categories).toHaveLength(2);
    });
  });

  describe('GET /api/analytics/top-items', () => {
    it('returns top items by spending', async () => {
      mockQuery([{ name: 'Milk', total_spent: 50, times_bought: 5, avg_price: 10, last_bought: new Date().toISOString() }]);
      const res = await request(app).get('/api/analytics/top-items?householdId=h1&limit=5').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
    });
  });
});

describe('Categorizer API', () => {
  describe('POST /api/categorizer/categorize', () => {
    it('categorizes items', async () => {
      const res = await request(app)
        .post('/api/categorizer/categorize')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ items: [{ name: 'Milk' }, { name: 'Bread' }] });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBe(2);
    });

    it('returns 400 when items not an array', async () => {
      const res = await request(app)
        .post('/api/categorizer/categorize')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ items: 'not an array' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/categorizer/categories', () => {
    it('returns list of categories', async () => {
      const res = await request(app).get('/api/categorizer/categories').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.categories)).toBe(true);
    });
  });
});

describe('Admin API', () => {
  describe('GET /api/admin/users', () => {
    it('returns all users for admin', async () => {
      mockQuery([{ id: 'u1', email: 'test@test.com', name: 'Test' }]);
      const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.users)).toBe(true);
    });

    it('returns 403 for non-admin', async () => {
      const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/admin/users', () => {
    it('creates a user as admin', async () => {
      pool.query.mockReset();
      pool.query.mockResolvedValueOnce({ rows: [] }); // no existing
      pool.query.mockResolvedValueOnce({ rows: [{ id: 'u2', email: 'new@test.com', name: 'New' }] }); // insert user
      pool.query.mockResolvedValueOnce({ rows: [{ id: 'h2' }] }); // insert household
      pool.query.mockResolvedValueOnce({ rows: [] }); // insert user_household
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'new@test.com', password: 'pass123', name: 'New' });
      expect(res.status).toBe(201);
    });

    it('returns 403 for non-admin', async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ email: 'new@test.com', password: 'pass123', name: 'New' });
      expect(res.status).toBe(403);
    });

    it('returns 400 when required fields missing', async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'new@test.com' });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/admin/users/:id/password', () => {
    it('resets password as admin', async () => {
      mockQuery([]);
      const res = await request(app)
        .put('/api/admin/users/u1/password')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ password: 'newpass123' });
      expect(res.status).toBe(200);
    });

    it('returns 400 when password too short', async () => {
      const res = await request(app)
        .put('/api/admin/users/u1/password')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ password: 'ab' });
      expect(res.status).toBe(400);
    });

    it('returns 403 for non-admin', async () => {
      const res = await request(app)
        .put('/api/admin/users/u1/password')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ password: 'newpass123' });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('deletes a user as admin', async () => {
      mockQuery([]);
      const res = await request(app)
        .delete('/api/admin/users/u2')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it('returns 400 when trying to delete self', async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${mockAdmin.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
    });

    it('returns 403 for non-admin', async () => {
      const res = await request(app)
        .delete('/api/admin/users/u2')
        .set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(403);
    });
  });
});

describe('Price Check API', () => {
  describe('GET /api/price-check/products', () => {
    it('returns all tracked products', async () => {
      mockQuery([{ id: 'pc1', product_name: 'Milk', store: 'Bravo', price: 2.5, currency: 'AZN', category: 'dairy', unit: 'pcs', checked_at: new Date().toISOString() }]);
      const res = await request(app).get('/api/price-check/products').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.products)).toBe(true);
    });

    it('filters by category', async () => {
      mockQuery([]);
      const res = await request(app).get('/api/price-check/products?category=dairy').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
    });

    it('filters by search term', async () => {
      mockQuery([]);
      const res = await request(app).get('/api/price-check/products?search=milk').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/price-check/products/:productName/history', () => {
    it('returns price history for product', async () => {
      mockQuery([{ id: 'pc1', product_name: 'Milk', store: 'Bravo', price: 2.5, checked_at: new Date().toISOString() }]);
      const res = await request(app).get('/api/price-check/products/Milk/history').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.history)).toBe(true);
    });
  });

  describe('GET /api/price-check/compare', () => {
    it('compares prices across stores', async () => {
      mockQuery([{ product_name: 'Milk', store: 'Bravo', price: 2.5, previous_price: 2.3, previous_checked_at: new Date().toISOString() }]);
      const res = await request(app).get('/api/price-check/compare?productName=Milk').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.compare)).toBe(true);
    });

    it('returns 400 when productName missing', async () => {
      const res = await request(app).get('/api/price-check/compare').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/price-check/trends', () => {
    it('returns price trends', async () => {
      mockQuery([]);
      const res = await request(app).get('/api/price-check/trends?days=30').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.trends)).toBe(true);
    });
  });

  describe('GET /api/price-check/stores', () => {
    it('returns list of stores', async () => {
      mockQuery([{ store: 'Bravo' }, { store: 'Lala' }]);
      const res = await request(app).get('/api/price-check/stores').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.stores).toContain('Bravo');
    });
  });

  describe('GET /api/price-check/categories', () => {
    it('returns list of categories', async () => {
      mockQuery([{ category: 'dairy' }, { category: 'meat' }]);
      const res = await request(app).get('/api/price-check/categories').set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.categories).toContain('dairy');
    });
  });
});
