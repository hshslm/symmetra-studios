"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useTextScramble } from "@/hooks/useTextScramble";
import { useMagnetic } from "@/hooks/useMagnetic";
import {
  useScrollEntrance,
  useScrollEntranceGroup,
} from "@/hooks/useScrollEntrance";
import LineDivider from "@/components/LineDivider";
import TextReveal from "@/components/TextReveal";

const navItems = ["Work", "Studio", "Contact", "About"];

const sections = [
  { number: "01", name: "Hero" },
  { number: "02", name: "Projects" },
  { number: "03", name: "Services" },
  { number: "04", name: "Contact" },
];

function ScrambleNavItem({ label }: { label: string }): React.ReactElement {
  const { ref, onMouseEnter, onMouseLeave } =
    useTextScramble<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="cursor-pointer font-body text-sm uppercase tracking-widest text-text-secondary transition-colors duration-300 hover:text-white"
    >
      {label}
    </span>
  );
}

function ScrambleHeading(): React.ReactElement {
  const { ref, onMouseEnter, onMouseLeave } =
    useTextScramble<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="cursor-pointer font-body text-lg uppercase tracking-widest text-text-secondary transition-colors duration-300 hover:text-white"
    >
      VIEW PROJECT
    </span>
  );
}

function MagneticButton({
  label,
  radius,
  strength,
}: {
  label: string;
  radius?: number;
  strength?: number;
}): React.ReactElement {
  const magneticRef = useMagnetic<HTMLButtonElement>({ radius, strength });

  return (
    <button
      ref={magneticRef}
      className="cursor-pointer rounded-full border border-white/20 px-6 py-3 font-body text-sm uppercase tracking-widest text-text transition-colors duration-300 hover:border-white/60"
    >
      {label}
    </button>
  );
}

function ScrollEntranceDemo(): React.ReactElement {
  const box1Ref = useScrollEntrance<HTMLDivElement>();
  const box2Ref = useScrollEntrance<HTMLDivElement>({ y: 40, duration: 0.8 });
  const box3Ref = useScrollEntrance<HTMLDivElement>({
    y: 50,
    fromScale: 0.95,
    duration: 1,
  });
  const gridRef = useScrollEntranceGroup<HTMLDivElement>({ stagger: 0.06 });
  const immediateRef = useScrollEntrance<HTMLDivElement>({
    scrollTrigger: false,
    delay: 1,
  });

  return (
    <>
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
        <span className="font-body text-sm uppercase tracking-widest text-text-secondary">
          Scroll Entrance — Singles
        </span>
        <div className="flex flex-row items-center gap-6">
          <div
            ref={box1Ref}
            className="flex h-48 w-48 items-center justify-center rounded-lg bg-surface font-body text-sm text-text-secondary"
          >
            Default
          </div>
          <div
            ref={box2Ref}
            className="flex h-48 w-48 items-center justify-center rounded-lg bg-surface font-body text-sm text-text-secondary"
          >
            y:40 / 0.8s
          </div>
          <div
            ref={box3Ref}
            className="flex h-48 w-48 items-center justify-center rounded-lg bg-surface font-body text-sm text-text-secondary"
          >
            y:50 / scale
          </div>
        </div>
      </section>

      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
        <span className="font-body text-sm uppercase tracking-widest text-text-secondary">
          Scroll Entrance — Staggered Grid
        </span>
        <div
          ref={gridRef}
          className="grid grid-cols-3 gap-4"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="flex h-48 w-48 items-center justify-center rounded-lg bg-surface font-body text-sm text-text-secondary"
            >
              Card {n}
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-[30vh] flex-col items-center justify-center gap-8 text-center">
        <span className="font-body text-sm uppercase tracking-widest text-text-secondary">
          Immediate (delay 1s)
        </span>
        <div
          ref={immediateRef}
          className="flex h-48 w-48 items-center justify-center rounded-lg bg-surface font-body text-sm text-text-secondary"
        >
          Instant
        </div>
      </section>
    </>
  );
}

function MagneticSection(): React.ReactElement {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-8 text-center">
      <span className="font-body text-sm uppercase tracking-widest text-text-secondary">
        Magnetic Buttons
      </span>
      <div className="flex flex-row items-center gap-6">
        <MagneticButton label="View Project" />
        <MagneticButton label="Load More" radius={60} strength={8} />
        <MagneticButton label="Contact" radius={100} strength={12} />
      </div>
    </section>
  );
}

export default function Home(): React.ReactElement {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current) return;
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
    });
  });

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-center gap-8 px-6 py-6">
        {navItems.map((item) => (
          <ScrambleNavItem key={item} label={item} />
        ))}
      </nav>

      <section className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
        <div ref={heroRef}>
          <TextReveal
            as="h1"
            scrollTrigger={false}
            delay={0.2}
            className="font-display text-6xl font-bold tracking-tight text-text md:text-8xl"
          >
            SYMMETRA STUDIOS
          </TextReveal>
          <TextReveal
            as="p"
            scrollTrigger={false}
            delay={0.5}
            className="mt-6 font-body text-lg uppercase tracking-widest text-text-secondary"
          >
            Premium AI Video Production
          </TextReveal>
        </div>
      </section>

      <LineDivider
        direction="center-outward"
        duration={0.8}
        className="max-content"
      />

      {sections.map((section, index) => (
        <div key={section.number}>
          {index > 0 && <LineDivider className="max-content" />}
          <section className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
            <div className="max-content flex flex-col items-center gap-4">
              <span className="font-display text-[120px] font-bold leading-none text-text-dim">
                {section.number}
              </span>
              <TextReveal
                as="h2"
                className="font-display text-4xl text-text"
              >
                {section.name}
              </TextReveal>
              {section.number === "02" && (
                <TextReveal
                  as="p"
                  stagger={0.12}
                  duration={0.5}
                  className="mt-6 max-w-2xl font-body text-xl text-text-secondary"
                >
                  Two directors. One pipeline. Every frame considered. We treat
                  AI not as a shortcut, but as a new kind of collaborator in the
                  filmmaking process.
                </TextReveal>
              )}
            </div>
          </section>
        </div>
      ))}

      <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <ScrambleHeading />
      </section>

      <MagneticSection />

      <ScrollEntranceDemo />

      <LineDivider
        scrollTrigger={false}
        className="max-content"
        opacity={0.3}
      />

      <footer className="py-12 text-center">
        <p className="font-body text-sm text-text-secondary">
          Phase 1 Complete
        </p>
      </footer>
    </>
  );
}
