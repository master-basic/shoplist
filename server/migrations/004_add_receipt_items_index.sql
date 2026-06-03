-- Migration: Add index on receipt_items.list_item_id
-- This index improves join performance when querying receipt items by list_item_id

CREATE INDEX IF NOT EXISTS idx_receipt_items_list_item 
ON receipt_items(list_item_id);