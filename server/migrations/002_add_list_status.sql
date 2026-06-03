-- Migration: Add status column to grocery_lists
-- This column tracks the lifecycle state of a grocery list

ALTER TABLE grocery_lists 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD CONSTRAINT chk_list_status 
CHECK (status IN ('active', 'completed', 'archived'));

CREATE INDEX IF NOT EXISTS idx_lists_status ON grocery_lists(status);