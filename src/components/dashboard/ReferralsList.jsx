import { Gift, Users2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/common/EmptyState";

const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
};

function statusTone(referral) {
  return referral.status === "confirmed" ? "success" : "neutral";
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ReferralsList({ referrals = [] }) {
  if (!referrals.length) {
    return (
      <EmptyState
        icon={Users2}
        title="No referrals yet"
        description="Share your referral link above — every property enquiry that comes through it will show up here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {referrals.map((referral) => (
        <div
          key={referral.id}
          className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-slate-900/40 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Gift className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-semibold text-white">{referral.referred_name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {referral.properties?.title ? `Re: ${referral.properties.title} · ` : ""}
                Referred on {formatDate(referral.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-13 sm:pl-0">
            <Badge tone={statusTone(referral)}>{STATUS_LABEL[referral.status]}</Badge>
            {referral.status === "confirmed" && (
              <span className="hidden text-xs text-slate-400 sm:inline">
                +1 pt on {formatDate(referral.confirmed_at)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
