import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { GroceryList, ListItem } from '@/types';
import type { UserSlice } from './userSlice';
import log from '@/utils/debug';

export interface ListSlice {
  lists: GroceryList[];
  addList: (list: GroceryList) => void;
  deleteList: (listId: string) => void;
  deleteListItem: (listId: string, itemId: string) => void;
  addItemToList: (listId: string, item: Omit<ListItem, 'id'>) => void;
  updateItem: (listId: string, itemId: string, updates: Partial<ListItem>) => void;
  toggleItem: (listId: string, itemId: string) => void;
  duplicateList: (listId: string) => GroceryList | undefined;
  archiveList: (listId: string) => void;
  reorderItems: (listId: string, itemIds: string[]) => void;
}

type ListSliceCreator = StateCreator<ListSlice & UserSlice, [], [], ListSlice>;

export const createListSlice: ListSliceCreator = (set, get) => ({
  lists: [],
  addList: (list) => {
    log.info('Store addList', { listId: list.id, name: list.name });
    set({ lists: [...get().lists, list] });
  },
  deleteList: (listId) => {
    log.info('Store deleteList', { listId });
    set({ lists: get().lists.filter((l) => l.id !== listId) });
  },
  deleteListItem: (listId, itemId) => {
    log.info('Store deleteListItem', { listId, itemId });
    set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l)) });
  },
  addItemToList: (listId, item) => {
    const list = get().lists.find((l) => l.id === listId);
    if (!list) { log.warn('Store addItemToList: list not found', { listId }); return; }
    const newItem = {
      ...item,
      id: uuidv4(),
      sort_order: list.items.length,
      is_checked: false,
      is_recurring: item.is_recurring ?? false,
      restock_threshold: item.restock_threshold ?? undefined,
      last_bought_at: item.last_bought_at ?? undefined,
      price_history: item.price_history ?? [],
      unit: item.unit ?? 'pcs',
      quantity: item.quantity ?? 1,
      estimated_price: item.estimated_price ?? 0,
    };
    log.info('Store addItemToList', { listId, itemName: newItem.name, itemId: newItem.id });
    const updatedItems = [...list.items, newItem];
    set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: updatedItems, updated_at: new Date().toISOString() } : l)) });
  },
  updateItem: (listId, itemId, updates) => {
    log.info('Store updateItem', { listId, itemId, updates: JSON.stringify(updates) });
    const list = get().lists.find((l) => l.id === listId);
    if (!list) { log.warn('Store updateItem: list not found', { listId }); return; }
    const updatedItems = list.items.map((i) => {
      if (i.id === itemId) {
        if (updates.sort_order !== undefined) {
          const newOrder = updates.sort_order;
          const remainingItems = list.items.filter(item => item.id !== itemId);
          const reorderedItems = [...remainingItems];
          reorderedItems.splice(newOrder, 0, { ...i, ...updates, sort_order: newOrder });
          return { ...i, ...updates, sort_order: newOrder };
        }
        return { ...i, ...updates, updated_at: new Date().toISOString() };
      }
      return i;
    });
    set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: updatedItems, updated_at: new Date().toISOString() } : l)) });
  },
  toggleItem: (listId, itemId) => {
    const list = get().lists.find((l) => l.id === listId);
    if (!list) { log.warn('Store toggleItem: list not found', { listId }); return; }
    const item = list.items.find((i) => i.id === itemId);
    if (!item) { log.warn('Store toggleItem: item not found', { itemId }); return; }
    const newChecked = !item.is_checked;
    log.info('Store toggleItem', { listId, itemId, newChecked });
    const userId = get().user?.id;
    const updatedItem = {
      ...item,
      is_checked: newChecked,
      checked_by: newChecked ? userId : undefined,
      checked_at: newChecked ? new Date().toISOString() : undefined,
    };
    set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: l.items.map((i) => (i.id === itemId ? updatedItem : i)) } : l)) });
  },
  duplicateList: (listId) => {
    log.info('Store duplicateList', { listId });
    const originalList = get().lists.find((l) => l.id === listId);
    if (!originalList) { log.warn('Store duplicateList: list not found', { listId }); return undefined; }
    const duplicate = { ...originalList, id: uuidv4(), name: originalList.name + ' (Copy)', items: originalList.items.map((item) => ({ ...item, id: uuidv4(), checked_by: undefined, checked_at: undefined })) };
    set({ lists: [...get().lists, duplicate] });
    log.info('Store duplicateList success', { newId: duplicate.id });
    return duplicate;
  },
  archiveList: (listId) => {
    log.info('Store archiveList', { listId });
    set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, status: 'archived' } : l)) });
  },
  reorderItems: (listId, itemIds) => {
    log.info('Store reorderItems', { listId, itemCount: itemIds.length });
    const list = get().lists.find((l) => l.id === listId);
    if (!list) { log.warn('Store reorderItems: list not found', { listId }); return; }
    const reorderedItems = itemIds.map((itemId) => list.items.find((i) => i.id === itemId)).filter(Boolean) as ListItem[];
    set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: reorderedItems } : l)) });
  },
});
