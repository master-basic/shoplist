import { API_BASE } from '@/config';
import { authHeaders } from './client';
import log from '@/utils/debug';

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
  log.info('API getStoreProducts', { store: store || 'all' });
  const res = await fetch(`${API_BASE}/api/price-check/products${params}`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
  if (!res.ok) { log.warn('API getStoreProducts failed', { status: res.status }); return []; }
  const data = await res.json();
  log.info('API getStoreProducts result', { count: (data.products || data || []).length });
  return data.products || data || [];
}

export async function getProductHistory(productName: string, store?: string): Promise<PriceHistoryEntry[]> {
  const params = new URLSearchParams({ product_name: productName });
  if (store) params.set('store', store);
  log.info('API getProductHistory', { productName, store });
  const res = await fetch(`${API_BASE}/api/price-check/products/${encodeURIComponent(productName)}/history?${params}`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
  if (!res.ok) { log.warn('API getProductHistory failed', { status: res.status }); return []; }
  const data = await res.json();
  log.info('API getProductHistory result', { count: (data.history || []).length });
  return data.history || [];
}

export async function getCompare(productName: string): Promise<CompareResult[]> {
  log.info('API getCompare', { productName });
  const res = await fetch(`${API_BASE}/api/price-check/compare?product_name=${encodeURIComponent(productName)}`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
  if (!res.ok) { log.warn('API getCompare failed', { status: res.status }); return []; }
  const data = await res.json();
  log.info('API getCompare result', { count: (data.comparison || []).length });
  return data.comparison || [];
}

export async function getTrends(store?: string, category?: string): Promise<TrendInfo[]> {
  const params = new URLSearchParams();
  if (store) params.set('store', store);
  if (category) params.set('category', category);
  log.info('API getTrends', { store, category });
  const res = await fetch(`${API_BASE}/api/price-check/trends?${params}`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
  if (!res.ok) { log.warn('API getTrends failed', { status: res.status }); return []; }
  const data = await res.json();
  log.info('API getTrends result', { count: (data.trends || []).length });
  return data.trends || [];
}

export async function getStores(): Promise<string[]> {
  log.info('API getStores');
  const res = await fetch(`${API_BASE}/api/price-check/stores`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
  if (!res.ok) { log.warn('API getStores failed', { status: res.status }); return []; }
  const data = await res.json();
  log.info('API getStores result', { stores: data.stores });
  return data.stores || [];
}

export async function getCategories(): Promise<string[]> {
  log.info('API getCategories');
  const res = await fetch(`${API_BASE}/api/price-check/categories`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
  if (!res.ok) { log.warn('API getCategories failed', { status: res.status }); return []; }
  const data = await res.json();
  log.info('API getCategories result', { categories: data.categories });
  return data.categories || [];
}
