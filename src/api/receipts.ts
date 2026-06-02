import { query, queryOne } from '@/config/database';
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

export async function createReceipt(params: CreateReceiptParams): Promise<ReceiptFile> {
  const result = await query(`
    INSERT INTO receipts (household_id, list_id, name, total_amount, currency, image_url, ocr_data, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [
    params.householdId,
    params.listId || null,
    params.name,
    params.totalAmount || null,
    params.currency || 'AZN',
    params.imageUrl || null,
    params.ocrData ? JSON.stringify(params.ocrData) : null,
    params.status || 'pending'
  ]);
  return result.rows[0];
}

export async function createReceiptItems(params: CreateReceiptItemParams[]): Promise<any[]> {
  const results = await query(`
    INSERT INTO receipt_items (receipt_id, list_item_id, quantity, unit_price, total_price)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, params.map(p => [
    p.receiptId,
    p.listItemId || null,
    p.quantity,
    p.unitPrice,
    p.totalPrice
  ]));
  return results.rows;
}

export async function updateReceiptStatus(receiptId: string, status: string): Promise<ReceiptFile> {
  const result = await query(`
    UPDATE receipts
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `, [status, receiptId]);
  return result.rows[0];
}

export async function getReceiptById(receiptId: string): Promise<ReceiptFile | null> {
  const result = await query(`
    SELECT r.*, u.name as user_name
    FROM receipts r
    JOIN users u ON r.user_id = u.id
    WHERE r.id = $1
  `, [receiptId]);
  return result.rows[0] || null;
}

export async function getUserReceipts(userId: string, householdId?: string): Promise<ReceiptFile[]> {
  let queryStr = `
    SELECT r.*, u.name as user_name
    FROM receipts r
    JOIN users u ON r.user_id = u.id
    WHERE r.user_id = $1
  `;
  const params: any[] = [userId];

  if (householdId) {
    params.push(householdId);
    queryStr += ' AND r.household_id = $2';
  }

  queryStr += ' ORDER BY r.created_at DESC';

  const result = await query(queryStr, params);
  return result.rows;
}

export async function getReceiptItems(receiptId: string): Promise<any[]> {
  const result = await query(`
    SELECT * FROM receipt_items
    WHERE receipt_id = $1
    ORDER BY created_at
  `, [receiptId]);
  return result.rows;
}

export async function deleteReceipt(receiptId: string): Promise<void> {
  await query(`
    DELETE FROM receipts
    WHERE id = $1
  `, [receiptId]);
}