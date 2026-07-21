import { API_BASE } from '@/config';
import { authHeaders } from './client';
import log from '@/utils/debug';

export async function getUsers() {
  log.info('API admin getUsers');
  const res = await fetch(`${API_BASE}/api/admin/users`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch users');
  const data = await res.json();
  log.info('API admin getUsers result', { count: data.users?.length });
  return data.users;
}

export async function createUser(email: string, password: string, name: string) {
  log.info('API admin createUser', { email, name });
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create user');
  const data = await res.json();
  log.info('API admin createUser success', { userId: data.user?.id });
  return data.user;
}

export async function resetPassword(userId: string, password: string) {
  log.info('API admin resetPassword', { userId });
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to reset password');
  log.info('API admin resetPassword success');
}

export async function deleteUser(userId: string) {
  log.info('API admin deleteUser', { userId });
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete user');
  log.info('API admin deleteUser success');
}
