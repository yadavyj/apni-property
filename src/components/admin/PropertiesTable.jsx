"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Search, ImageOff, ExternalLink, MapPin, Tag, LayoutGrid, ListFilter, Star } from "lucide-react";
import {
  togglePropertyStatus,
  toggleFeatured,
  deleteProperty,
} from "@/lib/actions/property.actions";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_STATUSES,
  categoryLabel,
} from "@/lib/constants";
import { formatCompactCurrency } from "@/lib/format";
import { getCoverMedia } from "@/lib/media";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Switch from "@/components/ui/Switch";
import EmptyState from "@/components/common/EmptyState";

const STATUS_TONE = {
  draft: "neutral",
  published: "success",
  sold: "accent",
  archived: "danger",
};

const CATEGORY_STYLES = {
  plot: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  house: "bg-brand-500/10 text-brand-300 border-brand-500/30",
  flat: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  commercial: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  agricultural: "bg-teal-500/10 text-teal-400 border-teal-500/30",
};

export default function PropertiesTable({ properties = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // "list" by default | "grid"
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return properties.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (status !== "all" && p.status !== status) return false;
      if (
        q &&
        !`${p.title} ${p.location_area} ${p.location_city}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [properties, search, category, status]);

  function handleStatusChange(id, newStatus) {
    startTransition(async () => {
      try {
        await togglePropertyStatus(id, newStatus);
        toast.success("Property status updated");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to update status");
      }
    });
  }

  function handleFeaturedToggle(id, value) {
    startTransition(async () => {
      try {
        await toggleFeatured(id, value);
        toast.success(value ? "Marked as Featured" : "Removed from Featured");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to update featured status");
      }
    });
  }

  function handleDelete(id, title) {
    if (
      !window.confirm(
        `Delete "${title}"? This will permanently remove all photos and details. This cannot be undone.`
      )
    )
      return;

    startTransition(async () => {
      try {
        await deleteProperty(id);
        toast.success("Property deleted");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to delete property");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-xl">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search by title or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
            />
          </div>

          <div className="w-full sm:w-44">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-950/60 border-white/10 text-white rounded-2xl text-xs sm:text-sm"
            >
              <option value="all" className="bg-slate-950">All Categories</option>
              {PROPERTY_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-slate-950">
                  {c.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full sm:w-44">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-950/60 border-white/10 text-white rounded-2xl text-xs sm:text-sm"
            >
              <option value="all" className="bg-slate-950">All Statuses</option>
              {PROPERTY_STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="bg-slate-950">
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Grid vs List View Mode Toggle */}
        <div className="flex items-center gap-1 self-end sm:self-center bg-slate-950/60 p-1.5 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            List
          </button>
        </div>
      </div>

      {/* Properties Display */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl">
          <EmptyState
            icon={Search}
            title="No properties found"
            description="Try adjusting your search criteria or category filters."
          />
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW LAYOUT */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => {
            const cover = getCoverMedia(property);
            const categoryBadgeStyle = CATEGORY_STYLES[property.category] || "bg-white/5 text-slate-300 border-white/10";

            return (
              <div
                key={property.id}
                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-brand-500/40 hover:-translate-y-1 group"
              >
                <div>
                  {/* Aspect Video Image Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-white/10">
                    {cover?.secure_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.secure_url}
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-600">
                        <ImageOff className="h-8 w-8" />
                      </div>
                    )}

                    {/* Top Badges Overlay */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-md ${categoryBadgeStyle}`}>
                        <Tag className="h-3 w-3" />
                        {categoryLabel(property.category)}
                      </span>
                      <Badge tone={STATUS_TONE[property.status] || "neutral"}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Property Info Content */}
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="font-display text-base font-bold text-white hover:text-brand-300 transition-colors line-clamp-1"
                      >
                        {property.title}
                      </Link>
                      <p className="flex items-center gap-1 text-xs text-slate-400 line-clamp-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        {property.location_area}, {property.location_city}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">Total Price</span>
                        <p className="text-lg font-black text-brand-300">
                          {formatCompactCurrency(property.total_price)}
                        </p>
                      </div>

                      <Switch
                        id={`featured-grid-${property.id}`}
                        checked={property.is_featured}
                        onChange={(value) => handleFeaturedToggle(property.id, value)}
                        label="Featured"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between border-t border-white/10 bg-slate-950/50 px-5 py-3.5">
                  <div className="w-36">
                    <Select
                      value={property.status}
                      onChange={(e) => handleStatusChange(property.id, e.target.value)}
                      className="h-8 text-xs bg-slate-900 border-white/10 text-white rounded-xl"
                    >
                      {PROPERTY_STATUSES.map((s) => (
                        <option key={s.value} value={s.value} className="bg-slate-950 text-white">
                          {s.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {property.slug && (
                      <Link
                        href={`/properties/${property.slug}`}
                        target="_blank"
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-sm"
                        title="Preview on Website"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-2 text-brand-300 hover:bg-brand-500/20 hover:text-white transition-all shadow-sm"
                      title="Edit Property"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(property.id, property.title)}
                      className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-all shadow-sm cursor-pointer"
                      title="Delete Property"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW LAYOUT */
        <div className="flex flex-col gap-3">
          {filtered.map((property) => {
            const cover = getCoverMedia(property);
            const categoryBadgeStyle = CATEGORY_STYLES[property.category] || "bg-white/5 text-slate-300 border-white/10";

            return (
              <div
                key={property.id}
                className="flex flex-row items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3 sm:p-4 shadow-lg backdrop-blur-2xl transition-all duration-300 hover:border-brand-500/30"
              >
                {/* Compact Thumbnail (64px on mobile, 100px on desktop) */}
                <div className="relative h-16 w-16 sm:h-20 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-slate-950 border border-white/10 group">
                  {cover?.secure_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover.secure_url}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                      <ImageOff className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Details Column */}
                <div className="min-w-0 flex-1 flex flex-col gap-0.5 sm:gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="truncate font-display text-sm sm:text-base font-bold text-white hover:text-brand-300 transition-colors"
                    >
                      {property.title}
                    </Link>
                    <Badge tone={STATUS_TONE[property.status] || "neutral"}>
                      {property.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 truncate">
                    <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryBadgeStyle}`}>
                      <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {categoryLabel(property.category)}
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-slate-300 truncate">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      {property.location_area}, {property.location_city}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-black text-brand-300 mt-0.5">
                    {formatCompactCurrency(property.total_price)}
                  </p>
                </div>

                {/* Desktop Status & Switcher Controls */}
                <div className="hidden lg:flex items-center gap-3 shrink-0">
                  <Switch
                    id={`featured-list-${property.id}`}
                    checked={property.is_featured}
                    onChange={(value) => handleFeaturedToggle(property.id, value)}
                    label="Featured"
                  />
                  <div className="w-32">
                    <Select
                      value={property.status}
                      onChange={(e) => handleStatusChange(property.id, e.target.value)}
                      className="h-8 text-xs bg-slate-950/60 border-white/10 text-white rounded-xl"
                    >
                      {PROPERTY_STATUSES.map((s) => (
                        <option key={s.value} value={s.value} className="bg-slate-950 text-white">
                          {s.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Quick Action Icons */}
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                  {property.slug && (
                    <Link
                      href={`/properties/${property.slug}`}
                      target="_blank"
                      className="rounded-xl border border-white/10 bg-white/5 p-1.5 sm:p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-sm"
                      title="Preview on Website"
                    >
                      <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-1.5 sm:p-2 text-brand-300 hover:bg-brand-500/20 hover:text-white transition-all shadow-sm"
                    title="Edit Property"
                  >
                    <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(property.id, property.title)}
                    className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-1.5 sm:p-2 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition-all shadow-sm cursor-pointer"
                    title="Delete Property"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
