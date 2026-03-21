"use client";

import type { FeaturedProject } from "@/lib/project-data";

interface ProjectReelSlideProps {
  project: FeaturedProject;
  index: number;
  isFirst: boolean;
}

export default function ProjectReelSlide({
  project,
  index,
  isFirst,
}: ProjectReelSlideProps): React.ReactElement {
  return (
    <div
      id={`reel-slide-${index}`}
      className="absolute inset-0"
      style={{ opacity: isFirst ? 1 : 0 }}
    >
      <video
        id={`reel-video-${index}`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          filter: "brightness(1) contrast(1.05)",
        }}
        muted
        loop
        playsInline
        poster={project.posterSrc}
        preload={index <= 2 ? "auto" : "none"}
        aria-hidden="true"
      >
        <source src={project.videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}
