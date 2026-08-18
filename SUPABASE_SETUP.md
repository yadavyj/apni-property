# Supabase Setup Guide for ApniProperty

This guide helps you set up the required database tables and columns in Supabase for the referral, rewards, and authentication systems to work correctly.

## Quick Setup

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Copy and paste the SQL script below
4. Run it to create all necessary tables and columns

## Required Tables and Schema

### 1. Ensure `profiles` table exists with all required columns

The `profiles` table should have these columns:
- `id` (UUID, primary key) - links to auth.users
- `full_name` (text, nullable)
- `phone` (text, nullable)
- `referral_code` (text, unique)
- `referred_by` (UUID, nullable) - references another profile's id
- `points_balance` (integer, default 0)
- `created_at` (timestamp)
- `updated_at` (timestamp, nullable)

### 2. Ensure `referrals` table exists

The `referrals` table tracks referral relationships and rewards:
- `id` (UUID, primary key)
- `referrer_id` (UUID, foreign key -> profiles.id)
- `referred_user_id` (UUID, unique per referrer, foreign key -> profiles.id)
- `referral_code` (text) - the code used
- `referred_name` (text)
- `referred_phone` (text, nullable)
- `status` (text) - "pending" or "confirmed"
- `confirmed_at` (timestamp, nullable)
- `created_at` (timestamp)
- `reward_points` (integer, default 0)
- `rewarded_at` (timestamp, nullable)

### 3. Ensure `referral_cycles` table exists

The `referral_cycles` table manages contest cycles:
- `id` (UUID, primary key)
- `cycle_number` (integer, unique)
- `starts_at` (timestamp)
- `ends_at` (timestamp)
- `prize_description` (text)
- `winner_profile_id` (UUID, nullable, foreign key -> profiles.id)
- `winner_points` (integer, nullable)
- `declared_at` (timestamp, nullable)
- `created_at` (timestamp)

### 4. Ensure `reward_transactions` table exists

The `reward_transactions` table logs all reward allocations:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key -> profiles.id)
- `reward_type` (text) - "referral_signup", "social_follow", "property_share"
- `points` (integer)
- `reference_id` (text) - unique identifier for the reward event
- `details` (jsonb, nullable) - additional metadata
- `created_at` (timestamp)
- Unique constraint: (user_id, reward_type, reference_id)

## SQL Setup Script

Run this in Supabase's SQL Editor to ensure all tables exist with proper schema:

```sql
-- 1. Ensure profiles table has all required columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS points_balance INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);

-- Add foreign key constraint if it doesn't exist
ALTER TABLE public.profiles
  ADD CONSTRAINT IF NOT EXISTS profiles_referred_by_fkey
  FOREIGN KEY (referred_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Create unique index on referral_code
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

-- 2. Create referrals table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  referred_name TEXT,
  referred_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  reward_points INTEGER DEFAULT 0,
  rewarded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(referrer_id, referred_user_id, referral_code)
);

-- Create indexes for referrals table
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_confirmed_at ON public.referrals(confirmed_at);

-- 3. Create referral_cycles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.referral_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_number INTEGER UNIQUE NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  prize_description TEXT,
  winner_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  winner_points INTEGER,
  declared_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for referral_cycles
CREATE INDEX IF NOT EXISTS idx_referral_cycles_winner_profile_id ON public.referral_cycles(winner_profile_id);
CREATE INDEX IF NOT EXISTS idx_referral_cycles_cycle_number ON public.referral_cycles(cycle_number);

-- 4. Create reward_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.reward_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('referral_signup', 'social_follow', 'property_share')),
  points INTEGER NOT NULL,
  reference_id TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, reward_type, reference_id)
);

-- Create indexes for reward_transactions table
CREATE INDEX IF NOT EXISTS idx_reward_transactions_user_id ON public.reward_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_transactions_reward_type ON public.reward_transactions(reward_type);
CREATE INDEX IF NOT EXISTS idx_reward_transactions_created_at ON public.reward_transactions(created_at);
```

## How to Run

1. **In Supabase Console:**
   - Go to your project
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"
   - Paste the SQL script above
   - Click "Run" to execute

2. **Or use Supabase CLI:**
   ```bash
   supabase db push
   ```

## Verification

After running the script, verify the tables exist:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'referrals', 'referral_cycles', 'reward_transactions');
```

You should see 4 tables returned.

## Environment Variables

Ensure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## RLS (Row Level Security) Policies

For production, you should set up Row Level Security policies. Here are recommended policies:

```sql
-- profiles table - users can only read their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Authenticated users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- referrals table - users can only see referrals they made
CREATE POLICY "Users can view their own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

-- reward_transactions table - users can only see their own rewards
CREATE POLICY "Users can view their own reward transactions"
  ON public.reward_transactions FOR SELECT
  USING (auth.uid() = user_id);
```

## Troubleshooting

### Error: "Could not find the table 'public.reward_transactions'"
- Run the SQL setup script above to create the missing tables

### Error: "Column points_balance does not exist"
- The first part of the SQL script adds this column to profiles if missing

### Referral codes not generating
- Ensure `profiles.referral_code` column exists and has a UNIQUE constraint
- Check that the auth.actions.js properly generates unique codes

## Support

If you encounter any issues:
1. Check Supabase project logs
2. Verify all environment variables are set correctly
3. Run the SQL verification query to ensure tables exist
4. Check that auth.users table exists (created by Supabase automatically)
