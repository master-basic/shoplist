-- =====================================================
-- GroceryMind - Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    preferred_currency VARCHAR(10) DEFAULT 'AZN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create households table
CREATE TABLE IF NOT EXISTS households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_households junction table
CREATE TABLE IF NOT EXISTS user_households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    is_owner BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, household_id)
);

-- Create grocery_lists table
CREATE TABLE IF NOT EXISTS grocery_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived'))
);

-- Create list_items table
CREATE TABLE IF NOT EXISTS list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES grocery_lists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(10,2) DEFAULT 0,
    category VARCHAR(100) DEFAULT 'Other',
    is_checked BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    is_recurring BOOLEAN DEFAULT FALSE,
    restock_threshold INTEGER,
    last_bought_at TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create receipts table
CREATE TABLE IF NOT EXISTS receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    list_id UUID REFERENCES grocery_lists(id) ON DELETE CASCADE,
    name VARCHAR(255),
    total_amount DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'AZN',
    image_url VARCHAR(500),
    ocr_data JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create receipt_items table
CREATE TABLE IF NOT EXISTS receipt_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_id UUID NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
    list_item_id UUID REFERENCES list_items(id) ON DELETE SET NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_households_created_by ON households(created_by);
CREATE INDEX IF NOT EXISTS idx_user_households_user ON user_households(user_id);
CREATE INDEX IF NOT EXISTS idx_user_households_household ON user_households(household_id);
CREATE INDEX IF NOT EXISTS idx_user_households_unique ON user_households(user_id, household_id);
CREATE INDEX IF NOT EXISTS idx_grocery_lists_household ON grocery_lists(household_id);
CREATE INDEX IF NOT EXISTS idx_grocery_lists_created_by ON grocery_lists(created_by);
CREATE INDEX IF NOT EXISTS idx_grocery_lists_status ON grocery_lists(status);
CREATE INDEX IF NOT EXISTS idx_list_items_list ON list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_list_items_sort_order ON list_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_list_items_name ON list_items(name);
CREATE INDEX IF NOT EXISTS idx_receipts_user ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_household ON receipts(household_id);
CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt ON receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_items_list_item ON receipt_items(list_item_id);
CREATE INDEX IF NOT EXISTS idx_price_history_item ON price_history(item_name, store_name);
