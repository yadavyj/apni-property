"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  readGuestReferralToken,
  readReferralCookie,
  storeGuestReferralToken,
  storeReferralCookie,
} from "@/lib/referral";

export default function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    const guestToken = searchParams.get("guest_token");

    if (guestToken) {
      storeGuestReferralToken(guestToken);
    } else {
      readGuestReferralToken();
    }

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
