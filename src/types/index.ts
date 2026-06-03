// =====================================================
// GroceryMind - TypeScript Type Definitions
// =====================================================

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Normalize item name for comparison (removes brands, standardizes units)
 */
export const normalizeItemName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Fuzzy match two strings with optional threshold
 */
export const fuzzyMatch = (str1: string, str2: string, threshold = 0.5): number => {
  if (!str1 || !str2) return 0;
  
  const s1 = normalizeItemName(str1);
  const s2 = normalizeItemName(str2);
  
  // Exact match
  if (s1 === s2) return 1;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Simple character overlap calculation
  const chars1 = new Set(s1.split(' '));
  const chars2 = new Set(s2.split(' '));
  const overlap = [...chars1].filter(c => chars2.has(c)).length;
  const total = new Set([...chars1, ...chars2]).size;
  
  return total > 0 ? overlap / total : 0;
};

/**
 * Normalize store name to standard format
 */
export const normalizeStoreName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
};

/**
 * List of common stores for matching
 */
export const STORES = [
  'Bravo', 'Carrefour', 'Hypernova', 'Lidl', 'A101', 'OST', 'Gümüşpala',
  'Şok', 'Almaza', '1920', 'Berk', 'Akmerkez', 'Migros', 'Metro', 'Bim'
];

// =====================================================
// USER TYPES
// =====================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  created_at: string;
  preferred_currency: string;
  notification_preferences: NotificationPreferences;
  households: Household[];
}

export interface NotificationPreferences {
  push_notifications: boolean;
  price_change_alerts: boolean;
  weekly_summary: boolean;
  list_updates: boolean;
  reminders: boolean;
}

// =====================================================
// HOUSEHOLD TYPES
// =====================================================

export interface Household {
  id: string;
  name: string;
  currency: string;
  created_by: string; // user id
  created_at: string;
  members: HouseholdMember[];
  lists: GroceryList[];
  settings: HouseholdSettings;
}

export interface HouseholdMember {
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  invited_by?: string;
}

export interface HouseholdSettings {
  invite_code: string;
  invite_link: string;
  default_category: string;
  default_store: string;
  auto_sync: boolean;
}

// =====================================================
// GROCERY LIST TYPES
// =====================================================

export type ListStatus = 'active' | 'completed' | 'archived';

export interface GroceryList {
  id: string;
  household_id: string;
  name: string;
  description?: string;
  created_by: string; // user id
  created_at: string;
  updated_at: string;
  status: ListStatus;
  budget: number;
  total_spent: number;
  items: ListItem[];
  assignments: ItemAssignment[];
}

// Grocery item for adding/editing (simplified form version)
export interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  estimated_price: number;
  preferred_store?: string;
  notes?: string;
  assigned_to?: string[];
  is_recurring?: boolean;
  restock_threshold?: number;
}

export interface ListItem {
  id: string;
  list_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimated_price: number;
  preferred_store?: string;
  assigned_to: string[]; // array of user ids
  checked_by?: string; // user id who checked it off
  checked_at?: string;
  notes?: string;
  sort_order: number;
  is_recurring: boolean;
  restock_threshold?: number;
  last_bought_at?: string;
  price_history: PriceHistoryItem[];
  // Shopping mode fields
  is_checked: boolean;
  actual_price?: number;
  actual_quantity?: number;
}

export interface ItemAssignment {
  item_id: string;
  assigned_to: string[]; // user ids
  assigned_at: string;
  assigned_by: string;
}

// =====================================================
// PURCHASE TYPES
// =====================================================

export interface PurchaseSession {
  id: string;
  list_id: string;
  bought_by: string; // user id
  store_name: string;
  purchase_date: string;
  receipt_image_url?: string;
  receipt_ocr_data?: OCRData;
  total_paid: number;
  actual_total?: number;
  created_at: string;
  items: PurchasedItem[];
}

export interface PurchasedItem {
  id: string;
  session_id: string;
  list_item_id?: string; // nullable - can be items not on list
  name: string;
  category?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  is_on_list: boolean;
  ocr_raw_text?: string;
  ocr_confidence?: number;
  notes?: string;
  created_at: string;
}

// =====================================================
// PRICE HISTORY TYPES
// =====================================================

export interface PriceHistoryItem {
  id: string;
  item_name: string; // normalized name
  store_name: string;
  unit_price: number;
  purchased_at: string;
  session_id: string;
  bought_by: string;
  quantity: number;
}

export interface PriceTrend {
  item_name: string;
  current_price: number;
  previous_price: number;
  change_percent: number;
  trend_direction: 'up' | 'down' | 'neutral';
  lowest_price: number;
  highest_price: number;
  avg_price_30d: number;
  avg_price_90d: number;
  avg_price_180d: number;
  cheapest_store: string;
  price_history: PriceHistoryItem[];
}

// =====================================================
// OCR / RECEIPT TYPES
// =====================================================

export interface OCRData {
  store_name?: string;
  purchase_date?: string;
  purchase_time?: string;
  total?: number;
  subtotal?: number;
  tax?: number;
  items: OCRItem[];
  raw_text: string;
  confidence_score: number;
}

export interface OCRItem {
  name: string;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  total_price?: number;
  confidence: number;
  matched_item_id?: string; // matched to existing list item
}

export interface ReceiptFile {
  id: string;
  user_id: string;
  session_id: string;
  file_url: string;
  file_type: 'image' | 'pdf';
  uploaded_at: string;
}

// =====================================================
// SEARCH TYPES
// =====================================================

export interface SearchQuery {
  q: string;
  filters: SearchFilters;
}

export interface SearchFilters {
  household_id?: string;
  member_id?: string;
  date_from?: string;
  date_to?: string;
  store?: string;
  category?: string;
  price_min?: number;
  price_max?: number;
  list_id?: string;
}

export interface SearchResult {
  id: string;
  type: 'item' | 'list' | 'store' | 'user' | 'purchase';
  data: unknown;
  relevance_score: number;
}

export interface SmartSuggestion {
  item_name: string;
  last_price: number;
  store: string;
  frequency: number;
  last_bought_at?: string;
}

// =====================================================
// NOTIFICATION TYPES
// =====================================================

export type NotificationType = 
  | 'price_change'
  | 'item_bought'
  | 'list_started'
  | 'weekly_summary'
  | 'reminder'
  | 'budget_warning'
  | 'new_member'
  | 'list_completed';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

// =====================================================
// ONBOARDING TYPES
// =====================================================

export interface OnboardingState {
  has_completed: boolean;
  household_id?: string;
  demo_mode: boolean;
  tour_completed: boolean;
}

// =====================================================
// PWA / OFFLINE TYPES
// =====================================================

export interface OfflineQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  entity_type: 'list' | 'item' | 'purchase' | 'notification';
  entity_id: string;
  data: unknown;
  timestamp: number;
  retry_count: number;
}

export interface SyncStatus {
  last_sync: string;
  pending_items: OfflineQueueItem[];
  is_syncing: boolean;
}

// =====================================================
// CATEGORY TYPES
// =====================================================

export const CATEGORIES = [
  'produce',
  'dairy',
  'meat',
  'bakery',
  'frozen',
  'household',
  'pantry',
  'beverages',
  'snacks',
  'personal_care',
  'other',
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_GROUPS = {
  produce: 'Produce',
  dairy: 'Dairy & Eggs',
  meat: 'Meat & Seafood',
  bakery: 'Bakery',
  frozen: 'Frozen Foods',
  household: 'Household Supplies',
  pantry: 'Pantry',
  beverages: 'Beverages',
  snacks: 'Snacks',
  personal_care: 'Personal Care',
  other: 'Other',
};

// =====================================================
// UNIT TYPES
// =====================================================

export const UNITS = [
  'pcs',
  'kg',
  'g',
  'l',
  'ml',
  'oz',
  'lb',
  'dozen',
  'pack',
  'can',
  'bottle',
  'box',
] as const;

export type Unit = typeof UNITS[number];

// =====================================================
// RECURRING ITEM TYPES
// =====================================================

export type RecurrenceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';

export interface RecurringItem {
  id: string;
  user_id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  estimated_price: number;
  frequency: RecurrenceFrequency;
  day_of_week?: number; // 0-6 for weekly
  day_of_month?: number; // 1-31 for monthly
  active: boolean;
  created_at: string;
}

// =====================================================
// STATE MANAGEMENT TYPES
// =====================================================

export interface AppState {
  user: User | null;
  household: Household | null;
  currentList: GroceryList | null;
  notifications: Notification[];
  offlineQueue: OfflineQueueItem[];
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

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