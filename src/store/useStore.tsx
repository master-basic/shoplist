import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  User, GroceryList, HouseholdMember, Household, PurchaseSession, PurchasedItem, 
  PriceHistoryItem, ListItem, ListItem as ListItemType, HouseholdSettings, 
  NotificationPreferences, RecurringItem, Category, Unit, 
  PriceTrend, OCRData, OCRItem, ReceiptFile, SearchQuery, SearchFilters, 
  SearchResult, SmartSuggestion, Notification, OnboardingState, 
  OfflineQueueItem, SyncStatus 
} from '../types';

// Context type
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
  setToast: (message: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Store state type
type StoreState = {
  user: User | null;
  currentHouseholdId: string | null;
  households: Household[];
  lists: GroceryList[];
  purchaseSessions: PurchaseSession[];
  priceHistory: PriceHistoryItem[];
  loading: boolean;
  error: string | null;
  toast: string | null;
};

// Store actions type
type StoreActions = {
  setUser: (user: User | null) => void;
  setCurrentHouseholdId: (id: string | null) => void;
  addHousehold: (household: Household) => void;
  updateHousehold: (household: Household) => void;
  addList: (list: GroceryList) => void;
  deleteList: (listId: string) => void;
  addItemToList: (listId: string, item: Omit<ListItem, 'id'>) => void;
  updateItem: (listId: string, itemId: string, updates: Partial<ListItem>) => void;
  toggleItem: (listId: string, itemId: string) => void;
  deleteListItem: (listId: string, itemId: string) => void;
  duplicateList: (listId: string) => GroceryList | undefined;
  archiveList: (listId: string) => void;
  reorderItems: (listId: string, itemIds: string[]) => void;
  addPurchaseSession: (session: Omit<PurchaseSession, 'id'>) => void;
  addPurchasedItem: (sessionId: string, item: Omit<PurchasedItem, 'id' | 'sessionId'>) => void;
  addPriceHistory: (item: PriceHistoryItem) => void;
  getPriceHistory: (itemName: string, days?: number) => PriceHistoryItem[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setToast: (toast: string | null) => void;
};

// Store
const initialState: StoreState = {
  user: null,
  currentHouseholdId: null,
  households: [],
  lists: [],
  purchaseSessions: [],
  priceHistory: [],
  loading: false,
  error: null,
  toast: null,
};

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      setCurrentHouseholdId: (id) => set({ currentHouseholdId: id }),
      addHousehold: (household) => set({ households: [...get().households, household] }),
      updateHousehold: (household) => set({ households: get().households.map((h) => (h.id === household.id ? household : h)) }),
      addList: (list) => set({ lists: [...get().lists, list] }),
      deleteList: (listId) => set({ lists: get().lists.filter((l) => l.id !== listId) }),
      addItemToList: (listId, item) => {
        const list = get().lists.find((l) => l.id === listId);
        if (!list) return;
        const newItem = { ...item, id: uuidv4(), sort_order: list.items.length };
        set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: [...l.items, newItem] } : l)) });
      },
      updateItem: (listId, itemId, updates) => {
        set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: l.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)) } : l)) });
      },
      toggleItem: (listId, itemId) => {
        const list = get().lists.find((l) => l.id === listId);
        if (!list) return;
        const item = list.items.find((i) => i.id === itemId);
        if (!item) return;
        const isChecked = !item.checked_by;
        const updatedItem = { ...item, checked_by: isChecked ? get().user?.id : undefined, checked_at: isChecked ? new Date().toISOString() : undefined };
        set({ toast: isChecked ? 'Item marked as bought' : 'Item removed from list' });
        set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: l.items.map((i) => (i.id === itemId ? updatedItem : i)) } : l)) });
      },
      deleteListItem: (listId, itemId) => {
        set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l)) });
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
        const reorderedItems = itemIds.map((itemId) => list.items.find((i) => i.id === itemId)).filter(Boolean) as ListItemType[];
        set({ lists: get().lists.map((l) => (l.id === listId ? { ...l, items: reorderedItems } : l)) });
      },
      addPurchaseSession: (session) => set({ purchaseSessions: [...get().purchaseSessions, { ...session, id: uuidv4(), created_at: new Date().toISOString() }] }),
      addPurchasedItem: (sessionId, item) => {
        set({ purchaseSessions: get().purchaseSessions.map((s) => (s.id === sessionId ? { ...s, items: [...s.items, { ...item, id: uuidv4(), session_id: sessionId, created_at: new Date().toISOString() }] } : s)) });
      },
      addPriceHistory: (item) => set({ priceHistory: [...get().priceHistory, { ...item, id: uuidv4() }] }),
      getPriceHistory: (itemName, days = 90) => {
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        return get().priceHistory.filter((item) => { const itemDate = new Date(item.purchased_at); return item.item_name.toLowerCase().includes(itemName.toLowerCase()) && itemDate >= cutoffDate; }).sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime());
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setToast: (toast) => set({ toast }),
    }),
    { name: 'grocerymind-store', storage: createJSONStorage(() => localStorage), partialize: (state) => ({ lists: state.lists, priceHistory: state.priceHistory }) }
  )
);

// Error Boundary Component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">The application encountered an error.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Provider Component
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = useStore();
  const [storageError, setStorageError] = useState<Error | null>(null);

  // Validate storage availability
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

  // Memoize store value to prevent recreation
  const contextValue = useMemo(() => store, [store]);

  // Error handling callback
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('ErrorBoundary caught an error', error);
    console.error('ErrorInfo:', errorInfo);
    useStore.getState().setError('An error occurred: ' + error.message);
  };

  return (
    <ErrorBoundary onError={handleError}>
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
    </ErrorBoundary>
  );
};

// Custom Hook
export const useStoreContext = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};

// Utility functions
export const normalizeItemName = (name: string): string => {
  return name.toLowerCase().replace(/[^\w]/g, '').replace(/[ \t\n\r]+/g, ' ').trim();
};

export const fuzzyMatchItem = (input: string, target: string): boolean => {
  const normalizedInput = normalizeItemName(input);
  const normalizedTarget = normalizeItemName(target);
  return normalizedInput.includes(normalizedTarget) || normalizedTarget.includes(normalizedInput);
};

// Re-export all types for convenience
export type { 
  GroceryItem, GroceryList, Household, User, HouseholdMember, 
  PurchaseSession, PurchasedItem, PriceHistoryItem, ListItem, 
  HouseholdSettings, NotificationPreferences, PriceTrend, OCRData, 
  OCRItem, ReceiptFile, SearchQuery, SearchFilters, SearchResult, 
  SmartSuggestion, Notification, OnboardingState, OfflineQueueItem, 
  SyncStatus, RecurringItem, Category, Unit, ListStatus 
} from '../types';
