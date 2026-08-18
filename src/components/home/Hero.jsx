"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const word = {
  hidden: { opacity: 0, y: 18 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Shown until the admin adds banners under Admin → Home Customization.
const DEFAULT_SLIDES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600",
].map((image_url) => ({
  id: image_url,
  image_url,
  eyebrow_text: "Trusted Real Estate Partner",
  heading: "Find Verified Plots & Land Without the Guesswork",
  subheading:
    "Registry-ready plots, homes and commercial spaces with transparent pricing, real photos and direct WhatsApp support — no middlemen, no surprises.",
  cta_label: null,
  cta_href: null,
}));

export default function Hero({ banners = [] }) {
  const sectionRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const slides = banners.length ? banners : DEFAULT_SLIDES;
  const active = slides[currentImageIndex % slides.length];
  const bannerImageSource = active?.image_public_id || active?.image_url || null;
  const headlineWords = (active.heading || "").split(" ").filter(Boolean);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${springX}px ${springY}px, color-mix(in srgb, var(--color-brand-400) 15%, transparent), transparent 75%)`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const blobOneY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const blobTwoY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  function handleMouseMove(e) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-slate-950 min-h-[420px] sm:min-h-screen lg:h-screen flex items-center py-10 sm:py-16 lg:py-0"
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={active.id ?? currentImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-brand-700"
          >
            {bannerImageSource && active.image_public_id ? (
              <CldImage
                src={active.image_public_id}
                alt=""
                fill
                preload={currentImageIndex === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            ) : bannerImageSource ? (
              <Image
                src={bannerImageSource}
                alt=""
                fill
                preload={currentImageIndex === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
        {/* Overlay Dark Gradient - Slightly Darker Sweet Spot */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/65 via-slate-950/35 to-slate-950/85 z-5" />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/75 via-slate-950/30 to-slate-950/10 z-5" />
        {/* Subtle grain/dot texture */}
        <div
          aria-hidden
          className="absolute inset-0 z-5 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"
        />
      </div>

      {/* Glow Blobs */}
      <motion.div
        aria-hidden
        style={{ y: blobOneY }}
        className="animate-breathe pointer-events-none absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-brand-500/20 opacity-80 blur-[100px]"
      />
      <motion.div
        aria-hidden
        style={{ y: blobTwoY }}
        className="animate-breathe-slow pointer-events-none absolute right-12 top-20 h-[500px] w-[500px] rounded-full bg-accent-500/15 opacity-70 blur-[120px]"
      />

      {/* Spotlight Effect */}
      <div
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
      />

      <Container className="relative z-20 flex flex-col justify-center px-4 w-full min-w-0">
        <div className="flex w-full max-w-3xl min-w-0 flex-col items-center gap-4 text-center sm:items-start sm:gap-6 sm:text-left">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/15 px-3.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-brand-300 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.25)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
            </span>
            <Sparkles className="h-3.5 w-3.5 text-brand-400 shrink-0" />
            {active.eyebrow_text || "Trusted Real Estate Partner"}
          </motion.span>

          <h1 className="max-w-3xl font-display text-2xl sm:text-4xl lg:text-[3.8rem] font-black leading-tight sm:leading-[1.15] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] break-words">
            {headlineWords.map((token, index) => {
              const isHighlight = index >= headlineWords.length - 2;
              return (
                <motion.span
                  key={index}
                  variants={word}
                  initial="hidden"
                  animate="show"
                  custom={0.08 + index * 0.055}
                  className={isHighlight ? "text-purple-400" : "text-white"}
                >
                  {token}
                  {index < headlineWords.length - 1 ? " " : ""}
                </motion.span>
              );
            })}
          </h1>

          {active.subheading && (
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.65}
              className="block max-w-2xl text-xs sm:text-base text-slate-200 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-relaxed font-normal py-0.5 sm:py-0"
            >
              {active.subheading}
            </motion.p>
          )}

          {/* Quick CTA (Explore Properties Button) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.7}
            className="flex w-full items-center justify-center pt-2 sm:w-auto sm:justify-start"
          >
            <Button
              href={active.cta_href || "/properties"}
              size="md"
              className="w-auto inline-flex items-center justify-center rounded-xl sm:rounded-2xl font-bold bg-linear-to-r from-brand-500 via-brand-600 to-accent-500 shadow-lg shadow-brand-500/25 px-5 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-base text-white active:scale-95 transition-all"
            >
              {active.cta_label || "Explore Properties"}
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>



          {/* Social Trust points */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.95}
            className="hidden sm:flex flex-wrap items-center gap-2.5 pt-2 text-xs text-slate-300 lg:justify-start"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 backdrop-blur-md shadow-md text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              100% Verified Registry
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 backdrop-blur-md shadow-md text-xs font-semibold">
              <BadgeCheck className="h-4 w-4 text-brand-400" />
              Real Photos &amp; Video
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 backdrop-blur-md shadow-md text-xs font-semibold">
              <Wallet className="h-4 w-4 text-amber-400" />
              Direct Owner Rates
            </span>
          </motion.div>
        </div>
      </Container>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 sm:bottom-8 z-20 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id ?? index}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setCurrentImageIndex(index)}
              className="group relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all duration-300 cursor-pointer"
              style={{ width: index === currentImageIndex % slides.length ? 32 : 8 }}
            >
              {index === currentImageIndex % slides.length && (
                <motion.span
                  key={currentImageIndex}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 6, ease: "linear" }}
                  style={{ originX: 0 }}
                  className="absolute inset-0 rounded-full bg-linear-to-r from-brand-400 to-accent-400"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 bottom-3 z-20 hidden justify-center sm:flex"
      >
        <ChevronDown className="h-5 w-5 text-white/50" />
      </motion.div>
    </section>
  );
}
