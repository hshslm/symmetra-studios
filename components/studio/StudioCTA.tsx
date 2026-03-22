"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, DrawSVGPlugin } from "@/lib/gsap";

void ScrollTrigger;
void SplitText;
void DrawSVGPlugin;

export default function StudioCTA(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wordsRef = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const heading = headingRef.current;
      if (!section || !heading) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const divider = section.querySelector("[data-cta-divider]");
      const email = section.querySelector("[data-cta-email]");

      if (reduced) {
        gsap.set(heading, { opacity: 1 });
        if (email) gsap.set(email, { opacity: 1, y: 0 });
        if (divider) gsap.set(divider, { drawSVG: "0% 100%" });
        return;
      }

      // Divider: scrub-linked from center
      if (divider) {
        gsap.set(divider, { drawSVG: "50% 50%" });
        gsap.to(divider, {
          drawSVG: "0% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            scrub: 0.3,
          },
        });
      }

      // Heading: SplitText word reveal — scrub-linked
      gsap.set(heading, { opacity: 1 });
      const split = SplitText.create(heading, {
        type: "words",
        mask: "words",
      });

      gsap.set(split.words, { yPercent: 100 });

      let magneticReady = false;
      gsap.to(split.words, {
        yPercent: 0,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          end: "top 50%",
          scrub: 0.3,
          onUpdate: (self) => {
            // Set up magnetic words once fully revealed
            if (self.progress >= 1 && !magneticReady) {
              magneticReady = true;
              // Use the existing split words for magnetic effect
              wordsRef.current = split.words as HTMLElement[];
              wordsRef.current.forEach((word) => {
                word.style.display = "inline-block";
              });
            }
            if (self.progress < 1) {
              magneticReady = false;
              wordsRef.current = [];
            }
          },
        },
      });

      // Email fade up — scrub-linked
      if (email) {
        gsap.set(email, { opacity: 0, y: 15 });
        gsap.to(email, {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: email,
            start: "top 90%",
            end: "top 70%",
            scrub: 0.3,
          },
        });
      }
    },
    { scope: sectionRef },
  );

  // Magnetic effect: words drift slightly toward cursor
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const words = wordsRef.current;
      if (!words.length) return;

      const sectionRect = section.getBoundingClientRect();
      const mouseX = e.clientX - sectionRect.left;
      const mouseY = e.clientY - sectionRect.top;

      words.forEach((word) => {
        const wordRect = word.getBoundingClientRect();
        const wordCenterX =
          wordRect.left + wordRect.width / 2 - sectionRect.left;
        const wordCenterY =
          wordRect.top + wordRect.height / 2 - sectionRect.top;

        const deltaX = mouseX - wordCenterX;
        const deltaY = mouseY - wordCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Prevent division by zero when cursor is exactly on word center
        if (distance < 1) return;

        const maxDist = 300;
        if (distance > maxDist) {
          gsap.to(word, { x: 0, y: 0, duration: 0.6, ease: "power3.out", overwrite: true });
          return;
        }

        const strength = (1 - distance / maxDist) * 12;
        const moveX = (deltaX / distance) * strength;
        const moveY = (deltaY / distance) * strength;

        gsap.to(word, {
          x: moveX,
          y: moveY,
          duration: 0.4,
          ease: "power3.out",
          overwrite: true,
        });
      });
    };

    const handleMouseLeave = (): void => {
      wordsRef.current.forEach((word) => {
        gsap.to(word, { x: 0, y: 0, duration: 0.6, ease: "power3.out", overwrite: true });
      });
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center px-8 py-32 text-center
                 md:px-16 md:py-44 lg:px-24"
    >
      {/* Divider */}
      <div className="mb-12 w-full max-w-[600px] md:mb-16">
        <svg
          width="100%"
          height="1"
          viewBox="0 0 600 1"
          preserveAspectRatio="none"
        >
          <line
            data-cta-divider
            x1="0"
            y1="0.5"
            x2="600"
            y2="0.5"
            stroke="white"
            strokeWidth="1"
            opacity="0.1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <h2
        ref={headingRef}
        className="mb-8 font-display text-4xl font-bold leading-[1.0]
                   text-white opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
      >
        Let&apos;s build your next scene.
      </h2>

      <a
        data-cta-email
        href="mailto:hello@symmetrastudios.com"
        className="group/email font-body text-base text-white/40
                   transition-colors duration-300 hover:text-white
                   md:text-lg"
        data-cursor="pointer"
      >
        <span
          className="border-b border-white/10 pb-1 transition-colors
                     duration-300 group-hover/email:border-white/40"
        >
          hello@symmetrastudios.com
        </span>
      </a>
    </section>
  );
}
