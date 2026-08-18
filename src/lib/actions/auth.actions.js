"use server";

import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { REWARD_VALUES } from "@/lib/constants";

function normalizeCode(code) {
  return typeof code === "string" ? code.trim().toUpperCase() : "";
}

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

export async function adminCreateUser({ email, password, fullName, phone, referralCode }) {
  try {
    const supabaseAdmin = createAdminClient();
    const normalizedRef = normalizeCode(referralCode);

    const { data: userData, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone: phone,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const user = userData?.user;
    if (!user) {
      return { success: false, error: "User was not created." };
    }

    const referral = await generateUniqueReferralCode(supabaseAdmin);

    const { data: referrerProfile } = normalizedRef
      ? await supabaseAdmin
          .from("profiles")
          .select("id, referral_code")
          .eq("referral_code", normalizedRef)
          .maybeSingle()
      : { data: null };

    const profilePayload = {
      id: user.id,
      full_name: fullName,
      phone: phone,
      referral_code: referral,
      referred_by: referrerProfile && referrerProfile.id !== user.id ? referrerProfile.id : null,
      points_balance: 0,
      created_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(profilePayload, {
      onConflict: "id",
    });

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    if (referrerProfile && referrerProfile.id !== user.id) {
      const { error: referralError } = await supabaseAdmin.from("referrals").upsert(
        {
          referrer_id: referrerProfile.id,
          referred_user_id: user.id,
          referral_code: normalizedRef,
          referred_name: fullName,
          referred_phone: phone,
          status: "confirmed",
          reward_points: REWARD_VALUES.referralSignup,
          rewarded_at: new Date().toISOString(),
        },
        { onConflict: "referrer_id,referred_user_id,referral_code" }
      );

      if (!referralError) {
        const { error: rewardError } = await supabaseAdmin.from("reward_transactions").upsert(
          {
            user_id: referrerProfile.id,
            reward_type: "referral_signup",
            points: REWARD_VALUES.referralSignup,
            reference_id: user.id,
            details: { referredUserId: user.id, referralCode: normalizedRef },
          },
          { onConflict: "user_id,reward_type,reference_id" }
        );

        if (!rewardError) {
          const { data: pointsData } = await supabaseAdmin
            .from("reward_transactions")
            .select("points")
            .eq("user_id", referrerProfile.id);

          const total = (pointsData || []).reduce((sum, row) => sum + Number(row.points || 0), 0);
          await supabaseAdmin.from("profiles").update({ points_balance: total }).eq("id", referrerProfile.id);
        }
      }
    }

    return { success: true, user };
  } catch (err) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
