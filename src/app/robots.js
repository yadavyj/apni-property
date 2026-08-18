import { BUSINESS } from "@/lib/constants";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${BUSINESS.siteUrl}/sitemap.xml`,
  };
}
