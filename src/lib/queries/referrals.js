import { unstable_cache } from "next/cache";
import { randomUUID } from "crypto";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { CACHE_TAGS, PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cacheTags";

/**
 * Generate a unique referral code
 * Format: AP + 6 random alphanumeric characters
 * Retries up to 10 times if collision detected
 */
async function generateUniqueReferralCode(admin, attempts = 0) {
  const candidate = `AP${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const { data } = await admin.from("profiles").select("id").eq("referral_code", candidate).maybeSingle();

  if (data) {
    if (attempts > 10) {
      return `AP${randomUUID().slice(0, 6).toUpperCase().replace(/-/g, "")}`;
    }
    return generateUniqueReferralCode(admin, attempts + 1);
  }

  return candidate;
}

export async function getOrCreateProfile(user) {
  const supabase = await createClient();

  // Try to fetch existing profile
  // Note: Only select columns that are guaranteed to exist in the schema
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, phone, referral_code, created_at")
    .eq("id", user.id)
    .maybeSingle();

  // If profile exists, return it with points_balance if available
  if (profile) {
    return {
      ...profile,
      points_balance: profile.points_balance ?? 0, // Fallback to 0 if column doesn't exist
    };
  }

  // Profile doesn't exist - create it with admin client (requires server-side execution)
  const admin = createAdminClient();

  try {
    // Generate unique referral code
    const referralCode = await generateUniqueReferralCode(admin);

    // Upsert profile (insert if new, update if duplicate key - handles race conditions)
    const { data: newProfile, error } = await admin
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          phone: user.user_metadata?.phone || null,
          referral_code: referralCode,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      )
      .select("id, full_name, phone, referral_code, created_at")
      .maybeSingle();

    if (error) {
      // Log error but don't crash - profile creation failed but auth still worked
      console.error("Failed to create profile for user:", user.id, error.message);
      return null;
    }

    // Return profile with default points_balance
    return {
      ...newProfile,
      points_balance: 0,
    };
  } catch (error) {
    // Handle unexpected errors gracefully
    console.error("Error in getOrCreateProfile:", error.message);
    return null;
  }
}

export async function getMyReferrals(userId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("referrals")
    .select(
      "id, referred_name, referred_phone, status, confirmed_at, created_at, properties(title, slug)"
    )
    .eq("referrer_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("getMyReferrals:", error.message);
    return [];
  }
  return data || [];
}

export async function getAllReferrals() {
  const supabase = createAdminClient();

  const [{ data, error }, authRes] = await Promise.all([
    supabase
      .from("referrals")
      .select(
        "id, referred_name, referred_phone, status, confirmed_at, created_at, properties(title), profiles!referrals_referrer_id_fkey(id, full_name, referral_code, phone)"
      )
      .order("created_at", { ascending: false }),
    supabase.auth.admin.listUsers({ perPage: 1000 }).catch(() => ({ data: { users: [] } })),
  ]);

  if (error) {
    console.warn("getAllReferrals:", error.message);
    return [];
  }

  const emailMap = new Map();
  if (authRes?.data?.users) {
    authRes.data.users.forEach((u) => {
      if (u.id && u.email) {
        emailMap.set(u.id, u.email);
      }
    });
  }

  return (data || []).map((row) => {
    if (row.profiles) {
      return {
        ...row,
        profiles: {
          ...row.profiles,
          email: emailMap.get(row.profiles.id) || null,
        },
      };
    }
    return row;
  });
}

async function fetchActiveCycle() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("referral_cycles")
    .select("id, cycle_number, starts_at, ends_at, prize_description, winner_profile_id, winner_points, declared_at")
    .is("winner_profile_id", null)
    .order("cycle_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("getActiveCycle:", error.message);
    return null;
  }
  return data;
}

const getCachedActiveCycle = unstable_cache(fetchActiveCycle, ["active-referral-cycle"], {
  revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.referralCycles],
});

export async function getActiveCycle() {
  return getCachedActiveCycle();
}

export async function getPastCycles() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("referral_cycles")
    .select(
      "id, cycle_number, starts_at, ends_at, prize_description, winner_points, declared_at, profiles!referral_cycles_winner_profile_id_fkey(full_name, referral_code)"
    )
    .not("winner_profile_id", "is", null)
    .order("cycle_number", { ascending: false });

  if (error) {
    console.warn("getPastCycles:", error.message);
    return [];
  }
  return data || [];
}

async function fetchCycleLeaderboard(_cycleId, startsAt, endsAt) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("referrals")
    .select("referrer_id, confirmed_at, profiles!referrals_referrer_id_fkey(full_name, referral_code)")
    .eq("status", "confirmed")
    .gte("confirmed_at", startsAt)
    .lt("confirmed_at", endsAt);

  if (error) {
    console.warn("getCycleLeaderboard:", error.message);
    return [];
  }

  const byReferrer = new Map();
  for (const row of data || []) {
    const existing = byReferrer.get(row.referrer_id);
    if (existing) {
      existing.points += 1;
      if (row.confirmed_at < existing.earliestConfirmedAt) {
        existing.earliestConfirmedAt = row.confirmed_at;
      }
    } else {
      byReferrer.set(row.referrer_id, {
        referrerId: row.referrer_id,
        fullName: row.profiles?.full_name || "User",
        referralCode: row.profiles?.referral_code || "",
        points: 1,
        earliestConfirmedAt: row.confirmed_at,
      });
    }
  }

  return [...byReferrer.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return new Date(a.earliestConfirmedAt) - new Date(b.earliestConfirmedAt);
  });
}

const getCachedCycleLeaderboard = unstable_cache(
  fetchCycleLeaderboard,
  ["referral-cycle-leaderboard"],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.referralCycles],
  }
);

export async function getCycleLeaderboard(cycle) {
  if (!cycle) return [];
  return getCachedCycleLeaderboard(cycle.id, cycle.starts_at, cycle.ends_at);
}

export function summarizeReferrals(referrals) {
  return referrals.reduce(
    (acc, r) => {
      acc.totalCount += 1;
      if (r.status === "confirmed") acc.confirmedCount += 1;
      else acc.pendingCount += 1;
      return acc;
    },
    { totalCount: 0, pendingCount: 0, confirmedCount: 0 }
  );
}

export async function getReferrerByCode(code) {
  if (!code) return null;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, referral_code, phone")
    .eq("referral_code", code.trim().toUpperCase())
    .maybeSingle();

  if (error) {
    console.warn("getReferrerByCode error:", error.message);
    return null;
  }
  return data;
}
