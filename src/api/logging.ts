import { API_BASE } from '@/config';

export async function reportError(error: Error, context?: Record<string, unknown>) {
  try {
    const token = localStorage.getItem('auth_token');
    await fetch(`${API_BASE}/api/log/error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        context,
      }),
    });
  } catch {
    // silently fail — can't report if network is down
  }
}
