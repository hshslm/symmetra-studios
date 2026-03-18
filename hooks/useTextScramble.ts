"use client";

import { useRef, useCallback, useEffect } from "react";
import { TextScramble } from "@/lib/text-scramble";

interface UseTextScrambleOptions {
  /** Text to scramble to on hover. Defaults to the element's initial text. */
  text?: string;
  /** Whether scramble is enabled. Defaults to true. */
  enabled?: boolean;
}

export function useTextScramble<T extends HTMLElement>(
  options: UseTextScrambleOptions = {}
): {
  ref: React.RefObject<T | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
} {
  const { text, enabled = true } = options;
  const ref = useRef<T>(null);
  const scramblerRef = useRef<TextScramble | null>(null);

  useEffect(() => {
    if (!ref.current || !enabled) return;

    scramblerRef.current = new TextScramble(ref.current);

    return () => {
      scramblerRef.current?.destroy();
      scramblerRef.current = null;
    };
  }, [enabled]);

  const onMouseEnter = useCallback((): void => {
    if (!scramblerRef.current || !enabled || !ref.current) return;

    // Lock width so scramble characters don't shift layout
    const el = ref.current;
    el.style.display = "inline-block";
    el.style.width = `${el.offsetWidth}px`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (text) scramblerRef.current.setText(text);
      return;
    }

    scramblerRef.current.scramble(text);
  }, [text, enabled]);

  const onMouseLeave = useCallback((): void => {
    if (!scramblerRef.current || !enabled || !ref.current) return;

    scramblerRef.current.reset();

    // Release locked width
    ref.current.style.width = "";
    ref.current.style.display = "";
  }, [enabled]);

  return {
    ref,
    onMouseEnter,
    onMouseLeave,
  };
}
