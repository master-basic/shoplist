import type { User, Household, GroceryList, Notification, OfflineQueueItem } from './db';

export interface AppState {
  user: User | null;
  household: Household | null;
  currentList: GroceryList | null;
  notifications: Notification[];
  offlineQueue: OfflineQueueItem[];
}

export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}
