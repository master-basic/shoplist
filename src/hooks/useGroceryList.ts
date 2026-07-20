import { useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { useHousehold } from './useHousehold';
import { useAuth } from './useAuth';
import type { ListItem, GroceryList, GroceryItem, PriceHistoryItem, OCRData, PurchasedItem, PurchaseSession } from '@/types';
import {
  getUserLists,
  getListById,
  getListItems,
  createListItem,
  updateListItem,
  deleteListItem,
  toggleItemCompletion,
  deleteList as apiDeleteList,
  createList as apiCreateList,
  getHouseholdItems
} from '@/api/lists';
import {
  createReceipt,
  createReceiptItems,
  updateReceiptStatus,
  getUserReceipts,
  getReceiptItems as getReceiptItemsApi,
  deleteReceipt
} from '@/api/receipts';

export const useGroceryList = () => {
  const { lists, addItemToList, updateItem, duplicateList, archiveList: storeArchiveList, reorderItems: reorderItemsAction, addPurchaseSession, addPurchasedItem, addPriceHistory } = useStore();
  const { currentHouseholdId } = useHousehold();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load lists for current household
  const loadLists = useCallback(async (householdId?: string) => {
    const id = householdId || currentHouseholdId;
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const listsData = await getUserLists(user!.id);
      
      // Load all lists and items
      const listsWithItems: GroceryList[] = [];
      for (const list of listsData) {
        const items = await getListItems(list.id);
        const listWithItems: GroceryList = {
          ...list,
          items: items.map((item: ListItem) => ({
            ...item,
            checked_by: item.checked_by || undefined,
            checked_at: item.checked_at || undefined,
            unit: item.unit || 'pcs',
            quantity: item.quantity || 1,
            estimated_price: item.estimated_price || 0
          })),
          updated_at: new Date().toISOString()
        };
        listsWithItems.push(listWithItems);
      }
      
      // Store lists in store (we'd need to update existing lists, not add new ones)
      // For now, we'll rely on the store's lists being managed separately
    } catch (err) {
      console.error('Error loading lists:', err);
      setError(err instanceof Error ? err.message : 'Failed to load lists');
    } finally {
      setLoading(false);
    }
  }, [currentHouseholdId, user]);

  // Create grocery list
  const createList = async (name: string, householdId?: string) => {
    const id = householdId || currentHouseholdId;
    if (!id) throw new Error('No household selected');
    
    setLoading(true);
    setError(null);
    
    try {
      const listData = await apiCreateList(name, id, user!.id);
      
      // Create an initial empty item in the list
      addItemToList(listData.id, {
        name: '',
        quantity: 1,
        unit: 'pcs',
        category: '',
        estimated_price: 0,
        assigned_to: [],
        notes: '',
        sort_order: 0,
        is_recurring: false,
        price_history: [],
        is_checked: false,
        list_id: listData.id
      });
      
      return listData;
    } catch (err) {
      console.error('Error creating list:', err);
      setError(err instanceof Error ? err.message : 'Failed to create list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete grocery list
  const deleteList = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiDeleteList(listId, user!.id);
    } catch (err) {
      console.error('Error deleting list:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add item to list
  const addItem = async (listId: string, item: Omit<ListItem, 'id' | 'sort_order' | 'is_checked' | 'checked_by' | 'checked_at'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newItem = await createListItem(
        item.name,
        item.quantity || 1,
        item.estimated_price || 0,
        item.category || 'Other',
        listId,
        user!.id
      );
      
      addItemToList(listId, {
        ...newItem,
        checked_by: undefined,
        checked_at: undefined,
        unit: newItem.unit || 'pcs',
        quantity: newItem.quantity || 1,
        estimated_price: newItem.estimated_price || 0,
        price_history: []
      });
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update item
  const updateItemFn = async (listId: string, itemId: string, updates: Partial<ListItem>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedItem = await updateListItem(
        itemId,
        listId,
        updates.name,
        updates.quantity,
        updates.estimated_price,
        updates.category
      );
      
      updateItem(listId, itemId, {
        ...updatedItem,
        checked_by: updatedItem.checked_by || undefined,
        checked_at: updatedItem.checked_at || undefined,
        unit: updatedItem.unit || 'pcs',
        quantity: updatedItem.quantity || 1,
        estimated_price: updatedItem.estimated_price || 0,
        price_history: updatedItem.price_history || []
      });
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const deleteItem = async (listId: string, itemId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteListItem(itemId, listId, user!.id);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle item checked status
  const toggleItemFn = async (listId: string, itemId: string) => {
    const list = lists.find((l: GroceryList) => l.id === listId);
    if (!list) return;
    
    const item = list.items.find((i: ListItem) => i.id === itemId);
    if (!item) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const isChecked = !item.checked_by;
      
      await toggleItemCompletion(itemId, isChecked);
      
      useStore.getState().toggleItem(listId, itemId);
    } catch (err) {
      console.error('Error toggling item:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark all items as checked
  const markAllChecked = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const list = lists.find((l: GroceryList) => l.id === listId);
      if (!list) return;
      
      const itemIds = list.items.map((i: ListItem) => i.id);
      
      for (const itemId of itemIds) {
        await toggleItemCompletion(itemId, true);
      }
    } catch (err) {
      console.error('Error marking all checked:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark all items');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark all items as unchecked
  const markAllUnchecked = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const list = lists.find((l: GroceryList) => l.id === listId);
      if (!list) return;
      
      const itemIds = list.items.map((i: ListItem) => i.id);
      
      for (const itemId of itemIds) {
        await toggleItemCompletion(itemId, false);
      }
    } catch (err) {
      console.error('Error marking all unchecked:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark all items');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Duplicate list
  const duplicateListFn = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const list = lists.find((l: GroceryList) => l.id === listId);
      if (!list) return;
      
      const listData = await getListById(listId, user!.id);
      const existingItems = await getListItems(listId);
      
      for (const item of existingItems) {
        await createListItem(
          item.name,
          item.quantity,
          item.estimated_price,
          item.category,
          listData.household_id,
          listData.created_by
        );
      }
      
      duplicateList(listId);
    } catch (err) {
      console.error('Error duplicating list:', err);
      setError(err instanceof Error ? err.message : 'Failed to duplicate list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update list status
  const updateList = async (listId: string, status: string, userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const list = lists.find((l: GroceryList) => l.id === listId);
      if (!list) return;
      
      await fetch(`http://localhost:3001/api/lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: list.name, householdId: list.household_id })
      });
    } catch (err) {
      console.error('Error updating list:', err);
      setError(err instanceof Error ? err.message : 'Failed to update list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Archive list
  const archiveListFn = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateList(listId, 'archived', user!.id);
      storeArchiveList(listId);
    } catch (err) {
      console.error('Error archiving list:', err);
      setError(err instanceof Error ? err.message : 'Failed to archive list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Restore archived list
  const restoreList = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateList(listId, 'active', user!.id);
      await loadLists();
    } catch (err) {
      console.error('Error restoring list:', err);
      setError(err instanceof Error ? err.message : 'Failed to restore list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reorder items
  const reorderItems = async (listId: string, itemIds: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      for (let i = 0; i < itemIds.length; i++) {
        await updateListItem(
          itemIds[i],
          listId,
          undefined,
          undefined,
          undefined,
          i.toString()
        );
      }
      
      reorderItemsAction(listId, itemIds);
    } catch (err) {
      console.error('Error reordering items:', err);
      setError(err instanceof Error ? err.message : 'Failed to reorder items');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create purchase session from list
  const createPurchaseSession = async (
    storeName: string,
    listId: string,
    userId: string,
    ocrData?: OCRData
  ): Promise<{ session: PurchaseSession; items: PurchasedItem[] }> => {
    setLoading(true);
    setError(null);
    
    try {
      const list = lists.find((l: GroceryList) => l.id === listId);
      if (!list) throw new Error('List not found');
      
      const purchasedItems: PurchasedItem[] = [];
      const priceHistoryItems: PriceHistoryItem[] = [];
      
      // Process list items
      for (const item of list.items) {
        const purchasedItem: PurchasedItem = {
          id: crypto.randomUUID(),
          session_id: crypto.randomUUID(),
          name: item.name,
          category: item.category,
          quantity: item.quantity || 1,
          unit: item.unit || 'pcs',
          unit_price: item.estimated_price || 0,
          total_price: item.estimated_price || 0,
          is_on_list: true,
          created_at: new Date().toISOString(),
          ocr_raw_text: undefined,
          ocr_confidence: undefined
        };
        
        purchasedItems.push(purchasedItem);
        priceHistoryItems.push({
          id: crypto.randomUUID(),
          item_name: item.name,
          store_name: storeName,
          unit_price: item.estimated_price || 0,
          purchased_at: new Date().toISOString(),
          session_id: crypto.randomUUID(),
          bought_by: userId,
          quantity: item.quantity || 1
        });
      }
      
      // Add to store
      const session: PurchaseSession = {
        id: crypto.randomUUID(),
        list_id: listId,
        bought_by: userId,
        store_name: storeName,
        purchase_date: new Date().toISOString(),
        total_paid: 0,
        created_at: new Date().toISOString(),
        items: purchasedItems
      };
      
      addPurchaseSession(session);
      for (const ph of priceHistoryItems) {
        addPriceHistory(ph);
      }
      
      return { session, items: purchasedItems };
    } catch (err) {
      console.error('Error creating purchase session:', err);
      setError(err instanceof Error ? err.message : 'Failed to create purchase session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    lists,
    loading,
    error,
    loadLists,
    createList,
    deleteList,
    addItem,
    updateItem: updateItemFn,
    deleteItem,
    toggleItem: toggleItemFn,
    markAllChecked,
    markAllUnchecked,
    duplicateList: duplicateListFn,
    archiveList: archiveListFn,
    restoreList,
    reorderItems,
    updateList,
    createPurchaseSession
  };
};