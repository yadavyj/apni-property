import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-linear-to-b from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/50 hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-100 active:shadow-md",
  accent:
    "bg-linear-to-b from-accent-400 to-accent-600 text-white shadow-lg shadow-accent-600/30 hover:shadow-xl hover:shadow-accent-600/50 hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-100",
  whatsapp:
    "bg-linear-to-b from-whatsapp to-whatsapp-dark text-white shadow-lg shadow-whatsapp/30 hover:shadow-xl hover:shadow-whatsapp/50 hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-100",
  outline:
    "border border-line text-ink hover:border-brand-400 hover:bg-cream-soft hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-ink hover:bg-cream-soft",
  dark: "bg-linear-to-b from-ink to-black text-white shadow-lg shadow-ink/30 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-100",
};

const shineVariants = new Set(["primary", "accent", "whatsapp", "dark"]);

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export default function Button({
  as,
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    shineVariants.has(variant) && "btn-shine",
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  const Component = as || "button";
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
