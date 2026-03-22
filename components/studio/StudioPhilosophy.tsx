"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

void ScrollTrigger;
void SplitText;

export default function StudioPhilosophy(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const card = section.querySelector("[data-philosophy-card]");
      const label = section.querySelector("[data-philosophy-label]");
      const text = section.querySelector("[data-philosophy-text]");

      if (reduced) {
        if (card) gsap.set(card, { scale: 1, opacity: 1 });
        if (label) gsap.set(label, { opacity: 1 });
        if (text) gsap.set(text, { opacity: 1 });
        return;
      }

      // Card: scale entrance from 0.88
      if (card) {
        gsap.set(card, { scale: 0.88, opacity: 0 });

        ScrollTrigger.create({
          trigger: card,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
            });
          },
        });
      }

      // Label: fade in after card scales
      if (label) {
        gsap.set(label, { opacity: 0 });
        ScrollTrigger.create({
          trigger: card || section,
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(label, {
              opacity: 1,
              duration: 0.4,
              delay: 0.3,
              ease: "power2.out",
            });
          },
        });
      }

      // Text: SplitText line reveal — scrub-linked
      if (text) {
        gsap.set(text, { opacity: 1 });
        const split = SplitText.create(text, {
          type: "lines",
          mask: "lines",
        });

        gsap.set(split.lines, { yPercent: 100 });

        gsap.to(split.lines, {
          yPercent: 0,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: text,
            start: "top 85%",
            end: "top 50%",
            scrub: 0.3,
          },
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="px-8 py-28 md:px-16 md:py-40 lg:px-24"
    >
      <div
        data-philosophy-card
        className="mx-auto max-w-[800px] border-b border-t border-white/[0.06]
                   py-16 transition-colors duration-500
                   hover:border-white/[0.15] md:py-24"
      >
        <p
          data-philosophy-label
          className="mb-8 text-center font-body text-[10px] uppercase
                     tracking-[0.25em] text-white/20"
        >
          On AI
        </p>

        <p
          data-philosophy-text
          className="text-center font-display text-xl font-bold leading-[1.4]
                     text-white opacity-0 sm:text-2xl md:text-3xl"
        >
          We don&apos;t use AI because it&apos;s easier. We use it because it
          lets us direct at a scale and speed that traditional production cannot
          touch. The technology is the instrument. The taste is ours.
        </p>
      </div>
    </section>
  );
}
