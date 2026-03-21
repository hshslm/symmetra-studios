export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  keywords: string[];
  videoSrc: string;
  posterSrc: string;
}

export const processSteps: ProcessStep[] = [
  {
    id: "discover",
    number: "01",
    title: "Discover",
    description:
      "We start by understanding your vision, audience, and objectives. Deep-dive into your brand to find the story that needs telling.",
    keywords: ["Brief", "Research", "Concept"],
    videoSrc: "/videos/process/discover.mp4",
    posterSrc: "/videos/process/discover-poster.webp",
  },
  {
    id: "pre-production",
    number: "02",
    title: "Pre-Production",
    description:
      "From treatment and storyboard to location scouting and casting. Every detail planned before a single frame is captured.",
    keywords: ["Treatment", "Storyboard", "Casting"],
    videoSrc: "/videos/process/pre-production.mp4",
    posterSrc: "/videos/process/pre-production-poster.webp",
  },
  {
    id: "production",
    number: "03",
    title: "Production",
    description:
      "Our crew brings the vision to life. Whether on set or on location, every shot is crafted with cinematic precision.",
    keywords: ["Direction", "Cinematography", "Sound"],
    videoSrc: "/videos/process/production.mp4",
    posterSrc: "/videos/process/production-poster.webp",
  },
  {
    id: "delivery",
    number: "04",
    title: "Delivery",
    description:
      "Edit, grade, sound design, and final delivery across all formats. Your content, polished and ready for the world.",
    keywords: ["Edit", "Color", "Sound Design"],
    videoSrc: "/videos/process/delivery.mp4",
    posterSrc: "/videos/process/delivery-poster.webp",
  },
];
