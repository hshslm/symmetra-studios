"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

void ScrollTrigger;

export default function ScrollLogo(): React.ReactElement {
  const logoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const logo = logoRef.current;
      if (!logo) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // End position — matches NavLogo: fixed top-6 left-6 md:top-8 md:left-10 h-6
      const isMd = window.innerWidth >= 768;
      const navX = isMd ? 40 : 24; // left-10 = 2.5rem = 40px, left-6 = 1.5rem = 24px
      const navY = isMd ? 32 : 24; // top-8 = 2rem = 32px, top-6 = 1.5rem = 24px
      const navH = 24; // h-6 = 1.5rem = 24px

      // Start: centered, large
      const heroSize = Math.min(window.innerWidth * 0.08, 100);

      if (reduced) {
        gsap.set(logo, {
          top: navY,
          left: navX,
          xPercent: 0,
          yPercent: 0,
          width: "auto",
          height: navH,
          opacity: 0.5,
        });
        return;
      }

      // Initial state: large, centered on hero
      gsap.set(logo, {
        top: "22%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        height: heroSize,
        width: "auto",
        opacity: 0.7,
      });

      // Scroll-driven morph to navbar position
      gsap.to(logo, {
        top: navY,
        left: navX,
        xPercent: 0,
        yPercent: 0,
        height: navH,
        width: "auto",
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "+=400",
          scrub: 0.3,
        },
      });
    },
    { scope: logoRef },
  );

  return (
    <div
      ref={logoRef}
      className="pointer-events-auto fixed z-[52]"
      data-cursor="pointer"
    >
      <a href="/" aria-label="Symmetra Studios - Home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Symmetra Studios"
          className="h-full w-auto"
        />
      </a>
    </div>
  );
}
