"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ShieldCheck, KeyRound, Lock, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { changeAdminPassword } from "@/lib/actions/adminAuth.actions";

export default function AdminAccountForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    startTransition(async () => {
      try {
        await changeAdminPassword({ currentPassword, newPassword });
        toast.success("Admin password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        toast.error(err.message || "Failed to update password");
      }
    });
  }

  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-rose-500/20 bg-slate-900/60 p-4 sm:p-6 max-w-3xl backdrop-blur-2xl shadow-xl transition-all hover:border-rose-500/40 min-w-0">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-base font-bold text-white truncate">Admin Security Credentials</h2>
          <p className="text-xs text-slate-400 truncate">Update your secret admin password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Current Password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-rose-500 text-xs sm:text-sm"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-rose-500 text-xs sm:text-sm"
          />
          <Input
            label="Confirm New Password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-rose-500 text-xs sm:text-sm"
          />
        </div>

        <Button
          type="submit"
          size="md"
          className="mt-2 w-full sm:w-auto self-start rounded-2xl font-bold bg-linear-to-r from-rose-500 via-rose-600 to-brand-600 shadow-md shadow-rose-500/20 px-6 py-2.5 text-xs sm:text-sm"
          disabled={isPending}
        >
          <Lock className="h-4 w-4 mr-2" />
          {isPending ? "Updating Password…" : "Update Admin Password"}
        </Button>
      </form>
    </section>
  );
}
