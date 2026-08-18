import { cn } from "@/lib/cn";

export default function Skeleton({ className }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-cream-soft", className)}>
      <div className="animate-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
