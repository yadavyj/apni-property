import { Landmark, Building2, MapPin, ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import Button from "@/components/ui/Button";
import { getLocationHierarchy } from "@/lib/queries/properties";

export default async function LocationQuickLinks() {
  const hierarchy = await getLocationHierarchy();

  const totalStates = hierarchy.length;
  const totalCities = hierarchy.reduce((sum, s) => sum + s.cities.length, 0);
  const totalAreas = hierarchy.reduce(
    (sum, s) => sum + s.cities.reduce((citySum, c) => citySum + c.areas.length, 0),
    0
  );

  if (!totalAreas) return null;

  const stats = [
    { icon: Landmark, value: totalStates, label: totalStates === 1 ? "State" : "States" },
    { icon: Building2, value: totalCities, label: totalCities === 1 ? "City" : "Cities" },
    { icon: MapPin, value: totalAreas, label: totalAreas === 1 ? "Active Area" : "Active Areas" },
  ];

  return (
    <section className="section-divider relative overflow-hidden py-24 sm:py-32 bg-slate-950/10">
      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-500/10 opacity-40 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent-500/10 opacity-30 blur-[130px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"
      />

      <Container className="relative z-10 flex flex-col items-center gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Explore by Location"
            title="Active Regions & Prime Locations"
            align="center"
            description="Find properties located in your target residential, commercial, or agricultural sectors."
          />
        </Reveal>

        {/* Stat showcase */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {stats.map(({ icon: Icon, value, label }, index) => (
              <div
                key={label}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 px-6 py-8 sm:px-10 sm:py-10 backdrop-blur-2xl shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-500/30 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-500/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 animate-glow-pulse"
                />
                <span className="relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-brand-500/30 bg-linear-to-br from-brand-500/20 to-accent-500/10 text-brand-300 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                  <Icon className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
                </span>
                <p
                  className="relative z-10 text-gradient-animate bg-linear-to-r from-white via-white to-brand-300 bg-clip-text font-display text-3xl sm:text-5xl font-black text-transparent tabular-nums"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  {value}
                </p>
                <p className="relative z-10 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Button href="/properties" size="lg" className="group px-8 py-3.5 text-sm font-bold shadow-lg shadow-brand-500/20">
            Explore Properties
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
