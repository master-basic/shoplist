import type { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { PurchaseSession, PurchasedItem } from '@/types';

export interface PurchaseSlice {
  purchaseSessions: PurchaseSession[];
  addPurchaseSession: (session: Omit<PurchaseSession, 'id'>) => void;
  addPurchasedItem: (sessionId: string, item: Omit<PurchasedItem, 'id' | 'sessionId'>) => void;
}

export const createPurchaseSlice: StateCreator<PurchaseSlice, [], [], PurchaseSlice> = (set, get) => ({
  purchaseSessions: [],
  addPurchaseSession: (session) => set({ purchaseSessions: [...get().purchaseSessions, { ...session, id: uuidv4(), created_at: new Date().toISOString() }] }),
  addPurchasedItem: (sessionId, item) => {
    set({ purchaseSessions: get().purchaseSessions.map((s) => (s.id === sessionId ? { ...s, items: [...s.items, { ...item, id: uuidv4(), session_id: sessionId, created_at: new Date().toISOString() }] } : s)) });
  },
});
