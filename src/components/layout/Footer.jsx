import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import Container from "./Container";
import { PROPERTY_CATEGORIES } from "@/lib/constants";
import { buildGenericWhatsAppLink } from "@/lib/whatsapp";
import { getSiteSettings } from "@/lib/queries/siteSettings";

function InstagramGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// lucide-react dropped brand/logo icons, so these are hand-rolled to match
// the outline style of the rest of the icon set.
function FacebookGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M15 3h-2a5 5 0 0 0-5 5v3H6v4h2v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getSiteSettings();

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-400 border-t border-white/5">
      {/* Decorative top border gradient line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-500/40 to-transparent"
      />
      {/* Glow Backdrops */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-500/5 opacity-50 blur-3xl animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent-500/5 opacity-40 blur-3xl animate-pulse"
      />

      <Container className="relative z-10 grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="flex flex-col gap-5">
          <span className="font-display text-2xl font-black bg-linear-to-r from-white via-white to-brand-300 bg-clip-text text-transparent">
            Apni Property
          </span>
          <p className="text-sm leading-relaxed text-slate-400">
            Verified plots, land, and houses with complete transparency. Direct WhatsApp support and zero hidden charges.
          </p>
          <p className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="h-4.5 w-4.5 shrink-0 text-brand-400" />
            {settings.addressLine ? `${settings.addressLine}, ` : ""}
            {settings.city}, {settings.state}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-sm font-bold tracking-wider uppercase text-white">Quick Links</span>
          <div className="flex flex-col gap-2.5">
            <Link href="/" className="text-sm text-slate-400 transition-colors duration-200 hover:text-brand-400 hover:translate-x-0.5 inline-block">
              Home
            </Link>
            <Link href="/properties" className="text-sm text-slate-400 transition-colors duration-200 hover:text-brand-400 hover:translate-x-0.5 inline-block">
              Properties
            </Link>
            <Link href="/about" className="text-sm text-slate-400 transition-colors duration-200 hover:text-brand-400 hover:translate-x-0.5 inline-block">
              About
            </Link>
            <Link href="/contact" className="text-sm text-slate-400 transition-colors duration-200 hover:text-brand-400 hover:translate-x-0.5 inline-block">
              Contact
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-sm font-bold tracking-wider uppercase text-white">Categories</span>
          <div className="flex flex-col gap-2.5">
            {PROPERTY_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/properties?category=${cat.value}`}
                className="text-sm text-slate-400 transition-colors duration-200 hover:text-brand-400 hover:translate-x-0.5 inline-block"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-sm font-bold tracking-wider uppercase text-white">Get in Touch</span>
          <div className="flex flex-col gap-3">
            <a
              href={buildGenericWhatsAppLink(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-all duration-300 group-hover:bg-whatsapp/20 group-hover:border-whatsapp/30 group-hover:scale-105">
                <WhatsAppIcon className="h-4.5 w-4.5 text-whatsapp" />
              </span>
              WhatsApp Support
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="group flex items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-all duration-300 group-hover:bg-brand-500/20 group-hover:border-brand-500/30 group-hover:scale-105">
                <Mail className="h-4.5 w-4.5 text-brand-400" />
              </span>
              {settings.email}
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-all duration-300 group-hover:bg-accent-500/20 group-hover:border-accent-500/30 group-hover:scale-105">
                <InstagramGlyph className="h-4.5 w-4.5 text-accent-400" />
              </span>
              Instagram
            </a>
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 group-hover:scale-105">
                  <FacebookGlyph className="h-4.5 w-4.5 text-blue-400" />
                </span>
                Facebook
              </a>
            )}
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-all duration-300 group-hover:bg-red-500/20 group-hover:border-red-500/30 group-hover:scale-105">
                  <YoutubeGlyph className="h-4.5 w-4.5 text-red-400" />
                </span>
                YouTube
              </a>
            )}
          </div>
        </div>
      </Container>

      <div className="relative border-t border-white/5 bg-slate-950/60">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-slate-500 sm:flex-row">
          <span>
            &copy; {year} {settings.name}. All rights reserved.
          </span>
          <span>Verified plots and transparent property listings.</span>
        </Container>
      </div>
    </footer>
  );
}

