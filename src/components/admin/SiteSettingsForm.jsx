"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Share2, Save, Sparkles } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { updateSiteSettings } from "@/lib/actions/siteSettings.actions";

export default function SiteSettingsForm({ settings }) {
  const router = useRouter();
  const [form, setForm] = useState({
    whatsapp_number: settings?.whatsapp_number || "",
    email: settings?.email || "",
    instagram_handle: settings?.instagram_handle || "",
    facebook_url: settings?.facebook_url || "",
    youtube_url: settings?.youtube_url || "",
    twitter_url: settings?.twitter_url || "",
    city: settings?.city || "",
    state: settings?.state || "",
    address_line: settings?.address_line || "",
  });
  const [isPending, startTransition] = useTransition();

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateSiteSettings(form);
        toast.success("Contact details updated successfully!");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to update contact details");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8 max-w-5xl min-w-0">
      {/* Contact Details Card */}
      <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-2xl shadow-xl transition-all hover:border-brand-500/30">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
            <Phone className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold text-white truncate">Contact &amp; Location Info</h2>
            <p className="text-xs text-slate-400 truncate">Header, Footer &amp; Contact page details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="WhatsApp Contact Number"
            placeholder="91XXXXXXXXXX"
            value={form.whatsapp_number}
            onChange={(e) => setField("whatsapp_number", e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            label="Public Email Address"
            type="email"
            placeholder="support@apniproperty.in"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            label="City"
            placeholder="Gorakhpur"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            label="State"
            placeholder="Uttar Pradesh"
            value={form.state}
            onChange={(e) => setField("state", e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
        </div>

        <Input
          label="Office Address Line"
          placeholder="Shop / Office no., Landmark, Street, Area"
          value={form.address_line}
          onChange={(e) => setField("address_line", e.target.value)}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
        />
      </section>

      {/* Social Coordinates Card */}
      <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-2xl shadow-xl transition-all hover:border-brand-500/30">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
            <Share2 className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold text-white truncate">Social Media Profiles</h2>
            <p className="text-xs text-slate-400 truncate">Social icon links in footer &amp; navbar</p>
          </div>
        </div>

        <Input
          label="Instagram Username / Handle"
          placeholder="apni.property1"
          value={form.instagram_handle}
          onChange={(e) => setField("instagram_handle", e.target.value)}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Facebook Page URL (optional)"
            placeholder="https://facebook.com/apniproperty"
            value={form.facebook_url}
            onChange={(e) => setField("facebook_url", e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            label="YouTube Channel URL (optional)"
            placeholder="https://youtube.com/@apniproperty"
            value={form.youtube_url}
            onChange={(e) => setField("youtube_url", e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
        </div>

        <Input
          label="Twitter / X Profile URL (optional)"
          placeholder="https://x.com/apniproperty"
          value={form.twitter_url}
          onChange={(e) => setField("twitter_url", e.target.value)}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
        />
      </section>

      <Button
        type="submit"
        size="md"
        className="w-full sm:w-auto self-start rounded-2xl font-bold bg-linear-to-r from-brand-500 via-brand-600 to-accent-500 shadow-lg shadow-brand-500/25 px-8 py-3 text-xs sm:text-sm"
        disabled={isPending}
      >
        <Save className="h-4 w-4 mr-2" />
        {isPending ? "Saving Details…" : "Save Site Details"}
      </Button>
    </form>
  );
}
