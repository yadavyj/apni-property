import { Trophy, Crown, Clock3, Users } from "lucide-react";

function maskName(fullName) {
  if (!fullName) return "Anonymous";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function daysLeft(endsAt) {
  const ms = new Date(endsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default function ReferralContestCard({ cycle, leaderboard = [], currentUserId }) {
  if (!cycle) return null;

  const myEntry = leaderboard.find((entry) => entry.referrerId === currentUserId);
  const myRank = myEntry ? leaderboard.indexOf(myEntry) + 1 : null;
  const remaining = daysLeft(cycle.ends_at);
  const topFive = leaderboard.slice(0, 5);
  const isUserInTopFive = myRank && myRank <= 5;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-900/60 p-5 sm:p-7 shadow-xl backdrop-blur-2xl transition-all min-w-0">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/15 blur-3xl"
      />

      {/* Card Header */}
      <div className="relative flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-md">
            <Trophy className="h-5.5 w-5.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              6-Month Referral Contest
            </p>
            <h3 className="font-display text-base sm:text-lg font-bold text-white truncate">
              Win {cycle.prize_description || "600 sqft plot of land"}
            </h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 backdrop-blur-md">
          <Clock3 className="h-3.5 w-3.5 text-amber-400" />
          {remaining} day{remaining === 1 ? "" : "s"} left
        </span>
      </div>

      <p className="relative mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
        Every friend you refer whose property deal is confirmed earns you 1 contest point. The top referrer at cycle end wins the grand prize!
      </p>

      {/* User Standing Summary Box */}
      <div className="relative mt-4 flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 min-w-0">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
            Your Contest Standing
          </span>
          <span className="font-display text-xl sm:text-2xl font-black text-white mt-0.5">
            {myEntry ? myEntry.points : 0} {myEntry?.points === 1 ? "Point" : "Points"}
          </span>
        </div>
        {myRank && (
          <span className="inline-flex items-center gap-1 rounded-xl bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300 shadow-sm">
            Rank #{myRank} of {leaderboard.length}
          </span>
        )}
      </div>

      {/* Leaderboard Section (Shows Top 5 Referrers) */}
      <div className="relative mt-5 pt-4 border-t border-white/10 flex flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> Top 5 Leaderboard
          </span>
          <span className="text-[10px] font-medium text-slate-400">Showing Top 5 Members</span>
        </div>

        {leaderboard.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No contest points recorded in this cycle yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-white/5">
            {topFive.map((entry, index) => {
              const isMe = entry.referrerId === currentUserId;
              return (
                <li
                  key={entry.referrerId}
                  className={`flex items-center justify-between gap-3 py-2.5 ${
                    isMe ? "text-white font-bold" : "text-slate-300"
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm font-medium min-w-0 truncate">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
                        index === 0
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : index === 1
                          ? "bg-slate-300/20 text-slate-200 border border-slate-300/30"
                          : index === 2
                          ? "bg-amber-700/20 text-amber-300 border border-amber-700/30"
                          : "bg-white/5 text-slate-400 border border-white/10"
                      }`}
                    >
                      {index === 0 ? <Crown className="h-3 w-3" /> : index + 1}
                    </span>
                    <span className="truncate">{isMe ? "You (Your Account)" : maskName(entry.fullName)}</span>
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-amber-400 shrink-0">{entry.points} pts</span>
                </li>
              );
            })}

            {/* If logged in user is outside Top 5, append user's rank row */}
            {myEntry && !isUserInTopFive && (
              <li className="flex items-center justify-between gap-3 py-2.5 border-t border-amber-500/30 bg-amber-500/10 px-2.5 rounded-xl mt-1">
                <span className="flex items-center gap-2 text-xs font-bold text-white min-w-0 truncate">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/30 text-[10px] font-extrabold text-amber-300">
                    {myRank}
                  </span>
                  <span className="truncate">You (Your Account)</span>
                </span>
                <span className="text-xs font-bold text-amber-300 shrink-0">{myEntry.points} pts</span>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
