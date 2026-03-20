"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { onPageReady } from "@/lib/splash-state";
import HeroVideo from "./HeroVideo";
import HeroVignette from "./HeroVignette";
import HeroParticles from "./HeroParticles";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero(): React.ReactElement {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = [
        "#hero-logo",
        "#hero-title",
        "#hero-tagline",
        "#hero-scroll-indicator",
      ];

      // Set initial hidden state
      gsap.set(targets, { y: 30, opacity: 0 });

      // Build the entrance timeline (paused until page is ready)
      const tl = gsap.timeline({ paused: true });

      tl.to("#hero-logo", {
        y: 0,
        opacity: 0.8,
        duration: 0.6,
        ease: "power3.out",
      });
      tl.to(
        "#hero-title",
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.4",
      );
      tl.to(
        "#hero-tagline",
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.3",
      );
      tl.to(
        "#hero-scroll-indicator",
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.2",
      );

      return onPageReady(() => tl.play());
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Layer 1: Video background */}
      <HeroVideo
        src="/videos/showreel.mp4"
        poster="/videos/showreel-poster.webp"
      />

      {/* Layer 2: Radial vignette */}
      <HeroVignette />

      {/* Layer 3: Ambient particles */}
      <HeroParticles />

      {/* Layer 4: Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Logo mark */}
        <div data-transition-in data-transition-in-order="1" id="hero-logo">
          <img
            src="/logo.svg"
            alt=""
            className="mb-8 h-10 w-auto opacity-80"
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <div data-transition-in data-transition-in-order="2" id="hero-title">
          <h1 className="font-display text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[100px]">
            SYMMETRA STUDIOS
          </h1>
        </div>

        {/* Tagline */}
        <div data-transition-in data-transition-in-order="3" id="hero-tagline">
          <p className="mt-5 max-w-xl font-body text-base text-text-secondary sm:text-lg md:mt-6 md:text-xl">
            Premium AI Video Production
          </p>
        </div>
      </div>

      {/* Layer 5: Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
