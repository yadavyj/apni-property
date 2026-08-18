"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Share2, Sparkles, Building2, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { buildWhatsAppShareLink } from "@/lib/whatsapp";

export default function ReferralLinkCard({ referralLink, referralCode }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPublic, setCopiedPublic] = useState(false);

  const code = referralCode || (referralLink ? referralLink.split("ref=")[1] : "");

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(referralLink || "");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  }

  async function handleNativeShare(text) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Apni Property",
          text: text,
          url: referralLink || window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    }
  }

  const shareTextCode = `Use my Apni Property referral code *${code}* when sending an enquiry on any property listing!`;
  const shareTextLink = referralLink 
    ? `Join me on Apni Property! Check out verified property listings and use my referral link:\n${referralLink}`
    : shareTextCode;

  const shareHrefCode = buildWhatsAppShareLink(shareTextCode);
  const shareHrefLink = buildWhatsAppShareLink(shareTextLink);
  
  // Public share referral page link (works without login)
  const publicShareLink = typeof window !== "undefined" 
    ? `${window.location.origin}/share-referral?code=${code}`
    : ``;

  async function handleCopyPublicLink() {
    try {
      await navigator.clipboard.writeText(publicShareLink);
      setCopiedPublic(true);
      setTimeout(() => setCopiedPublic(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-linear-to-r from-slate-900/90 via-slate-950/95 to-slate-900/90 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl min-w-0">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/15 opacity-60 blur-3xl"
      />

      {/* Header Badge */}
      <div className="relative flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Share2 className="h-4 w-4" />
          </span>
          <p className="text-xs font-black uppercase tracking-widest text-amber-400">
            Your Personal Referral Link
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
          <Sparkles className="h-3 w-3 text-amber-400" /> Contest Active
        </span>
      </div>

      {/* Referral Code Box + Quick Action Buttons */}
      <div className="relative mt-4 flex flex-col gap-4">
        {/* Code Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Referral Code</span>
          <div className="flex items-center justify-between gap-3 min-w-0 flex-1 rounded-2xl border border-amber-500/40 bg-slate-950/90 px-4 py-3.5 backdrop-blur-md shadow-inner">
            <span className="font-mono text-base sm:text-lg font-black text-amber-300 tracking-wider truncate">
              {code}
            </span>
            <Button
              type="button"
              onClick={handleCopyCode}
              variant="outline"
              className="shrink-0 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs font-bold py-2 px-3 shadow-md cursor-pointer"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-amber-400" />}
            </Button>
          </div>
        </div>

        {/* Full Link Section */}
        {referralLink && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Complete Referral Link</span>
            <div className="flex items-center justify-between gap-3 min-w-0 flex-1 rounded-2xl border border-brand-500/40 bg-slate-950/90 px-4 py-3.5 backdrop-blur-md shadow-inner">
              <span className="font-mono text-xs sm:text-sm font-semibold text-brand-300 truncate break-all">
                {referralLink}
              </span>
              <Button
                type="button"
                onClick={handleCopyLink}
                variant="outline"
                className="shrink-0 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs font-bold py-2 px-3 shadow-md cursor-pointer"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-brand-400" />}
              </Button>
            </div>
          </div>
        )}

        {/* Public Share Referral Page - Works without login */}
        {publicShareLink && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">🌐 Public Share Link (No Login Required)</span>
            <div className="flex items-center justify-between gap-3 min-w-0 flex-1 rounded-2xl border border-purple-500/40 bg-slate-950/90 px-4 py-3.5 backdrop-blur-md shadow-inner">
              <span className="font-mono text-xs sm:text-sm font-semibold text-purple-300 truncate break-all">
                {publicShareLink}
              </span>
              <Button
                type="button"
                onClick={handleCopyPublicLink}
                variant="outline"
                className="shrink-0 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs font-bold py-2 px-3 shadow-md cursor-pointer"
              >
                {copiedPublic ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-purple-400" />}
              </Button>
            </div>
            <p className="text-xs text-slate-400">Share this link anywhere! Friends can browse properties and earn you bonus points by following social media.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {/* Native Share Button (shows on mobile/desktop when available) */}
          {typeof navigator !== "undefined" && navigator.share && (
            <Button
              type="button"
              onClick={() => handleNativeShare(shareTextLink || shareTextCode)}
              variant="outline"
              className="flex-1 rounded-2xl border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 font-bold py-3 px-4 text-xs"
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              Share to Contacts
            </Button>
          )}
          
          <Button
            href={shareHrefCode}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            className="flex-1 rounded-2xl font-bold py-3 px-4 text-xs shadow-lg shadow-emerald-500/20"
          >
            <WhatsAppIcon className="h-4 w-4 mr-1.5" />
            Share Code via WhatsApp
          </Button>
          {referralLink && (
            <Button
              href={shareHrefLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="flex-1 rounded-2xl border-brand-500/40 bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 font-bold py-3 px-4 text-xs"
            >
              <WhatsAppIcon className="h-4 w-4 mr-1.5" />
              Share Full Link via WhatsApp
            </Button>
          )}
        </div>
      </div>

      {/* How To Refer Instructions */}
      <div className="relative mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur-md text-xs sm:text-sm text-slate-300">
        <p className="font-bold text-white flex items-center gap-1.5">
          💡 How to Refer Buyers & Earn Contest Points:
        </p>

        <ul className="flex flex-col gap-2.5 leading-relaxed text-slate-300 pl-1">
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold mt-0.5">1</span>
            <span>
              <strong className="text-white">Option 1 - Share Your Code ({code}):</strong> Friends enter this code when they fill property enquiry forms.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold mt-0.5">2</span>
            <span>
              <strong className="text-white">Option 2 - Share Complete Link:</strong> Send the full referral link (your code is embedded). Buyers click it to reach us pre-linked to you.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold mt-0.5">3</span>
            <span>
              <strong className="text-white">Visit Property Pages:</strong> On any property, click the <strong className="text-brand-300">"Refer This Property"</strong> button to share that specific listing with your referral link attached!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold mt-0.5">4</span>
            <span>
              When they <strong className="text-white">confirm a deal</strong>, you earn a contest point. Top referrer every 6 months wins the prize!
            </span>
          </li>
        </ul>

        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">Want to share a specific property listing?</span>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-all shadow-sm"
          >
            <Building2 className="h-3.5 w-3.5" />
            Browse & Share Properties
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
