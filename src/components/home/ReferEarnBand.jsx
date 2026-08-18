import { Gift } from "lucide-react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/common/Reveal";
import { getActiveCycle } from "@/lib/queries/referrals";
import ReferEarnActions from "@/components/home/ReferEarnActions";

export default async function ReferEarnBand() {
  const activeCycle = await getActiveCycle();
  const prize = activeCycle?.prize_description || "600 sqft plot of land";

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-slate-950/20">
      <Container>
        {/* Floating Glassmorphic Container */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-md p-10 sm:p-16 shadow-2xl shadow-black/50">
          
          {/* Dynamic Background Glows */}
          <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-500/10 opacity-60 blur-[100px] animate-pulse" />
          <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accent-500/10 opacity-50 blur-[100px] animate-pulse" />

          {/* Dotted Grid Overlay */}
          <div 
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" 
          />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            <Reveal className="flex flex-col items-center gap-6">
              
              {/* Glowing Gift Icon Wrapper */}
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10 text-brand-400 shadow-md shadow-brand-500/10 animate-bounce-slow">
                <Gift className="h-6 w-6" />
              </span>
              
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Refer &amp; Earn
              </span>
              
              <h2 className="max-w-2xl font-display text-3xl font-black text-white sm:text-4xl leading-tight bg-linear-to-b from-white via-white to-slate-300 bg-clip-text text-transparent">
                Know Someone Looking for Land? <br />
                <span className="bg-linear-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">Win {prize}.</span>
              </h2>

              <p className="max-w-xl text-sm leading-relaxed text-slate-400">
                Share your personal referral link. Every referral that completes a property deal
                with us earns you a contest point &mdash; the top referrer every 6 months wins a{" "}
                <span className="text-white font-semibold">{prize}</span>.
              </p>

              <ReferEarnActions />

            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

