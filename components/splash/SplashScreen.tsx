"use client";

import { useRef, useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import SplashLogo from "./SplashLogo";
import SplashName, { type SplashNameHandle } from "./SplashName";
import SplashCounter from "./SplashCounter";
import { useAssetLoader } from "@/hooks/useAssetLoader";
import { useLenis } from "@/components/providers/LenisProvider";

interface SplashScreenProps {
  /** URLs of assets to preload during splash */
  assets?: string[];
  children: React.ReactNode;
}

// Hydration-safe check for whether splash should be skipped.
// Returns false on server, checks sessionStorage + reduced motion on client.
const subscribeNoop = (): (() => void) => () => {};

function useShouldSkipSplash(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      return !!(
        sessionStorage.getItem("symmetra-splash-seen") || reducedMotion
      );
    },
    () => false // Server snapshot: never skip (always render splash HTML)
  );
}

export default function SplashScreen({
  assets = [],
  children,
}: SplashScreenProps): React.ReactElement {
  const shouldSkip = useShouldSkipSplash();
  const [showSplash, setShowSplash] = useState(!shouldSkip);
  const [splashDone, setSplashDone] = useState(shouldSkip);
  const lenis = useLenis();

  // Stop Lenis during splash, start after
  useEffect(() => {
    if (!lenis) return;
    if (showSplash) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [showSplash, lenis]);
  const splashRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const nameRef = useRef<SplashNameHandle>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const { progress, isComplete } = useAssetLoader({
    assets: showSplash ? assets : [],
    minimumDuration: 1500,
  });

  const runExitAnimation = useCallback(async () => {
    if (!splashRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const exitTl = gsap.timeline();

    // Logo + name fade out together, fast
    if (logoRef.current) {
      exitTl.to(logoRef.current, {
        opacity: 0,
        scale: 0.97,
        duration: 0.3,
        ease: "power2.in",
      }, 0);
    }

    if (nameContainerRef.current) {
      exitTl.to(nameContainerRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      }, 0);
    }

    // Curtain wipe immediately after
    exitTl.to(splashRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.5,
      ease: "expo.inOut",
    }, 0.2);

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

      gsap.set(svg, { scale: 0.97 });

      tl.to(
        darkPaths,
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.01,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        midPaths,
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.008,
          ease: "power2.out",
        },
        0.08
      );

      tl.to(
        lightPaths,
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.015,
          ease: "power2.out",
        },
        0.15
      );

      tl.to(
        svg,
        {
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        0
      );

      tl.add(() => {
        nameRef.current?.play();
      }, 0.6);
    },
    { dependencies: [showSplash] }
  );

  useEffect(() => {
    if (!showSplash || !isComplete) return;

    const timer = setTimeout(() => {
      runExitAnimation();
    }, 100);

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
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-bg"
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
