"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { onPageReady } from "@/lib/splash-state";
import { useMagnetic } from "@/hooks/useMagnetic";
import TextSlide from "@/components/TextSlide";
import {
  useScrollEntrance,
  useScrollEntranceGroup,
} from "@/hooks/useScrollEntrance";
import LineDivider from "@/components/LineDivider";
import TextReveal from "@/components/TextReveal";

const sections = [
  { number: "01", name: "Hero" },
  { number: "02", name: "Projects" },
  { number: "03", name: "Services" },
  { number: "04", name: "Contact" },
];


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
        <div className="flex flex-col items-center gap-6 sm:flex-row">
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
        <div ref={gridRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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
    const tween = gsap.from(heroRef.current, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
      paused: true,
    });
    return onPageReady(() => tween.play());
  });

  return (
    <>
      <section className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
        <div ref={heroRef}>
          <TextReveal
            as="h1"
            scrollTrigger={false}
            delay={0.2}
            className="font-display text-4xl font-bold tracking-tight text-text sm:text-6xl md:text-8xl"
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
              <span className="font-display text-7xl font-bold leading-none text-text-dim md:text-[120px]">
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

      <section className="flex min-h-[50vh] flex-col items-center justify-center gap-8 text-center">
        <span className="font-body text-sm uppercase tracking-widest text-text-secondary">
          TextSlide 3D Barrel
        </span>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <TextSlide
            text="WORK"
            perspective="100px"
            rotation={50}
            letterStagger={20}
            className="cursor-pointer font-body text-sm uppercase tracking-widest text-text-secondary"
          />
          <TextSlide
            text="STUDIO"
            perspective="100px"
            rotation={50}
            letterStagger={20}
            className="cursor-pointer font-body text-sm uppercase tracking-widest text-text-secondary"
          />
        </div>
        <div className="flex flex-col items-center gap-6">
          <TextSlide
            text="Work"
            perspective="200px"
            rotation={50}
            letterStagger={25}
            className="cursor-pointer font-display text-6xl font-bold text-text"
          />
          <TextSlide
            text="View Project"
            perspective="120px"
            rotation={45}
            letterStagger={20}
            className="cursor-pointer font-body text-lg uppercase tracking-widest text-text-secondary"
          />
          <TextSlide
            text="Instagram"
            perspective="80px"
            rotation={45}
            letterStagger={15}
            className="cursor-pointer font-body text-[11px] uppercase tracking-[0.15em] text-text-secondary"
          />
          <TextSlide
            text="Let's Create"
            perspective="250px"
            rotation={50}
            letterStagger={30}
            duration={500}
            className="cursor-pointer font-display text-5xl font-bold text-text sm:text-8xl"
          />
        </div>
      </section>

      <section className="flex min-h-[50vh] flex-col items-center justify-center gap-8 px-6 text-center">
        <span className="font-body text-sm uppercase tracking-widest text-text-secondary">
          Custom Cursor States
        </span>
        <div className="grid grid-cols-5 gap-4">
          <div
            data-cursor="view"
            className="flex h-40 items-center justify-center rounded bg-surface font-body text-sm text-text-secondary"
          >
            View
          </div>
          <div
            data-cursor="play"
            className="flex h-40 items-center justify-center rounded bg-surface font-body text-sm text-text-secondary"
          >
            Play
          </div>
          <div
            data-cursor="pause"
            className="flex h-40 items-center justify-center rounded bg-surface font-body text-sm text-text-secondary"
          >
            Pause
          </div>
          <div
            data-cursor="email"
            className="flex h-40 items-center justify-center rounded bg-surface font-body text-sm text-text-secondary"
          >
            Email
          </div>
          <div
            data-cursor="hide"
            className="flex h-40 items-center justify-center rounded bg-surface font-body text-sm text-text-secondary"
          >
            Hide
          </div>
        </div>
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
