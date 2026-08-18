"use client";

import { useState } from "react";
import { CldImage } from "next-cloudinary";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { normalizeCloudinaryImageSource } from "@/lib/cloudinary/normalizeImageSource";

export default function PropertyImage({
  src,
  alt,
  className,
  fallbackClassName,
  iconClassName = "h-8 w-8",
  fill,
  priority,
  unoptimized,
  ...props
}) {
  const [failed, setFailed] = useState(false);
  const normalized = normalizeCloudinaryImageSource(src);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-slate-900 to-slate-950 text-slate-500",
          fallbackClassName
        )}
      >
        <ImageOff className={cn("opacity-30", iconClassName)} />
      </div>
    );
  }

  if (!normalized.url) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-slate-900 to-slate-950 text-slate-500",
          fallbackClassName
        )}
      >
        <ImageOff className={cn("opacity-30", iconClassName)} />
      </div>
    );
  }

  if (normalized.type === "url") {
    return (
      <img
        src={normalized.url}
        alt={alt}
        className={cn(
          "block h-full w-full object-cover",
          fill && "absolute inset-0",
          className
        )}
        style={{ objectPosition: "center center" }}
        onError={() => setFailed(true)}
        {...props}
      />
    );
  }

  return (
    <CldImage
      src={normalized.publicId || normalized.url}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      fill={fill}
      priority={priority}
      unoptimized={unoptimized}
      onError={() => {
        setFailed(true);
        return false;
      }}
      {...props}
    />
  );
}
