"use client";

import Button from "@/components/ui/Button";
import { usePublicAuth } from "@/components/providers/PublicAuthProvider";

export default function ReferEarnPageCta({ guestLabel, className }) {
  const { user } = usePublicAuth();

  return (
    <Button
      href={user ? "/dashboard" : "/signup"}
      variant="accent"
      size="lg"
      className={className}
    >
      {user ? "View My Referrals" : guestLabel}
    </Button>
  );
}
