"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { ChevronDown, ChevronUp, ImageOff, Plus, Trash2, UploadCloud, CheckCircle, Sparkles, Layers } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import {
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
  reorderHomeBanners,
} from "@/lib/actions/homeBanner.actions";

function emptyBanner(sortOrder) {
  return {
    id: null,
    image_public_id: null,
    image_url: null,
    eyebrow_text: "Trusted Real Estate Partner",
    heading: "Find Verified Plots & Land Without the Guesswork",
    subheading: "Registry-ready plots, homes and commercial spaces with transparent pricing.",
    cta_label: "Browse Properties",
    cta_href: "/properties",
    is_active: true,
    sort_order: sortOrder,
  };
}

function BannerCard({ banner, index, total, onMove }) {
  const router = useRouter();
  const [form, setForm] = useState(banner);
  const [isPending, startTransition] = useTransition();

  const isNew = !banner.id;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleUploadSuccess(result) {
    const info = result?.info;
    if (!info) return;

    const imagePublicId = info.public_id || null;
    const imageUrl = info.secure_url || info.url || null;

    setForm((f) => ({
      ...f,
      image_public_id: imagePublicId,
      image_url: imageUrl,
    }));
    toast.success("Image uploaded successfully!");
  }

  function handleSave() {
    startTransition(async () => {
      try {
        if (isNew) {
          await createHomeBanner(form);
          toast.success("Banner created successfully!");
        } else {
          await updateHomeBanner(banner.id, form);
          toast.success("Banner updated successfully!");
        }
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to save banner");
      }
    });
  }

  function handleDelete() {
    if (!banner.id) return;
    if (!window.confirm("Delete this banner slide? This action cannot be undone.")) return;

    startTransition(async () => {
      try {
        await deleteHomeBanner(banner.id);
        toast.success("Banner deleted");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to delete banner");
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 lg:grid-cols-[280px_1fr] shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-brand-500/30">
      {/* Left Column: Image Preview & Actions */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">
            Slide #{index + 1}
          </span>
          {form.is_active ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              <CheckCircle className="h-3 w-3" /> Live Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
              Hidden
            </span>
          )}
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-inner group">
          {form.image_public_id ? (
            <CldImage
              src={form.image_public_id}
              alt="Banner slide preview"
              fill
              sizes="300px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : form.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.image_url}
              alt="Banner slide preview"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-slate-500 p-4 text-center">
              <ImageOff className="h-7 w-7 text-slate-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">No Image Uploaded</span>
              <span className="text-[9px] text-slate-500">Default fallback slide image will display on mobile/desktop</span>
            </div>
          )}
        </div>

        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          options={{ folder: "apni-property/home-banners", multiple: false, sources: ["local", "camera"] }}
          onSuccess={handleUploadSuccess}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => open()}
              className="w-full justify-center border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl"
            >
              <UploadCloud className="h-4 w-4 mr-1.5 text-brand-400" />
              {form.image_url ? "Replace Slide Photo" : "Upload Slide Photo"}
            </Button>
          )}
        </CldUploadWidget>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={index === 0 || isPending || isNew}
              onClick={() => onMove(index, -1)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 disabled:opacity-30 transition-colors"
              aria-label="Move up"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={index === total - 1 || isPending || isNew}
              onClick={() => onMove(index, 1)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 disabled:opacity-30 transition-colors"
              aria-label="Move down"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {!isNew && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer disabled:opacity-30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Form Fields */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-400" /> Slide Details &amp; Actions
          </span>
          <Switch
            id={`active-${index}`}
            checked={form.is_active}
            onChange={(checked) => setField("is_active", checked)}
            label={form.is_active ? "Active Slide" : "Hidden"}
          />
        </div>

        <Input
          label="Eyebrow Tag (small text badge above headline)"
          placeholder="Trusted Real Estate Partner"
          value={form.eyebrow_text || ""}
          onChange={(e) => setField("eyebrow_text", e.target.value)}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
        />

        <Input
          label="Headline Title"
          placeholder="Find Verified Plots & Land Without the Guesswork"
          value={form.heading || ""}
          onChange={(e) => setField("heading", e.target.value)}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 font-bold text-xs sm:text-sm"
        />

        <Textarea
          label="Subheading Description"
          placeholder="Registry-ready plots, homes and commercial spaces with transparent pricing..."
          rows={2}
          value={form.subheading || ""}
          onChange={(e) => setField("subheading", e.target.value)}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Button Label (optional)"
            placeholder="Properties"
            value={form.cta_label || ""}
            onChange={(e) => setField("cta_label", e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl text-xs sm:text-sm"
          />
          <Input
            label="Button Link (optional)"
            placeholder="/properties"
            value={form.cta_href || ""}
            onChange={(e) => setField("cta_href", e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl font-mono text-xs"
          />
        </div>

        <Button
          type="button"
          size="md"
          className="mt-2 self-start rounded-2xl font-bold bg-linear-to-r from-brand-500 via-brand-600 to-accent-500 shadow-lg shadow-brand-500/25 px-6 py-2.5"
          disabled={isPending}
          onClick={handleSave}
        >
          {isPending ? "Saving…" : isNew ? "Create Slide" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default function HomeBannersManager({ banners = [] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
  const [, startTransition] = useTransition();

  const allBanners = [...banners, ...drafts];

  function handleAddBanner() {
    setDrafts((d) => [...d, emptyBanner(allBanners.length)]);
  }

  function handleMove(index, direction) {
    const saved = banners;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= saved.length) return;

    const next = [...saved];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];

    startTransition(async () => {
      try {
        await reorderHomeBanners(next.map((b) => b.id));
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to reorder banners");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {allBanners.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/30 p-8 text-center text-sm text-slate-400 flex flex-col items-center gap-3">
          <Sparkles className="h-8 w-8 text-brand-400" />
          <p className="font-semibold text-white">No custom hero slides created yet.</p>
          <p className="max-w-md text-xs text-slate-400">
            Click the button below to add your first slideshow banner image with custom titles and buttons.
          </p>
        </div>
      )}

      {allBanners.map((banner, index) => (
        <BannerCard
          key={banner.id || `draft-${index}`}
          banner={banner}
          index={index}
          total={allBanners.length}
          onMove={handleMove}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        className="self-start rounded-2xl border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 shadow-md"
        onClick={handleAddBanner}
      >
        <Plus className="h-4 w-4 mr-2 text-brand-400" />
        Add New Slide Banner
      </Button>
    </div>
  );
}
