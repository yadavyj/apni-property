-- Migration: Add temporary guest referral sessions
-- Purpose: Let guests share a referral invitation before creating an account.

CREATE TABLE IF NOT EXISTS public.guest_referral_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_token_hash TEXT NOT NULL UNIQUE,
  claim_token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  claimed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  claimed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'expired'))
);

CREATE INDEX IF NOT EXISTS idx_guest_referral_sessions_expires_at
  ON public.guest_referral_sessions(expires_at);

CREATE TABLE IF NOT EXISTS public.guest_referral_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.guest_referral_sessions(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('signup')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'converted')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_guest_referral_events_signup_once
  ON public.guest_referral_events(session_id, referred_user_id, event_type)
  WHERE referred_user_id IS NOT NULL;

-- Guest referral rows have no referral_code until a real profile claims the session.
ALTER TABLE public.referrals
  ALTER COLUMN referral_code DROP NOT NULL;

ALTER TABLE public.referrals
  ADD COLUMN IF NOT EXISTS guest_session_id UUID
  REFERENCES public.guest_referral_sessions(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_guest_session_user
  ON public.referrals(guest_session_id, referred_user_id)
  WHERE guest_session_id IS NOT NULL;

ALTER TABLE public.guest_referral_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_referral_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.guest_referral_sessions FROM anon, authenticated;
REVOKE ALL ON public.guest_referral_events FROM anon, authenticated;
GRANT ALL ON public.guest_referral_sessions TO service_role;
GRANT ALL ON public.guest_referral_events TO service_role;

CREATE OR REPLACE FUNCTION public.claim_guest_referral_session(
  p_claim_token_hash TEXT,
  p_profile_id UUID,
  p_reward_points INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_row public.guest_referral_sessions%ROWTYPE;
  event_row public.guest_referral_events%ROWTYPE;
  converted_count INTEGER := 0;
BEGIN
  IF p_claim_token_hash IS NULL OR p_profile_id IS NULL THEN
    RETURN jsonb_build_object('claimed', false, 'reason', 'invalid_input');
  END IF;

  SELECT *
    INTO session_row
    FROM public.guest_referral_sessions
   WHERE claim_token_hash = p_claim_token_hash
     AND status = 'active'
     AND expires_at > NOW()
   FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('claimed', false, 'reason', 'not_claimable');
  END IF;

  UPDATE public.guest_referral_sessions
     SET status = 'claimed', claimed_by = p_profile_id, claimed_at = NOW()
   WHERE id = session_row.id;

  FOR event_row IN
    SELECT *
      FROM public.guest_referral_events
     WHERE session_id = session_row.id
       AND status = 'pending'
     FOR UPDATE
  LOOP
    IF event_row.referred_user_id IS NOT NULL
       AND event_row.referred_user_id <> p_profile_id THEN
      INSERT INTO public.referrals (
        referrer_id,
        referred_user_id,
        referral_code,
        guest_session_id,
        referred_name,
        status,
        reward_points,
        rewarded_at,
        created_at
      )
      SELECT
        p_profile_id,
        event_row.referred_user_id,
        NULL,
        session_row.id,
        profile.full_name,
        'confirmed',
        GREATEST(COALESCE(p_reward_points, 0), 0),
        CASE WHEN COALESCE(p_reward_points, 0) > 0 THEN NOW() ELSE NULL END,
        NOW()
        FROM public.profiles AS profile
       WHERE profile.id = event_row.referred_user_id
      ON CONFLICT DO NOTHING;

      IF FOUND AND COALESCE(p_reward_points, 0) > 0 THEN
        INSERT INTO public.reward_transactions (
          user_id,
          reward_type,
          points,
          reference_id,
          details,
          created_at
        ) VALUES (
          p_profile_id,
          'referral_signup',
          p_reward_points,
          event_row.id::TEXT,
          jsonb_build_object('guestSessionId', session_row.id, 'referredUserId', event_row.referred_user_id),
          NOW()
        )
        ON CONFLICT (user_id, reward_type, reference_id) DO NOTHING;

        UPDATE public.profiles
           SET points_balance = (
             SELECT COALESCE(SUM(points), 0)
               FROM public.reward_transactions
              WHERE user_id = p_profile_id
           )
         WHERE id = p_profile_id;
      END IF;

      converted_count := converted_count + 1;
    END IF;

    UPDATE public.guest_referral_events
       SET status = 'converted', converted_at = NOW()
     WHERE id = event_row.id;
  END LOOP;

  RETURN jsonb_build_object(
    'claimed', true,
    'sessionId', session_row.id,
    'convertedCount', converted_count
  );
END;
$$;

REVOKE ALL ON FUNCTION public.claim_guest_referral_session(TEXT, UUID, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_guest_referral_session(TEXT, UUID, INTEGER)
  TO service_role;
