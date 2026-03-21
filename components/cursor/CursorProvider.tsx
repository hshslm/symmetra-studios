"use client";

import { useState, useCallback, useEffect, useSyncExternalStore } from "react";
import { CursorContext, defaultCursorState } from "@/hooks/useCursorState";
import type { CursorState } from "@/hooks/useCursorState";
import type { CursorShape } from "./cursor-paths";
import CustomCursor from "./CustomCursor";

let touchDetected = false;
const touchListeners = new Set<() => void>();

function subscribeTouchState(callback: () => void): () => void {
  touchListeners.add(callback);
  return () => touchListeners.delete(callback);
}

function getTouchState(): boolean {
  return touchDetected;
}

function getTouchStateServer(): boolean {
  return false;
}

if (typeof window !== "undefined") {
  const hasTouch =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (hasTouch) {
    touchDetected = true;
  }
  window.addEventListener(
    "touchstart",
    () => {
      if (!touchDetected) {
        touchDetected = true;
        touchListeners.forEach((cb) => cb());
      }
    },
    { once: true },
  );
}

export default function CursorProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [state, setStateRaw] = useState<CursorState>(defaultCursorState);
  const isTouchDevice = useSyncExternalStore(
    subscribeTouchState,
    getTouchState,
    getTouchStateServer,
  );

  // Hide default cursor on non-touch devices
  useEffect(() => {
    if (!isTouchDevice) {
      document.body.style.cursor = "none";
      const style = document.createElement("style");
      style.id = "custom-cursor-hide";
      style.textContent =
        "*, *::before, *::after { cursor: none !important; }";
      document.head.appendChild(style);

      return () => {
        document.body.style.cursor = "";
        const el = document.getElementById("custom-cursor-hide");
        if (el) el.remove();
      };
    }
  }, [isTouchDevice]);

  const setState = useCallback((partial: Partial<CursorState>) => {
    setStateRaw((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setStateRaw(defaultCursorState);
  }, []);

  // Event delegation for data-cursor attributes
  useEffect(() => {
    if (isTouchDevice) return;

    const cursorMap: Record<string, { shape: CursorShape; label: string }> = {
      view: { shape: "arrow", label: "" },
      play: { shape: "play", label: "Play" },
      pause: { shape: "pause", label: "Pause" },
      email: { shape: "arrow", label: "" },
      menu: { shape: "dot", label: "" },
      drag: { shape: "dot", label: "" },
      pointer: { shape: "dot", label: "" },
      hide: { shape: "dot", label: "" },
    };

    let activeTarget: Element | null = null;

    const handleMouseOver = (e: MouseEvent): void => {
      const el =
        e.target instanceof Element
          ? e.target
          : e.target instanceof Text
            ? e.target.parentElement
            : null;

      const target = el?.closest("[data-cursor]") ?? null;

      if (target === activeTarget) return;
      activeTarget = target;

      if (target) {
        const cursorType = target.getAttribute("data-cursor");
        if (cursorType && cursorMap[cursorType]) {
          const { shape, label } = cursorMap[cursorType];
          setState({ shape, label, visible: cursorType !== "hide" });
        }
      } else {
        reset();
      }
    };

    // Reset when mouse leaves the viewport entirely
    const handleDocLeave = (): void => {
      activeTarget = null;
      reset();
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleDocLeave);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleDocLeave);
    };
  }, [isTouchDevice, setState, reset]);

  if (isTouchDevice) {
    return (
      <CursorContext.Provider
        value={{ state: defaultCursorState, setState, reset }}
      >
        {children}
      </CursorContext.Provider>
    );
  }

  return (
    <CursorContext.Provider value={{ state, setState, reset }}>
      <CustomCursor />
      {children}
    </CursorContext.Provider>
  );
}
