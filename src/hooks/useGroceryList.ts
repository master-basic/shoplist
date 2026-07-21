import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';
import { API_BASE } from '@/config';
import { useHousehold } from './useHousehold';
import { useAuth } from './useAuth';
import type { ListItem, GroceryList, OCRData } from '@/types';
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

export const useGroceryList = () => {
  const { lists, addItemToList, updateItem, duplicateList, archiveList: storeArchiveList, reorderItems: reorderItemsAction } = useStore();
  const { currentHouseholdId } = useHousehold();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const listsQuery = useQuery({
    queryKey: ['lists', user?.id],
    queryFn: () => getUserLists(user!.id),
    enabled: !!user?.id,
  });

  const loadLists = useCallback(async (householdId?: string) => {
    await queryClient.invalidateQueries({ queryKey: ['lists', user?.id] });
  }, [queryClient, user?.id]);

  const createListMutation = useMutation({
    mutationFn: async ({ name, householdId }: { name: string; householdId: string }) => {
      const id = householdId || currentHouseholdId;
      if (!id) throw new Error('No household selected');
      const listData = await apiCreateList(name, id, user!.id);
      return listData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', user?.id] });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: async (listId: string) => {
      await apiDeleteList(listId, user!.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', user?.id] });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ listId, item }: { listId: string; item: Omit<ListItem, 'id' | 'sort_order' | 'is_checked' | 'checked_by' | 'checked_at'> }) => {
      const newItem = await createListItem(
        item.name, item.quantity || 1, item.estimated_price || 0,
        item.category || 'Other', listId, user!.id
      );
      return { listId, newItem };
    },
    onSuccess: ({ listId, newItem }) => {
      addItemToList(listId, {
        ...newItem, checked_by: undefined, checked_at: undefined,
        unit: newItem.unit || 'pcs', quantity: newItem.quantity || 1,
        estimated_price: newItem.estimated_price || 0, price_history: []
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ listId, itemId, updates }: { listId: string; itemId: string; updates: Partial<ListItem> }) => {
      const updatedItem = await updateListItem(itemId, listId, updates.name, updates.quantity, updates.estimated_price, updates.category);
      return { listId, itemId, updatedItem };
    },
    onSuccess: ({ listId, itemId, updatedItem }) => {
      updateItem(listId, itemId, {
        ...updatedItem, checked_by: updatedItem.checked_by || undefined,
        checked_at: updatedItem.checked_at || undefined, unit: updatedItem.unit || 'pcs',
        quantity: updatedItem.quantity || 1, estimated_price: updatedItem.estimated_price || 0,
        price_history: updatedItem.price_history || []
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async ({ listId, itemId }: { listId: string; itemId: string }) => {
      await deleteListItem(itemId, listId, user!.id);
    },
  });

  const toggleItemMutation = useMutation({
    mutationFn: async ({ itemId, isChecked }: { itemId: string; isChecked: boolean }) => {
      await toggleItemCompletion(itemId, isChecked);
    },
  });

  const createPurchaseSessionMutation = useMutation({
    mutationFn: async ({ storeName, listId, userId, ocrData }: { storeName: string; listId: string; userId: string; ocrData?: OCRData }) => {
      const list = lists.find((l: GroceryList) => l.id === listId);
      if (!list) throw new Error('List not found');
      const items = list.items.map(item => ({
        listItemId: item.id, name: item.name,
        quantity: item.quantity || 1, unitPrice: item.estimated_price || 0,
        totalPrice: item.estimated_price || 0,
      }));
      const res = await fetch(`${API_BASE}/api/purchase-sessions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, storeName, userId, householdId: list.household_id, items, ocrData }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Failed to create purchase session'); }
      const data = await res.json();
      return { session: data.session, items: data.session.items || [] };
    },
  });

  return {
    lists,
    loading: listsQuery.isLoading,
    error: listsQuery.error ? (listsQuery.error as Error).message : null,
    loadLists,
    createList: createListMutation.mutate,
    deleteList: deleteListMutation.mutate,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
    toggleItem: toggleItemMutation.mutate,
    createPurchaseSession: createPurchaseSessionMutation.mutate,
  };
};
