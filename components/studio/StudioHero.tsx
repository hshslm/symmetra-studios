"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

void SplitText;

export default function StudioHero(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const label = section.querySelector("[data-hero-label]");
      const heading = section.querySelector("[data-hero-heading]");
      const line = section.querySelector("[data-hero-line]");

      // Pre-set hidden states
      if (label) gsap.set(label, { opacity: 0, yPercent: 8 });
      if (heading) gsap.set(heading, { opacity: 0 });
      if (line) gsap.set(line, { scaleX: 0, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.3 });

      // Label fade up
      if (label) {
        tl.to(
          label,
          {
            opacity: 1,
            yPercent: 0,
            duration: reduced ? 0.01 : 0.4,
            ease: "power3.out",
          },
          0,
        );
      }

      // Heading: SplitText words with mask — same as Work page "Our Work"
      if (heading && !reduced) {
        gsap.set(heading, { opacity: 1 });
        const split = SplitText.create(heading, {
          type: "words",
          mask: "words",
        });
        tl.from(
          split.words,
          {
            yPercent: 100,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            onComplete: () => split.revert(),
          },
          0.1,
        );
      } else if (heading) {
        tl.to(heading, { opacity: 1, duration: 0.01 }, 0);
      }

      // Decorative line: scales from left
      if (line) {
        tl.to(
          line,
          {
            scaleX: 1,
            opacity: 1,
            duration: reduced ? 0.01 : 0.8,
            ease: "power2.inOut",
          },
          0.3,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-dvh w-full flex-col items-center
                 justify-center overflow-hidden px-8 py-32 md:px-16
                 lg:px-24"
    >
      {/* Ghost watermark */}
      <span
        className="pointer-events-none absolute left-1/2 top-1/2
                   -translate-x-1/2 -translate-y-1/2 select-none
                   font-display text-[120px] leading-[0.85]
                   text-white/[0.015] sm:text-[180px] md:text-[280px]
                   lg:text-[400px] xl:text-[500px]"
        aria-hidden="true"
      >
        STUDIO
      </span>

      {/* Label */}
      <p
        data-hero-label
        className="mb-8 font-body text-[10px] uppercase tracking-[0.3em]
                   text-white/25"
      >
        The Studio
      </p>

      {/* Main heading */}
      <h1
        data-hero-heading
        className="max-w-[900px] text-center font-display text-5xl
                   font-bold leading-[0.95] text-white
                   sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
      >
        We don&apos;t shoot. We build.
      </h1>

      {/* Decorative line */}
      <div
        data-hero-line
        className="mt-12 h-px w-16 origin-left bg-white/15"
      />
    </section>
  );
}
