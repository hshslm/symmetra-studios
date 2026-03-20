"use client";

import { startTransition, useEffect, useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis-instance";
import { onPageReady, markPageReady, resetPageReady } from "@/lib/splash-state";
import TransitionOverlay from "./TransitionOverlay";

const prefersReduced = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function handleLeave(next: () => void, _from?: string, _to?: string): (() => void) | void {
  resetPageReady();

  if (prefersReduced()) {
    next();
    return;
  }

  const overlay = document.getElementById("page-transition-overlay");
  const loader = document.getElementById("page-transition-loader");
  if (!overlay) {
    next();
    return;
  }

  const lenis = getLenis();
  if (lenis) lenis.stop();

  const tl = gsap.timeline({ onComplete: next });

  // Overlay sweeps UP from bottom
  tl.fromTo(
    overlay,
    { clipPath: "inset(100% 0% 0% 0%)" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.4,
      ease: "power3.inOut",
    },
  );

  // Old page content drifts upward behind the overlay
  tl.to(
    "#page-content > *",
    {
      y: -60,
      ease: "power2.in",
      duration: 0.4,
    },
    "<",
  );

  // Loader pulse as a standalone tween (repeat:-1 would block timeline completion)
  if (loader) {
    gsap.to(loader, {
      opacity: 0.6,
      duration: 0.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 0.6,
    });
  }

  return () => {
    tl.kill();
    if (loader) gsap.killTweensOf(loader);
  };
}

function handleEnter(next: () => void): (() => void) | void {
  if (prefersReduced()) {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      lenis.start();
    }
    ScrollTrigger.refresh();
    next();
    return;
  }

  // Scroll to top before revealing (synchronous — before paint)
  window.scrollTo(0, 0);
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { immediate: true });
  gsap.set("#page-content > *", { y: 0, clearProps: "transform" });

  const MAX_WAIT_FRAMES = 30; // ~500ms at 60fps
  let frame = 0;

  function tryAnimate(): void {
    const overlay = document.getElementById("page-transition-overlay");
    if (!overlay) {
      next();
      return;
    }

    const entranceElements = Array.from(
      document.querySelectorAll("[data-transition-in]"),
    ).sort((a, b) => {
      const orderA = parseInt(
        a.getAttribute("data-transition-in-order") ?? "0",
        10,
      );
      const orderB = parseInt(
        b.getAttribute("data-transition-in-order") ?? "0",
        10,
      );
      return orderA - orderB;
    });

    // If elements aren't in the DOM yet and we haven't exceeded the cap, wait another frame
    if (entranceElements.length === 0 && frame < MAX_WAIT_FRAMES) {
      frame++;
      requestAnimationFrame(tryAnimate);
      return;
    }

    // Kill loader pulse
    const loader = document.getElementById("page-transition-loader");
    if (loader) {
      gsap.killTweensOf(loader);
      gsap.set(loader, { opacity: 0 });
    }

    // Kill any leftover tweens on entrance elements from a previous visit
    if (entranceElements.length > 0) {
      gsap.killTweensOf(entranceElements);
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { clipPath: "inset(100% 0% 0% 0%)" });
        if (lenis) lenis.start();
        ScrollTrigger.refresh();
        markPageReady();
        requestAnimationFrame(() => startTransition(next));
      },
    });

    // Overlay lifts off upward
    tl.to(overlay, {
      clipPath: "inset(100% 0% 0% 0%)",
      duration: 0.7,
      ease: "expo.inOut",
    });

    // Choreographed content entrance, overlapping the overlay reveal
    if (entranceElements.length > 0) {
      tl.fromTo(
        entranceElements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.15,
      );
    }
  }

  // Start polling on the next frame
  requestAnimationFrame(tryAnimate);
}

export default function TransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const initialEntranceDone = useRef(false);

  // Animate data-transition-in elements on initial page load (after splash).
  // Client-side navigations are handled by handleEnter instead.
  useEffect(() => {
    if (initialEntranceDone.current || prefersReduced()) return;
    initialEntranceDone.current = true;

    return onPageReady(() => {
      const elements = Array.from(
        document.querySelectorAll("[data-transition-in]"),
      ).sort((a, b) => {
        const orderA = parseInt(
          a.getAttribute("data-transition-in-order") ?? "0",
          10,
        );
        const orderB = parseInt(
          b.getAttribute("data-transition-in-order") ?? "0",
          10,
        );
        return orderA - orderB;
      });

      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        );
      }
    });
  }, []);

  return (
    <>
      <TransitionOverlay />
      <TransitionRouter auto={true} leave={handleLeave} enter={handleEnter}>
        {children}
      </TransitionRouter>
    </>
  );
}
