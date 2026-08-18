import { CldImage } from "next-cloudinary";
import { Quote, Star } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import ViewportMotion from "@/components/common/ViewportMotion";
import { getActiveHomeTestimonials } from "@/lib/queries/homeTestimonials";

const DEFAULT_TESTIMONIALS = [
  {
    id: "default-1",
    customer_name: "Rakesh Yadav",
    customer_role: "Verified Buyer, Rani Dinha",
    message:
      "Registry aur kabza dono ek hi hafte mein complete ho gaye. No middlemen, no surprises — bilkul jaisa website pe likha tha.",
    rating: 5,
    avatar_url: null,
  },
  {
    id: "default-2",
    customer_name: "Sunita Devi",
    customer_role: "Verified Buyer, Motiram Adda",
    message:
      "WhatsApp pe hi saari details mil gayi, site visit bhi turant arrange ho gaya. Pricing bhi bilkul transparent thi.",
    rating: 5,
    avatar_url: null,
  },
  {
    id: "default-3",
    customer_name: "Ajay Singh",
    customer_role: "Verified Buyer, Sonbarsha",
    message:
      "0% EMI plan ki wajah se plot lena aasan ho gaya. Team ne har step pe support kiya, bahut satisfied hoon.",
    rating: 5,
    avatar_url: null,
  },
  {
    id: "default-4",
    customer_name: "Meena Kumari",
    customer_role: "Verified Buyer, Kashipuram Colony",
    message:
      "Documents pehle hi verify the, isliye registry ke time koi dikkat nahi aayi. Bahut hi smooth experience raha.",
    rating: 5,
    avatar_url: null,
  },
];

function initials(name) {
  const parts = (name || "").trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function TestimonialCard({ t }) {
  return (
    <div className="group relative flex h-full w-[300px] shrink-0 flex-col gap-6 rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-xl transition-all duration-500 hover:border-brand-500/20 hover:bg-slate-900/60 hover:-translate-y-1 hover:shadow-brand-500/5 sm:w-[360px] sm:p-7">
      {/* Glow effect on hover */}
      <div className="absolute -inset-px -z-10 rounded-3xl bg-radial-gradient from-brand-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-center justify-between">
        <Quote className="h-8 w-8 text-brand-400/20 transition-colors duration-300 group-hover:text-brand-400/40" />
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`h-3.5 w-3.5 transition-all duration-300 group-hover:scale-110 ${n <= t.rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-700"}`}
            />
          ))}
        </div>
      </div>

      <p className="flex-1 text-sm leading-relaxed text-slate-300 group-hover:text-slate-200 transition-colors duration-300 font-medium">&ldquo;{t.message}&rdquo;</p>

      <div className="flex items-center gap-3 border-t border-white/5 pt-4">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-brand-500/10 text-sm font-bold text-brand-400 transition-all duration-300 group-hover:scale-105 group-hover:border-brand-500/30">
          {t.avatar_url ? (
            <CldImage
              src={t.avatar_public_id}
              alt={t.customer_name}
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : (
            initials(t.customer_name)
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white group-hover:text-brand-300 transition-colors duration-300">{t.customer_name}</p>
          {t.customer_role && <p className="truncate text-xs font-semibold text-slate-500 group-hover:text-slate-400 transition-colors duration-300">{t.customer_role}</p>}
        </div>
      </div>
    </div>
  );
}

export default async function Testimonials() {
  const testimonials = await getActiveHomeTestimonials();
  const items = testimonials.length ? testimonials : DEFAULT_TESTIMONIALS;
  const track = items.length > 1 ? [...items, ...items] : items;

  return (
    <ViewportMotion as="section" className="section-divider relative overflow-hidden py-24 sm:py-32 bg-slate-950/20">
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-brand-500/5 opacity-40 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-accent-500/5 opacity-30 blur-[130px]" />

      <Container className="relative z-10">
        <Reveal>
          <SectionHeading
            eyebrow="Customer Stories"
            title="What Our Customers Say"
            align="center"
            description="Real experiences from buyers who found their plot through Apni Property."
          />
        </Reveal>
      </Container>

      <div className="relative z-10 mt-16 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className="viewport-animation flex w-max items-stretch gap-6 animate-marquee"
          style={{ animationDuration: "35s" }}
        >
          {track.map((t, index) => (
            <TestimonialCard key={`${t.id}-${index}`} t={t} />
          ))}
        </div>
      </div>
    </ViewportMotion>
  );
}
