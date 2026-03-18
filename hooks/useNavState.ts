"use client";

import { useState, useEffect, useRef } from "react";

type NavAppearance = "transparent" | "solid";

interface UseNavStateOptions {
  /** Scroll position (px) where nav transitions from transparent to solid. Default 100vh. */
  solidThreshold?: number;
}

export function useNavState(options: UseNavStateOptions = {}): {
  appearance: NavAppearance;
  didTransitionToSolid: boolean;
} {
  const [appearance, setAppearance] = useState<NavAppearance>("transparent");
  const [prevAppearance, setPrevAppearance] =
    useState<NavAppearance>("transparent");
  const ticking = useRef(false);

  const thresholdValue = options.solidThreshold;

  useEffect(() => {
    const getThreshold = (): number => thresholdValue ?? window.innerHeight;

    const update = (): void => {
      const scrollY = window.scrollY;
      const threshold = getThreshold();
      const newAppearance: NavAppearance =
        scrollY >= threshold ? "solid" : "transparent";

      setAppearance((prev) => {
        if (prev !== newAppearance) {
          setPrevAppearance(prev);
        }
        return newAppearance;
      });
      ticking.current = false;
    };

    const onScroll = (): void => {
      if (!ticking.current) {
        requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [thresholdValue]);

  const didTransitionToSolid =
    appearance === "solid" && prevAppearance === "transparent";

  return { appearance, didTransitionToSolid };
}
