-- Migration: Add social media follow tracking
-- Date: 2026-08-18
-- Purpose: Track social media follows for bonus points

-- Create social_follows table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.social_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'twitter', 'youtube')),
  followed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(referrer_id, platform)
);

-- Create index for social_follows
CREATE INDEX IF NOT EXISTS idx_social_follows_referrer_id ON public.social_follows(referrer_id);
CREATE INDEX IF NOT EXISTS idx_social_follows_platform ON public.social_follows(platform);
CREATE INDEX IF NOT EXISTS idx_social_follows_followed_at ON public.social_follows(followed_at);

-- Ensure reward_transactions table has the right constraints
-- This allows tracking multiple follow types per user
-- Already exists from previous migration

-- Run this to verify:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('social_follows', 'profiles', 'reward_transactions');
