import SectionHeading from "@/components/common/SectionHeading";
import PropertyCard from "./PropertyCard";
import Reveal from "@/components/common/Reveal";

export default function RelatedProperties({ properties = [] }) {
  if (!properties.length) return null;

  // Render exactly 3 cards side-by-side
  const displayProperties = properties.slice(0, 3);

  return (
    <section className="flex flex-col gap-6 sm:gap-8 pt-4 min-w-0">
      <SectionHeading eyebrow="Similar Listings" title="You May Also Like" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
        {displayProperties.map((prop, idx) => (
          <Reveal key={prop.id} delay={idx * 0.08} y={20} className="h-full min-w-0">
            <PropertyCard property={prop} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
