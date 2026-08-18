export function normalizeCloudinaryImageSource(value) {
  if (typeof value !== "string") return { type: "empty", url: "", publicId: "" };

  const trimmed = value.trim();
  if (!trimmed) return { type: "empty", url: "", publicId: "" };

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return { type: "url", url: trimmed, publicId: "" };
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloudName) {
    return { type: "empty", url: "", publicId: "" };
  }

  return {
    type: "publicId",
    url: `https://res.cloudinary.com/${cloudName}/image/upload/${trimmed}`,
    publicId: trimmed,
  };
}
