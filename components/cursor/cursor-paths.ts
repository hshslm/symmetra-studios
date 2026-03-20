// All paths are designed for a 24x24 viewBox.
// Every path MUST be a single closed shape (ending with Z) so
// MorphSVGPlugin can interpolate between them without collapsing.

export const cursorPaths = {
  // Small circle dot (default state) — 4 bezier arcs
  dot: "M12,8 C14.2,8 16,9.8 16,12 C16,14.2 14.2,16 12,16 C9.8,16 8,14.2 8,12 C8,9.8 9.8,8 12,8 Z",

  // Play triangle (pointing right)
  play: "M8,5 L20,12 L8,19 Z",

  // Pause — two bars connected by an invisible bridge (single closed path)
  pause:
    "M7,5 L10,5 L10,11.99 L14,11.99 L14,5 L17,5 L17,19 L14,19 L14,12.01 L10,12.01 L10,19 L7,19 Z",

  // Arrow pointing top-right — filled diagonal shaft + L-shaped arrowhead
  arrow:
    "M7,17 L8,18 L17,9 L17,14 L18,14 L18,7 L11,7 L11,8 L16,8 L7,17 Z",
} as const;

export type CursorShape = keyof typeof cursorPaths;
