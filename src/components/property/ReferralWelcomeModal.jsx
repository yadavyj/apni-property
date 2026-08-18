"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserCheck, Sparkles, Send, Tag, X, AlertCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { leadSchema } from "@/lib/validations/lead.schema";
import { createLead } from "@/lib/actions/lead.actions";
import { storeReferralCookie } from "@/lib/referral";

export default function ReferralWelcomeModal({ property, refCode, referrerInfo }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const referrerName = referrerInfo?.full_name || "A Partner";
  const isSelf = Boolean(referrerInfo?.isSelf);

  useEffect(() => {
    if (refCode && !isSelf) {
      storeReferralCookie(refCode);
    }
    if (refCode) {
      // Auto open modal on load if coming from referral link
      const timer = setTimeout(() => {
        setOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [refCode, isSelf]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: `Hi! I was referred by ${referrerName} (${refCode}) and I'm interested in ${property?.title || "this property"}.`,
      property_id: property?.id || null,
      referral_code: refCode || "",
    },
  });

  async function onSubmit(values) {
    if (isSelf) {
      toast.error("You cannot use your own referral code!");
      return;
    }

    setSubmitting(true);
    try {
      await createLead({
        ...values,
        property_id: property?.id || null,
        referral_code: refCode,
      });
      toast.success(
        `Enquiry submitted! ${referrerName} will earn referral points once confirmed.`
      );
      setOpen(false);
      reset();
    } catch (err) {
      toast.error(err?.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!refCode || !open) return null;

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="flex flex-col gap-5 min-w-0">
        {/* Modal Banner Header */}
        <div className="flex flex-col gap-2 rounded-2xl border border-amber-500/30 bg-linear-to-r from-amber-500/15 via-slate-900/80 to-slate-900/90 p-4.5 backdrop-blur-md relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-500/20 blur-2xl" />

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/20 text-amber-300 shadow-md">
              <UserCheck className="h-5.5 w-5.5" />
            </span>
            <div className="min-w-0 flex flex-col gap-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Special Referral Invite
              </span>
              <h3 className="font-display text-base sm:text-lg font-black text-white truncate">
                Referred by {referrerName}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium leading-relaxed pt-1">
            You were invited to view <strong className="text-white">{property?.title}</strong>. Fill in your details below to send an enquiry — your referral code is automatically attached!
          </p>
        </div>

        {/* Pre-filled Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Pre-filled Referral Code Badge Display */}
          {isSelf ? (
            <div className="flex items-center gap-2 p-3 rounded-xl border border-rose-500/30 bg-rose-500/15 text-xs text-rose-300 font-bold shadow-sm">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              You cannot use your own referral code ({refCode})
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl border border-brand-500/30 bg-brand-500/10 text-xs">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-brand-400 shrink-0" />
                <span className="text-slate-300 font-medium">Applied Referral Code:</span>
              </div>
              <span className="font-mono text-xs font-black text-brand-300 bg-brand-500/20 border border-brand-500/40 px-2.5 py-1 rounded-lg">
                {refCode}
              </span>
            </div>
          )}

          <Input
            id="name"
            label="Full Name *"
            placeholder="Enter your full name"
            error={errors.name?.message}
            {...register("name")}
            className="bg-slate-950/70 border-white/10 text-white rounded-xl text-xs sm:text-sm py-2.5"
          />

          <Input
            id="phone"
            label="Phone Number *"
            placeholder="10-digit mobile number"
            error={errors.phone?.message}
            {...register("phone")}
            className="bg-slate-950/70 border-white/10 text-white rounded-xl text-xs sm:text-sm py-2.5"
          />

          <Input
            id="email"
            type="email"
            label="Email Address (optional)"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
            className="bg-slate-950/70 border-white/10 text-white rounded-xl text-xs sm:text-sm py-2.5"
          />

          <Textarea
            id="message"
            label="Enquiry Note"
            error={errors.message?.message}
            {...register("message")}
            className="bg-slate-950/70 border-white/10 text-white rounded-xl text-xs sm:text-sm py-2.5 min-h-[90px]"
          />

          <Button
            type="submit"
            size="lg"
            disabled={submitting || isSelf}
            className="mt-1 w-full rounded-xl font-black bg-linear-to-r from-amber-500 via-amber-600 to-brand-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl py-3 text-xs sm:text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Submitting..." : isSelf ? "Self-Referral Disabled" : "Submit Referral Enquiry"}
          </Button>
        </form>
      </div>
    </Modal>
  );
}
