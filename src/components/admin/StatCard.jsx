import { cn } from "@/lib/cn";

export default function StatCard({ icon: Icon, label, value, tone = "brand", className }) {
  const tones = {
    brand: {
      box: "bg-linear-to-br from-brand-500/20 to-purple-500/5 border-brand-500/30 hover:border-brand-500/60 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]",
      icon: "bg-brand-500/20 text-brand-300 border-brand-500/30",
    },
    emerald: {
      box: "bg-linear-to-br from-emerald-500/20 to-teal-500/5 border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]",
      icon: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    amber: {
      box: "bg-linear-to-br from-amber-500/20 to-orange-500/5 border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]",
      icon: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    rose: {
      box: "bg-linear-to-br from-rose-500/20 to-pink-500/5 border-rose-500/30 hover:border-rose-500/60 hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]",
      icon: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    },
    accent: {
      box: "bg-linear-to-br from-accent-500/20 to-purple-500/5 border-accent-500/30 hover:border-accent-500/60 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)]",
      icon: "bg-accent-500/20 text-accent-400 border-accent-500/30",
    },
    neutral: {
      box: "bg-slate-900/60 border-white/10 hover:border-white/20",
      icon: "bg-white/10 text-slate-300 border-white/10",
    },
  };

  const currentTone = tones[tone] || tones.brand;

  return (
    <div
      className={cn(
        "group relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-3xl border p-3 sm:p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden min-w-0",
        currentTone.box,
        className
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3",
            currentTone.icon
          )}
        >
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
        </span>
      )}
      <div className="flex flex-col min-w-0 leading-snug">
        <span className="font-display text-lg sm:text-2xl font-black text-white leading-tight">{value}</span>
        <span className="text-[10px] sm:text-xs font-semibold text-slate-300 leading-tight break-words mt-0.5">{label}</span>
      </div>
    </div>
  );
}
