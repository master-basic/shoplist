-- Migration: Create price_history table
-- This table is needed for price tracking functionality

CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(255) NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    session_id UUID NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
    bought_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for price history queries
CREATE INDEX IF NOT EXISTS idx_price_history_item ON price_history(item_name, store_name);
CREATE INDEX IF NOT EXISTS idx_price_history_bought_by ON price_history(bought_by);
CREATE INDEX IF NOT EXISTS idx_price_history_purchased_at ON price_history(purchased_at);
CREATE INDEX IF NOT EXISTS idx_price_history_session ON price_history(session_id);