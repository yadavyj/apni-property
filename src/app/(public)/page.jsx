import Hero from "@/components/home/Hero";
import { getActiveHomeBanners } from "@/lib/queries/homeBanners";
import { getActiveHomeFaqs } from "@/lib/queries/homeFaqs";
import LocationsMarquee from "@/components/home/LocationsMarquee";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import StatsBand from "@/components/home/StatsBand";
import HowItWorks from "@/components/home/HowItWorks";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import ReferEarnBand from "@/components/home/ReferEarnBand";
import LocationQuickLinks from "@/components/home/LocationQuickLinks";
import Faq from "@/components/home/Faq";
import CtaBand from "@/components/home/CtaBand";
import { PROPERTY_CATEGORIES } from "@/lib/constants";

export default async function HomePage() {
  const [banners, faqs] = await Promise.all([getActiveHomeBanners(), getActiveHomeFaqs()]);

  return (
    <>
      <div className="flex flex-col">
        <div className="order-3 sm:order-1">
          <Hero banners={banners} />
        </div>
        <div className="order-2">
          <LocationsMarquee />
        </div>
        <div className="order-1 sm:order-3">
          <FeaturedProperties />
        </div>
      </div>
      <StatsBand />
      <HowItWorks />
      <CategoryShowcase categories={PROPERTY_CATEGORIES} />
      <WhyChooseUs />
      <Testimonials />
      <ReferEarnBand />
      <LocationQuickLinks />
      <Faq faqs={faqs} />
      <CtaBand />
    </>
  );
}
