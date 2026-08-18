import { MapPin, MessageCircle, ShieldCheck, Wallet, Sparkles, Users, Award, CheckCircle2, ChevronRight, FileSearch, Calendar, FileText } from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/common/Reveal";
import { BUSINESS } from "@/lib/constants";
import { buildGenericWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "About Us",
  description: `Learn about ${BUSINESS.name}, a trusted real-estate brand helping buyers find verified plots and homes across ${BUSINESS.city}.`,
};

const STATS = [
  { value: "100%", label: "Verified Registry", icon: ShieldCheck, color: "text-emerald-400" },
  { value: "500+", label: "Happy Families", icon: Users, color: "text-brand-400" },
  { value: "10+", label: "Years Exp.", icon: Award, color: "text-amber-400" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "100% Verified Registry",
    description: "Every single plot and property goes through a rigorous legal title check before listing.",
    gradient: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-400",
    borderColor: "group-hover:border-emerald-500/30",
  },
  {
    icon: MapPin,
    title: "Deep Gorakhpur Roots",
    description: "We don't just sell; we live here. We understand growth corridors, future bypasses, and true market rates.",
    gradient: "from-brand-500/20 to-purple-500/5",
    iconColor: "text-brand-400",
    borderColor: "group-hover:border-brand-500/30",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description: "No hidden agent commissions, no inflated prices. What you see is direct owner expectations.",
    gradient: "from-amber-500/20 to-orange-500/5",
    iconColor: "text-amber-400",
    borderColor: "group-hover:border-amber-500/30",
  },
  {
    icon: MessageCircle,
    title: "Instant WhatsApp Direct",
    description: "Skip the middlemen. Get documents, location drops, and pricing info directly on WhatsApp.",
    gradient: "from-blue-500/20 to-cyan-500/5",
    iconColor: "text-blue-400",
    borderColor: "group-hover:border-blue-500/30",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Legal & Registry Scrubbing",
    description: "We verify Khasra numbers, registry history, and check for any active court cases or disputes.",
    icon: FileSearch,
  },
  {
    step: "02",
    title: "On-Ground Verification",
    description: "Our local experts visit the physical location to confirm road width, possession, and boundary status.",
    icon: MapPin,
  },
  {
    step: "03",
    title: "Direct Owner Meeting",
    description: "We coordinate transparent negotiations directly with property owners to eliminate broker markups.",
    icon: Users,
  },
  {
    step: "04",
    title: "Seamless Registry & Possession",
    description: "We guide you through documentation, registry booking, and physical possession alignment.",
    icon: FileText,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-36 sm:pb-28">
        {/* Glow Effects */}
        <div
          aria-hidden
          className="animate-breathe pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-brand-500/10 opacity-70 blur-[90px] sm:blur-[130px]"
        />
        <div
          aria-hidden
          className="animate-breathe-slow pointer-events-none absolute -right-20 top-20 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-accent-500/10 opacity-60 blur-[90px] sm:blur-[130px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:32px_32px] opacity-60"
        />

        <Container className="relative z-10 flex flex-col items-center text-center px-4 min-w-0">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-brand-400">
              <Sparkles className="h-3.5 w-3.5 fill-brand-400" /> About Apni Property
            </span>
          </Reveal>
          
          <Reveal delay={0.08}>
            <h1 className="mt-4 sm:mt-5 max-w-4xl font-display text-2xl sm:text-6xl/tight font-black tracking-tight text-white leading-tight break-words">
              The Region&apos;s Most Trusted Brand in <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-brand-400 via-brand-500 to-accent-400 bg-clip-text text-transparent">Verified Plots &amp; Land</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-3 sm:mt-6 max-w-2xl text-xs sm:text-lg leading-relaxed text-slate-300 font-light">
              {BUSINESS.name} was founded with a single mission: to eliminate ambiguity, broker inflated markups, and verification anxiety associated with buying land.
            </p>
          </Reveal>

          {/* Compact Stats Grid (3 side-by-side on mobile) */}
          <div className="mt-6 sm:mt-12 w-full max-w-4xl min-w-0">
            <Reveal delay={0.24}>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-3.5 sm:p-8 backdrop-blur-xl shadow-2xl">
                {STATS.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={stat.label} className="group flex flex-col items-center gap-1.5 hover:-translate-y-0.5 transition-all duration-300 min-w-0">
                      <div className={`rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 p-2 sm:p-4 transition-all duration-300 group-hover:scale-110 ${stat.color}`}>
                        <StatIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                      <span className="font-display text-lg sm:text-4xl font-black text-white mt-0.5 leading-tight">
                        {stat.value}
                      </span>
                      <span className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider text-center leading-tight truncate w-full">
                        {stat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Story & Vision Section */}
      <section className="relative py-12 sm:py-24 bg-slate-950/20">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center px-4 min-w-0">
          <Reveal>
            <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-400 w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
                Our Origin Story
              </span>
              <h2 className="font-display text-xl sm:text-5xl font-black text-white leading-tight break-words">
                Built for You, by People Who Care About Trust
              </h2>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-base font-light">
                Buying land is one of the most significant investments a family makes. Yet, we noticed that buyers were constantly battling unverified listings, fake boundaries, and hidden commissions.
              </p>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-base font-light">
                We started Apni Property to offer a clean, tech-enabled, and absolutely transparent way to discover and purchase property. Today, we are proud to be the primary destination for registry-ready, clear-titled residential plots and commercial lands.
              </p>
              
              {/* Highlight Badge */}
              <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-xl mt-1 min-w-0">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl border border-brand-500/30 bg-brand-500/10 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-brand-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-xs sm:text-sm truncate">#1 Verified Land Portal</h4>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-400 truncate">100% legal title assurance before listing publish</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Glowing Feature Cards */}
          <div className="grid grid-cols-1 gap-3.5 sm:gap-6 sm:grid-cols-2 min-w-0">
            {VALUES.map((value, index) => {
              const ValueIcon = value.icon;
              return (
                <Reveal key={value.title} delay={index * 0.1}>
                  <div className={`group relative h-full flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl transition-all duration-500 hover:bg-slate-900/90 ${value.borderColor} hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)] hover:-translate-y-1`}>
                    <div className={`absolute inset-0 -z-10 rounded-3xl bg-linear-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <span className={`inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 ${value.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shrink-0`}>
                      <ValueIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-brand-300 transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {value.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* The Apni Property Process */}
      <section className="relative py-12 sm:py-32 overflow-hidden bg-slate-950/40">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute right-10 top-1/2 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-brand-500/10 blur-[80px] sm:blur-[120px] animate-pulse" />
        <div className="pointer-events-none absolute left-10 bottom-10 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-accent-500/10 blur-[80px] sm:blur-[120px] animate-pulse" />
        
        <Container className="relative z-10 px-4 min-w-0">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-20">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-400">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
                Our Workflow
              </span>
              <h2 className="mt-3 font-display text-xl sm:text-5xl font-black text-white leading-tight break-words">
                How We Protect Your Investment
              </h2>
              <p className="mt-2.5 sm:mt-4 text-slate-400 text-xs sm:text-base leading-relaxed font-light">
                We do the hard work behind the scenes so that you can make your purchase with absolute peace of mind.
              </p>
            </div>
          </Reveal>

          {/* Stepper Timeline Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 relative min-w-0">
            {/* Connecting glowing line */}
            <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-linear-to-r from-brand-500/60 via-purple-500/30 to-brand-500/60 z-0 shadow-[0_0_12px_rgba(139,92,246,0.5)]" />

            {PROCESS_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <Reveal key={step.step} delay={index * 0.1}>
                  <div className="group relative flex flex-col items-start text-left gap-3.5 z-10 p-4.5 sm:p-6 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl transition-all duration-500 hover:border-brand-500/30 hover:bg-slate-900/90 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)] min-w-0">
                    <div className="flex items-center justify-center h-11 w-11 sm:h-14 sm:w-14 rounded-2xl bg-linear-to-br from-brand-500/20 to-purple-600/10 border border-brand-500/30 text-white font-bold transition-all duration-300 shadow-lg relative group-hover:scale-110 group-hover:border-brand-400 shrink-0">
                      <StepIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-400 transition-transform duration-300" />
                      <span className="absolute -top-2 -right-2 text-[10px] font-black bg-linear-to-r from-brand-400 to-accent-400 text-white h-5 w-5 rounded-full flex items-center justify-center border border-slate-950 shadow-md">
                        {step.step}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-brand-300 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-12 sm:py-24">
        {/* Background glow */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-br from-brand-950 via-slate-950 to-brand-950 opacity-90"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.15)_1px,transparent_1px)] bg-size-[24px_24px]"
        />
        <div
          aria-hidden
          className="animate-breathe pointer-events-none absolute -right-20 -top-20 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-brand-500/20 opacity-40 blur-3xl"
        />
        
        <Container className="relative z-10 px-4 min-w-0">
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-12 backdrop-blur-xl text-center shadow-2xl">
              <h2 className="font-display text-xl sm:text-4xl font-black text-white">
                Ready to Find Your Ideal Plot?
              </h2>
              <p className="mx-auto mt-2.5 sm:mt-4 max-w-xl text-xs sm:text-base leading-relaxed text-slate-300 font-light">
                Whether you are looking to build your dream home or make a high-yield land investment, our team is here to help you make the right choice.
              </p>
              
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                <Button href="/properties" variant="accent" size="lg" className="shadow-lg shadow-brand-500/20 w-full sm:w-auto rounded-2xl font-bold py-3 text-xs sm:text-sm">
                  Browse Verified Listings
                </Button>
                <Button
                  href={buildGenericWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="lg"
                  className="shadow-lg shadow-emerald-500/20 w-full sm:w-auto rounded-2xl font-bold py-3 text-xs sm:text-sm"
                >
                  <MessageCircle className="h-4.5 w-4.5 mr-1.5" />
                  Direct WhatsApp Chat
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
