import { MapPin, ShieldCheck, Wallet, Check, Sparkles } from "lucide-react";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import Spotlight from "@/components/common/Spotlight";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Verified Registry",
    description: "Every listing is checked for clear registry and legal standing before it goes live.",
    gradient: "from-brand-500 to-purple-600",
  },
  {
    icon: MapPin,
    title: "Market Expertise",
    description: "Deep, on-ground knowledge of local growth corridors and land value trends.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Wallet,
    title: "Flexible EMI Options",
    description: "Many properties come with EMI plans, making ownership easier to plan for.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: WhatsAppIcon,
    title: "Direct WhatsApp Support",
    description: "Talk to us directly, get quick answers and schedule visits without any hassle.",
    gradient: "from-emerald-400 to-teal-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-divider relative overflow-hidden py-24 sm:py-32 bg-slate-950/20">
      {/* Decorative Blur Accents */}
      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-brand-500/10 opacity-40 blur-[120px]" />
      <div className="pointer-events-none absolute -left-32 bottom-1/4 h-96 w-96 rounded-full bg-accent-500/10 opacity-30 blur-[120px]" />

      <Container className="relative z-10 flex flex-col gap-16">
        
        {/* Top Header */}
        <Reveal>
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Buying Land Shouldn't Be Stressful"
            align="center"
            description="We make property buying transparent, simple, and trustworthy."
          />
        </Reveal>

        {/* Split Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1.9fr] lg:items-center">
          
          {/* Left Panel: Unique trust widget */}
          <Reveal delay={0.1}>
            <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-brand-500/30 hover:bg-slate-900/70 hover:shadow-brand-500/10">
              {/* Background ambient lighting */}
              <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand-500/5 via-transparent to-transparent" />
              <div className="absolute top-0 right-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-brand-500/10 blur-2xl group-hover:bg-brand-500/20 transition-all duration-500" />

              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <Sparkles className="h-3 w-3 fill-emerald-400" /> Trust Shield Active
                  </span>
                  <span className="text-xs font-semibold text-slate-500">AP-VERIFY v2.0</span>
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="font-display text-xl font-bold text-white">Verification Certificate</h4>
                  <p className="text-xs text-slate-400">Our 4-step listing safety standard protection protocols.</p>
                </div>

                {/* Simulated Inspection Checklist */}
                <div className="flex flex-col gap-3.5 mt-2">
                  {[
                    "Title & Registry Legal Verification",
                    "Physical Boundary & Land Verification",
                    "No-Dispute / Clear Lien Check",
                    "Direct Owner Pricing Match Guarantee",
                  ].map((check, i) => (
                    <div key={i} className="flex items-center gap-3.5 rounded-2xl bg-white/[0.03] border border-white/5 p-3.5 transition-all duration-300 hover:bg-white/[0.06] hover:translate-x-1">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{check}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed mt-1 text-center">
                  100% of our active properties pass this verification layout before being listed.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right Panel: Features grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {REASONS.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <Reveal key={reason.title} delay={index * 0.1}>
                  <div className="group relative flex h-full flex-col items-start gap-4 rounded-3xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/20 hover:bg-slate-900/50 hover:shadow-[0_15px_30px_rgba(139,92,246,0.08)]">

                    {/* Cursor-following glow */}
                    <Spotlight size={280} />

                    {/* Icon bubble */}
                    <span className={`relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${reason.gradient} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                      <Icon className="h-5.5 w-5.5" />
                    </span>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col gap-2">
                      <h3 className="font-display text-base font-bold text-white group-hover:text-brand-400 transition-colors duration-300">
                        {reason.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {reason.description}
                      </p>
                    </div>

                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>

      </Container>
    </section>
  );
}

