"use client";

import { useRef, useEffect, useSyncExternalStore } from "react";

const PARTICLE_COUNT = 40;
const PARTICLE_MIN_SIZE = 0.8;
const PARTICLE_MAX_SIZE = 1.8;
const PARTICLE_MIN_OPACITY = 0.1;
const PARTICLE_MAX_OPACITY = 0.25;
const DRIFT_SPEED = 0.15; // px per frame at 60fps

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size:
      PARTICLE_MIN_SIZE +
      Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE),
    opacity:
      PARTICLE_MIN_OPACITY +
      Math.random() * (PARTICLE_MAX_OPACITY - PARTICLE_MIN_OPACITY),
    vx: (Math.random() - 0.5) * DRIFT_SPEED * 2,
    vy: (Math.random() - 0.5) * DRIFT_SPEED * 2,
  };
}

const subscribeNoop = (): (() => void) => () => {};

function useShouldHideParticles(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const isMobile = window.innerWidth < 768;
      return reducedMotion || isMobile;
    },
    () => true, // Server: hide particles (no canvas on SSR)
  );
}

export default function HeroParticles(): React.ReactElement | null {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const isHidden = useShouldHideParticles();
  const isVisible = !isHidden;

  // Initialize particles and animation loop
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Size canvas to parent
    const resize = (): void => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = parent.clientWidth + "px";
      canvas.style.height = parent.clientHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    // Create initial particles
    const w = canvas.parentElement?.clientWidth || window.innerWidth;
    const h = canvas.parentElement?.clientHeight || window.innerHeight;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(w, h),
    );

    // Animation loop
    const animate = (): void => {
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      id="hero-particles"
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
