"use client";

import { useRef, useState } from "react";
import { gsap, DrawSVGPlugin } from "@/lib/gsap";
import TextSlide from "@/components/TextSlide";

void DrawSVGPlugin;

interface MenuLinkProps {
  number: string;
  label: string;
  href: string;
  onNavigate: (href: string) => void;
}

export default function MenuLink({
  number,
  label,
  href,
  onNavigate,
}: MenuLinkProps): React.ReactElement {
  const lineRef = useRef<SVGLineElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = (): void => {
    setHovered(true);
    if (lineRef.current) {
      gsap.to(lineRef.current, {
        drawSVG: "100%",
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  };

  const handleMouseLeave = (): void => {
    setHovered(false);
    if (lineRef.current) {
      gsap.to(lineRef.current, {
        drawSVG: "0%",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <div className="group">
      <button
        onClick={() => onNavigate(href)}
        className="flex w-full items-baseline gap-4 py-3 text-left md:gap-6 md:py-4"
      >
        <span className="shrink-0 translate-y-1 font-body text-xs tracking-wider text-text-dim md:text-sm">
          {number}
        </span>

        <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <TextSlide
            text={label}
            isHovered={hovered}
            letterStagger={25}
            duration={450}
            perspective="200px"
            rotation={50}
            className="font-display text-4xl font-bold text-text transition-colors duration-300 group-hover:text-white sm:text-5xl md:text-6xl lg:text-7xl"
          />
        </span>
      </button>

      <div className="mt-1 h-[1px] w-full">
        <svg
          width="100%"
          height="1"
          viewBox="0 0 1000 1"
          preserveAspectRatio="none"
          className="block"
        >
          <line
            ref={lineRef}
            x1="0"
            y1="0.5"
            x2="1000"
            y2="0.5"
            stroke="white"
            strokeWidth="1"
            opacity="0.4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
