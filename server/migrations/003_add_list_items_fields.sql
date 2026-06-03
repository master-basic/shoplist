-- Migration: Add missing fields to list_items table
-- These fields support item ordering, recurring items, and restock alerts

ALTER TABLE list_items 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS restock_threshold INTEGER,
ADD COLUMN IF NOT EXISTS last_bought_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_list_items_sort_order ON list_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_list_items_is_recurring ON list_items(is_recurring);