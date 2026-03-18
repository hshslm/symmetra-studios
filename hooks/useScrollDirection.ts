"use client";

import { useState, useEffect, useRef } from "react";

type ScrollDirection = "up" | "down" | null;

interface UseScrollDirectionOptions {
  /** Minimum scroll delta (px) before direction registers. Prevents jitter. Default 10. */
  threshold?: number;
}

export function useScrollDirection(
  options: UseScrollDirectionOptions = {}
): ScrollDirection {
  const { threshold = 10 } = options;
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateDirection = (): void => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY.current) < threshold) {
        ticking.current = false;
        return;
      }

      setDirection(scrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
      ticking.current = false;
    };

    const onScroll = (): void => {
      if (!ticking.current) {
        requestAnimationFrame(updateDirection);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}
