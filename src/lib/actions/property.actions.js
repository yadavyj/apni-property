"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { propertySchema } from "@/lib/validations/property.schema";
import { slugifyWithSuffix } from "@/lib/slugify";
import cloudinary from "@/lib/cloudinary/config";
import { CACHE_TAGS } from "@/lib/cacheTags";

function refreshPublicProperties() {
  updateTag(CACHE_TAGS.properties);
}

export async function createProperty(rawData) {
  await requireAdmin();
  const data = propertySchema.parse(rawData);
  const supabase = createAdminClient();

  const { data: property, error } = await supabase
    .from("properties")
    .insert({
      ...data,
      slug: slugifyWithSuffix(data.title),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  refreshPublicProperties();
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePath("/");

  return property;
}

export async function updateProperty(id, rawData) {
  await requireAdmin();
  const data = propertySchema.parse(rawData);
  const supabase = createAdminClient();

  const { data: property, error } = await supabase
    .from("properties")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  refreshPublicProperties();
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${id}/edit`);
  revalidatePath("/properties");
  revalidatePath(`/properties/${property.slug}`);
  revalidatePath("/");

  return property;
}

export async function togglePropertyStatus(id, status) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("properties")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  refreshPublicProperties();
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePath("/");
}

export async function toggleFeatured(id, is_featured) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("properties")
    .update({ is_featured })
    .eq("id", id);

  if (error) throw new Error(error.message);

  refreshPublicProperties();
  revalidatePath("/admin/properties");
  revalidatePath("/admin/home");
  revalidatePath("/");
}

export async function deleteProperty(id) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: media } = await supabase
    .from("property_media")
    .select("cloudinary_public_id, media_type")
    .eq("property_id", id);

  if (media?.length) {
    await Promise.all(
      media.map((m) =>
        cloudinary.uploader
          .destroy(m.cloudinary_public_id, {
            resource_type: m.media_type === "video" ? "video" : "image",
          })
          .catch(() => null)
      )
    );
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw new Error(error.message);

  refreshPublicProperties();
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePath("/");
}

export async function attachMedia(propertyId, media) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("property_media")
    .select("id", { count: "exact", head: true })
    .eq("property_id", propertyId);

  const { data: inserted, error } = await supabase
    .from("property_media")
    .insert({
      property_id: propertyId,
      media_type: media.resource_type === "video" ? "video" : "image",
      cloudinary_public_id: media.public_id,
      secure_url: media.secure_url,
      width: media.width || null,
      height: media.height || null,
      duration: media.duration || null,
      sort_order: count || 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Auto-assign the cover photo the first time an image lands on a property
  // that doesn't have one yet — an earlier video upload (sort_order 0)
  // shouldn't permanently block every later image from becoming the cover.
  if (inserted.media_type === "image") {
    const { data: currentProperty } = await supabase
      .from("properties")
      .select("cover_media_id")
      .eq("id", propertyId)
      .single();

    if (!currentProperty?.cover_media_id) {
      await supabase
        .from("properties")
        .update({ cover_media_id: inserted.id })
        .eq("id", propertyId);
    }
  }

  refreshPublicProperties();
  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath("/properties");
  revalidatePath("/");

  return inserted;
}

export async function deleteMedia(mediaId, propertyId) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: mediaRow } = await supabase
    .from("property_media")
    .select("cloudinary_public_id, media_type")
    .eq("id", mediaId)
    .single();

  if (mediaRow) {
    await cloudinary.uploader
      .destroy(mediaRow.cloudinary_public_id, {
        resource_type: mediaRow.media_type === "video" ? "video" : "image",
      })
      .catch(() => null);
  }

  const { error } = await supabase
    .from("property_media")
    .delete()
    .eq("id", mediaId);

  if (error) throw new Error(error.message);

  refreshPublicProperties();
  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath("/properties");
  revalidatePath("/");
}

export async function reorderMedia(propertyId, orderedMediaIds) {
  await requireAdmin();
  const supabase = createAdminClient();

  await Promise.all(
    orderedMediaIds.map((id, index) =>
      supabase.from("property_media").update({ sort_order: index }).eq("id", id)
    )
  );

  refreshPublicProperties();
  revalidatePath(`/admin/properties/${propertyId}/edit`);
}
