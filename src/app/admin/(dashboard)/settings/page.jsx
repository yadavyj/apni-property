import { Settings2, UserCog, Sliders, Sparkles } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import AdminAccountForm from "@/components/admin/AdminAccountForm";
import { getRawSiteSettings } from "@/lib/queries/siteSettings";

export const metadata = {
  title: "System Settings",
};

export default async function AdminSettingsPage() {
  const settings = await getRawSiteSettings();

  const tabs = [
    {
      key: "site",
      label: "Site Contact",
      icon: <Settings2 className="h-4 w-4 text-brand-400" />,
      description: "Manage phone numbers, WhatsApp, city coordinates, and social media handles displayed on the website.",
      content: <SiteSettingsForm settings={settings} />,
    },
    {
      key: "account",
      label: "Password & Security",
      icon: <UserCog className="h-4 w-4 text-rose-400" />,
      description: "Update password credentials and security settings for this admin portal.",
      content: <AdminAccountForm />,
    },
  ];

  return (
    <div className="relative flex flex-col gap-8 pb-10">
      {/* Background Ambient Glow Blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-brand-500/10 opacity-60 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-1/3 h-[450px] w-[450px] rounded-full bg-purple-500/10 opacity-50 blur-[120px]" />

      {/* Header Workspace Banner */}
      <div className="relative overflow-hidden flex flex-col gap-2 rounded-3xl border border-white/15 bg-linear-to-r from-slate-900/90 via-slate-950/80 to-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-purple-300">
            <Sliders className="h-3.5 w-3.5 text-purple-400" />
            System Coordinates &amp; Credentials
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
          System Settings
        </h1>
        <p className="max-w-3xl text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          Configure site-wide contact info, social links, location defaults, and update admin security credentials.
        </p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
