"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { readReferralCookie, storeReferralCookie } from "@/lib/referral";

export default function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      const normalized = ref.trim().toUpperCase();
      const existing = readReferralCookie();
      if (!existing || existing === normalized) {
        storeReferralCookie(normalized);
      }
      return;
    }

    const existing = readReferralCookie();
    if (existing) {
      storeReferralCookie(existing);
    }
  }, [searchParams]);

  return null;
}
