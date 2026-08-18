import { redirect } from "next/navigation";
import { Gift, CheckCircle2, Users2, UserCircle2, Handshake, Sparkles, Award } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import SignOutButton from "@/components/admin/SignOutButton";
import Tabs from "@/components/ui/Tabs";
import ProfileDetailsCard from "@/components/dashboard/ProfileDetailsCard";
import ReferralLinkCard from "@/components/dashboard/ReferralLinkCard";
import ReferralContestCard from "@/components/dashboard/ReferralContestCard";
import ReferralsList from "@/components/dashboard/ReferralsList";
import RewardsCard from "@/components/dashboard/RewardsCard";
import { createClient } from "@/lib/supabase/server";
import {
  getOrCreateProfile,
  getMyReferrals,
  summarizeReferrals,
  getActiveCycle,
  getCycleLeaderboard,
} from "@/lib/queries/referrals";
import { getSiteUrl } from "@/lib/getSiteUrl";

export const metadata = {
  title: "My User Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const cycleDataPromise = getActiveCycle().then(async (activeCycle) => ({
    activeCycle,
    cycleLeaderboard: await getCycleLeaderboard(activeCycle),
  }));
  const siteUrlPromise = getSiteUrl();
  const profile = await getOrCreateProfile(user);
  const [referrals, cycleData, siteUrl] = await Promise.all([
    profile ? getMyReferrals(user.id) : [],
    cycleDataPromise,
    siteUrlPromise,
  ]);
  const pointsBalance = Number(profile?.points_balance || 0);
  const stats = summarizeReferrals(referrals);
  const { activeCycle, cycleLeaderboard } = cycleData;
  const referralLink = profile ? `${siteUrl}/?ref=${profile.referral_code}` : null;

  return (
    <div className="relative overflow-hidden bg-slate-950/10 min-w-0">
      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute -left-20 top-20 h-[400px] w-[400px] rounded-full bg-brand-500/10 opacity-60 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-1/2 h-[400px] w-[400px] rounded-full bg-accent-500/10 opacity-50 blur-[130px]" />

      <Container className="relative z-10 flex flex-col gap-8 py-8 sm:py-16 min-w-0">
        {/* Header Workspace Banner */}
        <Reveal>
          <div className="relative overflow-hidden flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/15 bg-linear-to-r from-slate-900/90 via-slate-950/80 to-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col gap-1.5 z-10 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-300">
                  <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                  User Account Portal
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight">
                Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed truncate">
                Signed in as <span className="font-mono text-brand-300 font-semibold">{user.email}</span>
              </p>
            </div>

            <SignOutButton redirectTo="/" authType="user" className="w-auto self-start sm:self-auto rounded-2xl font-bold py-2.5 px-5 text-xs sm:text-sm shadow-md" />
          </div>
        </Reveal>

        {!profile ? (
          <Reveal delay={0.05}>
            <p className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400 backdrop-blur-xl">
              We&apos;re still setting up your profile. Please refresh this page in a moment.
            </p>
          </Reveal>
        ) : (
          <Reveal delay={0.05}>
            <Tabs
              tabs={[
                {
                  key: "refer-earn",
                  label: "Refer & Earn",
                  icon: <Handshake className="h-4 w-4 text-amber-400" />,
                  content: (
                    <div className="flex flex-col gap-8 min-w-0">
                      {/* Referrals KPI Stat Cards */}
                      <div className="grid grid-cols-3 gap-2.5 sm:gap-5">
                        <StatCard icon={Users2} label="Total Referrals" value={stats.totalCount} tone="brand" />
                        <StatCard icon={Gift} label="Pending Review" value={stats.pendingCount} tone="neutral" />
                        <StatCard
                          icon={CheckCircle2}
                          label="Confirmed Deals"
                          value={stats.confirmedCount}
                          tone="success"
                        />
                      </div>

                      <ReferralLinkCard referralLink={referralLink} referralCode={profile.referral_code} />

                      <RewardsCard initialPoints={pointsBalance} />

                      <ReferralContestCard
                        cycle={activeCycle}
                        leaderboard={cycleLeaderboard}
                        currentUserId={profile.id}
                      />

                      <div className="flex flex-col gap-4">
                        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                          <Award className="h-5 w-5 text-brand-400" /> Your Tracked Referrals
                        </h2>
                        <ReferralsList referrals={referrals} />
                      </div>
                    </div>
                  ),
                },
                {
                  key: "profile",
                  label: "My Profile",
                  icon: <UserCircle2 className="h-4 w-4 text-brand-400" />,
                  content: <ProfileDetailsCard profile={profile} email={user.email} />,
                },
              ]}
            />
          </Reveal>
        )}
      </Container>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = {
    brand: "bg-linear-to-br from-brand-500/20 to-purple-500/5 border-brand-500/30 text-brand-300",
    accent: "bg-linear-to-br from-accent-500/20 to-purple-500/5 border-accent-500/30 text-accent-300",
    neutral: "bg-slate-900/60 border-white/10 text-slate-300",
    success: "bg-linear-to-br from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300",
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-3xl border p-3.5 sm:p-6 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 min-w-0 ${tones[tone]}`}>
      <span className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-inner">
        <Icon className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
      </span>
      <div className="flex flex-col min-w-0 leading-snug">
        <p className="font-display text-xl sm:text-3xl font-black text-white leading-tight">{value}</p>
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate mt-0.5">{label}</p>
      </div>
    </div>
  );
}
