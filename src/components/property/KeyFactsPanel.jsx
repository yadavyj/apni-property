import {
  CreditCard,
  IndianRupee,
  Route,
  Ruler,
  ShieldCheck,
  Square,
  Wallet,
} from "lucide-react";
import { registryStatusLabel } from "@/lib/constants";
import { formatArea, formatCompactCurrency, formatRate } from "@/lib/format";

export default function KeyFactsPanel({ property }) {
  if (!property) return null;

  const size =
    property.size_display ||
    (property.size_width_ft && property.size_length_ft
      ? `${property.size_width_ft} ft x ${property.size_length_ft} ft`
      : "-");

  const facts = [
    { icon: Ruler, label: "Area", value: formatArea(property.area_sqft) },
    { icon: Square, label: "Size", value: size },
    { icon: IndianRupee, label: "Rate", value: formatRate(property.rate_per_sqft) },
    { icon: Wallet, label: "Total Price", value: formatCompactCurrency(property.total_price) },
    {
      icon: Route,
      label: "Road Width",
      value: property.road_width_ft ? `${property.road_width_ft} ft` : "-",
    },
    {
      icon: ShieldCheck,
      label: "Registry Status",
      value: registryStatusLabel(property.registry_status),
    },
    {
      icon: CreditCard,
      label: "EMI Available",
      value: property.emi_available ? "Yes" : "No",
    },
  ];

  return (
    <div className="rounded-3xl sm:rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-md p-4 sm:p-8 shadow-2xl min-w-0">
      <h3 className="mb-4 sm:mb-6 font-display text-lg sm:text-xl font-bold text-white bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
        Key Facts &amp; Specifications
      </h3>
      <dl className="grid grid-cols-2 gap-2.5 sm:gap-4 min-w-0">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="group flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/20 hover:bg-slate-900/50 min-w-0"
          >
            <span className="inline-flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-white/5 text-brand-400 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-500/10 group-hover:text-brand-300">
              <fact.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="flex min-w-0 flex-col leading-snug">
              <dt className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors break-words leading-tight">
                {fact.label}
              </dt>
              <dd className="break-words text-xs sm:text-sm font-bold text-white mt-0.5 leading-tight">
                {fact.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
