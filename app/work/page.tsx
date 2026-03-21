import { Suspense } from 'react'
import { Metadata } from 'next'
import WorkPageClient from '@/components/work/WorkPageClient'

export const metadata: Metadata = {
  title: 'Work - Symmetra Studios',
  description: 'Our portfolio of music videos, brand films, commercials, and social content.',
}

export default function WorkPage(): React.ReactElement {
  return (
    <Suspense fallback={null}>
      <WorkPageClient />
    </Suspense>
  )
}
