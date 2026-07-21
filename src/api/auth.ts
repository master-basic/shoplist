import { apiFetch, authHeaders } from './client';
import { API_BASE } from '@/config';
import { User as UserType } from '@/types';
import log from '@/utils/debug';

export async function registerUser(name: string, email: string, password: string): Promise<{ user: UserType; token: string }> {
  log.info('API registerUser', { name, email });
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    log.warn('API registerUser failed', { error: error.error });
    throw new Error(error.error || 'Registration failed');
  }
  const data = await response.json();
  log.info('API registerUser success', { userId: data.user?.id });
  return { user: { ...data.user, isAdmin: data.user.is_admin ?? false }, token: data.token };
}

export async function loginUser(username: string, password: string): Promise<{ user: UserType; token: string }> {
  log.info('API loginUser', { username });
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    log.warn('API loginUser failed', { error: error.error });
    throw new Error(error.error || 'Login failed');
  }
  const data = await response.json();
  log.info('API loginUser success', { userId: data.user?.id, hasToken: !!data.token });
  return { user: { ...data.user, isAdmin: data.user.is_admin ?? false }, token: data.token };
}

export async function verifyToken(): Promise<UserType | null> {
  log.info('API verifyToken');
  try {
    const response = await apiFetch('/api/auth/verify');
    const data = await response.json();
    log.info('API verifyToken success', { userId: data.user?.id });
    return { ...data.user, isAdmin: data.user.is_admin ?? false };
  } catch (err) {
    log.warn('API verifyToken failed', { error: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

export async function getUserById(id: string): Promise<UserType | null> {
  log.info('API getUserById', { id });
  const response = await apiFetch(`/api/auth/user/${id}`);
  const data = await response.json();
  log.info('API getUserById result', { found: !!data.user });
  return data.user || null;
}

export async function getUserHouseholds(userId: string) {
  log.info('API getUserHouseholds', { userId });
  const response = await apiFetch(`/api/auth/user/${userId}/households`);
  const data = await response.json();
  log.info('API getUserHouseholds result', { count: data.households?.length });
  return data.households || [];
}

export async function createHousehold(name: string, description: string, userId: string) {
  log.info('API createHousehold', { name, userId });
  const response = await apiFetch('/api/auth/households', {
    method: 'POST',
    body: JSON.stringify({ name, description, userId }),
  });
  const data = await response.json();
  log.info('API createHousehold success', { householdId: data.household?.id });
  return data.household;
}

export async function addUserToHousehold(userId: string, householdId: string, role: string = 'member') {
  log.info('API addUserToHousehold', { userId, householdId, role });
  await apiFetch(`/api/households/${householdId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId, role }),
  });
  log.info('API addUserToHousehold success');
}

export async function removeUserFromHousehold(userId: string, householdId: string) {
  log.info('API removeUserFromHousehold', { userId, householdId });
  await apiFetch(`/api/households/${householdId}/members/${userId}`, { method: 'DELETE' });
  log.info('API removeUserFromHousehold success');
}

export async function getHouseholdMembers(householdId: string) {
  log.info('API getHouseholdMembers', { householdId });
  const response = await apiFetch(`/api/households/${householdId}/members`);
  const data = await response.json();
  log.info('API getHouseholdMembers result', { count: data.members?.length });
  return data.members || [];
}
