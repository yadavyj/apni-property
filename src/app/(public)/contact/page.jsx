import { ArrowUpRight, Clock3, Mail, MapPin, Sparkles } from "lucide-react";
import Container from "@/components/layout/Container";
import ContactForm from "@/components/forms/ContactForm";
import Reveal from "@/components/common/Reveal";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { BUSINESS } from "@/lib/constants";
import { buildGenericWhatsAppLink } from "@/lib/whatsapp";
import { getSiteSettings } from "@/lib/queries/siteSettings";

export const metadata = {
  title: "Contact Us",
  description: `Get in touch with ${BUSINESS.name} via WhatsApp, email or Instagram for plots and properties in ${BUSINESS.city}.`,
};

function InstagramGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const CONTACT_ITEMS = [
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: "Chat with us instantly",
      href: buildGenericWhatsAppLink(settings.whatsappNumber),
      external: true,
      gradient: "from-emerald-500/20 to-teal-500/5",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]",
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      gradient: "from-brand-500/20 to-purple-500/5",
      iconColor: "text-brand-400 bg-brand-500/10 border-brand-500/20",
      borderColor: "hover:border-brand-500/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]",
    },
    {
      icon: InstagramGlyph,
      label: "Instagram",
      value: `@${settings.instagram}`,
      href: settings.instagramUrl,
      external: true,
      gradient: "from-accent-500/20 to-pink-500/5",
      iconColor: "text-accent-400 bg-accent-500/10 border-accent-500/20",
      borderColor: "hover:border-accent-500/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.15)]",
    },
    {
      icon: MapPin,
      label: "Location",
      value: settings.addressLine
        ? `${settings.addressLine}, ${settings.city}, ${settings.state}`
        : `${settings.city}, ${settings.state}`,
      gradient: "from-amber-500/20 to-orange-500/5",
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      borderColor: "hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]",
    },
  ];

  return (
    <section className="relative overflow-hidden py-8 sm:py-14 lg:py-20 bg-slate-950">
      {/* Ambient glow blobs */}
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute -left-20 -top-20 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full bg-brand-500/10 opacity-70 blur-[100px] sm:blur-[130px]"
      />
      <div
        aria-hidden
        className="animate-breathe-slow pointer-events-none absolute -right-20 top-20 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full bg-accent-500/10 opacity-60 blur-[100px] sm:blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:32px_32px] opacity-60"
      />

      <Container className="relative z-10 flex flex-col gap-6 sm:gap-10 px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-start gap-3.5 sm:gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
              Get in Touch
            </span>

            <h1 className="max-w-2xl font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              We&apos;d Love to <br />
              <span className="bg-linear-to-r from-brand-400 via-brand-500 to-accent-400 bg-clip-text text-transparent">Hear From You</span>
            </h1>

            <p className="max-w-xl text-xs sm:text-base leading-relaxed text-slate-400 font-light">
              Have a question about a listing, or want to sell your property? Reach out and our
              team will respond quickly.
            </p>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Clock3 className="h-3.5 w-3.5 shrink-0" />
              Usually replies within an hour on WhatsApp
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <div className="grid grid-cols-1 gap-4 sm:gap-5">
            {CONTACT_ITEMS.map((item, index) => {
              const content = (
                <div
                  className={`group relative flex items-center gap-3.5 sm:gap-4.5 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/5 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/60 cursor-pointer ${item.borderColor}`}
                >
                  <div
                    className={`absolute inset-0 -z-10 bg-linear-to-br ${item.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <span
                    className={`inline-flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3 ${item.iconColor}`}
                  >
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">
                      {item.label}
                    </p>
                    <p className="font-display font-bold text-white text-xs sm:text-base mt-0.5 group-hover:text-brand-300 transition-colors break-words">
                      {item.value}
                    </p>
                  </div>

                  {item.href && (
                    <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-slate-500 opacity-60 sm:opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-white" />
                  )}
                </div>
              );

              return (
                <Reveal key={item.label} delay={index * 0.06}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="block"
                    >
                      {content}
                    </a>
                  ) : (
                    <div>{content}</div>
                  )}
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <div className="group relative rounded-2xl sm:rounded-[2.2rem] p-[1px] bg-white/5 transition-all duration-500 hover:bg-linear-to-br hover:from-brand-400 hover:via-purple-500 hover:to-accent-400 hover:shadow-[0_20px_50px_rgba(139,92,246,0.2)]">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
