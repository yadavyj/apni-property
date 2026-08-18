"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ImageOff, Images } from "lucide-react";
import PropertyImage from "@/components/property/PropertyImage";
import { normalizeCloudinaryImageSource } from "@/lib/cloudinary/normalizeImageSource";

const AUTO_SLIDE_INTERVAL_MS = 3000;
const TABLET_MEDIA_QUERY = "(min-width: 640px)";

export default function PropertyCardGallery({ images, title, href }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const viewportRef = useRef(null);
  const scrollFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0.01 }
    );
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (images.length < 2 || !isVisible) return;

    const mediaQuery = window.matchMedia(TABLET_MEDIA_QUERY);
    let intervalId = null;

    function stopAutoSlide() {
      if (intervalId === null) return;
      window.clearInterval(intervalId);
      intervalId = null;
    }

    function startAutoSlide() {
      stopAutoSlide();
      if (!mediaQuery.matches || document.visibilityState !== "visible") return;

      intervalId = window.setInterval(() => {
        setActiveIndex((currentIndex) => {
          const nextIndex = (currentIndex + 1) % images.length;
          const viewport = viewportRef.current;
          if (viewport) {
            viewport.scrollTo({
              left: nextIndex * viewport.clientWidth,
              behavior: "smooth",
            });
          }
          return nextIndex;
        });
      }, AUTO_SLIDE_INTERVAL_MS);
    }

    startAutoSlide();
    mediaQuery.addEventListener("change", startAutoSlide);
    document.addEventListener("visibilitychange", startAutoSlide);

    return () => {
      stopAutoSlide();
      mediaQuery.removeEventListener("change", startAutoSlide);
      document.removeEventListener("visibilitychange", startAutoSlide);
    };
  }, [images.length, isVisible]);

  function scrollToImage(index) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const normalizedIndex = (index + images.length) % images.length;
    viewport.scrollTo({
      left: normalizedIndex * viewport.clientWidth,
      behavior: "smooth",
    });
    setActiveIndex(normalizedIndex);
  }

  function handleScroll(event) {
    if (scrollFrameRef.current !== null) return;
    const viewport = event.currentTarget;

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      const nextIndex = Math.min(
        images.length - 1,
        Math.max(0, Math.round(viewport.scrollLeft / viewport.clientWidth))
      );
      setActiveIndex((currentIndex) =>
        currentIndex === nextIndex ? currentIndex : nextIndex
      );
    });
  }

  function resolveImageSrc(image) {
    const secureUrl = image?.secure_url;
    const publicId = image?.cloudinary_public_id;

    if (typeof secureUrl === "string" && /^https?:\/\//i.test(secureUrl)) {
      return secureUrl;
    }

    const normalized = normalizeCloudinaryImageSource(publicId);
    return normalized.url;
  }

  if (!images.length) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-slate-900 to-slate-950 text-slate-500">
        <ImageOff className="h-10 w-10 animate-pulse opacity-30" />
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
          Listing Photos Coming
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div
        ref={viewportRef}
        role="region"
        aria-label={`${title} image gallery`}
        onScroll={handleScroll}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x"
      >
        {images.map((image, index) => {
          const imageSrc = resolveImageSrc(image);

          return (
            <Link
              key={image.id}
              href={href}
              aria-label={`View ${title}, photo ${index + 1}`}
              draggable={false}
              className="relative h-full w-full shrink-0 snap-center bg-slate-950"
            >
              <PropertyImage
                src={imageSrc}
                alt={`${title} - view ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="bg-slate-950 object-cover"
              />
            </Link>
          );
        })}
      </div>

      {images.length > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-2 z-20 flex items-center justify-center gap-1.5 px-16">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => scrollToImage(index)}
                aria-label={`Show property photo ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${
                  index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/75 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
            <Images className="h-3 w-3 text-brand-300" />
            {activeIndex + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}
