export interface FeaturedProject {
  id: string;
  number: string;
  client: string;
  title: string;
  href: string;
  videoSrc: string;
  posterSrc: string;
}

// Hardcoded for development. Phase 15 (CMS) replaces with Sanity data.
export const featuredProjects: FeaturedProject[] = [
  {
    id: "project-1",
    number: "01",
    client: "NEON DRIFT",
    title: "Electric Horizons",
    href: "/work/neon-drift",
    videoSrc: "/videos/project-1.mp4",
    posterSrc: "/videos/project-1-poster.webp",
  },
  {
    id: "project-2",
    number: "02",
    client: "ECHOES",
    title: "Memory Fragments",
    href: "/work/echoes",
    videoSrc: "/videos/project-2.mp4",
    posterSrc: "/videos/project-2-poster.webp",
  },
  {
    id: "project-3",
    number: "03",
    client: "TERRAFORM",
    title: "Digital Landscapes",
    href: "/work/terraform",
    videoSrc: "/videos/project-3.mp4",
    posterSrc: "/videos/project-3-poster.webp",
  },
  {
    id: "project-4",
    number: "04",
    client: "VANTA",
    title: "Into the Void",
    href: "/work/vanta",
    videoSrc: "/videos/project-4.mp4",
    posterSrc: "/videos/project-4-poster.webp",
  },
  {
    id: "project-5",
    number: "05",
    client: "SIGNAL / NOISE",
    title: "The Human Element",
    href: "/work/signal-noise",
    videoSrc: "/videos/project-5.mp4",
    posterSrc: "/videos/project-5-poster.webp",
  },
];
