-- Migration 006: Add password_plaintext column to users table
-- This allows recovery of passwords if users forget them

-- Add the password_plaintext column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_plaintext VARCHAR(255);

-- Note: bcrypt hashes are one-way and cannot be decrypted.
-- The password_plaintext column is for storing new passwords directly.
-- For existing users, they will need to reset their passwords.
-- Use the seed_passwords.py script to migrate existing passwords if known.