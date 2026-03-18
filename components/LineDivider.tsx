"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, DrawSVGPlugin, ScrollTrigger } from "@/lib/gsap";

// Ensure DrawSVGPlugin is available
void DrawSVGPlugin;

interface LineDividerProps {
  /** Animation direction. Default 'left-to-right'. */
  direction?: "left-to-right" | "center-outward";
  /** Duration in seconds. Default 0.5. */
  duration?: number;
  /** Easing. Default 'power2.inOut'. */
  ease?: string;
  /** If true, triggers when scrolled into view. If false, plays immediately on mount. Default true. */
  scrollTrigger?: boolean;
  /** ScrollTrigger start position. Default 'top 90%'. */
  triggerStart?: string;
  /** Line color. Default '#FFFFFF'. */
  color?: string;
  /** Line opacity. Default 1. */
  opacity?: number;
  /** Additional className for the container div. */
  className?: string;
}

export default function LineDivider({
  direction = "left-to-right",
  duration = 0.5,
  ease = "power2.inOut",
  scrollTrigger: useScrollTrigger = true,
  triggerStart = "top 90%",
  color = "#FFFFFF",
  opacity = 1,
  className = "",
}: LineDividerProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGLineElement>(null);

  useGSAP(
    () => {
      if (!pathRef.current || !containerRef.current) return;

      const drawFrom = direction === "center-outward" ? "50% 50%" : "0%";

      gsap.set(pathRef.current, { drawSVG: drawFrom });

      const tween = gsap.to(pathRef.current, {
        drawSVG: "0% 100%",
        duration,
        ease,
        paused: useScrollTrigger,
      });

      if (useScrollTrigger) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: triggerStart,
          onEnter: () => tween.play(),
          once: true,
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <svg
        width="100%"
        height="1"
        viewBox="0 0 1000 1"
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <line
          ref={pathRef}
          x1="0"
          y1="0.5"
          x2="1000"
          y2="0.5"
          stroke={color}
          strokeWidth="1"
          opacity={opacity}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
