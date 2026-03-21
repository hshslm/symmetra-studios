export interface Project {
  id: string
  slug: string
  title: string
  client: string
  category: 'music-videos' | 'brand-films' | 'commercials' | 'social-content'
  categoryLabel: string
  year: string
  index: number
  videoSrc: string
  posterSrc: string
  featured: boolean
  tagline?: string
}

export const projects: Project[] = [
  {
    id: 'project-1',
    slug: 'desert-mirage',
    title: 'Desert Mirage',
    client: 'Artist Name',
    category: 'music-videos',
    categoryLabel: 'Music Video',
    year: '2026',
    index: 1,
    videoSrc: '/videos/project-1.mp4',
    posterSrc: '/videos/project-1-poster.webp',
    featured: true,
    tagline: 'A visual journey through shifting sands and fractured light.',
  },
  {
    id: 'project-2',
    slug: 'the-human-element',
    title: 'The Human Element',
    client: 'Signal / Noise',
    category: 'brand-films',
    categoryLabel: 'Brand Film',
    year: '2026',
    index: 2,
    videoSrc: '/videos/project-2.mp4',
    posterSrc: '/videos/project-2-poster.webp',
    featured: true,
    tagline: 'Finding the soul in silicon. A brand film about connection.',
  },
  {
    id: 'project-3',
    slug: 'velocity',
    title: 'Velocity',
    client: 'SportsBrand',
    category: 'commercials',
    categoryLabel: 'Commercial',
    year: '2025',
    index: 3,
    videoSrc: '/videos/project-3.mp4',
    posterSrc: '/videos/project-3-poster.webp',
    featured: true,
    tagline: 'Speed, precision, and the pursuit of perfection.',
  },
  {
    id: 'project-4',
    slug: 'after-hours',
    title: 'After Hours',
    client: 'Nightlife Dubai',
    category: 'social-content',
    categoryLabel: 'Social Content',
    year: '2025',
    index: 4,
    videoSrc: '/videos/project-4.mp4',
    posterSrc: '/videos/project-4-poster.webp',
    featured: true,
    tagline: 'When the city sleeps, the story begins.',
  },
  {
    id: 'project-5',
    slug: 'golden-hour',
    title: 'Golden Hour',
    client: 'Fashion Label',
    category: 'brand-films',
    categoryLabel: 'Brand Film',
    year: '2025',
    index: 5,
    videoSrc: '/videos/project-5.mp4',
    posterSrc: '/videos/project-5-poster.webp',
    featured: true,
    tagline: 'Capturing elegance in the last light of day.',
  },
  {
    id: 'project-6',
    slug: 'pulse',
    title: 'Pulse',
    client: 'DJ Producer',
    category: 'music-videos',
    categoryLabel: 'Music Video',
    year: '2025',
    index: 6,
    videoSrc: '/videos/project-1.mp4',
    posterSrc: '/videos/project-1-poster.webp',
    featured: false,
    tagline: 'Bass, beats, and neon-lit nights.',
  },
  {
    id: 'project-7',
    slug: 'craft-series',
    title: 'Craft Series',
    client: 'Artisan Brand',
    category: 'commercials',
    categoryLabel: 'Commercial',
    year: '2024',
    index: 7,
    videoSrc: '/videos/project-2.mp4',
    posterSrc: '/videos/project-2-poster.webp',
    featured: false,
    tagline: 'Handmade heritage meets modern vision.',
  },
  {
    id: 'project-8',
    slug: 'summer-campaign',
    title: 'Summer Campaign',
    client: 'Lifestyle Co',
    category: 'social-content',
    categoryLabel: 'Social Content',
    year: '2024',
    index: 8,
    videoSrc: '/videos/project-3.mp4',
    posterSrc: '/videos/project-3-poster.webp',
    featured: false,
    tagline: 'Sun, surf, and scroll-stopping content.',
  },
]

export const categories = [
  { value: 'all', label: 'All' },
  { value: 'music-videos', label: 'Music Videos' },
  { value: 'brand-films', label: 'Brand Films' },
  { value: 'commercials', label: 'Commercials' },
  { value: 'social-content', label: 'Social Content' },
] as const

export type CategoryValue = (typeof categories)[number]['value']
export type ViewMode = 'grid' | 'carousel' | 'list' | 'featured'
