-- Fix users table to include username column
-- Drop and recreate users table with username + email
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_plaintext VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    preferred_currency VARCHAR(10) DEFAULT 'AZN',
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);

-- Create demo admin user
INSERT INTO users (username, password_hash, password_plaintext, email, name, is_admin)
VALUES ('admin', 'admin123', 'admin123', 'admin@example.com', 'Admin User', true)
ON CONFLICT (username) DO NOTHING;