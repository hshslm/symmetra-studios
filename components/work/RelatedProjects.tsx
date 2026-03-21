"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import type { Project } from "@/lib/projects-data";
import WorkCard from "./WorkCard";

void ScrollTrigger;
void SplitText;

interface RelatedProjectsProps {
  projects: Project[];
}

export default function RelatedProjects({
  projects,
}: RelatedProjectsProps): React.ReactElement | null {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const heading = section.querySelector("[data-related-heading]");
      const cards = section.querySelectorAll("[data-work-card]");

      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      // Heading reveal
      if (heading) {
        gsap.set(heading, { opacity: 1 });
        const split = SplitText.create(heading, {
          type: "words",
          mask: "words",
        });

        const headingST = ScrollTrigger.create({
          trigger: heading,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.from(split.words, {
              yPercent: 100,
              duration: 0.6,
              stagger: 0.06,
              ease: "power3.out",
              onComplete: () => split.revert(),
            });
          },
        });
        triggersRef.current.push(headingST);
      }

      // Cards entrance
      gsap.set(cards, { opacity: 0, y: 30 });

      const batchTriggers = ScrollTrigger.batch(cards, {
        onEnter: (batch: Element[]) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
          });
        },
        start: "top 85%",
        once: true,
      });

      if (Array.isArray(batchTriggers)) {
        triggersRef.current.push(...batchTriggers);
      }

      return () => {
        triggersRef.current.forEach((st) => st.kill());
        triggersRef.current = [];
      };
    },
    { scope: sectionRef },
  );

  if (projects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="px-8 pb-20 pt-8 md:px-16 md:pb-28 lg:px-24"
    >
      <div className="mb-12 md:mb-16">
        <svg
          width="100%"
          height="1"
          viewBox="0 0 1000 1"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0.5"
            x2="1000"
            y2="0.5"
            stroke="white"
            strokeWidth="1"
            opacity="0.06"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <h3
        data-related-heading
        className="mb-10 font-display text-2xl font-bold leading-[1.1]
                   text-white md:mb-14 md:text-3xl"
      >
        Related Projects
      </h3>

      <div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6
                   lg:grid-cols-3"
      >
        {projects.map((project, i) => (
          <WorkCard key={project.id} project={project} index={i} disableParallax />
        ))}
      </div>
    </section>
  );
}
