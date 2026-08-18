export const BUSINESS = {
  name: "Apni Property",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918381910274",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "apniproperty8381@gmail.com",
  instagram: process.env.NEXT_PUBLIC_BUSINESS_INSTAGRAM || "apni.property1",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || `https://www.instagram.com/${process.env.NEXT_PUBLIC_BUSINESS_INSTAGRAM || "apni.property1"}`,
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
  xUrl: process.env.NEXT_PUBLIC_X_URL || "",
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  city: "Gorakhpur",
  state: "Uttar Pradesh",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const REWARD_VALUES = {
  referralSignup: 50,
  propertyShare: 5,
  socialFollow: 10,
};

export const SOCIAL_REWARD_OPTIONS = [
  { platform: "instagram", label: "Instagram", points: REWARD_VALUES.socialFollow, url: BUSINESS.instagramUrl },
  { platform: "facebook", label: "Facebook", points: REWARD_VALUES.socialFollow, url: BUSINESS.facebookUrl },
  { platform: "youtube", label: "YouTube", points: REWARD_VALUES.socialFollow, url: BUSINESS.youtubeUrl },
  { platform: "x", label: "X / Twitter", points: REWARD_VALUES.socialFollow, url: BUSINESS.xUrl },
  { platform: "linkedin", label: "LinkedIn", points: REWARD_VALUES.socialFollow, url: BUSINESS.linkedinUrl },
];

export const PROPERTY_CATEGORIES = [
  { value: "plot", label: "Plot" },
  { value: "flat", label: "Flat" },
  { value: "house", label: "House" },
  { value: "commercial", label: "Commercial" },
  { value: "agricultural", label: "Agricultural" },
];

export const REGISTRY_STATUSES = [
  { value: "registry_kabza_tatkal", label: "Registry & Kabza Tatkal" },
  { value: "registry_only", label: "Registry Ready" },
  { value: "kabza_only", label: "Kabza Only" },
  { value: "under_process", label: "Under Process" },
];

export const PROPERTY_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "sold", label: "Sold" },
  { value: "archived", label: "Archived" },
];

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export function categoryLabel(value) {
  return PROPERTY_CATEGORIES.find((c) => c.value === value)?.label || value;
}

export function registryStatusLabel(value) {
  return REGISTRY_STATUSES.find((r) => r.value === value)?.label || value;
}
