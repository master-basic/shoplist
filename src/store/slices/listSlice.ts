import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { GroceryList, ListItem } from '@/types';
import type { UserSlice } from './userSlice';

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
  addList: (list) => set({ lists: [...get().lists, list] }),
  deleteList: (listId) => set({ lists: get().lists.filter((l) => l.id !== listId) }),
  deleteListItem: (listId, itemId) => {
    set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l)) });
  },
  addItemToList: (listId, item) => {
    const list = get().lists.find((l) => l.id === listId);
    if (!list) return;
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
    const updatedItems = [...list.items, newItem];
    set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: updatedItems, updated_at: new Date().toISOString() } : l)) });
  },
  updateItem: (listId, itemId, updates) => {
    const list = get().lists.find((l) => l.id === listId);
    if (!list) return;
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
    if (!list) return;
    const item = list.items.find((i) => i.id === itemId);
    if (!item) return;
    const newChecked = !item.is_checked;
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
    const originalList = get().lists.find((l) => l.id === listId);
    if (!originalList) return undefined;
    const duplicate = { ...originalList, id: uuidv4(), name: originalList.name + ' (Copy)', items: originalList.items.map((item) => ({ ...item, id: uuidv4(), checked_by: undefined, checked_at: undefined })) };
    set({ lists: [...get().lists, duplicate] });
    return duplicate;
  },
  archiveList: (listId) => set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, status: 'archived' } : l)) }),
  reorderItems: (listId, itemIds) => {
    const list = get().lists.find((l) => l.id === listId);
    if (!list) return;
    const reorderedItems = itemIds.map((itemId) => list.items.find((i) => i.id === itemId)).filter(Boolean) as ListItem[];
    set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: reorderedItems } : l)) });
  },
});
