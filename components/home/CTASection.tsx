"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  ScrollTrigger,
  DrawSVGPlugin,
  SplitText,
} from "@/lib/gsap";
import TextSlide from "@/components/TextSlide";

void ScrollTrigger;
void DrawSVGPlugin;
void SplitText;

export default function CTASection(): React.ReactElement {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        section
          .querySelectorAll(
            "[data-cta-label], [data-cta-headline], [data-cta-email], [data-cta-location]",
          )
          .forEach((el) => gsap.set(el, { opacity: 1, yPercent: 0 }));
        const d = section.querySelector("#cta-divider-line");
        if (d) gsap.set(d, { drawSVG: "0% 100%" });
        return;
      }

      const label = section.querySelector("[data-cta-label]");
      const headline = section.querySelector("[data-cta-headline]");
      const emailRow = section.querySelector("[data-cta-email]");
      const location = section.querySelector("[data-cta-location]");
      const divider = section.querySelector("#cta-divider-line");

      // ── ENTRANCE: scrub-linked reveals (yPercent for entrance, y for parallax) ──

      // Label
      if (label) {
        gsap.set(label, { opacity: 0, yPercent: 8 });
        gsap.to(label, {
          opacity: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "top 45%",
            scrub: 0.3,
          },
        });
      }

      // Headline: SplitText scrub-linked masked word reveal
      if (headline) {
        SplitText.create(headline, {
          type: "words",
          mask: "words",
          autoSplit: true,
          onSplit(self: SplitText) {
            gsap.set(self.words, { yPercent: 100 });
            return gsap.to(self.words, {
              yPercent: 0,
              stagger: 0.15,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 60%",
                end: "top 20%",
                scrub: 0.3,
              },
            });
          },
        });
      }

      // Email fades up
      if (emailRow) {
        gsap.set(emailRow, { opacity: 0, yPercent: 10 });
        gsap.to(emailRow, {
          opacity: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 35%",
            end: "top 15%",
            scrub: 0.3,
          },
        });
      }

      // Location fades up
      if (location) {
        gsap.set(location, { opacity: 0, yPercent: 8 });
        gsap.to(location, {
          opacity: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 25%",
            end: "top 10%",
            scrub: 0.3,
          },
        });
      }

      // Divider draws from center outward
      if (divider) {
        gsap.set(divider, { drawSVG: "50% 50%" });
        gsap.to(divider, {
          drawSVG: "0% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 20%",
            end: "top 0%",
            scrub: 0.3,
          },
        });
      }

      // ── PARALLAX: depth layers drift at different speeds ──

      if (headline) {
        gsap.to(headline, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.3,
          },
        });
      }

      if (label) {
        gsap.to(label, {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.3,
          },
        });
      }

      if (emailRow) {
        gsap.to(emailRow, {
          y: -15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.3,
          },
        });
      }

      if (location) {
        gsap.to(location, {
          y: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
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
      id="cta"
      data-section
      className="relative flex h-dvh w-full flex-col items-center
                 justify-center px-8 text-center md:px-16 lg:px-24"
    >
      {/* Label */}
      <p
        data-cta-label
        className="mb-6 font-body text-[10px] uppercase tracking-[0.3em]
                   text-white/25 md:mb-8"
      >
        Ready for your next project?
      </p>

      {/* Headline */}
      <h2
        data-cta-headline
        className="mb-8 max-w-5xl font-display text-5xl font-bold
                   leading-[1.0] text-white sm:text-6xl md:mb-12
                   md:text-7xl lg:text-8xl xl:text-[120px]"
      >
        Let&apos;s Create Something
      </h2>

      {/* Email CTA */}
      <div data-cta-email className="mb-6">
        <a
          href="mailto:hello@symmetrastudios.com"
          className="inline-block"
          data-cursor="email"
        >
          <TextSlide
            text="hello@symmetrastudios.com"
            letterStagger={15}
            duration={350}
            className="font-body text-lg text-white/60 transition-colors
                       duration-300 hover:text-white md:text-xl lg:text-2xl"
          />
        </a>
      </div>

      {/* Location */}
      <p
        data-cta-location
        className="font-body text-[11px] uppercase tracking-[0.2em]
                   text-white/15"
      >
        Dubai, UAE
      </p>

      {/* Divider line at bottom of section */}
      <div
        className="absolute bottom-0 left-0 right-0
                   px-8 md:px-16 lg:px-24"
      >
        <svg
          width="100%"
          height="1"
          viewBox="0 0 1000 1"
          preserveAspectRatio="none"
        >
          <line
            id="cta-divider-line"
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
    </section>
  );
}
