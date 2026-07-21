-- Migration: Create price_checks table for store price tracking
-- Stores historical prices from Araz, Bravo and other stores
-- Keeps 3 years of data for trend analysis

CREATE TABLE IF NOT EXISTS price_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(255) NOT NULL,
    store VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AZN',
    category VARCHAR(100),
    unit VARCHAR(50),
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50) DEFAULT 'scraper'
);

CREATE INDEX IF NOT EXISTS idx_price_checks_product_store ON price_checks(product_name, store);
CREATE INDEX IF NOT EXISTS idx_price_checks_checked_at ON price_checks(checked_at);
CREATE INDEX IF NOT EXISTS idx_price_checks_category ON price_checks(category);

-- Create a materialized view for latest prices per product per store
CREATE MATERIALIZED VIEW IF NOT EXISTS latest_prices AS
SELECT DISTINCT ON (product_name, store)
    id,
    product_name,
    store,
    price,
    currency,
    category,
    unit,
    checked_at,
    source
FROM price_checks
ORDER BY product_name, store, checked_at DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_latest_prices_product_store ON latest_prices(product_name, store);
