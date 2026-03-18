"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const sections = [
  { number: "01", name: "Hero" },
  { number: "02", name: "Projects" },
  { number: "03", name: "Services" },
  { number: "04", name: "Contact" },
];

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
      <section className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
        <div ref={heroRef}>
          <h1 className="font-display text-6xl font-bold tracking-tight text-text md:text-8xl">
            SYMMETRA STUDIOS
          </h1>
          <p className="mt-6 font-body text-lg uppercase tracking-widest text-text-secondary">
            Premium AI Video Production
          </p>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.number}
          className="flex min-h-screen flex-col items-center justify-center gap-4 text-center"
        >
          <div className="max-content flex flex-col items-center gap-4">
            <span className="font-display text-[120px] font-bold leading-none text-text-dim">
              {section.number}
            </span>
            <span className="font-display text-4xl text-text">
              {section.name}
            </span>
          </div>
        </section>
      ))}

      <footer className="py-12 text-center">
        <p className="font-body text-sm text-text-secondary">
          Phase 1 Complete
        </p>
      </footer>
    </>
  );
}
