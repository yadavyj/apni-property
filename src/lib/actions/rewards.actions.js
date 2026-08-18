"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { REWARD_VALUES, SOCIAL_REWARD_OPTIONS } from "@/lib/constants";

function normalizeReferenceId(value) {
  return String(value || "").trim();
}

async function refreshPointsBalance(userId) {
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("reward_transactions")
    .select("points")
    .eq("user_id", userId);

  const total = (rows || []).reduce((sum, row) => sum + Number(row.points || 0), 0);
  await admin.from("profiles").update({ points_balance: total }).eq("id", userId);

  revalidatePath("/dashboard");
  revalidatePath("/refer-earn");

  return total;
}

export async function claimSocialReward({ platform }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please sign in to claim this reward.");
  }

  const option = SOCIAL_REWARD_OPTIONS.find((item) => item.platform === platform);
  if (!option) {
    throw new Error("Invalid social reward platform.");
  }

  const admin = createAdminClient();
  const ref = normalizeReferenceId(`${platform}`);

  const { data: existing } = await admin
    .from("reward_transactions")
    .select("id, reward_type, points")
    .eq("user_id", user.id)
    .eq("reward_type", "social_follow")
    .eq("reference_id", ref)
    .maybeSingle();

  if (existing) {
    return { alreadyClaimed: true, points: 0, totalPoints: await refreshPointsBalance(user.id) };
  }

  const payload = {
    user_id: user.id,
    reward_type: "social_follow",
    points: option.points,
    reference_id: ref,
    details: { platform },
  };

  const { error } = await admin.from("reward_transactions").insert(payload);

  if (error) {
    if (String(error.code || "") === "23505") {
      return { alreadyClaimed: true, points: 0, totalPoints: await refreshPointsBalance(user.id) };
    }
    throw new Error(error.message || "Could not claim this reward.");
  }

  const total = await refreshPointsBalance(user.id);
  return { alreadyClaimed: false, points: option.points, totalPoints: total };
}

export async function claimPropertyShareReward({ propertyId }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please sign in to claim this reward.");
  }

  const admin = createAdminClient();
  const ref = normalizeReferenceId(`property:${propertyId}`);

  const { data: existing } = await admin
    .from("reward_transactions")
    .select("id")
    .eq("user_id", user.id)
    .eq("reward_type", "property_share")
    .eq("reference_id", ref)
    .maybeSingle();

  if (existing) {
    return { alreadyClaimed: true, points: 0, totalPoints: await refreshPointsBalance(user.id) };
  }

  const { error } = await admin.from("reward_transactions").insert({
    user_id: user.id,
    reward_type: "property_share",
    points: REWARD_VALUES.propertyShare,
    reference_id: ref,
    details: { propertyId },
  });

  if (error) {
    if (String(error.code || "") === "23505") {
      return { alreadyClaimed: true, points: 0, totalPoints: await refreshPointsBalance(user.id) };
    }
    throw new Error(error.message || "Could not claim this reward.");
  }

  const total = await refreshPointsBalance(user.id);
  return { alreadyClaimed: false, points: REWARD_VALUES.propertyShare, totalPoints: total };
}

export async function getCurrentPointsBalance() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("points_balance")
    .eq("id", user.id)
    .single();

  return Number(profile?.points_balance || 0);
}
