"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Mail, Phone, Hash, CalendarDays, Pencil, UserCircle2, Save, X } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { updateMyProfile } from "@/lib/actions/profile.actions";

function initials(name) {
  const parts = (name || "").trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

export default function ProfileDetailsCard({ profile, email }) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [isPending, startTransition] = useTransition();

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  function handleSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateMyProfile({ full_name: fullName, phone });
        toast.success("Profile details updated successfully!");
        setIsEditing(false);
      } catch (err) {
        toast.error(err.message || "Failed to update profile");
      }
    });
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7 shadow-xl backdrop-blur-2xl transition-all min-w-0">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl"
      />

      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 min-w-0">
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-500/30 bg-brand-500/20 font-display text-lg font-black text-brand-300 shadow-md">
            {initials(profile?.full_name)}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base sm:text-lg font-bold text-white truncate">
              {profile?.full_name || "User Account"}
            </h3>
            <p className="text-xs text-slate-400 font-mono">Member since {memberSince}</p>
          </div>
        </div>

        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="rounded-2xl border-white/10 bg-white/5 text-xs font-semibold hover:bg-white/10 text-slate-200"
          >
            <Pencil className="h-3.5 w-3.5 mr-1 text-brand-400" />
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative mt-6 flex flex-col gap-4 min-w-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
            />
          </div>
          <div className="flex gap-2.5 pt-2">
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="rounded-2xl font-bold bg-linear-to-r from-brand-500 to-accent-500 text-xs py-2.5 px-5 shadow-md shadow-brand-500/20"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              {isPending ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFullName(profile?.full_name || "");
                setPhone(profile?.phone || "");
                setIsEditing(false);
              }}
              className="rounded-2xl border-white/10 bg-transparent text-xs font-semibold text-slate-300 hover:bg-white/5 py-2.5 px-4"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <dl className="relative mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 min-w-0">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 sm:p-4 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 border border-brand-500/20">
              <Mail className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</dt>
              <dd className="truncate text-xs sm:text-sm font-semibold text-white mt-0.5">{email}</dd>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 sm:p-4 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/20">
              <Phone className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Number</dt>
              <dd className="truncate text-xs sm:text-sm font-semibold text-white mt-0.5">{profile?.phone || "Not set"}</dd>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 sm:p-4 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/20">
              <Hash className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Referral Code</dt>
              <dd className="truncate text-xs sm:text-sm font-mono font-bold text-amber-400 mt-0.5">{profile?.referral_code || "-"}</dd>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 sm:p-4 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Created</dt>
              <dd className="truncate text-xs sm:text-sm font-semibold text-white mt-0.5">{memberSince}</dd>
            </div>
          </div>
        </dl>
      )}
    </div>
  );
}
