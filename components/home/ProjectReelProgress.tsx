"use client";

interface ProjectReelProgressProps {
  total: number;
}

export default function ProjectReelProgress({
  total,
}: ProjectReelProgressProps): React.ReactElement {
  return (
    <div
      id="reel-progress"
      className="absolute bottom-8 left-8 right-8 z-[5] flex items-center gap-4 md:left-16 md:right-16 lg:left-24 lg:right-24"
    >
      {/* Counter: static "0" + rolling last digit */}
      <div className="flex items-center font-body text-[11px] tabular-nums tracking-wider text-white/50">
        <span>0</span>
        <div
          className="relative"
          style={{
            width: "0.7em",
            height: "1.2em",
            perspective: "200px",
            transformStyle: "preserve-3d",
          }}
        >
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              id={`reel-progress-digit-${i}`}
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <span
          id="reel-autoplay-indicator"
          className="ml-2 h-1.5 w-1.5 rounded-full bg-white/40 opacity-0"
        />
      </div>

      <div className="relative h-[1px] flex-1 bg-white/15">
        <div
          id="reel-progress-fill"
          className="absolute left-0 top-0 h-full bg-white/40"
          style={{ width: "0%" }}
        />
      </div>

      <span className="font-body text-[11px] tabular-nums tracking-wider text-white/30">
        {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
