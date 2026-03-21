"use client";

import { useState, useCallback, useEffect } from "react";
import MenuTrigger from "./MenuTrigger";
import MenuOverlay from "./MenuOverlay";

export default function Navbar(): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggle = useCallback(() => {
    const next = !menuOpen;
    setMenuOpen(next);
    window.dispatchEvent(new CustomEvent("menu-toggle", { detail: next }));
  }, [menuOpen]);

  const close = useCallback(() => {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("menu-toggle", { detail: false }));
  }, []);

  // Listen for external close requests (e.g., logo click)
  useEffect(() => {
    const handleToggle = (e: Event): void => {
      const isOpen = (e as CustomEvent).detail as boolean;
      if (!isOpen) setMenuOpen(false);
    };
    window.addEventListener("menu-toggle", handleToggle);
    return () => window.removeEventListener("menu-toggle", handleToggle);
  }, []);

  return (
    <>
      <MenuTrigger isOpen={menuOpen} onClick={toggle} />
      <MenuOverlay isOpen={menuOpen} onClose={close} />
    </>
  );
}
