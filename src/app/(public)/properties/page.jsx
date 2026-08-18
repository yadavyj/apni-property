import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyGrid from "@/components/property/PropertyGrid";
import Reveal from "@/components/common/Reveal";
import { getLocationHierarchy, getFilteredProperties } from "@/lib/queries/properties";
import { cn } from "@/lib/cn";

export const metadata = {
  title: "Properties",
  description:
    "Browse verified plots, land, homes and commercial properties for sale in active regions.",
};

export default async function PropertiesPage({ searchParams }) {
  const sp = await searchParams;
  const [{ properties, total, page, totalPages }, locationHierarchy] = await Promise.all([
    getFilteredProperties(sp),
    getLocationHierarchy(),
  ]);

  function pageHref(targetPage) {
    const params = new URLSearchParams();
    Object.entries(sp || {}).forEach(([key, value]) => {
      if (key === "page" || value == null || value === "") return;
      params.set(key, value);
    });
    params.set("page", String(targetPage));
    return `/properties?${params.toString()}`;
  }

  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-12 max-w-[1440px] px-3 sm:px-6 lg:px-8 min-w-0">
      <Reveal>
        <SectionHeading
          eyebrow="All Listings"
          title="Explore Listings & Prime Lands"
          description={`${total} propert${total === 1 ? "y" : "ies"} available right now.`}
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-[300px_1fr] items-start min-w-0">
        <aside className="flex flex-col gap-4 min-w-0">
          <PropertyFilters locationHierarchy={locationHierarchy} />
        </aside>

        <div className="flex flex-col gap-6 min-w-0">
          <PropertyGrid properties={properties} />

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="flex flex-wrap items-center justify-center gap-2 pt-6"
            >
              <Link
                href={pageHref(Math.max(1, page - 1))}
                aria-disabled={page <= 1}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/40 text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/50 hover:bg-slate-900/80",
                  page <= 1 && "pointer-events-none opacity-20"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={pageHref(p)}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-all duration-200",
                    p === page
                      ? "border-brand-500 bg-linear-to-b from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/25"
                      : "border-white/10 bg-slate-900/40 text-slate-300 hover:-translate-y-0.5 hover:border-brand-500/50 hover:bg-slate-900/80"
                  )}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={pageHref(Math.min(totalPages, page + 1))}
                aria-disabled={page >= totalPages}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/40 text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/50 hover:bg-slate-900/80",
                  page >= totalPages && "pointer-events-none opacity-20"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </nav>
          )}
        </div>
      </div>
    </Container>
  );
}
