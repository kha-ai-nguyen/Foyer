'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import MasonryTile from '@/components/MasonryTile'
import FeaturedCarousel from '@/components/FeaturedCarousel'
import ResultsToolbar, { type SortKey } from './ResultsToolbar'
import type { MasonrySpace } from './mockSpaces'
import type { BookerEvent } from '@/types'

function sortSpaces(spaces: MasonrySpace[], key: SortKey): MasonrySpace[] {
  return [...spaces].sort((a, b) => {
    if (key === 'distance') return a.distance_km - b.distance_km
    if (key === 'price_asc') return a.total_price - b.total_price
    if (key === 'price_desc') return b.total_price - a.total_price
    return a.venue.name.localeCompare(b.venue.name)
  })
}

interface Props {
  spaces: MasonrySpace[]
  event: BookerEvent
  dateFrom: string | null
  dateTo: string | null
}

export default function ResultsGrid({ spaces, event, dateFrom, dateTo }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [sort, setSort] = useState<SortKey>('distance')
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom ?? event.date_from ?? '')
  const [localDateTo, setLocalDateTo] = useState(dateTo ?? event.date_to ?? '')
  const [, startTransition] = useTransition()

  const sorted = sortSpaces(spaces, sort)
  const available = sorted.filter((s) => s.available)
  const unavailable = sorted.filter((s) => !s.available)

  // Featured spaces for the top carousel (pick available featured/large tiles)
  const featured = available.filter((s) => s.tileSize === 'featured').slice(0, 5)

  // Masonry grid spaces: all available (minus featured shown in carousel) + unavailable at end
  const masonryAvailable = available.filter((s) => !featured.includes(s))
  const masonrySpaces = [...masonryAvailable, ...unavailable]

  function applyDates() {
    const params = new URLSearchParams()
    if (localDateFrom) params.set('dateFrom', localDateFrom)
    if (localDateTo) params.set('dateTo', localDateTo)
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  return (
    <div>
      <ResultsToolbar
        event={event}
        sort={sort}
        onSortChange={setSort}
        dateFrom={localDateFrom}
        dateTo={localDateTo}
        onDateFromChange={setLocalDateFrom}
        onDateToChange={setLocalDateTo}
        onApplyDates={applyDates}
        totalCount={spaces.length}
        availableCount={available.length}
        unavailableCount={unavailable.length}
      />

      {/* Featured carousel */}
      {featured.length > 0 && (
        <FeaturedCarousel spaces={featured} eventId={event.id} />
      )}

      {/* No results */}
      {spaces.length === 0 && (
        <div className="text-center py-24 border-2 border-dark border-dashed rounded-2xl">
          <p className="font-display font-bold text-2xl uppercase text-dark mb-3">
            No spaces match your criteria
          </p>
          <p className="text-text-muted text-sm mb-6">
            Try expanding your radius or changing your dates.
          </p>
          <a
            href={`/events/${event.id}`}
            className="inline-block bg-primary border-2 border-dark text-dark font-bold uppercase text-sm px-6 py-3 rounded-xl hover:bg-dark hover:text-primary transition-colors"
          >
            ← Back to event
          </a>
        </div>
      )}

      {/* Masonry grid */}
      {masonrySpaces.length > 0 && (
        <div
          className="gap-4"
          style={{
            columns: 1,
            columnGap: '1rem',
          }}
        >
          {/* Responsive columns via CSS */}
          <style>{`
            @media (min-width: 640px) {
              .masonry-grid { columns: 2 !important; }
            }
            @media (min-width: 1024px) {
              .masonry-grid { columns: 3 !important; }
            }
          `}</style>
          <div className="masonry-grid" style={{ columns: 1, columnGap: '1rem' }}>
            {masonrySpaces.map((space, i) => (
              <MasonryTile
                key={space.id}
                space={space}
                eventId={event.id}
                index={i}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
