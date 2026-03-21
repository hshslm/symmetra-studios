'use client'
import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import type { Project } from '@/lib/projects-data'
import WorkListItem from './WorkListItem'

interface WorkListProps {
  projects: Project[]
}

export default function WorkList({ projects }: WorkListProps): React.ReactElement {
  const listRef = useRef<HTMLDivElement>(null)
  const triggersRef = useRef<ScrollTrigger[]>([])

  useEffect(() => {
    if (!listRef.current) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const items = listRef.current.querySelectorAll('[data-work-list-item]')

    if (reduced) {
      gsap.set(items, { opacity: 1, x: 0 })
      listRef.current.classList.add('spotlight-ready')
      return
    }

    // Entrance: slide from LEFT (unique to list view)
    gsap.set(items, { opacity: 0, x: -20 })

    const batchTriggers = ScrollTrigger.batch(items, {
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1, x: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
          onComplete: () => {
            listRef.current?.classList.add('spotlight-ready')
          },
        })
      },
      start: 'top 90%',
      once: true,
    })

    if (Array.isArray(batchTriggers)) {
      triggersRef.current = batchTriggers
    }

    return () => {
      triggersRef.current.forEach(st => st.kill())
      triggersRef.current = []
    }
  }, [projects])

  return (
    <div ref={listRef} className="work-list">
      {projects.map((project, i) => (
        <WorkListItem
          key={project.id}
          project={project}
          index={i}
        />
      ))}

      {/* Bottom divider */}
      <svg width="100%" height="1" viewBox="0 0 1000 1"
           preserveAspectRatio="none">
        <line x1="0" y1="0.5" x2="1000" y2="0.5"
              stroke="white" strokeWidth="1" opacity="0.06"
              vectorEffect="non-scaling-stroke"/>
      </svg>
    </div>
  )
}
