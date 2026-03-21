'use client'
import type { Project } from '@/lib/projects-data'
import Link from 'next/link'

interface WorkListItemProps {
  project: Project
  index: number
}

export default function WorkListItem({
  project,
}: WorkListItemProps): React.ReactElement {
  const indexLabel = String(project.index).padStart(2, '0')

  return (
    <Link
      href={`/work/${project.slug}`}
      className="work-list-item group/list block relative"
      data-cursor="view"
      data-work-list-item
    >
      {/* Divider */}
      <div>
        <svg width="100%" height="1" viewBox="0 0 1000 1"
             preserveAspectRatio="none">
          <line x1="0" y1="0.5" x2="1000" y2="0.5"
                stroke="white" strokeWidth="1" opacity="0.06"
                vectorEffect="non-scaling-stroke"/>
        </svg>
      </div>

      {/* Row */}
      <div className="flex items-center gap-4 md:gap-6 py-4 md:py-5">

        {/* Video thumbnail */}
        <div className="w-[120px] md:w-[160px] aspect-video shrink-0
                        overflow-hidden rounded-sm">
          <video
            src={project.videoSrc}
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover
                       transition-all duration-500
                       grayscale group-hover/list:grayscale-0
                       brightness-75 group-hover/list:brightness-100"
          />
        </div>

        {/* Info */}
        <div className="flex items-center justify-between flex-1 min-w-0">
          <div className="flex items-baseline gap-4 md:gap-8 min-w-0">
            {/* Number */}
            <span className="font-display text-sm text-white/15
                             w-8 shrink-0 hidden md:block">
              {indexLabel}
            </span>

            {/* Year */}
            <span className="font-body text-[11px] uppercase tracking-[0.15em]
                             text-white/25 w-14 shrink-0 hidden lg:block">
              {project.year}
            </span>

            {/* Client */}
            <span className="font-body text-[11px] uppercase tracking-[0.15em]
                             text-white/35 w-32 shrink-0 hidden md:block">
              {project.client}
            </span>

            {/* Title */}
            <h3 className="font-display text-xl md:text-2xl lg:text-3xl
                           font-bold text-white leading-[1.1]
                           transition-transform duration-500
                           group-hover/list:translate-x-2 truncate">
              {project.title}
            </h3>
          </div>

          {/* Category */}
          <span className="font-body text-[10px] uppercase tracking-[0.15em]
                           text-white/20 hidden sm:block shrink-0 ml-4">
            {project.categoryLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}
