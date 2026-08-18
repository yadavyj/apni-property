import { Star, Wallet, BadgeCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { registryStatusLabel } from "@/lib/constants";

export default function PropertyBadges({ property, className }) {
  if (!property) return null;

  return (
    <div className={className ? className : "flex flex-wrap gap-2.5"}>
      {property.is_featured && (
        <Badge tone="accent" className="relative pl-6.5">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500"></span>
          </span>
          <Star className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      )}
      {property.emi_available && (
        <Badge tone="success" className="relative pl-6.5">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </span>
          <Wallet className="h-3 w-3 mr-1" />
          EMI Available
        </Badge>
      )}
      {property.registry_status && (
        <Badge tone="brand" className="relative pl-6.5">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500"></span>
          </span>
          <BadgeCheck className="h-3 w-3 mr-1" />
          {registryStatusLabel(property.registry_status)}
        </Badge>
      )}
    </div>
  );
}
