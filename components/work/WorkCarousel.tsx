'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, Draggable, InertiaPlugin } from '@/lib/gsap'
import type { Project } from '@/lib/projects-data'
import Link from 'next/link'

interface WorkCarouselProps {
  projects: Project[]
}

export default function WorkCarousel({ projects }: WorkCarouselProps): React.ReactElement {
  const trackRef = useRef<HTMLDivElement>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const isDraggingRef = useRef(false)
  const dragTimerRef = useRef<number>(0)

  useGSAP(() => {
    const track = trackRef.current
    if (!track) return

    const cards = track.querySelectorAll('[data-carousel-card]')

    // Entrance: slide from right
    gsap.set(cards, { opacity: 0, x: 40 })
    gsap.to(cards, {
      opacity: 1, x: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power3.out',
      delay: 0.15,
    })

    // Draggable
    const maxDrag = -(track.scrollWidth - window.innerWidth + 64)

    Draggable.create(track, {
      type: 'x',
      bounds: { minX: maxDrag, maxX: 0 },
      inertia: true,
      edgeResistance: 0.8,
      throwResistance: 2000,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onDragStart: () => {
        isDraggingRef.current = true
      },
      onDragEnd: () => {
        dragTimerRef.current = window.setTimeout(() => {
          isDraggingRef.current = false
        }, 150)
      },
    })

    const updateBounds = () => {
      const newMax = -(track.scrollWidth - window.innerWidth + 64)
      const draggable = Draggable.get(track)
      if (draggable) {
        draggable.applyBounds({ minX: newMax, maxX: 0 })
      }
    }

    window.addEventListener('resize', updateBounds)

    return () => {
      clearTimeout(dragTimerRef.current)
      window.removeEventListener('resize', updateBounds)
    }
  }, { scope: trackRef, dependencies: [projects] })

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDraggingRef.current) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    []
  )

  return (
    <div className="overflow-hidden -mx-8 md:-mx-16 lg:-mx-24">
      <div
        ref={trackRef}
        className="flex gap-5 md:gap-6 px-8 md:px-16 lg:px-24 pb-4
                   cursor-grab active:cursor-grabbing"
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            data-carousel-card
            className="shrink-0 w-[80vw] sm:w-[55vw] md:w-[42vw] lg:w-[32vw]
                       transition-opacity duration-500"
            style={{
              opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.4 : 1,
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <CarouselCard
              project={project}
              onClick={handleCardClick}
            />
          </div>
        ))}

        {/* End spacer */}
        <div className="shrink-0 w-[10vw]" aria-hidden="true" />
      </div>
    </div>
  )
}

function CarouselCard({
  project,
  onClick,
}: {
  project: Project
  onClick: (e: React.MouseEvent) => void
}): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const card = videoRef.current?.closest('[data-carousel-card]')
    if (!video || !card) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(card)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [])

  return (
    <Link
      href={`/work/${project.slug}`}
      className="block relative"
      data-cursor="view"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-sm
                      bg-white/[0.02]">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
        >
          <source src={project.videoSrc} type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(6,6,6,0.75) 0%, rgba(6,6,6,0) 50%)',
          }}
        />

        {/* Overlaid text */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <p className="font-body text-[10px] uppercase tracking-[0.15em]
                        text-white/40 mb-1.5">
            {project.client} / {project.categoryLabel}
          </p>
          <h3 className="font-display text-lg md:text-xl font-bold
                         text-white leading-[1.1]">
            {project.title}
          </h3>
        </div>

        {/* Hover border glow */}
        <div
          className="absolute inset-0 rounded-sm pointer-events-none
                     transition-all duration-500"
          style={{
            boxShadow: isHovered
              ? 'inset 0 0 0 1px rgba(255,255,255,0.1)'
              : 'inset 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        />
      </div>
    </Link>
  )
}
