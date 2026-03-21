'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'
import type { Project } from '@/lib/projects-data'
import Link from 'next/link'

interface WorkFeaturedProps {
  projects: Project[]
}

export default function WorkFeatured({ projects }: WorkFeaturedProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const autoPlayRef = useRef<number>(0)
  const touchStartRef = useRef<number>(0)

  const total = projects.length
  const safeIdx = total > 0 ? Math.min(activeIdx, total - 1) : 0
  const current = projects[safeIdx]

  // ── Navigate with transition ──
  const goTo = useCallback((idx: number) => {
    if (isTransitioning || idx === activeIdx) return
    setIsTransitioning(true)

    const container = containerRef.current
    if (!container) { setActiveIdx(idx); setIsTransitioning(false); return }

    const content = container.querySelector('[data-featured-content]')
    const video = container.querySelector('[data-featured-video]')

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIdx(idx)
        setIsTransitioning(false)
      },
    })

    if (content) {
      tl.to(content, {
        opacity: 0, y: -20,
        duration: 0.3, ease: 'power2.in',
      }, 0)
    }
    if (video) {
      tl.to(video, {
        opacity: 0,
        duration: 0.4, ease: 'power2.in',
      }, 0)
    }
  }, [activeIdx, isTransitioning])

  const goNext = useCallback(() => {
    goTo((activeIdx + 1) % total)
  }, [activeIdx, total, goTo])

  const goPrev = useCallback(() => {
    goTo((activeIdx - 1 + total) % total)
  }, [activeIdx, total, goTo])

  // ── Entrance animation when activeIdx changes ──
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const content = container.querySelector('[data-featured-content]')
    const video = container.querySelector('[data-featured-video]') as HTMLVideoElement | null
    const heading = container.querySelector('[data-featured-title]')

    // Video entrance
    if (video) {
      gsap.fromTo(video,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: reduced ? 0.01 : 0.8, ease: 'power2.out' }
      )
      video.play?.().catch(() => {})
    }

    // Content entrance
    if (content) {
      gsap.fromTo(content,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: reduced ? 0.01 : 0.6, ease: 'power3.out', delay: 0.15 }
      )
    }

    // SplitText on title
    if (heading && !reduced) {
      const split = SplitText.create(heading, {
        type: 'chars', mask: 'chars',
      })
      gsap.from(split.chars, {
        yPercent: 100,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power3.out',
        delay: 0.2,
        onComplete: () => split.revert(),
      })
    }
  }, [activeIdx])

  // ── Auto-advance every 6 seconds ──
  useEffect(() => {
    autoPlayRef.current = window.setInterval(goNext, 6000)
    return () => clearInterval(autoPlayRef.current)
  }, [goNext])

  // Pause auto-advance when tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(autoPlayRef.current)
      } else {
        clearInterval(autoPlayRef.current)
        autoPlayRef.current = window.setInterval(goNext, 6000)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [goNext])

  // Reset auto-advance on manual navigation
  const resetAutoPlay = useCallback(() => {
    clearInterval(autoPlayRef.current)
    autoPlayRef.current = window.setInterval(goNext, 6000)
  }, [goNext])

  // ── Keyboard navigation ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
        resetAutoPlay()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
        resetAutoPlay()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, resetAutoPlay])

  // ── Touch swipe ──
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext()
      else goPrev()
      resetAutoPlay()
    }
  }, [goNext, goPrev, resetAutoPlay])

  if (!current || total === 0) return <div />

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        height: 'calc(100vh - 200px)',
        minHeight: '500px',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video background */}
      <video
        key={`video-${current.id}`}
        data-featured-video
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={current.videoSrc} type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(6,6,6,0.85) 0%, rgba(6,6,6,0.3) 40%, rgba(6,6,6,0.5) 100%)',
        }}
      />

      {/* Content */}
      <div
        data-featured-content
        className="absolute bottom-0 left-0 right-0
                   px-8 md:px-16 lg:px-24 pb-12 md:pb-16 z-10"
      >
        {/* Category + Client */}
        <p className="font-body text-[10px] uppercase tracking-[0.25em]
                      text-white/40 mb-3">
          {current.client} / {current.categoryLabel} / {current.year}
        </p>

        {/* Title */}
        <h2
          data-featured-title
          className="font-display text-4xl sm:text-5xl md:text-6xl
                     lg:text-7xl xl:text-8xl font-bold text-white
                     leading-[1.0] mb-4 max-w-[900px]"
        >
          {current.title}
        </h2>

        {/* Tagline */}
        {current.tagline && (
          <p className="font-body text-sm md:text-base text-white/40
                        max-w-[500px] leading-relaxed mb-8">
            {current.tagline}
          </p>
        )}

        {/* View Project link */}
        <Link
          href={`/work/${current.slug}`}
          className="inline-flex items-center gap-3 font-body text-xs
                     uppercase tracking-[0.2em] text-white/60
                     hover:text-white transition-colors duration-300
                     group/link"
          data-cursor="pointer"
        >
          <span>View Project</span>
          <svg
            width="20" height="8" viewBox="0 0 20 8"
            className="transition-transform duration-300
                       group-hover/link:translate-x-1"
          >
            <line x1="0" y1="4" x2="18" y2="4"
                  stroke="currentColor" strokeWidth="1"/>
            <polyline points="14,1 18,4 14,7"
                      stroke="currentColor" strokeWidth="1"
                      fill="none"/>
          </svg>
        </Link>
      </div>

      {/* Navigation dots + progress */}
      <div className="absolute bottom-12 md:bottom-16 right-8 md:right-16
                      lg:right-24 z-10 flex items-center gap-3">

        {/* Prev arrow */}
        <button
          onClick={() => { goPrev(); resetAutoPlay() }}
          className="w-8 h-8 flex items-center justify-center
                     text-white/30 hover:text-white/70
                     transition-colors duration-300"
          aria-label="Previous project"
          data-cursor="pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetAutoPlay() }}
              className="relative h-2 rounded-full overflow-hidden
                         transition-all duration-300"
              style={{
                width: i === safeIdx ? '24px' : '8px',
                backgroundColor: 'rgba(255,255,255,0.15)',
              }}
              aria-label={`Go to project ${i + 1}`}
              data-cursor="pointer"
            >
              {i === safeIdx && (
                <div
                  key={`progress-${safeIdx}`}
                  className="absolute inset-0 bg-white/50 origin-left"
                  style={{
                    animation: 'featured-progress 6s linear forwards',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={() => { goNext(); resetAutoPlay() }}
          className="w-8 h-8 flex items-center justify-center
                     text-white/30 hover:text-white/70
                     transition-colors duration-300"
          aria-label="Next project"
          data-cursor="pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Counter */}
      <div className="absolute top-6 right-8 md:right-16 lg:right-24 z-10">
        <span className="font-body text-xs text-white/25
                         tabular-nums tracking-wider">
          {String(safeIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
