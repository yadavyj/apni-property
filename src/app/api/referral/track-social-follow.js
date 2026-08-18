import { createAdminClient } from "@/lib/supabase/server";
import { REWARD_VALUES } from "@/lib/constants";

export async function POST(request) {
  try {
    const { referralCode, platform } = await request.json();

    if (!referralCode || !platform) {
      return Response.json(
        { error: "Missing referralCode or platform" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Find the referrer by referral code
    const { data: referrerProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("referral_code", referralCode.trim().toUpperCase())
      .maybeSingle();

    if (!referrerProfile) {
      return Response.json(
        { error: "Referral code not found" },
        { status: 404 }
      );
    }

    // Track the social follow (upsert to avoid duplicates)
    const { error: trackError } = await admin
      .from("social_follows")
      .upsert(
        {
          referrer_id: referrerProfile.id,
          platform: platform.toLowerCase(),
          followed_at: new Date().toISOString(),
        },
        {
          onConflict: "referrer_id,platform",
        }
      );

    if (trackError) {
      console.error("Error tracking social follow:", trackError.message);
      return Response.json(
        { error: "Failed to track follow" },
        { status: 500 }
      );
    }

    // Add bonus points to referrer if this is their first follow of this platform
    const bonusPoints = REWARD_VALUES.socialFollow || 10;

    // Create reward transaction
    const { error: rewardError } = await admin
      .from("reward_transactions")
      .upsert(
        {
          user_id: referrerProfile.id,
          reward_type: `social_follow_${platform}`,
          points: bonusPoints,
          reference_id: `${referrerProfile.id}_${platform}`,
          details: { platform: platform, tracked_at: new Date().toISOString() },
        },
        {
          onConflict: "user_id,reward_type,reference_id",
        }
      );

    if (!rewardError) {
      // Update points_balance
      const { data: transactions } = await admin
        .from("reward_transactions")
        .select("points")
        .eq("user_id", referrerProfile.id);

      const total = (transactions || []).reduce(
        (sum, row) => sum + Number(row.points || 0),
        0
      );

      await admin
        .from("profiles")
        .update({ points_balance: total })
        .eq("id", referrerProfile.id);
    }

    return Response.json({ 
      success: true, 
      message: "Social follow tracked successfully",
      bonusPoints,
    });
  } catch (error) {
    console.error("Error in track-social-follow API:", error.message);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
