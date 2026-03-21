"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, DrawSVGPlugin } from "@/lib/gsap";

void ScrollTrigger;
void DrawSVGPlugin;

export default function HeroDimming(): React.ReactElement {
  const dimmingRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const hero = document.getElementById("hero");
      const vignette = document.getElementById("hero-vignette");
      const particles = document.getElementById("hero-particles");
      const video = document.getElementById("hero-video");
      const title = document.getElementById("hero-title");
      const tagline = document.getElementById("hero-tagline");
      const scrollIndicator = document.getElementById(
        "hero-scroll-indicator",
      );

      if (!hero) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const isMobile = window.innerWidth < 768;
      const contentDrift = isMobile ? -15 : -30;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=500vh",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // 0-20%: Hold — user absorbs the hero
      tl.to({}, { duration: 0.2 });

      // 20-30%: Scroll indicator fades
      if (scrollIndicator) {
        tl.to(
          scrollIndicator,
          { opacity: 0, y: 10, duration: 0.1, ease: "power2.in" },
          0.2,
        );
      }

      // 20-50%: Cinema lights dim
      if (vignette) {
        tl.to(
          vignette,
          { opacity: 0.9, duration: 0.3, ease: "power2.inOut" },
          0.2,
        );
      }

      // Video dims via filter (brightness 0.4 -> 0.08)
      if (video) {
        tl.to(
          video,
          {
            filter: "brightness(0.08) contrast(1.1)",
            duration: 0.3,
            ease: "power2.inOut",
          },
          0.2,
        );
      }

      if (title) {
        tl.to(
          title,
          {
            opacity: 0,
            ...(reducedMotion ? {} : { y: contentDrift }),
            duration: 0.2,
            ease: "power2.in",
          },
          0.2,
        );
      }

      if (particles) {
        tl.to(
          particles,
          { opacity: 0, duration: 0.3, ease: "power2.out" },
          0.2,
        );
      }

      // 50-70%: Final content fades
      if (tagline) {
        tl.to(
          tagline,
          {
            opacity: 0,
            ...(reducedMotion ? {} : { y: isMobile ? -10 : -20 }),
            duration: 0.15,
            ease: "power2.in",
          },
          0.45,
        );
      }

      // Video scale for depth
      if (video && !reducedMotion) {
        tl.to(
          video,
          { scale: 1.03, duration: 0.2, ease: "power2.inOut" },
          0.5,
        );
      }

      // 70-100%: Near black
      if (vignette) {
        tl.to(
          vignette,
          { opacity: 1, duration: 0.3, ease: "power2.inOut" },
          0.7,
        );
      }

      // 70-100%: Exit line draws left-to-right
      const exitLine = document.querySelector(
        "#hero-exit-line line",
      ) as SVGLineElement | null;
      if (exitLine) {
        gsap.killTweensOf(exitLine);
        gsap.set(exitLine, { drawSVG: "0%" });

        tl.to(
          exitLine,
          { drawSVG: "100%", duration: 0.3, ease: "power2.inOut" },
          0.7,
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: dimmingRef },
  );

  return <div ref={dimmingRef} />;
}
