"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";

// Ensure plugins are available
void SplitText;
void ScrollTrigger;

interface TextRevealProps {
  /** The tag to render. Default 'div'. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Stagger between lines in seconds. Default 0.1. */
  stagger?: number;
  /** Duration per line in seconds. Default 0.6. */
  duration?: number;
  /** Easing. Default 'power3.out'. */
  ease?: string;
  /** Delay before animation starts. Default 0. */
  delay?: number;
  /** ScrollTrigger start position. Default 'top 85%'. */
  triggerStart?: string;
  /** If false, plays immediately instead of on scroll. Default true. */
  scrollTrigger?: boolean;
  /** Additional className. */
  className?: string;
  /** Children (the text content to reveal). */
  children: React.ReactNode;
}

export default function TextReveal({
  as: Tag = "div",
  stagger = 0.1,
  duration = 0.6,
  ease = "power3.out",
  delay = 0,
  triggerStart = "top 85%",
  scrollTrigger: useScrollTrigger = true,
  className = "",
  children,
}: TextRevealProps): React.ReactElement {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const split = SplitText.create(containerRef.current, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
      });

      gsap.set(split.lines, { yPercent: 100 });

      const tween = gsap.to(split.lines, {
        yPercent: 0,
        duration,
        stagger,
        ease,
        delay,
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

      return () => {
        split.revert();
      };
    },
    { scope: containerRef }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any;

  return (
    <Component ref={containerRef} className={className}>
      {children}
    </Component>
  );
}
