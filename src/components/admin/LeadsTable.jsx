"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone, Mail, ChevronDown, ChevronUp, Users2, Search, Building2, ExternalLink, Trash2 } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/lib/actions/lead.actions";
import { LEAD_STATUSES } from "@/lib/constants";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/common/EmptyState";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";

const STATUS_TONE = {
  new: "brand",
  contacted: "warning",
  closed: "success",
};

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LeadRow({ lead }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const message = lead.message || "";
  const isLong = message.length > 120;
  const displayMessage = expanded || !isLong ? message : `${message.slice(0, 120)}…`;

  function handleStatusChange(newStatus) {
    startTransition(async () => {
      try {
        await updateLeadStatus(lead.id, newStatus);
        toast.success("Lead status updated");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to update lead status");
      }
    });
  }

  function handleDeleteLead() {
    if (!window.confirm(`Delete lead entry for "${lead.name}"? This action cannot be undone.`)) return;

    startTransition(async () => {
      try {
        await deleteLead(lead.id);
        toast.success("Lead entry deleted");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to delete lead");
      }
    });
  }

  const rawPhone = (lead.phone || "").replace(/\D/g, "");

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-emerald-500/30 min-w-0">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="font-display text-base sm:text-lg font-bold text-white truncate max-w-[200px] sm:max-w-none">{lead.name}</span>
          <Badge tone={STATUS_TONE[lead.status] || "neutral"}>{lead.status}</Badge>
          <span className="text-[11px] sm:text-xs text-slate-400 font-mono">· {formatDate(lead.created_at)}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:w-44">
            <Select
              value={lead.status}
              disabled={isPending}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-9 text-xs bg-slate-950/60 border-white/10 text-white rounded-xl"
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="bg-slate-950 text-white">
                  {s.label}
                </option>
              ))}
            </Select>
          </div>

          <button
            type="button"
            onClick={handleDeleteLead}
            disabled={isPending}
            className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-all shadow-sm cursor-pointer disabled:opacity-30 shrink-0"
            title="Delete Lead"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Details & Actions Grid */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Phone, Email, & Property Info Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <a
              href={`tel:${lead.phone}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-slate-200 hover:bg-white/10 hover:text-white transition-all text-xs"
            >
              <Phone className="h-3.5 w-3.5 text-brand-400 shrink-0" />
              {lead.phone}
            </a>

            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-slate-200 hover:bg-white/10 hover:text-white transition-all text-xs truncate max-w-[200px]"
              >
                <Mail className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                <span className="truncate">{lead.email}</span>
              </a>
            )}

            {lead.properties?.title && (
              <Link
                href={`/admin/properties/${lead.property_id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-brand-500/30 bg-brand-500/10 px-2.5 py-1.5 font-semibold text-brand-300 hover:bg-brand-500/20 transition-all text-xs truncate max-w-[220px]"
              >
                <Building2 className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                <span className="truncate">Re: {lead.properties.title}</span>
              </Link>
            )}
          </div>

          {/* Customer Message text */}
          {message && (
            <div className="mt-1 rounded-2xl border border-white/5 bg-slate-950/40 p-3 sm:p-3.5 text-slate-200">
              <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm font-light break-words">{displayMessage}</p>
              {isLong && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
                >
                  {expanded ? (
                    <>
                      Show less <ChevronUp className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Instant Action CTA Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
          <a
            href={`https://wa.me/91${rawPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-500/60 shadow-md transition-all"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
            WhatsApp
          </a>

          <a
            href={`tel:${lead.phone}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-all shadow-md"
          >
            <Phone className="h-3.5 w-3.5 text-brand-400" />
            Call
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LeadsTable({ leads = [] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (
        q &&
        !`${l.name} ${l.phone} ${l.email || ""} ${l.message || ""}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [leads, search, status]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      {/* Search & Status Filter Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-xl">
        <div className="relative flex-1">
          <Input
            placeholder="Search by customer name, phone, email, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-emerald-500 text-xs sm:text-sm"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl text-xs sm:text-sm"
          >
            <option value="all" className="bg-slate-950 text-white">All Inquiries</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value} className="bg-slate-950 text-white">
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Leads List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl">
          <EmptyState
            icon={Users2}
            title="No customer leads found"
            description="Adjust your search query or status filters to view inquiries."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
