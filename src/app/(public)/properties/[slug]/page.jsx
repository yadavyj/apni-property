import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Mail, MapPin, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import Container from "@/components/layout/Container";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyBadges from "@/components/property/PropertyBadges";
import KeyFactsPanel from "@/components/property/KeyFactsPanel";
import LandmarksList from "@/components/property/LandmarksList";
import WhatsAppCtaButton from "@/components/property/WhatsAppCtaButton";
import ReferPropertyCard from "@/components/property/ReferPropertyCard";
import PropertyShareMenu from "@/components/property/PropertyShareMenu";
import RelatedProperties from "@/components/property/RelatedProperties";
import EnquiryForm from "@/components/forms/EnquiryForm";
import Button from "@/components/ui/Button";
import Reveal from "@/components/common/Reveal";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { BUSINESS, categoryLabel } from "@/lib/constants";
import { formatCompactCurrency, formatRate } from "@/lib/format";
import { buildPropertyWhatsAppLink } from "@/lib/whatsapp";
import { getPropertyBySlug, getRelatedProperties } from "@/lib/queries/properties";
import { getOrCreateProfile, getActiveCycle, getReferrerByCode } from "@/lib/queries/referrals";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/getSiteUrl";
import { getCoverMedia } from "@/lib/media";
import ReferralWelcomeModal from "@/components/property/ReferralWelcomeModal";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: "Property Not Found" };
  }

  const cover = getCoverMedia(property);
  const description =
    property.description?.slice(0, 155) ||
    `${categoryLabel(property.category)} in ${property.location_area}, ${property.location_city}. Verified listing from Apni Property.`;

  return {
    title: property.title,
    description,
    openGraph: {
      title: property.title,
      description,
      images: cover?.secure_url ? [{ url: cover.secure_url }] : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const { ref } = (await searchParams) || {};
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  const authPromise = createClient().then((supabase) =>
    supabase ? supabase.auth.getUser() : Promise.resolve({ data: { user: null } })
  );
  const [referrerInfo, related, authResult, activeCycle, siteUrl] = await Promise.all([
    ref ? getReferrerByCode(ref) : null,
    getRelatedProperties(property, 3),
    authPromise,
    getActiveCycle(),
    getSiteUrl(),
  ]);
  const pageUrl = `${BUSINESS.siteUrl}/properties/${property.slug}`;
  const coverMedia = getCoverMedia(property);
  const user = authResult.data.user;
  const profile = user ? await getOrCreateProfile(user) : null;
  const prize = activeCycle?.prize_description || "600 sqft plot of land";
  const referLink = profile
    ? `${siteUrl}/properties/${property.slug}?ref=${profile.referral_code}`
    : null;

  return (
    <div className="relative overflow-hidden bg-slate-950/10 min-w-0">
      {/* Referral Welcome Popup Modal when coming via ?ref=B4AFEA6 */}
      <ReferralWelcomeModal property={property} refCode={ref} referrerInfo={referrerInfo} />
      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/4 h-[450px] w-[450px] rounded-full bg-brand-500/10 opacity-40 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -left-20 top-2/3 h-[450px] w-[450px] rounded-full bg-accent-500/10 opacity-30 blur-[130px]" />

      <Container className="relative z-10 flex flex-col gap-6 sm:gap-8 pb-28 pt-6 sm:pt-10 lg:pb-16 lg:pt-10 min-w-0">
        {/* Breadcrumb Navigation */}
        <div className="flex self-start rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 backdrop-blur-md shadow-md max-w-full overflow-hidden">
          <nav className="flex items-center gap-1.5 text-xs text-slate-300 overflow-hidden flex-wrap">
            <Link href="/" className="transition-colors hover:text-brand-400 shrink-0">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0 text-slate-500" />
            <Link href="/properties" className="transition-colors hover:text-brand-400 shrink-0">
              Properties
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0 text-slate-500" />
            <Link
              href={`/properties?category=${property.category}`}
              className="transition-colors hover:text-brand-400 shrink-0 hidden sm:inline"
            >
              {categoryLabel(property.category)}
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0 text-slate-500 hidden sm:inline" />
            <span className="text-white font-semibold break-words">{property.title}</span>
          </nav>
        </div>

        {/* Main Grid: Left Details & Right Sidebar */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_390px] items-start min-w-0">
          <div className="flex flex-col gap-6 sm:gap-8 min-w-0">
            {/* Gallery */}
            <Reveal>
              <PropertyGallery
                media={property.property_media}
                title={property.title}
                initialMediaId={coverMedia?.id}
              />
            </Reveal>

            {/* Title & Badges Header */}
            <Reveal delay={0.05} className="flex flex-col gap-4 min-w-0">
              <PropertyBadges property={property} />
              <h1 className="font-display text-2xl sm:text-4xl font-black leading-tight text-white tracking-tight break-words">
                {property.title}
              </h1>
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 font-medium break-words">
                <MapPin className="h-4 w-4 shrink-0 text-brand-400" />
                {property.location_area}, {property.location_city}, {property.location_state}
              </p>

              {/* Price & Rate Highlights */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl sm:rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-5 sm:p-7 shadow-xl hover:border-brand-500/30 transition-all duration-300">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total Listing Price
                  </p>
                  <p className="font-display text-2xl sm:text-4xl font-black text-brand-300 mt-0.5 break-words">
                    {formatCompactCurrency(property.total_price)}
                  </p>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                    Calculated Rate
                  </p>
                  <p className="font-display text-lg sm:text-2xl font-bold text-white mt-0.5 break-words">
                    {formatRate(property.rate_per_sqft)}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Property Description */}
            {property.description && (
              <Reveal delay={0.1}>
                <div className="rounded-3xl sm:rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-5 sm:p-8 shadow-xl">
                  <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    About This Property
                  </h2>
                  <p className="whitespace-pre-line leading-relaxed text-slate-300 text-xs sm:text-sm font-light break-words">
                    {property.description}
                  </p>
                </div>
              </Reveal>
            )}

            {/* Key Facts Specifications */}
            <Reveal delay={0.1}>
              <KeyFactsPanel property={property} />
            </Reveal>

            {/* Nearby Landmarks */}
            <Reveal delay={0.15}>
              <LandmarksList landmarks={property.landmarks} />
            </Reveal>
          </div>

          {/* Right Sticky Sidebar */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start min-w-0">
            {/* Instant Contact & Verified Listing Banner */}
            <Reveal delay={0.1}>
              <div className="group relative p-[1px] flex flex-col overflow-hidden rounded-3xl sm:rounded-[2rem] bg-white/10 transition-all duration-500 hover:bg-linear-to-br hover:from-brand-500 hover:to-accent-500 hover:shadow-[0_20px_50px_rgba(139,92,246,0.2)]">
                <div className="relative flex flex-1 flex-col justify-between p-5 sm:p-7 rounded-[1.45rem] sm:rounded-[1.95rem] bg-slate-900/90 backdrop-blur-2xl">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 opacity-40 blur-3xl"
                  />
                  <div>
                    <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-300 shadow-md">
                      <ShieldCheck className="h-5.5 w-5.5" />
                    </span>
                    <p className="relative mt-3 text-xs font-bold text-slate-400">Interested in this property?</p>
                    <p className="relative font-display text-xl sm:text-2xl font-black text-white mt-0.5 break-words">{BUSINESS.name}</p>
                    <p className="relative mt-2 mb-5 text-xs leading-relaxed text-slate-300 font-light break-words">
                      Contact us directly for verified registry documents, site visits, and instant response from our Gorakhpur team.
                    </p>
                  </div>
                  <div className="relative flex flex-col gap-3">
                    <div className="flex w-full items-center gap-2">
                      <WhatsAppCtaButton property={property} className="flex-1 rounded-2xl font-bold py-3 text-xs sm:text-sm" />
                      <PropertyShareMenu propertyTitle={property.title} propertyId={property.id} className="flex-shrink-0" />
                    </div>
                    <Button
                      href={`mailto:${BUSINESS.email}`}
                      variant="outline"
                      className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-2xl text-xs font-semibold py-3"
                    >
                      <Mail className="h-4 w-4 mr-1.5 text-brand-400" />
                      Email Office Desk
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Referral Card */}
            <Reveal delay={0.12}>
              <ReferPropertyCard referLink={referLink} propertyTitle={property.title} prize={prize} />
            </Reveal>

            {/* Quick Enquiry Form */}
            <Reveal delay={0.15}>
              <EnquiryForm propertyId={property.id} />
            </Reveal>
          </div>
        </div>

        {/* Related Listings (3 Cards Grid) */}
        <Reveal delay={0.1}>
          <RelatedProperties properties={related} />
        </Reveal>
      </Container>

      {/* Fixed Mobile Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-white/10 bg-slate-950/95 p-3.5 sm:p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl lg:hidden">
        <div className="min-w-0 flex flex-col">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Listing Price</p>
          <p className="font-display text-lg sm:text-xl font-black text-brand-300 break-words leading-tight">
            {formatCompactCurrency(property.total_price)}
          </p>
        </div>
        <Button
          href={buildPropertyWhatsAppLink(property, pageUrl)}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          className="shrink-0 rounded-2xl font-bold px-4 py-2.5 text-xs shadow-md shadow-emerald-500/20"
        >
          <WhatsAppIcon className="h-4 w-4 mr-1.5 fill-current" />
          Enquire on WhatsApp
        </Button>
      </div>
    </div>
  );
}
