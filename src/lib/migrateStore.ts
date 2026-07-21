const STORE_KEY = 'grocerymind-store';
const MIGRATED_KEY = 'grocerymind-store-migrated-v1';

export function migrateStore() {
  if (localStorage.getItem(MIGRATED_KEY)) return;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const store = JSON.parse(raw);
    if (!store?.state) return;
    // Remove stale lists from persisted store — they'll be re-fetched from API
    store.state.lists = [];
    store.state.priceHistory = [];
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    localStorage.setItem(MIGRATED_KEY, '1');
  } catch {
    // ignore
  }
}
