"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import SplashLogo from "./SplashLogo";
import SplashName, { type SplashNameHandle } from "./SplashName";
import SplashCounter from "./SplashCounter";
import { useAssetLoader } from "@/hooks/useAssetLoader";

interface SplashScreenProps {
  /** URLs of assets to preload during splash */
  assets?: string[];
  children: React.ReactNode;
}

function shouldSkipSplash(): boolean {
  if (typeof window === "undefined") return false;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  return !!(sessionStorage.getItem("symmetra-splash-seen") || reducedMotion);
}

export default function SplashScreen({
  assets = [],
  children,
}: SplashScreenProps): React.ReactElement {
  const [showSplash, setShowSplash] = useState(() => !shouldSkipSplash());
  const [splashDone, setSplashDone] = useState(() => shouldSkipSplash());
  const splashRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const nameRef = useRef<SplashNameHandle>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const { progress, isComplete } = useAssetLoader({
    assets: showSplash ? assets : [],
    minimumDuration: 3500,
  });

  const runExitAnimation = useCallback(async () => {
    if (!splashRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const exitTl = gsap.timeline();

    // Beat 1: Logo dematerializes — reverse order (light → mid → dark)
    if (logoRef.current) {
      const svg = logoRef.current;
      const lightPaths = svg.querySelectorAll('[data-group="light"]');
      const midPaths = svg.querySelectorAll('[data-group="mid"]');
      const darkPaths = svg.querySelectorAll('[data-group="dark"]');

      // Light paths vanish first (reverse of entrance where they appeared last)
      exitTl.to(lightPaths, {
        opacity: 0,
        duration: 0.6,
        stagger: 0.02,
        ease: "power2.in",
      }, 0);

      // Mid paths follow
      exitTl.to(midPaths, {
        opacity: 0,
        duration: 0.5,
        stagger: 0.012,
        ease: "power2.in",
      }, 0.15);

      // Dark paths last (barely visible, dissolving into the background)
      exitTl.to(darkPaths, {
        opacity: 0,
        duration: 0.4,
        stagger: 0.015,
        ease: "power2.in",
      }, 0.3);

      // Scale breathe out (reverse: 1.0 → 0.95)
      exitTl.to(svg, {
        scale: 0.95,
        duration: 1.2,
        ease: "power2.in",
      }, 0);
    }

    // Beat 1b: Name fades out alongside logo
    if (nameContainerRef.current) {
      exitTl.to(
        nameContainerRef.current,
        {
          opacity: 0,
          y: 10,
          duration: 0.8,
          ease: "power2.inOut",
        },
        0.1
      );
    }

    // Beat 2: Hold — let the black breathe for a moment
    exitTl.to({}, { duration: 0.4 });

    // Beat 3: Curtain wipe — slow, cinematic reveal of page beneath
    exitTl.to(splashRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.4,
      ease: "expo.inOut",
    });

    await exitTl;

    sessionStorage.setItem("symmetra-splash-seen", "true");
    setSplashDone(true);
    setShowSplash(false);
  }, []);

  useGSAP(
    () => {
      if (!showSplash || !logoRef.current) return;

      const svg = logoRef.current;
      const darkPaths = svg.querySelectorAll('[data-group="dark"]');
      const midPaths = svg.querySelectorAll('[data-group="mid"]');
      const lightPaths = svg.querySelectorAll('[data-group="light"]');

      const tl = gsap.timeline();

      gsap.set(svg, { scale: 0.95 });

      tl.to(
        darkPaths,
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.02,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        midPaths,
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.015,
          ease: "power2.out",
        },
        0.15
      );

      tl.to(
        lightPaths,
        {
          opacity: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: "power2.out",
        },
        0.3
      );

      tl.to(
        svg,
        {
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        },
        0
      );

      tl.add(() => {
        nameRef.current?.play();
      }, 1.5);
    },
    { dependencies: [showSplash] }
  );

  useEffect(() => {
    if (!showSplash || !isComplete) return;

    const timer = setTimeout(() => {
      runExitAnimation();
    }, 800);

    return () => clearTimeout(timer);
  }, [isComplete, showSplash, runExitAnimation]);

  if (!showSplash && splashDone) {
    return <>{children}</>;
  }

  return (
    <>
      {showSplash && (
        <div
          ref={splashRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg"
          style={{ clipPath: "inset(0 0 0 0)" }}
        >
          <SplashLogo ref={logoRef} className="h-auto w-24 sm:w-32" />

          <div ref={nameContainerRef} className="mt-6">
            <SplashName ref={nameRef} />
          </div>

          <SplashCounter progress={progress} isComplete={isComplete} />
        </div>
      )}

      <div style={{ visibility: splashDone ? "visible" : "hidden" }}>
        {children}
      </div>
    </>
  );
}
