"use client";

import Image from "next/image";
import type { Service } from "@/lib/services-data";

interface ServiceItemProps {
  service: Service;
  index: number;
  isLast: boolean;
}

export default function ServiceItem({
  service,
  index,
  isLast,
}: ServiceItemProps): React.ReactElement {
  return (
    <div id={`service-${index}`} className="group/service" data-service-item>
      {/* Top divider line */}
      <div className="mb-4 md:mb-6">
        <svg
          width="100%"
          height="1"
          viewBox="0 0 1000 1"
          preserveAspectRatio="none"
        >
          <line
            className="service-divider"
            data-draw-direction={index % 2 === 0 ? "ltr" : "rtl"}
            x1="0"
            y1="0.5"
            x2="1000"
            y2="0.5"
            stroke="white"
            strokeWidth="1"
            opacity="0.18"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Service content */}
      <a
        href={service.href}
        className="relative block pb-6 md:pb-8"
        data-cursor="view"
      >
        {/* Hover glow */}
        <div
          className="absolute -inset-x-4 -inset-y-2 rounded-lg
                     bg-white/0 transition-colors duration-500
                     group-hover/service:bg-white/[0.02]"
          aria-hidden="true"
        />

        {/* Ghost number (large, behind content) */}
        <span
          className="service-ghost-number pointer-events-none absolute right-0
                     top-6 select-none font-display font-bold leading-none
                     md:top-8
                     text-[60px] text-white transition-opacity duration-500
                     md:text-[72px] lg:text-[80px]"
          style={{ opacity: 0.12 }}
          aria-hidden="true"
        >
          {service.number}
        </span>

        {/* Content layer (above ghost + glow) */}
        <div className="relative">
          {/* Number (small, above title) */}
          <p
            className="service-number mb-2 font-body text-[11px] font-semibold
                       md:mb-3
                       uppercase tracking-[0.2em] text-white/40
                       transition-colors duration-500"
          >
            {service.number}
          </p>

          {/* Title + Thumbnail row */}
          <div className="mb-2 flex items-start justify-between gap-6 md:mb-3">
            {/* Title */}
            <h3
              className="service-title font-display text-3xl font-bold
                         leading-[1.08] text-white transition-transform
                         duration-500 ease-out sm:text-4xl md:text-5xl
                         lg:text-[56px]"
            >
              {service.title}
            </h3>

            {/* Hover thumbnail — clip reveals from left */}
            <div
              className="service-thumbnail hidden h-[60px] shrink-0
                         overflow-hidden rounded-sm transition-all
                         duration-700 ease-out md:block md:h-[70px]
                         lg:h-[80px] w-[200px] lg:w-[240px]"
              style={{ clipPath: "inset(0 100% 0 0)" }}
              aria-hidden="true"
            >
              <Image
                src={service.thumbnailSrc}
                alt=""
                width={400}
                height={300}
                className="h-full w-full scale-105 object-cover grayscale
                           brightness-75 transition-all duration-700
                           group-hover/service:scale-100
                           group-hover/service:grayscale-[0.5]
                           group-hover/service:brightness-90"
              />
            </div>
          </div>

          {/* Description */}
          <p
            className="service-description max-w-md font-body text-sm
                       leading-relaxed text-white/50 transition-colors
                       duration-500 md:text-[15px]"
          >
            {service.description}
          </p>

          {/* View Work arrow */}
          <div className="mt-3 overflow-hidden">
            <span
              className="inline-flex items-center gap-2 font-body text-[12px]
                         transition-all duration-500
                         max-md:translate-y-0 max-md:text-white/40
                         md:translate-y-4 md:text-white/0
                         md:group-hover/service:translate-y-0
                         md:group-hover/service:text-white/40"
            >
              <span>View Work</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="translate-y-[1px]"
              >
                <path
                  d="M1 11L11 1M11 1H4M11 1V8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </a>

      {/* Bottom divider on last item */}
      {isLast && (
        <div>
          <svg
            width="100%"
            height="1"
            viewBox="0 0 1000 1"
            preserveAspectRatio="none"
          >
            <line
              className="service-divider"
              data-draw-direction="ltr"
              x1="0"
              y1="0.5"
              x2="1000"
              y2="0.5"
              stroke="white"
              strokeWidth="1"
              opacity="0.18"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
