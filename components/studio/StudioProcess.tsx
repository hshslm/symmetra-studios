"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

void ScrollTrigger;
void SplitText;

const stages = [
  {
    number: "01",
    title: "Discover",
    description:
      "Goals, references, and creative guardrails. We map the visual territory before generating a single frame. This stage defines the world your project lives in.",
  },
  {
    number: "02",
    title: "Generate",
    description:
      "AI-driven concept exploration, storyboards, and pre-visualization. Hundreds of directions explored in hours, not weeks. The best ideas surface fast.",
  },
  {
    number: "03",
    title: "Craft",
    description:
      "Editing, VFX, color grading, sound design. This is where generative output becomes cinema. Human direction at every cut.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "Multi-format delivery optimized for every channel. Social cuts, broadcast masters, vertical edits. One project, every format.",
  },
];

export default function StudioProcess(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const leftColRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const leftCol = leftColRef.current;
      if (!section || !leftCol) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const heading = section.querySelector("[data-process-heading]");
      const rightCards = section.querySelectorAll("[data-process-card]");
      const stickyNumber = leftCol.querySelector("[data-sticky-number]");
      const stickyTitle = leftCol.querySelector("[data-sticky-title]");
      const stickyProgress = leftCol.querySelector("[data-sticky-progress]");

      if (reduced) {
        gsap.set(rightCards, { opacity: 1, y: 0 });
        return;
      }

      // Heading SplitText — scrub-linked (plays forward and backward)
      if (heading) {
        gsap.set(heading, { opacity: 1 });
        const split = SplitText.create(heading, {
          type: "words",
          mask: "words",
        });

        gsap.set(split.words, { yPercent: 100 });

        gsap.to(split.words, {
          yPercent: 0,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            end: "top 50%",
            scrub: 0.3,
          },
        });
        // No split.revert() — words must persist for scrub
      }

      // Right column cards: fade up on scroll
      rightCards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: card,
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            });
          },
        });

        // Update sticky left column when each card hits center
        ScrollTrigger.create({
          trigger: card,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => updateStickyLabel(i),
          onEnterBack: () => updateStickyLabel(i),
        });
      });

      function updateStickyLabel(index: number): void {
        if (activeIndexRef.current === index) return;
        activeIndexRef.current = index;

        if (stickyNumber) {
          gsap.to(stickyNumber, {
            opacity: 0,
            y: -10,
            duration: 0.15,
            ease: "power2.in",
            overwrite: true,
            onComplete: () => {
              stickyNumber.textContent = stages[index].number;
              gsap.to(stickyNumber, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: "power3.out",
                overwrite: true,
              });
            },
          });
        }

        if (stickyTitle) {
          gsap.to(stickyTitle, {
            opacity: 0,
            y: -8,
            duration: 0.15,
            ease: "power2.in",
            overwrite: true,
            onComplete: () => {
              stickyTitle.textContent = stages[index].title;
              gsap.to(stickyTitle, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: "power3.out",
                overwrite: true,
              });
            },
          });
        }

        // Progress fill
        if (stickyProgress) {
          gsap.to(stickyProgress, {
            scaleX: (index + 1) / stages.length,
            duration: 0.4,
            ease: "power2.inOut",
            overwrite: true,
          });
        }

        // Spotlight: active card bright, others dim (lg+ only)
        if (window.matchMedia("(min-width: 1024px)").matches) {
          rightCards.forEach((card, cardIndex) => {
            const currentOpacity = parseFloat(
              window.getComputedStyle(card).opacity,
            );
            // Skip cards that haven't entered yet
            if (currentOpacity < 0.1) return;

            gsap.to(card, {
              opacity: cardIndex === index ? 1 : 0.35,
              duration: 0.4,
              ease: "power2.out",
              overwrite: true,
            });
          });
        }
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="px-8 py-24 md:px-16 md:py-32 lg:px-24"
    >
      {/* Section heading */}
      <h2
        data-process-heading
        className="mb-20 font-display text-3xl font-bold leading-[1.1]
                   text-white opacity-0 md:mb-28 md:text-4xl lg:text-5xl"
      >
        How We Work
      </h2>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
        {/* Left column: Sticky indicator */}
        <div ref={leftColRef} className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-[40vh]">
            {/* Active stage number */}
            <p
              data-sticky-number
              className="-ml-2 mb-4 font-display text-[120px] font-bold
                         leading-none text-white/[0.04] xl:text-[160px]"
            >
              01
            </p>

            {/* Active stage title */}
            <p
              data-sticky-title
              className="font-display text-2xl font-bold leading-[1.1]
                         text-white xl:text-3xl"
            >
              Discover
            </p>

            {/* Progress bar */}
            <div className="mt-6 h-px w-full max-w-[200px] bg-white/10">
              <div
                data-sticky-progress
                className="h-full origin-left bg-white/40"
                style={{ transform: "scaleX(0.25)" }}
              />
            </div>
          </div>
        </div>

        {/* Right column: Scrolling stages */}
        <div className="space-y-20 md:space-y-28 lg:col-span-7 lg:col-start-6">
          {stages.map((stage, i) => (
            <div key={stage.number} data-process-card>
              {/* Mobile number + title (hidden on lg) */}
              <div className="mb-4 flex items-baseline gap-4 lg:hidden">
                <span
                  className="font-display text-3xl font-bold
                             text-white/[0.06]"
                >
                  {stage.number}
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  {stage.title}
                </h3>
              </div>

              {/* Desktop title (shown on lg) */}
              <h3
                className="mb-4 hidden font-display text-xl font-bold
                           leading-[1.1] text-white md:text-2xl lg:block"
              >
                {stage.title}
              </h3>

              {/* Description */}
              <p
                className="max-w-[480px] font-body text-sm leading-relaxed
                           text-white/40 md:text-base"
              >
                {stage.description}
              </p>

              {/* Thin divider (except last) */}
              {i < stages.length - 1 && (
                <div className="mt-16 h-px w-full bg-white/[0.04] md:mt-20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
