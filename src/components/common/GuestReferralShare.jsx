"use client";

import { useState } from "react";
import { Check, Copy, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { buildWhatsAppShareLink } from "@/lib/whatsapp";
import { createGuestReferralSession } from "@/lib/actions/guestReferral.actions";

export default function GuestReferralShare({ label, className }) {
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await createGuestReferralSession();
      setShareLink(result.url);
    } catch (error) {
      toast.error(error?.message || "Could not create a referral link.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the referral link.");
    }
  }

  const shareMessage = `Join me on Apni Property and explore verified properties:\n${shareLink}`;
  const whatsappLink = shareLink ? buildWhatsAppShareLink(shareMessage) : "#";

  return (
    <>
      <Button
        type="button"
        variant="accent"
        size="lg"
        className={className}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
        {loading ? "Creating Link" : label}
      </Button>

      <Modal
        open={Boolean(shareLink)}
        onClose={() => setShareLink("")}
        title="Share Your Referral Link"
      >
        <div className="flex flex-col gap-5">
          <p className="text-sm leading-relaxed text-slate-300">
            Share this link with someone looking for property. They can browse and create an account later; your temporary referral session will preserve the attribution.
          </p>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 p-2">
            <input
              readOnly
              value={shareLink}
              aria-label="Temporary referral link"
              className="min-w-0 flex-1 bg-transparent px-2 text-xs text-brand-300 outline-none"
            />
            <Button
              type="button"
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="shrink-0 rounded-xl border-white/15 text-white"
              aria-label="Copy referral link"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
              className="w-full rounded-xl"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Share on WhatsApp
            </Button>
            <Button
              type="button"
              onClick={handleCopy}
              variant="outline"
              size="lg"
              className="w-full rounded-xl border-white/15 text-white"
            >
              <Copy className="h-5 w-5" />
              Copy Link
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
