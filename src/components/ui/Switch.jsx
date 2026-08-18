import { cn } from "@/lib/cn";

export default function Switch({ checked, onChange, label, id, disabled = false }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-3 select-none",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
    >
      <span className="relative inline-flex h-6 w-11 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cn(
            "absolute inset-0 rounded-full bg-line transition-colors duration-300 peer-checked:bg-brand-500 peer-checked:shadow-[0_0_0_3px_rgba(31,77,58,0.15)]"
          )}
        />
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ease-out peer-checked:translate-x-5 peer-checked:shadow-md"
          )}
        />
      </span>
      {label && <span className="text-sm text-ink">{label}</span>}
    </label>
  );
}
