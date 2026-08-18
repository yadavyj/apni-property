import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export default function Select({
  className,
  label,
  error,
  id,
  children,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={cn(
            "h-11 w-full appearance-none rounded-lg border border-line bg-cream-soft px-3.5 pr-9 text-sm text-ink transition-all duration-200 hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent",
            error && "border-red-400 focus:ring-red-400",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
