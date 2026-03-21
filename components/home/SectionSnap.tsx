"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

void gsap;
void ScrollTrigger;

export default function SectionSnap(): React.ReactElement {
  useGSAP(() => {
    // Snap non-pinned sections into full view when user crosses threshold.
    // Pinned sections (hero, reel) handle their own internal snapping.
    // This only covers the GAPS between sections.
    document.querySelectorAll("[data-section]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section as HTMLElement,
        start: "top bottom",
        end: "top top",
        snap: {
          snapTo: 1,
          duration: { min: 0.3, max: 0.8 },
          delay: 0.1,
          ease: "power2.inOut",
        },
      });
    });
  });

  return <></>;
}
