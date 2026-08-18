"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, ArrowLeft, ShieldAlert } from "lucide-react";
import { adminLogin } from "@/lib/actions/adminAuth.actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json().catch(() => ({ success: false, error: "Unable to sign in right now." }));

      if (!response.ok || !result.success) {
        const message = result.error || "Invalid email or password.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Welcome back!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in right now.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 overflow-hidden">
      {/* Decorative Glow Blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-500/10 opacity-60 blur-[120px] animate-breathe"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-accent-500/10 opacity-50 blur-[120px] animate-breathe-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[24px_24px] opacity-75"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-400 transition-colors duration-200"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Homepage
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-brand-500/20">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            {/* Pulsing Lock Icon Container */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <div className="absolute inset-0 rounded-2xl bg-brand-500/5 animate-ping-slow" />
              <Lock className="h-6 w-6 relative z-10" />
            </div>
            
            <h1 className="mt-3 font-display text-2xl font-black text-white tracking-tight">
              Apni Property <span className="text-brand-400 bg-clip-text text-transparent bg-linear-to-r from-brand-400 to-purple-400">Admin</span>
            </h1>
            <p className="text-xs text-slate-400">
              Authorized access only. Sign in to manage listings and leads.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="admin@apniproperty.in"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-950/40 border-white/5 text-white focus:ring-brand-500 focus:border-transparent placeholder:text-slate-600"
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-950/40 border-white/5 text-white focus:ring-brand-500 focus:border-transparent placeholder:text-slate-600"
            />

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-medium text-red-400">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="mt-3 w-full bg-linear-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 shadow-lg shadow-brand-600/10 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Verifying Credentials…" : "Sign In to Console"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px] text-slate-600 leading-relaxed">
          This system is private and monitored. Unauthorized entry attempts are logged and may be subject to legal action.
        </p>
      </div>
    </div>
  );
}
