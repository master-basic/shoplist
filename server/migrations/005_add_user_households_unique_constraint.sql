-- Migration: Add unique constraint index on user_households
-- This ensures a user can only join a household once

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_households_unique 
ON user_households(user_id, household_id);