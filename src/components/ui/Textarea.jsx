import { cn } from "@/lib/cn";

export default function Textarea({ className, label, error, id, rows = 4, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={cn(
          "w-full rounded-lg border border-line bg-cream-soft px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted transition-all duration-200 hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none",
          error && "border-red-400 focus:ring-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
