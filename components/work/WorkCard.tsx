'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import type { Project } from '@/lib/projects-data'
import Link from 'next/link'

interface WorkCardProps {
  project: Project
  index: number
  isHero?: boolean
  fillHeight?: boolean
  disableParallax?: boolean
}

export default function WorkCard({
  project,
  index,
  isHero = false,
  fillHeight = false,
  disableParallax = false,
}: WorkCardProps): React.ReactElement {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Detect touch
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches)
  }, [])

  // Autoplay when visible, pause when off-screen
  useEffect(() => {
    const video = videoRef.current
    const card = cardRef.current
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

  // ── LAYER 1: 3D TILT ──
  // ── LAYER 2: CURSOR SPOTLIGHT ──
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect()
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current
    const spotlight = spotlightRef.current
    const rect = rectRef.current
    if (!card || !rect) return

    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // Layer 1: 3D tilt
    const rotateY = (x - 0.5) * 16
    const rotateX = (0.5 - y) * 12
    card.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`

    // Layer 2: Cursor spotlight
    if (spotlight) {
      spotlight.style.opacity = '1'
      spotlight.style.background =
        `radial-gradient(
          600px circle at ${x * 100}% ${y * 100}%,
          rgba(255, 255, 255, 0.06),
          transparent 40%
        )`
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    rectRef.current = null

    const card = cardRef.current
    if (card) {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
    }

    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '0'
    }
  }, [])

  return (
    <div
      className={`work-card-wrapper ${fillHeight ? 'h-full' : ''}`}
      style={{ perspective: '800px' }}
      data-work-card
      data-flip-id={project.id}
    >
      <div
        ref={cardRef}
        className={`work-card group/card relative ${fillHeight ? 'h-full' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
        }}
        onMouseMove={isTouchDevice ? undefined : handleMouseMove}
        onMouseEnter={isTouchDevice ? undefined : handleMouseEnter}
        onMouseLeave={isTouchDevice ? undefined : handleMouseLeave}
      >
        <Link
          href={`/work/${project.slug}`}
          className={`block relative overflow-hidden rounded-sm ${fillHeight ? 'h-full' : ''}`}
          data-cursor="view"
        >
          <div className={`relative overflow-hidden bg-white/[0.02] ${fillHeight ? 'h-full' : 'aspect-[16/9]'}`}>

            {/* Video — always visible, plays on hover */}
            <div
              className={disableParallax ? "absolute inset-0" : "absolute inset-[-15%]"}
              data-parallax-image={disableParallax ? undefined : true}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src={project.videoSrc} type="video/mp4" />
              </video>
            </div>

            {/* Layer 2: Cursor spotlight overlay */}
            <div
              ref={spotlightRef}
              className="absolute inset-0 pointer-events-none z-10
                         transition-opacity duration-300"
              style={{ opacity: 0 }}
            />

            {/* Gradient overlay for text readability */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(to top, rgba(6,6,6,0.8) 0%, rgba(6,6,6,0) 55%)',
              }}
            />

            {/* Parallax floating text */}
            <div
              className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-20"
              style={{ transform: 'translateZ(30px)' }}
            >
              <p className="font-body text-[10px] uppercase tracking-[0.2em]
                            text-white/40 mb-2">
                {project.client} / {project.categoryLabel}
              </p>
              <h3 className={`font-display font-bold text-white leading-[1.1]
                              ${isHero
                                ? 'text-2xl md:text-3xl lg:text-4xl'
                                : 'text-lg md:text-xl lg:text-2xl'
                              }`}
              >
                {project.title}
              </h3>
            </div>
          </div>

          {/* Layer 5: Luminous border glow */}
          <div
            className="absolute inset-0 rounded-sm pointer-events-none
                       transition-all duration-500 z-20"
            style={{
              boxShadow: isHovered
                ? '0 12px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.12)'
                : 'inset 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          />
        </Link>
      </div>
    </div>
  )
}
