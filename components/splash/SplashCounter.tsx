"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface SplashCounterProps {
  /** Current progress 0-100 from useAssetLoader */
  progress: number;
  /** Whether loading is complete */
  isComplete: boolean;
}

export default function SplashCounter({
  progress,
  isComplete,
}: SplashCounterProps): React.ReactElement {
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const barContainerRef = useRef<HTMLDivElement>(null);
  const displayedProgress = useRef(0);

  useEffect(() => {
    if (!counterRef.current) return;

    gsap.to(displayedProgress, {
      current: progress,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          const val = Math.round(displayedProgress.current);
          counterRef.current.textContent = val.toString().padStart(2, "0");
        }
      },
    });
  }, [progress]);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.to(barRef.current, {
      width: `${progress}%`,
      duration: 0.8,
      ease: "power2.out",
    });
  }, [progress]);

  useEffect(() => {
    if (!isComplete || !barRef.current || !barContainerRef.current) return;

    const tl = gsap.timeline();
    tl.to(barRef.current, {
      width: "105%",
      duration: 0.15,
      ease: "power2.in",
    });
    tl.to(barRef.current, {
      x: "100vw",
      width: "0%",
      duration: 0.3,
      ease: "power3.in",
    });
    tl.to(
      counterRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
      },
      "<0.05"
    );
  }, [isComplete]);

  return (
    <>
      <span
        ref={counterRef}
        className="fixed bottom-8 right-8 z-[70] font-body text-sm tracking-wider text-text-secondary tabular-nums"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        00
      </span>

      <div
        ref={barContainerRef}
        className="fixed bottom-0 left-0 z-[70] h-[2px] w-full"
      >
        <div
          ref={barRef}
          className="h-full bg-white"
          style={{ width: "0%" }}
        />
      </div>
    </>
  );
}
