import { Image as ImageIcon, HelpCircle, Star, Sparkles, Building2 } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import HomeBannersManager from "@/components/admin/HomeBannersManager";
import HomeFaqsManager from "@/components/admin/HomeFaqsManager";
import HomeTestimonialsManager from "@/components/admin/HomeTestimonialsManager";
import HomeFeaturedManager from "@/components/admin/HomeFeaturedManager";
import { getAllHomeBanners } from "@/lib/queries/homeBanners";
import { getAllHomeFaqs } from "@/lib/queries/homeFaqs";
import { getAllHomeTestimonials } from "@/lib/queries/homeTestimonials";
import { getPropertiesForFeaturedPicker } from "@/lib/queries/properties";

export const metadata = {
  title: "Home Customization",
};

export default async function AdminHomePage() {
  const [banners, faqs, testimonials, pickerProperties] = await Promise.all([
    getAllHomeBanners(),
    getAllHomeFaqs(),
    getAllHomeTestimonials(),
    getPropertiesForFeaturedPicker(),
  ]);

  const featuredCount = pickerProperties.filter((p) => p.is_featured).length;

  const tabs = [
    {
      key: "banners",
      label: "Hero Banners",
      icon: <ImageIcon className="h-4 w-4 text-brand-400" />,
      count: banners.length,
      description:
        "Configure Hero slideshow photos, headline copy, eyebrow tags, and WhatsApp / property action buttons. Active banners cycle automatically on the homepage.",
      content: <HomeBannersManager banners={banners} />,
    },
    {
      key: "featured",
      label: "Featured Properties",
      icon: <Building2 className="h-4 w-4 text-purple-400" />,
      count: featuredCount,
      description:
        "Pick which listings appear in the \"Featured Properties\" section on the homepage. Only Published listings show up there — up to 12 are displayed, newest first.",
      content: <HomeFeaturedManager properties={pickerProperties} />,
    },
    {
      key: "faqs",
      label: "FAQs",
      icon: <HelpCircle className="h-4 w-4 text-emerald-400" />,
      count: faqs.length,
      description: "Edit questions and answers shown in the FAQ accordion on the landing page.",
      content: <HomeFaqsManager faqs={faqs} />,
    },
    {
      key: "testimonials",
      label: "Testimonials",
      icon: <Star className="h-4 w-4 text-amber-400" />,
      count: testimonials.length,
      description:
        "Manage customer reviews shown on the landing page — photo, client name, star rating and review quote.",
      content: <HomeTestimonialsManager testimonials={testimonials} />,
    },
  ];

  return (
    <div className="relative flex flex-col gap-8 pb-10">
      {/* Background Glow Mesh */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-brand-500/10 opacity-60 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-1/3 h-[450px] w-[450px] rounded-full bg-accent-500/10 opacity-50 blur-[120px]" />

      {/* Header Banner */}
      <div className="relative overflow-hidden flex flex-col gap-2 rounded-3xl border border-white/15 bg-linear-to-r from-slate-900/90 via-slate-950/80 to-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-300">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            Media & Copy Customization
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
          Home Customization
        </h1>
        <p className="max-w-3xl text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          Customize homepage slideshow banners, featured graphics, landing FAQs, and customer reviews in real-time.
        </p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
