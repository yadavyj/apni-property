import { BadgeCheck, MapPin, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import ViewportMotion from "@/components/common/ViewportMotion";
import { getDistinctLocations } from "@/lib/queries/properties";
import { BUSINESS } from "@/lib/constants";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Verified Registry" },
  { icon: Wallet, label: "0% Interest EMI on Select Plots" },
  { icon: BadgeCheck, label: "Real Photos & Videos" },
  { icon: Sparkles, label: "Registry & Kabza Tatkal" },
];

export default async function LocationsMarquee() {
  const locations = await getDistinctLocations();

  const items = locations.length
    ? locations.map((l) => l.location_area)
    : [
        "Rani Dinha",
        "Rajahi",
        "Motiram Adda",
        "Sonbarsha",
        "Kashipuram Colony",
        "Deoria Road",
      ];

  const locationTrack = [...items, ...items];
  const trustTrack = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <ViewportMotion className="relative flex flex-col overflow-hidden border-y border-white/10 bg-linear-to-r from-slate-950/40 via-brand-500/10 to-slate-950/40 backdrop-blur-md py-1">
      <div className="flex items-center gap-3 border-b border-white/5 py-3.5">
        <div className="viewport-animation flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
          {locationTrack.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="flex items-center gap-2.5 text-sm font-medium text-ink/90 transition-all duration-300 hover:text-brand-400 hover:scale-105 cursor-default group"
            >
              <MapPin className="h-4 w-4 text-accent-400 animate-pulse" />
              {name}
              <span className="mx-2 text-brand-500/40 font-bold">•</span>
              <span className="text-[10px] tracking-wider uppercase text-brand-400/70 font-semibold bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">Verified</span>
            </span>
          ))}
        </div>
      </div>
 
      <div className="flex items-center gap-3 py-3.5">
        <div className="viewport-animation flex w-max animate-marquee-reverse items-center gap-12 whitespace-nowrap">
          {trustTrack.map((item, i) => (
            <span
              key={`${item.label}-${i}`}
              className="flex items-center gap-2.5 text-sm font-medium text-brand-300/90 transition-all duration-300 hover:text-white hover:scale-105 cursor-default group"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:bg-brand-500/20 group-hover:text-white transition-colors">
                <item.icon className="h-4 w-4" />
              </span>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </ViewportMotion>
  );
}
