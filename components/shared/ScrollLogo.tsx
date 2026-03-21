"use client";

import { useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

function getNavPos(): { x: number; y: number; h: number } {
  const isMd = window.innerWidth >= 768;
  return { x: isMd ? 40 : 24, y: isMd ? 32 : 24, h: isMd ? 40 : 40 };
}

function getHeroSize(): number {
  return Math.max(80, Math.min(window.innerWidth * 0.09, 110));
}

export default function ScrollLogo(): React.ReactElement {
  const logoRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const pos = useRef<"hero" | "nav">(pathname === "/" ? "hero" : "nav");
  // Synced with pathname during render (NOT in useEffect) so scroll handler
  // sees the new value immediately, before any scroll events fire.
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  // Apply logo properties at a given 0→1 progress (hero→nav)
  const applyProgress = useCallback((logo: HTMLElement, p: number): void => {
    const nav = getNavPos();
    const heroSize = getHeroSize();
    const navScale = nav.h / heroSize;

    const heroTop = window.innerHeight * 0.22;
    const heroLeft = window.innerWidth * 0.5;

    gsap.set(logo, {
      top: heroTop + (nav.y - heroTop) * p,
      left: heroLeft + (nav.x - heroLeft) * p,
      xPercent: -50 + 50 * p,
      yPercent: -50 + 50 * p,
      scale: 1 + (navScale - 1) * p,
      transformOrigin: p > 0.5 ? "top left" : "center center",
      opacity: 0.7 + (0.5 - 0.7) * p,
    });

    pos.current = p > 0.9 ? "nav" : "hero";
  }, []);

  // Set to nav position instantly
  const setNav = useCallback((logo: HTMLElement): void => {
    const nav = getNavPos();
    const navScale = nav.h / getHeroSize();
    gsap.set(logo, {
      top: nav.y,
      left: nav.x,
      xPercent: 0,
      yPercent: 0,
      scale: navScale,
      transformOrigin: "top left",
      opacity: 0.5,
    });
    pos.current = "nav";
  }, []);

  // ─── Scroll handler: manually interpolates logo based on scrollY ───
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const heroSize = getHeroSize();
    gsap.set(logo, { height: heroSize, width: "auto" });

    // Initial position based on current page
    if (pathname === "/" && window.scrollY < 400) {
      applyProgress(logo, Math.min(1, window.scrollY / 400));
    } else {
      setNav(logo);
    }

    const onScroll = (): void => {
      // Check pathnameRef (synced during render) — NOT a stale useEffect value
      if (pathnameRef.current !== "/") return;
      const p = Math.min(1, window.scrollY / 400);
      applyProgress(logo, p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Route changes ───
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const logo = logoRef.current;
    if (!logo) return;

    gsap.killTweensOf(logo);
    const isHome = pathname === "/";

    if (isHome && pos.current === "nav") {
      // Animate to hero center, enable scroll tracking
      gsap.to(logo, {
        top: window.innerHeight * 0.22,
        left: window.innerWidth * 0.5,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        transformOrigin: "center center",
        opacity: 0.7,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          pos.current = "hero";

        },
      });
    } else if (isHome) {

    } else {
      // Leaving homepage — disable scroll tracking FIRST


      if (pos.current === "nav") {
        // Already at nav — just force it
        setNav(logo);
      } else {
        // Animate to nav
        const nav = getNavPos();
        const navScale = nav.h / getHeroSize();
        pos.current = "nav";
        gsap.to(logo, {
          top: nav.y,
          left: nav.x,
          xPercent: 0,
          yPercent: 0,
          scale: navScale,
          transformOrigin: "top left",
          opacity: 0.5,
          duration: 0.6,
          ease: "power3.inOut",
        });
      }
    }
  }, [pathname, setNav, applyProgress]);

  // ─── Menu open/close ───
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const handleMenu = (e: Event): void => {
      const isOpen = (e as CustomEvent).detail as boolean;

      if (isOpen) {
  
        pos.current = "hero";
        gsap.to(logo, {
          top: window.innerHeight * 0.22,
          left: window.innerWidth * 0.5,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          transformOrigin: "center center",
          opacity: 0.7,
          duration: 0.5,
          ease: "power3.inOut",
        });
      } else {
        const heroEl = document.getElementById("hero");
        const scrolledPast = heroEl && window.scrollY > 400;

        if (heroEl && !scrolledPast) {
          pos.current = "hero";

          gsap.to(logo, {
            top: window.innerHeight * 0.22,
            left: window.innerWidth * 0.5,
            xPercent: -50,
            yPercent: -50,
            scale: 1,
            transformOrigin: "center center",
            opacity: 0.7,
            duration: 0.5,
            ease: "power3.inOut",
          });
        } else {
          const nav = getNavPos();
          const navScale = nav.h / getHeroSize();
          pos.current = "nav";
          gsap.to(logo, {
            top: nav.y,
            left: nav.x,
            xPercent: 0,
            yPercent: 0,
            scale: navScale,
            transformOrigin: "top left",
            opacity: 0.5,
            duration: 0.5,
            ease: "power3.inOut",
          });
        }
      }
    };

    window.addEventListener("menu-toggle", handleMenu);
    return () => window.removeEventListener("menu-toggle", handleMenu);
  }, []);

  return (
    <div
      ref={logoRef}
      className="pointer-events-auto fixed z-[52]"
      data-cursor="pointer"
    >
      <button
        onClick={() => {
          // Close menu if open
          window.dispatchEvent(
            new CustomEvent("menu-toggle", { detail: false }),
          );

          if (pathnameRef.current === "/") {
            // Already on homepage — scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            // Navigate to homepage
            router.push("/");
          }
        }}
        aria-label="Symmetra Studios - Home"
        className="block h-full w-auto"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Symmetra Studios"
          className="h-full w-auto"
        />
      </button>
    </div>
  );
}
