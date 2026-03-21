"use client";

import type { ProcessStep as ProcessStepType } from "@/lib/process-data";

interface ProcessStepMobileProps {
  step: ProcessStepType;
  index: number;
}

export default function ProcessStepMobile({
  step,
  index,
}: ProcessStepMobileProps): React.ReactElement {
  return (
    <div
      className="relative mb-12 last:mb-0"
      data-process-step-mobile={index}
    >
      {/* Node dot on the vertical line */}
      <div
        className="absolute top-1 flex h-3 w-3 items-center
                   justify-center"
        style={{ left: "calc(-2rem - 6px)" }}
      >
        <div className="h-2 w-2 rounded-full border border-white/30" />
      </div>

      {/* Ghost number */}
      <span
        className="process-ghost-number pointer-events-none absolute -right-2
                   -top-2 select-none font-display font-bold leading-none
                   text-[60px]"
        style={{ color: "rgba(255,255,255,0.08)" }}
        aria-hidden="true"
      >
        {step.number}
      </span>

      <div className="relative">
        {/* Number label */}
        <p
          className="process-number mb-2 font-body text-[11px] font-semibold
                     uppercase tracking-[0.2em] text-white/40"
        >
          Step {step.number}
        </p>

        {/* Title */}
        <h3
          className="process-title mb-3 font-display text-2xl font-bold
                     leading-[1.08] text-white"
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          className="process-description mb-4 font-body text-sm leading-relaxed
                     text-white/50"
        >
          {step.description}
        </p>

        {/* Video */}
        <div
          className="process-video-mobile relative mb-4 aspect-[16/10]
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
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(6,6,6,0.4) 0%, rgba(6,6,6,0.1) 100%)",
            }}
          />
        </div>

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
  );
}
