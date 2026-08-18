import { headers } from "next/headers";
import { BUSINESS } from "@/lib/constants";

// Builds an absolute site URL from the incoming request's actual host/port,
// so links (e.g. referral links) always match where the site is really
// running instead of a hardcoded env value that can drift (e.g. local dev
// falling back to a different port). Falls back to BUSINESS.siteUrl when
// headers aren't available (e.g. outside a request context).
export async function getSiteUrl() {
  try {
    const headerList = await headers();
    const host = headerList.get("x-forwarded-host") || headerList.get("host");
    if (!host) return BUSINESS.siteUrl;

    const protocol =
      headerList.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");

    return `${protocol}://${host}`;
  } catch {
    return BUSINESS.siteUrl;
  }
}
