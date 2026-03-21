"use client";

import { useState } from "react";
import TextSlide from "@/components/TextSlide";

interface MenuLinkProps {
  label: string;
  href: string;
  onNavigate: (href: string) => void;
}

export default function MenuLink({
  label,
  href,
  onNavigate,
}: MenuLinkProps): React.ReactElement {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onNavigate(href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex w-full items-center justify-center px-6 py-4 md:px-10 md:py-6"
    >
      <TextSlide
        text={label}
        isHovered={hovered}
        letterStagger={25}
        duration={450}
        perspective="200px"
        rotation={50}
        className="font-display text-3xl font-bold uppercase tracking-[0.04em]
                   text-white/80 transition-colors duration-300
                   group-hover:text-white xs:text-4xl sm:text-5xl md:text-6xl"
      />
    </button>
  );
}
