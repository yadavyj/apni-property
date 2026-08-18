"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, CheckCircle2, AlertCircle, Tag } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { leadSchema } from "@/lib/validations/lead.schema";
import { createLead } from "@/lib/actions/lead.actions";
import { lookupReferrerCode } from "@/lib/actions/referral.actions";
import { readReferralCookie, storeReferralCookie } from "@/lib/referral";

export default function EnquiryForm({ propertyId = null, title = "Send an Enquiry" }) {
  const [submitting, setSubmitting] = useState(false);
  const [refCodeInput, setRefCodeInput] = useState("");
  const [referrerName, setReferrerName] = useState(null);
  const [isSelfReferral, setIsSelfReferral] = useState(false);
  const [checkingRefCode, setCheckingRefCode] = useState(false);

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
      message: "",
      property_id: propertyId,
    },
  });

  async function checkCode(code) {
    if (!code || code.length < 3) {
      setReferrerName(null);
      setIsSelfReferral(false);
      return;
    }
    setCheckingRefCode(true);
    try {
      const found = await lookupReferrerCode(code);
      if (found) {
        setReferrerName(found.fullName);
        setIsSelfReferral(Boolean(found.isSelf));
        if (!found.isSelf) {
          storeReferralCookie(found.code);
        }
      } else {
        setReferrerName(null);
        setIsSelfReferral(false);
      }
    } catch {
      setReferrerName(null);
      setIsSelfReferral(false);
    } finally {
      setCheckingRefCode(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRef = urlParams.get("ref");
      if (urlRef) {
        const upper = urlRef.trim().toUpperCase();
        setRefCodeInput(upper);
        checkCode(upper);
      }
    }
  }, []);

  function handleRefCodeChange(e) {
    const val = e.target.value.toUpperCase();
    setRefCodeInput(val);
    checkCode(val);
  }

  async function onSubmit(values) {
    if (isSelfReferral) {
      toast.error("You cannot use your own referral code!");
      return;
    }

    setSubmitting(true);
    try {
      const finalCode = refCodeInput.trim() || readReferralCookie() || null;
      await createLead({
        ...values,
        property_id: propertyId,
        referral_code: finalCode,
      });
      toast.success("Thanks! We've received your enquiry and will reach out shortly.");
      reset({ name: "", phone: "", email: "", message: "", property_id: propertyId });
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl sm:rounded-[2.1rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-8 lg:p-10 shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(139,92,246,0.18)]">
      {title && (
        <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-black text-white">
              {title}
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Fill in the details below and we&apos;ll get back to you within 24h.</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4.5">
        <Input
          id="name"
          label="Full Name *"
          placeholder="Enter your full name"
          error={errors.name?.message}
          {...register("name")}
          className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm py-3 rounded-xl transition-all"
        />
        <Input
          id="phone"
          label="Phone Number *"
          placeholder="10-digit mobile number"
          error={errors.phone?.message}
          {...register("phone")}
          className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm py-3 rounded-xl transition-all"
        />
        <Input
          id="email"
          type="email"
          label="Email Address (optional)"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
          className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm py-3 rounded-xl transition-all"
        />

        {/* Live Referral Code Input Field + Referrer Name Badge */}
        <div className="flex flex-col gap-1.5">
          <Input
            id="referral_code"
            label="Referral Code (optional)"
            placeholder="e.g. B4AFEA6"
            value={refCodeInput}
            onChange={handleRefCodeChange}
            className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm py-3 rounded-xl transition-all font-mono"
          />
          {checkingRefCode ? (
            <p className="text-[11px] font-semibold text-slate-400">Checking referral code...</p>
          ) : isSelfReferral ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-3 py-1.5 rounded-xl shadow-sm">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              You cannot use your own referral code ({refCodeInput})
            </div>
          ) : referrerName ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              Referred by {referrerName} ({refCodeInput})
            </div>
          ) : refCodeInput.length >= 3 ? (
            <p className="text-[11px] font-semibold text-rose-400">⚠️ Invalid referral code</p>
          ) : null}
        </div>

        <Textarea
          id="message"
          label="Your Message (optional)"
          placeholder="Tell us what location, plot size, or budget you have in mind..."
          error={errors.message?.message}
          {...register("message")}
          className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm py-3 rounded-xl transition-all min-h-[110px]"
        />
        <Button 
          type="submit" 
          size="lg" 
          disabled={submitting || isSelfReferral} 
          className="mt-3 w-full rounded-xl bg-linear-to-r from-brand-500 to-brand-600 font-bold text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 hover:scale-[1.01] active:scale-100 transition-all duration-300 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="h-4 w-4 mr-2" />
          {submitting ? "Submitting Enquiry..." : isSelfReferral ? "Self-Referral Disabled" : "Send Message Now"}
        </Button>
      </form>
    </div>
  );
}
