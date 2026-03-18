"use client";

import { useState } from "react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import NavLogo from "./NavLogo";
import MenuTrigger from "./MenuTrigger";
import MenuOverlay from "./MenuOverlay";

export default function Navbar(): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection();

  const isHidden = scrollDirection === "down" && !menuOpen;

  return (
    <>
      <div
        className={`transition-all duration-500 ease-[var(--ease-in-out)] ${
          isHidden
            ? "-translate-y-4 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 pointer-events-auto"
        }`}
      >
        <NavLogo />
      </div>

      <MenuTrigger
        isOpen={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
