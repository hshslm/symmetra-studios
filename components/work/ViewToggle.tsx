'use client'
import { useRef, useCallback } from 'react'
import type { ViewMode } from '@/lib/projects-data'

interface ViewToggleProps {
  current: ViewMode
  onChange: (mode: ViewMode) => void
}

const modes: { value: ViewMode; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'list', label: 'List' },
  { value: 'featured', label: 'Featured' },
]

export default function ViewToggle({
  current,
  onChange,
}: ViewToggleProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let next = index
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next = (index + 1) % modes.length
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        next = (index - 1 + modes.length) % modes.length
      } else return

      const buttons = containerRef.current?.querySelectorAll('button')
      if (buttons?.[next]) {
        ;(buttons[next] as HTMLButtonElement).focus()
        onChange(modes[next].value)
      }
    },
    [onChange]
  )

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1 bg-white/[0.03]
                 rounded-full p-1 border border-white/[0.06]"
      role="tablist"
      aria-label="View mode"
    >
      {modes.map((mode, i) => (
        <button
          key={mode.value}
          role="tab"
          aria-selected={current === mode.value}
          tabIndex={current === mode.value ? 0 : -1}
          onClick={() => onChange(mode.value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className={`font-body text-[11px] uppercase tracking-[0.1em]
                      px-4 py-1.5 rounded-full transition-all duration-300
                      focus-visible:outline focus-visible:outline-2
                      focus-visible:outline-white/40 outline-offset-1
                      ${current === mode.value
                        ? 'text-white bg-white/[0.08]'
                        : 'text-white/35 hover:text-white/60'
                      }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}
