import { apiFetch } from './client';
import type { ReceiptFile } from '@/types';
import log from '@/utils/debug';

interface CreateReceiptParams {
  userId: string;
  householdId: string;
  listId?: string;
  name?: string;
  totalAmount?: number;
  currency?: string;
  file: File;
}

interface CreateReceiptItemParams {
  receiptId: string;
  listItemId?: string;
  name?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export async function createReceipt(params: CreateReceiptParams): Promise<ReceiptFile> {
  log.info('API createReceipt', { userId: params.userId, fileName: params.file.name, fileSize: params.file.size });
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('userId', params.userId);
  formData.append('householdId', params.householdId);
  if (params.listId) formData.append('listId', params.listId);
  if (params.name) formData.append('name', params.name);

  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/receipts/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    log.warn('API createReceipt failed', { error: error.error });
    throw new Error(error.error || 'Failed to create receipt');
  }
  const data = await response.json();
  log.info('API createReceipt success', { receiptId: data.id });
  return data;
}

export async function createReceiptItems(params: CreateReceiptItemParams[]): Promise<{ receiptItems: ReceiptFile[] }> {
  log.info('API createReceiptItems', { count: params.length });
  const response = await apiFetch('/api/receipt-items', {
    method: 'POST',
    body: JSON.stringify({ items: params }),
  });
  return response.json();
}

export async function updateReceiptStatus(receiptId: string, status: string): Promise<ReceiptFile> {
  log.info('API updateReceiptStatus', { receiptId, status });
  const response = await apiFetch(`/api/receipts/${receiptId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return response.json();
}

export async function getReceiptById(receiptId: string): Promise<ReceiptFile | null> {
  log.info('API getReceiptById', { receiptId });
  const response = await apiFetch(`/api/receipts/${receiptId}`);
  const data = await response.json();
  log.info('API getReceiptById result', { found: !!data.receipt });
  return data.receipt || null;
}

export async function getUserReceipts(userId: string, householdId?: string): Promise<ReceiptFile[]> {
  const params = new URLSearchParams({ userId });
  if (householdId) params.append('householdId', householdId);
  log.info('API getUserReceipts', { userId, householdId });
  const response = await apiFetch(`/api/receipts?${params}`);
  const data = await response.json();
  log.info('API getUserReceipts result', { count: (data.receipts || []).length });
  return data.receipts || [];
}

export async function getReceiptItems(receiptId: string): Promise<{ items: ReceiptFile[]; receipt: ReceiptFile }> {
  log.info('API getReceiptItems', { receiptId });
  const response = await apiFetch(`/api/receipt-items/${receiptId}`);
  return response.json();
}

export async function deleteReceipt(receiptId: string): Promise<void> {
  log.info('API deleteReceipt', { receiptId });
  await apiFetch(`/api/receipts/${receiptId}`, { method: 'DELETE' });
  log.info('API deleteReceipt success');
}
