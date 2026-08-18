import { FileCheck2, MapPinned, Search, ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import Spotlight from "@/components/common/Spotlight";

const STEPS = [
  {
    icon: Search,
    title: "Browse Listings",
    description: "Explore verified plots, homes and commercial spaces with real photos and videos.",
    gradient: "from-blue-500 via-indigo-500 to-indigo-600",
    shadow: "shadow-indigo-500/20",
    badge: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
  },
  {
    icon: WhatsAppIcon,
    title: "Chat on WhatsApp",
    description: "Message us directly for pricing, availability or any question — no waiting on calls.",
    gradient: "from-emerald-400 via-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    badge: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  },
  {
    icon: MapPinned,
    title: "Visit the Site",
    description: "We arrange a convenient site visit so you can see the property in person before deciding.",
    gradient: "from-amber-400 via-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
    badge: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  },
  {
    icon: FileCheck2,
    title: "Registry & Kabza",
    description: "We help complete registry and handover paperwork so ownership transfers smoothly.",
    gradient: "from-purple-400 via-purple-500 to-pink-600",
    shadow: "shadow-purple-500/20",
    badge: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-divider relative overflow-hidden py-16 sm:py-32 bg-slate-950/20">
      {/* Dynamic Background Blur Accents */}
      <div className="pointer-events-none absolute -left-48 top-1/2 h-80 w-80 rounded-full bg-brand-500/5 opacity-55 blur-[120px]" />
      <div className="pointer-events-none absolute -right-48 top-1/3 h-80 w-80 rounded-full bg-accent-500/5 opacity-40 blur-[120px]" />

      <Container className="relative z-10 flex flex-col gap-12 sm:gap-20 px-4">
        <Reveal>
          <SectionHeading
            eyebrow="Ownership Journey"
            title="From Browsing to Ownership"
            align="center"
            description="A straightforward path to owning your ideal plot or property."
          />
        </Reveal>

        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 0.1} className="relative h-full">
                {/* Horizontal Connective Arrows (Only visible on large screens between cards) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute top-12 -right-6 translate-x-1/2 z-20 items-center justify-center pointer-events-none">
                    <ArrowRight className="h-6 w-6 text-slate-700 animate-pulse" />
                  </div>
                )}

                {/* 1px Gradient Border Wrapper on Hover */}
                <div className="group relative h-full p-[1px] rounded-3xl bg-white/5 transition-all duration-500 hover:bg-linear-to-br hover:from-white/10 hover:via-brand-500/30 hover:to-white/5 hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)]">

                  {/* Card Body */}
                  <div className="relative flex h-full flex-col items-start gap-4 rounded-[23px] bg-slate-950/90 p-6 transition-all duration-300 group-hover:bg-slate-950/80 sm:gap-5 sm:p-7">

                    {/* Cursor-following glow */}
                    <Spotlight size={300} />

                    {/* Big Accent Background Number */}
                    <span className="absolute right-6 top-4 text-7xl font-black text-white/5 select-none font-display tracking-tighter group-hover:text-brand-500/10 transition-colors duration-500">
                      0{index + 1}
                    </span>

                    {/* Glowing Accent Spot */}
                    <div className="absolute -inset-px -z-10 rounded-[23px] bg-radial-gradient from-brand-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Step Icon Container with Step-Specific Gradient */}
                    <span className={`relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${step.gradient} text-white shadow-lg ${step.shadow} transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                      <Icon className="h-6 w-6" />
                    </span>

                    {/* Step Badge */}
                    <span className={`relative z-10 rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest ${step.badge}`}>
                      Step 0{index + 1}
                    </span>

                    {/* Step Title & Details */}
                    <div className="relative z-10 flex flex-col gap-2">
                      <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-400 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}


