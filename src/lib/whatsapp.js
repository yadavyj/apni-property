import { BUSINESS } from "@/lib/constants";
import { formatCurrency, formatArea } from "@/lib/format";

export function buildWhatsAppLink(message, phone = BUSINESS.whatsappNumber) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * Build WhatsApp share link without forcing a specific recipient
 * Shows WhatsApp contact selection instead of opening a specific chat
 * @param {string} message - Message to share
 * @returns {string} WhatsApp share URL
 */
export function buildWhatsAppShareLink(message) {
  const encoded = encodeURIComponent(message);
  // Using api.whatsapp.com/send with just text (no phone) shows contact picker
  return `https://api.whatsapp.com/send?text=${encoded}`;
}

export function buildPropertyWhatsAppLink(property, pageUrl, phone) {
  const lines = [
    `Hi, I'm interested in this property:`,
    property.title,
    `Location: ${property.location_area}, ${property.location_city}`,
    `Area: ${formatArea(property.area_sqft)}`,
    `Rate: ${formatCurrency(property.rate_per_sqft)}/sqft`,
    pageUrl ? pageUrl : null,
  ].filter(Boolean);

  return buildWhatsAppLink(lines.join("\n"), phone);
}

export function buildGenericWhatsAppLink(phone) {
  return buildWhatsAppLink(
    "Hi, I'm looking for a property in Gorakhpur. Can you help me?",
    phone
  );
}
