"use client";

import { createContext, useContext } from "react";
import type { CursorShape } from "@/components/cursor/cursor-paths";

export interface CursorState {
  shape: CursorShape;
  label: string;
  visible: boolean;
}

interface CursorContextValue {
  state: CursorState;
  setState: (state: Partial<CursorState>) => void;
  reset: () => void;
}

export const defaultCursorState: CursorState = {
  shape: "dot",
  label: "",
  visible: true,
};

export const CursorContext = createContext<CursorContextValue>({
  state: defaultCursorState,
  setState: () => {},
  reset: () => {},
});

export function useCursorState(): CursorContextValue {
  return useContext(CursorContext);
}
