"use client";

import { useMemo, useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { UploadCloud, Trash2, ChevronUp, ChevronDown, Video, ImageOff, Sparkles, Image as ImageIcon, Star, Play, ZoomIn } from "lucide-react";
import { attachMedia, deleteMedia, reorderMedia } from "@/lib/actions/property.actions";
import { getCoverMedia } from "@/lib/media";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function MediaUploader({ propertyId, media = [], coverMediaId }) {
  const router = useRouter();
  const [previewMedia, setPreviewMedia] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && previewMedia) {
        setPreviewMedia(null);
      }
    }
    if (previewMedia) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewMedia]);
  const items = useMemo(
    () => [...media].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [media]
  );
  const resolvedCoverId = useMemo(
    () => getCoverMedia({ property_media: media, cover_media_id: coverMediaId })?.id,
    [media, coverMediaId]
  );
  const [isPending, startTransition] = useTransition();

  if (!propertyId) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-8 text-center backdrop-blur-md">
        <p className="text-sm font-semibold text-slate-400">
          Save the property first to start uploading photos and videos.
        </p>
      </div>
    );
  }

  async function handleSuccess(result) {
    const info = result?.info;
    if (!info) return;

    try {
      await attachMedia(propertyId, {
        public_id: info.public_id,
        secure_url: info.secure_url,
        resource_type: info.resource_type,
        width: info.width,
        height: info.height,
        duration: info.duration,
      });
      toast.success("Media uploaded successfully!");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to save media upload");
    }
  }

  function handleDelete(mediaId) {
    if (!window.confirm("Delete this media item? This cannot be undone.")) return;

    startTransition(async () => {
      try {
        await deleteMedia(mediaId, propertyId);
        toast.success("Media deleted");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to delete media");
      }
    });
  }

  function handleMove(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;

    const next = [...items];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];

    startTransition(async () => {
      try {
        await reorderMedia(
          propertyId,
          next.map((m) => m.id)
        );
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to reorder media");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Zone Trigger Banner */}
      <CldUploadWidget
        signatureEndpoint="/api/cloudinary/sign"
        options={{
          folder: `apni-property/properties/${propertyId}`,
          multiple: true,
          sources: ["local", "camera"],
          resourceType: "auto",
          tags: [propertyId],
        }}
        onSuccess={handleSuccess}
      >
        {({ open }) => (
          <div
            onClick={() => open()}
            className="group relative overflow-hidden flex flex-col items-center justify-center gap-3.5 rounded-3xl border-2 border-dashed border-brand-500/40 bg-linear-to-b from-brand-500/10 via-slate-950/80 to-slate-950/90 p-6 sm:p-10 text-center cursor-pointer transition-all duration-300 hover:border-brand-400 hover:bg-brand-500/15 shadow-xl backdrop-blur-2xl"
          >
            {/* Background Glow */}
            <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-500/20 blur-3xl group-hover:bg-brand-400/30 transition-all" />

            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-500/40 bg-brand-500/20 text-brand-300 shadow-md group-hover:scale-110 group-hover:border-brand-400 transition-all">
              <UploadCloud className="h-7 w-7 text-brand-300" />
            </span>

            <div className="flex flex-col gap-1 max-w-md">
              <h3 className="font-display text-base sm:text-lg font-extrabold text-white flex items-center justify-center gap-1.5">
                Upload Property Photos &amp; Videos
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Click here or tap to select high-resolution property images, site layout maps, or walkthrough videos.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300">
                ⭐ Recommended Ratio: 4:3 (Landscape)
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">
                <ImageIcon className="h-3 w-3 text-brand-400" /> JPG, PNG, WEBP
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">
                <Video className="h-3 w-3 text-purple-400" /> MP4 Video
              </span>
              {items.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-300">
                  {items.length} Item{items.length === 1 ? "" : "s"} Uploaded
                </span>
              )}
            </div>
          </div>
        )}
      </CldUploadWidget>

      {/* Media Grid / Empty State */}
      {items.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-8 text-center backdrop-blur-xl flex flex-col items-center justify-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-500 mb-1">
            <ImageOff className="h-6 w-6" />
          </span>
          <p className="text-sm font-bold text-white">No media uploaded yet</p>
          <p className="text-xs text-slate-400 max-w-sm font-light">
            Upload real property photos and videos above. Listings with clear photos get 4x higher buyer inquiries!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item, index) => {
            const isCover = item.id === resolvedCoverId;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-brand-500/40 hover:-translate-y-1"
              >
                {/* Media Preview Container - Click to Expand */}
                <div
                  onClick={() => setPreviewMedia(item)}
                  className="relative aspect-square w-full overflow-hidden bg-slate-950 border-b border-white/10 cursor-pointer group/preview"
                  title={item.media_type === "video" ? "Click to Play Video" : "Click to View Fullsize Image"}
                >
                  {item.media_type === "video" ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-purple-950/40 text-purple-300 p-2">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-500/25 border border-purple-400/50 shadow-lg group-hover/preview:scale-110 transition-transform">
                        <Play className="h-5 w-5 fill-current text-purple-200 ml-0.5" />
                      </span>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-200">Play Video</span>
                    </div>
                  ) : item.secure_url ? (
                    <>
                      <CldImage
                        src={item.cloudinary_public_id}
                        alt="Property media"
                        fill
                        sizes="300px"
                        className="object-cover transition-transform duration-500 group-hover/preview:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-sm shadow-md">
                          <ZoomIn className="h-4.5 w-4.5" />
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                      <ImageOff className="h-6 w-6" />
                    </div>
                  )}

                  {/* Cover Photo Badge */}
                  {isCover && (
                    <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-md backdrop-blur-md">
                      <Star className="h-3 w-3 fill-current text-slate-950" /> Cover
                    </span>
                  )}
                </div>

                {/* Card Control Bar */}
                <div className="flex items-center justify-between gap-1 bg-slate-950/80 px-2 py-2 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0 || isPending}
                      onClick={() => handleMove(index, -1)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                      title="Move Left / Up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1 || isPending}
                      onClick={() => handleMove(index, 1)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                      title="Move Right / Down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 disabled:opacity-20 transition-all cursor-pointer"
                    title="Delete Media"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ultra-High Z-Index Fullscreen Lightbox Theater Modal (Mounted directly to document.body root) */}
      {mounted && previewMedia && createPortal(
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-between p-4 sm:p-8 bg-slate-950/98 backdrop-blur-3xl overflow-hidden animate-in fade-in duration-200">
          {/* Top Floating Control Bar */}
          <div className="w-full max-w-7xl flex items-center justify-between gap-4 border-b border-white/10 pb-4 shrink-0 z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-brand-300">
                {previewMedia.media_type === "video" ? (
                  <Video className="h-5 w-5 text-purple-300" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-brand-300" />
                )}
              </span>
              <div className="flex flex-col">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {previewMedia.media_type === "video" ? "Property Walkthrough Video" : "High-Resolution Photo Preview"}
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  {previewMedia.width ? `${previewMedia.width} × ${previewMedia.height} px` : "Property Media"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPreviewMedia(null)}
              className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold text-white hover:bg-rose-500 hover:border-rose-500 transition-all cursor-pointer shadow-lg"
            >
              <span>Close</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white font-bold">×</span>
            </button>
          </div>

          {/* Central Media Stage */}
          <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden min-h-0">
            {previewMedia.media_type === "video" ? (
              <video
                src={previewMedia.secure_url}
                controls
                autoPlay
                className="max-h-[82vh] max-w-full rounded-3xl bg-black border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.9)] object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewMedia.secure_url}
                alt="Property high-res preview"
                className="max-h-[82vh] max-w-full object-contain rounded-3xl border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.9)] bg-black"
              />
            )}
          </div>

          {/* Bottom Footer Info */}
          <div className="w-full max-w-7xl flex items-center justify-center gap-2 pt-2 border-t border-white/10 shrink-0 text-xs text-slate-400 font-medium">
            Press <kbd className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-white font-mono text-[11px]">ESC</kbd> or click Close to return to Listing Editor
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
