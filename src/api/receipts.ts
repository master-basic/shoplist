import { ReceiptFile } from '@/types';

export interface CreateReceiptParams {
  householdId: string;
  listId?: string;
  name: string;
  totalAmount?: number;
  currency?: string;
  imageUrl?: string;
  ocrData?: Record<string, any>;
  status?: string;
}

export interface CreateReceiptItemParams {
  receiptId: string;
  listItemId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Create a new receipt
 */
export async function createReceipt(params: CreateReceiptParams): Promise<ReceiptFile> {
  const response = await fetch('http://localhost:3001/api/receipts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create receipt');
  }

  const data = await response.json();
  return data.receipt;
}

/**
 * Create receipt items
 */
export async function createReceiptItems(params: CreateReceiptItemParams[]): Promise<any[]> {
  const response = await fetch('http://localhost:3001/api/receipts/batch-items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create receipt items');
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Update receipt status
 */
export async function updateReceiptStatus(receiptId: string, status: string): Promise<ReceiptFile> {
  const response = await fetch(`http://localhost:3001/api/receipts/${receiptId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update receipt status');
  }

  const data = await response.json();
  return data.receipt;
}

/**
 * Get receipt by ID
 */
export async function getReceiptById(receiptId: string): Promise<ReceiptFile | null> {
  const response = await fetch(`http://localhost:3001/api/receipts/${receiptId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get receipt');
  }

  const data = await response.json();
  return data.receipt || null;
}

/**
 * Get user receipts
 */
export async function getUserReceipts(userId: string, householdId?: string): Promise<ReceiptFile[]> {
  let url = `http://localhost:3001/api/receipts/user/${userId}`;
  const queryParams = new URLSearchParams();

  if (householdId) {
    queryParams.append('householdId', householdId);
    url += `?${queryParams.toString()}`;
  }

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get receipts');
  }

  const data = await response.json();
  return data.receipts || [];
}

/**
 * Get receipt items
 */
export async function getReceiptItems(receiptId: string): Promise<any[]> {
  const response = await fetch(`http://localhost:3001/api/receipts/${receiptId}/items`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get receipt items');
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Delete a receipt
 */
export async function deleteReceipt(receiptId: string): Promise<void> {
  const response = await fetch(`http://localhost:3001/api/receipts/${receiptId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete receipt');
  }
}
