import { cn } from "@/lib/cn";

const tones = {
  brand: "bg-brand-500/20 text-brand-300 border border-brand-500/40 font-bold",
  accent: "bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold",
  neutral: "bg-slate-800/80 text-slate-300 border border-white/15 font-semibold",
  success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold",
  warning: "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold",
  danger: "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold",
};

export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-wider capitalize",
        tones[tone] || tones.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
