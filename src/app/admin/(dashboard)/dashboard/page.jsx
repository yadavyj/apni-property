import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  FileEdit,
  Users2,
  ArrowRight,
  Plus,
  ExternalLink,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Clock,
  HomeIcon,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import StatCard from "@/components/admin/StatCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/common/EmptyState";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { categoryLabel } from "@/lib/constants";
import { formatCompactCurrency } from "@/lib/format";

export const metadata = {
  title: "Dashboard Overview",
};

const LEAD_STATUS_TONE = {
  new: "brand",
  contacted: "warning",
  closed: "success",
};

const PROPERTY_STATUS_TONE = {
  draft: "neutral",
  published: "success",
  sold: "accent",
  archived: "danger",
};

const CATEGORY_COLORS = {
  plot: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  house: "bg-brand-500/10 text-brand-300 border-brand-500/30",
  flat: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  commercial: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  agricultural: "bg-teal-500/10 text-teal-400 border-teal-500/30",
};

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  // eslint-disable-next-line react-hooks/purity -- server-only data fetch
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalCount },
    { count: publishedCount },
    { count: draftCount },
    { count: recentLeadsCount },
    { data: recentLeads },
    { data: recentProperties },
    { data: totalValueData },
  ] = await Promise.all([
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("leads")
      .select("id, name, phone, status, created_at, message")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("properties")
      .select("id, title, status, category, total_price, updated_at")
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("properties")
      .select("total_price")
      .eq("status", "published"),
  ]);

  const aggregateTotalValue = (totalValueData || []).reduce(
    (sum, p) => sum + Number(p.total_price || 0),
    0
  );

  return (
    <div className="relative flex flex-col gap-6 sm:gap-8 pb-10 min-w-0">
      {/* Background Ambient Glow Blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-purple-500/10 opacity-40 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/2 h-[400px] w-[400px] rounded-full bg-pink-500/10 opacity-30 blur-[120px]" />

      {/* Top Welcome & Quick Actions Bar */}
      <div className="relative overflow-hidden flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-purple-500/20 bg-gradient-to-r from-slate-900/80 via-slate-950/90 to-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col gap-2 z-10 min-w-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-400">
              ● Live Workspace
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light leading-snug">
            Real-time telemetry, listing metrics, and customer lead inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 z-10 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-800/60 hover:border-slate-600/50 hover:text-white transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            Website
          </Link>
          <Link
            href="/admin/home"
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/15 px-4 py-2.5 text-xs sm:text-sm font-semibold text-purple-300 hover:bg-purple-500/25 hover:border-purple-500/50 transition-all"
          >
            <HomeIcon className="h-4 w-4" />
            Banners
          </Link>
          <Button href="/admin/properties/new" size="sm" className="rounded-lg font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-xs sm:text-sm py-2.5 px-4 hover:from-purple-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Main KPI Stat Cards (4 columns on desktop, 2 on tablet, 1 on mobile) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={Building2} label="Total Properties" value={totalCount ?? 0} tone="brand" />
        <StatCard
          icon={CheckCircle2}
          label="Active Listings"
          value={publishedCount ?? 0}
          tone="emerald"
        />
        <StatCard icon={FileEdit} label="Pending Drafts" value={draftCount ?? 0} tone="amber" />
        <StatCard
          icon={Users2}
          label="Leads (7 Days)"
          value={recentLeadsCount ?? 0}
          tone="rose"
        />
      </div>

      {/* Active Portfolio Valuation Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/60 via-slate-900/80 to-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 -mt-12 -mr-12 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/20 text-purple-300 shrink-0">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-300">
                  Active Portfolio Valuation
                </span>
                <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-[11px] font-bold text-green-400 border border-green-500/30">
                  Live
                </span>
              </div>
              <p className="font-display text-2xl sm:text-4xl font-black text-white mt-1 truncate">
                {formatCompactCurrency(aggregateTotalValue)}
              </p>
            </div>
          </div>
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/20 px-4 py-2.5 text-xs sm:text-sm font-bold text-purple-200 hover:bg-purple-500/30 hover:border-purple-500/60 transition-all self-start sm:self-auto shadow-md"
          >
            Manage Active Inventory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Leads & Recent Listings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Customer Enquiries */}
        <section className="flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-emerald-500/40 hover:bg-slate-900/60">
          <div>
            <div className="mb-5 flex items-center justify-between border-b border-slate-800/50 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <Users2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-sm sm:text-base font-bold text-white truncate">Recent Enquiries</h2>
                  <p className="text-xs text-slate-400 truncate">Form &amp; WhatsApp Messages</p>
                </div>
              </div>
              <Link
                href="/admin/leads"
                className="group flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {recentLeads?.length ? (
              <ul className="flex flex-col divide-y divide-slate-800/40">
                {recentLeads.map((lead) => (
                  <li key={lead.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="truncate text-xs sm:text-sm font-bold text-white">{lead.name}</p>
                        <Badge tone={LEAD_STATUS_TONE[lead.status] || "neutral"}>
                          {lead.status}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-slate-400 mt-0.5 font-mono">{lead.phone}</p>
                    </div>

                    <a
                      href={`https://wa.me/91${lead.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 px-2.5 items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 hover:border-emerald-500/60 transition-all shrink-0 shadow-sm"
                    >
                      <WhatsAppIcon className="h-4 w-4 fill-current" />
                      Chat
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={Users2} title="No leads yet" description="New customer enquiries will show up here." />
            )}
          </div>
        </section>

        {/* Recently Updated Properties */}
        <section className="flex flex-col justify-between rounded-2xl border border-purple-500/20 bg-slate-900/50 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-purple-500/40 hover:bg-slate-900/60">
          <div>
            <div className="mb-5 flex items-center justify-between border-b border-slate-800/50 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-sm sm:text-base font-bold text-white truncate">Recently Updated</h2>
                  <p className="text-xs text-slate-400 truncate">Listings &amp; Quick Edits</p>
                </div>
              </div>
              <Link
                href="/admin/properties"
                className="group flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors shrink-0"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {recentProperties?.length ? (
              <ul className="flex flex-col divide-y divide-slate-800/40">
                {recentProperties.map((property) => (
                  <li key={property.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="truncate text-xs sm:text-sm font-bold text-white hover:text-purple-300 transition-colors block"
                      >
                        {property.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${CATEGORY_COLORS[property.category] || "bg-white/5 text-slate-300 border-white/10"}`}>
                          {categoryLabel(property.category)}
                        </span>
                        <span className="font-bold text-purple-300 text-xs">
                          {formatCompactCurrency(property.total_price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge tone={PROPERTY_STATUS_TONE[property.status] || "neutral"}>
                        {property.status}
                      </Badge>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="inline-flex h-8 px-2.5 items-center rounded-lg border border-slate-700/50 bg-slate-800/40 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 hover:border-slate-600/50 hover:text-white transition-all"
                      >
                        Edit
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={Building2} title="No properties yet" description="Add your first listing to get started." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
