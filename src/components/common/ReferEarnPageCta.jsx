"use client";

import Button from "@/components/ui/Button";
import GuestReferralShare from "@/components/common/GuestReferralShare";
import { usePublicAuth } from "@/components/providers/PublicAuthProvider";

export default function ReferEarnPageCta({ guestLabel, className }) {
  const { user } = usePublicAuth();

  if (!user) {
    return <GuestReferralShare label={guestLabel} className={className} />;
  }

  return (
    <Button
      href="/dashboard"
      variant="accent"
      size="lg"
      className={className}
    >
      View My Referrals
    </Button>
  );
}
