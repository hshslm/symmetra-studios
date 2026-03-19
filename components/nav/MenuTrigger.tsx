"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, DrawSVGPlugin } from "@/lib/gsap";
import { TextScramble } from "@/lib/text-scramble";

void DrawSVGPlugin;

interface MenuTriggerProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuTrigger = function MenuTrigger({
  isOpen,
  onClick,
}: MenuTriggerProps): React.ReactElement {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const scramblerRef = useRef<TextScramble | null>(null);

  const handleClick = (): void => {
    if (isAnimating) return;
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 800);
  };

  useEffect(() => {
    if (!textRef.current) return;
    scramblerRef.current = new TextScramble(textRef.current);
    return () => {
      scramblerRef.current?.destroy();
      scramblerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!scramblerRef.current || !textRef.current) return;
    const target = isOpen ? "CLOSE" : "MENU";
    scramblerRef.current.scramble(target);
  }, [isOpen]);

  useGSAP(
    () => {
      if (!circleRef.current) return;
      gsap.set(circleRef.current, { drawSVG: "0%" });
    },
    { scope: buttonRef }
  );

  const handleMouseEnter = (): void => {
    if (!circleRef.current) return;
    gsap.to(circleRef.current, {
      drawSVG: "100%",
      duration: 0.6,
      ease: "power2.inOut",
    });
    if (scramblerRef.current) {
      scramblerRef.current.scramble(isOpen ? "CLOSE" : "MENU");
    }
  };

  const handleMouseLeave = (): void => {
    if (!circleRef.current || isOpen) return;
    gsap.to(circleRef.current, {
      drawSVG: "0%",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    if (!circleRef.current) return;
    if (isOpen) {
      gsap.to(circleRef.current, {
        drawSVG: "100%",
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(circleRef.current, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
    } else {
      gsap.killTweensOf(circleRef.current, "rotation");
      gsap.set(circleRef.current, { rotation: 0 });
    }
  }, [isOpen]);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="menu"
      className="group fixed top-6 right-6 z-[52] flex h-12 w-12 items-center justify-center md:top-8 md:right-10"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 48 48">
        <circle
          ref={circleRef}
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="white"
          strokeWidth="1"
          opacity={isOpen ? 0.6 : 0.3}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span
        ref={textRef}
        className={`font-body text-[9px] uppercase tracking-[0.2em] transition-colors duration-300 ${
          isOpen
            ? "text-white"
            : "text-text-secondary group-hover:text-white"
        }`}
      >
        MENU
      </span>
    </button>
  );
};

export default MenuTrigger;
