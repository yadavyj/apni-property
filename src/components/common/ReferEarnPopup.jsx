"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, BadgeCheck, Gift, Sparkles, Trophy } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { usePublicAuth } from "@/components/providers/PublicAuthProvider";

const POPUP_DELAY_MS = 2000;
const EXCLUDED_ROUTES = new Set(["/login", "/signup", "/refer-earn"]);

function isExcludedRoute(pathname) {
  return EXCLUDED_ROUTES.has(pathname) || pathname.startsWith("/dashboard");
}

export default function ReferEarnPopup() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const hasShownThisPageLoad = useRef(false);
  const referralCode = searchParams.get("ref");
  const { user } = usePublicAuth();

  useEffect(() => {
    if (referralCode || isExcludedRoute(pathname) || hasShownThisPageLoad.current) return;

    const timer = window.setTimeout(() => {
      hasShownThisPageLoad.current = true;
      setOpen(true);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname, referralCode]);

  function handleClose() {
    setOpen(false);
  }

  const ctaHref = user ? "/dashboard" : "/refer-earn";
  const ctaLabel = user ? "View My Referrals" : "Get My Referral Link";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Refer & Earn"
      panelClassName="max-w-2xl"
    >
      <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 p-3 sm:gap-5 sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-500/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-accent-500/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:18px_18px]"
        />

        <div className="relative flex flex-col items-center gap-2.5 text-center sm:gap-4">
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-brand-400/30 bg-brand-500/15 text-brand-300 shadow-lg shadow-brand-500/20 sm:h-16 sm:w-16 sm:rounded-2xl">
            <span className="absolute inset-0 animate-ping-slow rounded-2xl border border-brand-400/30" />
            <Gift className="relative h-6 w-6 sm:h-7 sm:w-7" />
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            Share. Refer. Win.
          </span>

          <div className="flex flex-col gap-2">
            <h2 className="font-display text-xl font-black leading-tight text-white sm:text-3xl">
              Know Someone Looking for Land?
            </h2>
            <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
              Share your personal referral link. Each completed property deal adds a contest point,
              and the top referrer wins the cycle prize.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 text-left sm:p-3">
              <BadgeCheck className="h-5 w-5 shrink-0 text-brand-400" />
              <span className="text-xs font-semibold text-slate-300">Free to join</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 text-left sm:p-3">
              <Trophy className="h-5 w-5 shrink-0 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">Top referrer wins</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 pt-1 sm:flex-row sm:gap-2.5">
            <Button
              href={ctaHref}
              variant="accent"
              size="lg"
              onClick={handleClose}
              className="w-full whitespace-nowrap rounded-xl font-bold"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href="/refer-earn"
              variant="outline"
              size="lg"
              onClick={handleClose}
              className="w-full rounded-xl border-white/15 text-white hover:bg-white/5"
            >
              How It Works
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
