import { Mail, Phone } from "lucide-react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/common/Reveal";
import Spotlight from "@/components/common/Spotlight";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { buildGenericWhatsAppLink } from "@/lib/whatsapp";
import { BUSINESS } from "@/lib/constants";

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-slate-950/20">
      <Container>
        {/* Floating Glassmorphic Box */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-md p-10 sm:p-16 shadow-2xl shadow-black/50">

          {/* Cursor-following glow */}
          <Spotlight size={460} />

          {/* Decorative Blur Blobs */}
          <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-500/10 opacity-60 blur-[100px] animate-pulse" />
          <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accent-500/10 opacity-50 blur-[100px] animate-pulse" />

          {/* Dotted Grid Pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[20px_20px]"
          />

          <div className="relative z-10 flex flex-col items-center gap-7 text-center">
            <Reveal className="flex flex-col items-center gap-7">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Let&apos;s Talk
              </span>

              <h2 className="max-w-2xl font-display text-3xl font-black sm:text-4xl lg:text-5xl leading-tight bg-linear-to-b from-white via-white to-slate-300 bg-clip-text text-transparent">
                Have a Property to Sell, <br />
                <span className="bg-linear-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">or Looking to Buy?</span>
              </h2>
              
              <p className="max-w-xl text-sm leading-relaxed text-slate-400">
                Tell us what you need &mdash; we&apos;ll help you find the right plot, home, or buyer, fast and stress-free.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Button
                  href={buildGenericWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="lg"
                  className="rounded-xl shadow-lg shadow-whatsapp/20 hover:shadow-xl hover:shadow-whatsapp/30 transition-all duration-300"
                >
                  <WhatsAppIcon className="h-5 w-5 mr-1.5" />
                  Talk to Us on WhatsApp
                </Button>
                <Button
                  href={`mailto:${BUSINESS.email}`}
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-white/10 hover:border-brand-500/40 hover:bg-brand-500/10 text-white transition-all duration-300"
                >
                  <Mail className="h-4 w-4 mr-1.5" />
                  Email Us
                </Button>
              </div>

              <a
                href={`tel:+${BUSINESS.whatsappNumber}`}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-300 border-t border-white/5 pt-4 w-full justify-center"
              >
                <Phone className="h-4 w-4 text-brand-400" />+{BUSINESS.whatsappNumber}
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

