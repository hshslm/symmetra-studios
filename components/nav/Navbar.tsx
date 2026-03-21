"use client";

import { useState } from "react";
import MenuTrigger from "./MenuTrigger";
import MenuOverlay from "./MenuOverlay";

export default function Navbar(): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <MenuTrigger
        isOpen={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
