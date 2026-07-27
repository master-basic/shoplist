-- Add username column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);