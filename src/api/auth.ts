import { query, queryOne } from '@/config/database';
import bcrypt from 'bcryptjs';
import { User as UserType } from '@/types';

/**
 * Register a new user
 */
export async function registerUser(name: string, email: string, password: string): Promise<UserType> {
  // Check if user already exists
  const existingUser = await queryOne(
    'SELECT id, email, name, is_admin, preferred_currency FROM users WHERE email = $1',
    [email]
  );

  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await queryOne(
    `INSERT INTO users (email, password_hash, name, is_admin, preferred_currency)
     VALUES ($1, $2, $3, FALSE, $4)
     RETURNING id, email, name, is_admin, preferred_currency, created_at`,
    [email, passwordHash, name, 'AZN']
  );

  return newUser;
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string): Promise<UserType> {
  const user = await queryOne(
    'SELECT id, email, name, is_admin, preferred_currency, created_at FROM users WHERE email = $1',
    [email]
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    throw new Error('Invalid email or password');
  }

  // Return user without password hash
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword as UserType;
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<UserType | null> {
  const user = await queryOne(
    'SELECT id, email, name, is_admin, preferred_currency, created_at FROM users WHERE id = $1',
    [id]
  );
  return user || null;
}

/**
 * Get user households
 */
export async function getUserHouseholds(userId: string) {
  const result = await query(
    `SELECT h.id, h.name, h.description, h.created_at,
            h.created_by,
            ARRAY_AGG(DISTINCT uh.role::text) as roles
     FROM households h
     JOIN user_households uh ON h.id = uh.household_id
     WHERE uh.user_id = $1
     GROUP BY h.id, h.name, h.description, h.created_at, h.created_by, h.created_by`,
    [userId]
  );
  return result.rows;
}

/**
 * Create a new household
 */
export async function createHousehold(name: string, description: string, userId: string) {
  const household = await queryOne(
    `INSERT INTO households (name, description, created_by)
     VALUES ($1, $2, $3)
     RETURNING id, name, description, created_by, created_at`,
    [name, description, userId]
  );

  // Add user as owner
  await query(
    `INSERT INTO user_households (user_id, household_id, role, is_owner)
     VALUES ($1, $2, 'admin', TRUE)`,
    [userId, household.id]
  );

  return household;
}

/**
 * Add user to household
 */
export async function addUserToHousehold(userId: string, householdId: string, role: string = 'member') {
  const existing = await queryOne(
    'SELECT * FROM user_households WHERE user_id = $1 AND household_id = $2',
    [userId, householdId]
  );

  if (existing) {
    throw new Error('User already in this household');
  }

  await query(
    `INSERT INTO user_households (user_id, household_id, role)
     VALUES ($1, $2, $3)`,
    [userId, householdId, role]
  );
}

/**
 * Remove user from household
 */
export async function removeUserFromHousehold(userId: string, householdId: string) {
  await query(
    'DELETE FROM user_households WHERE user_id = $1 AND household_id = $2',
    [userId, householdId]
  );
}

/**
 * Get household members
 */
export async function getHouseholdMembers(householdId: string) {
  const members = await query(
    `SELECT u.id, u.email, u.name, u.is_admin,
            uhm.role, uhm.is_owner, uhm.joined_at
     FROM households h
     JOIN user_households uhm ON h.id = uhm.household_id
     JOIN users u ON uhm.user_id = u.id
     WHERE h.id = $1`,
    [householdId]
  );
  return members.rows;
}