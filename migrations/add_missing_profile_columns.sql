-- Migration: Add missing columns to profiles table
-- Date: 2026-08-18
-- Purpose: Ensure all required columns exist for profile initialization

-- Add points_balance if it doesn't exist
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS points_balance INTEGER NOT NULL DEFAULT 0;

-- Verify all required columns exist
-- The profiles table should now have:
-- - id (UUID, primary key)
-- - full_name (text, nullable)
-- - phone (text, nullable)
-- - referral_code (text, unique)
-- - created_at (timestamp)
-- - updated_at (timestamp, nullable)
-- - points_balance (integer, default 0) ← ADDED BY THIS MIGRATION
-- - referred_by (UUID, nullable) - optional for tracking referrer

-- Optional: Run this query to verify the schema:
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' 
-- ORDER BY ordinal_position;
