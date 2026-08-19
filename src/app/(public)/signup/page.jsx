"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Gift, ArrowLeft, ShieldCheck, BadgePercent, Coins } from "lucide-react";
import Container from "@/components/layout/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { adminCreateUser } from "@/lib/actions/auth.actions";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralFromUrl = searchParams.get("ref")?.trim().toUpperCase() || "";
  const guestReferralToken = searchParams.get("guest_token")?.trim() || "";
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const signupResult = await adminCreateUser({
      email,
      password,
      fullName,
      phone,
      referralCode: referralFromUrl,
      guestReferralToken,
    });

    if (!signupResult.success) {
      setError(signupResult.error || "Could not create your account.");
      toast.error(signupResult.error || "Could not create your account.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError("Authentication is not configured right now.");
      toast.error("Authentication is not configured right now.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message || "Account created, but could not sign in automatically.");
      toast.error("Account created, please sign in.");
      router.push("/login");
      return;
    }

    toast.success("Account created! Welcome to Apni Property.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 bg-slate-950/10">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-brand-500/5 opacity-50 blur-[130px] animate-pulse" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-accent-500/5 opacity-40 blur-[130px] animate-pulse" />

      <Container className="relative z-10 flex justify-center w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch w-full">
          
          {/* Left Panel: Trust & Pitch (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/20 backdrop-blur-md">
            {/* Dot Pattern Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <div className="relative z-10 flex flex-col gap-10">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to home
              </Link>
              
              <div className="flex flex-col gap-4">
                <span className="font-display text-2xl font-black bg-linear-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
                  Apni Property
                </span>
                <h2 className="font-display text-3xl font-black text-white leading-tight">
                  Discover Plots, Land <br />& Earn Payouts.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Join our property platform to unlock verified deals, track dynamic referral bonuses, and secure direct-owner pricing.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">100% Registry Verified</h4>
                    <p className="text-xs text-slate-500 leading-normal mt-0.5">Every listing undergoes severe title, possession, and boundary checks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <BadgePercent className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Zero Hidden Charges</h4>
                    <p className="text-xs text-slate-500 leading-normal mt-0.5">Direct buyer-to-owner matching, removing broker commission loops.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Coins className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Earn Referral Bonuses</h4>
                    <p className="text-xs text-slate-500 leading-normal mt-0.5">Get a personal dashboard to share links and collect deals payouts.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/5 text-xs text-slate-500">
              Securing land deals and transparent pricing.
            </div>
          </div>

          {/* Right Panel: Glassmorphic Signup Form Container */}
          <div className="group relative p-[1px] flex flex-col overflow-hidden rounded-[2.5rem] bg-white/5 transition-all duration-500 hover:bg-linear-to-br hover:from-brand-400 hover:via-purple-500 hover:to-accent-400 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)]">
            <div className="flex flex-1 flex-col justify-between p-8 sm:p-10 rounded-[2.4rem] bg-slate-900/60 backdrop-blur-md">
              <div>
                <div className="mb-8 flex flex-col items-center gap-2.5 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10 text-brand-400 shadow-md">
                    <Gift className="h-5 w-5" />
                  </span>
                  <h1 className="font-display text-2xl font-black text-white bg-linear-to-b from-white via-white to-slate-300 bg-clip-text text-transparent">
                    Refer &amp; Earn
                  </h1>
                  <p className="text-xs font-semibold text-slate-400">
                    Create an account to get your referral link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <Input
                    id="fullName"
                    label="Full Name"
                    placeholder="Your name"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-slate-950/40 border-white/15 text-white placeholder:text-slate-500 focus:border-brand-500/50 focus:ring-brand-500/20"
                  />
                  <Input
                    id="phone"
                    label="Phone Number"
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-slate-950/40 border-white/15 text-white placeholder:text-slate-500 focus:border-brand-500/50 focus:ring-brand-500/20"
                  />
                  <Input
                    id="email"
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-950/40 border-white/15 text-white placeholder:text-slate-500 focus:border-brand-500/50 focus:ring-brand-500/20"
                  />
                  <Input
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-950/40 border-white/15 text-white placeholder:text-slate-500 focus:border-brand-500/50 focus:ring-brand-500/20"
                  />

                  {error && <p className="text-xs font-semibold text-red-400">{error}</p>}

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="mt-3 w-full rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-300" 
                    disabled={loading}
                  >
                    {loading ? "Creating account…" : "Create Account"}
                  </Button>
                </form>
              </div>

              <p className="mt-8 text-center text-xs text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-brand-400 hover:text-brand-300 hover:underline transition-all">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}

