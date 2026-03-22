"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const rows = [
  { text: "LET'S MAKE SOMETHING", direction: -1, baseDuration: 160 },
  { text: "SYMMETRA STUDIOS", direction: 1, baseDuration: 200 },
];

const SEPARATOR = "\u00A0\u00A0\u00A0\u2022\u00A0\u00A0\u00A0";

export default function ContactMarquee(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) return;

      const rowElements = container.querySelectorAll("[data-marquee-row]");

      rowElements.forEach((row, i) => {
        const inner = row.querySelector("[data-marquee-inner]");
        if (!inner) return;

        const { direction, baseDuration } = rows[i];

        // Clone inner content for seamless loop
        const clone = inner.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        row.appendChild(clone);

        const innerWidth = inner.scrollWidth;

        if (direction === -1) {
          // LEFT: 0 → -innerWidth, repeat resets to 0
          const tween = gsap.fromTo(
            row,
            { x: 0 },
            {
              x: -innerWidth,
              duration: baseDuration,
              ease: "none",
              repeat: -1,
            },
          );
          tweensRef.current.push(tween);
        } else {
          // RIGHT: -innerWidth → 0, repeat resets to -innerWidth
          const tween = gsap.fromTo(
            row,
            { x: -innerWidth },
            {
              x: 0,
              duration: baseDuration,
              ease: "none",
              repeat: -1,
            },
          );
          tweensRef.current.push(tween);
        }
      });
    },
    { scope: containerRef },
  );

  // ── Cursor-reactive speed ──
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const x = e.clientX / window.innerWidth;
      const scale = 0.85 + x * 0.3;

      tweensRef.current.forEach((tween) => {
        gsap.to(tween, {
          timeScale: scale,
          duration: 0.8,
          ease: "power2.out",
          overwrite: true,
        });
      });
    };

    const handleMouseLeave = (): void => {
      tweensRef.current.forEach((tween) => {
        gsap.to(tween, {
          timeScale: 1,
          duration: 1.2,
          ease: "power3.out",
          overwrite: true,
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 flex flex-col
                 justify-center gap-6 overflow-hidden md:gap-10"
      aria-hidden="true"
    >
      {rows.map((row, i) => (
        <div
          key={i}
          data-marquee-row
          className="flex whitespace-nowrap"
          style={{ WebkitBackfaceVisibility: "hidden" }}
        >
          <span
            data-marquee-inner
            className="shrink-0 select-none font-display text-[80px]
                       font-bold leading-none text-white/[0.02]
                       sm:text-[120px] md:text-[160px] lg:text-[200px]
                       xl:text-[240px]"
          >
            {Array(6).fill(row.text).join(SEPARATOR)}
            {SEPARATOR}
          </span>
        </div>
      ))}
    </div>
  );
}
