"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function calculateEmi(principal, annualRate, years) {
  const months = years * 12;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

export default function EmiCalculator() {
  const [price, setPrice] = useState(1800000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(8.5);

  const { downPayment, loanAmount, emi } = useMemo(() => {
    const downPayment = Math.round((price * downPaymentPct) / 100);
    const loanAmount = price - downPayment;
    const emi = Math.round(calculateEmi(loanAmount, rate, years));
    return { downPayment, loanAmount, emi };
  }, [price, downPaymentPct, years, rate]);

  const whatsappHref = buildWhatsAppLink(
    `Hi, I'd like an EMI quote for a property worth ${formatCurrency(price)} (~${formatCurrency(
      downPayment
    )} down payment, ${years} years). Can you share exact plans?`
  );

  return (
    <section className="py-20 sm:py-24">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Plan Your Purchase"
            title="Estimate Your Monthly EMI"
            align="center"
            description="Slide to match a property's price and see an indicative monthly instalment — some plots even offer 0% interest EMI."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-line bg-cream-soft shadow-xl shadow-black/40 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-7 p-7 sm:p-9">
              <SliderField
                label="Property Price"
                value={price}
                onChange={setPrice}
                min={300000}
                max={10000000}
                step={50000}
                display={formatCurrency(price)}
              />
              <SliderField
                label="Down Payment"
                value={downPaymentPct}
                onChange={setDownPaymentPct}
                min={0}
                max={80}
                step={5}
                display={`${downPaymentPct}% (${formatCurrency(downPayment)})`}
              />
              <SliderField
                label="Loan Tenure"
                value={years}
                onChange={setYears}
                min={1}
                max={20}
                step={1}
                display={`${years} year${years > 1 ? "s" : ""}`}
              />
              <SliderField
                label="Interest Rate"
                value={rate}
                onChange={setRate}
                min={0}
                max={15}
                step={0.5}
                display={`${rate}% p.a.`}
              />
            </div>

            <div className="flex flex-col justify-between gap-6 bg-linear-to-br from-brand-500 via-brand-600 to-brand-700 p-7 text-white sm:p-9">
              <div className="flex flex-col gap-2">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <Calculator className="h-5 w-5" />
                </span>
                <span className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
                  Estimated Monthly EMI
                </span>
                <span className="font-display text-4xl font-medium sm:text-5xl">
                  {formatCurrency(emi)}
                </span>
              </div>

              <div className="flex flex-col gap-2 border-t border-white/15 pt-5 text-sm text-brand-50/90">
                <div className="flex items-center justify-between">
                  <span>Loan Amount</span>
                  <span className="font-medium text-white">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Down Payment</span>
                  <span className="font-medium text-white">{formatCurrency(downPayment)}</span>
                </div>
              </div>

              <Button
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                className="w-full"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Get Exact Quote on WhatsApp
              </Button>

              <p className="text-xs leading-relaxed text-brand-50/70">
                Indicative estimate only, not a loan offer. Actual EMI plans (including 0%
                interest options on select plots) vary by listing — confirm with us directly.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function SliderField({ label, value, onChange, min, max, step, display }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="rounded-full bg-brand-500/20 px-3 py-1 text-sm font-semibold text-brand-400">
          {display}
        </span>
      </div>
      <input
        type="range"
        className="brand-range h-2 w-full cursor-pointer appearance-none rounded-full bg-cream-soft"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
