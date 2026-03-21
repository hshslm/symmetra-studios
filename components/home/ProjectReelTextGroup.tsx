"use client";

import type { FeaturedProject } from "@/lib/project-data";

interface ProjectReelTextGroupProps {
  project: FeaturedProject;
  index: number;
  isFirst: boolean;
}

export default function ProjectReelTextGroup({
  project,
  index,
  isFirst,
}: ProjectReelTextGroupProps): React.ReactElement {
  return (
    <div
      id={`reel-text-${index}`}
      className="pointer-events-none absolute inset-0 z-[4] flex flex-col justify-end px-6 pb-16 md:px-16 md:pb-24 lg:px-24"
      style={{ opacity: isFirst ? 1 : 0 }}
    >
      {/* DrawSVG divider */}
      <div className="mb-6 w-full max-w-md">
        <svg
          id={`reel-divider-${index}`}
          width="100%"
          height="1"
          viewBox="0 0 400 1"
          preserveAspectRatio="none"
        >
          <line
            id={`reel-divider-line-${index}`}
            x1="0"
            y1="0.5"
            x2="400"
            y2="0.5"
            stroke="white"
            strokeWidth="1"
            opacity="0.3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Client name */}
      <p
        id={`reel-client-${index}`}
        className="mb-3 font-body text-[13px] font-semibold uppercase tracking-[0.15em] text-white/50"
      >
        {project.client}
      </p>

      {/* Project title */}
      <h2
        id={`reel-title-${index}`}
        className="mb-6 font-display text-3xl font-bold leading-[1.05] text-white sm:text-4xl md:text-[56px]"
      >
        {project.title}
      </h2>

      {/* View Project link */}
      <div
        id={`reel-link-${index}`}
        className="pointer-events-auto"
        style={{ opacity: isFirst ? 1 : 0 }}
      >
        <a
          href={project.href}
          className="inline-flex items-center gap-2 font-body text-sm text-white/70 transition-colors duration-300 hover:text-white"
          data-cursor="view"
        >
          <span id={`reel-link-text-${index}`}>View Project</span>
          <svg
            id={`reel-link-arrow-${index}`}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="translate-y-[1px]"
          >
            <path
              d="M1 13L13 1M13 1H5M13 1V9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
