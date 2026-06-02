import { User as UserType } from '@/types';

/**
 * Create a new grocery list
 */
export async function createList(name: string, householdId: string, createdBy: string, items?: Array<{
  name: string;
  quantity?: number;
  unitPrice?: number;
  category?: string;
  isChecked?: boolean;
}>) {
  const response = await fetch('http://localhost:3001/api/lists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      householdId,
      name,
      items,
      userId: createdBy,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create list');
  }

  const data = await response.json();
  return data.list;
}

/**
 * Get all lists for a user (across all households)
 */
export async function getUserLists(userId: string) {
  const response = await fetch('http://localhost:3001/api/lists', {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get lists');
  }

  const data = await response.json();
  return data.lists || [];
}

/**
 * Get list by ID
 */
export async function getListById(id: string, userId: string) {
  const response = await fetch(`http://localhost:3001/api/lists/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get list');
  }

  const data = await response.json();
  return data.list || null;
}

/**
 * Update a list
 */
export async function updateList(id: string, name?: string, householdId?: string, userId?: string) {
  const response = await fetch(`http://localhost:3001/api/lists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, householdId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update list');
  }

  const data = await response.json();
  return data.list;
}

/**
 * Delete a list
 */
export async function deleteList(id: string, userId: string) {
  const response = await fetch(`http://localhost:3001/api/lists/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete list');
  }
}

/**
 * Create a list item
 */
export async function createListItem(name: string, quantity: number = 1, unitPrice: number = 0, category: string = 'Other', listId: string, userId: string) {
  const response = await fetch(`http://localhost:3001/api/lists/${listId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      quantity,
      unitPrice,
      category,
      createdBy: userId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create list item');
  }

  const data = await response.json();
  return data.item;
}

/**
 * Get list items for a list
 */
export async function getListItems(listId: string) {
  const response = await fetch(`http://localhost:3001/api/lists/${listId}/items`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get list items');
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Update a list item
 */
export async function updateListItem(id: string, listId: string, name?: string, quantity?: number, unitPrice?: number, category?: string) {
  const response = await fetch(`http://localhost:3001/api/lists/${listId}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, quantity, unitPrice, category }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update list item');
  }

  const data = await response.json();
  return data.item;
}

/**
 * Toggle item completion
 */
export async function toggleItemCompletion(id: string, isCompleted: boolean) {
  const response = await fetch(`http://localhost:3001/api/lists/items/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isChecked: isCompleted }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to toggle item');
  }

  const data = await response.json();
  return data.item;
}

/**
 * Delete a list item
 */
export async function deleteListItem(id: string, listId: string, userId: string) {
  const response = await fetch(`http://localhost:3001/api/lists/${listId}/items/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete list item');
  }
}

/**
 * Get list statistics
 */
export async function getListStats(listId: string, userId: string) {
  const response = await fetch(`http://localhost:3001/api/lists/${listId}/stats`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get list stats');
  }

  const data = await response.json();
  return data.stats;
}

/**
 * Get all items in a household
 */
export async function getHouseholdItems(householdId: string, userId: string) {
  const response = await fetch(`http://localhost:3001/api/households/${householdId}/items`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get household items');
  }

  const data = await response.json();
  return data.items || [];
}
