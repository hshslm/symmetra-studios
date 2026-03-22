"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

void ScrollTrigger;
void SplitText;

const manifestoText = `Symmetra Studios exists at the intersection of cinematic craft and generative technology. We build worlds from code and light - directing AI the way a filmmaker directs a crew. Every frame is intentional. Traditional production is built on constraints: budgets, schedules, locations, weather, permits. We removed the constraints. What remains is pure creative direction - lighting, composition, movement, emotion - executed at the speed of thought. We are a studio built for the next era of visual storytelling. Not because AI is new, but because the stories it enables are.`;

export default function StudioManifesto(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const text = textRef.current;
      if (!section || !text) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set(text, { opacity: 1 });
        return;
      }

      // Split into words
      const split = SplitText.create(text, {
        type: "words",
      });

      // Set all words to dim
      gsap.set(split.words, {
        opacity: 0.1,
        color: "#F0F0F0",
      });

      // Make the text container visible
      gsap.set(text, { opacity: 1 });

      // Pin the section and scrub through word opacities.
      // pinType: "transform" because the page transition wrapper
      // leaves a residual CSS transform on the parent, which breaks
      // position:fixed pinning (transforms create a new containing block).
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        pinType: "transform",
        scrub: 0.5,
        onToggle: (self) => {
          const track = section.querySelector(
            "[data-manifesto-progress-track]",
          );
          if (track) {
            gsap.to(track, {
              opacity: self.isActive ? 1 : 0,
              duration: 0.3,
              overwrite: true,
            });
          }
        },
        onUpdate: (self) => {
          const progress = self.progress;
          const words = split.words;
          const total = words.length;

          words.forEach((word: Element, i: number) => {
            const wordStart = (i / total) * 0.95;
            const wordEnd = wordStart + (1 / total) * 1.2;

            let wordProgress = 0;
            if (progress >= wordEnd) {
              wordProgress = 1;
            } else if (progress > wordStart) {
              wordProgress = (progress - wordStart) / (wordEnd - wordStart);
            }

            // Opacity: 0.1 -> 1.0
            const opacity = 0.1 + wordProgress * 0.9;
            gsap.set(word, { opacity });
          });

          // Update progress indicator
          const fill = section.querySelector(
            "[data-manifesto-progress-fill]",
          );
          if (fill) {
            (fill as HTMLElement).style.height = `${progress * 100}%`;
          }
        },
      });

      // No split.revert() — word elements must persist for scrub.
      // useGSAP handles cleanup on unmount.
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="flex min-h-dvh items-center justify-center px-8 py-20
                 md:px-16 lg:px-24"
    >
      <div className="mx-auto max-w-[900px]">
        <p
          ref={textRef}
          className="font-display text-2xl font-bold leading-[1.4] text-white
                     opacity-0 sm:text-3xl md:text-4xl lg:text-[42px]"
        >
          {manifestoText}
        </p>
      </div>

      {/* Scroll progress indicator */}
      <div
        data-manifesto-progress-track
        className="pointer-events-none fixed right-6 top-1/2 z-50
                   h-[80px] w-[2px] -translate-y-1/2 bg-white/[0.06]
                   opacity-0 md:right-8"
      >
        <div
          data-manifesto-progress-fill
          className="w-full origin-top bg-white/30"
          style={{ height: "0%" }}
        />
      </div>
    </section>
  );
}
