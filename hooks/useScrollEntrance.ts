"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

void ScrollTrigger;

interface UseScrollEntranceOptions {
  /** Starting Y offset in px. Default 30. */
  y?: number;
  /** Starting X offset in px. Default 0. */
  x?: number;
  /** Starting opacity. Default 0. */
  fromOpacity?: number;
  /** Starting scale. Default 1 (no scale). */
  fromScale?: number;
  /** Duration in seconds. Default 0.6. */
  duration?: number;
  /** Easing. Default 'power3.out'. */
  ease?: string;
  /** Delay in seconds. Default 0. */
  delay?: number;
  /** ScrollTrigger start position. Default 'top 85%'. */
  triggerStart?: string;
  /** If false, plays immediately. Default true. */
  scrollTrigger?: boolean;
  /** Whether entrance is enabled. Default true. */
  enabled?: boolean;
}

export function useScrollEntrance<T extends HTMLElement>(
  options: UseScrollEntranceOptions = {}
): React.RefObject<T | null> {
  const {
    y = 30,
    x = 0,
    fromOpacity = 0,
    fromScale = 1,
    duration = 0.6,
    ease = "power3.out",
    delay = 0,
    triggerStart = "top 85%",
    scrollTrigger: useScrollTrigger = true,
    enabled = true,
  } = options;

  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (!ref.current || !enabled) return;

      gsap.set(ref.current, {
        opacity: fromOpacity,
        y,
        x,
        scale: fromScale,
      });

      const tween = gsap.to(ref.current, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        ease,
        delay,
        paused: useScrollTrigger,
      });

      if (useScrollTrigger) {
        ScrollTrigger.create({
          trigger: ref.current,
          start: triggerStart,
          onEnter: () => tween.play(),
          once: true,
        });
      }
    },
    { dependencies: [enabled] }
  );

  return ref;
}

export function useScrollEntranceGroup<T extends HTMLElement>(
  options: UseScrollEntranceOptions & { stagger?: number } = {}
): React.RefObject<T | null> {
  const {
    y = 30,
    x = 0,
    fromOpacity = 0,
    fromScale = 1,
    duration = 0.6,
    ease = "power3.out",
    delay = 0,
    stagger = 0.08,
    triggerStart = "top 85%",
    scrollTrigger: useScrollTrigger = true,
    enabled = true,
  } = options;

  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (!ref.current || !enabled) return;

      const children = ref.current.children;
      if (!children.length) return;

      gsap.set(children, {
        opacity: fromOpacity,
        y,
        x,
        scale: fromScale,
      });

      const tween = gsap.to(children, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        ease,
        delay,
        stagger,
        paused: useScrollTrigger,
      });

      if (useScrollTrigger) {
        ScrollTrigger.create({
          trigger: ref.current,
          start: triggerStart,
          onEnter: () => tween.play(),
          once: true,
        });
      }
    },
    { dependencies: [enabled] }
  );

  return ref;
}
