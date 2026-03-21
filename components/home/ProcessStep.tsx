"use client";

import type { ProcessStep as ProcessStepType } from "@/lib/process-data";

interface ProcessStepProps {
  step: ProcessStepType;
  index: number;
  total: number;
}

export default function ProcessStep({
  step,
  index,
  total,
}: ProcessStepProps): React.ReactElement {
  return (
    <div
      className="process-step relative flex shrink-0 items-center"
      style={{ width: "85vw", maxWidth: "1300px" }}
      data-process-step={index}
    >
      {/* Ghost number */}
      <span
        className="process-ghost-number pointer-events-none absolute left-0
                   top-1/2 -translate-y-[60%] select-none font-display
                   font-bold leading-none text-[100px] md:text-[110px]
                   lg:text-[120px]"
        style={{ color: "rgba(255,255,255,0.08)" }}
        aria-hidden="true"
      >
        {step.number}
      </span>

      {/* Split layout: Video left, Text right */}
      <div className="relative flex w-full items-center gap-8 md:gap-12 lg:gap-16">
        {/* Video content (left ~50%) */}
        <div className="w-[50%] shrink-0">
          <div
            className="process-video-container relative aspect-[16/10]
                       overflow-hidden rounded-sm"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            <video
              className="process-video absolute inset-0 h-full w-full
                         object-cover"
              style={{
                filter: "brightness(0.9) contrast(1.05) grayscale(0.2)",
              }}
              muted
              loop
              playsInline
              poster={step.posterSrc}
              preload="none"
              aria-hidden="true"
            >
              <source src={step.videoSrc} type="video/mp4" />
            </video>

            {/* Subtle gradient overlay on video */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(6,6,6,0.25) 0%, rgba(6,6,6,0.05) 100%)",
              }}
            />
          </div>
        </div>

        {/* Text content (right ~42%) */}
        <div className="w-[42%] shrink-0">
          {/* Number label */}
          <p
            className="process-number mb-3 font-body text-[11px] font-semibold
                       uppercase tracking-[0.2em] text-white/40"
          >
            Step {step.number}
          </p>

          {/* Title */}
          <h3
            className="process-title mb-4 font-display text-4xl font-bold
                       leading-[1.05] text-white sm:text-5xl md:mb-5
                       md:text-[52px] lg:text-[60px]"
          >
            {step.title}
          </h3>

          {/* Description */}
          <p
            className="process-description mb-5 font-body text-sm leading-relaxed
                       text-white/50 md:mb-6 md:text-[15px]"
          >
            {step.description}
          </p>

          {/* Keyword tags */}
          <div className="process-keywords flex flex-wrap gap-2">
            {step.keywords.map((kw) => (
              <span
                key={kw}
                className="process-keyword rounded-full border border-white/15
                           px-3 py-1 font-body text-[10px] uppercase
                           tracking-[0.15em] text-white/35"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
