export default function TransitionOverlay(): React.ReactElement {
  return (
    <div
      id="page-transition-overlay"
      className="pointer-events-none fixed inset-0 z-[45]"
      style={{
        clipPath: "inset(100% 0% 0% 0%)",
        willChange: "clip-path",
      }}
      aria-hidden="true"
    >
      {/* Solid background */}
      <div className="absolute inset-0 bg-bg" />

      {/* Loading pulse — visible only when overlay covers screen */}
      <div
        id="page-transition-loader"
        className="absolute top-1/2 left-1/2 h-[1px] w-8 -translate-x-1/2 -translate-y-1/2 bg-white/30 opacity-0"
      />
    </div>
  );
}
