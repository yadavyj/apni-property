"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import { BUSINESS } from "@/lib/constants";

const DEFAULT_FAQS = [
  {
    q: "What does \"registry and kabza tatkal\" mean?",
    a: "It means the property's registry (legal ownership transfer) and kabza (physical possession) can both be completed immediately, with no waiting period after you decide to buy.",
  },
  {
    q: "Do you offer EMI options on plots?",
    a: "Yes, select listings come with EMI plans, including 0% interest options on some plots. Look for the \"EMI Available\" badge on a listing, or ask us on WhatsApp.",
  },
  {
    q: "Can I visit a property before buying?",
    a: "Absolutely. Message us on WhatsApp with the listing you're interested in, and we'll arrange a convenient site visit for you.",
  },
  {
    q: "Which areas do you cover?",
    a: "We list plots, homes, and commercial spaces across all key active sectors, with new locations added regularly. Explore our interactive locations map above to see where our listings are concentrated.",
  },
  {
    q: "How do I get more details about a listing?",
    a: `Every listing has a "Contact on WhatsApp" button that opens a chat with us at ${BUSINESS.whatsappNumber}, or use the enquiry form on the listing page and we'll get back to you.`,
  },
];

export default function Faq({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0);
  const FAQS = faqs.length
    ? faqs.map((f) => ({ q: f.question, a: f.answer }))
    : DEFAULT_FAQS;

  return (
    <section className="section-divider relative overflow-hidden py-24 sm:py-32 bg-slate-950/10">
      {/* Ambient background lighting blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-500/5 opacity-40 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-accent-500/5 opacity-30 blur-[120px]"
      />

      <Container className="relative z-10 mx-auto flex max-w-3xl flex-col gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Questions & Answers"
            title="Frequently Asked Questions"
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-4">
            {FAQS.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={item.q}
                  className={`group overflow-hidden rounded-[20px] border transition-all duration-300 ${isOpen ? "bg-slate-900/60 border-brand-500/30 shadow-[0_15px_30px_-5px_rgba(139,92,246,0.12)]" : "bg-slate-900/20 border-white/5 hover:bg-slate-900/40 hover:border-white/10"}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className={`h-4.5 w-4.5 shrink-0 transition-colors duration-300 ${isOpen ? "text-brand-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                      <span className={`font-display text-base font-semibold leading-snug transition-colors duration-300 ${isOpen ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                        {item.q}
                      </span>
                    </span>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "border-brand-500/30 bg-brand-500/10 text-brand-400 rotate-180" : "border-white/10 text-slate-400 group-hover:text-white group-hover:border-white/25"}`}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pl-[38px] text-sm leading-relaxed text-slate-400 border-t border-white/5 pt-4 bg-slate-950/20">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

