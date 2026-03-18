"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import { gsap } from "@/lib/gsap";
import { TextScramble } from "@/lib/text-scramble";

export interface SplashNameHandle {
  play: () => Promise<void>;
}

const SplashName = forwardRef<SplashNameHandle>(function SplashName(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    play: async () => {
      if (!containerRef.current || !textRef.current) return;

      gsap.set(containerRef.current, {
        clipPath: "inset(100% 0 0 0)",
        opacity: 1,
      });
      gsap.set(textRef.current, { opacity: 1 });

      await new Promise<void>((resolve) => {
        gsap.to(containerRef.current, {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.6,
          ease: "power3.out",
          onComplete: resolve,
        });
      });

      const scrambler = new TextScramble(textRef.current);
      await scrambler.scramble("SYMMETRA STUDIOS");
      scrambler.destroy();
    },
  }));

  return (
    <div ref={containerRef} className="opacity-0">
      <span
        ref={textRef}
        className="font-body text-xs uppercase tracking-[0.2em] text-text-secondary opacity-0 sm:text-sm"
      >
        SYMMETRA STUDIOS
      </span>
    </div>
  );
});

export default SplashName;
