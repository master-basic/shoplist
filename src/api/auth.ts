import { API_BASE } from '@/config';
import { User as UserType } from '@/types';

export async function registerUser(name: string, email: string, password: string): Promise<{ user: UserType; token: string }> {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  const data = await response.json();
  return { user: { ...data.user, isAdmin: data.user.is_admin ?? false }, token: data.token };
}

/**
 * Login user - accepts USERNAME (not email)
 */
export async function loginUser(username: string, password: string): Promise<{ user: UserType; token: string }> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  return { user: { ...data.user, isAdmin: data.user.is_admin ?? false }, token: data.token };
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<UserType | null> {
  const response = await fetch(`${API_BASE}/api/auth/user/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get user');
  }

  const data = await response.json();
  return data.user || null;
}

/**
 * Get user households
 */
export async function getUserHouseholds(userId: string) {
  const response = await fetch(`${API_BASE}/api/auth/user/${userId}/households`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get households');
  }

  const data = await response.json();
  return data.households || [];
}

/**
 * Create a new household
 */
export async function createHousehold(name: string, description: string, userId: string) {
  const response = await fetch(`${API_BASE}/api/auth/households`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create household');
  }

  const data = await response.json();
  return data.household;
}

/**
 * Add user to household
 */
export async function addUserToHousehold(userId: string, householdId: string, role: string = 'member') {
  const response = await fetch(`${API_BASE}/api/households/${householdId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add user to household');
  }
}

/**
 * Remove user from household
 */
export async function removeUserFromHousehold(userId: string, householdId: string) {
  const response = await fetch(`${API_BASE}/api/households/${householdId}/members/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove user from household');
  }
}

/**
 * Get household members
 */
export async function getHouseholdMembers(householdId: string) {
  const response = await fetch(`${API_BASE}/api/households/${householdId}/members`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get household members');
  }

  const data = await response.json();
  return data.members || [];
}
