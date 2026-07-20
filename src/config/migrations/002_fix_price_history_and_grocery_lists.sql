-- Migration 002: Fix price_history table and align schemas
-- Adds columns needed by the server API and creates grocery_lists alias

-- Create grocery_lists as an alias for lists (server uses grocery_lists)
CREATE TABLE IF NOT EXISTS grocery_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived'))
);

-- Add sort_order and other columns to list_items if not exists
ALTER TABLE list_items ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE list_items ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;
ALTER TABLE list_items ADD COLUMN IF NOT EXISTS restock_threshold INTEGER;
ALTER TABLE list_items ADD COLUMN IF NOT EXISTS last_bought_at TIMESTAMP;

-- Drop and recreate price_history with correct columns
DROP TABLE IF EXISTS price_history CASCADE;
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_item_id UUID REFERENCES list_items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    store_name VARCHAR(255),
    unit_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AZN',
    quantity DECIMAL(10,2) DEFAULT 1,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for price_history
CREATE INDEX IF NOT EXISTS idx_price_history_item ON price_history(item_name, store_name);
CREATE INDEX IF NOT EXISTS idx_price_history_purchased ON price_history(purchased_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_history_item_name ON price_history(item_name);
CREATE INDEX IF NOT EXISTS idx_grocery_lists_household ON grocery_lists(household_id);
CREATE INDEX IF NOT EXISTS idx_grocery_lists_created_by ON grocery_lists(created_by);
CREATE INDEX IF NOT EXISTS idx_grocery_lists_status ON grocery_lists(status);
CREATE INDEX IF NOT EXISTS idx_list_items_sort ON list_items(sort_order);
