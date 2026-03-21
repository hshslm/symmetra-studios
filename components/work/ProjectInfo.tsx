"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, DrawSVGPlugin } from "@/lib/gsap";
import type { Project } from "@/lib/projects-data";

void ScrollTrigger;
void DrawSVGPlugin;

interface ProjectInfoProps {
  project: Project;
}

export default function ProjectInfo({
  project,
}: ProjectInfoProps): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const divider = section.querySelector("#project-info-divider");
      const label = section.querySelector("[data-info-label]");
      const description = section.querySelector("[data-info-description]");
      const metaItems = section.querySelectorAll("[data-info-meta]");
      const backLink = section.querySelector("[data-info-back]");

      if (reduced) {
        gsap.set(
          [label, description, backLink, ...metaItems].filter(Boolean),
          { opacity: 1, y: 0 },
        );
        return;
      }

      // ── CONTENT CASCADE ──
      if (label) gsap.set(label, { opacity: 0, y: 15 });
      if (description) gsap.set(description, { opacity: 0, y: 15 });
      if (backLink) gsap.set(backLink, { opacity: 0, y: 10 });
      gsap.set(metaItems, { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });

      // Divider from center
      if (divider) {
        gsap.set(divider, { drawSVG: "50% 50%" });
        tl.to(
          divider,
          { drawSVG: "0% 100%", duration: 0.8, ease: "power2.inOut" },
          0,
        );
      }

      // Label
      if (label) {
        tl.to(
          label,
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
          0.1,
        );
      }

      // Description
      if (description) {
        tl.to(
          description,
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          0.25,
        );
      }

      // Meta stagger
      if (metaItems.length) {
        tl.to(
          metaItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.35,
        );
      }

      // Back link
      if (backLink) {
        tl.to(
          backLink,
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
          0.55,
        );
      }

      // useGSAP auto-cleans all GSAP instances created within
      // this scope on unmount. No manual triggersRef needed here
      // because we don't conditionally create/destroy triggers
      // based on props (unlike RelatedProjects which re-runs
      // on different project pages with different card counts).
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-info-section
      className="relative overflow-hidden px-8 py-20 md:px-16 md:py-28
                 lg:px-24 lg:py-36"
    >
      {/* Divider */}
      <div className="mb-12 md:mb-16">
        <svg
          width="100%"
          height="1"
          viewBox="0 0 1000 1"
          preserveAspectRatio="none"
        >
          <line
            id="project-info-divider"
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

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: Label + Description (NO title — hero has it) */}
        <div className="lg:col-span-7">
          <p
            data-info-label
            className="mb-6 font-body text-[10px] uppercase tracking-[0.25em]
                       text-white/25"
          >
            About
          </p>

          {project.tagline && (
            <p
              data-info-description
              className="max-w-[520px] font-body text-base leading-relaxed
                         text-white/40 md:text-lg"
            >
              {project.tagline}
            </p>
          )}
        </div>

        {/* Right: Metadata */}
        <div
          className="flex flex-col gap-6 lg:col-span-4
                     lg:col-start-9"
        >
          <div data-info-meta>
            <p
              className="mb-1.5 font-body text-[10px] uppercase tracking-[0.2em]
                         text-white/20"
            >
              Client
            </p>
            <p className="font-body text-sm text-white/60">{project.client}</p>
          </div>
          <div data-info-meta>
            <p
              className="mb-1.5 font-body text-[10px] uppercase tracking-[0.2em]
                         text-white/20"
            >
              Category
            </p>
            <p className="font-body text-sm text-white/60">
              {project.categoryLabel}
            </p>
          </div>
          <div data-info-meta>
            <p
              className="mb-1.5 font-body text-[10px] uppercase tracking-[0.2em]
                         text-white/20"
            >
              Year
            </p>
            <p className="font-body text-sm text-white/60">{project.year}</p>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div data-info-back className="mt-16 md:mt-20">
        <Link
          href="/work"
          className="group/back inline-flex items-center gap-3 font-body
                     text-xs uppercase tracking-[0.2em] text-white/30
                     transition-colors duration-300 hover:text-white/70"
          data-cursor="pointer"
        >
          <svg
            width="20"
            height="8"
            viewBox="0 0 20 8"
            className="rotate-180 transition-transform duration-300
                       group-hover/back:-translate-x-1"
          >
            <line
              x1="0"
              y1="4"
              x2="18"
              y2="4"
              stroke="currentColor"
              strokeWidth="1"
            />
            <polyline
              points="14,1 18,4 14,7"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
          <span>All Projects</span>
        </Link>
      </div>
    </section>
  );
}
