"use server";

import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { getSiteUrl } from "@/lib/getSiteUrl";
import { createAdminClient } from "@/lib/supabase/server";
import { REWARD_VALUES } from "@/lib/constants";

const CLAIM_COOKIE = "apni_guest_referral_claim";
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function isUsableToken(token) {
  return typeof token === "string" && /^[A-Za-z0-9_-]{40,}$/.test(token);
}

async function getActiveSessionByShareToken(token) {
  if (!isUsableToken(token)) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("guest_referral_sessions")
    .select("id, expires_at, status")
    .eq("share_token_hash", hashToken(token))
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  return data || null;
}

export async function createGuestReferralSession() {
  const shareToken = randomBytes(32).toString("base64url");
  const claimToken = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  const admin = createAdminClient();

  const { error } = await admin.from("guest_referral_sessions").insert({
    share_token_hash: hashToken(shareToken),
    claim_token_hash: hashToken(claimToken),
    expires_at: expiresAt,
    status: "active",
  });

  if (error) {
    throw new Error("Could not create a referral link. Please try again.");
  }

  const cookieStore = await cookies();
  cookieStore.set(CLAIM_COOKIE, claimToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  const siteUrl = await getSiteUrl();
  return {
    url: `${siteUrl}/share-referral?guest_token=${encodeURIComponent(shareToken)}`,
    expiresAt,
  };
}

export async function validateGuestReferralToken(token) {
  return Boolean(await getActiveSessionByShareToken(token));
}

export async function recordGuestReferralSignup({ token, referredUserId }) {
  if (!isUsableToken(token) || typeof referredUserId !== "string" || !referredUserId) {
    return { recorded: false };
  }

  const session = await getActiveSessionByShareToken(token);
  if (!session) return { recorded: false };

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("guest_referral_events")
    .select("id")
    .eq("session_id", session.id)
    .eq("referred_user_id", referredUserId)
    .eq("event_type", "signup")
    .maybeSingle();

  if (existing) return { recorded: true };

  const { error } = await admin.from("guest_referral_events").insert({
    session_id: session.id,
    referred_user_id: referredUserId,
    event_type: "signup",
    status: "pending",
  });

  if (error && error.code !== "23505") {
    throw new Error("Could not preserve referral attribution.");
  }

  return { recorded: true };
}

export async function claimGuestReferralSession(profileId) {
  if (typeof profileId !== "string" || !profileId) return { claimed: false };

  const cookieStore = await cookies();
  const claimToken = cookieStore.get(CLAIM_COOKIE)?.value;
  if (!isUsableToken(claimToken)) return { claimed: false };

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("claim_guest_referral_session", {
    p_claim_token_hash: hashToken(claimToken),
    p_profile_id: profileId,
    p_reward_points: REWARD_VALUES.referralSignup,
  });

  if (error) {
    throw new Error("Could not claim the temporary referral session.");
  }

  if (data?.claimed) {
    cookieStore.delete(CLAIM_COOKIE);
  }

  return data || { claimed: false };
}
