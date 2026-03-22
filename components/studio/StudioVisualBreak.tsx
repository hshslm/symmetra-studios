"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

void ScrollTrigger;

export default function StudioVisualBreak(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const image = imageRef.current;
      if (!section || !image) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) return;

      // Parallax: image moves slower than scroll
      gsap.to(image, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Clip-path reveal: starts at manifesto width (~900px centered)
      // then expands to full bleed. Horizontal inset ~15% matches
      // the manifesto's max-w-[900px] on a ~1200px viewport.
      gsap.fromTo(
        section,
        { clipPath: "inset(8% 15% 8% 15%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 10%",
            scrub: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative my-8 h-[50vh] w-full overflow-hidden md:my-16
                 md:h-[60vh]"
    >
      {/* Oversized image wrapper for parallax room */}
      <div
        ref={imageRef}
        className="absolute inset-[-15%] h-[130%] w-[130%]"
      >
        <video
          className="h-full w-full object-cover brightness-50"
          src="/videos/showreel.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-black/30" />
    </section>
  );
}
