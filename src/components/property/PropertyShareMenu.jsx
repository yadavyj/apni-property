"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, MessageSquareShare, Mail, Share2, X, Briefcase, MessageCircle, BadgeCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

const socialOptions = [
  { key: "whatsapp", label: "WhatsApp", Icon: MessageSquareShare },
  { key: "facebook", label: "Facebook", Icon: Share2 },
  { key: "x", label: "X / Twitter", Icon: MessageCircle },
  { key: "linkedin", label: "LinkedIn", Icon: Briefcase },
  { key: "email", label: "Email", Icon: Mail },
  { key: "copy", label: "Copy Link", Icon: Copy },
  { key: "native", label: "More", Icon: ExternalLink },
];

export default function PropertyShareMenu({ propertyTitle, className }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this property on Apni Property: ${propertyTitle}\n${url}`;

  useEffect(() => {
    if (!open) return;

    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKey(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  async function copyCurrentLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1600);
      setOpen(false);
    } catch {
      toast.error("Unable to copy the link on this device.");
    }
  }

  function openShare(target) {
    if (!url) return;

    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(propertyTitle || "Apni Property");
    const shareTextEncoded = encodeURIComponent(shareText);

    const linkMap = {
      whatsapp: `https://wa.me/?text=${shareTextEncoded}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      x: `https://twitter.com/intent/tweet?text=${shareTextEncoded}&url=${shareUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      email: `mailto:?subject=${encodeURIComponent(`Property on Apni Property: ${propertyTitle}`)}&body=${shareTextEncoded}`,
      native: "",
    };

    if (target === "copy") {
      copyCurrentLink();
      return;
    }

    if (target === "native") {
      if (navigator.share) {
        navigator
          .share({
            title: propertyTitle || "Apni Property",
            text: shareText,
            url,
          })
          .catch(() => {
            // ignore cancellation
          });
      } else {
        toast.info("Native share is not available in this browser.");
      }
      setOpen(false);
      return;
    }

    const href = linkMap[target];
    if (!href) return;

    window.open(href, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((current) => !current)}
        aria-label="Share this property"
        className="rounded-xl border-white/10 bg-white/5 px-4 text-xs font-semibold text-slate-200 hover:bg-white/10"
      >
        <Share2 className="h-4 w-4 text-brand-400" />
        Share
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(92vw,22rem)] rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl sm:right-auto sm:left-0">
          <div className="flex items-center justify-between border-b border-white/10 px-3 pb-2 pt-1">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-brand-300">Share</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close share menu"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {socialOptions.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => openShare(key)}
                className="flex items-center justify-start gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm font-medium text-slate-100 transition hover:border-brand-500/40 hover:bg-brand-500/10"
                aria-label={label}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950/60 text-brand-300">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{copied && key === "copy" ? "Copied" : label}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-200">
            <span className="inline-flex items-center gap-1.5 font-bold"><BadgeCheck className="h-3.5 w-3.5" /> Current URL</span>
            <p className="mt-1 break-all text-[11px] text-emerald-100/90">{url || "Loading current page…"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
