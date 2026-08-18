"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Star,
  ImageOff,
  MapPin,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Switch from "@/components/ui/Switch";
import { toggleFeatured } from "@/lib/actions/property.actions";
import { categoryLabel } from "@/lib/constants";
import { formatCompactCurrency } from "@/lib/format";
import { getCoverMedia } from "@/lib/media";
import { cn } from "@/lib/cn";

const VIEWS = [
  { value: "all", label: "All Listings" },
  { value: "featured", label: "Featured" },
  { value: "not_featured", label: "Not Featured" },
];

function PropertyRow({ property }) {
  const router = useRouter();
  const [isFeatured, setIsFeatured] = useState(property.is_featured);
  const [isPending, startTransition] = useTransition();

  const cover = getCoverMedia(property);
  // A featured draft/sold listing silently never reaches the homepage, so
  // flag it here rather than letting the admin wonder why nothing changed.
  const hiddenFromHome = isFeatured && property.status !== "published";

  function handleToggle(next) {
    const previous = isFeatured;
    setIsFeatured(next);

    startTransition(async () => {
      try {
        await toggleFeatured(property.id, next);
        toast.success(
          next ? `"${property.title}" added to homepage` : `"${property.title}" removed from homepage`
        );
        router.refresh();
      } catch (err) {
        setIsFeatured(previous);
        toast.error(err.message || "Failed to update featured status");
      }
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl border p-3.5 sm:p-4 backdrop-blur-2xl shadow-lg transition-all duration-300 sm:flex-row sm:items-center sm:gap-4 min-w-0",
        isFeatured
          ? "border-brand-500/40 bg-linear-to-r from-brand-500/10 via-slate-900/60 to-slate-900/60"
          : "border-white/10 bg-slate-900/50 hover:border-white/20"
      )}
    >
      {/* Cover thumbnail */}
      <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 sm:h-16 sm:w-24">
        {cover?.secure_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.secure_url} alt={property.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-600">
            <ImageOff className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            {categoryLabel(property.category)}
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              property.status === "published"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
            )}
          >
            {property.status}
          </span>
        </div>

        <Link
          href={`/admin/properties/${property.id}/edit`}
          className="group inline-flex items-center gap-1.5 text-sm font-bold text-white transition-colors hover:text-brand-300"
        >
          <span className="truncate">{property.title}</span>
          <ExternalLink className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 text-brand-400" />
            {property.location_area}
          </span>
          <span className="font-bold text-brand-300">
            {formatCompactCurrency(property.total_price)}
          </span>
        </div>

        {hiddenFromHome && (
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            Featured, but won&apos;t show on the homepage until status is Published.
          </p>
        )}
      </div>

      {/* Toggle */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 pt-3 sm:border-t-0 sm:pt-0">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors",
            isFeatured ? "text-brand-300" : "text-slate-500"
          )}
        >
          <Star className={cn("h-3.5 w-3.5", isFeatured && "fill-brand-400 text-brand-400")} />
          {isFeatured ? "On Homepage" : "Hidden"}
        </span>
        <Switch
          id={`featured-${property.id}`}
          checked={isFeatured}
          onChange={handleToggle}
          disabled={isPending}
        />
      </div>
    </div>
  );
}

export default function HomeFeaturedManager({ properties = [] }) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");

  const featuredCount = properties.filter((p) => p.is_featured).length;
  const liveCount = properties.filter((p) => p.is_featured && p.status === "published").length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return properties.filter((p) => {
      if (view === "featured" && !p.is_featured) return false;
      if (view === "not_featured" && p.is_featured) return false;
      if (!q) return true;
      return (
        p.title?.toLowerCase().includes(q) ||
        p.location_area?.toLowerCase().includes(q) ||
        p.location_city?.toLowerCase().includes(q)
      );
    });
  }, [properties, search, view]);

  return (
    <div className="flex flex-col gap-5 min-w-0">
      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-2xl shadow-lg">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-bold text-brand-300">
          <Sparkles className="h-3.5 w-3.5" />
          {featuredCount} Selected
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300">
          <Star className="h-3.5 w-3.5 fill-emerald-400" />
          {liveCount} Live on Homepage
        </span>
        {featuredCount > liveCount && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            {featuredCount - liveCount} featured listing
            {featuredCount - liveCount === 1 ? "" : "s"} not published yet
          </span>
        )}
      </div>

      {/* Search + view filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, area or city…"
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl pl-10 focus:border-brand-500 text-xs sm:text-sm"
          />
        </div>

        <div className="flex shrink-0 gap-1.5 rounded-2xl border border-white/10 bg-slate-950/60 p-1">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setView(v.value)}
              className={cn(
                "rounded-xl px-3 py-2 text-[11px] font-bold transition-all cursor-pointer",
                view === v.value
                  ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property rows */}
      {filtered.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 bg-slate-900/30 p-10 text-center text-sm text-slate-400">
          {properties.length === 0
            ? "No properties yet — add listings under Properties first."
            : "No listings match this search."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((property) => (
            <PropertyRow key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
