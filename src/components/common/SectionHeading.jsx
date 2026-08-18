import { cn } from "@/lib/cn";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 relative",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
          {eyebrow}
        </span>
      )}
      <div className="relative">
        <h2 className="text-gradient-animate bg-linear-to-r from-white via-white to-brand-300 bg-clip-text font-display text-3xl font-black leading-tight tracking-tight text-transparent md:text-4xl lg:text-5xl">
          {title}
        </h2>
      </div>
      
      {/* Decorative premium line indicator */}
      <span className={cn(
        "h-[3px] w-12 rounded-full bg-linear-to-r from-brand-400 to-accent-400 shadow-[0_1px_6px_rgba(139,92,246,0.5)]",
        align === "center" && "mx-auto"
      )} />

      {description && (
        <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base mt-2">{description}</p>
      )}
    </div>
  );
}
