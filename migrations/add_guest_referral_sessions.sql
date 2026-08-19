-- Migration: Add temporary guest referral sessions
-- Purpose: Let guests share a referral invitation before creating an account.

CREATE TABLE IF NOT EXISTS public.guest_referral_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.guest_referral_sessions(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  referred_name TEXT,
  referred_phone TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('signup')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'converted')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_guest_referral_events_signup_once
  ON public.guest_referral_events(session_id, referred_user_id, event_type)
  WHERE referred_user_id IS NOT NULL;

ALTER TABLE public.guest_referral_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_referral_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.guest_referral_sessions FROM anon, authenticated;
REVOKE ALL ON public.guest_referral_events FROM anon, authenticated;
GRANT ALL ON public.guest_referral_sessions TO service_role;
GRANT ALL ON public.guest_referral_events TO service_role;

CREATE OR REPLACE FUNCTION public.claim_guest_referral_session(
  p_claim_token_hash TEXT,
  p_profile_id UUID
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
        lead_id,
        property_id,
        referred_name,
        referred_phone,
        status,
        created_at
      ) VALUES (
        p_profile_id,
        NULL,
        NULL,
        event_row.referred_name,
        event_row.referred_phone,
        'pending',
        NOW()
      );

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

REVOKE ALL ON FUNCTION public.claim_guest_referral_session(TEXT, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_guest_referral_session(TEXT, UUID)
  TO service_role;
