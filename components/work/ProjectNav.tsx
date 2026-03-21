"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Link from "next/link";
import type { Project } from "@/lib/projects-data";

void ScrollTrigger;

interface ProjectNavProps {
  next: Project;
  prev: Project;
}

export default function ProjectNav({
  next,
  prev,
}: ProjectNavProps): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prevVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const prevPreviewRef = useRef<HTMLDivElement>(null);
  const nextPreviewRef = useRef<HTMLDivElement>(null);
  const [hoveredSide, setHoveredSide] = useState<
    "prev" | "next" | null
  >(null);

  // Play/pause preview videos on hover
  useEffect(() => {
    if (hoveredSide === "prev") {
      prevVideoRef.current?.play().catch(() => {});
      nextVideoRef.current?.pause();
    } else if (hoveredSide === "next") {
      nextVideoRef.current?.play().catch(() => {});
      prevVideoRef.current?.pause();
    } else {
      prevVideoRef.current?.pause();
      nextVideoRef.current?.pause();
    }
  }, [hoveredSide]);

  // Track mouse position for cursor-relative previews
  const handleMouseMove = useCallback(
    (e: React.MouseEvent, side: "prev" | "next") => {
      const ref = side === "prev" ? prevPreviewRef : nextPreviewRef;
      const preview = ref.current;
      if (!preview) return;

      const parent = e.currentTarget as HTMLElement;
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Position preview above cursor, centered horizontally on cursor
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
    },
    [],
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) return;

      const items = section.querySelectorAll("[data-nav-item]");
      gsap.set(items, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className="px-8 py-12 md:px-16 md:py-16 lg:px-24">
      <div className="grid grid-cols-2 gap-px">
        {/* Previous */}
        <Link
          href={`/work/${prev.slug}`}
          data-nav-item
          data-cursor="pointer"
          className="group/nav relative flex items-center gap-6 p-6 md:p-10"
          onMouseEnter={() => setHoveredSide("prev")}
          onMouseLeave={() => setHoveredSide(null)}
          onMouseMove={(e) => handleMouseMove(e, "prev")}
        >
          {/* Cursor-relative video preview */}
          <div
            ref={prevPreviewRef}
            className="pointer-events-none absolute z-30 hidden h-[120px]
                       w-[200px] -translate-x-1/2 -translate-y-[calc(100%+16px)]
                       overflow-hidden rounded-sm transition-opacity duration-300
                       lg:block"
            style={{ opacity: hoveredSide === "prev" ? 1 : 0 }}
          >
            <video
              ref={prevVideoRef}
              src={prev.videoSrc}
              poster={prev.posterSrc}
              muted
              loop
              playsInline
              preload="none"
              className="h-full w-full object-cover"
            />
          </div>

          <svg
            width="20"
            height="8"
            viewBox="0 0 20 8"
            className="shrink-0 rotate-180 text-white/20 transition-all
                       duration-300 group-hover/nav:-translate-x-1
                       group-hover/nav:text-white/50"
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
          <div>
            <p
              className="mb-1 font-body text-[9px] uppercase tracking-[0.2em]
                         text-white/20"
            >
              Previous
            </p>
            <p
              className="font-display text-lg font-bold leading-[1.1]
                         text-white/60 transition-colors duration-300
                         group-hover/nav:text-white md:text-xl"
            >
              {prev.title}
            </p>
          </div>
        </Link>

        {/* Next */}
        <Link
          href={`/work/${next.slug}`}
          data-nav-item
          data-cursor="pointer"
          className="group/nav relative flex items-center justify-end gap-6
                     p-6 text-right md:p-10"
          onMouseEnter={() => setHoveredSide("next")}
          onMouseLeave={() => setHoveredSide(null)}
          onMouseMove={(e) => handleMouseMove(e, "next")}
        >
          {/* Cursor-relative video preview */}
          <div
            ref={nextPreviewRef}
            className="pointer-events-none absolute z-30 hidden h-[120px]
                       w-[200px] -translate-x-1/2 -translate-y-[calc(100%+16px)]
                       overflow-hidden rounded-sm transition-opacity duration-300
                       lg:block"
            style={{ opacity: hoveredSide === "next" ? 1 : 0 }}
          >
            <video
              ref={nextVideoRef}
              src={next.videoSrc}
              poster={next.posterSrc}
              muted
              loop
              playsInline
              preload="none"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p
              className="mb-1 font-body text-[9px] uppercase tracking-[0.2em]
                         text-white/20"
            >
              Next
            </p>
            <p
              className="font-display text-lg font-bold leading-[1.1]
                         text-white/60 transition-colors duration-300
                         group-hover/nav:text-white md:text-xl"
            >
              {next.title}
            </p>
          </div>
          <svg
            width="20"
            height="8"
            viewBox="0 0 20 8"
            className="shrink-0 text-white/20 transition-all duration-300
                       group-hover/nav:translate-x-1
                       group-hover/nav:text-white/50"
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
        </Link>
      </div>
    </div>
  );
}
