"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { onPageReady } from "@/lib/splash-state";
import HeroVideo from "./HeroVideo";
import HeroVignette from "./HeroVignette";
import HeroParticles from "./HeroParticles";
import ScrollIndicator from "./ScrollIndicator";
import HeroDimming from "./HeroDimming";
import LineDivider from "@/components/LineDivider";
import TextReveal from "@/components/TextReveal";

export default function Hero(): React.ReactElement {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = [
        "#hero-title",
        "#hero-tagline",
        "#hero-scroll-indicator",
      ];

      // Set initial hidden state
      gsap.set(targets, { y: 30, opacity: 0 });

      // Build the entrance timeline (paused until page is ready)
      const tl = gsap.timeline({ paused: true });

      tl.to("#hero-title", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      });
      tl.to(
        "#hero-tagline",
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4",
      );
      tl.to(
        "#hero-scroll-indicator",
        { opacity: 1, duration: 0.6, ease: "power3.out" },
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
        {/* Title */}
        <div data-transition-in data-transition-in-order="1" id="hero-title">
          <TextReveal
            as="h1"
            scrollTrigger={false}
            delay={0.5}
            className="font-display text-6xl font-bold leading-[0.9] tracking-[0.02em] text-white sm:text-7xl md:text-8xl lg:text-[120px] xl:text-[140px]"
          >
            <span style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>
              SYMMETRA STUDIOS
            </span>
          </TextReveal>
        </div>

        {/* Tagline */}
        <div data-transition-in data-transition-in-order="2" id="hero-tagline">
          <p className="mt-8 font-body text-sm uppercase tracking-[0.15em] text-white/40 sm:text-base md:mt-10 md:text-lg">
            Premium AI Video Production
          </p>
        </div>
      </div>

      {/* Layer 5: Scroll indicator */}
      <ScrollIndicator />

      {/* Scroll-driven dimming sequence */}
      <HeroDimming />

      {/* Exit line: draws at 70-100% of dimming scroll */}
      <div
        id="hero-exit-line"
        className="absolute bottom-0 left-0 z-20 w-full"
      >
        <LineDivider
          scrollTrigger={false}
          direction="left-to-right"
          duration={0.8}
          ease="power2.inOut"
          opacity={0.3}
          className="w-full"
        />
      </div>
    </section>
  );
}
