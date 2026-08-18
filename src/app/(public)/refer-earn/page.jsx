import {
  Sparkles,
  Link2,
  Share2,
  BadgeCheck,
  Trophy,
  Crown,
  Clock3,
  MessageCircle,
} from "lucide-react";
import Container from "@/components/layout/Container";
import ReferEarnPageCta from "@/components/common/ReferEarnPageCta";
import Reveal from "@/components/common/Reveal";
import { getActiveCycle, getCycleLeaderboard } from "@/lib/queries/referrals";
import { buildGenericWhatsAppLink } from "@/lib/whatsapp";
import { BUSINESS } from "@/lib/constants";

export const metadata = {
  title: "Refer & Earn",
  description:
    "Share your referral link with friends and family. Every confirmed referral earns you a contest point — the top referrer every 6 months wins a 600 sqft plot of land.",
};

const STEPS = [
  {
    icon: Link2,
    title: "Get Your Link",
    description: "Sign up for a free account and get your personal referral link instantly.",
  },
  {
    icon: Share2,
    title: "Share It",
    description: "Send it to friends and family looking for plots, homes or commercial space.",
  },
  {
    icon: BadgeCheck,
    title: "Deal Confirmed",
    description: "When they enquire and complete a deal with us, you earn a contest point.",
  },
  {
    icon: Trophy,
    title: "Win the Prize",
    description: "The top scorer every 6 months wins the cycle's land prize.",
  },
];

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

export default async function ReferEarnPage() {
  const activeCycle = await getActiveCycle();
  const leaderboard = await getCycleLeaderboard(activeCycle);
  const prize = activeCycle?.prize_description || "600 sqft plot of land";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div
          aria-hidden
          className="animate-breathe pointer-events-none absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-brand-500/10 opacity-60 blur-[100px]"
        />
        <div
          aria-hidden
          className="animate-breathe-slow pointer-events-none absolute -right-20 top-20 h-[400px] w-[400px] rounded-full bg-amber-500/10 opacity-50 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[32px_32px] opacity-60"
        />

        <Container className="relative z-10 flex flex-col items-center text-center">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              <Trophy className="h-3.5 w-3.5" /> Refer &amp; Earn
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-black tracking-tight text-white sm:text-6xl/tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-100 to-slate-400">
              Refer Land. <span className="text-brand-400 bg-clip-text text-transparent bg-linear-to-r from-brand-400 to-purple-400">Win {prize}.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Share your personal referral link with anyone looking for a plot, home or
              commercial space. Every confirmed referral earns you a contest point &mdash; the
              top referrer every 6 months wins the cycle&apos;s land prize.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ReferEarnPageCta
                guestLabel="Get My Referral Link"
                className="shadow-lg shadow-accent-500/25"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* How it works */}
      <section className="relative py-20 sm:py-28 bg-slate-950/20">
        <Container className="relative z-10">
          <Reveal>
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                How It Works
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Four Steps to Winning
              </h2>
            </div>
          </Reveal>

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={index * 0.1}>
                  <div className="group relative h-full p-[1px] rounded-3xl bg-white/5 transition-all duration-500 hover:bg-linear-to-br hover:from-white/10 hover:via-brand-500/30 hover:to-white/5">
                    <div className="relative h-full flex flex-col items-start gap-4 p-7 rounded-[23px] bg-slate-950/90">
                      <span className="absolute right-6 top-4 text-6xl font-black text-white/5 select-none font-display">
                        0{index + 1}
                      </span>
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 transition-transform duration-500 group-hover:scale-110">
                        <Icon className="h-5.5 w-5.5" />
                      </span>
                      <h3 className="font-display text-base font-bold text-white">{step.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Live contest status */}
      <section className="relative py-20 sm:py-28">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-amber-500/20 bg-slate-900/40 p-8 backdrop-blur-md shadow-2xl sm:p-12">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Trophy className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      {activeCycle ? `Cycle #${activeCycle.cycle_number}` : "Current Cycle"}
                    </p>
                    <h3 className="font-display text-lg font-bold text-white">{prize}</h3>
                  </div>
                </div>
                {activeCycle && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                    <Clock3 className="h-3.5 w-3.5 text-brand-400" />
                    {daysLeft(activeCycle.ends_at)} days left
                  </span>
                )}
              </div>

              {leaderboard.length > 0 ? (
                <ul className="mt-6 flex flex-col divide-y divide-white/5">
                  {leaderboard.slice(0, 10).map((entry, index) => (
                    <li
                      key={entry.referrerId}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-medium text-slate-300">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            index === 0
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-white/5 text-slate-500 border border-white/10"
                          }`}
                        >
                          {index === 0 ? <Crown className="h-3 w-3" /> : index + 1}
                        </span>
                        {maskName(entry.fullName)}
                      </span>
                      <span className="text-sm font-bold text-brand-400">{entry.points} pts</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-sm text-slate-400">
                  No confirmed referrals yet this cycle — be the first on the leaderboard.
                </p>
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-br from-brand-950 via-slate-950 to-brand-950 opacity-90"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.15)_1px,transparent_1px)] bg-size-[24px_24px]"
        />

        <Container className="relative z-10">
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-lg text-center shadow-2xl sm:p-12">
              <Sparkles className="mx-auto h-8 w-8 text-brand-400" />
              <h2 className="mt-4 font-display text-3xl font-black text-white sm:text-4xl">
                Ready to Start Earning Points?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                It takes less than a minute to sign up and get your referral link.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <ReferEarnPageCta
                  guestLabel="Sign Up Free"
                  className="shadow-lg shadow-brand-500/20"
                />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
