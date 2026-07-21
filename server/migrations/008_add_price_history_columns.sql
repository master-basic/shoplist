-- Add columns expected by priceHistory.js and purchases.js routes
ALTER TABLE price_history
  ADD COLUMN IF NOT EXISTS list_item_id UUID REFERENCES list_items(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'AZN',
  ADD COLUMN IF NOT EXISTS store VARCHAR(255),
  ADD COLUMN IF NOT EXISTS purchase_date DATE,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_price_history_list_item ON price_history(list_item_id);
CREATE INDEX IF NOT EXISTS idx_price_history_store ON price_history(store);
CREATE INDEX IF NOT EXISTS idx_price_history_created_by ON price_history(created_by);
CREATE INDEX IF NOT EXISTS idx_price_history_purchase_date ON price_history(purchase_date);
