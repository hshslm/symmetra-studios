"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, DrawSVGPlugin, SplitText } from "@/lib/gsap";
import { services } from "@/lib/services-data";
import ServiceItem from "./ServiceItem";

void ScrollTrigger;
void DrawSVGPlugin;
void SplitText;

export default function ServicesSection(): React.ReactElement {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // ─── SCROLL-SCRUBBED HEADING REVEAL ───
      const heading = section.querySelector(
        "[data-services-heading]",
      ) as HTMLElement | null;
      const label = section.querySelector("[data-services-label]");

      // Label entrance (one-shot)
      if (label) {
        gsap.set(label, { opacity: 0, y: 10 });
        ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(label, {
              opacity: 1,
              y: 0,
              duration: reduced ? 0.01 : 0.5,
              ease: "power3.out",
            });
          },
        });
      }

      // Heading: scroll-scrubbed word opacity
      if (heading && !reduced) {
        SplitText.create(heading, {
          type: "words",
          autoSplit: true,
          onSplit(self: SplitText) {
            gsap.set(self.words, { color: "rgba(255,255,255,0.2)" });

            return gsap.to(self.words, {
              color: "rgba(255,255,255,1)",
              stagger: 0.3,
              duration: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 60%",
                end: "bottom 40%",
                scrub: 0.5,
              },
            });
          },
        });
      } else if (heading) {
        gsap.set(heading, { color: "rgba(255,255,255,1)" });
      }

      // ─── SERVICE ITEMS ENTRANCE ───
      const serviceItems = section.querySelectorAll("[data-service-item]");

      serviceItems.forEach((item) => {
        const dividers = item.querySelectorAll(".service-divider");
        const number = item.querySelector(".service-number");
        const ghostNumber = item.querySelector(".service-ghost-number");
        const title = item.querySelector(".service-title");
        const description = item.querySelector(".service-description");

        // Pre-set initial states
        dividers.forEach((d) => gsap.set(d, { drawSVG: "0% 0%" }));
        if (number) gsap.set(number, { opacity: 0, y: 8 });
        if (ghostNumber) gsap.set(ghostNumber, { opacity: 0, y: 15 });
        if (description) gsap.set(description, { opacity: 0, y: 12 });
        if (title) gsap.set(title, { opacity: 0 });

        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({
              onComplete: () => {
                // Enable CSS hover transitions after entrance finishes
                (item as HTMLElement).classList.add("entrance-complete");
              },
            });

            // 1. DrawSVG lines — alternating direction
            dividers.forEach((d) => {
              const dir = d.getAttribute("data-draw-direction");
              if (dir === "rtl") {
                gsap.set(d, { drawSVG: "100% 100%" });
                tl.to(
                  d,
                  {
                    drawSVG: "0% 100%",
                    duration: reduced ? 0.01 : 0.7,
                    ease: "power2.inOut",
                  },
                  0,
                );
              } else {
                tl.to(
                  d,
                  {
                    drawSVG: "0% 100%",
                    duration: reduced ? 0.01 : 0.7,
                    ease: "power2.inOut",
                  },
                  0,
                );
              }
            });

            // 2. Ghost number fades in
            if (ghostNumber) {
              tl.to(
                ghostNumber,
                {
                  opacity: 0.12,
                  y: 0,
                  duration: reduced ? 0.01 : 0.8,
                  ease: "power2.out",
                },
                reduced ? 0 : 0.1,
              );
            }

            // 3. Small number fades in
            if (number) {
              tl.to(
                number,
                {
                  opacity: 1,
                  y: 0,
                  duration: reduced ? 0.01 : 0.4,
                  ease: "power3.out",
                },
                reduced ? 0 : 0.15,
              );
            }

            // 4. Title: SplitText masked word reveal
            if (title && !reduced) {
              gsap.set(title, { opacity: 1 });

              const split = SplitText.create(title, {
                type: "words",
                mask: "words",
              });

              tl.from(
                split.words,
                {
                  yPercent: 100,
                  duration: 0.6,
                  stagger: 0.06,
                  ease: "power3.out",
                  onComplete: () => split.revert(),
                },
                0.2,
              );
            } else if (title) {
              tl.to(title, { opacity: 1, duration: 0.01 }, 0);
            }

            // 5. Description fades up
            if (description) {
              tl.to(
                description,
                {
                  opacity: 1,
                  y: 0,
                  duration: reduced ? 0.01 : 0.5,
                  ease: "power3.out",
                },
                reduced ? 0 : 0.4,
              );
            }
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      data-section
      className="relative flex w-full flex-col px-8 py-16
                 md:flex-row md:gap-16 md:px-16 md:py-20 lg:gap-24
                 lg:px-24 lg:py-24"
    >
      {/* Left column: sticky heading */}
      <div className="mb-8 md:mb-0 md:w-[35%] lg:w-[30%]">
        <div className="md:sticky md:top-[30vh]">
          <p
            className="mb-4 font-body text-[10px] uppercase tracking-[0.25em]
                       text-white/30"
            data-services-label
          >
            Services
          </p>
          <h2
            className="font-display text-4xl font-bold leading-[1.05]
                       sm:text-5xl md:text-6xl lg:text-7xl"
            data-services-heading
          >
            What We Do
          </h2>
        </div>
      </div>

      {/* Right column: service list */}
      <div className="services-list md:w-[65%] md:pt-4 lg:w-[70%]">
        {services.map((service, i) => (
          <ServiceItem
            key={service.id}
            service={service}
            index={i}
            isLast={i === services.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
