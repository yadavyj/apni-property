"use client";

import { useState } from "react";
import { Check, Copy, Gift, User, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function ReferPropertyCard({ referLink, propertyTitle, prize = "600 sqft plot of land" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  const shareHref = referLink
    ? buildWhatsAppLink(`Check out this property on Apni Property — ${propertyTitle}: ${referLink}`)
    : "#";

  if (!referLink) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-amber-500/30 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/15 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md">
            <Gift className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-amber-400">Refer & Earn Contest</p>
            <h3 className="font-display text-base font-bold text-white">Want to refer this property?</h3>
          </div>
        </div>

        <p className="relative mt-3 text-xs leading-relaxed text-slate-300">
          Sign in to get your custom referral link & code for this property. Earn contest points towards winning <strong>{prize}</strong>!
        </p>

        <div className="relative mt-4">
          <Button
            href="/login"
            variant="accent"
            size="md"
            className="w-full justify-center rounded-xl font-bold py-3 text-xs sm:text-sm text-white shadow-lg shadow-amber-500/20"
          >
            <User className="h-4 w-4 mr-1.5" />
            Sign In to Refer This Property
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-brand-500/30 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/15 blur-3xl"
      />

      <div className="relative flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-300 shadow-md">
          <Gift className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-brand-400">Refer &amp; Earn</p>
          <h3 className="font-display text-base font-bold text-white">Know someone who wants this plot?</h3>
        </div>
      </div>

      <p className="relative mt-3 text-xs leading-relaxed text-slate-300">
        Share this exact listing with your referral link. If they buy it, you earn a contest point &mdash; top referrer wins {prize}.
      </p>

      <div className="relative mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="min-w-0 flex-1 truncate rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-xs font-mono font-semibold text-brand-300">
          {referLink}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="border-white/10 text-white rounded-xl cursor-pointer"
            aria-label="Copy referral link"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-amber-400" />}
          </Button>
          <Button
            href={shareHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="sm"
            className="rounded-xl"
            aria-label="Share on WhatsApp"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
