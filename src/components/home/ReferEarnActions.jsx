"use client";

import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { usePublicAuth } from "@/components/providers/PublicAuthProvider";

export default function ReferEarnActions() {
  const { user } = usePublicAuth();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      <Button
        href={user ? "/dashboard" : "/signup"}
        variant="accent"
        size="lg"
        className="rounded-xl shadow-lg shadow-accent-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-accent-500/35"
      >
        {user ? "View My Referrals" : "Get My Referral Link"}
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button
        href="/refer-earn"
        variant="outline"
        size="lg"
        className="rounded-xl border-white/10 text-white hover:bg-white/5"
      >
        How It Works
      </Button>
    </div>
  );
}
