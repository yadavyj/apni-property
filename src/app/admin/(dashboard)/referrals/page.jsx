import { Trophy, ListChecks, Gift, Sparkles, Award } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import ReferralsTable from "@/components/admin/ReferralsTable";
import ContestLeaderboardCard from "@/components/admin/ContestLeaderboardCard";
import { getAllReferrals, getActiveCycle, getCycleLeaderboard, getPastCycles } from "@/lib/queries/referrals";

export const metadata = {
  title: "Refer & Earn Program",
};

export default async function AdminReferralsPage() {
  const [referrals, activeCycle, pastCycles] = await Promise.all([
    getAllReferrals(),
    getActiveCycle(),
    getPastCycles(),
  ]);
  const leaderboard = await getCycleLeaderboard(activeCycle);

  const confirmedCount = referrals.filter((r) => r.status === "confirmed").length;
  const pendingCount = referrals.filter((r) => r.status === "pending").length;

  const tabs = [
    {
      key: "contest",
      label: "Contest & Leaderboard",
      icon: <Trophy className="h-4 w-4 text-amber-400" />,
      description: "Track active cycle leaderboard standings, points, and declare contest prize winners.",
      content: (
        <ContestLeaderboardCard cycle={activeCycle} leaderboard={leaderboard} pastCycles={pastCycles} />
      ),
    },
    {
      key: "referrals",
      label: "All Referrals",
      icon: <ListChecks className="h-4 w-4 text-brand-400" />,
      count: referrals.length,
      description:
        "Confirm referrals once deal closures are verified — this awards the referrer contest points.",
      content: <ReferralsTable referrals={referrals} />,
    },
  ];

  return (
    <div className="relative flex flex-col gap-8 pb-10">
      {/* Background Ambient Glow Blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-amber-500/10 opacity-60 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-1/3 h-[450px] w-[450px] rounded-full bg-brand-500/10 opacity-50 blur-[120px]" />

      {/* Header Workspace Banner */}
      <div className="relative overflow-hidden flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/15 bg-linear-to-r from-slate-900/90 via-slate-950/80 to-slate-900/90 p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
              <Gift className="h-3.5 w-3.5 text-amber-400" />
              Referral Program Management
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Refer &amp; Earn Program
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
            <span className="inline-flex items-center gap-1 text-slate-300">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              {referrals.length} Total Referrals Tracked
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              {confirmedCount} Confirmed Rewards
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
              {pendingCount} Pending Verification
            </span>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
