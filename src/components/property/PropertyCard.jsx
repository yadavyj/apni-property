import Link from "next/link";
import { MapPin, Ruler, MessageCircle, ArrowUpRight, Star, Wallet, BadgeCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import PropertyCardGallery from "@/components/property/PropertyCardGallery";
import { BUSINESS, categoryLabel, registryStatusLabel } from "@/lib/constants";
import { formatArea, formatCompactCurrency, formatRate } from "@/lib/format";
import { getPropertyImages } from "@/lib/media";
import { buildPropertyWhatsAppLink } from "@/lib/whatsapp";

export default function PropertyCard({ property, hideEmi }) {
  const images = getPropertyImages(property);
  const pageUrl = `${BUSINESS.siteUrl}/properties/${property.slug}`;
  const propertyHref = `/properties/${property.slug}`;

  return (
    <div className="group relative p-[1px] flex flex-col h-full overflow-hidden rounded-[24px] bg-white/10 transition-all duration-500 hover:bg-linear-to-br hover:from-brand-400 hover:via-purple-500 hover:to-accent-400 hover:shadow-[0_20px_50px_rgba(139,92,246,0.35)] hover:-translate-y-1.5 min-w-0">
      {/* Inner Container */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-[23px] bg-slate-900/70 backdrop-blur-xl transition-all duration-500 group-hover:bg-slate-950/90 min-w-0">
        
        {/* Image/Media Section */}
        <div className="relative block aspect-4/3 overflow-hidden bg-slate-950">
          <PropertyCardGallery images={images} title={property.title} href={propertyHref} />
          
          {/* Shadow Overlay Gradient */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
          
          {/* Floating Category Badge */}
          <span className="absolute left-3.5 top-3.5 z-10">
            <span className="rounded-full bg-slate-950/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-200 shadow-lg backdrop-blur-md border border-white/10">
              {categoryLabel(property.category)}
            </span>
          </span>

          {/* Floating Rate Tag */}
          <span className="absolute bottom-3.5 left-3.5 z-10">
            <span className="rounded-xl bg-black/75 px-3 py-1 text-[11px] font-bold text-amber-300 shadow-md backdrop-blur-md border border-white/10 font-mono">
              {formatRate(property.rate_per_sqft)}
            </span>
          </span>

          {/* Glowing View Property Trigger */}
          <span className="absolute right-3.5 bottom-3.5 z-10 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/40 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
            <ArrowUpRight className="h-4.5 w-4.5" />
          </span>
        </div>

        {/* Content Details */}
        <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5 min-w-0">
          <div className="flex flex-col gap-2.5 min-w-0">
            {/* Custom Sleek Badge List with Pulsing Indicators */}
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {property.is_featured && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
                  </span>
                  Featured
                </span>
              )}
              {property.emi_available && !hideEmi && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  EMI Ready
                </span>
              )}
              {property.registry_status && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                  </span>
                  {registryStatusLabel(property.registry_status)}
                </span>
              )}
            </div>

            {/* Title & Compact Elegantly Sized Price */}
            <div className="flex flex-col gap-1 min-w-0">
              <Link href={`/properties/${property.slug}`}>
                <h3 className="font-display text-sm sm:text-base font-bold text-white transition-colors duration-300 hover:text-brand-400 leading-snug break-words">
                  {property.title}
                </h3>
              </Link>
              
              <p className="font-display text-base sm:text-lg font-black text-brand-300 mt-0.5 break-words">
                {formatCompactCurrency(property.total_price)}
              </p>
            </div>

            {/* Quick Specifications capsules */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 min-w-0">
              <div className="flex items-center gap-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-brand-300 transition-colors duration-300 group-hover:bg-brand-500/20 min-w-0">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-400 shrink-0" />
                <span className="break-words">{property.location_area}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-blue-300 transition-colors duration-300 group-hover:bg-blue-500/20 shrink-0">
                <Ruler className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-400 shrink-0" />
                <span>{formatArea(property.area_sqft)}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs Bar */}
          <div className="mt-1 flex items-center gap-2 sm:gap-2.5 pt-2 min-w-0">
            <Button 
              href={`/properties/${property.slug}`} 
              variant="outline" 
              size="sm" 
              className="flex-1 rounded-2xl border-white/10 hover:border-brand-500/40 hover:bg-brand-500/15 text-white font-bold transition-all duration-300 text-xs py-2"
            >
              View Details
            </Button>
            
            <Button
              href={buildPropertyWhatsAppLink(property, pageUrl)}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="sm"
              className="flex-1 rounded-2xl font-bold bg-whatsapp hover:bg-whatsapp-dark shadow-md shadow-whatsapp/20 hover:shadow-lg transition-all duration-300 text-xs py-2"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 mr-1 fill-current" /> WhatsApp
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
