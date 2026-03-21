"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, DrawSVGPlugin } from "@/lib/gsap";
import { clientLogos, clientLogosShuffled } from "@/lib/client-logos";
import LogoMarqueeRow from "./LogoMarqueeRow";

void ScrollTrigger;
void DrawSVGPlugin;

const MIN_LOGOS = 6;

export default function LogoMarquee(): React.ReactElement | null {
  const sectionRef = useRef<HTMLElement>(null);

  // Hooks must be called unconditionally (before the conditional return).
  // When logos < MIN_LOGOS, the section renders nothing and the hook
  // finds no elements — safely a no-op.
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const rows = section.querySelectorAll("[data-marquee-row]");
      const label = section.querySelector("[data-marquee-label]");
      const divider = section.querySelector("#marquee-divider-line");

      if (!rows.length) return;

      gsap.set(rows, { opacity: 0, y: 20 });
      if (label) gsap.set(label, { opacity: 0, y: 10 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          if (divider) {
            tl.fromTo(
              divider,
              { drawSVG: "0% 0%" },
              { drawSVG: "0% 100%", duration: 0.8, ease: "power2.inOut" },
              0,
            );
          }

          if (label) {
            tl.to(
              label,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
              0.2,
            );
          }

          if (rows[0]) {
            tl.to(
              rows[0],
              { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
              0.3,
            );
          }

          if (rows[1]) {
            tl.to(
              rows[1],
              { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
              0.45,
            );
          }
        },
      });
    },
    { scope: sectionRef },
  );

  if (clientLogos.length < MIN_LOGOS) return null;

  return (
    <section
      ref={sectionRef}
      data-section
      className="relative flex h-dvh w-full flex-col justify-end"
    >
      {/* Upper breathing space — Phase 10b fills with services */}
      <div className="flex-1" />

      {/* Marquee content sits in the bottom portion */}
      <div className="pb-12 md:pb-16">
        {/* DrawSVG divider */}
        <div className="mb-8 px-8 md:mb-10 md:px-16 lg:px-24">
          <svg
            width="100%"
            height="1"
            viewBox="0 0 1000 1"
            preserveAspectRatio="none"
          >
            <line
              id="marquee-divider-line"
              x1="0"
              y1="0.5"
              x2="1000"
              y2="0.5"
              stroke="white"
              strokeWidth="1"
              opacity="0.1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Label */}
        <div
          data-marquee-label
          className="mb-6 px-8 md:px-16 lg:px-24"
        >
          <p className="font-body text-[10px] uppercase tracking-[0.25em] text-white/20">
            Trusted By
          </p>
        </div>

        {/* Row 1: scrolls left — all logos in original order */}
        <div data-marquee-row className="marquee-edge-mask mb-6 md:mb-8">
          <LogoMarqueeRow logos={clientLogos} speed={1} reversed={false} />
        </div>

        {/* Row 2: scrolls right — all logos in shuffled order */}
        <div data-marquee-row className="marquee-edge-mask">
          <LogoMarqueeRow logos={clientLogosShuffled} speed={0.8} reversed />
        </div>
      </div>
    </section>
  );
}
