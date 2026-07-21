import { apiFetch } from './client';
import type { ListItem } from '@/types';
import log from '@/utils/debug';

export async function createList(name: string, householdId: string, createdBy: string, items?: Array<{ name: string; quantity: number; unitPrice: number; category: string }>) {
  log.info('API createList', { name, householdId, createdBy, itemCount: items?.length });
  const response = await apiFetch('/api/lists', {
    method: 'POST',
    body: JSON.stringify({ name, householdId, userId: createdBy, items }),
  });
  const data = await response.json();
  log.info('API createList response', { ok: !!data.list, listId: data.list?.id });
  return data;
}

export async function getUserLists(userId: string) {
  log.info('API getUserLists', { userId });
  const response = await apiFetch(`/api/lists/my?userId=${userId}`);
  const data = await response.json();
  log.info('API getUserLists response', { count: data.lists?.length });
  return data.lists || [];
}

export async function getListById(id: string, userId: string) {
  log.info('API getListById', { id, userId });
  const response = await apiFetch(`/api/lists/${id}?userId=${userId}`);
  const data = await response.json();
  log.info('API getListById response', { found: !!data.list });
  return data;
}

export async function updateList(id: string, name?: string, householdId?: string, userId?: string) {
  log.info('API updateList', { id, name, userId });
  const response = await apiFetch(`/api/lists/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, householdId, userId }),
  });
  return response.json();
}

export async function deleteList(id: string, userId: string) {
  log.info('API deleteList', { id, userId });
  await apiFetch(`/api/lists/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ userId }),
  });
}

export async function createListItem(name: string, quantity: number, estimatedPrice: number, category: string, listId: string, createdBy: string, assignedTo?: string, unit?: string, notes?: string, isRecurring?: boolean, recurrenceFrequency?: string) {
  log.info('API createListItem', { name, quantity, listId, unit, notes, isRecurring });
  const response = await apiFetch(`/api/lists/${listId}/items`, {
    method: 'POST',
    body: JSON.stringify({ name, quantity, estimated_price: estimatedPrice, category, userId: createdBy, assigned_to: assignedTo, unit, notes, is_recurring: isRecurring, recurrence_frequency: recurrenceFrequency }),
  });
  return response.json();
}

export async function getListItems(listId: string) {
  log.info('API getListItems', { listId });
  const response = await apiFetch(`/api/lists/${listId}/items`);
  return response.json();
}

export async function updateListItem(id: string, listId: string, name?: string, quantity?: number, estimatedPrice?: number, category?: string) {
  log.info('API updateListItem', { id, listId, name });
  const response = await apiFetch(`/api/lists/${listId}/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, quantity, estimated_price: estimatedPrice, category }),
  });
  return response.json();
}

export async function toggleItemCompletion(id: string, isCompleted: boolean, notBoughtReason?: string) {
  log.info('API toggleItemCompletion', { id, isCompleted });
  const response = await apiFetch(`/api/lists/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isChecked: isCompleted, notBoughtReason }),
  });
  return response.json();
}

export async function deleteListItem(id: string, listId: string, userId: string) {
  log.info('API deleteListItem', { id, listId });
  await apiFetch(`/api/lists/${listId}/items/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ userId }),
  });
}

export async function getListStats(listId: string, userId: string) {
  log.info('API getListStats', { listId });
  const response = await apiFetch(`/api/lists/${listId}/stats?userId=${userId}`);
  return response.json();
}

export async function getHouseholdItems(householdId: string, userId: string) {
  log.info('API getHouseholdItems', { householdId });
  const response = await apiFetch(`/api/lists/household/${householdId}?userId=${userId}`);
  return response.json();
}

export async function getRecurringItems(householdId: string) {
  log.info('API getRecurringItems', { householdId });
  const response = await apiFetch(`/api/lists/recurring/${householdId}`);
  const data = await response.json();
  return data.items || [];
}

export async function setItemRecurring(itemId: string, isRecurring: boolean) {
  log.info('API setItemRecurring', { itemId, isRecurring });
  const response = await apiFetch(`/api/lists/items/${itemId}/recurring`, {
    method: 'PATCH',
    body: JSON.stringify({ is_recurring: isRecurring }),
  });
  return response.json();
}
