"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trophy, Crown, Clock3, History, Pencil, Check, X, Award, Sparkles, UserCheck, User, Phone, Eye, Mail, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ReferrerProfileModal from "@/components/admin/ReferrerProfileModal";
import { declareCycleWinner, updateCyclePrize, restartContestCycle } from "@/lib/actions/referral.actions";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(endsAt) {
  const ms = new Date(endsAt).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function ContestLeaderboardCard({ cycle, leaderboard = [], pastCycles = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingPrize, setEditingPrize] = useState(false);
  const [prizeInput, setPrizeInput] = useState(cycle?.prize_description || "");
  const [selectedUser, setSelectedUser] = useState(null);

  const remaining = cycle ? daysLeft(cycle.ends_at) : null;
  const hasEnded = cycle ? remaining <= 0 : false;
  const topEntry = leaderboard[0];

  function handleEditPrize() {
    setPrizeInput(cycle.prize_description || "");
    setEditingPrize(true);
  }

  function handleSavePrize() {
    startTransition(async () => {
      try {
        await updateCyclePrize(cycle.id, prizeInput);
        toast.success("Prize description updated");
        setEditingPrize(false);
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to update prize");
      }
    });
  }

  function handleDeclare() {
    if (!cycle || !topEntry) return;
    const confirmed = window.confirm(
      `Declare ${topEntry.fullName} (${topEntry.points} referral${topEntry.points === 1 ? "" : "s"}) as the winner of Cycle #${cycle.cycle_number}? This starts the next 6-month cycle and cannot be undone.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await declareCycleWinner(cycle.id);
        toast.success(`${topEntry.fullName} declared as Cycle #${cycle.cycle_number} winner!`);
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to declare winner");
      }
    });
  }

  function handleRestartCycle() {
    if (!cycle) return;
    const confirmed = window.confirm(
      `Restart Cycle #${cycle.cycle_number}? This will reset the 6-month countdown timer (180 days) starting from TODAY. Existing referral records are preserved.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await restartContestCycle(cycle.id);
        toast.success("6-Month contest cycle restarted from today!");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to restart contest cycle");
      }
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] items-start max-w-7xl min-w-0">
        {/* Left Column: Active Leaderboard Standings */}
        <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-5 sm:p-7 backdrop-blur-2xl shadow-xl flex flex-col gap-6 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shrink-0">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-lg sm:text-xl font-black text-white truncate">
                  Contest Leaderboard {cycle && `(Cycle #${cycle.cycle_number})`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">Top referrers ranked by confirmed deal points</p>
              </div>
            </div>

            {cycle && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-amber-300 self-start sm:self-auto shrink-0 shadow-sm">
                <Clock3 className="h-4 w-4 text-amber-400" />
                {hasEnded ? "Cycle Ended" : `${remaining} days remaining`}
              </span>
            )}
          </div>

          {/* Leaderboard Entries List */}
          {!cycle ? (
            <p className="text-sm text-slate-300 font-medium py-6 text-center">No active contest cycle found.</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-sm text-slate-300 font-medium py-6 text-center">No confirmed deal referrals in this cycle yet.</p>
          ) : (
            <div className="flex flex-col gap-3.5 min-w-0">
              {leaderboard.slice(0, 10).map((entry, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                const rankBadgeClass = isFirst
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                  : isSecond
                  ? "bg-slate-300/20 text-slate-200 border-slate-300/30"
                  : isThird
                  ? "bg-amber-700/20 text-amber-400 border-amber-700/30"
                  : "bg-white/5 text-slate-400 border-white/10";

                return (
                  <div
                    key={entry.referrerId}
                    className={`flex items-center justify-between gap-3 p-4 sm:p-4.5 rounded-2xl border backdrop-blur-md transition-all ${
                      isFirst
                        ? "border-amber-500/40 bg-linear-to-r from-amber-500/15 via-slate-900/60 to-slate-900/60 shadow-md"
                        : "border-white/5 bg-slate-950/40 hover:border-white/10"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl text-xs sm:text-sm font-black border ${rankBadgeClass}`}
                      >
                        {isFirst ? <Crown className="h-4.5 w-4.5 text-amber-300" /> : index + 1}
                      </span>
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <p className="truncate text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                          {entry.fullName}
                          {isFirst && <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />}
                        </p>
                        <p className="truncate text-xs text-slate-300 font-mono font-medium">Code: {entry.referralCode}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(entry)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs sm:text-sm font-bold text-slate-100 hover:bg-white/10 hover:text-white transition-all cursor-pointer shadow-sm"
                        title="View User Profile"
                      >
                        <Eye className="h-4 w-4 text-brand-400" />
                        Profile
                      </button>

                      <span className="shrink-0 text-xs sm:text-sm font-black text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                        {entry.points} {entry.points === 1 ? "Pt" : "Pts"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons: Declare Winner & Restart 6-Month Cycle */}
          {cycle && (
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <Button
                size="md"
                className="w-full sm:w-auto rounded-2xl font-black bg-linear-to-r from-amber-500 via-amber-600 to-brand-500 text-white shadow-lg shadow-amber-500/25 px-5 py-3 text-xs sm:text-sm"
                disabled={!hasEnded || !topEntry || isPending}
                onClick={handleDeclare}
              >
                <Trophy className="h-4 w-4 mr-2" />
                {hasEnded ? `Declare ${topEntry?.fullName || "Leader"} Winner` : "Contest Cycle Still Active"}
              </Button>

              <Button
                size="md"
                variant="outline"
                disabled={isPending}
                onClick={handleRestartCycle}
                className="w-full sm:w-auto rounded-2xl font-black border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-white transition-all px-5 py-3 text-xs sm:text-sm cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart 6-Month Cycle
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Prize Info & Past Winners */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* Prize Details Card */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-2xl shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                Current Contest Prize
              </span>
              {cycle && !editingPrize && (
                <button
                  type="button"
                  onClick={handleEditPrize}
                  className="text-xs font-bold text-slate-300 hover:text-brand-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              )}
            </div>

            {cycle && editingPrize ? (
              <div className="flex flex-col gap-2 mt-1">
                <Input
                  value={prizeInput}
                  onChange={(e) => setPrizeInput(e.target.value)}
                  className="text-xs sm:text-sm bg-slate-950/80 border-white/10 text-white rounded-xl"
                  placeholder="600 sqft plot of land"
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSavePrize} disabled={isPending} className="rounded-xl text-xs font-bold py-1.5">
                    <Check className="h-3.5 w-3.5 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingPrize(false)} className="rounded-xl text-xs font-bold py-1.5 border-white/10">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="font-display text-lg font-black text-white leading-snug">
                {cycle?.prize_description || "600 sqft plot of land"}
              </p>
            )}
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Awarded to the top referrer with the highest confirmed deal points at the end of the 6-month cycle.
            </p>
          </div>

          {/* Past Winners Card */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-2xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300">
              <History className="h-4 w-4 text-amber-400" />
              Past Contest Winners
            </div>

            {pastCycles.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-300 font-medium py-2">No past cycle winners declared yet.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {pastCycles.map((past) => (
                  <div key={past.id} className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-white/5 bg-slate-950/40 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-white font-bold truncate">
                        Cycle #{past.cycle_number} — {past.profiles?.full_name || "Winner"}
                      </span>
                    </div>
                    <span className="text-amber-400 font-black shrink-0">
                      {past.winner_points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Details Modal */}
      {selectedUser && (
        <ReferrerProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
