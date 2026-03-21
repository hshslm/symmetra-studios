'use client'
import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import type { Project } from '@/lib/projects-data'
import WorkCard from './WorkCard'

interface WorkGridProps {
  projects: Project[]
}

export default function WorkGrid({ projects }: WorkGridProps): React.ReactElement {
  const gridRef = useRef<HTMLDivElement>(null)
  const triggersRef = useRef<ScrollTrigger[]>([])

  useEffect(() => {
    if (!gridRef.current) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const cards = gridRef.current.querySelectorAll('[data-work-card]')
    const parallaxImages = gridRef.current.querySelectorAll(
      '[data-parallax-image]'
    )

    if (reduced) {
      gsap.set(cards, { opacity: 1 })
      gridRef.current.classList.add('spotlight-ready')
      return
    }

    // Only animate cards that haven't been revealed yet
    const newCards = gridRef.current.querySelectorAll('[data-work-card]:not([data-revealed])')

    if (newCards.length) {
      gsap.set(newCards, {
        clipPath: 'inset(100% 0% 0% 0%)',
        y: 30,
        opacity: 1,
      })

      const revealTriggers = ScrollTrigger.batch(newCards, {
        onEnter: (batch) => {
          gsap.to(batch, {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            onComplete: () => {
              gridRef.current?.classList.add('spotlight-ready')
              gsap.set(batch, { clearProps: 'clipPath' })
              batch.forEach((el: Element) => el.setAttribute('data-revealed', ''))
            },
          })
        },
        start: 'top 88%',
        once: true,
      })

      if (Array.isArray(revealTriggers)) {
        triggersRef.current.push(...revealTriggers)
      }
    }

    // ── INNER SCROLL PARALLAX ──
    parallaxImages.forEach((img) => {
      const st = ScrollTrigger.create({
        trigger: img.closest('[data-work-card]')!,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          const yPercent = (self.progress - 0.5) * 16
          gsap.set(img, { yPercent })
        },
      })
      triggersRef.current.push(st)
    })

    return () => {
      triggersRef.current.forEach(st => st.kill())
      triggersRef.current = []
    }
  }, [projects])

  return (
    <div
      ref={gridRef}
      className="work-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                 gap-5 md:gap-6"
    >
      {projects.map((project, i) => {
        const isHero = i === 0
        const isHeroSibling = i === 1 && projects.length > 1

        return (
          <div
            key={project.id}
            className={isHero ? 'sm:col-span-2' : ''}
          >
            <WorkCard
              project={project}
              index={i}
              isHero={isHero}
              fillHeight={isHeroSibling}
            />
          </div>
        )
      })}
    </div>
  )
}
