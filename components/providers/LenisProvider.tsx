"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenisInstance } from "@/lib/lenis-instance";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

// Module-level store for the Lenis instance (avoids ref-during-render lint issues)
let lenisInstance: Lenis | null = null;
const listeners = new Set<() => void>();

function subscribeLenis(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getLenisSnapshot(): Lenis | null {
  return lenisInstance;
}

function getServerSnapshot(): null {
  return null;
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const lenis = useSyncExternalStore(
    subscribeLenis,
    getLenisSnapshot,
    getServerSnapshot
  );
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisInstance = instance;
    setLenisInstance(instance);
    listeners.forEach((cb) => cb());

    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      instance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(instance.raf);
      setLenisInstance(null);
      instance.destroy();
      lenisInstance = null;
      initialized.current = false;
      listeners.forEach((cb) => cb());
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
