"use client";

import { useEffect, useRef, useState } from "react";

// Drop inside any `relative` card. Renders a soft radial glow that follows the
// cursor and fades out when it leaves — the Linear/Vercel-style card effect.
export default function Spotlight({ className = "", size = 340, color = "rgba(139,92,246,0.16)" }) {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef({ x: -9999, y: -9999 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  function handleMove(e) {
    const rect = ref.current?.parentElement?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const element = ref.current;
      if (!element) return;
      element.style.setProperty("--spotlight-x", `${pointerRef.current.x}px`);
      element.style.setProperty("--spotlight-y", `${pointerRef.current.y}px`);
    });
  }

  return (
    <div
      ref={ref}
      aria-hidden
      onMouseMove={handleMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`absolute inset-0 z-0 rounded-[inherit] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        "--spotlight-x": "-9999px",
        "--spotlight-y": "-9999px",
        background: `radial-gradient(${size}px circle at var(--spotlight-x) var(--spotlight-y), ${color}, transparent 70%)`,
      }}
    />
  );
}
