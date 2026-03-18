"use client";

import { useRef, useEffect } from "react";

interface UseMagneticOptions {
  /** Distance in px from element center that triggers the effect. Default 80. */
  radius?: number;
  /** Max displacement in px. Default 10. */
  strength?: number;
  /** Lerp interpolation speed (0-1). Default 0.1. */
  lerp?: number;
  /** Whether magnetic is enabled. Default true. */
  enabled?: boolean;
}

export function useMagnetic<T extends HTMLElement>(
  options: UseMagneticOptions = {}
): React.RefObject<T | null> {
  const { radius = 80, strength = 10, lerp = 0.1, enabled = true } = options;

  const ref = useRef<T>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animate = (): void => {
      const pos = positionRef.current;
      const target = targetRef.current;

      pos.x += (target.x - pos.x) * lerp;
      pos.y += (target.y - pos.y) * lerp;

      if (
        Math.abs(pos.x - target.x) < 0.01 &&
        Math.abs(pos.y - target.y) < 0.01
      ) {
        pos.x = target.x;
        pos.y = target.y;
      }

      el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

      if (pos.x !== 0 || pos.y !== 0 || target.x !== 0 || target.y !== 0) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    };

    const onMouseMove = (e: MouseEvent): void => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        const pull = 1 - distance / radius;
        targetRef.current = {
          x: (distX / distance) * pull * strength,
          y: (distY / distance) * pull * strength,
        };

        if (!activeRef.current) {
          activeRef.current = true;
          if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(animate);
          }
        }
      } else if (activeRef.current) {
        targetRef.current = { x: 0, y: 0 };
        activeRef.current = false;
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(animate);
        }
      }
    };

    const onMouseLeave = (): void => {
      targetRef.current = { x: 0, y: 0 };
      activeRef.current = false;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      el.style.transform = "";
    };
  }, [radius, strength, lerp, enabled]);

  return ref;
}
