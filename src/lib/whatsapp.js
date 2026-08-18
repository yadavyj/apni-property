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
  const lines = ["Hi, I'm interested in this property:"];

  const title = property?.title?.trim();
  if (title) {
    lines.push(`Property: ${title}`);
  }

  const location = [property?.location_area, property?.location_city]
    .filter((value) => typeof value === "string" && value.trim())
    .join(", ");
  if (location) {
    lines.push(`Location: ${location}`);
  }

  const area = property?.area_sqft != null ? formatArea(property.area_sqft) : null;
  if (area && area !== "-") {
    lines.push(`Area: ${area}`);
  }

  const rate = property?.rate_per_sqft != null ? `${formatCurrency(property.rate_per_sqft)}/sqft` : null;
  if (rate && rate !== "-/sqft") {
    lines.push(`Rate: ${rate}`);
  }

  if (pageUrl) {
    lines.push(`Property URL: ${pageUrl}`);
  }

  return buildWhatsAppLink(lines.join("\n"), phone);
}

export function buildGenericWhatsAppLink(phone) {
  return buildWhatsAppLink(
    "Hi, I'm looking for a property in Gorakhpur. Can you help me?",
    phone
  );
}
