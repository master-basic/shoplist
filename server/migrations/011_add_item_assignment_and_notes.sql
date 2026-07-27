-- Migration: Add assigned_to, unit, notes, not_bought fields to list_items
ALTER TABLE list_items ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE list_items ADD COLUMN IF NOT EXISTS unit VARCHAR(50) DEFAULT 'pcs';
ALTER TABLE list_items ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE list_items ADD COLUMN IF NOT EXISTS not_bought_reason TEXT;
ALTER TABLE list_items ADD COLUMN IF NOT EXISTS not_bought_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_list_items_assigned_to ON list_items(assigned_to);
