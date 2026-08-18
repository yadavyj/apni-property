"use client";

import { usePathname } from "next/navigation";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { buildGenericWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();

  // Hide floating WhatsApp button on property detail pages (/properties/[slug])
  if (pathname?.startsWith("/properties/") && pathname !== "/properties") {
    return null;
  }

  return (
    <a
      href={buildGenericWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Apni Property on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-whatsapp/30 transition-transform hover:scale-105 hover:bg-whatsapp-dark active:scale-95 sm:bottom-6 sm:right-6"
    >
      <span
        aria-hidden
        className="animate-ping-slow pointer-events-none absolute inset-0 rounded-full bg-whatsapp"
      />
      <WhatsAppIcon className="relative h-7 w-7 transition-transform duration-300 group-hover:rotate-12" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
