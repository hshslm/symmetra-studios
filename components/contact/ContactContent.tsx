"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import TextSlide from "@/components/TextSlide";

void SplitText;

const socials = [
  { label: "Instagram", href: "https://instagram.com/symmetrastudios" },
  { label: "Vimeo", href: "https://vimeo.com/symmetrastudios" },
  { label: "YouTube", href: "https://youtube.com/@symmetrastudios" },
  { label: "LinkedIn", href: "https://linkedin.com/company/symmetrastudios" },
];

export default function ContactContent(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // ── Live Dubai time ──
  const [dubaiTime, setDubaiTime] = useState("");

  useEffect(() => {
    const update = (): void => {
      setDubaiTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Dubai",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  // ── Entrance animation ──
  useGSAP(
    () => {
      const section = sectionRef.current;
      const heading = headingRef.current;
      if (!section || !heading) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const email = section.querySelector("[data-contact-email]");
      const socialLinks = section.querySelectorAll("[data-contact-social]");
      const location = section.querySelector("[data-contact-location]");
      const label = section.querySelector("[data-contact-label]");

      if (reduced) {
        if (label) gsap.set(label, { opacity: 1, y: 0 });
        gsap.set(heading, { opacity: 1 });
        if (email) gsap.set(email, { opacity: 1, y: 0 });
        gsap.set(socialLinks, { opacity: 1 });
        if (location) gsap.set(location, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.6 });

      // Label fade up
      if (label) {
        gsap.set(label, { opacity: 0, y: 12 });
        tl.to(
          label,
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
          0,
        );
      }

      // Heading: SplitText word reveal, then re-split for hover
      gsap.set(heading, { opacity: 1 });
      const wordSplit = SplitText.create(heading, {
        type: "words",
        mask: "words",
      });

      tl.from(
        wordSplit.words,
        {
          yPercent: 100,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          onComplete: () => {
            wordSplit.revert();
          },
        },
        0.1,
      );

      // Email: fade up
      if (email) {
        gsap.set(email, { opacity: 0, y: 15 });
        tl.to(
          email,
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          0.6,
        );
      }

      // Social links: stagger
      gsap.set(socialLinks, { opacity: 0 });
      tl.to(
        socialLinks,
        { opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
        0.9,
      );

      // Location: fade up
      if (location) {
        gsap.set(location, { opacity: 0, y: 8 });
        tl.to(
          location,
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
          1.1,
        );
      }

    },
    { scope: sectionRef },
  );


  // ── Keyboard easter egg: typing "hello" ──
  useEffect(() => {
    let buffer = "";
    const target = "hello";

    const handleKey = (e: KeyboardEvent): void => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;

      buffer += e.key.toLowerCase();
      if (buffer.length > target.length) {
        buffer = buffer.slice(-target.length);
      }

      if (buffer === target) {
        buffer = "";
        const emailLink = document.querySelector(
          "[data-contact-email] a",
        );
        if (emailLink) {
          gsap.to(emailLink, {
            color: "#FFFFFF",
            textShadow: "0 0 30px rgba(255,255,255,0.3)",
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.set(emailLink, { clearProps: "textShadow" });
            },
          });
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex min-h-dvh flex-1 flex-col items-center
                 justify-center px-8 pt-32 pb-24 md:px-16 md:pt-40
                 md:pb-32 lg:px-24"
    >
      {/* ── CENTER CONTENT ── */}
      <div className="max-w-[1000px] text-center">
        {/* Label */}
        <p
          data-contact-label
          className="mb-6 font-body text-[10px] uppercase tracking-[0.3em]
                     text-white/25 md:mb-8"
        >
          Contact
        </p>

        {/* Headline */}
        <h1
          ref={headingRef}
          className="mb-6 cursor-default font-display text-4xl font-bold
                     leading-[0.95] text-white opacity-0 sm:text-5xl
                     md:mb-8 md:text-6xl lg:text-7xl xl:text-8xl"
        >
          Let&apos;s make something.
        </h1>

        {/* Email — letter-by-letter barrel roll */}
        <div data-contact-email className="mb-12 md:mb-16">
          <a
            href="mailto:hello@symmetrastudios.com"
            data-cursor="view"
          >
            <TextSlide
              text="hello@symmetrastudios.com"
              letterStagger={15}
              duration={400}
              perspective="150px"
              rotation={45}
              className="font-body text-xl text-white/50
                         transition-colors duration-300
                         hover:text-white sm:text-2xl md:text-3xl
                         lg:text-4xl"
            />
          </a>
        </div>
      </div>

      {/* ── RIGHT EDGE: Vertical Socials (lg+) ── */}
      <div
        className="absolute right-8 top-1/2 hidden -translate-y-1/2
                   flex-col items-center gap-6 lg:flex xl:right-12"
      >
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            data-contact-social
            data-cursor="view"
            className="group/social relative rotate-180 font-body
                       text-[10px] uppercase tracking-[0.2em]
                       text-white/20 transition-colors duration-300
                       hover:text-white/60 [writing-mode:vertical-rl]"
          >
            {social.label}

            {/* Underline draws from top on hover */}
            <span
              className="absolute left-0 top-0 h-0 w-px bg-white/40
                         transition-all duration-500
                         ease-[cubic-bezier(0.76,0,0.24,1)]
                         group-hover/social:h-full"
            />
          </a>
        ))}
      </div>

      {/* ── DESKTOP: Location bottom-left ── */}
      <div
        data-contact-location
        className="absolute bottom-12 left-24 hidden items-center gap-3
                   lg:flex"
      >
        <span
          className="font-body text-[10px] uppercase tracking-[0.2em]
                     text-white/15"
        >
          Dubai, UAE
        </span>
        <span className="text-white/[0.08]">|</span>
        <span
          className="font-body text-[10px] tabular-nums tracking-wider
                     text-white/15"
        >
          {dubaiTime || "--:-- --"}
        </span>
      </div>

      {/* ── MOBILE: Socials + Location at bottom ── */}
      <div className="mt-auto flex flex-col items-center gap-8 pb-8
                      pt-16 lg:hidden">
        {/* Socials */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-6
                     gap-y-3"
        >
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              data-contact-social
              data-cursor="view"
              className="group/social relative pb-1 font-body text-xs
                         uppercase tracking-[0.15em] text-white/25
                         transition-colors duration-300
                         hover:text-white/60"
            >
              {social.label}
              <span
                className="absolute bottom-0 left-0 h-px w-0 bg-white/40
                           transition-all duration-300
                           ease-[cubic-bezier(0.76,0,0.24,1)]
                           group-hover/social:w-full"
              />
            </a>
          ))}
        </div>

        {/* Location + Time */}
        <div
          data-contact-location
          className="flex items-center gap-3"
        >
          <span
            className="font-body text-[10px] uppercase tracking-[0.2em]
                       text-white/15"
          >
            Dubai, UAE
          </span>
          <span className="text-white/[0.08]">|</span>
          <span
            className="font-body text-[10px] tabular-nums tracking-wider
                       text-white/15"
          >
            {dubaiTime || "--:-- --"}
          </span>
        </div>
      </div>
    </section>
  );
}
