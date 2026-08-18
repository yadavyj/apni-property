"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CldVideoPlayer, CldImage } from "next-cloudinary";
import { ImageOff, Images, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import PropertyImage from "@/components/property/PropertyImage";
import { normalizeCloudinaryImageSource } from "@/lib/cloudinary/normalizeImageSource";
import "next-cloudinary/dist/cld-video-player.css";

function initialIndexFor(media, initialMediaId) {
  if (initialMediaId) {
    const byId = media.findIndex((m) => m.id === initialMediaId);
    if (byId !== -1) return byId;
  }
  const firstImage = media.findIndex((m) => m.media_type !== "video");
  return firstImage !== -1 ? firstImage : 0;
}

export default function PropertyGallery({ media = [], title, initialMediaId }) {
  const [activeIndex, setActiveIndex] = useState(() => initialIndexFor(media, initialMediaId));

  if (!media.length) {
    return (
      <div className="flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-3xl sm:rounded-[2rem] border border-white/10 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-white shadow-2xl sm:aspect-video">
        <ImageOff className="h-10 w-10 text-brand-400 opacity-80" />
        <span className="text-sm font-semibold text-slate-400">Photos coming soon</span>
      </div>
    );
  }

  const active = media[activeIndex] || media[0];
  const activeImageSrc = normalizeCloudinaryImageSource(
    active?.secure_url || active?.cloudinary_public_id
  ).url;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl sm:rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl sm:aspect-video">
        <AnimatePresence mode="wait">
          {active.media_type === "video" ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <CldVideoPlayer
                src={active.cloudinary_public_id}
                width={active.width || 1280}
                height={active.height || 720}
                className="h-full w-full"
              />
            </motion.div>
          ) : (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <PropertyImage
                src={activeImageSrc}
                alt={title || "Property image"}
                fill
                priority
                sizes="(min-width: 1024px) 800px, 100vw"
                className="object-contain bg-slate-950/90 p-1"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        {media.length > 1 && (
          <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/80 border border-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Images className="h-3.5 w-3.5 text-brand-400" />
            {activeIndex + 1} / {media.length}
          </span>
        )}
      </div>

      {media.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-[3px] mt-[3px] no-scrollbar">
          {media.map((item, index) => {
            const itemImageSrc = normalizeCloudinaryImageSource(
              item.secure_url || item.cloudinary_public_id
            ).url;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${item.media_type} ${index + 1}`}
                className={cn(
                  "relative h-16 w-22 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-2xl border bg-slate-950 transition-all duration-300 cursor-pointer",
                  index === activeIndex
                    ? "border-brand-500 shadow-lg shadow-brand-500/20 -translate-y-0.5 scale-98"
                    : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/25"
                )}
              >
                {item.media_type === "video" ? (
                  <div className="relative h-full w-full bg-slate-950">
                    <CldImage
                      src={item.cloudinary_public_id}
                      assetType="video"
                      alt="Video thumbnail"
                      fill
                      sizes="120px"
                      className="object-contain p-0.5"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white shadow-md">
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5 text-white" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <PropertyImage
                    src={itemImageSrc}
                    alt={`${title || "Property"} thumbnail ${index + 1}`}
                    fill
                    sizes="120px"
                    iconClassName="h-4 w-4"
                    className="object-contain p-0.5 bg-slate-950"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
