"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export default function ViewportMotion({ as, className, children }) {
  const Tag = as || "div";
  const ref = useRef(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "240px 0px", threshold: 0.01 }
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-motion-active={active ? "true" : "false"}
      className={cn("viewport-motion", className)}
    >
      {children}
    </Tag>
  );
}
