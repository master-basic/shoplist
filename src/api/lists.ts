import { query, queryOne } from '@/config/database';
import { User as UserType } from '@/types';

/**
 * Create a new grocery list
 */
export async function createList(name: string, description: string = '', householdId: string, createdBy: string) {
  const list = await queryOne(
    `INSERT INTO lists (name, description, household_id, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, description, household_id, created_by, created_at`,
    [name, description, householdId, createdBy]
  );

  return list;
}

/**
 * Get all lists for a user (across all households)
 */
export async function getUserLists(userId: string) {
  const result = await query(
    `SELECT l.id, l.name, l.description, l.is_active,
            l.created_by, l.created_at, l.updated_at,
            h.name as household_name,
            (SELECT COUNT(*) FROM list_items li WHERE li.list_id = l.id) as item_count,
            (SELECT COUNT(*) FROM list_items li WHERE li.list_id = l.id AND li.is_completed = FALSE) as pending_count
     FROM lists l
     JOIN households h ON l.household_id = h.id
     JOIN user_households uh ON h.id = uh.household_id
     WHERE uh.user_id = $1
     ORDER BY l.created_at DESC`,
    [userId]
  );
  return result.rows;
}

/**
 * Get list by ID
 */
export async function getListById(id: string, userId: string) {
  const list = await queryOne(
    `SELECT l.id, l.name, l.description, l.is_active,
            l.created_by, l.created_at, l.updated_at,
            h.name as household_name,
            h.id as household_id,
            (SELECT COUNT(*) FROM list_items li WHERE li.list_id = l.id) as item_count,
            (SELECT COUNT(*) FROM list_items li WHERE li.list_id = l.id AND li.is_completed = FALSE) as pending_count
     FROM lists l
     JOIN households h ON l.household_id = h.id
     JOIN user_households uh ON h.id = uh.household_id
     WHERE l.id = $1 AND uh.user_id = $2`,
    [id, userId]
  );
  return list;
}

/**
 * Update a list
 */
export async function updateList(id: string, name: string, description: string, is_active: boolean, userId: string) {
  // Check ownership
  const list = await queryOne(
    `SELECT * FROM lists WHERE id = $1`,
    [id]
  );

  if (!list) {
    throw new Error('List not found');
  }

  // Check if user has access
  const hasAccess = await queryOne(
    'SELECT 1 FROM user_households WHERE user_id = $1 AND household_id = (SELECT household_id FROM lists WHERE id = $2)',
    [userId, id]
  );

  if (!hasAccess) {
    throw new Error('You do not have access to this list');
  }

  await query(
    `UPDATE lists 
     SET name = COALESCE($1, name), 
         description = COALESCE($2, description),
         is_active = COALESCE($3, is_active),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4`,
    [name, description, is_active, id]
  );

  return getListById(id, userId);
}

/**
 * Delete a list
 */
export async function deleteList(id: string, userId: string) {
  const list = await queryOne(
    `SELECT * FROM lists WHERE id = $1`,
    [id]
  );

  if (!list) {
    throw new Error('List not found');
  }

  // Check if user has access
  const hasAccess = await queryOne(
    'SELECT 1 FROM user_households WHERE user_id = $1 AND household_id = (SELECT household_id FROM lists WHERE id = $2)',
    [userId, id]
  );

  if (!hasAccess) {
    throw new Error('You do not have access to this list');
  }

  await query('DELETE FROM list_items WHERE list_id = $1', [id]);
  await query('DELETE FROM lists WHERE id = $1', [id]);
}

/**
 * Create a list item
 */
export async function createListItem(
  name: string,
  description: string = '',
  quantity: number = 1,
  unit: string = '',
  category: string = '',
  is_organic: boolean = false,
  is_branded: boolean = false,
  brand: string = '',
  price: number = 0,
  currency: string = 'AZN',
  listId: string,
  userId: string
) {
  const item = await queryOne(
    `INSERT INTO list_items (name, description, quantity, unit, category, is_organic, is_branded, brand, price, currency, list_id, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [name, description, quantity, unit, category, is_organic, is_branded, brand, price, currency, listId, userId]
  );

  return item;
}

/**
 * Get list items for a list
 */
export async function getListItems(listId: string, userId: string) {
  const items = await query(
    `SELECT li.*, l.name as list_name,
            (SELECT COUNT(*) FROM list_items li2 WHERE li2.id = list_items.list_id AND list_items.list_id = li2.list_id AND li2.is_completed = TRUE) as completed_count
     FROM list_items li
     JOIN lists l ON li.list_id = l.id
     JOIN user_households uh ON l.household_id = uh.household_id
     WHERE li.list_id = $1 AND uh.user_id = $2
     ORDER BY li.name`,
    [listId, userId]
  );
  return items.rows;
}

/**
 * Update a list item
 */
export async function updateListItem(id: string, name: string, description: string, quantity: number, unit: string, listId: string, userId: string) {
  const item = await queryOne(
    'SELECT * FROM list_items WHERE id = $1',
    [id]
  );

  if (!item) {
    throw new Error('Item not found');
  }

  const hasAccess = await queryOne(
    'SELECT 1 FROM user_households WHERE user_id = $1 AND household_id = (SELECT household_id FROM lists WHERE id = $2)',
    [userId, listId]
  );

  if (!hasAccess) {
    throw new Error('You do not have access to this list');
  }

  await query(
    `UPDATE list_items 
     SET name = COALESCE($1, name), 
         description = COALESCE($2, description),
         quantity = COALESCE($3, quantity),
         unit = COALESCE($4, unit),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5`,
    [name, description, quantity, unit, id]
  );

  return getListItems(listId, userId);
}

/**
 * Toggle item completion
 */
export async function toggleItemCompletion(id: string, is_completed: boolean) {
  await query(
    `UPDATE list_items 
     SET is_completed = $1,
         completed_at = CASE WHEN $1 THEN CURRENT_TIMESTAMP ELSE NULL END
     WHERE id = $2`,
    [is_completed, id]
  );

  const item = await queryOne('SELECT * FROM list_items WHERE id = $1', [id]);
  return item;
}

/**
 * Delete a list item
 */
export async function deleteListItem(id: string, userId: string) {
  const item = await queryOne('SELECT * FROM list_items WHERE id = $1', [id]);

  if (!item) {
    throw new Error('Item not found');
  }

  const hasAccess = await queryOne(
    'SELECT 1 FROM user_households WHERE user_id = $1 AND household_id = (SELECT household_id FROM lists WHERE id = $2)',
    [userId, item.list_id]
  );

  if (!hasAccess) {
    throw new Error('You do not have access to this list');
  }

  await query('DELETE FROM list_items WHERE id = $1', [id]);
}

/**
 * Get list statistics
 */
export async function getListStats(listId: string, userId: string) {
  const stats = await queryOne(
    `SELECT 
         (SELECT COUNT(*) FROM list_items WHERE list_id = $1) as total_items,
         (SELECT COUNT(*) FROM list_items WHERE list_id = $1 AND is_completed = TRUE) as completed_items,
         (SELECT COUNT(*) FROM list_items WHERE list_id = $1 AND is_completed = FALSE) as pending_items,
         (SELECT SUM(price) FROM list_items WHERE list_id = $1 AND is_completed = TRUE) as total_spent,
         (SELECT SUM(price) FROM list_items WHERE list_id = $1 AND is_completed = FALSE) as estimated_total
     FROM lists
     WHERE id = $1
     JOIN user_households uh ON lists.household_id = uh.household_id
     WHERE uh.user_id = $2`,
    [listId, userId]
  );
  return stats;
}

/**
 * Get all items in a household
 */
export async function getHouseholdItems(householdId: string, userId: string) {
  const result = await query(
    `SELECT li.id, li.name, li.description, li.quantity, li.unit, li.category,
            li.is_organic, li.is_branded, li.brand, li.price, li.currency, li.is_completed, li.completed_at,
            li.created_at
     FROM list_items li
     JOIN lists l ON li.list_id = l.id
     JOIN user_households uh ON l.household_id = uh.household_id
     WHERE l.household_id = $1 AND uh.user_id = $2
     ORDER BY li.name`,
    [householdId, userId]
  );
  return result.rows;
}