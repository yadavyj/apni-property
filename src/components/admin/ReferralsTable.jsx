"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Gift, Phone, CheckCircle2, User, Building2, Search, Award, Eye } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/common/EmptyState";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import ReferrerProfileModal from "@/components/admin/ReferrerProfileModal";
import { confirmReferral } from "@/lib/actions/referral.actions";

const STATUS_TONE = {
  pending: "warning",
  confirmed: "success",
};

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ReferralCard({ referral, onSelectProfile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await confirmReferral(referral.id);
        toast.success("Referral confirmed — contest point awarded!");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to confirm referral");
      }
    });
  }

  const rawPhone = (referral.referred_phone || "").replace(/\D/g, "");

  return (
    <div className="flex flex-col justify-between gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-amber-500/30 min-w-0">
      <div className="flex flex-col gap-4 min-w-0">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3.5">
          <div className="min-w-0 flex flex-col gap-0.5">
            <span className="font-display text-lg sm:text-xl font-black text-white truncate">
              {referral.referred_name}
            </span>
            <span className="text-xs text-slate-300 font-mono font-medium">
              Date: {formatDate(referral.created_at)}
            </span>
          </div>

          <Badge tone={STATUS_TONE[referral.status] || "neutral"} className="text-xs px-3 py-1 font-bold">
            {referral.status}
          </Badge>
        </div>

        {/* Details Pills */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <a
              href={`tel:${referral.referred_phone}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-slate-100 hover:bg-white/10 transition-all text-xs sm:text-sm font-bold"
            >
              <Phone className="h-4 w-4 text-amber-400 shrink-0" />
              {referral.referred_phone}
            </a>

            <a
              href={`https://wa.me/91${rawPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-sm"
            >
              <WhatsAppIcon className="h-4 w-4 fill-current" />
              WhatsApp
            </a>
          </div>

          <div className="flex flex-col gap-2 pt-1 min-w-0">
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-bold text-amber-300 text-xs sm:text-sm min-w-0">
              <div className="flex items-center gap-2 min-w-0 truncate">
                <User className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="truncate">
                  Referred by <strong className="text-white">{referral.profiles?.full_name || "User"}</strong> ({referral.profiles?.referral_code || "CODE"})
                </span>
              </div>
              {referral.profiles && (
                <button
                  type="button"
                  onClick={() => onSelectProfile(referral.profiles)}
                  className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-200 hover:text-white bg-amber-500/25 hover:bg-amber-500/40 px-2.5 py-1 rounded-xl border border-amber-500/50 transition-all cursor-pointer shrink-0 ml-1 shadow-sm"
                  title="View Referrer Profile"
                >
                  <Eye className="h-3.5 w-3.5" /> Profile
                </button>
              )}
            </div>

            {referral.properties?.title && (
              <span className="inline-flex items-center gap-2 rounded-2xl border border-brand-500/30 bg-brand-500/10 px-3 py-2 font-bold text-brand-300 text-xs sm:text-sm truncate">
                <Building2 className="h-4 w-4 text-brand-400 shrink-0" />
                <span className="truncate">Re: {referral.properties.title}</span>
              </span>
            )}
          </div>

          {referral.status === "confirmed" && (
            <p className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-400 font-bold mt-1">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              Verified &amp; Confirmed on {formatDate(referral.confirmed_at)}
            </p>
          )}
        </div>
      </div>

      {/* Confirm Action Button */}
      {referral.status === "pending" && (
        <div className="border-t border-white/10 pt-3.5">
          <Button
            size="md"
            disabled={isPending}
            onClick={handleConfirm}
            className="w-full rounded-2xl font-black bg-linear-to-r from-amber-500 via-amber-600 to-brand-500 shadow-md shadow-amber-500/20 py-3 text-xs sm:text-sm"
          >
            <Award className="h-4 w-4 mr-2" />
            {isPending ? "Confirming…" : "Confirm Deal Referral"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ReferralsTable({ referrals = [] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return referrals.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (
        q &&
        !`${r.referred_name} ${r.referred_phone} ${r.profiles?.full_name || ""} ${r.profiles?.referral_code || ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [referrals, search, status]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl min-w-0">
      {/* Search & Filters Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-xl">
        <div className="relative flex-1">
          <Input
            placeholder="Search by referred name, phone, or referrer code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-amber-500 text-xs sm:text-sm"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl text-xs sm:text-sm"
          >
            <option value="all" className="bg-slate-950 text-white">All Referrals</option>
            <option value="pending" className="bg-slate-950 text-white">Pending Verification</option>
            <option value="confirmed" className="bg-slate-950 text-white">Confirmed Deals</option>
          </Select>
        </div>
      </div>

      {/* Referrals Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl">
          <EmptyState
            icon={Gift}
            title="No referrals found"
            description="Referrals submitted through user referral codes will appear here."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((referral) => (
            <ReferralCard
              key={referral.id}
              referral={referral}
              onSelectProfile={setSelectedProfile}
            />
          ))}
        </div>
      )}

      {/* Referrer Profile Modal */}
      {selectedProfile && (
        <ReferrerProfileModal
          user={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}
