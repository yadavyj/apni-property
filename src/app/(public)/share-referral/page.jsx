"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Copy, Share2, Heart, AlertCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/common/Reveal";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { BUSINESS } from "@/lib/constants";
import { buildWhatsAppShareLink } from "@/lib/whatsapp";
import { validateGuestReferralToken } from "@/lib/actions/guestReferral.actions";

export default function ShareReferralPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const referralCode = searchParams.get("code");
  const guestToken = searchParams.get("guest_token");

  const [copied, setCopied] = useState(false);
  const [guestValid, setGuestValid] = useState(guestToken ? null : false);
  const [socials, setSocials] = useState({
    instagram: false,
    facebook: false,
  });

  useEffect(() => {
    let active = true;

    if (!guestToken) {
      return () => {
        active = false;
      };
    }

    validateGuestReferralToken(guestToken).then((valid) => {
      if (active) setGuestValid(valid);
    });

    return () => {
      active = false;
    };
  }, [guestToken]);

  const referralLink = guestToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/share-referral?guest_token=${encodeURIComponent(guestToken)}`
    : referralCode
      ? `${typeof window !== "undefined" ? window.location.origin : ""}/properties?ref=${referralCode}`
      : null;
  const whatsappShareLink = referralLink
    ? buildWhatsAppShareLink(`Join me on Apni Property and explore verified properties:\n${referralLink}`)
    : null;

  async function handleCopyLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy link");
    }
  }

  function handleSocialClick(platform) {
    if (platform === "instagram") {
      window.open(`https://instagram.com/${BUSINESS.instagramHandle || "apniproperty"}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://facebook.com/${BUSINESS.facebookHandle || "apniproperty"}`, "_blank");
    }
    
    // Track social follow for bonus points
    if (referralCode) {
      trackSocialFollow(referralCode, platform);
    }
    
    setSocials(prev => ({
      ...prev,
      [platform]: true,
    }));
  }

  async function trackSocialFollow(code, platform) {
    try {
      const res = await fetch("/api/referral/track-social-follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode: code,
          platform: platform,
        }),
      });
      
      if (res.ok) {
        console.log(`Social follow tracked: ${platform}`);
      }
    } catch (err) {
      console.error("Failed to track social follow:", err);
    }
  }

  if (!referralCode && !guestToken) {
    return (
      <div className="min-h-screen bg-slate-950/10 flex items-center justify-center py-16">
        <Container>
          <Reveal>
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-400" />
                <h1 className="text-2xl font-bold text-red-300">Invalid Referral Link</h1>
              </div>
              <p className="text-red-200 mb-6">No referral code found in the link.</p>
              <Button
                onClick={() => router.push("/properties")}
                className="rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 font-bold py-2.5 px-6"
              >
                Browse Properties
              </Button>
            </div>
          </Reveal>
        </Container>
      </div>
    );
  }

  if (guestToken && guestValid === null) {
    return (
      <div className="min-h-screen bg-slate-950/10 flex items-center justify-center py-16">
        <Container>
          <p className="text-center text-sm text-slate-400">Validating referral link...</p>
        </Container>
      </div>
    );
  }

  if (guestToken && !guestValid) {
    return (
      <div className="min-h-screen bg-slate-950/10 flex items-center justify-center py-16">
        <Container>
          <Reveal>
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-400" />
                <h1 className="text-2xl font-bold text-red-300">Referral Link Expired</h1>
              </div>
              <p className="text-red-200 mb-6">This temporary referral link is no longer active.</p>
              <Button href="/refer-earn" className="rounded-2xl font-bold py-2.5 px-6">
                Refer &amp; Earn
              </Button>
            </div>
          </Reveal>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950/10 py-16">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Main CTA */}
          <Reveal>
            <div className="flex flex-col gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-xs font-bold text-brand-300 mb-4">
                  🔗 Exclusive Referral Link
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
                  Your Friend&apos;s Exclusive Property Link
                </h1>
                <p className="text-lg text-slate-300">
                  Browse verified property listings and start your journey with Apni Property. Your friend gets bonus points when you complete a deal!
                </p>
              </div>

              {/* Link Display Box */}
              <div className="rounded-2xl border border-brand-500/40 bg-slate-950/90 p-5 flex items-center gap-3">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-transparent text-brand-300 font-mono text-sm outline-none truncate"
                />
                <Button
                  onClick={handleCopyLink}
                  className="shrink-0 bg-brand-500/20 border border-brand-500/40 text-brand-300 hover:bg-brand-500/30 rounded-xl font-bold py-2 px-4"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                {whatsappShareLink && (
                  <Button
                    href={whatsappShareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    className="w-full rounded-2xl font-bold py-3 text-base shadow-lg"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Share on WhatsApp
                  </Button>
                )}
                <Button
                  href={guestToken ? `/properties?guest_token=${encodeURIComponent(guestToken)}` : "/properties"}
                  className="w-full bg-linear-to-r from-brand-500 to-purple-500 text-white rounded-2xl font-bold py-3 text-base shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Properties
                </Button>
                {guestToken && (
                  <Button
                    href={`/signup?guest_token=${encodeURIComponent(guestToken)}`}
                    variant="outline"
                    className="w-full rounded-2xl font-bold py-3 text-base"
                  >
                    Create an Account Later
                  </Button>
                )}
              </div>
            </div>
          </Reveal>

          {/* Right: Social Media Bonus Section */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-amber-500/30 bg-linear-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-8">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                🎁 Earn Bonus Points
              </h2>

              <div className="flex flex-col gap-4">
                <p className="text-sm text-slate-300">
                  Your referrer gets extra bonus points when you follow their social media. It&apos;s a way to show appreciation!
                </p>

                {/* Instagram */}
                <button
                  onClick={() => handleSocialClick("instagram")}
                  disabled={socials.instagram}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                    socials.instagram
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-pink-500/40 bg-pink-500/10 hover:border-pink-500/60 hover:bg-pink-500/20 cursor-pointer"
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-pink-400" />
                      Follow on Instagram
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Gives referrer +50 bonus points
                    </p>
                  </div>
                  {socials.instagram && (
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Check className="h-5 w-5" />
                      <span className="text-xs font-bold">Done!</span>
                    </div>
                  )}
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleSocialClick("facebook")}
                  disabled={socials.facebook}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                    socials.facebook
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-blue-500/40 bg-blue-500/10 hover:border-blue-500/60 hover:bg-blue-500/20 cursor-pointer"
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Heart className="h-5 w-5 text-blue-400" />
                      Follow on Facebook
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Gives referrer +50 bonus points
                    </p>
                  </div>
                  {socials.facebook && (
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Check className="h-5 w-5" />
                      <span className="text-xs font-bold">Done!</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-slate-400 text-center">
                  Your referrer gets points for every person they refer. Help them win by following their social media and completing a property deal!
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
