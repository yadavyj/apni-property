"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

export default function Input({ className, label, error, id, type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 min-w-0 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full min-w-0">
        <input
          id={id}
          type={inputType}
          className={cn(
            "h-11 w-full rounded-lg border border-line bg-cream-soft px-3.5 text-sm text-ink placeholder:text-ink-muted transition-all duration-200 hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent",
            isPassword && "pr-10",
            error && "border-red-400 focus:ring-red-400",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg focus:outline-none"
            title={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 shrink-0" />
            ) : (
              <Eye className="h-4 w-4 shrink-0" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
