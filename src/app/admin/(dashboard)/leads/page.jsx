import { createAdminClient } from "@/lib/supabase/server";
import LeadsTable from "@/components/admin/LeadsTable";
import { Users2, Sparkles, MessageSquare, CheckCircle, Clock } from "lucide-react";

export const metadata = {
  title: "Customer Leads",
};

export default async function AdminLeadsPage() {
  const supabase = createAdminClient();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*, properties(title)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const allCount = leads?.length || 0;
  const newCount = leads?.filter((l) => l.status === "new").length || 0;
  const contactedCount = leads?.filter((l) => l.status === "contacted").length || 0;
  const closedCount = leads?.filter((l) => l.status === "closed").length || 0;

  return (
    <div className="relative flex flex-col gap-8 pb-10">
      {/* Background Ambient Glow Blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-emerald-500/10 opacity-60 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-1/3 h-[450px] w-[450px] rounded-full bg-brand-500/10 opacity-50 blur-[120px]" />

      {/* Header Workspace Banner */}
      <div className="relative overflow-hidden flex flex-col gap-4 rounded-3xl border border-white/15 bg-linear-to-r from-slate-900/90 via-slate-950/80 to-slate-900/90 p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Customer Inquiry Desk
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Customer Inquiries & Leads
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
            <span className="inline-flex items-center gap-1 text-slate-300">
              <Users2 className="h-3.5 w-3.5 text-brand-400" />
              {allCount} Total Inquiries
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              {newCount} New
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
              <Clock className="h-3.5 w-3.5" />
              {contactedCount} In Progress
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-purple-400 font-semibold">
              <CheckCircle className="h-3.5 w-3.5" />
              {closedCount} Closed
            </span>
          </div>
        </div>
      </div>

      <LeadsTable leads={leads || []} />
    </div>
  );
}
