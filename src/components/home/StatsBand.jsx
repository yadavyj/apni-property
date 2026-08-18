import { getSiteStats } from "@/lib/queries/properties";
import Container from "@/components/layout/Container";
import Counter from "@/components/home/Counter";
import Spotlight from "@/components/common/Spotlight";
import { ShieldCheck, MapPin, Wallet } from "lucide-react";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";

export default async function StatsBand() {
  const stats = await getSiteStats();

  const items = [
    { 
      value: Math.max(stats.totalProperties, 8), 
      suffix: "+", 
      label: "Verified Listings", 
      icon: ShieldCheck, 
      color: "text-brand-400 bg-brand-500/10 border-brand-500/20" 
    },
    { 
      value: Math.max(stats.totalLocations, 5), 
      suffix: "+", 
      label: "Areas Covered", 
      icon: MapPin, 
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20" 
    },
    { 
      value: 0, 
      suffix: "", 
      label: "Hidden Charges", 
      display: "Zero", 
      icon: Wallet, 
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20" 
    },
    { 
      value: 100, 
      suffix: "%", 
      label: "WhatsApp Support", 
      icon: WhatsAppIcon, 
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
    },
  ];

  return (
    <section className="relative overflow-hidden py-10 sm:py-16 bg-slate-950/20">
      <Container className="px-4">
        {/* Floating Glassmorphic Band */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-md p-5 sm:p-10 shadow-2xl">
          {/* Cursor-following glow across the whole band */}
          <Spotlight size={420} />

          {/* Internal Glow Spots */}
          <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-brand-500/5 opacity-50 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent-500/5 opacity-55 blur-3xl" />

          {/* Dotted Pattern Inside Band */}
          <div 
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" 
          />

          <div className="relative z-10 grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-4 md:gap-4 md:divide-x md:divide-white/5">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="group flex flex-col items-center gap-2.5 sm:gap-3.5 text-center md:px-4 transition-transform duration-300 hover:-translate-y-1">
                  {/* Glowing Icon Header */}
                  <span className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border shadow-sm transition-transform duration-500 group-hover:scale-110 ${item.color}`}>
                    <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  </span>

                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    {/* Glowing Metric Number */}
                    <span className="font-display text-2xl sm:text-4xl font-black bg-linear-to-b from-white via-white to-slate-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(139,92,246,0.25)] group-hover:to-brand-300 transition-colors duration-500">
                      {item.display ? item.display : <Counter value={item.value} suffix={item.suffix} />}
                    </span>
                    {/* Description label */}
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

