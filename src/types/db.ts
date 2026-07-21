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

export interface Household {
  id: string;
  name: string;
  currency: string;
  description?: string;
  created_by: string;
  created_at: string;
  members: HouseholdMember[];
  lists: GroceryList[];
  settings: HouseholdSettings;
}

export interface HouseholdMember {
  user_id: string;
  name?: string;
  email?: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  invited_by?: string;
  is_owner?: boolean;
}

export interface HouseholdSettings {
  invite_code: string;
  invite_link: string;
  default_category: string;
  default_store: string;
  auto_sync: boolean;
}

export type ListStatus = 'active' | 'completed' | 'archived';

export interface GroceryList {
  id: string;
  household_id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: ListStatus;
  budget: number;
  total_spent: number;
  items: ListItem[];
  assignments: ItemAssignment[];
}

export interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  estimated_price: number;
  preferred_store?: string;
  notes?: string;
  assigned_to?: string[];
  not_bought_reason?: string;
  not_bought_at?: string;
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
  assigned_to: string[];
  checked_by?: string;
  checked_at?: string;
  notes?: string;
  not_bought_reason?: string;
  not_bought_at?: string;
  sort_order: number;
  is_recurring: boolean;
  restock_threshold?: number;
  last_bought_at?: string;
  price_history: PriceHistoryItem[];
  is_checked: boolean;
  actual_price?: number;
  actual_quantity?: number;
}

export interface ItemAssignment {
  item_id: string;
  assigned_to: string[];
  assigned_at: string;
  assigned_by: string;
}

export interface PurchaseSession {
  id: string;
  list_id: string;
  bought_by: string;
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
  list_item_id?: string;
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

export interface PriceHistoryItem {
  id: string;
  item_name: string;
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
  matched_item_id?: string;
}

export interface ReceiptFile {
  id: string;
  user_id: string;
  session_id: string;
  file_url: string;
  file_type: 'image' | 'pdf';
  uploaded_at: string;
}

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

export interface OnboardingState {
  has_completed: boolean;
  household_id?: string;
  demo_mode: boolean;
  tour_completed: boolean;
}

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
  day_of_week?: number;
  day_of_month?: number;
  active: boolean;
  created_at: string;
}
