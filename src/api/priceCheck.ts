import { API_BASE } from '@/config';

async function headers() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface ProductInfo {
  product_name: string;
  category: string;
  unit: string;
  store: string;
  price: number;
  currency: string;
  checked_at: string;
}

export interface PriceHistoryEntry {
  price: number;
  currency: string;
  store: string;
  checked_at: string;
}

export interface CompareResult {
  product_name: string;
  store: string;
  price: number;
  currency: string;
  unit: string;
  checked_at: string;
}

export interface TrendInfo {
  product_name: string;
  store: string;
  current_price: number;
  previous_price: number;
  change_percent: number;
  direction: 'up' | 'down' | 'same';
  checked_at: string;
}

export async function getStoreProducts(store?: string): Promise<ProductInfo[]> {
  const params = store ? `?store=${encodeURIComponent(store)}` : '';
  const res = await fetch(`${API_BASE}/api/price-check/products${params}`, { headers: await headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.products || data || [];
}

export async function getProductHistory(productName: string, store?: string): Promise<PriceHistoryEntry[]> {
  const params = new URLSearchParams({ product_name: productName });
  if (store) params.set('store', store);
  const res = await fetch(`${API_BASE}/api/price-check/products/${encodeURIComponent(productName)}/history?${params}`, { headers: await headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.history || [];
}

export async function getCompare(productName: string): Promise<CompareResult[]> {
  const res = await fetch(`${API_BASE}/api/price-check/compare?product_name=${encodeURIComponent(productName)}`, { headers: await headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.comparison || [];
}

export async function getTrends(store?: string, category?: string): Promise<TrendInfo[]> {
  const params = new URLSearchParams();
  if (store) params.set('store', store);
  if (category) params.set('category', category);
  const res = await fetch(`${API_BASE}/api/price-check/trends?${params}`, { headers: await headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.trends || [];
}

export async function getStores(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/price-check/stores`, { headers: await headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.stores || [];
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/price-check/categories`, { headers: await headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.categories || [];
}
