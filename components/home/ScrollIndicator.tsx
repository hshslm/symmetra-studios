"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export default function ScrollIndicator(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!lineRef.current) return;

      gsap.to(lineRef.current, {
        scaleY: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      id="hero-scroll-indicator"
      className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
    >
      {/* Pulsing line */}
      <div
        ref={lineRef}
        className="h-8 w-[1px] origin-top bg-white/40"
        style={{ transform: "scaleY(0.4)", opacity: 0.5 }}
      />

      {/* Label */}
      <span className="font-body text-[10px] uppercase tracking-[0.2em] text-text-secondary">
        Scroll
      </span>
    </div>
  );
}
