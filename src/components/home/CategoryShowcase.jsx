import Link from "next/link";
import { ArrowUpRight, Building2, Home, LandPlot, Store, Wheat } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import Spotlight from "@/components/common/Spotlight";

const ICONS = {
  plot: LandPlot,
  flat: Building2,
  house: Home,
  commercial: Store,
  agricultural: Wheat,
};

const DESCRIPTIONS = {
  plot: "Residential and investment plots, ready to build or hold.",
  flat: "Ready and under-construction flats across the city.",
  house: "Independent houses with clear registry and kabza.",
  commercial: "Shops and commercial spaces on high-visibility roads.",
  agricultural: "Farmland and agricultural land on the outskirts.",
};

const CATEGORY_THEMES = {
  plot: {
    border: "hover:from-brand-500 hover:to-purple-500",
    iconBg: "bg-brand-500/10 text-brand-400 group-hover:bg-brand-500 group-hover:text-white",
    glow: "bg-brand-500/5 group-hover:opacity-100",
    shadow: "hover:shadow-brand-500/10",
  },
  flat: {
    border: "hover:from-blue-500 hover:to-indigo-500",
    iconBg: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white",
    glow: "bg-blue-500/5 group-hover:opacity-100",
    shadow: "hover:shadow-blue-500/10",
  },
  house: {
    border: "hover:from-amber-500 hover:to-orange-500",
    iconBg: "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white",
    glow: "bg-amber-500/5 group-hover:opacity-100",
    shadow: "hover:shadow-amber-500/10",
  },
  commercial: {
    border: "hover:from-rose-500 hover:to-pink-500",
    iconBg: "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-white",
    glow: "bg-rose-500/5 group-hover:opacity-100",
    shadow: "hover:shadow-rose-500/10",
  },
  agricultural: {
    border: "hover:from-emerald-500 hover:to-teal-500",
    iconBg: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
    glow: "bg-emerald-500/5 group-hover:opacity-100",
    shadow: "hover:shadow-emerald-500/10",
  },
};

export default function CategoryShowcase({ categories }) {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-slate-950/10">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 h-96 w-96 rounded-full bg-brand-500/5 opacity-40 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/2 h-96 w-96 rounded-full bg-accent-500/5 opacity-30 blur-[130px]" />

      <Container className="relative z-10 flex flex-col gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Browse by Type"
            title="Whatever You're Looking For, We've Got It"
            align="center"
            description="Explore our listings organized by category to find your perfect match."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat, index) => {
            const Icon = ICONS[cat.value] || LandPlot;
            const theme = CATEGORY_THEMES[cat.value] || CATEGORY_THEMES.plot;
            return (
              <Reveal key={cat.value} delay={index * 0.07} className="h-full">
                {/* 1px Border Gradient Wrapper */}
                <Link
                  href={`/properties?category=${cat.value}`}
                  className={`group relative p-[1px] flex flex-col h-full overflow-hidden rounded-[24px] bg-white/5 transition-all duration-500 hover:bg-linear-to-br ${theme.border} hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)] ${theme.shadow} hover:-translate-y-1.5`}
                >
                  
                  {/* Card Container */}
                  <div className="relative flex flex-1 flex-col justify-between gap-10 rounded-[23px] bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-500 group-hover:bg-slate-950/80">

                    {/* Cursor-following glow */}
                    <Spotlight />

                    {/* Glowing highlight in background */}
                    <div className={`absolute inset-0 -z-10 bg-radial-gradient from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${theme.glow}`} />

                    {/* Top Icon & Arrow Row */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 shadow-md ${theme.iconBg} group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-all duration-300 group-hover:bg-white/10 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>

                    {/* Category Label & Short Description */}
                    <div className="relative z-10 flex flex-col gap-2">
                      <h3 className="font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-brand-400">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {DESCRIPTIONS[cat.value]}
                      </p>
                    </div>

                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

