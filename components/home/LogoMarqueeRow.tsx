"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import {
  horizontalLoop,
  type HorizontalLoopTimeline,
} from "@/lib/horizontal-loop";
import type { ClientLogo } from "@/lib/client-logos";

interface LogoMarqueeRowProps {
  logos: ClientLogo[];
  speed?: number;
  reversed?: boolean;
  className?: string;
}

export default function LogoMarqueeRow({
  logos,
  speed = 1,
  reversed = false,
  className = "",
}: LogoMarqueeRowProps): React.ReactElement {
  const rowRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HorizontalLoopTimeline | null>(null);

  useGSAP(
    () => {
      if (!rowRef.current) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) return;

      const items = gsap.utils.toArray<HTMLElement>(
        rowRef.current.querySelectorAll("[data-marquee-item]"),
      );

      if (items.length === 0) return;

      // Responsive speed: mobile viewports are narrower so logos
      // cross the screen faster at the same px/s.
      const vw = window.innerWidth;
      const speedMultiplier = vw < 768 ? speed * 0.3 : speed * 0.5;

      const loop = horizontalLoop(items, {
        repeat: -1,
        speed: speedMultiplier,
        reversed,
        draggable: true,
        snap: false,
        paddingRight: 0,
      });

      loopRef.current = loop;

      // Hover pauses the entire row
      const container = rowRef.current;
      const handleEnter = (): void => {
        loop.pause();
      };
      const handleLeave = (): void => {
        loop.resume();
      };

      container.addEventListener("mouseenter", handleEnter);
      container.addEventListener("mouseleave", handleLeave);

      return () => {
        container.removeEventListener("mouseenter", handleEnter);
        container.removeEventListener("mouseleave", handleLeave);
        loop.kill();
      };
    },
    { scope: rowRef },
  );

  // Pause loop when off-screen
  useEffect(() => {
    if (!rowRef.current) return;
    const el = rowRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loopRef.current?.resume();
        } else {
          loopRef.current?.pause();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Triple the logos so horizontalLoop has enough items to fill
  // the viewport + overflow in both directions.
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <div
      ref={rowRef}
      className={`flex cursor-grab items-center active:cursor-grabbing ${className}`}
      style={{ overflow: "visible", gap: "60px" }}
    >
      {duplicatedLogos.map((logo, i) => (
        <div
          key={`${logo.id}-${i}`}
          data-marquee-item
          className="group shrink-0"
          data-cursor="drag"
        >
          <img
            src={logo.src}
            alt={logo.name}
            className="pointer-events-none h-4 w-auto select-none transition-all duration-300 md:h-5"
            style={{
              filter: "grayscale(1) brightness(0.7)",
              opacity: 0.4,
            }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
