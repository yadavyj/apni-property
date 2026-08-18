import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Image as ImageIcon } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/admin/PropertyForm";
import MediaUploader from "@/components/admin/MediaUploader";

export const metadata = {
  title: "Edit Property",
};

export default async function EditPropertyPage({ params }) {
  const { id } = await params;
  const supabase = createAdminClient();

  let { data: property, error } = await supabase
    .from("properties")
    .select("*, property_media!property_media_property_id_fkey(*)")
    .eq("id", id)
    .maybeSingle();

  if (!property) {
    // Fallback if FK constraint alias is different in Supabase schema
    const { data: mainProperty } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (mainProperty) {
      const { data: media } = await supabase
        .from("property_media")
        .select("*")
        .eq("property_id", id)
        .order("sort_order", { ascending: true });

      property = { ...mainProperty, property_media: media || [] };
    }
  }

  if (!property) {
    notFound();
  }

  return (
    <div className="relative flex flex-col gap-6 pb-10 min-w-0">
      {/* Background Ambient Glow Blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-brand-500/10 opacity-60 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-1/3 h-[450px] w-[450px] rounded-full bg-purple-500/10 opacity-50 blur-[120px]" />

      {/* 1. ABSOLUTE ROOT TOP: Photos & Video Media Gallery */}
      <section className="relative flex flex-col gap-5 rounded-3xl border border-white/15 bg-slate-900/80 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] min-w-0">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-accent-500/20 text-accent-300 border border-accent-500/30 shrink-0 shadow-md">
              <ImageIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-base sm:text-lg font-black text-white truncate">Photos &amp; Video Media Gallery</h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">Upload, preview, play, reorder or delete property media</p>
            </div>
          </div>
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-slate-200 hover:bg-white/10 hover:text-white transition-all shadow-sm shrink-0"
          >
            <ArrowLeft className="h-4 w-4" /> Back to List
          </Link>
        </div>

        <MediaUploader
          propertyId={property.id}
          media={property.property_media || []}
          coverMediaId={property.cover_media_id}
        />
      </section>

      {/* 2. Header Workspace Banner */}
      <div className="relative overflow-hidden flex flex-col gap-3 rounded-3xl border border-white/15 bg-linear-to-r from-slate-900/90 via-slate-950/80 to-slate-900/90 p-5 sm:p-7 backdrop-blur-2xl shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-brand-300">
            <Building2 className="h-4 w-4 text-brand-400" /> Listing Details Editor
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-1 min-w-0">
          <h1 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight break-words">
            Edit Property Form
          </h1>
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-brand-300 font-semibold truncate">
            <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
            {property.title}
          </p>
        </div>
      </div>

      <PropertyForm property={property} />
    </div>
  );
}
