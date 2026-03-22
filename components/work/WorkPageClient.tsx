'use client'
import { useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { flushSync } from 'react-dom'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Flip } from '@/lib/gsap'
import { projects, categories, type ViewMode } from '@/lib/projects-data'
import ViewToggle from './ViewToggle'
import FilterBar from './FilterBar'
import WorkGrid from './WorkGrid'
import WorkCarousel from './WorkCarousel'
import WorkList from './WorkList'
import WorkFeatured from './WorkFeatured'
import Footer from '@/components/shared/Footer'

export default function WorkPageClient(): React.ReactElement {
  const pageRef = useRef<HTMLDivElement>(null)
  const viewContainerRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const initialFilter = searchParams.get('filter') || 'all'
  const [activeFilter, setActiveFilter] = useState(initialFilter)

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  const showFilters = viewMode !== 'featured'

  // ── GSAP Flip filter change ──
  const handleFilterChange = useCallback((filter: string) => {
    const container = viewContainerRef.current
    if (!container || viewMode !== 'grid') {
      if (container) {
        gsap.to(container, {
          opacity: 0, duration: 0.2, ease: 'power2.in',
          onComplete: () => {
            flushSync(() => setActiveFilter(filter))
            gsap.fromTo(container,
              { opacity: 0 },
              { opacity: 1, duration: 0.3, ease: 'power2.out' }
            )
          },
        })
      } else {
        setActiveFilter(filter)
      }
      return
    }

    // Force-reveal any cards still clipped from entrance animation
    const unrevealed = container.querySelectorAll('[data-work-card]:not([data-revealed])')
    if (unrevealed.length) {
      gsap.set(unrevealed, { clipPath: 'inset(0% 0% 0% 0%)', y: 0 })
      unrevealed.forEach(el => el.setAttribute('data-revealed', ''))
    }

    const cards = container.querySelectorAll('[data-work-card]')
    const state = Flip.getState(cards)

    flushSync(() => setActiveFilter(filter))

    Flip.from(state, {
      duration: 0.6,
      ease: 'power2.inOut',
      stagger: 0.04,
      absolute: true,
      scale: true,
      onEnter: (elements) => {
        return gsap.fromTo(elements,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.4, delay: 0.1 }
        )
      },
      onLeave: (elements) => {
        return gsap.to(elements,
          { opacity: 0, scale: 0.9, duration: 0.3 }
        )
      },
    })
  }, [viewMode])

  // ── View change with crossfade ──
  const handleViewChange = useCallback((mode: ViewMode) => {
    const container = viewContainerRef.current
    if (!container) { setViewMode(mode); return }

    gsap.to(container, {
      opacity: 0, y: 8,
      duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        flushSync(() => setViewMode(mode))
        gsap.fromTo(container,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        )
      },
    })
  }, [])

  // ── Page entrance ──
  useGSAP(() => {
    const page = pageRef.current
    if (!page) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const heading = page.querySelector('[data-work-heading]')
    const label = page.querySelector('[data-work-label]')
    const divider = page.querySelector('#work-divider-line')
    const controls = page.querySelector('[data-work-controls]')
    const count = page.querySelector('[data-work-count]')

    if (label) gsap.set(label, { opacity: 0, yPercent: 8 })
    if (heading) gsap.set(heading, { opacity: 0 })
    if (controls) gsap.set(controls, { opacity: 0, yPercent: 5 })
    if (count) gsap.set(count, { opacity: 0 })

    const tl = gsap.timeline({ delay: 0.3 })

    if (label) {
      tl.to(label, {
        opacity: 1, yPercent: 0,
        duration: reduced ? 0.01 : 0.4,
        ease: 'power3.out',
      }, 0)
    }

    if (heading && !reduced) {
      gsap.set(heading, { opacity: 1 })
      const split = SplitText.create(heading, {
        type: 'words', mask: 'words',
      })
      tl.from(split.words, {
        yPercent: 100,
        duration: 0.7, stagger: 0.08,
        ease: 'power3.out',
        onComplete: () => split.revert(),
      }, 0.1)
    } else if (heading) {
      tl.to(heading, { opacity: 1, duration: 0.01 }, 0)
    }

    if (divider && !reduced) {
      gsap.set(divider, { drawSVG: '0% 0%' })
      tl.to(divider, {
        drawSVG: '0% 100%',
        duration: 0.8,
        ease: 'power2.inOut',
      }, 0.3)
    }

    if (controls) {
      tl.to(controls, {
        opacity: 1, yPercent: 0,
        duration: reduced ? 0.01 : 0.5,
        ease: 'power3.out',
      }, 0.4)
    }

    if (count) {
      tl.to(count, {
        opacity: 1,
        duration: reduced ? 0.01 : 0.4,
        ease: 'power2.out',
      }, 0.5)
    }
  }, { scope: pageRef })

  return (
    <div ref={pageRef}>
      <main
        className="min-h-dvh px-8 md:px-16 lg:px-24 pt-24 md:pt-32 pb-16"
        data-transition-in="fade"
      >
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <p
            data-work-label
            className="font-body text-[10px] uppercase tracking-[0.25em]
                       text-white/20 mb-4"
          >
            Portfolio
          </p>
          <h1
            data-work-heading
            className="font-display text-5xl sm:text-6xl md:text-7xl
                       lg:text-8xl font-bold text-white leading-[1.0]"
          >
            Our Work
          </h1>
          <p
            data-work-count
            className="font-body text-[11px] text-white/20
                       tabular-nums mt-3"
          >
            {filteredProjects.length} project
            {filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Divider */}
        <div className="mb-8 md:mb-10">
          <svg width="100%" height="1" viewBox="0 0 1000 1"
               preserveAspectRatio="none">
            <line
              id="work-divider-line"
              x1="0" y1="0.5" x2="1000" y2="0.5"
              stroke="white" strokeWidth="1" opacity="0.1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Controls */}
        <div
          data-work-controls
          className="flex flex-col sm:flex-row sm:items-center
                     sm:justify-between gap-4 mb-10 md:mb-14"
        >
          {showFilters && (
            <FilterBar
              categories={categories}
              active={activeFilter}
              onChange={handleFilterChange}
            />
          )}
          {!showFilters && <div />}
          <ViewToggle
            current={viewMode}
            onChange={handleViewChange}
          />
        </div>

        {/* Views */}
        <div ref={viewContainerRef} className={`min-h-[50vh] ${viewMode === 'featured' ? '' : 'overflow-hidden'}`}>
          {viewMode === 'grid' && (
            <WorkGrid projects={filteredProjects} />
          )}
          {viewMode === 'carousel' && (
            <WorkCarousel projects={filteredProjects} />
          )}
          {viewMode === 'list' && (
            <WorkList projects={filteredProjects} />
          )}
          {viewMode === 'featured' && (
            <WorkFeatured projects={filteredProjects} />
          )}

          {filteredProjects.length === 0 && (
            <div className="flex items-center justify-center py-32">
              <p className="font-body text-sm text-white/30">
                No projects in this category yet.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
