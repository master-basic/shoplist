import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, GroceryList, HouseholdMember, Household, PurchaseSession, PurchasedItem, PriceHistoryItem, ListItem, ListItem as ListItemType, HouseholdSettings, NotificationPreferences, RecurringItem, Category, Unit, PriceTrend, OCRData, OCRItem, ReceiptFile, SearchQuery, SearchFilters, SearchResult, SmartSuggestion, Notification, OnboardingState, OfflineQueueItem, SyncStatus } from '../types';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createHouseholdSlice, HouseholdSlice } from './slices/householdSlice';
import { createListSlice, ListSlice } from './slices/listSlice';
import { createPurchaseSlice, PurchaseSlice } from './slices/purchaseSlice';
import { createPriceHistorySlice, PriceHistorySlice } from './slices/priceHistorySlice';
import { createUISlice, UISlice } from './slices/uiSlice';

type StoreState = UserSlice & HouseholdSlice & ListSlice & PurchaseSlice & PriceHistorySlice & UISlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createHouseholdSlice(...a),
      ...createListSlice(...a),
      ...createPurchaseSlice(...a),
      ...createPriceHistorySlice(...a),
      ...createUISlice(...a),
    }),
    { name: 'grocerymind-store', storage: createJSONStorage(() => localStorage), partialize: (state) => ({ user: state.user }) }
  )
);

interface StoreContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentHouseholdId: string | null;
  setCurrentHouseholdId: (id: string | null) => void;
  households: Household[];
  addHousehold: (household: Household) => void;
  updateHousehold: (household: Household) => void;
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
  purchaseSessions: PurchaseSession[];
  addPurchaseSession: (session: Omit<PurchaseSession, 'id'>) => void;
  addPurchasedItem: (sessionId: string, item: Omit<PurchasedItem, 'id' | 'sessionId'>) => void;
  priceHistory: PriceHistoryItem[];
  addPriceHistory: (item: PriceHistoryItem) => void;
  getPriceHistory: (itemName: string, days?: number) => PriceHistoryItem[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  toast: string | null;
  setToast: (toast: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = useStore();
  const [storageError, setStorageError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const test = typeof localStorage !== 'undefined' ? localStorage.getItem('test') : null;
      if (test === null) {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
      }
    } catch (e) {
      setStorageError(e instanceof Error ? e : new Error('Storage unavailable'));
    }
  }, []);

  const contextValue = useMemo(() => store, [store]);

  return (
    <StoreContext.Provider value={contextValue}>
      {storageError ? (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-yellow-600 mb-4">Storage unavailable</h1>
            <p className="text-gray-600 mb-4">Your browser does not support local storage. Data will not be saved.</p>
            <p className="text-sm text-gray-500">Error: {storageError.message}</p>
          </div>
        </div>
      ) : (
        children
      )}
    </StoreContext.Provider>
  );
};

export const useStoreContext = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};

export type { GroceryItem, GroceryList, Household, User, HouseholdMember, PurchaseSession, PurchasedItem, PriceHistoryItem, ListItem, HouseholdSettings, NotificationPreferences, PriceTrend, OCRData, OCRItem, ReceiptFile, SearchQuery, SearchFilters, SearchResult, SmartSuggestion, Notification, OnboardingState, OfflineQueueItem, SyncStatus, RecurringItem, Category, Unit, ListStatus } from '../types';
