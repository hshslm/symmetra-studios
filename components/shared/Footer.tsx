"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, DrawSVGPlugin } from "@/lib/gsap";
import Link from "next/link";
import TextSlide from "@/components/TextSlide";
import Image from "next/image";

void ScrollTrigger;
void DrawSVGPlugin;

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "mailto:hello@symmetrastudios.com" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/symmetrastudios" },
  { label: "Vimeo", href: "https://vimeo.com/symmetrastudios" },
  { label: "YouTube", href: "https://youtube.com/@symmetrastudios" },
];

export default function Footer(): React.ReactElement {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        footer
          .querySelectorAll(
            "[data-footer-logo], [data-footer-nav], [data-footer-social], [data-footer-copyright]",
          )
          .forEach((el) => gsap.set(el, { opacity: 1, yPercent: 0 }));
        const d = footer.querySelector("#footer-divider-line");
        if (d) gsap.set(d, { drawSVG: "0% 100%" });
        return;
      }

      const logo = footer.querySelector("[data-footer-logo]");
      const navCol = footer.querySelector("[data-footer-nav]");
      const socialCol = footer.querySelector("[data-footer-social]");
      const copyright = footer.querySelector("[data-footer-copyright]");
      const divider = footer.querySelector("#footer-divider-line");

      // Pre-set hidden
      if (logo) gsap.set(logo, { opacity: 0, yPercent: 10 });
      if (navCol) gsap.set(navCol, { opacity: 0, yPercent: 12 });
      if (socialCol) gsap.set(socialCol, { opacity: 0, yPercent: 12 });
      if (copyright) gsap.set(copyright, { opacity: 0 });
      if (divider) gsap.set(divider, { drawSVG: "50% 50%" });

      // Single scrubbed timeline — range spans the footer's own height
      // as it scrolls into view. "top bottom" → "bottom bottom" is always
      // reachable regardless of page length or viewport size.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      if (logo) {
        tl.to(logo, { opacity: 1, yPercent: 0, duration: 0.3 }, 0);
      }
      if (navCol) {
        tl.to(navCol, { opacity: 1, yPercent: 0, duration: 0.3 }, 0.1);
      }
      if (socialCol) {
        tl.to(socialCol, { opacity: 1, yPercent: 0, duration: 0.3 }, 0.2);
      }
      if (divider) {
        tl.to(divider, { drawSVG: "0% 100%", duration: 0.3 }, 0.3);
      }
      if (copyright) {
        tl.to(copyright, { opacity: 1, duration: 0.2 }, 0.4);
      }
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="relative w-full px-8 pb-8 pt-12 md:px-16 md:pb-12
                 md:pt-16 lg:px-24"
    >
      {/* Main footer grid */}
      <div
        className="mb-12 grid grid-cols-2 gap-8 md:mb-16 md:grid-cols-4
                   md:gap-12"
      >
        {/* Logo mark */}
        <div data-footer-logo className="col-span-2 md:col-span-1">
          <Link href="/" className="inline-block" aria-label="Home">
            <Image
              src="/logo.svg"
              alt="Symmetra Studios"
              width={40}
              height={40}
              className="h-8 w-8 opacity-40 transition-opacity
                         duration-300 hover:opacity-70 md:h-10 md:w-10"
            />
          </Link>
        </div>

        {/* Navigation links */}
        <nav data-footer-nav aria-label="Footer navigation">
          <p
            className="mb-4 font-body text-[10px] uppercase tracking-[0.2em]
                       text-white/20"
          >
            Pages
          </p>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="inline-block">
                  <TextSlide
                    text={link.label}
                    letterStagger={15}
                    duration={300}
                    className="font-body text-sm text-white/50
                               transition-colors duration-300 hover:text-white"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social links */}
        <nav data-footer-social aria-label="Social media">
          <p
            className="mb-4 font-body text-[10px] uppercase tracking-[0.2em]
                       text-white/20"
          >
            Social
          </p>
          <ul className="space-y-3">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <TextSlide
                    text={link.label}
                    letterStagger={15}
                    duration={300}
                    className="font-body text-sm text-white/50
                               transition-colors duration-300 hover:text-white"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact info */}
        <div className="col-span-2 md:col-span-1">
          <p
            className="mb-4 font-body text-[10px] uppercase tracking-[0.2em]
                       text-white/20"
          >
            Get in Touch
          </p>
          <a
            href="mailto:hello@symmetrastudios.com"
            className="mb-2 block font-body text-sm text-white/50
                       transition-colors duration-300 hover:text-white"
          >
            hello@symmetrastudios.com
          </a>
          <p className="font-body text-[13px] text-white/25">
            Dubai Silicon Oasis, Dubai, UAE
          </p>
        </div>
      </div>

      {/* Divider line */}
      <svg
        width="100%"
        height="1"
        viewBox="0 0 1000 1"
        preserveAspectRatio="none"
      >
        <line
          id="footer-divider-line"
          x1="0"
          y1="0.5"
          x2="1000"
          y2="0.5"
          stroke="white"
          strokeWidth="1"
          opacity="0.06"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Bottom bar: copyright */}
      <div
        data-footer-copyright
        className="flex flex-col items-start justify-between gap-2
                   pt-6 sm:flex-row sm:items-center"
      >
        <p className="font-body text-[11px] text-white/15">
          &copy; {new Date().getFullYear()} Symmetra Studios FZCO. All rights
          reserved.
        </p>
        <p className="font-body text-[10px] text-white/10">
          Built by{" "}
          <a
            href="https://vector9.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/20 transition-colors duration-300
                       hover:text-white/40"
          >
            Vector9
          </a>
        </p>
      </div>
    </footer>
  );
}
