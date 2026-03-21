export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  href: string;
  thumbnailSrc: string;
}

export const services: Service[] = [
  {
    id: "music-videos",
    number: "01",
    title: "Music Videos",
    description: "Full-concept music videos from treatment to final grade.",
    href: "/work?filter=music-videos",
    thumbnailSrc: "/images/services/music-videos.svg",
  },
  {
    id: "brand-films",
    number: "02",
    title: "Brand Films",
    description: "Story-driven brand content that connects and converts.",
    href: "/work?filter=brand-films",
    thumbnailSrc: "/images/services/brand-films.svg",
  },
  {
    id: "commercials",
    number: "03",
    title: "Commercials",
    description: "High-impact spots for broadcast and digital.",
    href: "/work?filter=commercials",
    thumbnailSrc: "/images/services/commercials.svg",
  },
  {
    id: "social-content",
    number: "04",
    title: "Social Content",
    description: "Scroll-stopping vertical content built for platforms.",
    href: "/work?filter=social-content",
    thumbnailSrc: "/images/services/social-content.svg",
  },
];
