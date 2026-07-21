import { API_BASE } from '@/config';

const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 } as const;
const currentLevel = LOG_LEVELS.DEBUG;

let logQueue: object[] = [];
let sending = false;

async function flushLogs() {
  if (sending || logQueue.length === 0) return;
  sending = true;
  const batch = logQueue.splice(0);
  try {
    const token = localStorage.getItem('auth_token');
    await fetch(`${API_BASE}/api/log/frontend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ logs: batch }),
    });
  } catch {
    // silently fail
  } finally {
    sending = false;
  }
}

function enqueue(entry: object) {
  logQueue.push(entry);
  if (logQueue.length >= 5) flushLogs();
}

const log = {
  debug: (msg: string, data?: unknown) => {
    if (currentLevel > LOG_LEVELS.DEBUG) return;
    const entry = { ts: new Date().toISOString(), level: 'DEBUG', msg, data };
    console.debug(`[DBG] ${msg}`, data ?? '');
    enqueue(entry);
  },
  info: (msg: string, data?: unknown) => {
    if (currentLevel > LOG_LEVELS.INFO) return;
    const entry = { ts: new Date().toISOString(), level: 'INFO', msg, data };
    console.info(`[INF] ${msg}`, data ?? '');
    enqueue(entry);
  },
  warn: (msg: string, data?: unknown) => {
    if (currentLevel > LOG_LEVELS.WARN) return;
    const entry = { ts: new Date().toISOString(), level: 'WARN', msg, data };
    console.warn(`[WRN] ${msg}`, data ?? '');
    enqueue(entry);
  },
  error: (msg: string, data?: unknown) => {
    const entry = { ts: new Date().toISOString(), level: 'ERROR', msg, data };
    console.error(`[ERR] ${msg}`, data ?? '');
    enqueue(entry);
    flushLogs();
  },
  flush: flushLogs,
};

// Global error handlers
window.onerror = (_event, _source, _lineno, _colno, error) => {
  log.error('window.onerror', { message: error?.message, stack: error?.stack });
};

window.addEventListener('unhandledrejection', (event) => {
  log.error('unhandledRejection', { reason: event.reason?.message || String(event.reason), stack: event.reason?.stack });
});

export default log;
