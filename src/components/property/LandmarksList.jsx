import { MapPin, Navigation } from "lucide-react";
import { formatDistance } from "@/lib/format";

export default function LandmarksList({ landmarks = [] }) {
  if (!landmarks?.length) return null;

  return (
    <div className="rounded-3xl sm:rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-md p-4 sm:p-8 shadow-2xl min-w-0">
      <h3 className="mb-4 sm:mb-6 flex items-center gap-2.5 font-display text-lg sm:text-xl font-bold text-white bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
        <Navigation className="h-5 w-5 text-brand-400 shrink-0" />
        Nearby Landmarks
      </h3>
      <div className="flex flex-wrap gap-2.5 sm:gap-3 min-w-0">
        {landmarks.map((landmark, index) => (
          <div
            key={`${landmark.name}-${index}`}
            className="group flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-white/5 bg-slate-950/40 px-3.5 py-2.5 sm:px-4 sm:py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/20 hover:bg-slate-900/50 min-w-0"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-white/5 text-accent-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-500/10 group-hover:text-accent-300">
              <MapPin className="h-4 w-4" />
            </span>
            <div className="flex flex-col min-w-0 leading-snug">
              <span className="text-xs sm:text-sm font-semibold text-white break-words">{landmark.name}</span>
              <span className="text-[11px] sm:text-xs text-slate-400 group-hover:text-slate-300 mt-0.5 transition-colors font-mono">
                {formatDistance(landmark.distance_km)} away
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
