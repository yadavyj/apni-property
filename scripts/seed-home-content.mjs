// One-off: seed home_banners / home_faqs / home_testimonials with the same
// sample content the homepage components fall back to (Hero.jsx, Faq.jsx,
// Testimonials.jsx DEFAULT_* arrays), so Admin → Home Customization has
// something to show/edit instead of appearing empty.
//
// Run with: node --env-file=.env.local scripts/seed-home-content.mjs

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const banners = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600",
].map((image_url, index) => ({
  image_url,
  eyebrow_text: "Trusted Real Estate Partner",
  heading: "Find Verified Plots & Land Without the Guesswork",
  subheading:
    "Registry-ready plots, homes and commercial spaces with transparent pricing, real photos and direct WhatsApp support — no middlemen, no surprises.",
  cta_label: null,
  cta_href: null,
  is_active: true,
  sort_order: index,
}));

const faqs = [
  {
    question: 'What does "registry and kabza tatkal" mean?',
    answer:
      "It means the property's registry (legal ownership transfer) and kabza (physical possession) can both be completed immediately, with no waiting period after you decide to buy.",
  },
  {
    question: "Do you offer EMI options on plots?",
    answer:
      'Yes, select listings come with EMI plans, including 0% interest options on some plots. Look for the "EMI Available" badge on a listing, or ask us on WhatsApp.',
  },
  {
    question: "Can I visit a property before buying?",
    answer:
      "Absolutely. Message us on WhatsApp with the listing you're interested in, and we'll arrange a convenient site visit for you.",
  },
  {
    question: "Which areas do you cover?",
    answer:
      "We list plots, homes, and commercial spaces across all key active sectors, with new locations added regularly. Explore our interactive locations map above to see where our listings are concentrated.",
  },
  {
    question: "How do I get more details about a listing?",
    answer:
      'Every listing has a "Contact on WhatsApp" button that opens a chat with us, or use the enquiry form on the listing page and we\'ll get back to you.',
  },
].map((f, index) => ({ ...f, is_active: true, sort_order: index }));

const testimonials = [
  {
    customer_name: "Rakesh Yadav",
    customer_role: "Verified Buyer, Rani Dinha",
    message:
      "Registry aur kabza dono ek hi hafte mein complete ho gaye. No middlemen, no surprises — bilkul jaisa website pe likha tha.",
    rating: 5,
  },
  {
    customer_name: "Sunita Devi",
    customer_role: "Verified Buyer, Motiram Adda",
    message:
      "WhatsApp pe hi saari details mil gayi, site visit bhi turant arrange ho gaya. Pricing bhi bilkul transparent thi.",
    rating: 5,
  },
  {
    customer_name: "Ajay Singh",
    customer_role: "Verified Buyer, Sonbarsha",
    message:
      "0% EMI plan ki wajah se plot lena aasan ho gaya. Team ne har step pe support kiya, bahut satisfied hoon.",
    rating: 5,
  },
  {
    customer_name: "Meena Kumari",
    customer_role: "Verified Buyer, Kashipuram Colony",
    message:
      "Documents pehle hi verify the, isliye registry ke time koi dikkat nahi aayi. Bahut hi smooth experience raha.",
    rating: 5,
  },
].map((t, index) => ({ ...t, is_active: true, sort_order: index }));

async function seed() {
  const { data: existingBanners, error: bannerCheckError } = await supabase
    .from("home_banners")
    .select("id");
  if (bannerCheckError) {
    console.warn(
      `Skipped home_banners — table not reachable yet (run supabase/migrations/0003_home_banners.sql first): ${bannerCheckError.message}`
    );
  } else if (!existingBanners?.length) {
    const { error } = await supabase.from("home_banners").insert(banners);
    if (error) throw new Error(`home_banners: ${error.message}`);
    console.log(`Inserted ${banners.length} home_banners rows.`);
  } else {
    console.log(`Skipped home_banners — ${existingBanners.length} row(s) already exist.`);
  }

  const { data: existingFaqs } = await supabase.from("home_faqs").select("id");
  if (!existingFaqs?.length) {
    const { error } = await supabase.from("home_faqs").insert(faqs);
    if (error) throw new Error(`home_faqs: ${error.message}`);
    console.log(`Inserted ${faqs.length} home_faqs rows.`);
  } else {
    console.log(`Skipped home_faqs — ${existingFaqs.length} row(s) already exist.`);
  }

  const { data: existingTestimonials } = await supabase.from("home_testimonials").select("id");
  if (!existingTestimonials?.length) {
    const { error } = await supabase.from("home_testimonials").insert(testimonials);
    if (error) throw new Error(`home_testimonials: ${error.message}`);
    console.log(`Inserted ${testimonials.length} home_testimonials rows.`);
  } else {
    console.log(`Skipped home_testimonials — ${existingTestimonials.length} row(s) already exist.`);
  }
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
