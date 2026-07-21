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

const app = require('../index');
const { Pool } = require('pg');
const pool = new Pool();

function mockQuery(rows) {
  pool.query.mockReset();
  pool.query.mockResolvedValue({ rows });
}

function mockQueryOnce(rows) {
  pool.query.mockReset();
  pool.query.mockResolvedValueOnce({ rows });
}

const JWT_SECRET = process.env.JWT_SECRET || 'grocerymind-dev-secret-change-in-production';
const mockUser = { id: 'u1', email: 'test@test.com', name: 'Test', is_admin: false, preferred_currency: 'AZN', created_at: new Date().toISOString() };
const mockToken = jwt.sign({ id: mockUser.id, email: mockUser.email, name: mockUser.name }, JWT_SECRET, { expiresIn: '7d' });

describe('GET /api/health', () => {
  it('returns ok when database is connected', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('returns 500 when database connection fails', async () => {
    pool.connect.mockRejectedValueOnce(new Error('connection refused'));
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Database connection failed');
  });
});

describe('POST /api/auth/register', () => {
  it('registers a new user and returns a token', async () => {
    mockQueryOnce([]); // no existing user
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@test.com');
  });

  it('returns 400 when email is already registered', async () => {
    mockQuery([{ id: 'existing', email: 'taken@test.com' }]);
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'taken@test.com', password: 'password123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email already registered');
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('required');
  });
});

describe('POST /api/auth/login', () => {
  const validUser = { ...mockUser, password_hash: '$2a$10$dummyhash' };

  it('logs in with valid credentials and returns a token', async () => {
    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
    mockQuery([validUser]);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@test.com');
  });

  it('returns 401 with invalid password', async () => {
    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
    mockQuery([validUser]);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  it('returns 401 for unknown email', async () => {
    mockQuery([]);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@test.com', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });
});

describe('GET /api/auth/verify', () => {
  it('returns user when token is valid', async () => {
    mockQuery([mockUser]);
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${mockToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe('u1');
  });

  it('returns 401 without authorization header', async () => {
    const res = await request(app).get('/api/auth/verify');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Authentication required');
  });

  it('returns 403 with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Invalid or expired token');
  });
});

describe('GET /api/auth/user/:id', () => {
  it('returns user by id', async () => {
    mockQuery([mockUser]);
    const res = await request(app).get('/api/auth/user/u1').set('Authorization', `Bearer ${mockToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe('u1');
  });

  it('returns 404 when user not found', async () => {
    mockQuery([]);
    const res = await request(app).get('/api/auth/user/nonexistent').set('Authorization', `Bearer ${mockToken}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });
});

describe('POST /api/auth/households', () => {
  it('creates a household and returns it', async () => {
    const mockHousehold = { id: 'h1', name: 'Test Family', description: 'desc', created_by: 'u1', created_at: new Date().toISOString() };
    mockQueryOnce([mockHousehold]);
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app)
      .post('/api/auth/households')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ name: 'Test Family', description: 'desc', userId: 'u1' });
    expect(res.status).toBe(201);
    expect(res.body.household.name).toBe('Test Family');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/auth/households')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ userId: 'u1' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('required');
  });
});

describe('GET /api/lists', () => {
  it('returns lists for a household', async () => {
    mockQuery([{ id: 'l1', name: 'Weekly Shop', household_id: 'h1', item_ids: null, item_names: null, item_quantities: null }]);
    const res = await request(app).get('/api/lists?householdId=h1').set('Authorization', `Bearer ${mockToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.lists)).toBe(true);
  });
});

describe('POST /api/lists', () => {
  it('creates a new list', async () => {
    mockQueryOnce([{ id: 'l1', name: 'New List', household_id: 'h1', created_by: 'u1', created_at: new Date().toISOString() }]);
    const res = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ householdId: 'h1', name: 'New List', userId: 'u1' });
    expect(res.status).toBe(201);
    expect(res.body.list.name).toBe('New List');
  });
});

describe('GET /api/lists/:id', () => {
  it('returns a list by id', async () => {
    mockQueryOnce([{ id: 'l1', name: 'My List', household_id: 'h1', created_by: 'u1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/lists/l1').set('Authorization', `Bearer ${mockToken}`);
    expect(res.status).toBe(200);
    expect(res.body.list.id).toBe('l1');
  });

  it('returns 404 when list not found', async () => {
    mockQuery([]);
    const res = await request(app).get('/api/lists/nonexistent').set('Authorization', `Bearer ${mockToken}`);
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/lists/:id', () => {
  it('updates a list name', async () => {
    mockQuery([{ id: 'l1', name: 'Updated Name', household_id: 'h1', created_by: 'u1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
    const res = await request(app)
      .put('/api/lists/l1')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.list.name).toBe('Updated Name');
  });
});

describe('POST /api/lists/:id/items', () => {
  it('adds an item to a list', async () => {
    const mockItem = { id: 'i1', list_id: 'l1', name: 'Milk', quantity: 1, unit_price: 2.5, category: 'Dairy', is_checked: false, created_by: 'u1', unit: 'pcs', notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockQuery([mockItem]);
    const res = await request(app)
      .post('/api/lists/l1/items')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ name: 'Milk', quantity: 1, unitPrice: 2.5, category: 'Dairy', createdBy: 'u1' });
    expect(res.status).toBe(201);
    expect(res.body.item.name).toBe('Milk');
  });
});

describe('GET /api/households/:id', () => {
  it('returns household by id', async () => {
    mockQuery([{ id: 'h1', name: 'Family', description: null, created_by: 'u1', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), member_ids: ['u1'], member_roles: ['admin'] }]);
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

describe('POST /api/price-history', () => {
  it('creates a price history entry', async () => {
    const entry = { id: 'ph1', list_item_id: 'li1', item_name: 'Milk', store_name: 'Store A', unit_price: 2.5, currency: 'AZN', purchased_at: new Date().toISOString(), quantity: 1 };
    mockQuery([entry]);
    const res = await request(app)
      .post('/api/price-history')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ listItemId: 'li1', price: 2.5, store: 'Store A' });
    expect(res.status).toBe(201);
    expect(res.body.priceEntry.list_item_id).toBe('li1');
  });

  it('returns 400 when required fields missing', async () => {
    const res = await request(app)
      .post('/api/price-history')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ storeName: 'Store' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('required');
  });
});

describe('GET /api/price-history/stats', () => {
  it('returns stats for an item', async () => {
    const statsRow = { count: 5, min_price: 1.0, max_price: 3.0, avg_price: 2.0, stores: ['Store A'] };
    mockQueryOnce([statsRow]);
    pool.query.mockResolvedValueOnce({ rows: [{ store_name: 'Store A', unit_price: 1.0 }] });
    const res = await request(app).get('/api/price-history/stats?itemName=Milk').set('Authorization', `Bearer ${mockToken}`);
    expect(res.status).toBe(200);
    expect(res.body.stats.count).toBe(5);
  });

  it('returns 400 when itemName missing', async () => {
    const res = await request(app).get('/api/price-history/stats').set('Authorization', `Bearer ${mockToken}`);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/lists/:id', () => {
  it('deletes a list', async () => {
    mockQuery([]);
    const res = await request(app).delete('/api/lists/l1').set('Authorization', `Bearer ${mockToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});

describe('POST /api/db/query', () => {
  it('endpoint does not exist anymore', async () => {
    const res = await request(app)
      .post('/api/db/query')
      .send({ text: 'SELECT 1' });
    expect(res.status).toBe(404);
  });
});
