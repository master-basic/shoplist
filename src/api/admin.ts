import { API_BASE } from '@/config';

async function authHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getUsers() {
  const res = await fetch(`${API_BASE}/api/admin/users`, { headers: await authHeaders() });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch users');
  return (await res.json()).users;
}

export async function createUser(email: string, password: string, name: string) {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create user');
  return (await res.json()).user;
}

export async function resetPassword(userId: string, password: string) {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}/password`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to reset password');
}

export async function deleteUser(userId: string) {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete user');
}
