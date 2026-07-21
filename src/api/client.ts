import { API_BASE } from '@/config';
import log from '@/utils/debug';

export function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  const hasToken = !!token;
  if (hasToken) log.info('API authHeaders: token found');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  log.info(`API ${options.method || 'GET'} ${path}`);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...(options.headers as Record<string, string> || {}),
  };
  const url = `${API_BASE}${path}`;
  log.info(`API fetch: ${url}`);
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText, message: '' }));
    log.warn(`API ${path} failed (${res.status})`, { error: err.error, message: err.message });
    throw new Error(err.message || err.error || `Request failed: ${res.status}`);
  }
  log.info(`API ${path} OK (${res.status})`);
  return res;
}
