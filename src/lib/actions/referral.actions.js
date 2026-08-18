"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { getCycleLeaderboard } from "@/lib/queries/referrals";
import { CACHE_TAGS } from "@/lib/cacheTags";

const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

export async function confirmReferral(id) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("referrals")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending");

  if (error) throw new Error(error.message);

  updateTag(CACHE_TAGS.referralCycles);
  revalidatePath("/admin/referrals");
  revalidatePath("/dashboard");
  revalidatePath("/refer-earn");
}

export async function updateCyclePrize(cycleId, prizeDescription) {
  await requireAdmin();
  const supabase = createAdminClient();

  const trimmed = prizeDescription?.trim();
  if (!trimmed) throw new Error("Prize description cannot be empty.");

  const { error } = await supabase
    .from("referral_cycles")
    .update({ prize_description: trimmed })
    .eq("id", cycleId);

  if (error) throw new Error(error.message);

  updateTag(CACHE_TAGS.referralCycles);
  revalidatePath("/admin/referrals");
  revalidatePath("/dashboard");
  revalidatePath("/refer-earn");
}

export async function declareCycleWinner(cycleId) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: cycle, error: cycleError } = await admin
    .from("referral_cycles")
    .select("id, cycle_number, starts_at, ends_at, winner_profile_id, prize_description")
    .eq("id", cycleId)
    .single();

  if (cycleError) throw new Error(cycleError.message);
  if (cycle.winner_profile_id) throw new Error("This cycle already has a declared winner.");
  if (new Date(cycle.ends_at) > new Date()) {
    throw new Error("This cycle hasn't ended yet.");
  }

  const leaderboard = await getCycleLeaderboard(cycle);
  const winner = leaderboard[0];
  if (!winner) throw new Error("No confirmed referrals in this cycle yet.");

  const now = new Date();

  const { error: updateError } = await admin
    .from("referral_cycles")
    .update({
      winner_profile_id: winner.referrerId,
      winner_points: winner.points,
      declared_at: now.toISOString(),
    })
    .eq("id", cycleId)
    .is("winner_profile_id", null);

  if (updateError) throw new Error(updateError.message);

  const nextEndsAt = new Date(new Date(cycle.ends_at).getTime() + SIX_MONTHS_MS);

  const { error: insertError } = await admin.from("referral_cycles").insert({
    cycle_number: cycle.cycle_number + 1,
    starts_at: cycle.ends_at,
    ends_at: nextEndsAt.toISOString(),
    prize_description: cycle.prize_description,
  });

  if (insertError) throw new Error(insertError.message);

  updateTag(CACHE_TAGS.referralCycles);
  revalidatePath("/admin/referrals");
  revalidatePath("/dashboard");
  revalidatePath("/refer-earn");
}

export async function restartContestCycle(cycleId) {
  await requireAdmin();
  const admin = createAdminClient();

  const now = new Date();
  const nextEndsAt = new Date(now.getTime() + SIX_MONTHS_MS);

  const { error } = await admin
    .from("referral_cycles")
    .update({
      starts_at: now.toISOString(),
      ends_at: nextEndsAt.toISOString(),
    })
    .eq("id", cycleId);

  if (error) throw new Error(error.message);

  updateTag(CACHE_TAGS.referralCycles);
  revalidatePath("/admin/referrals");
  revalidatePath("/dashboard");
  revalidatePath("/refer-earn");
}


export async function lookupReferrerCode(code) {
  if (!code || typeof code !== "string") return null;
  const trimmed = code.trim().toUpperCase();
  if (trimmed.length < 3) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, full_name, referral_code")
    .eq("referral_code", trimmed)
    .maybeSingle();

  if (!data) return null;

  let isSelf = false;
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.id && authData.user.id === data.id) {
      isSelf = true;
    }
  } catch {
    // Guest user
  }

  return { fullName: data.full_name, code: data.referral_code, isSelf };
}
