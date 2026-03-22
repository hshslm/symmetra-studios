"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTransitionRouter } from "next-transition-router";
import { gsap, Observer, DrawSVGPlugin } from "@/lib/gsap";
import { useLenis } from "@/components/providers/LenisProvider";
import MenuLink from "./MenuLink";

void DrawSVGPlugin;
void Observer;

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuLinks = [
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/symmetrastudios" },
  { label: "Vimeo", href: "https://vimeo.com/symmetrastudios" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/symmetrastudios",
  },
];

export default function MenuOverlay({
  isOpen,
  onClose,
}: MenuOverlayProps): React.ReactElement {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();
  const router = useTransitionRouter();

  // Circle expand/collapse animation
  useEffect(() => {
    if (!overlayRef.current) return;

    if (isOpen) {
      gsap.set(overlayRef.current, { display: "flex" });

      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Circle expand from trigger button position (top-right)
      tl.fromTo(
        overlayRef.current,
        { clipPath: "circle(0% at calc(100% - 48px) 48px)" },
        {
          clipPath: "circle(150% at calc(100% - 48px) 48px)",
          duration: 0.8,
          ease: "power3.inOut",
        }
      );

      // Staggered link entrances
      const linkElements =
        linksContainerRef.current?.querySelectorAll("[data-menu-link]");
      if (linkElements) {
        tl.fromTo(
          linkElements,
          { clipPath: "inset(100% 0 0 0)", opacity: 1 },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.5,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.4
        );
      }

      // Socials + email fade in
      tl.fromTo(
        [socialsRef.current, emailRef.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.8
      );

      // Lock scroll
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      // Kill any running entrance timeline
      timelineRef.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { display: "none" });
          }
        },
      });

      // Quick clip down the content
      const linkElements =
        linksContainerRef.current?.querySelectorAll("[data-menu-link]");
      if (linkElements) {
        tl.to(
          linkElements,
          {
            clipPath: "inset(100% 0 0 0)",
            duration: 0.25,
            stagger: 0.03,
            ease: "power2.in",
          },
          0
        );
      }
      tl.to(
        [socialsRef.current, emailRef.current],
        {
          opacity: 0,
          duration: 0.2,
        },
        0
      );

      // Circle collapse back to trigger position
      tl.to(
        overlayRef.current,
        {
          clipPath: "circle(0% at calc(100% - 48px) 48px)",
          duration: 0.6,
          ease: "power3.inOut",
        },
        0.15
      );

      // Unlock scroll
      document.body.style.overflow = "";
      lenis?.start();
    }
  }, [isOpen, lenis]);

  // Swipe down to close
  useEffect(() => {
    if (!isOpen) return;
    const observer = Observer.create({
      type: "touch",
      onDown: () => onClose(),
      tolerance: 50,
    });
    return () => observer.kill();
  }, [isOpen, onClose]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll through overlay
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !isOpen) return;
    const prevent = (e: TouchEvent): void => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus first link after entrance animation
      const timer = setTimeout(() => {
        const firstButton = overlayRef.current?.querySelector("button");
        if (firstButton) (firstButton as HTMLElement).focus();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Return focus to trigger button on close
      const trigger = document.querySelector<HTMLElement>(
        '[aria-label="Open menu"]'
      );
      trigger?.focus();
    }
  }, [isOpen]);

  const handleNavigate = useCallback(
    (href: string): void => {
      onClose();

      if (href.startsWith("#")) {
        // Hash link: scroll after menu closes, no page transition
        setTimeout(() => {
          const el = document.getElementById(href.slice(1));
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 500);
        return;
      }

      // Wait for menu circle-collapse to mostly complete (~83%),
      // then trigger page transition. The overlay covers the remnant.
      setTimeout(() => {
        router.push(href);
      }, 500);
    },
    [onClose, router],
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[51] hidden flex-col items-center justify-center bg-bg"
      style={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Horizontal nav links */}
      <div
        ref={linksContainerRef}
        className="grid w-full max-w-6xl grid-cols-1 px-4 sm:grid-cols-3 sm:px-0"
      >
        {menuLinks.map((link) => (
          <div
            key={link.href}
            data-menu-link
            className="flex items-center justify-center"
            style={{ clipPath: "inset(100% 0 0 0)" }}
          >
            <MenuLink
              label={link.label}
              href={link.href}
              onNavigate={handleNavigate}
            />
          </div>
        ))}
      </div>

      {/* Socials */}
      <div
        ref={socialsRef}
        className="mt-8 flex flex-wrap justify-center gap-4 opacity-0
                   sm:mt-10 sm:gap-6 md:mt-14"
      >
        {socialLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="view"
            className="font-body text-[11px] uppercase tracking-[0.15em]
                       text-white/30 transition-colors duration-300
                       hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Email */}
      <a
        ref={emailRef}
        href="mailto:hello@symmetrastudios.com"
        data-cursor="email"
        className="mt-3 font-body text-xs text-white/25 opacity-0
                   transition-colors duration-300 hover:text-white
                   sm:mt-4 sm:text-sm"
      >
        hello@symmetrastudios.com
      </a>
    </div>
  );
}
