"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, MorphSVGPlugin } from "@/lib/gsap";
import { useCursorState } from "@/hooks/useCursorState";
import { cursorPaths, type CursorShape } from "./cursor-paths";

void MorphSVGPlugin;

// Lerp speeds for each layer
const LERP = {
  icon: 0.15,
  circle: 0.08,
  label: 0.05,
};

// Circle sizes per state
const CIRCLE_SIZE: Record<CursorShape, number> = {
  dot: 16,
  play: 64,
  pause: 64,
  arrow: 56,
};

export default function CustomCursor(): React.ReactElement | null {
  const { state } = useCursorState();
  const iconRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const labelPosRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  // Smooth positions for each layer
  const posRef = useRef({
    icon: { x: -100, y: -100 },
    circle: { x: -100, y: -100 },
    label: { x: -100, y: -100 },
  });

  const currentShapeRef = useRef<CursorShape>("dot");

  // Track mouse position
  useEffect(() => {
    const onMouseMove = (e: MouseEvent): void => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = (): void => setIsVisible(false);
    const onMouseEnter = (): void => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  // RAF loop — lerp all three layers toward mouse position
  // Only touches transform on positional wrappers, never on GSAP-animated elements
  useEffect(() => {
    const animate = (): void => {
      const { x: mx, y: my } = mouseRef.current;
      const pos = posRef.current;

      pos.icon.x += (mx - pos.icon.x) * LERP.icon;
      pos.icon.y += (my - pos.icon.y) * LERP.icon;

      pos.circle.x += (mx - pos.circle.x) * LERP.circle;
      pos.circle.y += (my - pos.circle.y) * LERP.circle;

      pos.label.x += (mx - pos.label.x) * LERP.label;
      pos.label.y += (my - pos.label.y) * LERP.label;

      if (iconRef.current) {
        iconRef.current.style.transform = `translate(${pos.icon.x}px, ${pos.icon.y}px) translate(-50%, -50%)`;
      }
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${pos.circle.x}px, ${pos.circle.y}px) translate(-50%, -50%)`;
      }
      if (labelPosRef.current) {
        labelPosRef.current.style.transform = `translate(${pos.label.x + 28}px, ${pos.label.y + 28}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Morph icon shape when state changes
  useEffect(() => {
    if (!pathRef.current) return;
    if (currentShapeRef.current === state.shape) return;

    const targetPath = cursorPaths[state.shape];
    if (!targetPath) return;

    gsap.killTweensOf(pathRef.current);

    gsap.to(pathRef.current, {
      morphSVG: {
        shape: targetPath,
        type: "rotational",
      },
      duration: 0.4,
      ease: "expo.out",
    });

    currentShapeRef.current = state.shape;
  }, [state.shape]);

  // Animate circle size when state changes
  useEffect(() => {
    if (!circleRef.current) return;

    const size = CIRCLE_SIZE[state.shape] ?? CIRCLE_SIZE.dot;
    const opacity = state.shape === "dot" ? 0.3 : 0.5;

    gsap.to(circleRef.current, {
      width: size,
      height: size,
      opacity,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [state.shape, state.label]);

  // Animate label in/out — uses labelTextRef (inner span), NOT the
  // positional wrapper, so GSAP's opacity/y never conflicts with RAF's transform
  useEffect(() => {
    if (!labelTextRef.current) return;

    gsap.killTweensOf(labelTextRef.current);

    if (state.label) {
      labelTextRef.current.textContent = state.label;
      gsap.to(labelTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power3.out",
      });
    } else {
      gsap.to(labelTextRef.current, {
        opacity: 0,
        y: 5,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (labelTextRef.current) {
            labelTextRef.current.textContent = "";
          }
        },
      });
    }
  }, [state.label]);

  if (!state.visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* Layer 0: Icon (SVG path) */}
      <div
        ref={iconRef}
        className="absolute top-0 left-0 will-change-transform"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={pathRef}
            d={cursorPaths.dot}
            fill="white"
            stroke="none"
          />
        </svg>
      </div>

      {/* Layer 1: Circle (ring) */}
      <div
        ref={circleRef}
        className="absolute top-0 left-0 rounded-full border border-white will-change-transform"
        style={{
          width: 16,
          height: 16,
          opacity: 0.3,
        }}
      />

      {/* Layer 2: Label — outer div for RAF position, inner span for GSAP animation */}
      <div
        ref={labelPosRef}
        className="absolute top-0 left-0 will-change-transform"
      >
        <span
          ref={labelTextRef}
          className="block whitespace-nowrap font-body text-[11px] uppercase tracking-[0.15em] text-white"
          style={{ opacity: 0, transform: "translateY(5px)" }}
        />
      </div>
    </div>
  );
}
