// Picks the property's cover photo: the explicitly assigned cover_media_id
// if present, otherwise the earliest image by sort_order. Never falls back
// to a video — a video at sort_order 0 must not become the "cover image".
export function getCoverMedia(property) {
  const media = property?.property_media || [];
  if (!media.length) return null;

  if (property.cover_media_id) {
    const explicit = media.find((m) => m.id === property.cover_media_id);
    if (explicit) return explicit;
  }

  return (
    [...media]
      .filter((m) => m.media_type === "image")
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0] || null
  );
}

export function getPropertyImages(property) {
  const images = [...(property?.property_media || [])]
    .filter((item) => item.media_type === "image")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const coverIndex = images.findIndex((item) => item.id === property?.cover_media_id);
  if (coverIndex <= 0) return images;

  const [cover] = images.splice(coverIndex, 1);
  return [cover, ...images];
}
