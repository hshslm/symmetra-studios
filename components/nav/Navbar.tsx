"use client";

import { useState, useCallback } from "react";
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

  return (
    <>
      <MenuTrigger isOpen={menuOpen} onClick={toggle} />
      <MenuOverlay isOpen={menuOpen} onClose={close} />
    </>
  );
}
