"use client";

interface ProcessCounterProps {
  total: number;
}

export default function ProcessCounter({
  total,
}: ProcessCounterProps): React.ReactElement {
  return (
    <div
      id="process-counter"
      className="absolute bottom-8 right-8 z-10 md:bottom-12 md:right-16
                 lg:right-24"
    >
      <div className="mb-2 flex items-center gap-3">
        <span
          id="process-counter-current"
          className="font-body text-[13px] font-semibold tabular-nums
                     tracking-wider text-white/60"
        >
          01
        </span>
        <span className="font-body text-[11px] text-white/30">/</span>
        <span
          className="font-body text-[11px] tabular-nums tracking-wider
                     text-white/30"
        >
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Progress fill line */}
      <div className="relative h-[1px] w-16 bg-white/15">
        <div
          id="process-counter-fill"
          className="absolute left-0 top-0 h-full bg-white/40"
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}
