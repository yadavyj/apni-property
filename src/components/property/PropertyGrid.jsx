import { SearchX } from "lucide-react";
import PropertyCard from "./PropertyCard";
import EmptyState from "@/components/common/EmptyState";
import Reveal from "@/components/common/Reveal";

export default function PropertyGrid({ properties = [] }) {
  if (!properties.length) {
    return (
      <EmptyState
        icon={SearchX}
        title="No properties found"
        description="Try adjusting your filters or check back soon — new listings are added regularly."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, index) => (
        <Reveal key={property.id} delay={(index % 3) * 0.08} y={20} className="h-full min-w-0">
          <PropertyCard property={property} />
        </Reveal>
      ))}
    </div>
  );
}
