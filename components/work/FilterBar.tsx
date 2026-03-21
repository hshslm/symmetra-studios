'use client'
import { useRef, useCallback } from 'react'
import type { categories } from '@/lib/projects-data'

interface FilterBarProps {
  categories: typeof categories
  active: string
  onChange: (filter: string) => void
}

export default function FilterBar({
  categories: cats,
  active,
  onChange,
}: FilterBarProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const items = cats
      let next = index

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        next = (index + 1) % items.length
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        next = (index - 1 + items.length) % items.length
      } else {
        return
      }

      const buttons = containerRef.current?.querySelectorAll('button')
      if (buttons?.[next]) {
        ;(buttons[next] as HTMLButtonElement).focus()
        onChange(items[next].value)
      }
    },
    [cats, onChange]
  )

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter projects by category"
    >
      {cats.map((cat, i) => (
        <button
          key={cat.value}
          role="tab"
          aria-selected={active === cat.value}
          tabIndex={active === cat.value ? 0 : -1}
          onClick={() => onChange(cat.value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className={`font-body text-[11px] uppercase tracking-[0.12em]
                      px-4 py-2 rounded-full border transition-all duration-300
                      focus-visible:outline focus-visible:outline-2
                      focus-visible:outline-white/40 outline-offset-2
                      ${active === cat.value
                        ? 'border-white/40 text-white bg-white/[0.06]'
                        : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'
                      }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
