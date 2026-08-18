import Link from "next/link";
import { Plus, Building2, Sparkles, CheckCircle2, FileEdit } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import PropertiesTable from "@/components/admin/PropertiesTable";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Properties Repository",
};

export default async function AdminPropertiesPage() {
  const supabase = createAdminClient();

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*, property_media!property_media_property_id_fkey(*)")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const allCount = properties?.length || 0;
  const publishedCount = properties?.filter((p) => p.status === "published").length || 0;
  const draftCount = properties?.filter((p) => p.status === "draft").length || 0;

  return (
    <div className="relative flex flex-col gap-6 sm:gap-8 pb-10 min-w-0">
      {/* Background Ambient Glow Blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-brand-500/10 opacity-60 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-1/3 h-[450px] w-[450px] rounded-full bg-emerald-500/10 opacity-50 blur-[120px]" />

      {/* Header Workspace Banner */}
      <div className="relative overflow-hidden flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/15 bg-linear-to-r from-slate-900/90 via-slate-950/80 to-slate-900/90 p-4 sm:p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col gap-1.5 z-10 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-300">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              Property Inventory Repository
            </span>
          </div>
          <h1 className="font-display text-xl sm:text-3xl font-black text-white tracking-tight">
            Properties Management
          </h1>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-slate-300 font-medium">
            <span className="inline-flex items-center gap-1 text-slate-300">
              <Building2 className="h-3.5 w-3.5 text-brand-400" />
              {allCount} Total Listings
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {publishedCount} Active Live
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
              <FileEdit className="h-3.5 w-3.5" />
              {draftCount} Drafts
            </span>
          </div>
        </div>

        <Button
          href="/admin/properties/new"
          size="md"
          className="rounded-2xl font-bold bg-linear-to-r from-brand-500 via-brand-600 to-accent-500 shadow-lg shadow-brand-500/25 shrink-0 z-10 self-start sm:self-auto py-2.5 px-5 text-xs sm:text-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Property
        </Button>
      </div>

      <PropertiesTable properties={properties || []} />
    </div>
  );
}
