"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, Grid, Building, Home, Trees, Layers } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import EmptyState from "@/components/common/EmptyState";
import PropertyCard from "@/components/property/PropertyCard";
import Link from "next/link";

const CATEGORIES = [
  { value: "all", label: "All Properties", icon: Grid },
  { value: "plot", label: "Plots", icon: Layers },
  { value: "house", label: "Houses", icon: Home },
  { value: "flat", label: "Flats", icon: Building },
  { value: "commercial", label: "Commercial", icon: Building },
  { value: "agricultural", label: "Agricultural", icon: Trees },
];

export default function FeaturedPropertiesClient({ initialProperties = [] }) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProperties = activeTab === "all"
    ? initialProperties
    : initialProperties.filter((property) => property.category === activeTab);

  return (
    <section className="relative overflow-hidden bg-slate-950/20 pb-6 pt-4 sm:py-32">
      {/* Dotted Grid Pattern Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.3)_1.5px,transparent_1.5px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      {/* Decorative Blur Blobs */}
      <div className="pointer-events-none absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-brand-500/10 opacity-40 blur-[100px]" />
      <div className="pointer-events-none absolute -right-48 bottom-1/4 h-96 w-96 rounded-full bg-accent-500/10 opacity-30 blur-[100px]" />

      <Container className="relative z-10 flex flex-col gap-3 sm:gap-12">
        {/* Header Section */}
        <div className="flex flex-col gap-3 sm:gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-400 border border-brand-500/20 mb-3">
              <Star className="h-3 w-3 fill-brand-400" /> Handpicked for You
            </span>
            <h2 className="mb-0 font-display text-4xl font-bold tracking-tight text-white sm:mb-4 md:text-5xl">
              Featured Properties
            </h2>
            <p className="hidden max-w-2xl text-base text-slate-400 sm:block">
              A curated selection of our most sought-after plots, homes and commercial spaces across Gorakhpur.
            </p>
          </div>

          <Link
            href="/properties"
            className="group inline-flex w-fit shrink-0 items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-400 hover:bg-brand-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] md:self-auto"
          >
            Explore All Listings
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 sm:pb-3 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveTab(cat.value)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${isActive
                  ? "text-black z-10"
                  : "text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900/60 border border-white/5"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-linear-to-r from-brand-400 to-brand-500 rounded-full -z-10 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-4 w-4 ${isActive ? "text-black" : "text-slate-400"}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Properties Grid */}
        <div className="min-h-[350px]">
          <AnimatePresence mode="popLayout">
            {filteredProperties.length ? (
              <motion.div
                layout
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="h-full"
                  >
                    <PropertyCard property={property} hideEmi={index === filteredProperties.length - 1} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12"
              >
                <EmptyState
                  icon={Star}
                  title="No listings in this category"
                  description="We don't have any featured properties under this category right now. Check back shortly or browse all categories."
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </Container>
    </section>
  );
}
