"use client";

import { useState } from "react";
import { Gift, Heart, Share2, Play, MessageCircle, Briefcase, Coins, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { BUSINESS, SOCIAL_REWARD_OPTIONS, REWARD_VALUES } from "@/lib/constants";
import { claimPropertyShareReward, claimSocialReward } from "@/lib/actions/rewards.actions";

const socialIcons = {
  instagram: Heart,
  facebook: Share2,
  youtube: Play,
  x: MessageCircle,
  linkedin: Briefcase,
};

export default function RewardsCard({ initialPoints = 0 }) {
  const [points, setPoints] = useState(initialPoints);
  const [claiming, setClaiming] = useState(false);

  async function handleSocialClaim(platform) {
    try {
      setClaiming(true);
      const result = await claimSocialReward({ platform });
      setPoints(result.totalPoints);
      if (result.alreadyClaimed) {
        toast.info("This reward has already been claimed once for this platform.");
      } else {
        toast.success(`Reward claimed: +${result.points} points`);
      }
    } catch (error) {
      toast.error(error.message || "Unable to claim the reward.");
    } finally {
      setClaiming(false);
    }
  }

  async function handleShareReward() {
    if (!navigator.share) {
      toast.error("Sharing not supported on this browser. Please use a mobile device or modern browser.");
      return;
    }

    try {
      // Open native share dialog
      await navigator.share({
        title: "Check out this property",
        text: "Found an amazing property on Apni Property! Take a look.",
        url: `${BUSINESS.siteUrl}/properties`,
      });

      // Only claim reward after successful share
      setClaiming(true);
      const result = await claimPropertyShareReward({ propertyId: "property-share" });
      setPoints(result.totalPoints);
      if (result.alreadyClaimed) {
        toast.info("This share reward has already been claimed for this property share action.");
      } else {
        toast.success(`Share reward claimed: +${result.points} points`);
      }
    } catch (error) {
      // Ignore AbortError (user cancelled share dialog)
      if (error.name === "AbortError") {
        return;
      }
      toast.error(error.message || "Unable to share or claim reward.");
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-slate-900/70 p-5 sm:p-7 shadow-xl backdrop-blur-2xl min-w-0">
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-brand-300">
            <Gift className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-300">Earn More Points</p>
            <h3 className="font-display text-xl font-bold text-white">Rewards</h3>
          </div>
        </div>
        <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-amber-300">Your Points</p>
          <p className="font-display text-lg font-black text-amber-300">{points}</p>
        </div>
      </div>

      <div className="relative mt-5 space-y-2.5">
        <button
          type="button"
          onClick={handleShareReward}
          disabled={claiming}
          className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-brand-500/30 hover:bg-brand-500/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex items-center gap-3"><Coins className="h-4 w-4 text-amber-400" /> Share a Property +{REWARD_VALUES.propertyShare}</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-brand-300">Reward</span>
        </button>

        {SOCIAL_REWARD_OPTIONS.filter((item) => item.url).map((item) => {
          const Icon = socialIcons[item.platform] || Sparkles;
          return (
            <a
              key={item.platform}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-brand-500/30 hover:bg-brand-500/5"
            >
              <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-brand-300" /> {item.label} +{item.points}</span>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  handleSocialClaim(item.platform);
                }}
                className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300"
                disabled={claiming}
              >
                {claiming ? "Claiming" : "I’ve followed"}
              </button>
            </a>
          );
        })}

        {SOCIAL_REWARD_OPTIONS.filter((item) => !item.url).length > 0 && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
            Social rewards are enabled when the project provides public links in the site configuration. Add them in <strong>{BUSINESS.name}</strong> environment settings to unlock these actions.
          </div>
        )}
      </div>
    </div>
  );
}
